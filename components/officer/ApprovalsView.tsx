import React from 'react';
import { Card, Table, Badge, Button } from '../ui/UIComponents';
import { CheckCircle, XCircle, AlertCircle, Calendar, User, Clock } from 'lucide-react';

const ApprovalsView: React.FC = () => {
    const pendingLeaves = [
        { id: '1', employeeName: 'James Anderson', type: 'Sick Leave', startDate: '2024-01-20', endDate: '2024-01-22', days: 3, reason: 'Medical emergency', status: 'Pending' },
        { id: '2', employeeName: 'Sarah Connor', type: 'Vacation', startDate: '2024-02-10', endDate: '2024-02-17', days: 8, reason: 'Family vacation', status: 'Pending' },
        { id: '3', employeeName: 'Michael Brown', type: 'Casual Leave', startDate: '2024-01-25', endDate: '2024-01-26', days: 2, reason: 'Personal work', status: 'Pending' },
        { id: '4', employeeName: 'Emily Davis', type: 'Sick Leave', startDate: '2024-01-18', endDate: '2024-01-19', days: 2, reason: 'Fever and cold', status: 'Pending' },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-display font-bold text-slate-900">Leave Approvals</h2>
                    <p className="text-slate-500 mt-1">Review and approve pending leave requests</p>
                </div>
            </div>

            {/* Alert */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start">
                <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                    <h3 className="font-semibold text-amber-900">Action Required</h3>
                    <p className="text-sm text-amber-700 mt-1">
                        You have {pendingLeaves.length} leave requests pending approval. Please review them to avoid payroll processing delays.
                    </p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-500 font-medium">Pending</p>
                            <h3 className="text-3xl font-bold text-slate-900 mt-2">{pendingLeaves.length}</h3>
                        </div>
                        <div className="p-3 bg-amber-100 rounded-xl">
                            <Clock className="w-6 h-6 text-amber-600" />
                        </div>
                    </div>
                </Card>
                <Card className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-500 font-medium">Approved Today</p>
                            <h3 className="text-3xl font-bold text-slate-900 mt-2">7</h3>
                        </div>
                        <div className="p-3 bg-emerald-100 rounded-xl">
                            <CheckCircle className="w-6 h-6 text-emerald-600" />
                        </div>
                    </div>
                </Card>
                <Card className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-500 font-medium">Rejected</p>
                            <h3 className="text-3xl font-bold text-slate-900 mt-2">2</h3>
                        </div>
                        <div className="p-3 bg-red-100 rounded-xl">
                            <XCircle className="w-6 h-6 text-red-600" />
                        </div>
                    </div>
                </Card>
                <Card className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-500 font-medium">This Month</p>
                            <h3 className="text-3xl font-bold text-slate-900 mt-2">45</h3>
                        </div>
                        <div className="p-3 bg-blue-100 rounded-xl">
                            <Calendar className="w-6 h-6 text-blue-600" />
                        </div>
                    </div>
                </Card>
            </div>

            {/* Pending Requests Table */}
            <Card noPadding>
                <div className="p-6 border-b border-slate-100">
                    <h3 className="text-lg font-bold text-slate-900 font-display">Pending Leave Requests</h3>
                </div>
                <Table headers={['Employee', 'Type', 'Duration', 'Days', 'Reason', 'Status', 'Actions']}>
                    {pendingLeaves.map((leave) => (
                        <tr key={leave.id} className="hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white font-bold mr-3">
                                        {leave.employeeName.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-slate-900">{leave.employeeName}</p>
                                        <p className="text-xs text-slate-500">ID: EMP-{leave.id.padStart(3, '0')}</p>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                                    {leave.type}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                                <div className="flex items-center">
                                    <Calendar className="w-4 h-4 mr-2 text-slate-400" />
                                    {leave.startDate} to {leave.endDate}
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-900">
                                {leave.days} days
                            </td>
                            <td className="px-6 py-4 max-w-xs">
                                <p className="text-sm text-slate-600 truncate">{leave.reason}</p>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <Badge variant="warning">Pending Review</Badge>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center gap-2">
                                    <button className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" title="Approve">
                                        <CheckCircle className="w-5 h-5" />
                                    </button>
                                    <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Reject">
                                        <XCircle className="w-5 h-5" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </Table>
            </Card>
        </div>
    );
};

export default ApprovalsView;
