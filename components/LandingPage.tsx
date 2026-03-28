import React from 'react';
import { UserRole } from '../types';
import { ShieldCheck, FileText, Users, Lock, ChevronRight, Activity, Building2, CheckCircle, ArrowRight } from 'lucide-react';
import HeroDashboardPreview from './HeroDashboardPreview';

interface LandingPageProps {
    onLogin: (role: UserRole) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onLogin }) => {
    const [scrolled, setScrolled] = React.useState(false);

    React.useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="min-h-screen bg-slate-50 font-sans selection:bg-brand-500 selection:text-white">

            {/* Navigation */}
            <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled
                ? 'bg-white/90 backdrop-blur-md border-b border-brand-100 shadow-lg shadow-brand-900/5 py-2'
                : 'bg-transparent border-b border-white/10 py-6'
                }`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            {/* Logo */}
                            <div className={`${scrolled ? 'bg-brand-600 text-white' : 'bg-white/10 text-white backdrop-blur-sm border border-white/20'
                                } p-2.5 rounded-xl transition-all duration-300 shadow-lg group relative overflow-hidden`}>
                                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <ShieldCheck className="h-6 w-6 relative z-10 group-hover:scale-110 transition-transform" />
                            </div>
                            <div className="flex flex-col">
                                <span className={`font-display font-bold text-xl tracking-tight leading-none transition-colors duration-300 ${scrolled ? 'text-slate-900 ' : 'text-white'
                                    }`}>GovPay</span>
                                <span className={`text-[10px] uppercase tracking-widest font-bold transition-colors duration-300 ${scrolled ? 'text-brand-600' : 'text-brand-200'
                                    }`}>Official Portal</span>
                            </div>
                        </div>
                        <div className="hidden md:flex items-center space-x-8">
                            <a href="#features" className={`text-sm font-medium transition-colors hover:text-brand-400 ${scrolled ? 'text-slate-600' : 'text-brand-100'
                                }`}>Features</a>
                            <a href="#about" className={`text-sm font-medium transition-colors hover:text-brand-400 ${scrolled ? 'text-slate-600' : 'text-brand-100'
                                }`}>About</a>
                            <button
                                onClick={() => document.getElementById('login-section')?.scrollIntoView({ behavior: 'smooth' })}
                                className={`${scrolled
                                    ? 'bg-brand-900 text-white hover:bg-brand-800'
                                    : 'bg-white text-brand-950 hover:bg-brand-50'
                                    } px-6 py-2.5 rounded-full text-sm font-semibold transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5`}
                            >
                                Access Portal
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <div className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 bg-brand-950 overflow-hidden">
                {/* Abstract Background */}
                <div className="absolute inset-0">
                    <div className="absolute top-0 right-0 -mr-20 -mt-20 w-[600px] h-[600px] rounded-full bg-brand-500/20 blur-3xl mix-blend-screen animate-pulse"></div>
                    <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-[500px] h-[500px] rounded-full bg-indigo-600/20 blur-3xl mix-blend-screen"></div>
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150"></div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div className="text-left">
                            <div className="inline-flex items-center rounded-full px-4 py-1.5 text-sm font-semibold text-brand-100 bg-brand-900/50 border border-brand-700 mb-8 shadow-glow backdrop-blur-sm">
                                <span className="w-2 h-2 rounded-full bg-emerald-400 mr-2 animate-pulse"></span>
                                Secure Government Gateway V2.0
                            </div>
                            <h1 className="text-5xl lg:text-7xl font-display font-bold text-white tracking-tight mb-8 leading-[1.1]">
                                Modernizing <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-300 via-brand-100 to-white">Public Service</span> <br />
                                Payroll.
                            </h1>
                            <p className="text-xl text-brand-100/80 mb-10 leading-relaxed max-w-lg font-light">
                                A unified, transparent, and secure digital infrastructure for managing government employee lifecycles, processing payrolls, and tracking service records.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <button
                                    onClick={() => document.getElementById('login-section')?.scrollIntoView({ behavior: 'smooth' })}
                                    className="px-8 py-4 bg-white text-brand-950 rounded-xl font-bold hover:bg-brand-50 transition-all shadow-xl hover:shadow-2xl hover:scale-105 flex items-center justify-center group"
                                >
                                    Get Started
                                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </button>
                                <button className="px-8 py-4 bg-brand-900/40 backdrop-blur-md border border-brand-700/50 text-white rounded-xl font-semibold hover:bg-brand-800/50 transition-all">
                                    View Documentation
                                </button>
                            </div>

                            <div className="mt-12 flex items-center gap-6 text-brand-200/60 text-sm font-medium">
                                <div className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-brand-400" /> ISO 27001 Certified</div>
                                <div className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-brand-400" /> 256-bit Encryption</div>
                            </div>
                        </div>

                        {/* Hero Visual */}
                        <div className="relative hidden lg:block">
                            <div className="relative rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/10 p-2 shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-700 group perspective-mid">
                                <HeroDashboardPreview />
                            </div>

                            {/* Floating Stats Card - Decoration */}
                            <div className="absolute -bottom-12 -left-12 bg-white rounded-xl p-4 shadow-xl border border-slate-100 animate-bounce-slow hidden xl:block z-20">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                                        <Activity className="w-5 h-5 text-emerald-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 font-semibold uppercase">System Status</p>
                                        <p className="text-emerald-600 font-bold text-sm flex items-center gap-1">
                                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                            Operational
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Login Selection Section */}
            <section id="login-section" className="py-24 bg-slate-50 relative -mt-10 rounded-t-[3rem] z-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <span className="text-brand-600 font-bold tracking-wider uppercase text-sm">Portal Access</span>
                        <h2 className="text-3xl md:text-4xl font-display font-bold text-slate-900 mt-2 mb-4">Select Your Role</h2>
                        <div className="w-20 h-1.5 bg-brand-500 mx-auto rounded-full"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        {[
                            { role: UserRole.EMPLOYEE, title: 'Employee', icon: Users, desc: 'View payslips, apply for leave, and check service records.' },
                            { role: UserRole.OFFICER, title: 'Department', icon: Building2, desc: 'Manage department staff, approve requests, and generate reports.' },
                            { role: UserRole.ADMIN, title: 'Administrator', icon: ShieldCheck, desc: 'System configuration, user management, and global oversight.' }
                        ].map((item, i) => (
                            <button
                                key={i}
                                onClick={() => onLogin(item.role)}
                                className="group relative bg-white rounded-2xl p-8 shadow-soft border border-slate-100 hover:border-brand-300 hover:shadow-2xl transition-all duration-300 text-left hover:-translate-y-2 overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-50 rounded-bl-full -mr-16 -mt-16 group-hover:bg-brand-500 group-hover:scale-150 transition-all duration-500 ease-out opacity-50"></div>
                                <div className="w-16 h-16 bg-brand-50 rounded-2xl flex items-center justify-center mb-6 text-brand-600 group-hover:bg-brand-600 group-hover:text-white transition-colors duration-300 shadow-sm relative z-10">
                                    <item.icon className="w-8 h-8" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3 font-display">{item.title} Login</h3>
                                <p className="text-slate-500 leading-relaxed mb-6 group-hover:text-slate-600">{item.desc}</p>
                                <div className="flex items-center text-brand-600 font-semibold text-sm group-hover:text-brand-700">
                                    Proceed <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section id="features" className="py-24 bg-white relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <h2 className="text-4xl font-display font-bold text-slate-900 mb-6 leading-tight">
                                Enterprise-grade features <br /> for modern governance.
                            </h2>
                            <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                                Our platform replaces outdated legacy systems with a secure, cloud-native architecture designed for speed, accuracy, and accountability.
                            </p>
                            <ul className="space-y-6">
                                {[
                                    "Automated salary slip generation with tax integration",
                                    "Real-time service history and promotion tracking",
                                    "Encrypted database with role-based access control",
                                    "Instant leave management workflow"
                                ].map((feat, i) => (
                                    <li key={i} className="flex items-start">
                                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mt-0.5">
                                            <CheckCircle className="w-4 h-4" />
                                        </div>
                                        <span className="ml-4 text-slate-700 font-medium">{feat}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                            {[
                                { icon: FileText, title: "Payroll", color: "bg-blue-50 text-blue-600" },
                                { icon: Activity, title: "Analytics", color: "bg-purple-50 text-purple-600" },
                                { icon: Lock, title: "Security", color: "bg-emerald-50 text-emerald-600" },
                                { icon: Users, title: "HRMS", color: "bg-amber-50 text-amber-600" }
                            ].map((box, i) => (
                                <div key={i} className={`p-8 rounded-3xl ${box.color} bg-opacity-50 hover:bg-opacity-100 transition-all cursor-default`}>
                                    <box.icon className="w-10 h-10 mb-4" />
                                    <h3 className="font-bold text-lg font-display">{box.title}</h3>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Statistics Section */}
            <section className="py-20 bg-brand-950 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
                            Trusted by Government Agencies Nationwide
                        </h2>
                        <p className="text-brand-200 text-lg">Real impact, measurable results</p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {[
                            { value: '50K+', label: 'Active Employees' },
                            { value: '₹2.5B', label: 'Processed Monthly' },
                            { value: '99.9%', label: 'Uptime SLA' },
                            { value: '24/7', label: 'Support Available' }
                        ].map((stat, i) => (
                            <div key={i} className="text-center">
                                <div className="text-4xl md:text-5xl font-bold text-white mb-2 font-display">{stat.value}</div>
                                <div className="text-brand-300 font-medium">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-24 bg-slate-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <span className="text-brand-600 font-bold tracking-wider uppercase text-sm">Process</span>
                        <h2 className="text-3xl md:text-4xl font-display font-bold text-slate-900 mt-2 mb-4">
                            How It Works
                        </h2>
                        <div className="w-20 h-1.5 bg-brand-500 mx-auto rounded-full"></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                step: '01',
                                title: 'Secure Login',
                                desc: 'Access the portal using your government-issued credentials with multi-factor authentication.',
                                icon: Lock
                            },
                            {
                                step: '02',
                                title: 'Manage Operations',
                                desc: 'Process payroll, approve leaves, update records, and generate reports from your dashboard.',
                                icon: Activity
                            },
                            {
                                step: '03',
                                title: 'Track & Report',
                                desc: 'Monitor real-time analytics, download reports, and maintain complete audit trails.',
                                icon: FileText
                            }
                        ].map((item, i) => (
                            <div key={i} className="relative">
                                <div className="bg-white rounded-2xl p-8 shadow-soft border border-slate-100 hover:shadow-xl transition-all">
                                    <div className="flex items-center mb-6">
                                        <div className="w-12 h-12 bg-brand-100 rounded-xl flex items-center justify-center text-brand-600 mr-4">
                                            <item.icon className="w-6 h-6" />
                                        </div>
                                        <span className="text-5xl font-bold text-brand-100 font-display">{item.step}</span>
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-3 font-display">{item.title}</h3>
                                    <p className="text-slate-600 leading-relaxed">{item.desc}</p>
                                </div>
                                {i < 2 && (
                                    <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-brand-200"></div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Benefits Section */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <span className="text-brand-600 font-bold tracking-wider uppercase text-sm">Benefits</span>
                        <h2 className="text-3xl md:text-4xl font-display font-bold text-slate-900 mt-2 mb-4">
                            Built for Every Stakeholder
                        </h2>
                        <div className="w-20 h-1.5 bg-brand-500 mx-auto rounded-full"></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                role: 'Employees',
                                icon: Users,
                                color: 'bg-blue-50 border-blue-100 text-blue-600',
                                benefits: [
                                    'Instant access to salary slips',
                                    'Digital leave applications',
                                    'Service history tracking',
                                    'Tax document downloads'
                                ]
                            },
                            {
                                role: 'Officers',
                                icon: Building2,
                                color: 'bg-purple-50 border-purple-100 text-purple-600',
                                benefits: [
                                    'Streamlined approval workflows',
                                    'Department analytics dashboard',
                                    'Payroll processing tools',
                                    'Promotion management'
                                ]
                            },
                            {
                                role: 'Administrators',
                                icon: ShieldCheck,
                                color: 'bg-emerald-50 border-emerald-100 text-emerald-600',
                                benefits: [
                                    'System-wide oversight',
                                    'User management console',
                                    'Comprehensive reporting',
                                    'Security configuration'
                                ]
                            }
                        ].map((item, i) => (
                            <div key={i} className={`${item.color} rounded-2xl p-8 border-2`}>
                                <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center mb-6 shadow-sm">
                                    <item.icon className="w-7 h-7" />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 mb-6 font-display">{item.role}</h3>
                                <ul className="space-y-3">
                                    {item.benefits.map((benefit, j) => (
                                        <li key={j} className="flex items-start text-slate-700">
                                            <CheckCircle className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" />
                                            <span>{benefit}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-24 bg-slate-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <span className="text-brand-600 font-bold tracking-wider uppercase text-sm">Testimonials</span>
                        <h2 className="text-3xl md:text-4xl font-display font-bold text-slate-900 mt-2 mb-4">
                            What Users Say
                        </h2>
                        <div className="w-20 h-1.5 bg-brand-500 mx-auto rounded-full"></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                name: 'Rajesh Kumar',
                                role: 'Senior Officer, Finance Dept.',
                                quote: 'The automated payroll processing has reduced our monthly workload by 70%. The system is intuitive and reliable.',
                                rating: 5
                            },
                            {
                                name: 'Priya Sharma',
                                role: 'Employee, IT Department',
                                quote: 'I can now access my salary slips and apply for leave from anywhere. The mobile experience is excellent.',
                                rating: 5
                            },
                            {
                                name: 'Dr. Amit Patel',
                                role: 'System Administrator',
                                quote: 'Security and compliance features are top-notch. The audit trails and reporting capabilities are comprehensive.',
                                rating: 5
                            }
                        ].map((testimonial, i) => (
                            <div key={i} className="bg-white rounded-2xl p-8 shadow-soft border border-slate-100">
                                <div className="flex mb-4">
                                    {[...Array(testimonial.rating)].map((_, j) => (
                                        <svg key={j} className="w-5 h-5 text-amber-400 fill-current" viewBox="0 0 20 20">
                                            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                                        </svg>
                                    ))}
                                </div>
                                <p className="text-slate-600 mb-6 leading-relaxed italic">"{testimonial.quote}"</p>
                                <div className="flex items-center">
                                    <div className="w-12 h-12 bg-brand-100 rounded-full flex items-center justify-center text-brand-700 font-bold mr-4">
                                        {testimonial.name.charAt(0)}
                                    </div>
                                    <div>
                                        <div className="font-bold text-slate-900">{testimonial.name}</div>
                                        <div className="text-sm text-slate-500">{testimonial.role}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-brand-950 text-brand-100 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                        <div className="col-span-1 md:col-span-2">
                            <div className="flex items-center mb-6">
                                <div className="bg-brand-800 p-2 rounded-lg mr-3">
                                    <Building2 className="h-6 w-6 text-white" />
                                </div>
                                <span className="font-display font-bold text-2xl text-white">GovPay</span>
                            </div>
                            <p className="text-brand-200/70 max-w-sm leading-relaxed">
                                Official Government Employee Payroll & Service Records Management System.
                                Facilitating digital governance and administrative efficiency through secure technology.
                            </p>
                        </div>
                        <div>
                            <h4 className="text-white font-bold mb-6 font-display">System</h4>
                            <ul className="space-y-4 text-sm text-brand-200/70">
                                <li><a href="#" className="hover:text-white transition-colors">Release Notes</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">System Status</a></li>
                                <li><a href="#" className="hover:text-white transition-colors">Security Compliance</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-white font-bold mb-6 font-display">Contact</h4>
                            <p className="text-sm text-brand-200/70 mb-3">Technical Helpline: <br /><span className="text-white font-semibold text-lg">1-800-GOV-TECH</span></p>
                            <p className="text-sm text-brand-200/70">Email: support@govpay.gov</p>
                        </div>
                    </div>
                    <div className="border-t border-brand-800/50 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-brand-400">
                        <p>&copy; 2024 Government IT Department. All rights reserved.</p>
                        <div className="flex space-x-6 mt-4 md:mt-0">
                            <a href="#" className="hover:text-white">Privacy</a>
                            <a href="#" className="hover:text-white">Terms</a>
                            <a href="#" className="hover:text-white">Cookies</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;