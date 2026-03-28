import React, { useState, useEffect } from 'react';
import { Card, Button, Badge } from './ui/UIComponents';
import { Calendar, Clock, FileText } from 'lucide-react';
import { leaveAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const LeaveApplication: React.FC = () => {
    const { user } = useAuth();
    const [leaveType, setLeaveType] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [reason, setReason] = useState('');
    const [leaveHistory, setLeaveHistory] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchLeaves = async () => {
            try {
                if (user?.id) {
                    setLoading(true);
                    const data = await leaveAPI.getByEmployee(parseInt(user.id));
                    setLeaveHistory(data);
                }
            } catch (error) {
                console.error('Failed to fetch leaves:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchLeaves();
    }, [user]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!user?.id) return;

        try {
            setSubmitting(true);
            setMessage('');

            // Calculate days
            const start = new Date(startDate);
            const end = new Date(endDate);
            const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;

            await leaveAPI.apply({
                employeeId: parseInt(user.id),
                leaveType,
                startDate,
                endDate,
                days,
                reason
            });

            setMessage('Leave application submitted successfully!');
            setLeaveType('');
            setStartDate('');
            setEndDate('');
            setReason('');

            // Refresh leave history
            const data = await leaveAPI.getByEmployee(parseInt(user.id));
            setLeaveHistory(data);
        } catch (error: any) {
            setMessage(error.response?.data?.error || 'Failed to submit leave application');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-slate-900 font-display">Leave Application</h1>
                <p className="text-slate-500 mt-1">Apply for leave and track your leave history</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="p-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                            <Calendar className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500">Available Leave</p>
                            <p className="text-2xl font-bold text-slate-900">18 days</p>
                        </div>
                    </div>
                </Card>

                <Card className="p-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                            <Clock className="w-5 h-5 text-amber-600" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500">Used Leave</p>
                            <p className="text-2xl font-bold text-slate-900">10 days</p>
                        </div>
                    </div>
                </Card>

                <Card className="p-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-brand-100 rounded-lg flex items-center justify-center">
                            <FileText className="w-5 h-5 text-brand-600" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500">Pending Requests</p>
                            <p className="text-2xl font-bold text-slate-900">1</p>
                        </div>
                    </div>
                </Card>
            </div>

            <Card className="p-6">
                <h2 className="text-xl font-bold text-slate-900 mb-6 font-display">Apply for Leave</h2>

                {message && (
                    <div className={`mb-4 p-3 rounded-lg ${message.includes('success') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                        {message}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Leave Type</label>
                            <select
                                value={leaveType}
                                onChange={(e) => setLeaveType(e.target.value)}
                                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                                required
                            >
                                <option value="">Select leave type</option>
                                <option value="sick">Sick Leave</option>
                                <option value="casual">Casual Leave</option>
                                <option value="annual">Annual Leave</option>
                                <option value="maternity">Maternity Leave</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Number of Days</label>
                            <input
                                type="number"
                                min="1"
                                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Start Date</label>
                            <input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">End Date</label>
                            <input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Reason</label>
                        <textarea
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            rows={4}
                            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
                            placeholder="Please provide a reason for your leave application..."
                            required
                        />
                    </div>

                    <Button type="submit" className="w-full" disabled={submitting}>
                        {submitting ? 'Submitting...' : 'Submit Leave Application'}
                    </Button>
                </form>
            </Card>

            <Card className="p-6">
                <h2 className="text-xl font-bold text-slate-900 mb-6 font-display">Leave History</h2>
                {loading ? (
                    <div className="text-center py-8">
                        <div className="w-12 h-12 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                    </div>
                ) : leaveHistory.length === 0 ? (
                    <p className="text-slate-500 text-center py-8">No leave history available</p>
                ) : (
                    <div className="space-y-3">
                        {leaveHistory.map((leave, index) => {
                            const startDate = new Date(leave.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                            const endDate = new Date(leave.end_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                            const dateRange = `${startDate} - ${endDate}`;

                            return (
                                <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                                    <div>
                                        <h4 className="font-semibold text-slate-900 capitalize">{leave.leave_type.replace('_', ' ')} Leave</h4>
                                        <p className="text-sm text-slate-500">{dateRange}</p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="text-sm font-medium text-slate-600">{leave.days} days</span>
                                        <Badge variant={leave.status === 'approved' ? 'success' : leave.status === 'rejected' ? 'error' : 'warning'}>
                                            {leave.status.charAt(0).toUpperCase() + leave.status.slice(1)}
                                        </Badge>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </Card>
        </div>
    );
};

export default LeaveApplication;
