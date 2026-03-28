import db from '../config/database.js';

export const AnalyticsService = {
    getMonthlyPayrollTrend: () => {
        // We aggregate the net pay by month
        const stmt = db.prepare(`
            SELECT month, year, SUM(net_pay) as total_amount 
            FROM payroll 
            GROUP BY year, month 
            ORDER BY year ASC, month ASC
            LIMIT 6
        `);
        return stmt.all();
    },

    getDepartmentStats: () => {
        // We get total employees and sum of salaries per department
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

        // Calculate budget %
        const totalSalarySystem = rows.reduce((acc, r) => acc + r.total_salary, 0);
        
        return rows.map(r => ({
            name: r.name,
            count: r.count,
            budget: totalSalarySystem > 0 ? Math.round((r.total_salary / totalSalarySystem) * 100) : 0,
            totalSalary: r.total_salary
        }));
    },

    getLeaveTrends: () => {
        // General stats of total leaves by their current status
        const stmt = db.prepare(`
            SELECT status as label, COUNT(*) as count 
            FROM leaves 
            GROUP BY status
        `);
        return stmt.all();
    },
    
    getGlobalStats: () => {
        const empStmt = db.prepare(`SELECT COUNT(*) as count FROM employees WHERE status = 'active'`);
        const deptStmt = db.prepare(`SELECT COUNT(DISTINCT department) as count FROM employees`);
        const pendingStmt = db.prepare(`SELECT COUNT(*) as count FROM leaves WHERE status = 'pending'`);
        const payrollStmt = db.prepare(`
            SELECT SUM(net_pay) as total 
            FROM payroll 
            WHERE month = (SELECT MAX(month) FROM payroll WHERE year = (SELECT MAX(year) FROM payroll))
              AND year = (SELECT MAX(year) FROM payroll)
        `);

        return {
            totalEmployees: empStmt.get().count,
            totalDepartments: deptStmt.get().count,
            pendingRequests: pendingStmt.get().count,
            latestMonthlyPayroll: payrollStmt.get().total || 0
        };
    }
};
