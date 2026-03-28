import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import { Building2, Lock, User as UserIcon, AlertCircle } from 'lucide-react';

const LoginPage: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [localError, setLocalError] = useState('');
    const { login, error } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLocalError('');
        setIsLoading(true);

        try {
            await login(username, password);
        } catch (err) {
            setLocalError('Invalid username or password');
        } finally {
            setIsLoading(false);
        }
    };

    const quickLogin = async (user: string, pass: string) => {
        setUsername(user);
        setPassword(pass);
        setIsLoading(true);
        try {
            await login(user, pass);
        } catch (err) {
            setLocalError('Login failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-brand-950 via-brand-900 to-brand-950 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>

            <div className="w-full max-w-md relative z-10">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-3 mb-4">
                        <div className="bg-brand-500 p-3 rounded-xl">
                            <Building2 className="w-8 h-8 text-white" />
                        </div>
                        <span className="font-display font-bold text-3xl text-white">GovPay</span>
                    </div>
                    <p className="text-brand-200 text-sm">Official Government Portal</p>
                </div>

                {/* Login Card */}
                <div className="bg-white rounded-2xl shadow-2xl p-8">
                    <h2 className="text-2xl font-bold text-slate-900 mb-2 font-display">Welcome Back</h2>
                    <p className="text-slate-500 mb-6">Sign in to access your dashboard</p>

                    {(error || localError) && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
                            <AlertCircle className="w-5 h-5 flex-shrink-0" />
                            <span className="text-sm">{localError || error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Username</label>
                            <div className="relative">
                                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                                    placeholder="Enter your username"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                                    placeholder="Enter your password"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-brand-900 text-white py-3 rounded-lg font-semibold hover:bg-brand-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Signing in...' : 'Sign In'}
                        </button>
                    </form>

                    {/* Quick Login Buttons */}
                    <div className="mt-6 pt-6 border-t border-slate-200">
                        <p className="text-xs text-slate-500 mb-3 text-center">Quick Login (Demo)</p>
                        <div className="grid grid-cols-3 gap-2">
                            <button
                                onClick={() => quickLogin('james.anderson', 'password123')}
                                disabled={isLoading}
                                className="px-3 py-2 text-xs bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors disabled:opacity-50"
                            >
                                Employee
                            </button>
                            <button
                                onClick={() => quickLogin('sarah.connor', 'password123')}
                                disabled={isLoading}
                                className="px-3 py-2 text-xs bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors disabled:opacity-50"
                            >
                                Officer
                            </button>
                            <button
                                onClick={() => quickLogin('robert.wilson', 'password123')}
                                disabled={isLoading}
                                className="px-3 py-2 text-xs bg-emerald-50 text-emerald-700 rounded-lg hover:bg-emerald-100 transition-colors disabled:opacity-50"
                            >
                                Admin
                            </button>
                        </div>
                    </div>
                </div>

                <p className="text-center text-brand-300 text-sm mt-6">
                    © 2024 Government IT Department. All rights reserved.
                </p>
            </div>
        </div>
    );
};

export default LoginPage;
