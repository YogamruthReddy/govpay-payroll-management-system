import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import LandingPage from './components/LandingPage';
import LoginPage from './components/LoginPage';
import DashboardLayout from './components/DashboardLayout';
import AdminDashboard from './components/AdminDashboard';
import OfficerDashboard from './components/OfficerDashboard';
import EmployeeDashboard from './components/EmployeeDashboard';
import { UserRole } from './types';

const AppContent: React.FC = () => {
  const { user, loading, logout } = useAuth();
  const [showLanding, setShowLanding] = React.useState(true);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show landing page if not logged in and landing is visible
  if (!user && showLanding) {
    return <LandingPage onLogin={() => setShowLanding(false)} />;
  }

  // Show login page if not logged in
  if (!user) {
    return <LoginPage />;
  }

  // Show dashboard based on role
  return (
    <DashboardLayout user={user} onLogout={logout}>
      {user.role === UserRole.ADMIN && <AdminDashboard />}
      {user.role === UserRole.OFFICER && <OfficerDashboard />}
      {user.role === UserRole.EMPLOYEE && <EmployeeDashboard user={user} />}
    </DashboardLayout>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;