import React, { useState } from 'react';
import { Card, Button } from '../ui/UIComponents';
import { Settings, Bell, Lock, Database, Mail, Globe, Shield, Save, Download } from 'lucide-react';

const SettingsView: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'general' | 'security' | 'notifications' | 'system'>('general');

    const tabs = [
        { id: 'general', label: 'General', icon: Settings },
        { id: 'security', label: 'Security', icon: Lock },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'system', label: 'System', icon: Database },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h2 className="text-3xl font-display font-bold text-slate-900">System Settings</h2>
                <p className="text-slate-500 mt-1">Configure system preferences and security settings</p>
            </div>

            {/* Tabs */}
            <div className="border-b border-slate-200">
                <nav className="-mb-px flex space-x-8">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-all ${activeTab === tab.id
                                ? 'border-brand-600 text-brand-600'
                                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                                }`}
                        >
                            <tab.icon className={`w-5 h-5 mr-2 ${activeTab === tab.id ? 'text-brand-600' : 'text-slate-400'}`} />
                            {tab.label}
                        </button>
                    ))}
                </nav>
            </div>

            {/* General Settings */}
            {activeTab === 'general' && (
                <div className="space-y-6">
                    <Card className="p-6">
                        <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
                            <Globe className="w-5 h-5 mr-2 text-brand-600" />
                            Organization Details
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Organization Name</label>
                                <input
                                    type="text"
                                    defaultValue="Government IT Department"
                                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Time Zone</label>
                                    <select className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none">
                                        <option>Asia/Kolkata (IST)</option>
                                        <option>UTC</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Currency</label>
                                    <select className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none">
                                        <option>INR (₹)</option>
                                        <option>USD ($)</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6">
                        <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
                            <Mail className="w-5 h-5 mr-2 text-brand-600" />
                            Email Configuration
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">SMTP Server</label>
                                <input
                                    type="text"
                                    defaultValue="smtp.gov.in"
                                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Port</label>
                                    <input
                                        type="text"
                                        defaultValue="587"
                                        className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">From Email</label>
                                    <input
                                        type="email"
                                        defaultValue="noreply@govpay.gov.in"
                                        className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
                                    />
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            )}

            {/* Security Settings */}
            {activeTab === 'security' && (
                <div className="space-y-6">
                    <Card className="p-6">
                        <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
                            <Shield className="w-5 h-5 mr-2 text-brand-600" />
                            Password Policy
                        </h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                                <div>
                                    <p className="font-medium text-slate-900">Minimum Password Length</p>
                                    <p className="text-sm text-slate-500">Require at least 8 characters</p>
                                </div>
                                <input type="number" defaultValue="8" className="w-20 px-3 py-2 border border-slate-200 rounded-lg" />
                            </div>
                            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                                <div>
                                    <p className="font-medium text-slate-900">Password Expiry</p>
                                    <p className="text-sm text-slate-500">Force password change every 90 days</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" defaultChecked className="sr-only peer" />
                                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-600"></div>
                                </label>
                            </div>
                            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                                <div>
                                    <p className="font-medium text-slate-900">Two-Factor Authentication</p>
                                    <p className="text-sm text-slate-500">Require 2FA for all admin accounts</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" defaultChecked className="sr-only peer" />
                                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-600"></div>
                                </label>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6">
                        <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
                            <Lock className="w-5 h-5 mr-2 text-brand-600" />
                            Session Management
                        </h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                                <div>
                                    <p className="font-medium text-slate-900">Session Timeout</p>
                                    <p className="text-sm text-slate-500">Auto-logout after inactivity (minutes)</p>
                                </div>
                                <input type="number" defaultValue="30" className="w-20 px-3 py-2 border border-slate-200 rounded-lg" />
                            </div>
                        </div>
                    </Card>
                </div>
            )}

            {/* Notifications Settings */}
            {activeTab === 'notifications' && (
                <Card className="p-6">
                    <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
                        <Bell className="w-5 h-5 mr-2 text-brand-600" />
                        Notification Preferences
                    </h3>
                    <div className="space-y-4">
                        {[
                            { label: 'New Employee Registration', desc: 'Get notified when a new employee is added' },
                            { label: 'Leave Requests', desc: 'Notifications for pending leave approvals' },
                            { label: 'Payroll Processing', desc: 'Updates on payroll generation and disbursement' },
                            { label: 'System Updates', desc: 'Important system maintenance and updates' },
                        ].map((item, i) => (
                            <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                                <div>
                                    <p className="font-medium text-slate-900">{item.label}</p>
                                    <p className="text-sm text-slate-500">{item.desc}</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" defaultChecked className="sr-only peer" />
                                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-600"></div>
                                </label>
                            </div>
                        ))}
                    </div>
                </Card>
            )}

            {/* System Settings */}
            {activeTab === 'system' && (
                <div className="space-y-6">
                    <Card className="p-6">
                        <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
                            <Database className="w-5 h-5 mr-2 text-brand-600" />
                            Database Management
                        </h3>
                        <div className="space-y-4">
                            <div className="p-4 bg-slate-50 rounded-lg">
                                <div className="flex items-center justify-between mb-2">
                                    <p className="font-medium text-slate-900">Database Size</p>
                                    <span className="text-sm font-semibold text-slate-700">2.4 GB</span>
                                </div>
                                <div className="w-full bg-slate-200 rounded-full h-2">
                                    <div className="bg-brand-600 h-2 rounded-full" style={{ width: '48%' }}></div>
                                </div>
                                <p className="text-xs text-slate-500 mt-2">48% of 5 GB allocated</p>
                            </div>
                            <div className="flex gap-3">
                                <Button variant="secondary">
                                    <Download className="w-4 h-4 mr-2" />
                                    Backup Database
                                </Button>
                                <Button variant="secondary">
                                    <Database className="w-4 h-4 mr-2" />
                                    Optimize
                                </Button>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6">
                        <h3 className="text-lg font-bold text-slate-900 mb-4">System Information</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-slate-50 rounded-lg">
                                <p className="text-sm text-slate-500">Version</p>
                                <p className="font-semibold text-slate-900 mt-1">v2.4.1</p>
                            </div>
                            <div className="p-4 bg-slate-50 rounded-lg">
                                <p className="text-sm text-slate-500">Last Updated</p>
                                <p className="font-semibold text-slate-900 mt-1">Oct 15, 2023</p>
                            </div>
                            <div className="p-4 bg-slate-50 rounded-lg">
                                <p className="text-sm text-slate-500">Server Status</p>
                                <p className="font-semibold text-emerald-600 mt-1">● Operational</p>
                            </div>
                            <div className="p-4 bg-slate-50 rounded-lg">
                                <p className="text-sm text-slate-500">Uptime</p>
                                <p className="font-semibold text-slate-900 mt-1">99.9%</p>
                            </div>
                        </div>
                    </Card>
                </div>
            )}

            {/* Save Button */}
            <div className="flex justify-end">
                <Button variant="primary" className="shadow-lg">
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                </Button>
            </div>
        </div>
    );
};

export default SettingsView;
