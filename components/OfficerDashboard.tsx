import React, { useState } from 'react';
import { Card, Table, Badge, Button } from './ui/UIComponents';
import { CheckCircle, XCircle, Clock, Search, Filter, AlertCircle, FileText, User } from 'lucide-react';
import { LeaveRequest } from '../types';

const OfficerDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'approvals' | 'payroll' | 'employees'>('approvals');

  const pendingLeaves: LeaveRequest[] = [
    { id: '1', employeeName: 'Sarah Jenkins', type: 'Sick', startDate: '2023-11-01', endDate: '2023-11-03', status: 'Pending' },
    { id: '2', employeeName: 'Michael Chen', type: 'Vacation', startDate: '2023-12-20', endDate: '2023-12-28', status: 'Pending' },
    { id: '3', employeeName: 'David Miller', type: 'Casual', startDate: '2023-11-15', endDate: '2023-11-16', status: 'Pending' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-brand-900 to-brand-800 rounded-2xl p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10">
            <h2 className="text-3xl font-display font-bold">Department Management</h2>
            <p className="text-brand-100 mt-2 text-lg">Oversee staff, process payroll, and manage departmental requests.</p>
        </div>
        <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-white/10 to-transparent"></div>
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-brand-500 rounded-full blur-3xl opacity-50"></div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'approvals', label: 'Pending Approvals', icon: CheckCircle },
            { id: 'payroll', label: 'Payroll Processing', icon: FileText },
            { id: 'employees', label: 'Employee Directory', icon: User },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`
                group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-all duration-200
                ${activeTab === tab.id 
                  ? 'border-brand-600 text-brand-600' 
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}
              `}
            >
              <tab.icon className={`w-4 h-4 mr-2 ${activeTab === tab.id ? 'text-brand-600' : 'text-slate-400 group-hover:text-slate-500'}`} />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {activeTab === 'approvals' && (
        <div className="space-y-6 animate-fade-in">
           {/* Action needed alert */}
           <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-4 flex items-start shadow-sm">
             <div className="flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-amber-600" aria-hidden="true" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-semibold text-amber-800">Action Required</h3>
                <p className="text-sm text-amber-700 mt-1">
                  You have 3 leave requests requiring attention this week. Delayed approvals may affect payroll processing.
                </p>
              </div>
          </div>

          <Card noPadding>
            <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                <h3 className="text-lg font-bold text-slate-900 font-display">Leave Requests</h3>
            </div>
            <Table headers={['Employee', 'Type', 'Dates', 'Duration', 'Status', 'Actions']}>
              {pendingLeaves.map((leave) => (
                <tr key={leave.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                        <div className="h-9 w-9 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-sm font-bold text-slate-600 mr-3 shadow-inner border border-white">
                            {leave.employeeName.charAt(0)}
                        </div>
                        <div className="text-sm font-semibold text-slate-900">{leave.employeeName}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                      <span className="bg-slate-100 px-2 py-1 rounded text-xs font-medium border border-slate-200">{leave.type}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 font-medium">
                    {leave.startDate} <span className="text-slate-400 mx-1">to</span> {leave.endDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">3 Days</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge variant="warning">Pending Review</Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 p-2 rounded-full transition-colors" title="Approve">
                        <CheckCircle className="w-5 h-5" />
                    </button>
                    <button className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 p-2 rounded-full transition-colors" title="Reject">
                        <XCircle className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </Table>
          </Card>
        </div>
      )}

      {activeTab === 'payroll' && (
         <Card className="p-16 text-center border-dashed border-2 animate-fade-in">
            <div className="mx-auto w-20 h-20 bg-brand-50 rounded-full flex items-center justify-center mb-6 shadow-glow">
                <Clock className="w-10 h-10 text-brand-600" />
            </div>
            <h3 className="text-2xl font-display font-bold text-slate-900">Payroll Processing Cycle</h3>
            <p className="text-slate-500 mt-3 max-w-lg mx-auto text-lg">
                The payroll window for November 2023 is currently open. Please verify employee attendance records before generating slips.
            </p>
            <div className="mt-10 flex justify-center space-x-4">
                <Button variant="secondary" className="shadow-sm">View Reports</Button>
                <Button variant="primary" className="shadow-lg shadow-brand-500/30">Start Payroll Run</Button>
            </div>
         </Card>
      )}

      {activeTab === 'employees' && (
          <div className="space-y-6 animate-fade-in">
             <div className="flex gap-4 p-4 bg-white rounded-xl shadow-soft border border-slate-100">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                        type="text" 
                        placeholder="Search employee database..." 
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all"
                    />
                </div>
                <Button variant="secondary" className="flex items-center">
                    <Filter className="w-4 h-4 mr-2" /> Filter
                </Button>
                <Button variant="primary">Add Employee</Button>
             </div>
             <Card noPadding>
                <Table headers={['ID', 'Name', 'Designation', 'Joining Date', 'Status', 'Action']}>
                    {[
                        { id: 'EMP-001', name: 'John Doe', role: 'Senior Analyst', date: '2019-03-15', status: 'Active' },
                        { id: 'EMP-042', name: 'Jane Smith', role: 'Clerk', date: '2020-08-22', status: 'On Leave' },
                        { id: 'EMP-103', name: 'Robert Johnson', role: 'Officer', date: '2018-01-10', status: 'Active' },
                    ].map((emp, i) => (
                        <tr key={i} className="hover:bg-slate-50 cursor-pointer transition-colors group">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 font-mono">{emp.id}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className="text-sm font-semibold text-slate-900">{emp.name}</span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{emp.role}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{emp.date}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <Badge variant={emp.status === 'Active' ? 'success' : 'neutral'}>{emp.status}</Badge>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-brand-600 font-medium group-hover:text-brand-800">
                                View Profile
                            </td>
                        </tr>
                    ))}
                </Table>
             </Card>
          </div>
      )}
    </div>
  );
};

export default OfficerDashboard;