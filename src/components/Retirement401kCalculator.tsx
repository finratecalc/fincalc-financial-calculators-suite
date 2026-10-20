import React, { useState, useMemo } from 'react';
import { PiggyBank, Sparkles, TrendingUp, Gift, Download } from 'lucide-react';
import { Retirement401kInputs, Retirement401kResult } from '../types';
import { calculate401k, formatCurrency, formatPercent } from '../utils/calculators';

interface Retirement401kCalculatorProps {
  onOpenReport?: (title: string, summary: any) => void;
}

const DEFAULT_INPUTS: Retirement401kInputs = {
  currentAge: 30,
  retirementAge: 65,
  currentSalary: 85000,
  currentBalance: 35000,
  contributionPercent: 10,
  employerMatchPercent: 50,
  employerMatchUpToPercent: 6,
  annualSalaryIncrease: 3,
  annualReturn: 7.5,
  inflationRate: 2.5,
  adjustForInflation: false,
};

export const Retirement401kCalculator: React.FC<Retirement401kCalculatorProps> = ({
  onOpenReport,
}) => {
  const [inputs, setInputs] = useState<Retirement401kInputs>(DEFAULT_INPUTS);
  const [activeTab, setActiveTab] = useState<'chart' | 'table'>('chart');

  const result: Retirement401kResult = useMemo(() => {
    return calculate401k(inputs);
  }, [inputs]);

  // Employer match annual dollar value
  const employeeContribAnnual = (inputs.currentSalary * inputs.contributionPercent) / 100;
  const matchEligibleSalary = (inputs.currentSalary * inputs.employerMatchUpToPercent) / 100;
  const employerMatchAnnual =
    Math.min(employeeContribAnnual, matchEligibleSalary) * (inputs.employerMatchPercent / 100);

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            401(k) &amp; Retirement Planner
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Simulate your retirement nest egg with IRS contribution caps, employer 401(k) match, and the 4% safe withdrawal rule.
          </p>
        </div>

        <button
          onClick={() =>
            onOpenReport?.('401(k) Retirement Projection', {
              type: '401k',
              inputs,
              result,
            })
          }
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs transition-colors shrink-0"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Download 401(k) Plan</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Inputs (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-5">
            <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
              Retirement Horizons &amp; Balance
            </h2>

            {/* Ages */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Current Age</label>
                <input
                  type="number"
                  min="18"
                  max="80"
                  value={inputs.currentAge || ''}
                  onChange={(e) =>
                    setInputs((prev) => ({
                      ...prev,
                      currentAge: parseInt(e.target.value, 10) || 18,
                    }))
                  }
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-semibold text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Target Retirement Age
                </label>
                <input
                  type="number"
                  min={inputs.currentAge + 1}
                  max="100"
                  value={inputs.retirementAge || ''}
                  onChange={(e) =>
                    setInputs((prev) => ({
                      ...prev,
                      retirementAge: parseInt(e.target.value, 10) || 65,
                    }))
                  }
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-semibold text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-mono"
                />
              </div>
            </div>

            {/* Salary & Balance */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Annual Salary
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-semibold text-sm">
                    $
                  </span>
                  <input
                    type="number"
                    step="1000"
                    value={inputs.currentSalary || ''}
                    onChange={(e) =>
                      setInputs((prev) => ({
                        ...prev,
                        currentSalary: parseFloat(e.target.value) || 0,
                      }))
                    }
                    className="w-full pl-8 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-semibold text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Current 401(k) / IRA Balance
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-semibold text-sm">
                    $
                  </span>
                  <input
                    type="number"
                    step="1000"
                    value={inputs.currentBalance || ''}
                    onChange={(e) =>
                      setInputs((prev) => ({
                        ...prev,
                        currentBalance: parseFloat(e.target.value) || 0,
                      }))
                    }
                    className="w-full pl-8 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-semibold text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Contributions & Employer Match */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-semibold text-slate-700">Your Contribution</label>
                  <span className="text-xs text-emerald-600 font-semibold">
                    {formatCurrency(employeeContribAnnual, false)}/yr
                  </span>
                </div>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={inputs.contributionPercent || ''}
                    onChange={(e) =>
                      setInputs((prev) => ({
                        ...prev,
                        contributionPercent: parseFloat(e.target.value) || 0,
                      }))
                    }
                    className="w-full pl-3 pr-7 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-medium text-xs font-mono"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-semibold">
                    %
                  </span>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Employer Match %
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={inputs.employerMatchPercent || ''}
                    onChange={(e) =>
                      setInputs((prev) => ({
                        ...prev,
                        employerMatchPercent: parseFloat(e.target.value) || 0,
                      }))
                    }
                    className="w-full pl-3 pr-7 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-medium text-xs font-mono"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-semibold">
                    %
                  </span>
                </div>
                <span className="text-[10px] text-slate-400">e.g. 50% match</span>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Match Up To Salary %
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    max="20"
                    value={inputs.employerMatchUpToPercent || ''}
                    onChange={(e) =>
                      setInputs((prev) => ({
                        ...prev,
                        employerMatchUpToPercent: parseFloat(e.target.value) || 0,
                      }))
                    }
                    className="w-full pl-3 pr-7 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-medium text-xs font-mono"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-semibold">
                    %
                  </span>
                </div>
                <span className="text-[10px] text-slate-400">e.g. up to 6% of pay</span>
              </div>
            </div>

            {/* Free Match Highlight */}
            {employerMatchAnnual > 0 && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-center justify-between text-xs text-emerald-900">
                <div className="flex items-center gap-2">
                  <Gift className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    <strong>Free Employer Match:</strong> You receive{' '}
                    <strong className="text-emerald-700">
                      {formatCurrency(employerMatchAnnual, false)}/year
                    </strong>{' '}
                    in company contributions. Over {inputs.retirementAge - inputs.currentAge} years,
                    that totals{' '}
                    <strong className="text-emerald-700">
                      {formatCurrency(result.totalEmployerContributions, false)}
                    </strong>
                    !
                  </span>
                </div>
              </div>
            )}

            {/* Growth Assumptions */}
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Expected Annual Return
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.5"
                    value={inputs.annualReturn || ''}
                    onChange={(e) =>
                      setInputs((prev) => ({
                        ...prev,
                        annualReturn: parseFloat(e.target.value) || 0,
                      }))
                    }
                    className="w-full pl-3 pr-7 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-medium text-xs font-mono"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">
                    %
                  </span>
                </div>
                <span className="text-[10px] text-slate-400">S&P 500 historic real avg: 7.5%</span>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Annual Salary Growth
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.5"
                    value={inputs.annualSalaryIncrease || ''}
                    onChange={(e) =>
                      setInputs((prev) => ({
                        ...prev,
                        annualSalaryIncrease: parseFloat(e.target.value) || 0,
                      }))
                    }
                    className="w-full pl-3 pr-7 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-medium text-xs font-mono"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">
                    %
                  </span>
                </div>
                <span className="text-[10px] text-slate-400">Typical US merit merit increase: 3%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Results (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-5">
            <p className="text-xs uppercase font-bold tracking-wider text-slate-500">
              Estimated 401(k) Nest Egg at Age {inputs.retirementAge}
            </p>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl sm:text-4xl font-extrabold text-emerald-600 font-mono tracking-tight tabular-nums">
                {formatCurrency(result.totalBalanceAtRetirement, false)}
              </span>
            </div>

            {/* 4% Safe Withdrawal Rule */}
            <div className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl space-y-1">
              <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                <span>Safe Withdrawal Rate (4% Rule)</span>
                <span className="font-bold text-slate-900 font-mono">
                  {formatCurrency(result.monthlyIncome4PercentRule * 12, false)}/yr
                </span>
              </div>
              <p className="text-xl font-bold text-slate-900 font-mono">
                {formatCurrency(result.monthlyIncome4PercentRule)}
                <span className="text-xs font-normal text-slate-500 ml-1">/ month</span>
              </p>
              <p className="text-[11px] text-slate-500">
                Estimated sustainable monthly retirement paycheck without depleting your principal.
              </p>
            </div>

            {/* Breakdown of Wealth */}
            <div className="pt-2 space-y-2.5 text-xs border-t border-slate-100">
              <h3 className="font-bold text-slate-700 uppercase tracking-wider text-[11px]">
                Wealth Source Breakdown
              </h3>

              <div className="flex justify-between py-1">
                <span className="text-slate-600">Your Contributions</span>
                <span className="font-semibold text-slate-900 font-mono">
                  {formatCurrency(result.totalEmployeeContributions, false)}
                </span>
              </div>

              <div className="flex justify-between py-1 border-t border-slate-100">
                <span className="text-slate-600">Employer Match (Free Money)</span>
                <span className="font-semibold text-emerald-600 font-mono">
                  +{formatCurrency(result.totalEmployerContributions, false)}
                </span>
              </div>

              <div className="flex justify-between py-1 border-t border-slate-100">
                <span className="text-slate-600">Compound Investment Growth</span>
                <span className="font-semibold text-indigo-600 font-mono">
                  +{formatCurrency(result.totalInterestEarned, false)}
                </span>
              </div>

              <div className="flex justify-between py-1 border-t border-slate-100">
                <span className="text-slate-600">Starting Balance</span>
                <span className="font-semibold text-slate-700 font-mono">
                  {formatCurrency(inputs.currentBalance, false)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
