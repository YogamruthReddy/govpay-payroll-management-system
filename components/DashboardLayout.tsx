import React, { useState } from 'react';
import { User, UserRole } from '../types';
import {
  LayoutDashboard,
  Users,
  FileText,
  Settings,
  LogOut,
  Menu,
  Bell,
  Briefcase,
  UserCheck,
  Building2,
  History,
  Search,
  ChevronDown
} from 'lucide-react';
import EmployeeDashboard from './EmployeeDashboard';
import SalarySlips from './SalarySlips';
import ServiceHistory from './ServiceHistory';
import LeaveApplication from './LeaveApplication';
import AdminDashboard from './AdminDashboard';
import OfficerDashboard from './OfficerDashboard';
import DepartmentsView from './admin/DepartmentsView';
import EmployeesView from './admin/EmployeesView';
import PayrollReportsView from './admin/PayrollReportsView';
import SettingsView from './admin/SettingsView';
import ApprovalsView from './officer/ApprovalsView';
import PayrollProcessingView from './officer/PayrollProcessingView';
import PromotionsView from './officer/PromotionsView';

interface DashboardLayoutProps {
  user: User;
  onLogout: () => void;
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ user, onLogout, children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeView, setActiveView] = useState(0);

  const getNavItems = (role: UserRole) => {
    const common = [
      { label: 'Overview', icon: LayoutDashboard },
    ];

    switch (role) {
      case UserRole.ADMIN:
        return [
          ...common,
          { label: 'Departments', icon: Building2 },
          { label: 'Employees', icon: Users },
          { label: 'Payroll Reports', icon: FileText },
          { label: 'Settings', icon: Settings },
        ];
      case UserRole.OFFICER:
        return [
          ...common,
          { label: 'Approvals', icon: UserCheck },
          { label: 'Payroll Processing', icon: FileText },
          { label: 'Promotions', icon: Briefcase },
        ];
      case UserRole.EMPLOYEE:
        return [
          { label: 'My Profile', icon: Users },
          { label: 'Salary Slips', icon: FileText },
          { label: 'Service History', icon: History },
          { label: 'Leave Application', icon: UserCheck },
        ];
      default:
        return common;
    }
  };

  const navItems = getNavItems(user.role);

  return (
    <div className="min-h-screen bg-slate-50/50 flex font-sans">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-30 lg:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-40 w-72 bg-brand-950 text-white transform transition-transform duration-300 cubic-bezier(0.4, 0, 0.2, 1)
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        flex flex-col border-r border-brand-900 shadow-xl
      `}>
        {/* Sidebar Header */}
        <div className="h-20 flex items-center px-8 border-b border-brand-900/50 bg-brand-950">
          <button onClick={onLogout} className="flex items-center gap-3 hover:opacity-80 transition-opacity cursor-pointer">
            <div className="p-2 bg-gradient-to-br from-brand-500 to-brand-700 rounded-lg shadow-glow">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="font-display font-bold text-xl tracking-wide text-white">GovPay</span>
              <p className="text-[10px] text-brand-300 tracking-wider uppercase">Official Portal</p>
            </div>
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {navItems.map((item, index) => (
            <button
              key={item.label}
              onClick={() => setActiveView(index)}
              className={`
                w-full flex items-center px-4 py-3.5 rounded-xl transition-all duration-200 group
                ${index === activeView
                  ? 'bg-gradient-to-r from-brand-600 to-brand-700 text-white shadow-lg shadow-brand-900/20'
                  : 'text-brand-100 hover:bg-brand-900 hover:text-white'}
              `}
            >
              <item.icon className={`w-5 h-5 mr-3 transition-colors ${index === activeView ? 'text-white' : 'text-brand-400 group-hover:text-white'}`} />
              <span className="font-medium tracking-wide">{item.label}</span>
              {index === activeView && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white shadow-glow"></div>}
            </button>
          ))}
        </nav>

        {/* User Profile in Sidebar */}
        <div className="p-4 border-t border-brand-900/50 bg-brand-900/30">
          <div className="flex items-center justify-between p-3 rounded-xl bg-brand-900/50 border border-brand-800/50 mb-3">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-sm font-bold text-white shadow-inner">
                {user.name.charAt(0)}
              </div>
              <div className="ml-3">
                <p className="text-sm font-semibold text-white">{user.name}</p>
                <p className="text-xs text-brand-300 capitalize font-medium">{user.role.toLowerCase()}</p>
              </div>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center px-4 py-2.5 text-brand-200 hover:text-white hover:bg-brand-800 rounded-lg transition-colors text-sm font-medium"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col min-w-0 bg-slate-50 relative">

        {/* Glass Header */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200/60 sticky top-0 z-20 flex items-center justify-between px-4 lg:px-8 shadow-sm">
          <div className="flex items-center flex-1">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-slate-500 hover:text-brand-900 transition-colors mr-4"
            >
              <Menu className="w-6 h-6" />
            </button>

            <div className="hidden md:flex items-center relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search records, employees, or documents..."
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all placeholder:text-slate-400"
              />
            </div>
          </div>

          <div className="flex items-center space-x-3 lg:space-x-6">
            <div className="flex flex-col items-end mr-2 hidden sm:flex gap-0.5">
              <span className="text-xs font-semibold text-slate-900 font-display">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</span>
              <span className="text-[10px] text-slate-500 font-medium tracking-wide uppercase">System Operational</span>
            </div>

            <div className="h-8 w-px bg-slate-200 hidden sm:block"></div>

            <button className="p-2 text-slate-400 hover:text-brand-600 relative transition-colors group">
              <div className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></div>
              <Bell className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </button>

            <button className="flex items-center space-x-2 pl-2">
              <div className="w-8 h-8 rounded-full bg-brand-100 border border-brand-200 flex items-center justify-center text-brand-700 font-bold text-xs">
                {user.name.charAt(0)}
              </div>
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </button>
          </div>
        </header>

        {/* Scrollable Main Area */}
        <main className="flex-1 p-4 lg:p-8 overflow-y-auto overflow-x-hidden">
          <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
            {user.role === UserRole.EMPLOYEE ? (
              <>
                {activeView === 0 && <EmployeeDashboard user={user} />}
                {activeView === 1 && <SalarySlips />}
                {activeView === 2 && <ServiceHistory />}
                {activeView === 3 && <LeaveApplication />}
              </>
            ) : user.role === UserRole.ADMIN ? (
              <>
                {activeView === 0 && <AdminDashboard />}
                {activeView === 1 && <DepartmentsView />}
                {activeView === 2 && <EmployeesView />}
                {activeView === 3 && <PayrollReportsView />}
                {activeView === 4 && <SettingsView />}
              </>
            ) : user.role === UserRole.OFFICER ? (
              <>
                {activeView === 0 && <OfficerDashboard />}
                {activeView === 1 && <ApprovalsView />}
                {activeView === 2 && <PayrollProcessingView />}
                {activeView === 3 && <PromotionsView />}
              </>
            ) : (
              children
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;