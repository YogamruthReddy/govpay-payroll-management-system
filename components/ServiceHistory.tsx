import React from 'react';
import { Card, Badge } from './ui/UIComponents';

const ServiceHistory: React.FC = () => {
    const serviceHistory = [
        { year: '2023', title: 'Senior Developer Promotion', desc: 'Promoted to Senior Grade 1 based on annual performance review.', type: 'Promotion', date: 'March 15, 2023' },
        { year: '2021', title: 'Department Transfer', desc: 'Transferred from IT Support to Software Development Wing.', type: 'Transfer', date: 'June 10, 2021' },
        { year: '2019', title: 'Joined Service', desc: 'Appointed as Junior Developer in the Ministry of IT.', type: 'Joining', date: 'January 15, 2019' },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-slate-900 font-display">Service History</h1>
                <p className="text-slate-500 mt-1">Your complete employment timeline and career progression</p>
            </div>

            <Card className="p-8">
                <div className="relative border-l-2 border-slate-100 ml-3 space-y-10">
                    {serviceHistory.map((item, i) => (
                        <div key={i} className="relative pl-10 group">
                            {/* Dot */}
                            <div className={`absolute -left-[9px] top-1 w-5 h-5 rounded-full border-4 border-white shadow-sm transition-transform group-hover:scale-110
                                ${item.type === 'Promotion' ? 'bg-amber-500' : item.type === 'Transfer' ? 'bg-brand-500' : 'bg-emerald-500'}`}
                            />

                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start p-4 rounded-xl hover:bg-slate-50 transition-colors -mt-3">
                                <div className="flex-1">
                                    <h4 className="text-lg font-bold text-slate-900">{item.title}</h4>
                                    <p className="text-sm text-slate-600 mt-2 leading-relaxed">{item.desc}</p>
                                    <p className="text-sm text-slate-400 mt-2">{item.date}</p>
                                    <div className="mt-3">
                                        <Badge variant={item.type === 'Promotion' ? 'warning' : item.type === 'Transfer' ? 'brand' : 'success'}>
                                            {item.type}
                                        </Badge>
                                    </div>
                                </div>
                                <span className="text-sm font-bold text-slate-400 mt-1 sm:mt-0 font-display bg-white px-2 py-1 rounded border border-slate-100 shadow-sm">{item.year}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );
};

export default ServiceHistory;
