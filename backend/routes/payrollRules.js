import express from 'express';
import db from '../config/database.js';
import { authMiddleware, roleMiddleware } from '../middleware/auth.js';
import logger from '../config/logger.js';

const router = express.Router();

// ── GET all active rules (Admin only) ─────────────────────────────────────────
router.get('/', authMiddleware, roleMiddleware('ADMIN'), (req, res, next) => {
    try {
        const rules = db.prepare('SELECT * FROM payroll_rules ORDER BY type, id').all();
        res.json({ success: true, rules });
    } catch (error) {
        next(error);
    }
});

// ── POST add a new rule (Admin only) ──────────────────────────────────────────
router.post('/', authMiddleware, roleMiddleware('ADMIN'), (req, res, next) => {
    try {
        const { name, type, calculation, value } = req.body;

        if (!name || !type || !calculation || value === undefined) {
            return res.status(400).json({ success: false, error: 'name, type, calculation, and value are required' });
        }
        if (!['ALLOWANCE', 'DEDUCTION'].includes(type)) {
            return res.status(400).json({ success: false, error: 'type must be ALLOWANCE or DEDUCTION' });
        }
        if (!['PERCENTAGE', 'FIXED'].includes(calculation)) {
            return res.status(400).json({ success: false, error: 'calculation must be PERCENTAGE or FIXED' });
        }
        if (isNaN(value) || value <= 0) {
            return res.status(400).json({ success: false, error: 'value must be a positive number' });
        }

        const result = db.prepare(
            'INSERT INTO payroll_rules (name, type, calculation, value) VALUES (?, ?, ?, ?)'
        ).run(name, type, calculation, parseFloat(value));

        logger.info(`Payroll rule added: "${name}" (${type}, ${calculation}, ${value}) by user ${req.user.username}`);
        res.status(201).json({ success: true, message: 'Rule added successfully', ruleId: result.lastInsertRowid });
    } catch (error) {
        next(error);
    }
});

// ── PATCH toggle rule active/inactive (Admin only) ────────────────────────────
router.patch('/:id/toggle', authMiddleware, roleMiddleware('ADMIN'), (req, res, next) => {
    try {
        const rule = db.prepare('SELECT * FROM payroll_rules WHERE id = ?').get(req.params.id);
        if (!rule) return res.status(404).json({ success: false, error: 'Rule not found' });

        const newStatus = rule.is_active ? 0 : 1;
        db.prepare('UPDATE payroll_rules SET is_active = ? WHERE id = ?').run(newStatus, req.params.id);

        logger.info(`Payroll rule "${rule.name}" toggled to ${newStatus ? 'active' : 'inactive'} by ${req.user.username}`);
        res.json({ success: true, message: `Rule ${newStatus ? 'activated' : 'deactivated'}` });
    } catch (error) {
        next(error);
    }
});

// ── DELETE remove a rule (Admin only) ─────────────────────────────────────────
router.delete('/:id', authMiddleware, roleMiddleware('ADMIN'), (req, res, next) => {
    try {
        const rule = db.prepare('SELECT * FROM payroll_rules WHERE id = ?').get(req.params.id);
        if (!rule) return res.status(404).json({ success: false, error: 'Rule not found' });

        db.prepare('DELETE FROM payroll_rules WHERE id = ?').run(req.params.id);
        logger.info(`Payroll rule "${rule.name}" deleted by ${req.user.username}`);
        res.json({ success: true, message: 'Rule deleted successfully' });
    } catch (error) {
        next(error);
    }
});

export default router;
