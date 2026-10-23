import React, { useState } from 'react';
import {
  ShieldCheck,
  TrendingUp,
  FileText,
  Scale,
  Clock,
  ChevronDown,
  Building2,
  DollarSign,
  Car,
  Landmark,
  PiggyBank,
  Zap,
  Percent,
  Layers,
} from 'lucide-react';
import { CalculatorType, MarketRate, RecentCalculation } from '../types';
import { US_MARKET_RATES } from '../data/usMarketRates';

interface HeaderProps {
  activeCalc: CalculatorType;
  onSelectCalc: (type: CalculatorType) => void;
  onOpenReport: () => void;
  onOpenCompare: () => void;
  onApplyMarketRate?: (rate: MarketRate) => void;
  recentCalculations: RecentCalculation[];
  onSelectRecent: (item: RecentCalculation) => void;
}

const [showMethodology, setShowMethodology] = useState(false); export const Header: React.FC<HeaderProps> = ({
  activeCalc,
  onSelectCalc,
  onOpenReport,
  onOpenCompare,
  onApplyMarketRate,
  recentCalculations,
  onSelectRecent,
}) => {
  const [showRecentMenu, setShowRecentMenu] = useState(false);
  const [activeTooltipRate, setActiveTooltipRate] = useState<string | null>(null);

  const navItems: { type: CalculatorType; label: string; icon: React.ReactNode }[] = [
    { type: 'mortgage', label: 'Mortgage', icon: <Building2 className="w-4 h-4" /> },
    { type: 'personal-loan', label: 'Personal Loan', icon: <Landmark className="w-4 h-4" /> },
    { type: 'compound', label: 'Compound Interest', icon: <TrendingUp className="w-4 h-4" /> },
    { type: 'auto-loan', label: 'Auto Loan', icon: <Car className="w-4 h-4" /> },
    { type: '401k', label: '401(k) Retirement', icon: <PiggyBank className="w-4 h-4" /> },
    { type: 'extra-payments', label: 'Extra Payments', icon: <Zap className="w-4 h-4" /> },
    { type: 'inflation', label: 'Inflation', icon: <Percent className="w-4 h-4" /> },
    { type: 'take-home', label: 'Take-Home Pay', icon: <DollarSign className="w-4 h-4" /> },
    { type: 'directory', label: 'Directory', icon: <Layers className="w-4 h-4" /> },
  ];

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      {/* 1. TOP LIVE US MARKET RATES STRIP */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between overflow-x-auto scrollbar-none gap-4">
          <div className="flex items-center gap-1.5 shrink-0 font-semibold text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>US MARKET RATES</span>
            <span className="text-slate-500 font-normal hidden sm:inline">|</span>
          </div>

          <div className="flex items-center gap-5 text-[11px] whitespace-nowrap">
            {US_MARKET_RATES.map((rate) => (
              <div
                key={rate.id}
                className="relative flex items-center gap-1.5 cursor-pointer group hover:text-white transition-colors"
                onClick={() => onApplyMarketRate?.(rate)}
                onMouseEnter={() => setActiveTooltipRate(rate.id)}
                onMouseLeave={() => setActiveTooltipRate(null)}
              >
                <span className="text-slate-400">{rate.label}:</span>
                <span className="font-semibold text-emerald-400 font-mono tabular-nums">{rate.value}</span>
                {rate.change && (
                  <span
                    className={`text-[10px] ${
                      rate.change.startsWith('+') ? 'text-emerald-400' : 'text-slate-400'
                    }`}
                  >
                    {rate.change}
                  </span>
                )}

                {/* Tooltip */}
                {activeTooltipRate === rate.id && rate.tooltipText && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 z-50 px-2.5 py-1 bg-slate-800 text-slate-200 text-[10px] rounded shadow-lg border border-slate-700 whitespace-nowrap pointer-events-none">
                    {rate.tooltipText}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="text-[11px] text-slate-400 shrink-0 hidden md:block">
            <span>Sources: Freddie Mac PMMS & Federal Reserve H.15</span>
          </div>
        </div>
      </div>

      {/* 2. MAIN HEADER BAR */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
        {/* Brand Zone */}
        <div
          onClick={() => onSelectCalc('mortgage')}
          className="flex items-center gap-2.5 cursor-pointer select-none group shrink-0"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-sm group-hover:bg-emerald-700 transition-colors">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-bold tracking-tight text-slate-900">
                FinRate<span className="text-emerald-600">Calc</span>
              </span>
              <span className="text-[11px] font-semibold text-slate-400">.com</span>
            </div>
            <p className="text-[10px] uppercase font-bold tracking-wider text-slate-500">
              US Financial Tools
            </p>
          </div>
        </div>

        {/* Primary Desktop Nav Category Links */}
        {/* PROFESSIONAL CLEAN NAVIGATION (NO DUPLICATION) */}
          <nav className="flex items-center space-x-4 md:space-x-6 text-sm font-medium">
           

            <a
              href="#benchmarks"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('benchmarks')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="text-slate-600 hover:text-slate-900 transition-colors py-1.5 px-2"
              title="IRS & Federal Reserve Benchmarks"
            >
              Methodology & Data
            </a>

            <a
              href="/privacy-policy.html"
              className="text-slate-600 hover:text-slate-900 transition-colors py-1.5 px-2"
            >
              Privacy & Trust
            </a>

            <a
              href="mailto:support@finratecalc.com"
              className="text-slate-600 hover:text-slate-900 transition-colors py-1.5 px-2"
            >
              Contact
            </a>
          </nav>

        {/* Right Tools & Actions */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Recent Calculations Menu */}
          <div className="relative">
            <button
              onClick={() => setShowRecentMenu(!showRecentMenu)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              <span>Recent</span>
              {recentCalculations.length > 0 && (
                <span className="w-4 h-4 rounded-full bg-emerald-600 text-white text-[10px] flex items-center justify-center font-bold">
                  {recentCalculations.length}
                </span>
              )}
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {showRecentMenu && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                <div className="px-3 py-1 border-b border-slate-100 flex items-center justify-between text-xs text-slate-500 font-semibold">
                  <span>Recent Calculations</span>
                  <span className="text-[10px] text-slate-400">Saved in browser</span>
                </div>
                {recentCalculations.length === 0 ? (
                  <div className="px-4 py-6 text-center text-xs text-slate-400">
                    No recent calculations yet. Values will automatically save as you calculate.
                  </div>
                ) : (
                  <div className="max-h-64 overflow-y-auto divide-y divide-slate-100">
                    {recentCalculations.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => {
                          onSelectRecent(item);
                          setShowRecentMenu(false);
                        }}
                        className="w-full text-left px-3.5 py-2.5 hover:bg-slate-50 transition-colors flex items-start justify-between gap-2"
                      >
                        <div>
                          <p className="text-xs font-semibold text-slate-800">{item.title}</p>
                          <p className="text-[11px] text-slate-500">{item.subtitle}</p>
                        </div>
                        <span className="text-xs font-bold text-emerald-600 font-mono">
                          {item.summaryValue}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Currency Indicator */}
          <div className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-slate-50 border border-slate-200 rounded-lg">
            <span>USD ($)</span>
          </div>

          {/* Compare Scenarios Button */}
          <button
            onClick={onOpenCompare}
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors"
          >
            <Scale className="w-3.5 h-3.5 text-emerald-700" />
            <span>Compare 2 Scenarios</span>
          </button>

          {/* PDF Report Button */}
          <button
            onClick={onOpenReport}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs transition-colors"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>PDF Report</span>
          </button>
        </div>
      </div>

      {/* 3. CALCULATOR QUICK-SWITCH SUB-NAV (Exact Match to FinRateCalc Screenshot) */}
      <div className="border-t border-slate-200 bg-slate-50/80 px-4 sm:px-6 py-2 overflow-x-auto scrollbar-none">
        <div className="max-w-7xl mx-auto flex items-center gap-2">
          {navItems.map((item) => {
            const isActive = activeCalc === item.type;
            return (
              <button
                key={item.type}
                onClick={() => onSelectCalc(item.type)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
