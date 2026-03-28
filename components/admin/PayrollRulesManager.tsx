import React, { useEffect, useState } from 'react';
import { payrollRulesAPI } from '../../services/api';
import { Plus, Trash2, ToggleLeft, ToggleRight, Settings, Percent, DollarSign } from 'lucide-react';

interface PayrollRule {
  id: number;
  name: string;
  type: 'ALLOWANCE' | 'DEDUCTION';
  calculation: 'PERCENTAGE' | 'FIXED';
  value: number;
  is_active: number;
  created_at: string;
}

const PayrollRulesManager: React.FC = () => {
  const [rules, setRules]       = useState<PayrollRule[]>([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState<string | null>(null);
  const [success, setSuccess]   = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    name: '', type: 'ALLOWANCE', calculation: 'PERCENTAGE', value: ''
  });

  const fetchRules = async () => {
    try {
      setLoading(true);
      const data = await payrollRulesAPI.getAll();
      setRules(data.rules || []);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to load rules');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRules(); }, []);

  const notify = (msg: string, isError = false) => {
    if (isError) { setError(msg); setSuccess(null); }
    else { setSuccess(msg); setError(null); }
    setTimeout(() => { setError(null); setSuccess(null); }, 4000);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(form.value);
    if (!form.name.trim() || isNaN(val) || val <= 0) {
      return notify('Please fill all fields with valid values.', true);
    }
    try {
      await payrollRulesAPI.create({ name: form.name, type: form.type, calculation: form.calculation, value: val });
      notify(`Rule "${form.name}" added successfully.`);
      setForm({ name: '', type: 'ALLOWANCE', calculation: 'PERCENTAGE', value: '' });
      setShowForm(false);
      fetchRules();
    } catch (err: any) {
      notify(err.response?.data?.error || 'Failed to add rule.', true);
    }
  };

  const handleToggle = async (rule: PayrollRule) => {
    try {
      await payrollRulesAPI.toggle(rule.id);
      notify(`Rule "${rule.name}" ${rule.is_active ? 'deactivated' : 'activated'}.`);
      fetchRules();
    } catch {
      notify('Failed to toggle rule.', true);
    }
  };

  const handleDelete = async (rule: PayrollRule) => {
    if (!confirm(`Delete rule "${rule.name}"? This cannot be undone.`)) return;
    try {
      await payrollRulesAPI.delete(rule.id);
      notify(`Rule "${rule.name}" deleted.`);
      fetchRules();
    } catch {
      notify('Failed to delete rule.', true);
    }
  };

  const allowances = rules.filter(r => r.type === 'ALLOWANCE');
  const deductions = rules.filter(r => r.type === 'DEDUCTION');

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-brand-50 rounded-xl">
            <Settings className="w-6 h-6 text-brand-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900">Payroll Rule Engine</h3>
            <p className="text-sm text-slate-500">Rules applied dynamically during every payroll run</p>
          </div>
        </div>
        <button
          onClick={() => setShowForm(v => !v)}
          className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-xl text-sm font-semibold hover:bg-brand-700 transition-colors shadow-md"
        >
          <Plus className="w-4 h-4" />
          Add Rule
        </button>
      </div>

      {/* Alerts */}
      {error   && <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm font-medium">{error}</div>}
      {success && <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl px-4 py-3 text-sm font-medium">{success}</div>}

      {/* Add Rule Form */}
      {showForm && (
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
          <h4 className="font-semibold text-slate-800 mb-4">New Payroll Rule</h4>
          <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Rule Name</label>
              <input
                type="text"
                placeholder="e.g. Special Allowance"
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Type</label>
              <select
                value={form.type}
                onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="ALLOWANCE">Allowance (+)</option>
                <option value="DEDUCTION">Deduction (−)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Calculation</label>
              <select
                value={form.calculation}
                onChange={e => setForm(f => ({ ...f, calculation: e.target.value }))}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="PERCENTAGE">Percentage of Basic</option>
                <option value="FIXED">Fixed Amount (₹)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Value {form.calculation === 'PERCENTAGE' ? '(%)' : '(₹)'}
              </label>
              <input
                type="number" min="0" step="0.01"
                placeholder={form.calculation === 'PERCENTAGE' ? 'e.g. 15' : 'e.g. 3000'}
                value={form.value}
                onChange={e => setForm(f => ({ ...f, value: e.target.value }))}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
            <div className="md:col-span-2 lg:col-span-4 flex gap-3 justify-end">
              <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-sm text-slate-600 hover:text-slate-900 font-medium">Cancel</button>
              <button type="submit" className="px-5 py-2 bg-brand-600 text-white rounded-lg text-sm font-semibold hover:bg-brand-700 transition-colors">
                Add Rule
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Allowances Column */}
          <RulesColumn
            title="Allowances" emoji="➕"
            color="emerald"
            rules={allowances}
            onToggle={handleToggle}
            onDelete={handleDelete}
          />
          {/* Deductions Column */}
          <RulesColumn
            title="Deductions" emoji="➖"
            color="rose"
            rules={deductions}
            onToggle={handleToggle}
            onDelete={handleDelete}
          />
        </div>
      )}

      {/* Tip box */}
      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 text-sm text-blue-700">
        <strong>💡 How it works:</strong> When payroll is generated for an employee, the engine reads all <strong>active rules</strong> from this list and applies them to the basic salary in order. Inactive rules are skipped.
      </div>
    </div>
  );
};

// ── Rules Column sub-component ────────────────────────────────────────────────
interface RulesColumnProps {
  title: string;
  emoji: string;
  color: 'emerald' | 'rose';
  rules: PayrollRule[];
  onToggle: (r: PayrollRule) => void;
  onDelete: (r: PayrollRule) => void;
}

const RulesColumn: React.FC<RulesColumnProps> = ({ title, emoji, color, rules, onToggle, onDelete }) => {
  const headerColor = color === 'emerald'
    ? 'text-emerald-700 bg-emerald-50 border-emerald-100'
    : 'text-rose-700 bg-rose-50 border-rose-100';

  return (
    <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-soft">
      <div className={`px-5 py-3 font-semibold text-sm flex items-center gap-2 border-b ${headerColor}`}>
        <span>{emoji}</span> {title}
        <span className="ml-auto bg-white/60 text-xs px-2 py-0.5 rounded-full font-medium">
          {rules.filter(r => r.is_active).length} active
        </span>
      </div>
      {rules.length === 0 ? (
        <p className="text-slate-400 text-sm text-center py-8">No {title.toLowerCase()} rules yet.</p>
      ) : (
        <div className="divide-y divide-slate-50">
          {rules.map(rule => (
            <div key={rule.id} className={`flex items-center justify-between px-5 py-3 transition-colors ${rule.is_active ? 'bg-white' : 'bg-slate-50 opacity-60'}`}>
              <div className="flex items-center gap-3">
                <div className={`p-1.5 rounded-lg ${color === 'emerald' ? 'bg-emerald-50' : 'bg-rose-50'}`}>
                  {rule.calculation === 'PERCENTAGE'
                    ? <Percent className={`w-3.5 h-3.5 ${color === 'emerald' ? 'text-emerald-600' : 'text-rose-600'}`} />
                    : <DollarSign className={`w-3.5 h-3.5 ${color === 'emerald' ? 'text-emerald-600' : 'text-rose-600'}`} />
                  }
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800">{rule.name}</p>
                  <p className="text-xs text-slate-400">
                    {rule.calculation === 'PERCENTAGE' ? `${rule.value}% of basic` : `₹${rule.value.toLocaleString()} fixed`}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onToggle(rule)}
                  title={rule.is_active ? 'Deactivate' : 'Activate'}
                  className="text-slate-400 hover:text-brand-600 transition-colors"
                >
                  {rule.is_active
                    ? <ToggleRight className="w-5 h-5 text-brand-500" />
                    : <ToggleLeft className="w-5 h-5" />
                  }
                </button>
                <button
                  onClick={() => onDelete(rule)}
                  title="Delete rule"
                  className="text-slate-300 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PayrollRulesManager;
