import React, { useState, useMemo } from 'react';
import { Landmark, TrendingDown, ArrowRight, ShieldCheck, Download } from 'lucide-react';
import { PersonalLoanInputs, PersonalLoanResult } from '../types';
import { calculatePersonalLoan, formatCurrency, formatPercent } from '../utils/calculators';

interface PersonalLoanCalculatorProps {
  onOpenReport?: (title: string, summary: any) => void;
}

const DEFAULT_INPUTS: PersonalLoanInputs = {
  loanAmount: 18000,
  interestRate: 9.99,
  loanTermMonths: 36,
  originationFeePercent: 1.0,
  compareCreditCardApr: 21.49,
};

export const PersonalLoanCalculator: React.FC<PersonalLoanCalculatorProps> = ({
  onOpenReport,
}) => {
  const [inputs, setInputs] = useState<PersonalLoanInputs>(DEFAULT_INPUTS);

  const result: PersonalLoanResult = useMemo(() => {
    return calculatePersonalLoan(inputs);
  }, [inputs]);

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Personal Loan &amp; Debt Consolidation Calculator
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Compare a fixed-rate personal loan against high-interest credit card debt to calculate your exact interest savings and debt freedom date.
          </p>
        </div>

        <button
          onClick={() =>
            onOpenReport?.('Debt Consolidation Analysis', {
              type: 'personal-loan',
              inputs,
              result,
            })
          }
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs transition-colors shrink-0"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Download Debt Report</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Inputs (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-5">
            <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
              Loan Terms &amp; Debt Details
            </h2>

            {/* Loan Amount */}
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Loan Amount / Debt to Consolidate
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-semibold text-sm">
                  $
                </span>
                <input
                  type="number"
                  step="500"
                  value={inputs.loanAmount || ''}
                  onChange={(e) =>
                    setInputs((prev) => ({
                      ...prev,
                      loanAmount: parseFloat(e.target.value) || 0,
                    }))
                  }
                  className="w-full pl-8 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-semibold text-base focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-mono"
                />
              </div>
            </div>

            {/* Term & APR */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Personal Loan Term
                </label>
                <select
                  value={inputs.loanTermMonths}
                  onChange={(e) =>
                    setInputs((prev) => ({
                      ...prev,
                      loanTermMonths: parseInt(e.target.value, 10),
                    }))
                  }
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                >
                  <option value={24}>24 Months (2 Years)</option>
                  <option value={36}>36 Months (3 Years)</option>
                  <option value={48}>48 Months (4 Years)</option>
                  <option value={60}>60 Months (5 Years)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Personal Loan APR
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    value={inputs.interestRate || ''}
                    onChange={(e) =>
                      setInputs((prev) => ({
                        ...prev,
                        interestRate: parseFloat(e.target.value) || 0,
                      }))
                    }
                    className="w-full pl-3 pr-7 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-semibold text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-mono"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-semibold">
                    %
                  </span>
                </div>
              </div>
            </div>

            {/* Origination Fee & Credit Card Benchmark APR */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Origination Fee
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.5"
                    value={inputs.originationFeePercent || ''}
                    onChange={(e) =>
                      setInputs((prev) => ({
                        ...prev,
                        originationFeePercent: parseFloat(e.target.value) || 0,
                      }))
                    }
                    className="w-full pl-3 pr-7 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-medium text-xs font-mono"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">
                    %
                  </span>
                </div>
                <span className="text-[10px] text-slate-400">
                  {formatCurrency(result.originationFeeDollar, false)} deducted from funding
                </span>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Current Credit Card APR
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    value={inputs.compareCreditCardApr || ''}
                    onChange={(e) =>
                      setInputs((prev) => ({
                        ...prev,
                        compareCreditCardApr: parseFloat(e.target.value) || 0,
                      }))
                    }
                    className="w-full pl-3 pr-7 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-medium text-xs font-mono"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">
                    %
                  </span>
                </div>
                <span className="text-[10px] text-slate-400">US average credit card APR: ~21.49%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Results (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-5">
            <p className="text-xs uppercase font-bold tracking-wider text-slate-500">
              Personal Loan Monthly Payment
            </p>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-mono tracking-tight tabular-nums">
                {formatCurrency(result.monthlyPayment)}
              </span>
              <span className="text-sm font-semibold text-slate-400">/ mo</span>
            </div>

            {/* Savings Callout */}
            {result.totalSavingsVsCreditCard > 0 && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-emerald-950 space-y-2">
                <div className="flex items-center gap-2">
                  <TrendingDown className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span className="font-bold text-sm">Debt Consolidation Advantage</span>
                </div>
                <p className="text-xs">
                  By consolidating into this {inputs.loanTermMonths}-month personal loan at{' '}
                  {inputs.interestRate}% APR instead of paying minimums on a credit card at{' '}
                  {inputs.compareCreditCardApr}%:
                </p>
                <div className="pt-1 flex items-baseline justify-between border-t border-emerald-200">
                  <span className="text-xs font-semibold">Total Interest Saved:</span>
                  <span className="text-lg font-extrabold text-emerald-700 font-mono">
                    {formatCurrency(result.totalSavingsVsCreditCard, false)}
                  </span>
                </div>
              </div>
            )}

            <div className="space-y-2.5 pt-2 text-xs border-t border-slate-100">
              <div className="flex justify-between">
                <span className="text-slate-600">Total Interest (Personal Loan):</span>
                <span className="font-bold text-slate-900 font-mono">
                  {formatCurrency(result.totalInterest, false)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Total Repayment Amount:</span>
                <span className="font-bold text-slate-900 font-mono">
                  {formatCurrency(result.totalRepayment, false)}
                </span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Credit Card Total Interest:</span>
                <span className="line-through font-mono">
                  {formatCurrency(result.creditCardTotalInterest, false)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-12 pt-10 border-t border-slate-200 text-slate-800 max-w-5xl mx-auto px-4">
        <div className="mb-6">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Comprehensive Guide • 2026 US Rate Environment
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-3">
            Personal Loans for Debt Consolidation: How to Slash Interest and Eliminate Credit Card Debt
          </h2>
        </div>

        {/* Key Takeaways */}
        <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 mb-8">
          <h3 className="text-sm font-bold text-emerald-950 uppercase tracking-wide mb-2">
            Key Takeaways at a Glance
          </h3>
          <ul className="space-y-2 text-xs sm:text-sm text-emerald-900">
            <li>• <strong>Massive Interest Savings:</strong> Replacing an $18,000 credit card debt at 21.49% with a 9.99% fixed personal loan saves over <strong>$10,857 in interest</strong>.</li>
            <li>• <strong>Guaranteed Debt Freedom Date:</strong> Enforces a strict 36, 48, or 60-month finish line, avoiding 15–20 years of revolving minimum payments.</li>
            <li>• <strong>Credit Score Boost:</strong> Eliminates high revolving utilization, typically generating an immediate <strong>40 to 70+ point FICO score increase</strong> within 60 days.</li>
            <li>• <strong>Origination Fee Transparency:</strong> Upfront fees (1% to 6%) are deducted from payout ($180 on $18k at 1%), but net savings remain overwhelmingly positive.</li>
          </ul>
        </div>

        {/* Content Section */}
        <div className="space-y-6 text-sm text-slate-700 leading-relaxed">
          <h3 className="text-xl font-bold text-slate-900">
            The Problem with Minimum Credit Card Payments: The Compound Interest Trap
          </h3>
          <p>
            Credit card interest compounds daily at rates often exceeding 21.49% APR. When paying only minimums on an $18,000 balance, over $320 of your payment goes to interest alone every month, taking up to 20 years to fully repay while costing over $13,940 in interest charges.
          </p>

          <h3 className="text-xl font-bold text-slate-900">
            How a Consolidation Personal Loan Breaks the Cycle
          </h3>
          <p>
            A fixed-rate personal loan pays off your variable credit cards in full. Instead of multiple uncertain card payments, you have one fixed, predictable monthly installment with a guaranteed payoff date.
          </p>

          <h3 className="text-xl font-bold text-slate-900">
            Frequently Asked Questions (FAQ)
          </h3>
          <div className="space-y-3 pt-2">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <h4 className="font-bold text-slate-900 text-sm">How does debt consolidation save money?</h4>
              <p className="mt-1 text-xs text-slate-600">By cutting your interest rate from 21%+ down to single digits, ensuring more of each payment pays down principal instead of finance fees.</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <h4 className="font-bold text-slate-900 text-sm">Will consolidating debt hurt my credit score?</h4>
              <p className="mt-1 text-xs text-slate-600">After a temporary 3–5 point dip from the hard inquiry, your credit score usually jumps 40 to 70+ points because your credit utilization ratio drops to near 0%.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
