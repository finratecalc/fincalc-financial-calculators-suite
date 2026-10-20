import React, { useState, useMemo } from 'react';
import { Zap, TrendingDown, ArrowRight, CheckCircle2, Download } from 'lucide-react';
import { calculateMortgage, formatCurrency, formatPercent } from '../utils/calculators';

interface ExtraPaymentsCalculatorProps {
  onOpenReport?: (title: string, summary: any) => void;
}

export const ExtraPaymentsCalculator: React.FC<ExtraPaymentsCalculatorProps> = ({
  onOpenReport,
}) => {
  const [loanBalance, setLoanBalance] = useState<number>(350000);
  const [interestRate, setInterestRate] = useState<number>(6.5);
  const [remainingYears, setRemainingYears] = useState<number>(30);
  const [extraMonthly, setExtraMonthly] = useState<number>(250);

  // Calculate Base Scenario (No extra)
  const baseCalc = useMemo(() => {
    return calculateMortgage({
      homePrice: loanBalance,
      downPaymentPercent: 0,
      downPaymentDollar: 0,
      downPaymentMode: 'dollar',
      loanTermYears: remainingYears,
      interestRate,
      propertyTaxAnnual: 0,
      homeInsuranceAnnual: 0,
      hoaAnnual: 0,
      pmiRate: 0,
      includePmiAuto: false,
      extraPaymentMonthly: 0,
      extraPaymentAnnual: 0,
      extraPaymentOneTime: 0,
      extraPaymentOneTimeMonth: 1,
      startDate: '2026-11',
    });
  }, [loanBalance, interestRate, remainingYears]);

  // Calculate With Selected Extra
  const acceleratedCalc = useMemo(() => {
    return calculateMortgage({
      homePrice: loanBalance,
      downPaymentPercent: 0,
      downPaymentDollar: 0,
      downPaymentMode: 'dollar',
      loanTermYears: remainingYears,
      interestRate,
      propertyTaxAnnual: 0,
      homeInsuranceAnnual: 0,
      hoaAnnual: 0,
      pmiRate: 0,
      includePmiAuto: false,
      extraPaymentMonthly: extraMonthly,
      extraPaymentAnnual: 0,
      extraPaymentOneTime: 0,
      extraPaymentOneTimeMonth: 1,
      startDate: '2026-11',
    });
  }, [loanBalance, interestRate, remainingYears, extraMonthly]);

  // Quick comparison tiers
  const tiers = [100, 250, 500, 750].map((extra) => {
    const calc = calculateMortgage({
      homePrice: loanBalance,
      downPaymentPercent: 0,
      downPaymentDollar: 0,
      downPaymentMode: 'dollar',
      loanTermYears: remainingYears,
      interestRate,
      propertyTaxAnnual: 0,
      homeInsuranceAnnual: 0,
      hoaAnnual: 0,
      pmiRate: 0,
      includePmiAuto: false,
      extraPaymentMonthly: extra,
      extraPaymentAnnual: 0,
      extraPaymentOneTime: 0,
      extraPaymentOneTimeMonth: 1,
      startDate: '2026-11',
    });
    return {
      extra,
      monthsSaved: calc.monthsSaved,
      interestSaved: calc.interestSaved,
      actualYears: (calc.actualPayoffMonths / 12).toFixed(1),
    };
  });

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Extra Payments &amp; Loan Payoff Accelerator
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            See exactly how small extra monthly or bi-weekly principal payments knock years off your US mortgage and save tens of thousands in bank interest.
          </p>
        </div>

        <button
          onClick={() =>
            onOpenReport?.('Loan Payoff Acceleration Plan', {
              type: 'extra-payments',
              inputs: { loanBalance, interestRate, remainingYears, extraMonthly },
              result: acceleratedCalc,
            })
          }
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs transition-colors shrink-0"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Download Payoff Plan</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-5">
            <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
              Current Mortgage Details
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Remaining Mortgage Balance
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-semibold text-sm">
                    $
                  </span>
                  <input
                    type="number"
                    step="5000"
                    value={loanBalance || ''}
                    onChange={(e) => setLoanBalance(parseFloat(e.target.value) || 0)}
                    className="w-full pl-8 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-semibold text-base focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Interest Rate (APR)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    value={interestRate || ''}
                    onChange={(e) => setInterestRate(parseFloat(e.target.value) || 0)}
                    className="w-full pl-3.5 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-semibold text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-mono"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-semibold">
                    %
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Remaining Loan Term (Years)
                </label>
                <input
                  type="number"
                  min="1"
                  max="40"
                  value={remainingYears || ''}
                  onChange={(e) => setRemainingYears(parseInt(e.target.value, 10) || 1)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-semibold text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-mono"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Extra Monthly Payment ($)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-semibold text-sm">
                    $
                  </span>
                  <input
                    type="number"
                    step="50"
                    value={extraMonthly || ''}
                    onChange={(e) => setExtraMonthly(parseFloat(e.target.value) || 0)}
                    className="w-full pl-8 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-semibold text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-mono"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Acceleration Tier Comparison Grid */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-3">
            <h3 className="text-sm font-bold text-slate-900">
              Compare Extra Payment Acceleration Tiers
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {tiers.map((t) => (
                <button
                  key={t.extra}
                  onClick={() => setExtraMonthly(t.extra)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    extraMonthly === t.extra
                      ? 'border-emerald-500 bg-emerald-50/60 ring-2 ring-emerald-500/20'
                      : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                  }`}
                >
                  <p className="text-xs font-semibold text-slate-500">+{formatCurrency(t.extra, false)}/mo</p>
                  <p className="text-base font-extrabold text-emerald-700 mt-1 font-mono">
                    {formatCurrency(t.interestSaved, false)}
                  </p>
                  <p className="text-[11px] text-slate-600 mt-0.5">
                    Saves {Math.floor(t.monthsSaved / 12)}y {t.monthsSaved % 12}m
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-5">
            <p className="text-xs uppercase font-bold tracking-wider text-slate-500">
              Total Interest Saved With +${extraMonthly}/mo
            </p>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl sm:text-4xl font-extrabold text-emerald-600 font-mono tracking-tight tabular-nums">
                {formatCurrency(acceleratedCalc.interestSaved, false)}
              </span>
            </div>

            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2 text-xs text-emerald-950">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span className="font-bold text-sm">Debt Freedom Timeline</span>
              </div>
              <p>
                By adding just <strong>${extraMonthly}/month</strong> to your regular principal:
              </p>
              <div className="space-y-1.5 pt-2 border-t border-emerald-200">
                <div className="flex justify-between">
                  <span>New Payoff Horizon:</span>
                  <strong className="font-mono">
                    {(acceleratedCalc.actualPayoffMonths / 12).toFixed(1)} Years
                  </strong>
                </div>
                <div className="flex justify-between">
                  <span>Years Eliminated:</span>
                  <strong className="text-emerald-700 font-mono">
                    {Math.floor(acceleratedCalc.monthsSaved / 12)} Years {acceleratedCalc.monthsSaved % 12} Months
                  </strong>
                </div>
              </div>
            </div>

            <div className="space-y-2 pt-2 text-xs text-slate-600 border-t border-slate-100">
              <div className="flex justify-between">
                <span>Original Total Interest:</span>
                <span className="line-through font-mono">
                  {formatCurrency(baseCalc.totalInterestStandard, false)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Accelerated Total Interest:</span>
                <span className="font-bold text-slate-900 font-mono">
                  {formatCurrency(acceleratedCalc.totalInterestActual, false)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
