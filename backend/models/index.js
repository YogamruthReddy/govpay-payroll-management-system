import db from '../config/database.js';

export const User = {
    create: (username, password, email, role, employeeId = null) => {
        const stmt = db.prepare(`
      INSERT INTO users (username, password, email, role, employee_id)
      VALUES (?, ?, ?, ?, ?)
    `);
        return stmt.run(username, password, email, role, employeeId);
    },

    findByUsername: (username) => {
        const stmt = db.prepare('SELECT * FROM users WHERE username = ?');
        return stmt.get(username);
    },

    findById: (id) => {
        const stmt = db.prepare('SELECT * FROM users WHERE id = ?');
        return stmt.get(id);
    },

    findAll: () => {
        const stmt = db.prepare('SELECT id, username, email, role, employee_id, created_at FROM users');
        return stmt.all();
    }
};

export const Employee = {
    create: (name, email, department, position, grade, basicSalary, joinDate) => {
        const stmt = db.prepare(`
      INSERT INTO employees (name, email, department, position, grade, basic_salary, join_date)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
        return stmt.run(name, email, department, position, grade, basicSalary, joinDate);
    },

    findById: (id) => {
        const stmt = db.prepare('SELECT * FROM employees WHERE id = ?');
        return stmt.get(id);
    },

    findAll: () => {
        const stmt = db.prepare('SELECT * FROM employees WHERE status = ?');
        return stmt.all('active');
    },

    update: (id, data) => {
        const fields = Object.keys(data).map(key => `${key} = ?`).join(', ');
        const values = Object.values(data);
        const stmt = db.prepare(`UPDATE employees SET ${fields} WHERE id = ?`);
        return stmt.run(...values, id);
    },

    delete: (id) => {
        const stmt = db.prepare('UPDATE employees SET status = ? WHERE id = ?');
        return stmt.run('inactive', id);
    }
};

export const Payroll = {
    create: (employeeId, month, year, basicPay, hra, deductions, netPay) => {
        const stmt = db.prepare(`
      INSERT INTO payroll (employee_id, month, year, basic_pay, hra, deductions, net_pay)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
        return stmt.run(employeeId, month, year, basicPay, hra, deductions, netPay);
    },

    findByEmployee: (employeeId) => {
        const stmt = db.prepare(`
      SELECT p.*, e.name as employee_name
      FROM payroll p
      JOIN employees e ON p.employee_id = e.id
      WHERE p.employee_id = ?
      ORDER BY p.year DESC, p.month DESC
    `);
        return stmt.all(employeeId);
    },

    findById: (id) => {
        const stmt = db.prepare('SELECT * FROM payroll WHERE id = ?');
        return stmt.get(id);
    },

    findAll: () => {
        const stmt = db.prepare(`
      SELECT p.*, e.name as employee_name, e.department
      FROM payroll p
      JOIN employees e ON p.employee_id = e.id
      ORDER BY p.year DESC, p.month DESC
    `);
        return stmt.all();
    }
};

export const Leave = {
    create: (employeeId, leaveType, startDate, endDate, days, reason) => {
        const stmt = db.prepare(`
      INSERT INTO leaves (employee_id, leave_type, start_date, end_date, days, reason)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
        return stmt.run(employeeId, leaveType, startDate, endDate, days, reason);
    },

    findByEmployee: (employeeId) => {
        const stmt = db.prepare('SELECT * FROM leaves WHERE employee_id = ? ORDER BY applied_at DESC');
        return stmt.all(employeeId);
    },

    findPending: () => {
        const stmt = db.prepare(`
      SELECT l.*, e.name as employee_name, e.department
      FROM leaves l
      JOIN employees e ON l.employee_id = e.id
      WHERE l.status = 'pending'
      ORDER BY l.applied_at ASC
    `);
        return stmt.all();
    },

    updateStatus: (id, status, reviewedBy) => {
        const stmt = db.prepare(`
      UPDATE leaves 
      SET status = ?, reviewed_at = CURRENT_TIMESTAMP, reviewed_by = ?
      WHERE id = ?
    `);
        return stmt.run(status, reviewedBy, id);
    }
};

export const ServiceHistory = {
    create: (employeeId, eventType, title, description, eventDate) => {
        const stmt = db.prepare(`
      INSERT INTO service_history (employee_id, event_type, title, description, event_date)
      VALUES (?, ?, ?, ?, ?)
    `);
        return stmt.run(employeeId, eventType, title, description, eventDate);
    },

    findByEmployee: (employeeId) => {
        const stmt = db.prepare(`
      SELECT * FROM service_history 
      WHERE employee_id = ? 
      ORDER BY event_date DESC
    `);
        return stmt.all(employeeId);
    }
};
