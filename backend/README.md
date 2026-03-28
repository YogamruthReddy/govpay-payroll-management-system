# GovPay Backend API

Backend API for Government Employee Payroll & Service Records Management System.

## 🚀 Quick Start

### Installation
```bash
cd backend
npm install
```

### Database Setup
```bash
# Seed the database with sample data
node seed.js
```

### Run Server
```bash
# Development mode
npm start

# Production mode
NODE_ENV=production npm start
```

Server will run on `http://localhost:5000`

## 📝 Sample Credentials

After seeding, use these credentials to test:

- **Employee**: `james.anderson` / `password123`
- **Officer**: `sarah.connor` / `password123`
- **Admin**: `robert.wilson` / `password123`

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires token)

### Employees
- `GET /api/employees` - Get all employees (Admin/Officer only)
- `GET /api/employees/:id` - Get employee by ID
- `POST /api/employees` - Create employee (Admin only)
- `PUT /api/employees/:id` - Update employee (Admin only)
- `DELETE /api/employees/:id` - Delete employee (Admin only)
- `GET /api/employees/:id/service-history` - Get service history
- `POST /api/employees/:id/service-history` - Add service event (Admin only)

### Payroll
- `GET /api/payroll` - Get all payroll records (Admin/Officer only)
- `GET /api/payroll/employee/:employeeId` - Get employee payrolls
- `GET /api/payroll/:id` - Get specific payroll record
- `POST /api/payroll` - Generate payroll (Admin/Officer only)

### Leaves
- `GET /api/leaves/pending` - Get pending leaves (Admin/Officer only)
- `GET /api/leaves/employee/:employeeId` - Get employee leaves
- `POST /api/leaves` - Apply for leave
- `PUT /api/leaves/:id/status` - Approve/reject leave (Admin/Officer only)

## 🔐 Authentication

All protected routes require a JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

Get the token by calling `/api/auth/login`

## 🗄️ Database Schema

### Users
- id, username, password, email, role, employee_id, created_at

### Employees
- id, name, email, department, position, grade, join_date, status, created_at

### Payroll
- id, employee_id, month, year, basic_pay, hra, deductions, net_pay, status, generated_at

### Leaves
- id, employee_id, leave_type, start_date, end_date, days, reason, status, applied_at, reviewed_at, reviewed_by

### Service History
- id, employee_id, event_type, title, description, event_date, created_at

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: SQLite (better-sqlite3)
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs
- **CORS**: cors
- **Environment**: dotenv

## 📦 Project Structure

```
backend/
├── config/
│   └── database.js      # Database configuration
├── models/
│   └── index.js         # Data models
├── routes/
│   ├── auth.js          # Authentication routes
│   ├── employees.js     # Employee routes
│   ├── payroll.js       # Payroll routes
│   └── leaves.js        # Leave routes
├── middleware/
│   └── auth.js          # Auth middleware
├── server.js            # Main server file
├── seed.js              # Database seeding script
├── .env                 # Environment variables
└── package.json         # Dependencies
```

## 🔒 Security Features

- Password hashing with bcrypt
- JWT-based authentication
- Role-based access control (RBAC)
- SQL injection protection (prepared statements)
- CORS enabled
- Input validation

## 📊 Example API Calls

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"james.anderson","password":"password123"}'
```

### Get Employee Payrolls
```bash
curl http://localhost:5000/api/payroll/employee/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Apply for Leave
```bash
curl -X POST http://localhost:5000/api/leaves \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "employeeId": 1,
    "leaveType": "casual",
    "startDate": "2024-02-01",
    "endDate": "2024-02-02",
    "days": 2,
    "reason": "Personal work"
  }'
```

## 🐛 Troubleshooting

**Database locked error**: Close any other connections to the database file.

**Port already in use**: Change the PORT in `.env` file.

**Module not found**: Run `npm install` again.

## 📄 License

ISC
