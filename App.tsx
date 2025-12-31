
import React, { useState, useEffect } from 'react';
import FinanceForm from './components/FinanceForm';
import AnalysisDashboard from './components/AnalysisDashboard';
import ChatWidget from './components/ChatWidget';
import { FinancialData, AIAdvice } from './types';
import { analyzeFinance, generateAppLogo } from './services/geminiService';

const App: React.FC = () => {
  const [advice, setAdvice] = useState<AIAdvice | null>(null);
  const [lastData, setLastData] = useState<FinancialData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  useEffect(() => {
    generateAppLogo().then(setLogoUrl);
  }, []);

  const handleFormSubmit = async (data: FinancialData) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await analyzeFinance(data);
      setAdvice(result);
      setLastData(data);
      setTimeout(() => {
        const resultEl = document.getElementById('analysis-result');
        if (resultEl) resultEl.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err: any) {
      console.error(err);
      setError('Analysis failed. Please check your data or API connection.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfdfe] text-slate-900 pb-20 selection:bg-emerald-100 selection:text-emerald-900">
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {logoUrl ? (
              <img src={logoUrl} alt="WealthWisdom" className="w-8 h-8 rounded-lg shadow-sm object-cover ring-1 ring-slate-200" />
            ) : (
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white shadow-md relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-red-500 via-yellow-400 to-green-500 animate-gradient-slow opacity-90"></div>
                <svg className="w-4 h-4 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
              </div>
            )}
            <span className="text-lg font-bold tracking-tight text-slate-900">
              WealthWisdom
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="hidden sm:inline-flex text-[10px] font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full uppercase tracking-wider">AI Intelligence v2.5</span>
            <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 pt-12 space-y-12">
        {/* Hero Header Section */}
        <section className="text-center space-y-8 max-w-3xl mx-auto">
          {logoUrl && (
            <div className="flex justify-center mb-6">
              <img src={logoUrl} alt="App Logo" className="w-24 h-24 rounded-3xl shadow-2xl ring-1 ring-slate-100 animate-bounce-slow" />
            </div>
          )}
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-slate-900 tracking-tight leading-[1.1]">
              Professional wealth <br/>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-emerald-600 to-blue-500">analysis for everyone.</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-500 font-medium leading-relaxed max-w-xl mx-auto">
              Smart modeling for savings, medical coverage, and insurance protection.
            </p>
          </div>

          {/* Prominent Core Mission Section */}
          <div className="relative group max-w-2xl mx-auto">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-red-500 via-yellow-400 to-green-500 rounded-[2rem] blur opacity-15 group-hover:opacity-25 transition duration-1000"></div>
            <div className="relative bg-white p-8 md:p-10 rounded-[2rem] border border-slate-200/60 shadow-xl shadow-slate-500/5 text-center space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 border border-slate-100">
                <div className="flex gap-0.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-yellow-500"></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                </div>
                <h2 className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em]">Core Mission</h2>
              </div>
              <p className="text-lg md:text-xl text-slate-800 font-bold leading-tight tracking-tight">
                "We leverage advanced AI to simplify complex financial planning into clear, actionable, and unbiased data-driven insights."
              </p>
            </div>
          </div>
        </section>

        {error && (
          <div className="bg-rose-50 border border-rose-100 text-rose-600 px-6 py-4 rounded-2xl font-bold text-sm flex items-center max-w-2xl mx-auto animate-in fade-in zoom-in duration-300">
            <svg className="w-5 h-5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            {error}
          </div>
        )}

        <div className="space-y-24">
          <FinanceForm onSubmit={handleFormSubmit} isLoading={isLoading} />
          
          {advice && lastData && (
            <div id="analysis-result" className="pt-8 border-t border-slate-100">
              <div className="mb-8 text-center">
                <h3 className="text-2xl font-black text-slate-900">Insight Dashboard</h3>
                <p className="text-slate-500 font-medium">Your customized financial health report</p>
              </div>
              <AnalysisDashboard advice={advice} data={lastData} />
            </div>
          )}
        </div>

        {/* Professional Data Safety Section */}
        <section className="max-w-xl mx-auto pt-16">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-5">
            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 shadow-sm flex-shrink-0 border border-blue-100">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">End-to-End Privacy</h3>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                Your data is processed strictly in-memory and is never persisted. Analysis is discarded after your session ends.
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="mt-32 py-16 bg-white border-t border-slate-200 text-center">
        <div className="max-w-6xl mx-auto px-6 space-y-6">
          <div className="flex justify-center items-center space-x-1 mb-4">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-sm font-black tracking-[0.2em] text-slate-800 ml-2">WEALTHWISDOM</span>
          </div>
          <p className="text-slate-400 text-[10px] uppercase font-bold tracking-[0.3em]">
            Intelligent Financial Engineering
          </p>
          <div className="flex justify-center space-x-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">
            <a href="#" className="hover:text-blue-600 transition-colors">Privacy</a>
            <a href="#" className="hover:text-blue-600 transition-colors">Terms</a>
            <a href="#" className="hover:text-blue-600 transition-colors">Security</a>
          </div>
          <p className="text-slate-300 text-[9px] uppercase font-bold tracking-widest pt-4">
            © {new Date().getFullYear()} WealthWisdom AI Project.
          </p>
        </div>
      </footer>

      {/* Persistent Chat Widget */}
      <ChatWidget financialContext={lastData} logoUrl={logoUrl} />
    </div>
  );
};

export default App;
