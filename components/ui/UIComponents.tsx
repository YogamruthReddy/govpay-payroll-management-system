import React from 'react';

export const Card: React.FC<{ children: React.ReactNode; className?: string; noPadding?: boolean }> = ({ children, className = '', noPadding = false }) => (
  <div className={`bg-white rounded-xl shadow-soft border border-slate-100/60 overflow-hidden transition-all duration-300 hover:shadow-lg ${className}`}>
    <div className={noPadding ? '' : 'p-6'}>
      {children}
    </div>
  </div>
);

export const Button: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  className?: string;
  disabled?: boolean;
}> = ({ children, onClick, variant = 'primary', className = '', disabled = false }) => {
  const baseStyles = "inline-flex items-center justify-center px-5 py-2.5 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 text-sm tracking-wide disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-[0.98]";
  
  const variants = {
    primary: "bg-brand-900 text-white hover:bg-brand-800 shadow-md hover:shadow-glow focus:ring-brand-900 border border-transparent",
    secondary: "bg-white text-brand-900 border border-slate-200 hover:bg-slate-50 hover:border-brand-200 focus:ring-brand-500 shadow-sm",
    outline: "bg-transparent border border-slate-300 text-slate-600 hover:text-brand-900 hover:border-brand-600 focus:ring-brand-500",
    danger: "bg-red-50 text-red-600 hover:bg-red-100 border border-transparent focus:ring-red-500",
    ghost: "text-slate-500 hover:text-brand-700 hover:bg-brand-50/50",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

export const Badge: React.FC<{ children: React.ReactNode; variant?: 'success' | 'warning' | 'danger' | 'neutral' | 'brand' }> = ({ children, variant = 'neutral' }) => {
  const styles = {
    success: "bg-emerald-50 text-emerald-700 border-emerald-200/50",
    warning: "bg-amber-50 text-amber-700 border-amber-200/50",
    danger: "bg-rose-50 text-rose-700 border-rose-200/50",
    neutral: "bg-slate-50 text-slate-600 border-slate-200/50",
    brand: "bg-brand-50 text-brand-700 border-brand-200/50",
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold border ${styles[variant]}`}>
      {children}
    </span>
  );
};

export const Table: React.FC<{ headers: string[]; children: React.ReactNode }> = ({ headers, children }) => (
  <div className="overflow-x-auto">
    <table className="min-w-full divide-y divide-slate-100">
      <thead>
        <tr className="bg-slate-50/50">
          {headers.map((header, i) => (
            <th key={i} scope="col" className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider font-display">
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-slate-100">
        {children}
      </tbody>
    </table>
  </div>
);