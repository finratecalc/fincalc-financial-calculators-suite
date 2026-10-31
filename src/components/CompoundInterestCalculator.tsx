import React, { useState, useMemo } from 'react';
import { TrendingUp, Download, PiggyBank, DollarSign } from 'lucide-react';
import { CompoundInterestInputs, CompoundInterestResult } from '../types';
import { calculateCompoundInterest, formatCurrency, formatPercent } from '../utils/calculators';

interface CompoundInterestCalculatorProps {
  onOpenReport?: (title: string, summary: any) => void;
}

const DEFAULT_INPUTS: CompoundInterestInputs = {
  initialDeposit: 10000,
  monthlyDeposit: 500,
  annualInterestRate: 8.0,
  years: 20,
  compoundFrequency: 'monthly',
  inflationAdjustedRate: 2.5,
};

export const CompoundInterestCalculator: React.FC<CompoundInterestCalculatorProps> = ({
  onOpenReport,
}) => {
  const [inputs, setInputs] = useState<CompoundInterestInputs>(DEFAULT_INPUTS);

  const result: CompoundInterestResult = useMemo(() => {
    return calculateCompoundInterest(inputs);
  }, [inputs]);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Compound Interest &amp; Wealth Builder
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Harness the power of US index fund compounding over time with regular dollar-cost averaging contributions.
          </p>
        </div>

        <button
          onClick={() =>
            onOpenReport?.('Compound Growth Projection', {
              type: 'compound',
              inputs,
              result,
            })
          }
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs transition-colors shrink-0"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Download Investment Report</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-5">
            <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
              Investment Parameters
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Initial Deposit (Starting Balance)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-semibold text-sm">
                    $
                  </span>
                  <input
                    type="number"
                    step="500"
                    value={inputs.initialDeposit || ''}
                    onChange={(e) =>
                      setInputs((prev) => ({
                        ...prev,
                        initialDeposit: parseFloat(e.target.value) || 0,
                      }))
                    }
                    className="w-full pl-8 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-semibold text-base focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Monthly Contribution
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-semibold text-sm">
                    $
                  </span>
                  <input
                    type="number"
                    step="50"
                    value={inputs.monthlyDeposit || ''}
                    onChange={(e) =>
                      setInputs((prev) => ({
                        ...prev,
                        monthlyDeposit: parseFloat(e.target.value) || 0,
                      }))
                    }
                    className="w-full pl-8 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-semibold text-base focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Investment Horizon (Years)
                </label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={inputs.years || ''}
                  onChange={(e) =>
                    setInputs((prev) => ({
                      ...prev,
                      years: parseInt(e.target.value, 10) || 1,
                    }))
                  }
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-semibold text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Expected Annual Return
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.5"
                    value={inputs.annualInterestRate || ''}
                    onChange={(e) =>
                      setInputs((prev) => ({
                        ...prev,
                        annualInterestRate: parseFloat(e.target.value) || 0,
                      }))
                    }
                    className="w-full pl-3.5 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-semibold text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-mono"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-semibold">
                    %
                  </span>
                </div>
                <span className="text-[10px] text-slate-400">
                  Historical S&amp;P 500 average is ~10.2% nominal / ~7.5% real
                </span>
              </div>
            </div>
          </div>

          {/* Growth Table */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-slate-900">Year-by-Year Growth Table</h3>
            <div className="overflow-x-auto max-h-64">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase font-semibold border-b border-slate-200 sticky top-0">
                  <tr>
                    <th className="py-2 px-3">Year</th>
                    <th className="py-2 px-3 text-right">Deposits</th>
                    <th className="py-2 px-3 text-right">Interest Growth</th>
                    <th className="py-2 px-3 text-right">Total Balance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono tabular-nums">
                  {result.yearlySchedule.map((row) => (
                    <tr key={row.year} className="hover:bg-slate-50">
                      <td className="py-2 px-3 font-semibold text-slate-800">Year {row.year}</td>
                      <td className="py-2 px-3 text-right text-slate-600">
                        {formatCurrency(row.deposits, false)}
                      </td>
                      <td className="py-2 px-3 text-right text-emerald-600 font-medium">
                        +{formatCurrency(row.interest, false)}
                      </td>
                      <td className="py-2 px-3 text-right font-bold text-slate-900">
                        {formatCurrency(row.balance, false)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-5">
            <p className="text-xs uppercase font-bold tracking-wider text-slate-500">
              Future Portfolio Balance ({inputs.years} Years)
            </p>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl sm:text-4xl font-extrabold text-emerald-600 font-mono tracking-tight tabular-nums">
                {formatCurrency(result.endBalance, false)}
              </span>
            </div>

            <div className="space-y-3 pt-4 border-t border-slate-100 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-600">Total Principal Invested:</span>
                <span className="font-semibold text-slate-900 font-mono">
                  {formatCurrency(result.totalPrincipal, false)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Total Compound Interest:</span>
                <span className="font-extrabold text-emerald-600 font-mono">
                  +{formatCurrency(result.totalInterest, false)}
                </span>
              </div>
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900">
                <p className="text-xs">
                  Your money grew by{' '}
                  <strong>
                    {result.totalPrincipal > 0
                      ? `${((result.totalInterest / result.totalPrincipal) * 100).toFixed(0)}%`
                      : '0%'}
                  </strong>{' '}
                  above your out-of-pocket deposits due to continuous exponential compounding!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div
      <div className="mt-14 pt-10 border-t border-slate-200 text-slate-800 max-w-5xl mx-auto px-4">
        <div className="mb-6">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Wealth Accumulation Guide • 2026 Edition
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-3">
            The Power of Compound Interest: How Ordinary Investors Build Extraordinary Wealth
          </h2>
        </div>

        {/* Key Takeaways */}
        <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 mb-8">
          <h3 className="text-sm font-bold text-emerald-950 uppercase tracking-wide mb-2">
            Key Takeaways at a Glance
          </h3>
          <ul className="space-y-2 text-xs sm:text-sm text-emerald-900">
            <li>• <strong>Exponential vs Linear Growth:</strong> A $10,000 starting deposit with $500 monthly contributions at an 8% return grows into <strong>$343,778 in 20 years</strong>—where <strong>$213,778 is 100% free compound interest</strong> (a 164% gain above your actual deposits).</li>
            <li>• <strong>Dollar-Cost Averaging (DCA):</strong> Contributing monthly eliminates market timing guesswork, automatically accumulating more index fund shares during market dips.</li>
            <li>• <strong>The Rule of 72:</strong> Divide 72 by your annual interest rate to find your portfolio doubling time (at 8%, your money doubles every 9 years: 72 ÷ 8 = 9).</li>
            <li>• <strong>The Cost of Waiting:</strong> Delaying investing by just 10 years can cut your ultimate retirement wealth by more than half.</li>
          </ul>
        </div>

        {/* Content Section */}
        <div className="space-y-6 text-sm text-slate-700 leading-relaxed">
          <h3 className="text-xl font-bold text-slate-900">
            Simple vs. Compound Interest: The Snowball Effect
          </h3>
          <p>
            While simple interest only grows linearly on your original principal, compound interest pays you returns on both your principal and all previously accumulated interest. In the early years, your $500 monthly deposits do most of the work. But as your balance expands, compounding takes over—generating more money annually while you sleep than your entire yearly salary contributions.
          </p>

          <h3 className="text-xl font-bold text-slate-900">
            Frequently Asked Questions (FAQ)
          </h3>
          <div className="space-y-3 pt-2">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <h4 className="font-bold text-slate-900 text-sm">What is the historical average annual return of the S&amp;P 500?</h4>
              <p className="mt-1 text-xs text-slate-600">Historically, the S&amp;P 500 index has generated an annualized nominal return of approximately 10.2% before inflation, and roughly 7.5% real return after inflation over 20+ year horizons.</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <h4 className="font-bold text-slate-900 text-sm">What is the Rule of 72 in compound interest?</h4>
              <p className="mt-1 text-xs text-slate-600">The Rule of 72 is a quick mental math shortcut: divide 72 by your expected annual return to see how many years it takes for your investment to double (e.g. at 8%, 72 ÷ 8 = 9 years).</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
