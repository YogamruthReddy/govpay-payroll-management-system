import express from 'express';
import { Leave } from '../models/index.js';
import { authMiddleware, roleMiddleware } from '../middleware/auth.js';
import db from '../config/database.js';
import logger from '../config/logger.js';

const router = express.Router();

// ── Overlap detection helper ───────────────────────────────────────────────────
const hasLeaveOverlap = (employeeId, startDate, endDate, excludeId = null) => {
    let query = `
        SELECT id FROM leaves
        WHERE employee_id = ?
          AND status != 'rejected'
          AND (
            (start_date <= ? AND end_date >= ?)
            OR (start_date <= ? AND end_date >= ?)
            OR (start_date >= ? AND end_date <= ?)
          )
    `;
    const params = [employeeId, endDate, startDate, startDate, startDate, startDate, endDate];

    if (excludeId) {
        query += ' AND id != ?';
        params.push(excludeId);
    }

    const conflict = db.prepare(query).get(...params);
    return !!conflict;
};

// ── Get all pending leaves (Officer/Admin) ────────────────────────────────────
router.get('/pending', authMiddleware, roleMiddleware('ADMIN', 'OFFICER'), (req, res, next) => {
    try {
        const leaves = Leave.findPending();
        res.json({ success: true, leaves });
    } catch (error) {
        next(error);
    }
});

// ── Get all leaves (Officer/Admin) ────────────────────────────────────────────
router.get('/all', authMiddleware, roleMiddleware('ADMIN', 'OFFICER'), (req, res, next) => {
    try {
        const leaves = db.prepare(`
            SELECT l.*, e.name as employee_name, e.department
            FROM leaves l
            JOIN employees e ON l.employee_id = e.id
            ORDER BY l.applied_at DESC
        `).all();
        res.json({ success: true, leaves });
    } catch (error) {
        next(error);
    }
});

// ── Get leaves by employee ID ─────────────────────────────────────────────────
router.get('/employee/:employeeId', authMiddleware, (req, res, next) => {
    try {
        if (req.user.role === 'EMPLOYEE' && req.user.employeeId != req.params.employeeId) {
            return res.status(403).json({ success: false, error: 'Forbidden' });
        }
        const leaves = Leave.findByEmployee(req.params.employeeId);
        res.json({ success: true, leaves });
    } catch (error) {
        next(error);
    }
});

// ── Apply for leave ────────────────────────────────────────────────────────────
router.post('/', authMiddleware, (req, res, next) => {
    try {
        const { employeeId, leaveType, startDate, endDate, days, reason } = req.body;

        if (req.user.role === 'EMPLOYEE' && req.user.employeeId != employeeId) {
            return res.status(403).json({ success: false, error: 'Forbidden' });
        }

        // ── Leave overlap validation ───────────────────────────────────────────
        if (hasLeaveOverlap(employeeId, startDate, endDate)) {
            logger.warn(`Leave overlap detected for employee ${employeeId}: ${startDate} → ${endDate}`);
            return res.status(409).json({
                success: false,
                error: 'Leave conflict: You already have a leave application (pending or approved) overlapping these dates.'
            });
        }

        // ── Date logic validation ──────────────────────────────────────────────
        if (new Date(startDate) > new Date(endDate)) {
            return res.status(400).json({ success: false, error: 'Start date must be before end date' });
        }

        const result = Leave.create(employeeId, leaveType, startDate, endDate, days, reason);
        logger.info(`Leave applied: employee ${employeeId}, type: ${leaveType}, ${startDate} → ${endDate}`);

        res.status(201).json({
            success: true,
            message: 'Leave application submitted successfully',
            leaveId: result.lastInsertRowid
        });
    } catch (error) {
        next(error);
    }
});

// ── Approve / Reject leave (Officer/Admin) ────────────────────────────────────
router.put('/:id/status', authMiddleware, roleMiddleware('ADMIN', 'OFFICER'), (req, res, next) => {
    try {
        const { status } = req.body;

        if (!['approved', 'rejected'].includes(status)) {
            return res.status(400).json({ success: false, error: 'Invalid status' });
        }

        const result = Leave.updateStatus(req.params.id, status, req.user.id);

        if (result.changes === 0) {
            return res.status(404).json({ success: false, error: 'Leave application not found' });
        }

        logger.info(`Leave #${req.params.id} ${status} by user ${req.user.username}`);
        res.json({ success: true, message: `Leave ${status} successfully` });
    } catch (error) {
        next(error);
    }
});

export default router;
