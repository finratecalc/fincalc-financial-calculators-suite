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
      </div>
    </div>
  );
};
