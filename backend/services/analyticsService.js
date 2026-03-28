import db from '../config/database.js';

export const AnalyticsService = {

    // ── Monthly payroll spend trend ───────────────────────────────────────────
    getMonthlyPayrollTrend: () => {
        const stmt = db.prepare(`
            SELECT month, year, SUM(net_pay) as total_amount
            FROM payroll
            GROUP BY year, month
            ORDER BY year ASC, month ASC
            LIMIT 12
        `);
        return stmt.all();
    },

    // ── Department headcount + salary totals ──────────────────────────────────
    getDepartmentStats: () => {
        const stmt = db.prepare(`
            SELECT
                e.department as name,
                COUNT(DISTINCT e.id) as count,
                IFNULL(SUM(p.net_pay), 0) as total_salary
            FROM employees e
            LEFT JOIN (SELECT * FROM payroll GROUP BY employee_id HAVING MAX(id)) p ON e.id = p.employee_id
            WHERE e.status = 'active'
            GROUP BY e.department
        `);
        const rows = stmt.all();
        const totalSalarySystem = rows.reduce((acc, r) => acc + r.total_salary, 0);
        return rows.map(r => ({
            name:        r.name,
            count:       r.count,
            budget:      totalSalarySystem > 0 ? Math.round((r.total_salary / totalSalarySystem) * 100) : 0,
            totalSalary: r.total_salary
        }));
    },

    // ── Leave status breakdown ────────────────────────────────────────────────
    getLeaveTrends: () => {
        const stmt = db.prepare(`
            SELECT status as label, COUNT(*) as count
            FROM leaves
            GROUP BY status
        `);
        return stmt.all();
    },

    // ── Global dashboard stats ────────────────────────────────────────────────
    getGlobalStats: () => {
        const totalEmployees       = db.prepare(`SELECT COUNT(*) as count FROM employees WHERE status = 'active'`).get().count;
        const totalDepartments     = db.prepare(`SELECT COUNT(DISTINCT department) as count FROM employees`).get().count;
        const pendingRequests      = db.prepare(`SELECT COUNT(*) as count FROM leaves WHERE status = 'pending'`).get().count;
        const anomalyCount         = db.prepare(`SELECT COUNT(*) as count FROM payroll WHERE is_anomaly = 1`).get().count;
        const payrollRow           = db.prepare(`
            SELECT SUM(net_pay) as total
            FROM payroll
            WHERE month = (SELECT MAX(month) FROM payroll WHERE year = (SELECT MAX(year) FROM payroll))
              AND year  = (SELECT MAX(year) FROM payroll)
        `).get();

        return {
            totalEmployees,
            totalDepartments,
            pendingRequests,
            anomalyCount,
            latestMonthlyPayroll: payrollRow?.total || 0
        };
    },

    // ── NEW: Top 5 earners (last generated payroll per employee) ─────────────
    getTopEarners: () => {
        const stmt = db.prepare(`
            SELECT
                e.id,
                e.name,
                e.department,
                e.position,
                p.net_pay,
                p.month,
                p.year
            FROM payroll p
            JOIN employees e ON p.employee_id = e.id
            WHERE p.id IN (
                SELECT MAX(id) FROM payroll GROUP BY employee_id
            )
            ORDER BY p.net_pay DESC
            LIMIT 5
        `);
        return stmt.all();
    },

    // ── NEW: Salary anomalies flagged during payroll generation ──────────────
    getSalaryAnomalies: () => {
        const stmt = db.prepare(`
            SELECT
                e.name,
                e.department,
                e.position,
                p.net_pay,
                p.month,
                p.year,
                p.generated_at
            FROM payroll p
            JOIN employees e ON p.employee_id = e.id
            WHERE p.is_anomaly = 1
            ORDER BY p.net_pay DESC
            LIMIT 20
        `);
        return stmt.all();
    },

    // ── NEW: Leave analytics — type breakdown + approval rate ────────────────
    getLeaveAnalytics: () => {
        const byType = db.prepare(`
            SELECT leave_type as type, COUNT(*) as total,
                   SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END) as approved,
                   SUM(CASE WHEN status = 'rejected' THEN 1 ELSE 0 END) as rejected,
                   SUM(CASE WHEN status = 'pending'  THEN 1 ELSE 0 END) as pending
            FROM leaves
            GROUP BY leave_type
        `).all();

        const totalLeaves   = db.prepare(`SELECT COUNT(*) as c FROM leaves`).get().c;
        const approvedLeaves = db.prepare(`SELECT COUNT(*) as c FROM leaves WHERE status = 'approved'`).get().c;
        const approvalRate  = totalLeaves > 0 ? Math.round((approvedLeaves / totalLeaves) * 100) : 0;

        return { byType, approvalRate, totalLeaves, approvedLeaves };
    }
};
