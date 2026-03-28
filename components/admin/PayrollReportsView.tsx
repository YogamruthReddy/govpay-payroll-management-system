import React from 'react';
import { Card, Button } from '../ui/UIComponents';
import { FileText, Download, Calendar, DollarSign, TrendingUp, Filter } from 'lucide-react';

const PayrollReportsView: React.FC = () => {
    const reports = [
        { id: 1, title: 'Monthly Payroll Summary', period: 'October 2023', amount: '$3,050,000', status: 'Completed', date: '2023-10-31' },
        { id: 2, title: 'Monthly Payroll Summary', period: 'September 2023', amount: '$2,980,000', status: 'Completed', date: '2023-09-30' },
        { id: 3, title: 'Monthly Payroll Summary', period: 'August 2023', amount: '$3,120,000', status: 'Completed', date: '2023-08-31' },
        { id: 4, title: 'Quarterly Tax Report', period: 'Q3 2023', amount: '$9,150,000', status: 'Completed', date: '2023-09-30' },
        { id: 5, title: 'Annual Benefits Report', period: '2023', amount: '$1,250,000', status: 'In Progress', date: '2023-12-31' },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-display font-bold text-slate-900">Payroll Reports</h2>
                    <p className="text-slate-500 mt-1">View and download comprehensive payroll reports</p>
                </div>
                <Button variant="primary" className="shadow-lg">
                    <FileText className="w-4 h-4 mr-2" />
                    Generate Report
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-500 font-medium">This Month</p>
                            <h3 className="text-2xl font-bold text-slate-900 mt-2">$3.05M</h3>
                        </div>
                        <div className="p-3 bg-emerald-100 rounded-xl">
                            <DollarSign className="w-6 h-6 text-emerald-600" />
                        </div>
                    </div>
                    <p className="text-xs text-emerald-600 mt-3 font-semibold">+2.3% from last month</p>
                </Card>
                <Card className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-500 font-medium">YTD Total</p>
                            <h3 className="text-2xl font-bold text-slate-900 mt-2">$30.2M</h3>
                        </div>
                        <div className="p-3 bg-blue-100 rounded-xl">
                            <TrendingUp className="w-6 h-6 text-blue-600" />
                        </div>
                    </div>
                    <p className="text-xs text-slate-500 mt-3">Jan - Oct 2023</p>
                </Card>
                <Card className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-500 font-medium">Avg. Per Employee</p>
                            <h3 className="text-2xl font-bold text-slate-900 mt-2">$2,446</h3>
                        </div>
                        <div className="p-3 bg-purple-100 rounded-xl">
                            <DollarSign className="w-6 h-6 text-purple-600" />
                        </div>
                    </div>
                    <p className="text-xs text-slate-500 mt-3">Monthly average</p>
                </Card>
                <Card className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-500 font-medium">Total Reports</p>
                            <h3 className="text-2xl font-bold text-slate-900 mt-2">127</h3>
                        </div>
                        <div className="p-3 bg-amber-100 rounded-xl">
                            <FileText className="w-6 h-6 text-amber-600" />
                        </div>
                    </div>
                    <p className="text-xs text-slate-500 mt-3">All time</p>
                </Card>
            </div>

            {/* Filter Bar */}
            <Card className="p-4">
                <div className="flex gap-3">
                    <select className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all">
                        <option>All Report Types</option>
                        <option>Monthly Summary</option>
                        <option>Quarterly Tax</option>
                        <option>Annual Benefits</option>
                    </select>
                    <select className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all">
                        <option>2023</option>
                        <option>2022</option>
                        <option>2021</option>
                    </select>
                    <Button variant="secondary">
                        <Filter className="w-4 h-4 mr-2" />
                        Apply Filters
                    </Button>
                </div>
            </Card>

            {/* Reports List */}
            <div className="grid grid-cols-1 gap-4">
                {reports.map((report) => (
                    <Card key={report.id} className="p-6 hover:shadow-lg transition-shadow">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-brand-100 rounded-xl flex items-center justify-center">
                                    <FileText className="w-6 h-6 text-brand-600" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900">{report.title}</h3>
                                    <div className="flex items-center gap-4 mt-1">
                                        <div className="flex items-center text-sm text-slate-500">
                                            <Calendar className="w-4 h-4 mr-1.5" />
                                            {report.period}
                                        </div>
                                        <div className="flex items-center text-sm font-semibold text-slate-700">
                                            <DollarSign className="w-4 h-4 mr-1" />
                                            {report.amount}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="text-right">
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${report.status === 'Completed'
                                            ? 'bg-emerald-100 text-emerald-700'
                                            : 'bg-amber-100 text-amber-700'
                                        }`}>
                                        {report.status}
                                    </span>
                                    <p className="text-xs text-slate-500 mt-2">{report.date}</p>
                                </div>
                                <Button variant="secondary" size="sm">
                                    <Download className="w-4 h-4 mr-2" />
                                    Download
                                </Button>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default PayrollReportsView;
