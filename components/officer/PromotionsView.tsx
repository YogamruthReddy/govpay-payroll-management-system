import React from 'react';
import { Card, Table, Badge, Button } from '../ui/UIComponents';
import { Briefcase, TrendingUp, Award, Plus, Calendar, User } from 'lucide-react';

const PromotionsView: React.FC = () => {
    const promotions = [
        { id: 1, employeeName: 'James Anderson', currentGrade: 'B-12', proposedGrade: 'B-13', department: 'IT', yearsOfService: 5, eligibilityDate: '2024-01-15', status: 'Pending' },
        { id: 2, employeeName: 'Emily Davis', currentGrade: 'B-11', proposedGrade: 'B-12', department: 'Finance', yearsOfService: 4, eligibilityDate: '2024-02-01', status: 'Approved' },
        { id: 3, employeeName: 'Michael Brown', currentGrade: 'A-13', proposedGrade: 'A-14', department: 'Operations', yearsOfService: 7, eligibilityDate: '2024-01-20', status: 'Under Review' },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-display font-bold text-slate-900">Employee Promotions</h2>
                    <p className="text-slate-500 mt-1">Manage grade promotions and career advancement</p>
                </div>
                <Button variant="primary" className="shadow-lg">
                    <Plus className="w-4 h-4 mr-2" />
                    Propose Promotion
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-500 font-medium">Pending Reviews</p>
                            <h3 className="text-3xl font-bold text-slate-900 mt-2">3</h3>
                        </div>
                        <div className="p-3 bg-amber-100 rounded-xl">
                            <Briefcase className="w-6 h-6 text-amber-600" />
                        </div>
                    </div>
                    <p className="text-xs text-slate-500 mt-3">Awaiting approval</p>
                </Card>
                <Card className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-500 font-medium">Approved This Year</p>
                            <h3 className="text-3xl font-bold text-slate-900 mt-2">12</h3>
                        </div>
                        <div className="p-3 bg-emerald-100 rounded-xl">
                            <Award className="w-6 h-6 text-emerald-600" />
                        </div>
                    </div>
                    <p className="text-xs text-emerald-600 mt-3 font-semibold">+3 from last year</p>
                </Card>
                <Card className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-500 font-medium">Eligible Employees</p>
                            <h3 className="text-3xl font-bold text-slate-900 mt-2">8</h3>
                        </div>
                        <div className="p-3 bg-blue-100 rounded-xl">
                            <User className="w-6 h-6 text-blue-600" />
                        </div>
                    </div>
                    <p className="text-xs text-slate-500 mt-3">Due for review</p>
                </Card>
                <Card className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-500 font-medium">Avg. Tenure</p>
                            <h3 className="text-3xl font-bold text-slate-900 mt-2">5.2</h3>
                        </div>
                        <div className="p-3 bg-purple-100 rounded-xl">
                            <TrendingUp className="w-6 h-6 text-purple-600" />
                        </div>
                    </div>
                    <p className="text-xs text-slate-500 mt-3">Years before promotion</p>
                </Card>
            </div>

            {/* Promotion Criteria Card */}
            <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
                    <Award className="w-5 h-5 mr-2 text-blue-600" />
                    Promotion Eligibility Criteria
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white p-4 rounded-lg">
                        <p className="text-sm font-semibold text-slate-700 mb-2">Minimum Service</p>
                        <p className="text-2xl font-bold text-blue-600">3 Years</p>
                        <p className="text-xs text-slate-500 mt-1">In current grade</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg">
                        <p className="text-sm font-semibold text-slate-700 mb-2">Performance Rating</p>
                        <p className="text-2xl font-bold text-emerald-600">≥ 4.0</p>
                        <p className="text-xs text-slate-500 mt-1">Average over 2 years</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg">
                        <p className="text-sm font-semibold text-slate-700 mb-2">Training Hours</p>
                        <p className="text-2xl font-bold text-purple-600">40+</p>
                        <p className="text-xs text-slate-500 mt-1">Professional development</p>
                    </div>
                </div>
            </Card>

            {/* Promotions Table */}
            <Card noPadding>
                <div className="p-6 border-b border-slate-100">
                    <h3 className="text-lg font-bold text-slate-900 font-display">Promotion Requests</h3>
                </div>
                <Table headers={['Employee', 'Current Grade', 'Proposed Grade', 'Years of Service', 'Eligibility Date', 'Status', 'Actions']}>
                    {promotions.map((promo) => (
                        <tr key={promo.id} className="hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white font-bold mr-3">
                                        {promo.employeeName.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-slate-900">{promo.employeeName}</p>
                                        <p className="text-xs text-slate-500">{promo.department}</p>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs font-mono font-semibold">
                                    {promo.currentGrade}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                    <TrendingUp className="w-4 h-4 text-emerald-600 mr-2" />
                                    <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-mono font-semibold">
                                        {promo.proposedGrade}
                                    </span>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-900">
                                {promo.yearsOfService} years
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                                <div className="flex items-center">
                                    <Calendar className="w-4 h-4 mr-2 text-slate-400" />
                                    {promo.eligibilityDate}
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <Badge variant={
                                    promo.status === 'Approved' ? 'success' :
                                        promo.status === 'Pending' ? 'warning' : 'neutral'
                                }>
                                    {promo.status}
                                </Badge>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <Button variant="secondary" size="sm">
                                    View Details
                                </Button>
                            </td>
                        </tr>
                    ))}
                </Table>
            </Card>
        </div>
    );
};

export default PromotionsView;
