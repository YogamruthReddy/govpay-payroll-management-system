import React, { useEffect, useState } from 'react';
import { Card, Table, Badge, Button } from './ui/UIComponents';
import {
  Users, Building2, CreditCard, TrendingUp, Download,
  ArrowUpRight, ArrowDownRight, MoreHorizontal,
  AlertTriangle, Trophy, Settings
} from 'lucide-react';
import { analyticsAPI } from '../services/api';
import PayrollRulesManager from './admin/PayrollRulesManager';

import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement,
  LineElement, BarElement, Title, Tooltip as ChartTooltip,
  Legend, Filler, ArcElement
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement,
  BarElement, Title, ChartTooltip, Legend, Filler, ArcElement
);

type Tab = 'overview' | 'rules';

const AdminDashboard: React.FC = () => {
  const [analytics, setAnalytics]     = useState<any>(null);
  const [topEarners, setTopEarners]   = useState<any[]>([]);
  const [anomalies, setAnomalies]     = useState<any[]>([]);
  const [loading, setLoading]         = useState(true);
  const [activeTab, setActiveTab]     = useState<Tab>('overview');

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [dashData, earnersData, anomalyData] = await Promise.all([
          analyticsAPI.getDashboard(),
          analyticsAPI.getTopEarners(),
          analyticsAPI.getAnomalies(),
        ]);
        setAnalytics(dashData);
        setTopEarners(earnersData.topEarners || []);
        setAnomalies(anomalyData.anomalies || []);
      } catch (err) {
        console.error('Dashboard load error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  if (loading || !analytics) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-16 h-16 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const { stats, payrollTrend, departmentStats, leaveTrends } = analytics;

  // ── Chart Configs ──────────────────────────────────────────────────────────
  const lineChartData = {
    labels: payrollTrend.map((pt: any) => pt.name),
    datasets: [{
      label: 'Total Disbursed',
      data: payrollTrend.map((pt: any) => pt.amount),
      fill: true,
      borderColor: '#3b82f6',
      backgroundColor: (context: any) => {
        const ctx = context.chart.ctx;
        const gradient = ctx.createLinearGradient(0, 0, 0, 300);
        gradient.addColorStop(0, 'rgba(59,130,246,0.2)');
        gradient.addColorStop(1, 'rgba(59,130,246,0)');
        return gradient;
      },
      tension: 0.4, borderWidth: 3, pointRadius: 0, pointHoverRadius: 6,
    }]
  };

  const lineChartOptions = {
    responsive: true, maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#fff', titleColor: '#0f172a', bodyColor: '#0f172a',
        borderColor: '#e2e8f0', borderWidth: 1, padding: 12, displayColors: false,
        callbacks: { label: (ctx: any) => `₹${ctx.raw.toLocaleString()}` }
      }
    },
    scales: {
      x: { grid: { display: false }, border: { display: false } },
      y: { grid: { color: '#f1f5f9' }, border: { display: false }, ticks: { callback: (v: any) => `₹${v / 1000}k` } }
    }
  };

  const barChartData = {
    labels: departmentStats.map((d: any) => d.name),
    datasets: [
      { label: 'Employees', data: departmentStats.map((d: any) => d.count), backgroundColor: '#3b82f6', borderRadius: 4, barPercentage: 0.6 },
      { label: 'Budget %', data: departmentStats.map((d: any) => d.budget * 10), backgroundColor: '#e2e8f0', borderRadius: 4, barPercentage: 0.6 }
    ]
  };

  const barChartOptions = {
    indexAxis: 'y' as const, responsive: true, maintainAspectRatio: false,
    plugins: { legend: { display: false }, tooltip: { backgroundColor: '#1e293b', titleColor: '#fff', bodyColor: '#fff', padding: 12 } },
    scales: { x: { display: false, grid: { display: false } }, y: { grid: { display: false }, border: { display: false } } }
  };

  const leaveData = {
    labels: leaveTrends.map((lt: any) => lt.label.charAt(0).toUpperCase() + lt.label.slice(1)),
    datasets: [{
      data: leaveTrends.map((lt: any) => lt.count),
      backgroundColor: ['#eab308', '#22c55e', '#ef4444'],
      borderWidth: 0, cutout: '75%',
    }]
  };

  const leaveOptions = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { position: 'bottom' as const } }
  };

  return (
    <div className="space-y-8">

      {/* ── Header + Tabs ─────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-display font-bold text-slate-900 tracking-tight">System Overview</h2>
          <p className="text-slate-500 mt-1 font-medium">Live server analytics — v2.0</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex bg-slate-100 rounded-xl p-1">
            {(['overview', 'rules'] as Tab[]).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold capitalize transition-all duration-200 ${
                  activeTab === tab
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {tab === 'rules' ? <><Settings className="w-4 h-4 inline mr-1" />Rules</> : 'Overview'}
              </button>
            ))}
          </div>
          <Button variant="secondary" className="shadow-sm">
            <Download className="w-4 h-4 mr-2" /> Export
          </Button>
        </div>
      </div>

      {activeTab === 'rules' ? (
        <PayrollRulesManager />
      ) : (
        <>
          {/* ── Anomaly Alert Banner ───────────────────────────────────────── */}
          {anomalies.length > 0 && (
            <div className="flex items-start gap-4 bg-amber-50 border border-amber-200 rounded-2xl p-4">
              <div className="p-2 bg-amber-100 rounded-xl">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-amber-800">
                  {anomalies.length} Salary Anomaly{anomalies.length > 1 ? 's' : ''} Detected
                </p>
                <p className="text-sm text-amber-700 mt-0.5">
                  {anomalies.slice(0, 2).map((a: any) => `${a.name} (₹${a.net_pay?.toLocaleString()})`).join(', ')}
                  {anomalies.length > 2 ? ` and ${anomalies.length - 2} more...` : ''}
                  {' '}have net pay exceeding 1.5× department average.
                </p>
              </div>
            </div>
          )}

          {/* ── Stats Grid ────────────────────────────────────────────────── */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: 'Total Employees',       value: stats.totalEmployees,                              icon: Users,        gradient: 'from-blue-500 to-blue-600',    change: '+2%',  trend: 'up' },
              { label: 'Total Departments',     value: stats.totalDepartments,                            icon: Building2,    gradient: 'from-indigo-500 to-indigo-600', change: 'Stable', trend: 'neutral' },
              { label: 'Monthly Payroll',       value: `₹${(stats.latestMonthlyPayroll/1000).toFixed(1)}k`, icon: CreditCard, gradient: 'from-emerald-500 to-emerald-600', change: '+1.4%', trend: 'up' },
              { label: 'Pending Leaves',        value: stats.pendingRequests,                             icon: TrendingUp,   gradient: 'from-amber-500 to-amber-600',  change: '-12%', trend: 'down' },
            ].map((stat, i) => (
              <div key={i} className="relative overflow-hidden bg-white rounded-2xl shadow-soft border border-slate-100 p-6 group hover:shadow-lg transition-all duration-300">
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
                  {stat.trend === 'up'   && <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-bold flex items-center text-xs"><ArrowUpRight className="w-3 h-3 mr-1" />{stat.change}</span>}
                  {stat.trend === 'down' && <span className="text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full font-bold flex items-center text-xs"><ArrowDownRight className="w-3 h-3 mr-1" />{stat.change}</span>}
                  {stat.trend === 'neutral' && <span className="text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full font-bold text-xs">{stat.change}</span>}
                  <span className="text-slate-400 ml-2 text-xs font-medium">vs last month</span>
                </div>
              </div>
            ))}
          </div>

          {/* ── Charts Row ────────────────────────────────────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="col-span-1 lg:col-span-2 p-6">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 font-display">Payroll Analytics</h3>
                  <p className="text-sm text-slate-500">Monthly Spend Trend</p>
                </div>
              </div>
              <div className="h-80"><Line data={lineChartData} options={lineChartOptions} /></div>
            </Card>

            <Card className="col-span-1 p-6">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-lg font-bold text-slate-900 font-display">Leave Trends</h3>
                <button className="text-slate-400 hover:text-brand-600"><MoreHorizontal className="w-5 h-5" /></button>
              </div>
              <div className="h-64 mt-4"><Doughnut data={leaveData} options={leaveOptions} /></div>
            </Card>
          </div>

          {/* ── Top Earners + Dept Stats ──────────────────────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

            {/* Top Earners */}
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <div className="p-2 bg-amber-50 rounded-xl"><Trophy className="w-5 h-5 text-amber-500" /></div>
                <h3 className="text-lg font-bold text-slate-900 font-display">Top Earners</h3>
              </div>
              {topEarners.length === 0 ? (
                <p className="text-slate-400 text-sm text-center py-8">No payroll data yet.</p>
              ) : (
                <div className="space-y-3">
                  {topEarners.map((emp: any, i: number) => (
                    <div key={emp.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
                      <div className="flex items-center gap-3">
                        <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                          i === 0 ? 'bg-amber-400' : i === 1 ? 'bg-slate-400' : i === 2 ? 'bg-orange-400' : 'bg-slate-300'
                        }`}>{i + 1}</span>
                        <div>
                          <p className="font-semibold text-slate-800 text-sm">{emp.name}</p>
                          <p className="text-xs text-slate-400">{emp.department} · {emp.position}</p>
                        </div>
                      </div>
                      <span className="font-bold text-emerald-600 text-sm">₹{emp.net_pay?.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {/* Department Stats */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-slate-900 font-display">Department Staffing</h3>
                <button className="text-slate-400 hover:text-brand-600"><MoreHorizontal className="w-5 h-5" /></button>
              </div>
              <div className="h-64"><Bar data={barChartData} options={barChartOptions as any} /></div>
            </Card>
          </div>

          {/* ── Salary Anomalies Table (if any) ──────────────────────────── */}
          {anomalies.length > 0 && (
            <Card className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <div className="p-2 bg-red-50 rounded-xl"><AlertTriangle className="w-5 h-5 text-red-500" /></div>
                <h3 className="text-lg font-bold text-slate-900 font-display">Salary Anomalies</h3>
                <span className="ml-auto text-xs bg-red-100 text-red-700 font-bold px-2 py-1 rounded-full">{anomalies.length} flagged</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100">
                      {['Employee', 'Department', 'Position', 'Net Pay', 'Month/Year'].map(h => (
                        <th key={h} className="text-left py-2 px-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {anomalies.map((a: any, i: number) => (
                      <tr key={i} className="border-b border-slate-50 hover:bg-red-50 transition-colors">
                        <td className="py-3 px-3 font-semibold text-slate-800">{a.name}</td>
                        <td className="py-3 px-3 text-slate-600">{a.department}</td>
                        <td className="py-3 px-3 text-slate-600">{a.position}</td>
                        <td className="py-3 px-3 font-bold text-red-600">₹{a.net_pay?.toLocaleString()}</td>
                        <td className="py-3 px-3 text-slate-400">{a.month}/{a.year}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}
        </>
      )}
    </div>
  );
};

export default AdminDashboard;