import React from 'react';
import { Card, Button, Badge } from './ui/UIComponents';
import { Download, Calendar, ArrowUpRight, TrendingUp } from 'lucide-react';

const HeroDashboardPreview: React.FC = () => {
    return (
        <div className="bg-slate-50 rounded-xl overflow-hidden shadow-2xl border border-white/20 relative">
            {/* Fake Header */}
            <div className="h-14 bg-white border-b border-slate-100 flex items-center justify-between px-6">
                <div className="flex items-center gap-4">
                    <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center text-white font-bold text-xs">JA</div>
                    <div className="h-4 w-24 bg-slate-100 rounded-full"></div>
                </div>
                <div className="flex gap-2">
                    <div className="w-8 h-8 bg-slate-50 rounded-full"></div>
                    <div className="w-8 h-8 bg-slate-50 rounded-full"></div>
                </div>
            </div>

            <div className="p-6 grid gap-6">
                {/* Salary Card */}
                <div className="bg-brand-900 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-white opacity-5 rounded-full -mr-10 -mt-10 blur-2xl"></div>
                    <div className="flex justify-between items-start mb-6 relative z-10">
                        <div>
                            <p className="text-brand-200 text-xs uppercase tracking-widest font-bold mb-1">Total Net Pay</p>
                            <h3 className="text-3xl font-bold font-display">$4,250.00</h3>
                        </div>
                        <Badge variant="success" className="bg-emerald-500/20 text-emerald-300 border-0">+12% vs last month</Badge>
                    </div>

                    <div className="grid grid-cols-3 gap-4 relative z-10">
                        <div className="bg-brand-800/50 p-3 rounded-lg border border-brand-700/50 backdrop-blur-sm">
                            <p className="text-brand-300 text-[10px] uppercase mb-1">Basic</p>
                            <p className="font-semibold">$3,800</p>
                        </div>
                        <div className="bg-brand-800/50 p-3 rounded-lg border border-brand-700/50 backdrop-blur-sm">
                            <p className="text-brand-300 text-[10px] uppercase mb-1">HRA</p>
                            <p className="font-semibold">$650</p>
                        </div>
                        <div className="bg-brand-800/50 p-3 rounded-lg border border-brand-700/50 backdrop-blur-sm">
                            <p className="text-brand-300 text-[10px] uppercase mb-1">Ded.</p>
                            <p className="font-semibold text-red-300">-$200</p>
                        </div>
                    </div>
                </div>

                {/* Service Timeline Preview */}
                <div className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <h4 className="font-bold text-slate-900">Service History</h4>
                        <Button variant="outline" size="sm" className="text-xs h-8">View All</Button>
                    </div>
                    <div className="space-y-6 relative border-l-2 border-slate-100 ml-2">
                        <div className="relative pl-6">
                            <div className="absolute -left-[7px] top-1.5 w-3.5 h-3.5 bg-amber-500 rounded-full border-2 border-white ring-1 ring-slate-100"></div>
                            <div className="flex justify-between">
                                <div>
                                    <p className="font-bold text-slate-800 text-sm">Senior Promotion</p>
                                    <p className="text-xs text-slate-500 mt-1">Grade 1 Officer Upgrade</p>
                                </div>
                                <span className="text-xs font-mono font-semibold text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded">2023</span>
                            </div>
                        </div>
                        <div className="relative pl-6">
                            <div className="absolute -left-[7px] top-1.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white ring-1 ring-slate-100"></div>
                            <div className="flex justify-between">
                                <div>
                                    <p className="font-bold text-slate-800 text-sm">Joined Service</p>
                                    <p className="text-xs text-slate-500 mt-1">Department of Finance</p>
                                </div>
                                <span className="text-xs font-mono font-semibold text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded">2020</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HeroDashboardPreview;
