import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { CalculatorType } from '../types';

interface FooterProps {
  onSelectCalc: (type: CalculatorType) => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectCalc }) => {
  return (
    <footer className="bg-slate-900 text-slate-400 text-xs mt-16 border-t border-slate-800 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">
                FinRate<span className="text-emerald-400">Calc</span>
                <span className="text-slate-400 text-xs font-normal">.com</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Precision US financial calculators engineered for home buyers, tax filers, retirement savers, and borrowers across all 50 US States.
            </p>
          </div>

          {/* Core Calculators */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Core Calculators
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onSelectCalc('mortgage')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Mortgage Calculator
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCalc('take-home')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Take-Home Pay (Paycheck)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCalc('401k')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  401(k) Retirement Planner
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCalc('auto-loan')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Auto Loan &amp; Financing
                </button>
              </li>
            </ul>
          </div>

          {/* Wealth & Lending */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Lending &amp; Wealth
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onSelectCalc('personal-loan')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Personal Loan &amp; Consolidation
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCalc('compound')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Compound Interest Builder
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCalc('extra-payments')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  Extra Payments Accelerator
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectCalc('inflation')}
                  className="hover:text-emerald-400 transition-colors"
                >
                  US Inflation &amp; Purchasing Power
                </button>
              </li>
            </ul>
          </div>

          {/* US Regulatory Benchmarks */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              US Data Benchmarks
            </h4>
            <div className="space-y-2 text-[11px] text-slate-400">
              <p>• <strong>Freddie Mac PMMS:</strong> Weekly mortgage benchmark rate surveys.</p>
              <p>• <strong>IRS Notice 2024-80:</strong> 2025/2026 401(k) &amp; IRA contribution caps.</p>
              <p>• <strong>Federal Reserve H.15:</strong> Prime bank lending and treasury yields.</p>
              <p>• <strong>BLS CPI-U:</strong> Consumer Price Index historical inflation data.</p>
            </div>
          </div>
        </div>

        {/* Regulatory Disclaimers */}
        <div className="pt-8 border-t border-slate-800 text-[11px] text-slate-500 space-y-2 leading-relaxed">
          <p>
            <strong>US Regulatory &amp; Consumer Disclosure:</strong> FinRateCalc.com is an independent financial technology calculator resource. Calculations provided are for illustrative and planning purposes only and do not constitute formal lending underwriting, financial advisory, legal, or tax advice. Mortgage calculations adhere to standard US amortization rules under the Truth in Lending Act (TILA / Regulation Z) and the Homeowners Protection Act of 1998 (HPA) regarding Private Mortgage Insurance (PMI) termination.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 text-xs text-slate-500">
            <p>© {new Date().getFullYear()} FinRateCalc.com. All rights reserved.</p>
            <div className="flex gap-4">
              <a href="/privacy-policy.html">Privacy Policy</a>
              <span>·</span>
              <a href="/terms.html">Terms of Service</a>
              <span>·</span>
              <a href="/equal-housing.html">Equal Housing Opportunity Disclaimer</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
