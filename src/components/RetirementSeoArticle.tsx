import React, { useState } from 'react';
import {
  ShieldCheck,
  Home,
  Landmark,
  TrendingUp,
  Car,
  PiggyBank,
  Zap,
  Percent,
  Wallet,
  Layers,
  FileText,
} from 'lucide-react';
import { RetirementCalculator } from './components/RetirementCalculator';
import { RetirementSeoArticle } from './components/RetirementSeoArticle';

const TOOL_TABS = [
  { id: 'mortgage', label: 'Mortgage', icon: Home },
  { id: 'personal', label: 'Personal Loan', icon: Landmark },
  { id: 'compound', label: 'Compound Interest', icon: TrendingUp },
  { id: 'auto', label: 'Auto Loan', icon: Car },
  { id: '401k', label: '401(k) Retirement', icon: PiggyBank },
  { id: 'extra', label: 'Extra Payments', icon: Zap },
  { id: 'inflation', label: 'Inflation', icon: Percent },
  { id: 'takehome', label: 'Take-Home Pay', icon: Wallet },
  { id: 'directory', label: 'Directory', icon: Layers },
] as const;

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('401k');

  const scrollToGuide = () => {
    const el = document.getElementById('retirement-planner-guide');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen w-full overflow-x-hidden flex flex-col bg-slate-50 text-slate-900">
      {/* US Market Rates Strip (Matches FinRateCalc Screenshot) */}
      <div className="bg-slate-900 text-slate-200 text-xs border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2 flex flex-wrap items-center justify-between gap-x-5 gap-y-1">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
            <span className="font-bold tracking-wide text-emerald-400">US MARKET RATES</span>
            <span>
              30-Yr Mort.: <strong className="text-emerald-400 tabular-nums">6.62%</strong>
            </span>
            <span>
              15-Yr Mort.: <strong className="text-emerald-400 tabular-nums">5.89%</strong>
            </span>
            <span>
              Fed Prime: <strong className="text-emerald-400 tabular-nums">8.00%</strong>
            </span>
            <span>
              S&amp;P 500: <strong className="text-emerald-400 tabular-nums">10.2%</strong>
            </span>
            <span>
              401(k) Cap: <strong className="text-emerald-400 tabular-nums">$23,500</strong>
            </span>
            <span>
              US CPI: <strong className="text-emerald-400 tabular-nums">2.9%</strong>
            </span>
          </div>
          <span className="text-slate-400 text-[11px]">Sources: FRED &amp; IRS</span>
        </div>
      </div>

      {/* Primary Header (3-Zone Clean Contract) */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-8">
          <a
            href="#top"
            className="flex items-center gap-2.5 text-lg font-extrabold tracking-tight text-slate-900 whitespace-nowrap shrink-0"
          >
            <span className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <span>
              FinRateCalc<span className="text-emerald-600 font-semibold">.com</span>
            </span>
          </a>

          <nav
            aria-label="Primary navigation"
            className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600"
          >
            <a
              href="#how-planner-works"
              className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0"
            >
              Methodology
            </a>
            <a
              href="#irs-limits"
              className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0"
            >
              IRS Limits
            </a>
            <a
              href="#traditional-vs-roth"
              className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0"
            >
              Roth vs. Traditional
            </a>
            <a
              href="#retirement-faq"
              className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0"
            >
              FAQ
            </a>
          </nav>

          <button
            type="button"
            onClick={scrollToGuide}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Read 401(k) Guide</span>
          </button>
        </div>

        {/* Tool Tab Strip matching FinRateCalc */}
        <div className="border-t border-slate-100 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center gap-1.5 overflow-x-auto">
            {TOOL_TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    isActive
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main id="top" className="flex-1 min-w-0 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8">
        {activeTab !== '401k' && (
          <div className="mb-6 rounded-xl border border-slate-200 bg-white px-5 py-3.5 flex flex-wrap items-center justify-between gap-3 text-sm text-slate-700">
            <span>
              Previewing the <strong>401(k) &amp; Retirement Planner</strong> page and SEO guide
              requested for FinRateCalc.
            </span>
            <button
              type="button"
              onClick={() => setActiveTab('401k')}
              className="px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-semibold cursor-pointer"
            >
              Return to 401(k) Tab
            </button>
          </div>
        )}

        <RetirementCalculator />

        {/* Detailed SEO-Optimized Article Right Below the Calculator */}
        <RetirementSeoArticle />
      </main>

      {/* Clean Footer */}
      <footer className="mt-14 border-t border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            FinRateCalc US Financial Tools · Educational projections only; not personalized tax or
            investment advice.
          </p>
          <div className="flex items-center gap-5">
            <a href="#irs-limits" className="hover:text-slate-800">
              IRS Limits
            </a>
            <a href="#four-percent-rule" className="hover:text-slate-800">
              4% Rule
            </a>
            <a href="#retirement-faq" className="hover:text-slate-800">
              401(k) FAQ
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
