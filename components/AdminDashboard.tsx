import React, { useEffect, useState } from 'react';
import { Card, Table, Badge, Button } from './ui/UIComponents';
import { Users, Building2, CreditCard, TrendingUp, Download, ArrowUpRight, ArrowDownRight, MoreHorizontal } from 'lucide-react';
import { analyticsAPI } from '../services/api';

import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip as ChartTooltip, Legend, Filler, ArcElement
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, ChartTooltip, Legend, Filler, ArcElement
);

const AdminDashboard: React.FC = () => {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const data = await analyticsAPI.getDashboard();
        setAnalytics(data);
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading || !analytics) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-16 h-16 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const { stats, payrollTrend, departmentStats, leaveTrends } = analytics;

  // Configurations for Chart.js Line Chart (Payroll Trend)
  const lineChartData = {
    labels: payrollTrend.map((pt: any) => pt.name),
    datasets: [
      {
        label: 'Total Disbursed',
        data: payrollTrend.map((pt: any) => pt.amount),
        fill: true,
        borderColor: '#3b82f6',
        backgroundColor: (context: any) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 300);
          gradient.addColorStop(0, 'rgba(59, 130, 246, 0.2)');
          gradient.addColorStop(1, 'rgba(59, 130, 246, 0)');
          return gradient;
        },
        tension: 0.4,
        borderWidth: 3,
        pointRadius: 0,
        pointHoverRadius: 6,
      }
    ]
  };

  const lineChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { 
      legend: { display: false },
      tooltip: {
        backgroundColor: '#fff',
        titleColor: '#0f172a',
        bodyColor: '#0f172a',
        borderColor: '#e2e8f0',
        borderWidth: 1,
        padding: 12,
        displayColors: false,
        callbacks: {
          label: (context: any) => `$${context.raw.toLocaleString()}`
        }
      }
    },
    scales: {
      x: { grid: { display: false }, border: { display: false } },
      y: { 
        grid: { color: '#f1f5f9' }, 
        border: { display: false },
        ticks: { callback: (val: any) => `$${val/1000}k` }
      }
    }
  };

  // Configurations for Chart.js Bar Chart (Dept limits)
  const barChartData = {
    labels: departmentStats.map((d: any) => d.name),
    datasets: [
      {
        label: 'Employees',
        data: departmentStats.map((d: any) => d.count),
        backgroundColor: '#3b82f6',
        borderRadius: 4,
        barPercentage: 0.6
      },
      {
        label: 'Budget % (x10 for scale representation)',
        data: departmentStats.map((d: any) => d.budget * 10), // Scaled to visualize with Employees effectively
        backgroundColor: '#e2e8f0',
        borderRadius: 4,
        barPercentage: 0.6
      }
    ]
  };

  const barChartOptions = {
    indexAxis: 'y' as const,
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: { display: false },
        tooltip: {
            backgroundColor: '#1e293b',
            titleColor: '#fff',
            bodyColor: '#fff',
            padding: 12,
        }
    },
    scales: {
        x: { display: false, grid: { display: false } },
        y: { 
            grid: { display: false }, 
            border: { display: false },
            ticks: { font: { weight: 'bold' } }
        }
    }
  };

  // Configurations for Leave Doughnut
  const leaveData = {
      labels: leaveTrends.map((lt: any) => lt.label.charAt(0).toUpperCase() + lt.label.slice(1)),
      datasets: [{
          data: leaveTrends.map((lt: any) => lt.count),
          backgroundColor: ['#eab308', '#22c55e', '#ef4444'], // Pending(yellow), Approved(green), Rejected(red)
          borderWidth: 0,
          cutout: '75%',
      }]
  };

  const leaveOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
          legend: { position: 'bottom' as const }
      }
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-display font-bold text-slate-900 tracking-tight">System Overview</h2>
          <p className="text-slate-500 mt-1 font-medium">Live Server Analytics connected.</p>
        </div>
        <div className="flex space-x-3">
            <Button variant="secondary" className="shadow-sm">
                <Download className="w-4 h-4 mr-2" /> Export Report
            </Button>
            <Button variant="primary" className="shadow-glow">
                <Building2 className="w-4 h-4 mr-2" /> Add Department
            </Button>
        </div>
      </div>

      {/* Stats Grid with Gradients */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Employees', value: stats.totalEmployees, icon: Users, change: '+2%', trend: 'up', gradient: 'from-blue-500 to-blue-600' },
          { label: 'Total Departments', value: stats.totalDepartments, icon: Building2, change: 'Stable', trend: 'neutral', gradient: 'from-indigo-500 to-indigo-600' },
          { label: 'Latest Monthly Payroll', value: `$${(stats.latestMonthlyPayroll/1000).toFixed(1)}k`, icon: CreditCard, change: '+1.4%', trend: 'up', gradient: 'from-emerald-500 to-emerald-600' },
          { label: 'Pending Leaves', value: stats.pendingRequests, icon: TrendingUp, change: '-12%', trend: 'down', gradient: 'from-amber-500 to-amber-600' },
        ].map((stat, index) => (
          <div key={index} className="relative overflow-hidden bg-white rounded-2xl shadow-soft border border-slate-100 p-6 group hover:shadow-lg transition-all duration-300">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-500 font-display">{stat.label}</p>
                <h3 className="text-3xl font-bold text-slate-900 mt-2 font-display">{stat.value}</h3>
              </div>
              <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.gradient} text-white shadow-md group-hover:scale-110 transition-transform duration-300`}>
                <stat.icon className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
                {stat.trend === 'up' ? (
                    <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-bold flex items-center text-xs">
                        <ArrowUpRight className="w-3 h-3 mr-1" /> {stat.change}
                    </span>
                ) : stat.trend === 'down' ? (
                    <span className="text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full font-bold flex items-center text-xs">
                        <ArrowDownRight className="w-3 h-3 mr-1" /> {stat.change}
                    </span>
                ) : (
                    <span className="text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full font-bold flex items-center text-xs">
                        {stat.change}
                    </span>
                )}
                <span className="text-slate-400 ml-2 text-xs font-medium">vs last month</span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="col-span-1 lg:col-span-2 p-6">
          <div className="flex items-center justify-between mb-8">
            <div>
                <h3 className="text-lg font-bold text-slate-900 font-display">Payroll Analytics</h3>
                <p className="text-sm text-slate-500">6 Month Spending Trend (Chart.js)</p>
            </div>
            <select className="bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-brand-500 focus:border-brand-500 block p-2">
                <option>Last 6 Months</option>
                <option>Last Year</option>
            </select>
          </div>
          <div className="h-80">
             <Line data={lineChartData} options={lineChartOptions} />
          </div>
        </Card>

        {/* We will replace the 1/3 grid column with Leave Trends since Admin typically needs to track this per syllabus */}
        <Card className="col-span-1 p-6">
          <div className="flex items-center justify-between mb-8">
             <h3 className="text-lg font-bold text-slate-900 font-display">Leave Trends</h3>
             <button className="text-slate-400 hover:text-brand-600"><MoreHorizontal className="w-5 h-5" /></button>
          </div>
          <div className="h-64 mt-4">
             <Doughnut data={leaveData} options={leaveOptions} />
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-8">
          <Card className="col-span-1 p-6">
            <div className="flex items-center justify-between mb-8">
                 <h3 className="text-lg font-bold text-slate-900 font-display">Department Staffing & Metrics</h3>
                 <button className="text-slate-400 hover:text-brand-600"><MoreHorizontal className="w-5 h-5" /></button>
            </div>
            <div className="h-80">
                <Bar data={barChartData} options={barChartOptions as any} />
            </div>
          </Card>
      </div>

    </div>
  );
};

export default AdminDashboard;