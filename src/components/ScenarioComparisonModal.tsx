import React, { useState } from 'react';
import { X, Scale, ArrowRight, Check } from 'lucide-react';
import { calculateMortgage, formatCurrency, formatPercent } from '../utils/calculators';

interface ScenarioComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ScenarioComparisonModal: React.FC<ScenarioComparisonModalProps> = ({
  isOpen,
  onClose,
}) => {
  // Scenario A (e.g. 30Y Fixed)
  const [scenAPrice, setScenAPrice] = useState(400000);
  const [scenADown, setScenADown] = useState(20);
  const [scenATerm, setScenATerm] = useState(30);
  const [scenARate, setScenARate] = useState(6.62);
  const [scenAExtra, setScenAExtra] = useState(0);

  // Scenario B (e.g. 15Y Fixed or extra monthly)
  const [scenBPrice, setScenBPrice] = useState(400000);
  const [scenBDown, setScenBDown] = useState(20);
  const [scenBTerm, setScenBTerm] = useState(15);
  const [scenBRate, setScenBRate] = useState(5.89);
  const [scenBExtra, setScenBExtra] = useState(0);

  if (!isOpen) return null;

  const resA = calculateMortgage({
    homePrice: scenAPrice,
    downPaymentPercent: scenADown,
    downPaymentDollar: (scenAPrice * scenADown) / 100,
    downPaymentMode: 'percent',
    loanTermYears: scenATerm,
    interestRate: scenARate,
    propertyTaxAnnual: 4800,
    homeInsuranceAnnual: 1400,
    hoaAnnual: 0,
    pmiRate: 0.58,
    includePmiAuto: true,
    extraPaymentMonthly: scenAExtra,
    extraPaymentAnnual: 0,
    extraPaymentOneTime: 0,
    extraPaymentOneTimeMonth: 1,
    startDate: '2026-11',
  });

  const resB = calculateMortgage({
    homePrice: scenBPrice,
    downPaymentPercent: scenBDown,
    downPaymentDollar: (scenBPrice * scenBDown) / 100,
    downPaymentMode: 'percent',
    loanTermYears: scenBTerm,
    interestRate: scenBRate,
    propertyTaxAnnual: 4800,
    homeInsuranceAnnual: 1400,
    hoaAnnual: 0,
    pmiRate: 0.58,
    includePmiAuto: true,
    extraPaymentMonthly: scenBExtra,
    extraPaymentAnnual: 0,
    extraPaymentOneTime: 0,
    extraPaymentOneTimeMonth: 1,
    startDate: '2026-11',
  });

  const monthlyDiff = resB.totalMonthlyPayment - resA.totalMonthlyPayment;
  const interestSavedInB = resA.totalInterestActual - resB.totalInterestActual;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-4xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Compare 2 Mortgage Scenarios</h2>
              <p className="text-xs text-slate-500">
                Evaluate different loan terms, interest rates, or down payments side-by-side
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 2-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Scenario A */}
          <div className="bg-slate-50 rounded-xl p-5 border border-slate-200/80 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                Scenario A (Standard)
              </span>
              <span className="text-xs font-mono font-bold text-slate-900">
                {scenATerm}Y @ {scenARate}%
              </span>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs text-slate-600 block mb-1">Home Price</label>
                <input
                  type="number"
                  value={scenAPrice}
                  onChange={(e) => setScenAPrice(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-slate-600 block mb-1">Down Payment %</label>
                  <input
                    type="number"
                    value={scenADown}
                    onChange={(e) => setScenADown(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg font-mono"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-600 block mb-1">Term (Years)</label>
                  <select
                    value={scenATerm}
                    onChange={(e) => setScenATerm(parseInt(e.target.value, 10))}
                    className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg"
                  >
                    <option value={30}>30 Years</option>
                    <option value={20}>20 Years</option>
                    <option value={15}>15 Years</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-slate-600 block mb-1">Rate %</label>
                  <input
                    type="number"
                    step="0.05"
                    value={scenARate}
                    onChange={(e) => setScenARate(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg font-mono"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-600 block mb-1">Extra $/mo</label>
                  <input
                    type="number"
                    value={scenAExtra}
                    onChange={(e) => setScenAExtra(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Results A */}
            <div className="pt-3 border-t border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Monthly Payment:</span>
                <span className="text-base font-bold text-slate-900 font-mono">
                  {formatCurrency(resA.totalMonthlyPayment)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Total Interest:</span>
                <span className="font-semibold text-rose-600 font-mono">
                  {formatCurrency(resA.totalInterestActual, false)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Total Loan Cost:</span>
                <span className="font-semibold text-slate-800 font-mono">
                  {formatCurrency(resA.totalCostActual, false)}
                </span>
              </div>
            </div>
          </div>

          {/* Scenario B */}
          <div className="bg-emerald-50/50 rounded-xl p-5 border border-emerald-200 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                Scenario B (Alternative)
              </span>
              <span className="text-xs font-mono font-bold text-emerald-900">
                {scenBTerm}Y @ {scenBRate}%
              </span>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs text-slate-600 block mb-1">Home Price</label>
                <input
                  type="number"
                  value={scenBPrice}
                  onChange={(e) => setScenBPrice(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-slate-600 block mb-1">Down Payment %</label>
                  <input
                    type="number"
                    value={scenBDown}
                    onChange={(e) => setScenBDown(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg font-mono"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-600 block mb-1">Term (Years)</label>
                  <select
                    value={scenBTerm}
                    onChange={(e) => setScenBTerm(parseInt(e.target.value, 10))}
                    className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg"
                  >
                    <option value={30}>30 Years</option>
                    <option value={20}>20 Years</option>
                    <option value={15}>15 Years</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-slate-600 block mb-1">Rate %</label>
                  <input
                    type="number"
                    step="0.05"
                    value={scenBRate}
                    onChange={(e) => setScenBRate(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg font-mono"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-600 block mb-1">Extra $/mo</label>
                  <input
                    type="number"
                    value={scenBExtra}
                    onChange={(e) => setScenBExtra(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Results B */}
            <div className="pt-3 border-t border-emerald-200 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-600">Monthly Payment:</span>
                <span className="text-base font-bold text-slate-900 font-mono">
                  {formatCurrency(resB.totalMonthlyPayment)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Total Interest:</span>
                <span className="font-semibold text-rose-600 font-mono">
                  {formatCurrency(resB.totalInterestActual, false)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Total Loan Cost:</span>
                <span className="font-semibold text-slate-800 font-mono">
                  {formatCurrency(resB.totalCostActual, false)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Comparison Verdict */}
        <div className="bg-slate-900 text-white p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div>
            <p className="font-bold text-emerald-400 uppercase tracking-wider text-[11px]">
              Scenario Comparison Analysis:
            </p>
            <p className="text-slate-300 mt-1">
              {interestSavedInB > 0 ? (
                <span>
                  Scenario B saves{' '}
                  <strong className="text-white font-mono">
                    {formatCurrency(interestSavedInB, false)}
                  </strong>{' '}
                  in lifetime interest, but requires an additional{' '}
                  <strong className="text-white font-mono">
                    {formatCurrency(Math.abs(monthlyDiff))}
                  </strong>{' '}
                  / month in payments.
                </span>
              ) : (
                <span>
                  Scenario A saves{' '}
                  <strong className="text-white font-mono">
                    {formatCurrency(Math.abs(interestSavedInB), false)}
                  </strong>{' '}
                  in lifetime interest compared to Scenario B.
                </span>
              )}
            </p>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold whitespace-nowrap self-start sm:self-auto transition-colors"
          >
            Apply &amp; Return
          </button>
        </div>
      </div>
    </div>
  );
};
