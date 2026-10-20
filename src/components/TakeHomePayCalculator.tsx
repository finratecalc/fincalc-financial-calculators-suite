import React, { useState, useMemo } from 'react';
import { DollarSign, Shield, Info, ArrowRight, Download } from 'lucide-react';
import { TakeHomePayInputs, TakeHomePayResult } from '../types';
import { calculateTakeHomePay, formatCurrency, formatPercent } from '../utils/calculators';
import { US_STATES_TAX_DATA } from '../data/usTaxRates';

interface TakeHomePayCalculatorProps {
  onOpenReport?: (title: string, summary: any) => void;
}

const DEFAULT_INPUTS: TakeHomePayInputs = {
  grossSalary: 95000,
  payFrequency: 'bi-weekly',
  filingStatus: 'single',
  usState: 'CA',
  k401ContributionAnnual: 6000,
  hsaAnnual: 1000,
  healthInsuranceAnnual: 2400,
  otherPreTaxAnnual: 0,
};

export const TakeHomePayCalculator: React.FC<TakeHomePayCalculatorProps> = ({ onOpenReport }) => {
  const [inputs, setInputs] = useState<TakeHomePayInputs>(DEFAULT_INPUTS);

  const result: TakeHomePayResult = useMemo(() => {
    return calculateTakeHomePay(inputs);
  }, [inputs]);

  const stateProfile = US_STATES_TAX_DATA[inputs.usState] || US_STATES_TAX_DATA.CA;

  const frequencyLabel = {
    annual: 'Yearly',
    monthly: 'Monthly',
    'semi-monthly': 'Semi-Monthly (24 checks)',
    'bi-weekly': 'Bi-Weekly (26 checks)',
    weekly: 'Weekly (52 checks)',
  }[inputs.payFrequency];

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            US Take-Home Pay (Paycheck) Calculator
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Calculate accurate net pay after Federal income taxes, FICA (Social Security & Medicare), and State taxes for all 50 US states.
          </p>
        </div>

        <button
          onClick={() =>
            onOpenReport?.('US Paycheck & Take-Home Report', {
              type: 'take-home',
              inputs,
              result,
            })
          }
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs transition-colors shrink-0"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Download Paycheck Report</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Inputs (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-5">
            <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
              Salary & Filing Status
            </h2>

            {/* Gross Annual Salary */}
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Annual Gross Salary
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-semibold text-sm">
                  $
                </span>
                <input
                  type="number"
                  step="1000"
                  value={inputs.grossSalary || ''}
                  onChange={(e) =>
                    setInputs((prev) => ({
                      ...prev,
                      grossSalary: parseFloat(e.target.value) || 0,
                    }))
                  }
                  className="w-full pl-8 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-semibold text-base focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-mono tabular-nums"
                  placeholder="95000"
                />
              </div>

              {/* Quick salary chips */}
              <div className="flex items-center gap-1.5 mt-2">
                <span className="text-[11px] text-slate-400 mr-1">Quick:</span>
                {[50000, 75000, 100000, 150000, 200000].map((sal) => (
                  <button
                    key={sal}
                    onClick={() => setInputs((prev) => ({ ...prev, grossSalary: sal }))}
                    className={`px-2 py-0.5 text-xs rounded transition-colors font-medium ${
                      inputs.grossSalary === sal
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                    }`}
                  >
                    ${sal / 1000}k
                  </button>
                ))}
              </div>
            </div>

            {/* Pay Frequency & Filing Status */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Pay Frequency
                </label>
                <select
                  value={inputs.payFrequency}
                  onChange={(e) =>
                    setInputs((prev) => ({
                      ...prev,
                      payFrequency: e.target.value as any,
                    }))
                  }
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                >
                  <option value="bi-weekly">Bi-Weekly (Every 2 weeks / 26)</option>
                  <option value="semi-monthly">Semi-Monthly (2x per month / 24)</option>
                  <option value="monthly">Monthly (12)</option>
                  <option value="weekly">Weekly (52)</option>
                  <option value="annual">Annually (1)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Federal Filing Status
                </label>
                <select
                  value={inputs.filingStatus}
                  onChange={(e) =>
                    setInputs((prev) => ({
                      ...prev,
                      filingStatus: e.target.value as any,
                    }))
                  }
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                >
                  <option value="single">Single (Std. Ded. $14,600)</option>
                  <option value="married-joint">Married Filing Jointly (Std. Ded. $29,200)</option>
                  <option value="head-of-household">Head of Household (Std. Ded. $21,900)</option>
                </select>
              </div>
            </div>

            {/* US State Selector */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-semibold text-slate-700">US State</label>
                <span className="text-xs text-slate-500">
                  {!stateProfile.hasIncomeTax ? (
                    <span className="text-emerald-600 font-semibold">
                      {stateProfile.name} has NO state income tax!
                    </span>
                  ) : (
                    <span>
                      {stateProfile.type === 'flat'
                        ? `Flat ${stateProfile.flatRate}% rate`
                        : `Graduated state tax (~${stateProfile.averageEffectiveIncomeTaxRate}%)`}
                    </span>
                  )}
                </span>
              </div>
              <select
                value={inputs.usState}
                onChange={(e) => setInputs((prev) => ({ ...prev, usState: e.target.value }))}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              >
                {Object.values(US_STATES_TAX_DATA).map((s) => (
                  <option key={s.code} value={s.code}>
                    {s.name} ({s.code}) {!s.hasIncomeTax ? '— No State Income Tax' : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* PRE-TAX DEDUCTIONS (401k, HSA, Medical) */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
              Pre-Tax Deductions (Lower Your Taxable Income)
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  401(k) / 403(b) Annual
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-semibold text-xs">
                    $
                  </span>
                  <input
                    type="number"
                    min="0"
                    max="31000"
                    step="500"
                    value={inputs.k401ContributionAnnual || ''}
                    onChange={(e) =>
                      setInputs((prev) => ({
                        ...prev,
                        k401ContributionAnnual: parseFloat(e.target.value) || 0,
                      }))
                    }
                    className="w-full pl-7 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-medium text-xs font-mono tabular-nums"
                  />
                </div>
                <span className="text-[10px] text-slate-400">IRS Cap: $23,500</span>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  HSA / FSA Annual
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-semibold text-xs">
                    $
                  </span>
                  <input
                    type="number"
                    min="0"
                    max="8550"
                    step="100"
                    value={inputs.hsaAnnual || ''}
                    onChange={(e) =>
                      setInputs((prev) => ({
                        ...prev,
                        hsaAnnual: parseFloat(e.target.value) || 0,
                      }))
                    }
                    className="w-full pl-7 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-medium text-xs font-mono tabular-nums"
                  />
                </div>
                <span className="text-[10px] text-slate-400">HSA Cap: $4,300 single</span>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Health & Dental Ins.
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-semibold text-xs">
                    $
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="100"
                    value={inputs.healthInsuranceAnnual || ''}
                    onChange={(e) =>
                      setInputs((prev) => ({
                        ...prev,
                        healthInsuranceAnnual: parseFloat(e.target.value) || 0,
                      }))
                    }
                    className="w-full pl-7 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-medium text-xs font-mono tabular-nums"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Results (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-5">
            <p className="text-xs uppercase font-bold tracking-wider text-slate-500">
              Estimated Take-Home Pay ({frequencyLabel})
            </p>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl sm:text-4xl font-extrabold text-emerald-600 font-mono tracking-tight tabular-nums">
                {formatCurrency(result.netPerPaycheck)}
              </span>
              <span className="text-sm font-semibold text-slate-400">/ check</span>
            </div>

            {/* Annual Take-Home & Effective Rate */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
              <div>
                <p className="text-xs text-slate-500 font-medium">Annual Net Take-Home</p>
                <p className="text-lg font-bold text-slate-900 font-mono tabular-nums">
                  {formatCurrency(result.annual.netTakeHome, false)}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-500 font-medium">Effective Tax Rate</p>
                <p className="text-lg font-bold text-rose-600 font-mono tabular-nums">
                  {formatPercent(result.effectiveTaxRate, 1)}
                </p>
              </div>
            </div>

            {/* Per Paycheck Deduction Breakdown */}
            <div className="pt-4 border-t border-slate-100 space-y-2.5 text-xs">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Paycheck Breakdown
              </h3>

              <div className="flex justify-between py-1">
                <span className="text-slate-600">Gross Paycheck</span>
                <span className="font-bold text-slate-900 font-mono">
                  {formatCurrency(result.grossPerPaycheck)}
                </span>
              </div>

              <div className="flex justify-between py-1 border-t border-slate-100">
                <span className="text-slate-600">Federal Income Tax</span>
                <span className="font-semibold text-rose-600 font-mono">
                  -{formatCurrency(result.federalTaxPerPaycheck)}
                </span>
              </div>

              <div className="flex justify-between py-1 border-t border-slate-100">
                <span className="text-slate-600">State Income Tax ({inputs.usState})</span>
                <span className="font-semibold text-rose-600 font-mono">
                  -{formatCurrency(result.stateTaxPerPaycheck)}
                </span>
              </div>

              <div className="flex justify-between py-1 border-t border-slate-100">
                <span className="text-slate-600">Social Security (6.2%)</span>
                <span className="font-semibold text-slate-700 font-mono">
                  -{formatCurrency(result.socialSecurityPerPaycheck)}
                </span>
              </div>

              <div className="flex justify-between py-1 border-t border-slate-100">
                <span className="text-slate-600">Medicare (1.45%)</span>
                <span className="font-semibold text-slate-700 font-mono">
                  -{formatCurrency(result.medicarePerPaycheck)}
                </span>
              </div>

              <div className="flex justify-between py-1 border-t border-slate-100">
                <span className="text-slate-600">Pre-Tax Deductions (401k/HSA)</span>
                <span className="font-semibold text-indigo-600 font-mono">
                  -{formatCurrency(result.preTaxDeductionsPerPaycheck)}
                </span>
              </div>

              <div className="flex justify-between py-2 border-t-2 border-slate-200 font-bold text-sm bg-emerald-50/50 px-2 rounded-lg">
                <span className="text-emerald-900">Net Pay Deposited</span>
                <span className="text-emerald-700 font-mono">
                  {formatCurrency(result.netPerPaycheck)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
