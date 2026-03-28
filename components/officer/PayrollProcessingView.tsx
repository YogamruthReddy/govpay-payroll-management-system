import React from 'react';
import { Card, Button } from '../ui/UIComponents';
import { FileText, Calendar, DollarSign, Users, Download, Play, CheckCircle } from 'lucide-react';

const PayrollProcessingView: React.FC = () => {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-display font-bold text-slate-900">Payroll Processing</h2>
                    <p className="text-slate-500 mt-1">Generate and manage department payroll</p>
                </div>
                <Button variant="primary" className="shadow-lg">
                    <Play className="w-4 h-4 mr-2" />
                    Start Payroll Run
                </Button>
            </div>

            {/* Current Period Card */}
            <Card className="p-8 bg-gradient-to-br from-brand-900 to-brand-800 text-white">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-brand-200 text-sm font-semibold uppercase tracking-wider mb-2">Current Payroll Period</p>
                        <h3 className="text-4xl font-bold mb-4">January 2024</h3>
                        <div className="flex items-center gap-6">
                            <div className="flex items-center">
                                <Calendar className="w-5 h-5 mr-2 text-brand-300" />
                                <span className="text-brand-100">Processing Window: Jan 1-31</span>
                            </div>
                            <div className="flex items-center">
                                <Users className="w-5 h-5 mr-2 text-brand-300" />
                                <span className="text-brand-100">52 Employees</span>
                            </div>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-brand-200 text-sm mb-2">Estimated Total</p>
                        <p className="text-5xl font-bold">$156K</p>
                    </div>
                </div>
            </Card>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-500 font-medium">Total Employees</p>
                            <h3 className="text-3xl font-bold text-slate-900 mt-2">52</h3>
                        </div>
                        <div className="p-3 bg-blue-100 rounded-xl">
                            <Users className="w-6 h-6 text-blue-600" />
                        </div>
                    </div>
                    <p className="text-xs text-slate-500 mt-3">In your department</p>
                </Card>
                <Card className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-500 font-medium">Verified Records</p>
                            <h3 className="text-3xl font-bold text-slate-900 mt-2">48</h3>
                        </div>
                        <div className="p-3 bg-emerald-100 rounded-xl">
                            <CheckCircle className="w-6 h-6 text-emerald-600" />
                        </div>
                    </div>
                    <p className="text-xs text-emerald-600 mt-3 font-semibold">92% complete</p>
                </Card>
                <Card className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-500 font-medium">Pending Review</p>
                            <h3 className="text-3xl font-bold text-slate-900 mt-2">4</h3>
                        </div>
                        <div className="p-3 bg-amber-100 rounded-xl">
                            <FileText className="w-6 h-6 text-amber-600" />
                        </div>
                    </div>
                    <p className="text-xs text-slate-500 mt-3">Needs attention</p>
                </Card>
                <Card className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-500 font-medium">Avg. Salary</p>
                            <h3 className="text-3xl font-bold text-slate-900 mt-2">$3K</h3>
                        </div>
                        <div className="p-3 bg-purple-100 rounded-xl">
                            <DollarSign className="w-6 h-6 text-purple-600" />
                        </div>
                    </div>
                    <p className="text-xs text-slate-500 mt-3">Per employee</p>
                </Card>
            </div>

            {/* Processing Steps */}
            <Card className="p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-6 font-display">Payroll Processing Steps</h3>
                <div className="space-y-4">
                    {[
                        { step: 1, title: 'Verify Attendance Records', status: 'completed', desc: 'Ensure all attendance data is accurate' },
                        { step: 2, title: 'Review Leave Approvals', status: 'completed', desc: 'All leave requests processed' },
                        { step: 3, title: 'Calculate Deductions', status: 'in-progress', desc: 'Tax and benefit deductions' },
                        { step: 4, title: 'Generate Salary Slips', status: 'pending', desc: 'Create individual payslips' },
                        { step: 5, title: 'Submit for Disbursement', status: 'pending', desc: 'Final approval and payment' },
                    ].map((item) => (
                        <div key={item.step} className="flex items-center p-4 bg-slate-50 rounded-xl">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold mr-4 ${item.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                                    item.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
                                        'bg-slate-200 text-slate-500'
                                }`}>
                                {item.status === 'completed' ? <CheckCircle className="w-5 h-5" /> : item.step}
                            </div>
                            <div className="flex-1">
                                <h4 className="font-semibold text-slate-900">{item.title}</h4>
                                <p className="text-sm text-slate-500">{item.desc}</p>
                            </div>
                            {item.status === 'completed' && (
                                <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-semibold">
                                    Completed
                                </span>
                            )}
                            {item.status === 'in-progress' && (
                                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                                    In Progress
                                </span>
                            )}
                        </div>
                    ))}
                </div>
            </Card>

            {/* Actions */}
            <Card className="p-6">
                <h3 className="text-lg font-bold text-slate-900 mb-4 font-display">Quick Actions</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Button variant="secondary" className="justify-center">
                        <Download className="w-4 h-4 mr-2" />
                        Download Attendance Report
                    </Button>
                    <Button variant="secondary" className="justify-center">
                        <FileText className="w-4 h-4 mr-2" />
                        View Previous Payrolls
                    </Button>
                    <Button variant="secondary" className="justify-center">
                        <Users className="w-4 h-4 mr-2" />
                        Employee Salary Details
                    </Button>
                </div>
            </Card>
        </div>
    );
};

export default PayrollProcessingView;
