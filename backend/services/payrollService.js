import db from '../config/database.js';

/**
 * Dynamic Payroll Rule Engine
 *
 * Reads active rules from the `payroll_rules` table and applies them
 * to the employee's basic salary. Supports both PERCENTAGE and FIXED rules.
 *
 * Edge cases handled:
 *  - Net salary cannot go below 0 (clamped)
 *  - Anomaly flag set if net pay > 1.5× department average
 */

// Load active rules from DB
const getActiveRules = () => {
    return db.prepare(`SELECT * FROM payroll_rules WHERE is_active = 1 ORDER BY type, id`).all();
};

// Get department average net pay (for anomaly detection)
const getDeptAvgNetPay = (department) => {
    const row = db.prepare(`
        SELECT AVG(p.net_pay) as avg_pay
        FROM payroll p
        JOIN employees e ON p.employee_id = e.id
        WHERE e.department = ?
        AND p.generated_at >= datetime('now', '-3 months')
    `).get(department);
    return row?.avg_pay || 0;
};

export const calculateSalary = (employee, leavesTaken) => {
    const basic = employee.basic_salary || 0;
    const rules = getActiveRules();

    let totalAllowances = 0;
    let totalDeductions = 0;
    const breakdown = { allowances: [], deductions: [] };

    // Apply each rule dynamically
    rules.forEach(rule => {
        const amount = rule.calculation === 'PERCENTAGE'
            ? (basic * rule.value) / 100
            : rule.value;

        if (rule.type === 'ALLOWANCE') {
            totalAllowances += amount;
            breakdown.allowances.push({ name: rule.name, amount: Math.round(amount) });
        } else {
            totalDeductions += amount;
            breakdown.deductions.push({ name: rule.name, amount: Math.round(amount) });
        }
    });

    // Leave deduction: (basic / 30) × leaveDays
    const leaveDeduction = leavesTaken > 0 ? (basic / 30) * leavesTaken : 0;
    if (leaveDeduction > 0) {
        totalDeductions += leaveDeduction;
        breakdown.deductions.push({ name: 'Leave Deduction', amount: Math.round(leaveDeduction) });
    }

    const gross  = basic + totalAllowances;
    let netPay   = gross - totalDeductions;

    // Edge case: net salary cannot be negative
    if (netPay < 0) {
        netPay = 0;
    }

    // Anomaly detection: flag if net > 1.5× dept average
    const deptAvg = getDeptAvgNetPay(employee.department);
    const isAnomaly = deptAvg > 0 && netPay > deptAvg * 1.5;

    // Legacy field names kept for backward compat with routes
    const hraRule    = breakdown.allowances.find(a => a.name === 'HRA');
    const pfRule     = breakdown.deductions.find(d => d.name === 'Provident Fund');
    const taxRule    = breakdown.deductions.find(d => d.name === 'Income Tax');

    return {
        basicPay:       basic,
        hra:            hraRule?.amount || 0,
        gross:          Math.round(gross),
        totalAllowances: Math.round(totalAllowances),
        totalDeductions: Math.round(totalDeductions),
        leaveDeduction: Math.round(leaveDeduction),
        deductions:     Math.round(totalDeductions),
        netPay:         Math.round(netPay),
        isAnomaly,
        breakdown,
        pf:             pfRule?.amount || 0,
        tax:            taxRule?.amount || 0,
    };
};
