import React from 'react';
import {
  Building2,
  DollarSign,
  PiggyBank,
  Car,
  Landmark,
  TrendingUp,
  Zap,
  Percent,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { CalculatorType } from '../types';

interface AllCalculatorsDirectoryProps {
  onSelectCalc: (type: CalculatorType) => void;
}

export const AllCalculatorsDirectory: React.FC<AllCalculatorsDirectoryProps> = ({ onSelectCalc }) => {
  const tools = [
    {
      type: 'mortgage' as CalculatorType,
      title: 'Mortgage Calculator',
      category: 'Home & Real Estate',
      icon: <Building2 className="w-6 h-6 text-emerald-600" />,
      desc: 'Calculate monthly payments with US property taxes, homeowners insurance, automatic PMI threshold rules, and full amortization schedule.',
      badge: 'Live Freddie Mac Rates',
    },
    {
      type: 'take-home' as CalculatorType,
      title: 'Take-Home Pay (Paycheck) Calculator',
      category: 'Taxes & Income',
      icon: <DollarSign className="w-6 h-6 text-emerald-600" />,
      desc: 'Accurate net pay computation with IRS Federal brackets, FICA Social Security cap, Medicare surtax, and all 50 US state tax schedules.',
      badge: 'All 50 US States',
    },
    {
      type: '401k' as CalculatorType,
      title: '401(k) & Retirement Planner',
      category: 'Retirement & Wealth',
      icon: <PiggyBank className="w-6 h-6 text-emerald-600" />,
      desc: 'Simulate long-term compound wealth with 2025/2026 IRS contribution caps, employer 401(k) matching tiers, and 4% safe withdrawal monthly pay.',
      badge: '$23,500 IRS Cap',
    },
    {
      type: 'auto-loan' as CalculatorType,
      title: 'Auto Loan & Financing Calculator',
      category: 'Vehicles & Lending',
      icon: <Car className="w-6 h-6 text-emerald-600" />,
      desc: 'Estimate monthly car payments, dealer doc fees, trade-in equity, and true out-the-door price with automatic state sales tax calculation.',
      badge: 'Out-The-Door Price',
    },
    {
      type: 'personal-loan' as CalculatorType,
      title: 'Personal Loan & Debt Consolidation',
      category: 'Lending & Debt',
      icon: <Landmark className="w-6 h-6 text-emerald-600" />,
      desc: 'Compare a fixed-rate personal loan against high-interest US credit card APRs (21.5%+) to quantify total interest savings and debt freedom date.',
      badge: 'Save Thousands vs Cards',
    },
    {
      type: 'compound' as CalculatorType,
      title: 'Compound Interest & Wealth Builder',
      category: 'Investing',
      icon: <TrendingUp className="w-6 h-6 text-emerald-600" />,
      desc: 'Project exponential portfolio growth with initial principal, monthly dollar-cost averaging, and historical S&P 500 index return benchmarks.',
      badge: 'Exponential Compounding',
    },
    {
      type: 'extra-payments' as CalculatorType,
      title: 'Extra Payments & Payoff Accelerator',
      category: 'Mortgage Acceleration',
      icon: <Zap className="w-6 h-6 text-emerald-600" />,
      desc: 'Compare +$100, +$250, +$500 monthly extra principal payments to see how many years and tens of thousands in interest you shave off your mortgage.',
      badge: 'Shave 5-10 Years Off',
    },
    {
      type: 'inflation' as CalculatorType,
      title: 'US Inflation & Purchasing Power (CPI)',
      category: 'Macroeconomics',
      icon: <Percent className="w-6 h-6 text-emerald-600" />,
      desc: 'Track historical purchasing power erosion using official US Bureau of Labor Statistics (BLS CPI-U) indexes from 1970 to 2026.',
      badge: 'BLS CPI-U Data',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-xs">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 text-xs font-semibold mb-3">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>FinRateCalc Financial Tools Suite</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            All 8 US Financial Calculators
          </h1>
          <p className="text-sm text-slate-500 mt-2 leading-relaxed">
            Every calculator is calibrated specifically for the United States financial ecosystem — incorporating current IRS guidelines, Freddie Mac mortgage indices, Federal Reserve interest benchmarks, and 50-state tax rules.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {tools.map((t) => (
          <div
            key={t.type}
            onClick={() => onSelectCalc(t.type)}
            className="group bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs hover:shadow-md hover:border-emerald-500/50 transition-all cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 group-hover:bg-emerald-100/80 transition-colors flex items-center justify-center">
                  {t.icon}
                </div>
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                  {t.badge}
                </span>
              </div>

              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  {t.category}
                </span>
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                  {t.title}
                </h3>
                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">{t.desc}</p>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-emerald-700 group-hover:translate-x-0.5 transition-transform">
              <span>Launch Calculator</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
