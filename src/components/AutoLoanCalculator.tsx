import React, { useState, useMemo } from 'react';
import { Car, Download } from 'lucide-react';
import { AutoLoanInputs, AutoLoanResult } from '../types';
import { calculateAutoLoan, formatCurrency, formatPercent } from '../utils/calculators';
import { US_STATES_TAX_DATA } from '../data/usTaxRates';

interface AutoLoanCalculatorProps {
  onOpenReport?: (title: string, summary: any) => void;
}

const DEFAULT_INPUTS: AutoLoanInputs = {
  vehiclePrice: 38000,
  downPayment: 5000,
  tradeInValue: 6000,
  tradeInOwed: 2000,
  salesTaxPercent: 7.5,
  dealerDocAndRegistrationFees: 950,
  interestRate: 6.84,
  loanTermMonths: 60,
};

export const AutoLoanCalculator: React.FC<AutoLoanCalculatorProps> = ({ onOpenReport }) => {
  const [inputs, setInputs] = useState<AutoLoanInputs>(DEFAULT_INPUTS);
  const [selectedState, setSelectedState] = useState<string>('US_AVG');

  const result: AutoLoanResult = useMemo(() => {
    return calculateAutoLoan(inputs);
  }, [inputs]);

  const handleStateSelect = (stateCode: string) => {
    setSelectedState(stateCode);
    if (stateCode === 'US_AVG') {
      setInputs((prev) => ({ ...prev, salesTaxPercent: 7.5 }));
    } else if (US_STATES_TAX_DATA[stateCode]) {
      setInputs((prev) => ({
        ...prev,
        salesTaxPercent: US_STATES_TAX_DATA[stateCode].averageSalesTaxRate,
      }));
    }
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            US Auto Loan &amp; Financing Calculator
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Calculate your monthly car payment, true out-the-door price with US state sales tax, dealer doc fees, and trade-in equity.
          </p>
        </div>

        <button
          onClick={() =>
            onOpenReport?.('Auto Financing Breakdown', {
              type: 'auto-loan',
              inputs,
              result,
            })
          }
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs transition-colors shrink-0"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Download Auto Quote</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Inputs (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-5">
            <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
              Vehicle &amp; Financing Details
            </h2>

            {/* Vehicle Price */}
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">
                Vehicle Price (MSRP / Agreed Sale Price)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-semibold text-sm">
                  $
                </span>
                <input
                  type="number"
                  step="500"
                  value={inputs.vehiclePrice || ''}
                  onChange={(e) =>
                    setInputs((prev) => ({
                      ...prev,
                      vehiclePrice: parseFloat(e.target.value) || 0,
                    }))
                  }
                  className="w-full pl-8 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-semibold text-base focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-mono"
                />
              </div>
            </div>

            {/* Down Payment & Trade-In Equity */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Cash Down Payment
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-semibold text-xs">
                    $
                  </span>
                  <input
                    type="number"
                    step="500"
                    value={inputs.downPayment || ''}
                    onChange={(e) =>
                      setInputs((prev) => ({
                        ...prev,
                        downPayment: parseFloat(e.target.value) || 0,
                      }))
                    }
                    className="w-full pl-7 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-medium text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Trade-In Value
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-semibold text-xs">
                    $
                  </span>
                  <input
                    type="number"
                    step="500"
                    value={inputs.tradeInValue || ''}
                    onChange={(e) =>
                      setInputs((prev) => ({
                        ...prev,
                        tradeInValue: parseFloat(e.target.value) || 0,
                      }))
                    }
                    className="w-full pl-7 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-medium text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Trade-In Loan Owed
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-semibold text-xs">
                    $
                  </span>
                  <input
                    type="number"
                    step="500"
                    value={inputs.tradeInOwed || ''}
                    onChange={(e) =>
                      setInputs((prev) => ({
                        ...prev,
                        tradeInOwed: parseFloat(e.target.value) || 0,
                      }))
                    }
                    className="w-full pl-7 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-medium text-xs font-mono"
                  />
                </div>
              </div>
            </div>

            {/* State Sales Tax & Fees */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-semibold text-slate-700">State Sales Tax</label>
                  <select
                    value={selectedState}
                    onChange={(e) => handleStateSelect(e.target.value)}
                    className="text-[11px] px-1.5 py-0.5 bg-slate-100 rounded border border-slate-200 text-slate-700"
                  >
                    <option value="US_AVG">US Average (~7.5%)</option>
                    {Object.values(US_STATES_TAX_DATA).map((s) => (
                      <option key={s.code} value={s.code}>
                        {s.name} ({s.averageSalesTaxRate}%)
                      </option>
                    ))}
                  </select>
                </div>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    value={inputs.salesTaxPercent || ''}
                    onChange={(e) =>
                      setInputs((prev) => ({
                        ...prev,
                        salesTaxPercent: parseFloat(e.target.value) || 0,
                      }))
                    }
                    className="w-full pl-3 pr-7 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-medium text-xs font-mono"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">
                    %
                  </span>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Dealer Doc &amp; DMV Registration Fees
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-semibold text-xs">
                    $
                  </span>
                  <input
                    type="number"
                    step="50"
                    value={inputs.dealerDocAndRegistrationFees || ''}
                    onChange={(e) =>
                      setInputs((prev) => ({
                        ...prev,
                        dealerDocAndRegistrationFees: parseFloat(e.target.value) || 0,
                      }))
                    }
                    className="w-full pl-7 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-medium text-xs font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Term & APR */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Loan Term (Months)
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
                  <option value={36}>36 Months (3 Years)</option>
                  <option value={48}>48 Months (4 Years)</option>
                  <option value={60}>60 Months (5 Years - Most Popular)</option>
                  <option value={72}>72 Months (6 Years)</option>
                  <option value={84}>84 Months (7 Years)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Interest Rate (APR)
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
                <div className="flex gap-2 text-[10px] text-emerald-600 mt-1">
                  <button
                    onClick={() => setInputs((prev) => ({ ...prev, interestRate: 6.84 }))}
                    className="hover:underline"
                  >
                    New Car Avg: 6.84%
                  </button>
                  <button
                    onClick={() => setInputs((prev) => ({ ...prev, interestRate: 11.22 }))}
                    className="hover:underline"
                  >
                    Used Car Avg: 11.22%
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Results (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-5">
            <p className="text-xs uppercase font-bold tracking-wider text-slate-500">
              Total Monthly Auto Payment
            </p>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-mono tracking-tight tabular-nums">
                {formatCurrency(result.monthlyPayment)}
              </span>
              <span className="text-sm font-semibold text-slate-400">/ mo</span>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
              <div>
                <p className="text-xs text-slate-500 font-medium">Financed Amount</p>
                <p className="text-lg font-bold text-slate-900 font-mono tabular-nums">
                  {formatCurrency(result.totalLoanAmount, false)}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-500 font-medium">Total Interest</p>
                <p className="text-lg font-bold text-rose-600 font-mono tabular-nums">
                  {formatCurrency(result.totalInterest, false)}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-500 font-medium">Out-The-Door Price</p>
                <p className="text-base font-bold text-slate-800 font-mono tabular-nums">
                  {formatCurrency(result.outTheDoorPrice, false)}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-500 font-medium">State Sales Tax</p>
                <p className="text-base font-bold text-slate-800 font-mono tabular-nums">
                  {formatCurrency(result.totalSalesTax, false)}
                </p>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/60 text-xs text-slate-600 space-y-1">
              <div className="flex justify-between">
                <span>Vehicle Base Price:</span>
                <span className="font-mono">{formatCurrency(inputs.vehiclePrice, false)}</span>
              </div>
              <div className="flex justify-between">
                <span>Sales Tax + Fees:</span>
                <span className="font-mono">
                  +{formatCurrency(result.totalSalesTax + inputs.dealerDocAndRegistrationFees, false)}
                </span>
              </div>
              <div className="flex justify-between text-emerald-700 font-medium">
                <span>Total Upfront Equity Applied:</span>
                <span className="font-mono">
                  -{formatCurrency(inputs.downPayment + Math.max(0, inputs.tradeInValue - inputs.tradeInOwed), false)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
