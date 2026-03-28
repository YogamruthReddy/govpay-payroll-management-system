import React, { useEffect, useState } from 'react';
import { Card, Button, Badge } from './ui/UIComponents';
import { User } from '../types';
import { Download, Calendar, Briefcase, FileText, ChevronRight } from 'lucide-react';
import { payrollAPI, employeeAPI } from '../services/api';

interface Props {
    user: User;
}

const EmployeeDashboard: React.FC<Props> = ({ user }) => {
    const [payrolls, setPayrolls] = useState<any[]>([]);
    const [serviceHistory, setServiceHistory] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const employeeId = parseInt(user.id);

                // Fetch payroll data
                const payrollData = await payrollAPI.getByEmployee(employeeId);
                setPayrolls(payrollData);

                // Fetch service history
                const historyData = await employeeAPI.getServiceHistory(employeeId);
                setServiceHistory(historyData);
            } catch (err: any) {
                setError(err.response?.data?.error || 'Failed to load data');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user.id]);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-600">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
                {error}
            </div>
        );
    }

    // Get latest payroll
    const latestPayroll = payrolls[0] || {
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
        basic_pay: 0,
        hra: 0,
        deductions: 0,
        net_pay: 0
    };

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const payslipMonth = monthNames[latestPayroll.month - 1] || 'N/A';
    const payslipYear = latestPayroll.year;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Profile & Quick Actions */}
            <div className="lg:col-span-4 space-y-6">
                <div className="bg-white rounded-2xl shadow-soft border border-slate-100 overflow-hidden relative group">
                    <div className="h-32 bg-gradient-to-r from-brand-800 to-brand-600"></div>
                    <div className="px-6 pb-6 relative">
                        <div className="w-24 h-24 bg-white rounded-2xl p-1 absolute -top-12 left-1/2 transform -translate-x-1/2 shadow-lg">
                            <div className="w-full h-full bg-brand-100 rounded-xl flex items-center justify-center text-3xl font-bold text-brand-700">
                                {user.name.charAt(0)}
                            </div>
                        </div>

                        <div className="pt-16 text-center">
                            <h2 className="text-xl font-bold text-slate-900 font-display">{user.name}</h2>
                            <p className="text-brand-600 font-medium text-sm">Senior Developer</p>
                            <div className="mt-4 flex justify-center gap-2">
                                <Badge variant="brand">ID: EMP-889</Badge>
                                <Badge variant="success">Active Status</Badge>
                            </div>
                        </div>

                        <div className="mt-8 space-y-4">
                            <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                                <span className="text-sm text-slate-500 font-medium">Department</span>
                                <span className="text-sm font-semibold text-slate-900">Technology</span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                                <span className="text-sm text-slate-500 font-medium">Joined</span>
                                <span className="text-sm font-semibold text-slate-900">Jan 15, 2019</span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-slate-50 rounded-xl">
                                <span className="text-sm text-slate-500 font-medium">Grade</span>
                                <span className="text-sm font-semibold text-slate-900">B-14</span>
                            </div>
                        </div>
                    </div>
                </div>

                <Card className="p-6">
                    <h3 className="font-bold text-slate-900 mb-4 font-display">Quick Actions</h3>
                    <div className="space-y-3">
                        <button className="w-full flex items-center justify-between p-4 rounded-xl border border-slate-200 hover:border-brand-500 hover:bg-brand-50 hover:text-brand-700 transition-all group bg-white shadow-sm">
                            <div className="flex items-center">
                                <Calendar className="w-5 h-5 mr-3 text-slate-400 group-hover:text-brand-500" />
                                <span className="font-medium text-sm">Apply for Leave</span>
                            </div>
                            <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-brand-500" />
                        </button>
                        <button className="w-full flex items-center justify-between p-4 rounded-xl border border-slate-200 hover:border-brand-500 hover:bg-brand-50 hover:text-brand-700 transition-all group bg-white shadow-sm">
                            <div className="flex items-center">
                                <FileText className="w-5 h-5 mr-3 text-slate-400 group-hover:text-brand-500" />
                                <span className="font-medium text-sm">Request Tax Form</span>
                            </div>
                            <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-brand-500" />
                        </button>
                    </div>
                </Card>
            </div>

            {/* Right Column: Payslips & History */}
            <div className="lg:col-span-8 space-y-8">

                {/* Recent Payslip */}
                <div className="bg-brand-900 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-20 -mt-20 blur-3xl"></div>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 relative z-10">
                        <div>
                            <h3 className="text-2xl font-bold font-display">Recent Payslip</h3>
                            <p className="text-brand-200 text-sm">Generated for {payslipMonth} {payslipYear}</p>
                        </div>
                        <div className="mt-4 sm:mt-0 text-3xl font-bold text-white tracking-tight">
                            ${latestPayroll.net_pay?.toFixed(2) || '0.00'}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 relative z-10 mb-8">
                        <div className="bg-brand-800/50 p-4 rounded-xl border border-brand-700/50">
                            <p className="text-brand-300 text-xs uppercase tracking-wider mb-1">Basic Pay</p>
                            <p className="font-semibold text-lg">${latestPayroll.basic_pay?.toFixed(0) || '0'}</p>
                        </div>
                        <div className="bg-brand-800/50 p-4 rounded-xl border border-brand-700/50">
                            <p className="text-brand-300 text-xs uppercase tracking-wider mb-1">HRA</p>
                            <p className="font-semibold text-lg">${latestPayroll.hra?.toFixed(0) || '0'}</p>
                        </div>
                        <div className="bg-brand-800/50 p-4 rounded-xl border border-brand-700/50">
                            <p className="text-brand-300 text-xs uppercase tracking-wider mb-1">Deductions</p>
                            <p className="font-semibold text-lg text-red-300">-${latestPayroll.deductions?.toFixed(0) || '0'}</p>
                        </div>
                        <div className="bg-brand-800/50 p-4 rounded-xl border border-brand-700/50">
                            <p className="text-brand-300 text-xs uppercase tracking-wider mb-1">Net Pay</p>
                            <p className="font-semibold text-lg text-emerald-300">${latestPayroll.net_pay?.toFixed(0) || '0'}</p>
                        </div>
                    </div>

                    <div className="flex gap-4 relative z-10">
                        <Button className="bg-white text-brand-900 hover:bg-brand-50 border-0 flex-1">Download PDF</Button>
                        <Button variant="outline" className="border-brand-700 text-brand-100 hover:bg-brand-800 hover:text-white hover:border-brand-600 flex-1">View History</Button>
                    </div>
                </div>

                <Card className="p-8">
                    <h3 className="text-xl font-bold text-slate-900 mb-8 font-display">Service Timeline</h3>
                    {serviceHistory.length === 0 ? (
                        <p className="text-slate-500 text-center py-8">No service history available</p>
                    ) : (
                        <div className="relative border-l-2 border-slate-100 ml-3 space-y-10">
                            {serviceHistory.map((item, i) => {
                                const eventDate = new Date(item.event_date);
                                const year = eventDate.getFullYear();
                                const formattedDate = eventDate.toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                });

                                return (
                                    <div key={i} className="relative pl-10 group">
                                        {/* Dot */}
                                        <div className={`absolute -left-[9px] top-1 w-5 h-5 rounded-full border-4 border-white shadow-sm transition-transform group-hover:scale-110
                                            ${item.event_type === 'Promotion' ? 'bg-amber-500' : item.event_type === 'Transfer' ? 'bg-brand-500' : 'bg-emerald-500'}`}
                                        />

                                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start p-4 rounded-xl hover:bg-slate-50 transition-colors -mt-3">
                                            <div className="flex-1">
                                                <h4 className="text-lg font-bold text-slate-900">{item.title}</h4>
                                                <p className="text-sm text-slate-600 mt-2 leading-relaxed">{item.description}</p>
                                                <p className="text-sm text-slate-400 mt-2">{formattedDate}</p>
                                                <div className="mt-3">
                                                    <Badge variant={item.event_type === 'Promotion' ? 'warning' : item.event_type === 'Transfer' ? 'brand' : 'success'}>
                                                        {item.event_type}
                                                    </Badge>
                                                </div>
                                            </div>
                                            <span className="text-sm font-bold text-slate-400 mt-1 sm:mt-0 font-display bg-white px-2 py-1 rounded border border-slate-100 shadow-sm">{year}</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
};

export default EmployeeDashboard;