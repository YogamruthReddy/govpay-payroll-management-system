import express from 'express';
import { Payroll, Employee, Leave } from '../models/index.js';
import { authMiddleware, roleMiddleware } from '../middleware/auth.js';
import { calculateSalary } from '../services/payrollService.js';
import { generatePayslipPDF } from '../services/pdfService.js';

const router = express.Router();

// Get all payroll records (Admin/Officer only)
router.get('/', authMiddleware, roleMiddleware('ADMIN', 'OFFICER'), (req, res) => {
    try {
        const payrolls = Payroll.findAll();
        res.json(payrolls);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get payroll by employee ID
router.get('/employee/:employeeId', authMiddleware, (req, res) => {
    try {
        // Check if user is accessing their own payroll or is admin/officer
        if (req.user.role === 'EMPLOYEE' && req.user.employeeId != req.params.employeeId) {
            return res.status(403).json({ error: 'Forbidden' });
        }

        const payrolls = Payroll.findByEmployee(req.params.employeeId);
        res.json(payrolls);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get specific payroll record
router.get('/:id', authMiddleware, (req, res) => {
    try {
        const payroll = Payroll.findById(req.params.id);
        if (!payroll) {
            return res.status(404).json({ error: 'Payroll record not found' });
        }

        // Check permissions
        if (req.user.role === 'EMPLOYEE' && req.user.employeeId != payroll.employee_id) {
            return res.status(403).json({ error: 'Forbidden' });
        }

        res.json(payroll);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Generate payroll (Officer/Admin only)
router.post('/', authMiddleware, roleMiddleware('ADMIN', 'OFFICER'), (req, res) => {
    try {
        const { employeeId, month, year } = req.body;

        // Fetch employee to get basic salary dynamically
        const employee = Employee.findById(employeeId);
        if (!employee) {
            return res.status(404).json({ error: 'Employee not found' });
        }

        // Count approved leaves in the given month/year
        // In this implementation, we grab all approved leaves and sum their overlapping days for the month.
        // For simplicity, we just take leaves that were approved and are relatively recent.
        const leaves = Leave.findByEmployee(employeeId).filter(l => l.status === 'approved');
        // A minimal logic for "leaves taken in this month":
        const leavesTaken = leaves.reduce((acc, l) => {
            const startStr = l.start_date; // assuming ISO or YYYY-MM-DD
            if (startStr.startsWith(`${year}-${String(month).padStart(2, '0')}`)) {
                return acc + l.days;
            }
            return acc;
        }, 0);

        // Dynamic Engine Calculation
        const salaryInfo = calculateSalary(employee, leavesTaken);

        const result = Payroll.create(
            employeeId,
            month,
            year,
            salaryInfo.basicPay,
            salaryInfo.hra,
            salaryInfo.deductions,
            salaryInfo.netPay
        );

        res.status(201).json({
            message: 'Payroll generated successfully',
            payrollId: result.lastInsertRowid,
            netPay: salaryInfo.netPay,
            breakdown: salaryInfo
        });
    } catch (error) {
        if (error.message.includes('UNIQUE constraint failed')) {
            return res.status(400).json({ error: 'Payroll already exists for this month/year' });
        }
        res.status(500).json({ error: error.message });
    }
});

// PDF Payslip Route
router.get('/payslip/:id', authMiddleware, async (req, res) => {
    try {
        const payrollData = Payroll.findById(req.params.id);
        
        if (!payrollData) {
            return res.status(404).send('Payslip not found');
        }

        // Check permissions
        if (req.user.role === 'EMPLOYEE' && req.user.employeeId != payrollData.employee_id) {
            return res.status(403).send('Forbidden');
        }

        // We format the response headers for PDF download
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=payslip-${payrollData.month}-${payrollData.year}.pdf`);

        await generatePayslipPDF(payrollData, res);

    } catch (error) {
        res.status(500).send('Error generating PDF');
    }
});

export default router;
