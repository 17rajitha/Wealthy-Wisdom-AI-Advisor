
import React, { useState } from 'react';
import { FinancialData, SUPPORTED_CURRENCIES, formatCurrency, FinancialGoal } from '../types';

interface InputFieldProps {
  label: string;
  name: string;
  value: number;
  currency: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isPeople?: boolean;
}

const InputField = ({ label, name, value, currency, onChange, isPeople = false }: InputFieldProps) => (
  <div className="group space-y-1">
    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest group-focus-within:text-emerald-600 transition-colors">
      {label}
    </label>
    <div className="relative">
      <input
        type="number"
        name={name}
        value={value === 0 ? '' : value}
        onChange={onChange}
        onFocus={(e) => e.target.select()}
        placeholder="0"
        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none bg-white font-semibold transition-all text-sm pr-24"
      />
      {value > 0 && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg pointer-events-none flex items-center gap-1.5 ring-1 ring-emerald-100">
          {isPeople ? (
            <>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
              <span>{value}</span>
            </>
          ) : (
            <span>{formatCurrency(value, currency)}</span>
          )}
        </div>
      )}
    </div>
  </div>
);

interface FinanceFormProps {
  onSubmit: (data: FinancialData) => void;
  isLoading: boolean;
}

const FinanceForm: React.FC<FinanceFormProps> = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState<FinancialData>({
    monthlyIncome: 0,
    monthlyExpenses: 0,
    monthlyEMI: 0,
    healthExpenses: 0,
    healthInsurance: { hasPolicy: false, premium: 0, frequency: 'monthly' },
    dependents: 0,
    currency: 'INR',
    savings: {
      mutualFunds: 0,
      fixedDeposits: 0,
      bankSavings: 0,
      gold: 0,
      generalSavings: 0
    },
    termInsurance: { hasPolicy: false, premium: 0, frequency: 'monthly' },
    lifeInsurance: { hasPolicy: false, premium: 0, frequency: 'monthly' },
    goals: []
  });

  const [newGoal, setNewGoal] = useState<FinancialGoal>({ name: '', targetAmount: 0, years: 5 });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const checked = (e.target as HTMLInputElement).checked;

    if (name.startsWith('savings.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        savings: { ...prev.savings, [field]: parseFloat(value) || 0 }
      }));
    } else if (name.startsWith('term.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        termInsurance: { ...prev.termInsurance, [field]: type === 'checkbox' ? checked : (field === 'premium' ? (parseFloat(value) || 0) : value) }
      }));
    } else if (name.startsWith('life.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        lifeInsurance: { ...prev.lifeInsurance, [field]: type === 'checkbox' ? checked : (field === 'premium' ? (parseFloat(value) || 0) : value) }
      }));
    } else if (name.startsWith('health.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        healthInsurance: { ...prev.healthInsurance, [field]: type === 'checkbox' ? checked : (field === 'premium' ? (parseFloat(value) || 0) : value) }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: name === 'currency' ? value : (parseFloat(value) || 0)
      }));
    }
  };

  const addGoal = () => {
    if (newGoal.name && newGoal.targetAmount > 0) {
      setFormData(prev => ({
        ...prev,
        goals: [...prev.goals, newGoal]
      }));
      setNewGoal({ name: '', targetAmount: 0, years: 5 });
    }
  };

  const removeGoal = (index: number) => {
    setFormData(prev => ({
      ...prev,
      goals: prev.goals.filter((_, i) => i !== index)
    }));
  };

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(formData); }} className="bg-white p-8 md:p-12 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Your Financial Profile</h2>
          <p className="text-sm text-slate-500 font-medium">Add your goals like "Daughter's Education" below.</p>
        </div>
        <select 
          name="currency" 
          value={formData.currency} 
          onChange={handleChange}
          className="bg-slate-50 border border-slate-200 text-slate-700 text-[10px] font-bold rounded-lg px-4 py-2.5 outline-none uppercase tracking-widest"
        >
          {SUPPORTED_CURRENCIES.map(curr => <option key={curr.code} value={curr.code}>{curr.symbol} {curr.code}</option>)}
        </select>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <section className="space-y-8">
          <div className="space-y-4">
            <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em] border-b border-slate-100 pb-2">Monthly Cashflow</h3>
            <div className="space-y-4">
              <InputField label="Monthly Income" name="monthlyIncome" value={formData.monthlyIncome} currency={formData.currency} onChange={handleChange} />
              <InputField label="Monthly Expenses" name="monthlyExpenses" value={formData.monthlyExpenses} currency={formData.currency} onChange={handleChange} />
              <InputField label="Monthly EMI / Loans" name="monthlyEMI" value={formData.monthlyEMI} currency={formData.currency} onChange={handleChange} />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em] border-b border-slate-100 pb-2">Future Goals</h3>
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <input 
                  type="text" 
                  placeholder="Goal Name (e.g. Education)" 
                  value={newGoal.name}
                  onChange={e => setNewGoal({...newGoal, name: e.target.value})}
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm outline-none focus:border-blue-500"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input 
                    type="number" 
                    placeholder="Target Amt" 
                    value={newGoal.targetAmount || ''}
                    onChange={e => setNewGoal({...newGoal, targetAmount: parseFloat(e.target.value) || 0})}
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm outline-none focus:border-blue-500"
                  />
                  <input 
                    type="number" 
                    placeholder="Years" 
                    value={newGoal.years || ''}
                    onChange={e => setNewGoal({...newGoal, years: parseInt(e.target.value) || 0})}
                    className="w-full px-4 py-2 rounded-xl border border-slate-200 text-sm outline-none focus:border-blue-500"
                  />
                </div>
                <button type="button" onClick={addGoal} className="w-full py-2 bg-blue-500 text-white text-xs font-bold rounded-xl hover:bg-blue-600 transition-colors">ADD GOAL</button>
              </div>
              <div className="space-y-2 mt-4">
                {formData.goals.map((goal, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-white px-3 py-2 rounded-lg border border-slate-200 text-xs shadow-sm">
                    <span className="font-bold text-slate-700">{goal.name}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-slate-400 font-medium">{formatCurrency(goal.targetAmount, formData.currency)} in {goal.years}y</span>
                      <button type="button" onClick={() => removeGoal(idx)} className="text-rose-500 hover:text-rose-700">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-8">
           <div className="space-y-4">
            <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em] border-b border-slate-100 pb-2">Monthly Savings</h3>
            <div className="grid grid-cols-2 gap-4">
              <InputField label="Liquid / Cash" name="savings.generalSavings" value={formData.savings.generalSavings} currency={formData.currency} onChange={handleChange} />
              <InputField label="Mutual Funds" name="savings.mutualFunds" value={formData.savings.mutualFunds} currency={formData.currency} onChange={handleChange} />
              <InputField label="Fixed Deposits" name="savings.fixedDeposits" value={formData.savings.fixedDeposits} currency={formData.currency} onChange={handleChange} />
              <InputField label="Other Assets" name="savings.gold" value={formData.savings.gold} currency={formData.currency} onChange={handleChange} />
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em] border-b border-slate-100 pb-2">Protection Policies</h3>
            <div className="space-y-4">
              <label className="flex items-center space-x-3 cursor-pointer group">
                <input type="checkbox" name="health.hasPolicy" checked={formData.healthInsurance.hasPolicy} onChange={handleChange} className="w-4 h-4 rounded border-slate-300 text-emerald-600" />
                <span className="text-xs font-bold text-slate-600">Health Insurance</span>
              </label>
              <label className="flex items-center space-x-3 cursor-pointer group">
                <input type="checkbox" name="term.hasPolicy" checked={formData.termInsurance.hasPolicy} onChange={handleChange} className="w-4 h-4 rounded border-slate-300 text-emerald-600" />
                <span className="text-xs font-bold text-slate-600">Term Insurance</span>
              </label>
            </div>
          </div>
        </section>
      </div>

      <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="w-full md:w-64">
          <InputField label="Dependents" name="dependents" value={formData.dependents} currency={formData.currency} onChange={handleChange} isPeople={true} />
        </div>
        <button 
          type="submit" 
          disabled={isLoading} 
          className="w-full md:w-auto px-12 py-4 rounded-xl font-bold text-sm text-white transition-all shadow-xl bg-slate-900 hover:bg-emerald-950 active:scale-[0.98]"
        >
          {isLoading ? 'ANALYZING PROFILE...' : 'GENERATE ANALYSIS'}
        </button>
      </div>
    </form>
  );
};

export default FinanceForm;
