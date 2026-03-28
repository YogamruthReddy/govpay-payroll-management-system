import React, { useState } from 'react';
import { Card, Table, Badge, Button } from '../ui/UIComponents';
import { Building2, Users, Plus, Edit, Trash2, Search } from 'lucide-react';

const DepartmentsView: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const departments = [
        { id: 1, name: 'Information Technology', head: 'Dr. Sarah Johnson', employees: 45, budget: '$850,000', status: 'Active' },
        { id: 2, name: 'Human Resources', head: 'Mr. Michael Chen', employees: 12, budget: '$320,000', status: 'Active' },
        { id: 3, name: 'Finance & Accounts', head: 'Mrs. Priya Sharma', employees: 28, budget: '$560,000', status: 'Active' },
        { id: 4, name: 'Public Relations', head: 'Mr. David Miller', employees: 18, budget: '$420,000', status: 'Active' },
        { id: 5, name: 'Operations', head: 'Dr. Lisa Anderson', employees: 52, budget: '$920,000', status: 'Active' },
        { id: 6, name: 'Legal Affairs', head: 'Mr. Robert Taylor', employees: 15, budget: '$380,000', status: 'Active' },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-display font-bold text-slate-900">Departments</h2>
                    <p className="text-slate-500 mt-1">Manage organizational departments and their resources</p>
                </div>
                <Button variant="primary" className="shadow-lg">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Department
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-500 font-medium">Total Departments</p>
                            <h3 className="text-3xl font-bold text-slate-900 mt-2">{departments.length}</h3>
                        </div>
                        <div className="p-3 bg-blue-100 rounded-xl">
                            <Building2 className="w-6 h-6 text-blue-600" />
                        </div>
                    </div>
                </Card>
                <Card className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-500 font-medium">Total Employees</p>
                            <h3 className="text-3xl font-bold text-slate-900 mt-2">170</h3>
                        </div>
                        <div className="p-3 bg-emerald-100 rounded-xl">
                            <Users className="w-6 h-6 text-emerald-600" />
                        </div>
                    </div>
                </Card>
                <Card className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-500 font-medium">Total Budget</p>
                            <h3 className="text-3xl font-bold text-slate-900 mt-2">$3.45M</h3>
                        </div>
                        <div className="p-3 bg-purple-100 rounded-xl">
                            <Building2 className="w-6 h-6 text-purple-600" />
                        </div>
                    </div>
                </Card>
                <Card className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-500 font-medium">Avg. Team Size</p>
                            <h3 className="text-3xl font-bold text-slate-900 mt-2">28</h3>
                        </div>
                        <div className="p-3 bg-amber-100 rounded-xl">
                            <Users className="w-6 h-6 text-amber-600" />
                        </div>
                    </div>
                </Card>
            </div>

            {/* Search Bar */}
            <Card className="p-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search departments..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all"
                    />
                </div>
            </Card>

            {/* Departments Table */}
            <Card noPadding>
                <div className="p-6 border-b border-slate-100">
                    <h3 className="text-lg font-bold text-slate-900 font-display">All Departments</h3>
                </div>
                <Table headers={['Department', 'Head', 'Employees', 'Budget', 'Status', 'Actions']}>
                    {departments.map((dept) => (
                        <tr key={dept.id} className="hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                    <div className="w-10 h-10 rounded-lg bg-brand-100 flex items-center justify-center text-brand-600 font-bold mr-3">
                                        {dept.name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-slate-900">{dept.name}</p>
                                        <p className="text-xs text-slate-500">ID: DEPT-{dept.id.toString().padStart(3, '0')}</p>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{dept.head}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                    <Users className="w-4 h-4 text-slate-400 mr-2" />
                                    <span className="text-sm font-medium text-slate-900">{dept.employees}</span>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-900">{dept.budget}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <Badge variant="success">{dept.status}</Badge>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                <div className="flex items-center gap-2">
                                    <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                        <Edit className="w-4 h-4" />
                                    </button>
                                    <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                        <Trash2 className="w-4 h-4" />
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

export default DepartmentsView;
