import express from 'express';
import { Payroll, Employee, Leave } from '../models/index.js';
import { authMiddleware, roleMiddleware } from '../middleware/auth.js';
import { calculateSalary } from '../services/payrollService.js';
import { generatePayslipPDF } from '../services/pdfService.js';
import db from '../config/database.js';
import logger from '../config/logger.js';

const router = express.Router();

// ── Get all payroll records (Admin/Officer) ───────────────────────────────────
router.get('/', authMiddleware, roleMiddleware('ADMIN', 'OFFICER'), (req, res, next) => {
    try {
        const payrolls = Payroll.findAll();
        res.json({ success: true, payrolls });
    } catch (error) {
        next(error);
    }
});

// ── Get payroll by employee ID ─────────────────────────────────────────────────
router.get('/employee/:employeeId', authMiddleware, (req, res, next) => {
    try {
        if (req.user.role === 'EMPLOYEE' && req.user.employeeId != req.params.employeeId) {
            return res.status(403).json({ success: false, error: 'Forbidden' });
        }
        const payrolls = Payroll.findByEmployee(req.params.employeeId);
        res.json({ success: true, payrolls });
    } catch (error) {
        next(error);
    }
});

// ── Get specific payroll record ────────────────────────────────────────────────
router.get('/:id', authMiddleware, (req, res, next) => {
    try {
        const payroll = Payroll.findById(req.params.id);
        if (!payroll) {
            return res.status(404).json({ success: false, error: 'Payroll record not found' });
        }
        if (req.user.role === 'EMPLOYEE' && req.user.employeeId != payroll.employee_id) {
            return res.status(403).json({ success: false, error: 'Forbidden' });
        }
        res.json({ success: true, payroll });
    } catch (error) {
        next(error);
    }
});

// ── Generate payroll (Officer/Admin) ──────────────────────────────────────────
router.post('/', authMiddleware, roleMiddleware('ADMIN', 'OFFICER'), (req, res, next) => {
    try {
        const { employeeId, month, year } = req.body;

        if (!employeeId || !month || !year) {
            return res.status(400).json({ success: false, error: 'employeeId, month, and year are required' });
        }

        // Check for duplicate payroll
        const existing = db.prepare(
            'SELECT id FROM payroll WHERE employee_id = ? AND month = ? AND year = ?'
        ).get(employeeId, month, year);
        if (existing) {
            return res.status(409).json({
                success: false,
                error: `Payroll already generated for employee #${employeeId} — ${month}/${year}`
            });
        }

        const employee = Employee.findById(employeeId);
        if (!employee) {
            return res.status(404).json({ success: false, error: 'Employee not found' });
        }

        // Count approved leave days for this month
        const leaves = Leave.findByEmployee(employeeId).filter(l => l.status === 'approved');
        const leavesTaken = leaves.reduce((acc, l) => {
            const startStr = l.start_date;
            if (startStr.startsWith(`${year}-${String(month).padStart(2, '0')}`)) {
                return acc + l.days;
            }
            return acc;
        }, 0);

        // Dynamic rule engine
        const salaryInfo = calculateSalary(employee, leavesTaken);

        // Persist with anomaly flag
        const result = db.prepare(`
            INSERT INTO payroll (employee_id, month, year, basic_pay, hra, deductions, net_pay, is_anomaly)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `).run(
            employeeId, month, year,
            salaryInfo.basicPay, salaryInfo.hra,
            salaryInfo.deductions, salaryInfo.netPay,
            salaryInfo.isAnomaly ? 1 : 0
        );

        if (salaryInfo.isAnomaly) {
            logger.warn(`⚠ Salary anomaly detected: Employee #${employeeId} net pay ₹${salaryInfo.netPay} exceeds 1.5× dept average`);
        }

        logger.info(`Payroll generated: Employee #${employeeId}, Month ${month}/${year}, Net ₹${salaryInfo.netPay}`);

        res.status(201).json({
            success: true,
            message: 'Payroll generated successfully',
            payrollId: result.lastInsertRowid,
            netPay:    salaryInfo.netPay,
            isAnomaly: salaryInfo.isAnomaly,
            breakdown: salaryInfo
        });
    } catch (error) {
        next(error);
    }
});

// ── Mark payroll as paid (Admin only) ─────────────────────────────────────────
router.patch('/:id/mark-paid', authMiddleware, roleMiddleware('ADMIN'), (req, res, next) => {
    try {
        const result = db.prepare("UPDATE payroll SET status = 'paid' WHERE id = ?").run(req.params.id);
        if (result.changes === 0) {
            return res.status(404).json({ success: false, error: 'Payroll record not found' });
        }
        logger.info(`Payroll #${req.params.id} marked as paid by ${req.user.username}`);
        res.json({ success: true, message: 'Payroll marked as paid' });
    } catch (error) {
        next(error);
    }
});

// ── PDF Payslip ────────────────────────────────────────────────────────────────
router.get('/payslip/:id', authMiddleware, async (req, res, next) => {
    try {
        const payrollData = Payroll.findById(req.params.id);
        if (!payrollData) {
            return res.status(404).send('Payslip not found');
        }
        if (req.user.role === 'EMPLOYEE' && req.user.employeeId != payrollData.employee_id) {
            return res.status(403).send('Forbidden');
        }

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=payslip-${payrollData.month}-${payrollData.year}.pdf`);
        await generatePayslipPDF(payrollData, res);
    } catch (error) {
        next(error);
    }
});

export default router;
