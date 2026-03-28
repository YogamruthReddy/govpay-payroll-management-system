import express from 'express';
import { Leave } from '../models/index.js';
import { authMiddleware, roleMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Get all pending leaves (Officer/Admin only)
router.get('/pending', authMiddleware, roleMiddleware('ADMIN', 'OFFICER'), (req, res) => {
    try {
        const leaves = Leave.findPending();
        res.json(leaves);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get leaves by employee ID
router.get('/employee/:employeeId', authMiddleware, (req, res) => {
    try {
        // Check if user is accessing their own leaves or is admin/officer
        if (req.user.role === 'EMPLOYEE' && req.user.employeeId != req.params.employeeId) {
            return res.status(403).json({ error: 'Forbidden' });
        }

        const leaves = Leave.findByEmployee(req.params.employeeId);
        res.json(leaves);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Apply for leave
router.post('/', authMiddleware, (req, res) => {
    try {
        const { employeeId, leaveType, startDate, endDate, days, reason } = req.body;

        // Employees can only apply for their own leaves
        if (req.user.role === 'EMPLOYEE' && req.user.employeeId != employeeId) {
            return res.status(403).json({ error: 'Forbidden' });
        }

        const result = Leave.create(employeeId, leaveType, startDate, endDate, days, reason);

        res.status(201).json({
            message: 'Leave application submitted successfully',
            leaveId: result.lastInsertRowid
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Approve/Reject leave (Officer/Admin only)
router.put('/:id/status', authMiddleware, roleMiddleware('ADMIN', 'OFFICER'), (req, res) => {
    try {
        const { status } = req.body; // 'approved' or 'rejected'

        if (!['approved', 'rejected'].includes(status)) {
            return res.status(400).json({ error: 'Invalid status' });
        }

        const result = Leave.updateStatus(req.params.id, status, req.user.id);

        if (result.changes === 0) {
            return res.status(404).json({ error: 'Leave application not found' });
        }

        res.json({ message: `Leave ${status} successfully` });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
