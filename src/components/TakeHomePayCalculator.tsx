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
      <article className="mt-12 bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 shadow-sm space-y-8 text-left">
        <header className="space-y-4 border-b border-slate-200 pb-6">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 uppercase tracking-wider">
            <span>US Payroll & Tax Strategy Guide</span>
            <span>·</span>
            <span>Updated for IRS Tax Year 2026</span>
            <span>·</span>
            <span>10 Min Read</span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
            How to Calculate Your US Take-Home Pay: Gross vs. Net Income, Tax Brackets, and Deductions
          </h1>

          <p className="text-base text-slate-600 leading-relaxed">
            Why does a $100,000 salary look more like $74,000 in your bank account? Here is the exact breakdown of Federal Income Tax, FICA mandatory contributions, state withholdings, and pre-tax mechanisms that determine your real paycheck.
          </p>

          <div className="text-xs text-slate-500">
            By <strong>FinRateCalc Editorial & Fiduciary Tax Advisory Desk</strong> · Fact-checked against IRS Pub. 15-T
          </div>
        </header>

        <div className="bg-emerald-50/80 border border-emerald-200 rounded-xl p-5 space-y-2.5">
          <div className="text-xs font-bold text-emerald-900 uppercase tracking-wider">
            Key Takeaways at a Glance
          </div>
          <ul className="space-y-1.5 text-xs sm:text-sm text-emerald-950 leading-relaxed list-disc list-inside">
            <li><strong>Gross Pay</strong> is your contracted total salary, while <strong>Net Pay (Take-Home Pay)</strong> is the actual cash deposited in your bank.</li>
            <li>Every W-2 worker pays mandatory <strong>FICA taxes</strong>: 6.2% Social Security (up to statutory cap) and 1.45% Medicare.</li>
            <li><strong>Progressive Federal Tax Brackets</strong> mean only dollars inside each bracket are taxed at that rate, not your entire income.</li>
            <li>Pre-tax deductions (401k, HSA, health insurance) reduce your taxable income dollar-for-dollar.</li>
            <li>Living in a state with no income tax (Texas, Florida, Washington, etc.) saves thousands annually compared to California or New York.</li>
          </ul>
        </div>

        <section className="space-y-3">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 border-b border-slate-200 pb-2">
            1. The Core Equation: Gross Pay vs. Net Pay
          </h2>
          <p className="text-sm text-slate-700 leading-relaxed">
            When you receive a job offer stating a "$90,000 annual salary," that number is your <strong>gross pay</strong>. What arrives via direct deposit every other Friday is your <strong>net pay</strong> (take-home pay).
          </p>
          <div className="bg-slate-900 text-white p-4 rounded-xl font-mono text-xs sm:text-sm overflow-x-auto">
            Take-Home Pay = Gross Pay - (Pre-Tax Deductions + Federal Withholding + FICA Taxes + State Taxes)
          </div>
          <p className="text-xs text-slate-500">
            Budgeting rent, mortgages, and auto loans around your gross pay rather than your net take-home pay is the single most common cause of household financial stress.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 border-b border-slate-200 pb-2">
            2. Mandatory Deductions: Understanding FICA Taxes
          </h2>
          <p className="text-sm text-slate-700 leading-relaxed">
            All W-2 employees in the United States must pay <strong>FICA (Federal Insurance Contributions Act)</strong> taxes:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-1">
              <h3 className="font-bold text-slate-900 text-sm">Social Security Tax (6.2%)</h3>
              <p className="text-xs text-slate-600">
                You pay 6.2% of your gross earnings, matched by your employer. Earnings above the annual statutory limit are exempt from further Social Security tax for that year.
              </p>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-1">
              <h3 className="font-bold text-slate-900 text-sm">Medicare Tax (1.45%)</h3>
              <p className="text-xs text-slate-600">
                You pay 1.45% on all earnings without any cap. Individuals earning over $200k pay an extra 0.9% Additional Medicare tax.
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 border-b border-slate-200 pb-2">
            3. Federal Progressive Income Tax Brackets
          </h2>
          <p className="text-sm text-slate-700 leading-relaxed">
            Federal taxes are progressive. Moving into a higher bracket only taxes the dollars earned *inside that specific corridor*. Before calculating taxes, subtract your <strong>Standard Deduction</strong> (~$15,000 for single filers, ~$30,000 for married couples).
          </p>

          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-xs sm:text-sm text-left">
              <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-4 py-2.5">Rate</th>
                  <th className="px-4 py-2.5">Single Filer Bracket</th>
                  <th className="px-4 py-2.5">Married Filing Jointly</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="px-4 py-2 font-bold text-emerald-700">10%</td>
                  <td className="px-4 py-2">$0 to $11,925</td>
                  <td className="px-4 py-2">$0 to $23,850</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-bold text-emerald-700">12%</td>
                  <td className="px-4 py-2">$11,926 to $48,475</td>
                  <td className="px-4 py-2">$23,851 to $96,950</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-bold text-emerald-700">22%</td>
                  <td className="px-4 py-2">$48,476 to $103,350</td>
                  <td className="px-4 py-2">$96,951 to $206,700</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-bold text-emerald-700">24%</td>
                  <td className="px-4 py-2">$103,351 to $197,300</td>
                  <td className="px-4 py-2">$206,701 to $394,600</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 border-b border-slate-200 pb-2">
            4. Case Study: An Audited $100,000 Annual Salary
          </h2>
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-2 text-xs sm:text-sm font-mono">
            <div className="flex justify-between font-bold text-slate-900">
              <span>Gross Base Salary:</span>
              <span>$100,000.00</span>
            </div>
            <div className="flex justify-between text-emerald-700">
              <span>Less: 401(k) Pre-Tax Contribution:</span>
              <span>-$6,000.00</span>
            </div>
            <div className="flex justify-between text-rose-600">
              <span>Less: FICA Taxes (7.65%):</span>
              <span>-$7,650.00</span>
            </div>
            <div className="flex justify-between text-rose-600">
              <span>Less: Federal Income Tax:</span>
              <span>-$12,480.00</span>
            </div>
            <div className="flex justify-between text-rose-600">
              <span>Less: State Tax (~4.4%):</span>
              <span>-$4,136.00</span>
            </div>
            <div className="flex justify-between py-2 border-t border-slate-200 font-bold text-emerald-900 bg-emerald-100/60 px-3 rounded text-sm sm:text-base">
              <span>Net Take-Home Pay (Annual):</span>
              <span>$69,734.00</span>
            </div>
            <div className="flex justify-between text-slate-500 pt-1 text-xs">
              <span>Bi-Weekly Paycheck (26x per year):</span>
              <span className="font-bold text-slate-900">$2,682.08</span>
            </div>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 border-b border-slate-200 pb-2">
            5. Legal Ways to Maximize Your Monthly Take-Home Pay
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
              <h4 className="font-bold text-slate-900 text-sm">1. Recalibrate Form W-4</h4>
              <p className="text-xs text-slate-600">
                If you get a large refund in April, adjust Step 3 or 4 to keep an extra $300 to $400 in each monthly paycheck.
              </p>
            </div>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
              <h4 className="font-bold text-slate-900 text-sm">2. Max Pre-Tax HSAs</h4>
              <p className="text-xs text-slate-600">
                Health Savings Accounts bypass Federal, State, and FICA taxes—saving roughly 25% to 30% in immediate tax.
              </p>
            </div>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
              <h4 className="font-bold text-slate-900 text-sm">3. Section 125 Plans</h4>
              <p className="text-xs text-slate-600">
                Deduct commuter transit passes, parking, and childcare pre-tax to lower your taxable payroll ceiling.
              </p>
            </div>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
              <h4 className="font-bold text-slate-900 text-sm">4. State Tax Arbitrage</h4>
              <p className="text-xs text-slate-600">
                Moving to zero-income-tax states (Texas, Florida, Washington, Nevada, Tennessee) immediately raises liquid income.
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 border-b border-slate-200 pb-2">
            6. Frequently Asked Questions (FAQ)
          </h2>
          <div className="space-y-3 text-xs sm:text-sm">
            <div className="p-4 border border-slate-200 rounded-xl bg-slate-50">
              <h4 className="font-bold text-slate-900">Bi-Weekly vs. Semi-Monthly: What is the difference?</h4>
              <p className="text-slate-600 mt-1">
                Bi-weekly means 26 paychecks per year (paid every 2 weeks). Semi-monthly means 24 paychecks per year (paid twice a month, usually the 15th and end of month).
              </p>
            </div>
            <div className="p-4 border border-slate-200 rounded-xl bg-slate-50">
              <h4 className="font-bold text-slate-900">Do 401(k) pre-tax contributions reduce FICA taxes?</h4>
              <p className="text-slate-600 mt-1">
                No. 401(k) contributions reduce Federal and State income taxes, but you still pay Social Security and Medicare (FICA).
              </p>
            </div>
          </div>
        </section>
      </article>
    </div>
    
</div>
  );
};
