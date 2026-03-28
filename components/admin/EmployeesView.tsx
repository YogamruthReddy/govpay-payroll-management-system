import React, { useState } from 'react';
import { Card, Table, Badge, Button } from '../ui/UIComponents';
import { Users, Plus, Search, Filter, Download, Mail, Phone } from 'lucide-react';

const EmployeesView: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const employees = [
        { id: 'EMP-001', name: 'James Anderson', email: 'james.anderson@gov.in', phone: '+91 98765 43210', department: 'IT', position: 'Senior Developer', grade: 'B-14', status: 'Active', joinDate: '2019-01-15' },
        { id: 'EMP-002', name: 'Sarah Connor', email: 'sarah.connor@gov.in', phone: '+91 98765 43211', department: 'HR', position: 'HR Officer', grade: 'B-12', status: 'Active', joinDate: '2020-03-22' },
        { id: 'EMP-003', name: 'Robert Wilson', email: 'robert.wilson@gov.in', phone: '+91 98765 43212', department: 'Admin', position: 'System Admin', grade: 'A-15', status: 'Active', joinDate: '2018-06-10' },
        { id: 'EMP-004', name: 'Emily Davis', email: 'emily.davis@gov.in', phone: '+91 98765 43213', department: 'Finance', position: 'Accountant', grade: 'B-13', status: 'Active', joinDate: '2021-02-18' },
        { id: 'EMP-005', name: 'Michael Brown', email: 'michael.brown@gov.in', phone: '+91 98765 43214', department: 'Operations', position: 'Manager', grade: 'A-14', status: 'On Leave', joinDate: '2017-11-05' },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-display font-bold text-slate-900">Employee Management</h2>
                    <p className="text-slate-500 mt-1">View and manage all government employees</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="secondary">
                        <Download className="w-4 h-4 mr-2" />
                        Export
                    </Button>
                    <Button variant="primary" className="shadow-lg">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Employee
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-500 font-medium">Total Employees</p>
                            <h3 className="text-3xl font-bold text-slate-900 mt-2">1,247</h3>
                        </div>
                        <div className="p-3 bg-blue-100 rounded-xl">
                            <Users className="w-6 h-6 text-blue-600" />
                        </div>
                    </div>
                    <p className="text-xs text-emerald-600 mt-3 font-semibold">+12% from last month</p>
                </Card>
                <Card className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-500 font-medium">Active</p>
                            <h3 className="text-3xl font-bold text-slate-900 mt-2">1,198</h3>
                        </div>
                        <div className="p-3 bg-emerald-100 rounded-xl">
                            <Users className="w-6 h-6 text-emerald-600" />
                        </div>
                    </div>
                    <p className="text-xs text-slate-500 mt-3">96% of total</p>
                </Card>
                <Card className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-500 font-medium">On Leave</p>
                            <h3 className="text-3xl font-bold text-slate-900 mt-2">34</h3>
                        </div>
                        <div className="p-3 bg-amber-100 rounded-xl">
                            <Users className="w-6 h-6 text-amber-600" />
                        </div>
                    </div>
                    <p className="text-xs text-slate-500 mt-3">2.7% of total</p>
                </Card>
                <Card className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-500 font-medium">New This Month</p>
                            <h3 className="text-3xl font-bold text-slate-900 mt-2">15</h3>
                        </div>
                        <div className="p-3 bg-purple-100 rounded-xl">
                            <Users className="w-6 h-6 text-purple-600" />
                        </div>
                    </div>
                    <p className="text-xs text-emerald-600 mt-3 font-semibold">+3 from last month</p>
                </Card>
            </div>

            {/* Search and Filter */}
            <Card className="p-4">
                <div className="flex gap-3">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search by name, ID, email, or department..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all"
                        />
                    </div>
                    <Button variant="secondary">
                        <Filter className="w-4 h-4 mr-2" />
                        Filter
                    </Button>
                </div>
            </Card>

            {/* Employees Table */}
            <Card noPadding>
                <div className="p-6 border-b border-slate-100">
                    <h3 className="text-lg font-bold text-slate-900 font-display">All Employees</h3>
                </div>
                <Table headers={['Employee', 'Contact', 'Department', 'Position', 'Grade', 'Join Date', 'Status']}>
                    {employees.map((emp) => (
                        <tr key={emp.id} className="hover:bg-slate-50 transition-colors cursor-pointer">
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white font-bold mr-3">
                                        {emp.name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-slate-900">{emp.name}</p>
                                        <p className="text-xs text-slate-500">{emp.id}</p>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="space-y-1">
                                    <div className="flex items-center text-xs text-slate-600">
                                        <Mail className="w-3 h-3 mr-1.5 text-slate-400" />
                                        {emp.email}
                                    </div>
                                    <div className="flex items-center text-xs text-slate-600">
                                        <Phone className="w-3 h-3 mr-1.5 text-slate-400" />
                                        {emp.phone}
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                                    {emp.department}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{emp.position}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className="px-2 py-1 bg-slate-100 text-slate-700 rounded text-xs font-mono font-semibold">
                                    {emp.grade}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{emp.joinDate}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <Badge variant={emp.status === 'Active' ? 'success' : 'warning'}>{emp.status}</Badge>
                            </td>
                        </tr>
                    ))}
                </Table>
            </Card>
        </div>
    );
};

export default EmployeesView;
