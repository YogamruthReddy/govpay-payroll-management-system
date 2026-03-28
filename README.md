# GovPay - Government Payroll Management System

A modern, full-stack payroll management system designed for government organizations. Built with React, TypeScript, Node.js, and SQLite.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-18.x-61dafb.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6.svg)
![Node.js](https://img.shields.io/badge/Node.js-18.x-339933.svg)

## 🌟 Features

### Employee Portal
- **Dashboard** - View salary information and service history
- **Salary Slips** - Access and download monthly payslips
- **Service History** - Track career progression and promotions
- **Leave Management** - Apply for leave and view request status

### Officer Portal
- **Approvals** - Review and approve leave requests
- **Payroll Processing** - Generate department payroll with workflow tracking
- **Promotions** - Manage employee grade advancements
- **Department Overview** - Analytics and team management

### Admin Portal
- **System Dashboard** - Organization-wide analytics with charts
- **Department Management** - CRUD operations for departments
- **Employee Directory** - Complete employee management with search
- **Payroll Reports** - Generate and download comprehensive reports
- **Settings** - System configuration (General, Security, Notifications, System)

## 🚀 Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first styling
- **Recharts** - Data visualization
- **Lucide React** - Icon library
- **Axios** - HTTP client

### Backend
- **Node.js** with Express
- **SQLite** - Lightweight database
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin support

## 📦 Installation

### Prerequisites
- Node.js 18.x or higher
- npm or yarn

### Clone the Repository
```bash
git clone https://github.com/supravat011/Gov-Payroll.git
cd Gov-Payroll
```

### Install Dependencies

#### Frontend
```bash
npm install
```

#### Backend
```bash
cd backend
npm install
```

## 🏃 Running the Application

### 1. Start the Backend Server
```bash
cd backend
npm start
```
The backend will run on `http://localhost:5000`

### 2. Seed the Database (First Time Only)
```bash
cd backend
node seed.js
```

### 3. Start the Frontend
```bash
# In the root directory
npm run dev
```
The frontend will run on `http://localhost:3000`

## 👤 Demo Credentials

### Employee
- **Email:** `john.doe@gov.in`
- **Password:** `password123`

### Officer
- **Email:** `jane.smith@gov.in`
- **Password:** `password123`

### Admin
- **Email:** `admin@gov.in`
- **Password:** `admin123`

## 📁 Project Structure

```
Gov-Payroll/
├── components/           # React components
│   ├── admin/           # Admin-specific views
│   ├── officer/         # Officer-specific views
│   └── ui/              # Reusable UI components
├── context/             # React Context (Auth)
├── services/            # API service layer
├── backend/             # Node.js backend
│   ├── config/          # Database configuration
│   ├── models/          # Data models
│   ├── routes/          # API routes
│   ├── middleware/      # Auth & role middleware
│   └── seed.js          # Database seeding
├── types.ts             # TypeScript types
└── App.tsx              # Main application
```

## 🔐 Security Features

- JWT-based authentication
- Password hashing with bcryptjs
- Role-based access control (RBAC)
- Protected API routes
- Session management
- CORS configuration

## 🎨 Design Highlights

- **Modern UI** - Clean, professional interface with glassmorphism effects
- **Responsive** - Mobile-friendly design
- **Dark Theme** - Premium dark mode for dashboards
- **Animations** - Smooth transitions and micro-interactions
- **Charts** - Interactive data visualizations
- **Accessibility** - Semantic HTML and ARIA labels

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Employees
- `GET /api/employees` - List all employees
- `GET /api/employees/:id` - Get employee details
- `POST /api/employees` - Create employee
- `PUT /api/employees/:id` - Update employee
- `DELETE /api/employees/:id` - Delete employee
- `GET /api/employees/:id/service-history` - Get service history

### Payroll
- `POST /api/payroll/generate` - Generate payroll
- `GET /api/payroll/employee/:employeeId` - Get employee payroll
- `GET /api/payroll` - Get all payroll records

### Leaves
- `POST /api/leaves/apply` - Apply for leave
- `GET /api/leaves/employee/:employeeId` - Get employee leaves
- `GET /api/leaves/pending` - Get pending leaves
- `PUT /api/leaves/:id/approve` - Approve leave
- `PUT /api/leaves/:id/reject` - Reject leave

## 🛠️ Development

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## 📝 Environment Variables

Create a `.env` file in the `backend` directory:

```env
PORT=5000
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=development
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Supravat**
- GitHub: [@supravat011](https://github.com/supravat011)

## 🙏 Acknowledgments

- Built with modern web technologies
- Designed for government organizations
- Focus on security and user experience

---

**Note:** This is a demonstration project. For production use, ensure proper security measures, environment configuration, and database setup.
