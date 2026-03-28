import React, { useEffect, useState } from 'react';
import { Card, Button, Badge } from './ui/UIComponents';
import { Download, Calendar, FileText } from 'lucide-react';
import { payrollAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const SalarySlips: React.FC = () => {
    const { user } = useAuth();
    const [payslips, setPayslips] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPayslips = async () => {
            try {
                if (user?.id) {
                    const data = await payrollAPI.getByEmployee(parseInt(user.id));
                    setPayslips(data);
                }
            } catch (error) {
                console.error('Failed to fetch payslips:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPayslips();
    }, [user]);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="w-16 h-16 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 font-display">Salary Slips</h1>
                    <p className="text-slate-500 mt-1">Download and view your monthly salary statements</p>
                </div>
            </div>

            {payslips.length === 0 ? (
                <Card className="p-8 text-center">
                    <p className="text-slate-500">No salary slips available</p>
                </Card>
            ) : (
                <div className="grid gap-4">
                    {payslips.map((slip, index) => {
                        const monthName = monthNames[slip.month - 1] || 'Unknown';
                        const generatedDate = new Date(slip.generated_at);
                        const formattedDate = generatedDate.toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                        });

                        return (
                            <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-brand-100 rounded-xl flex items-center justify-center">
                                            <FileText className="w-6 h-6 text-brand-600" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-900 text-lg">{monthName} {slip.year}</h3>
                                            <p className="text-sm text-slate-500 flex items-center gap-2 mt-1">
                                                <Calendar className="w-4 h-4" />
                                                Generated on {formattedDate}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <div className="text-right">
                                            <p className="text-2xl font-bold text-slate-900">${slip.net_pay.toFixed(2)}</p>
                                            <Badge variant={slip.status === 'paid' ? 'success' : 'brand'}>
                                                {slip.status.charAt(0).toUpperCase() + slip.status.slice(1)}
                                            </Badge>
                                        </div>
                                        <Button 
                                            className="flex items-center gap-2"
                                            onClick={async () => {
                                                try {
                                                    const response = await payrollAPI.downloadPayslip(slip.id);
                                                    const url = window.URL.createObjectURL(new Blob([response.data]));
                                                    const link = document.createElement('a');
                                                    link.href = url;
                                                    link.setAttribute('download', `payslip-${slip.month}-${slip.year}.pdf`);
                                                    document.body.appendChild(link);
                                                    link.click();
                                                    link.remove();
                                                } catch (error) {
                                                    console.error('Failed to download payslip:', error);
                                                }
                                            }}
                                        >
                                            <Download className="w-4 h-4" />
                                            Download
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default SalarySlips;
