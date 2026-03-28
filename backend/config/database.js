import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const db = new Database(join(__dirname, '..', 'govpay.db'));

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Create tables
const initDatabase = () => {
    // Users table
    db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      role TEXT NOT NULL CHECK(role IN ('EMPLOYEE', 'OFFICER', 'ADMIN')),
      employee_id INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (employee_id) REFERENCES employees(id)
    )
  `);

    // Employees table
    db.exec(`
    CREATE TABLE IF NOT EXISTS employees (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      department TEXT NOT NULL,
      position TEXT NOT NULL,
      grade TEXT NOT NULL,
      basic_salary REAL NOT NULL DEFAULT 0.0,
      join_date DATE NOT NULL,
      status TEXT DEFAULT 'active' CHECK(status IN ('active', 'inactive')),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

    // Payroll table
    db.exec(`
    CREATE TABLE IF NOT EXISTS payroll (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      employee_id INTEGER NOT NULL,
      month INTEGER NOT NULL,
      year INTEGER NOT NULL,
      basic_pay REAL NOT NULL,
      hra REAL DEFAULT 0,
      deductions REAL DEFAULT 0,
      net_pay REAL NOT NULL,
      status TEXT DEFAULT 'generated' CHECK(status IN ('generated', 'paid')),
      generated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (employee_id) REFERENCES employees(id),
      UNIQUE(employee_id, month, year)
    )
  `);

    // Leaves table
    db.exec(`
    CREATE TABLE IF NOT EXISTS leaves (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      employee_id INTEGER NOT NULL,
      leave_type TEXT NOT NULL CHECK(leave_type IN ('sick', 'casual', 'annual', 'maternity')),
      start_date DATE NOT NULL,
      end_date DATE NOT NULL,
      days INTEGER NOT NULL,
      reason TEXT NOT NULL,
      status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'approved', 'rejected')),
      applied_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      reviewed_at DATETIME,
      reviewed_by INTEGER,
      FOREIGN KEY (employee_id) REFERENCES employees(id),
      FOREIGN KEY (reviewed_by) REFERENCES users(id)
    )
  `);

    // Service History table
    db.exec(`
    CREATE TABLE IF NOT EXISTS service_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      employee_id INTEGER NOT NULL,
      event_type TEXT NOT NULL CHECK(event_type IN ('Joining', 'Promotion', 'Transfer', 'Training')),
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      event_date DATE NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (employee_id) REFERENCES employees(id)
    )
  `);

    console.log('✅ Database tables created successfully');
};

// Initialize database
initDatabase();

export default db;
