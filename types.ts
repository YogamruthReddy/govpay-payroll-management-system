export enum UserRole {
  ADMIN = 'ADMIN',
  OFFICER = 'OFFICER',
  EMPLOYEE = 'EMPLOYEE',
  GUEST = 'GUEST'
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  department?: string;
  position?: string;
  avatar?: string;
}

export interface LeaveRequest {
  id: string;
  employeeName: string;
  type: 'Sick' | 'Vacation' | 'Casual';
  startDate: string;
  endDate: string;
  status: 'Pending' | 'Approved' | 'Rejected';
}

export interface SalarySlip {
  id: string;
  month: string;
  year: number;
  basicPay: number;
  allowances: number;
  deductions: number;
  netPay: number;
  generatedDate: string;
}

export interface Department {
  id: string;
  name: string;
  employeeCount: number;
  headOfDept: string;
}

export interface ServiceRecord {
  id: string;
  date: string;
  title: string;
  description: string;
  type: 'Promotion' | 'Transfer' | 'Award' | 'Increment';
}