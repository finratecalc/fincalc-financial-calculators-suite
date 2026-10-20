import React, { useState, useMemo } from 'react';
import { Percent, TrendingUp, History, Download } from 'lucide-react';
import { formatCurrency, formatPercent } from '../utils/calculators';

interface InflationCalculatorProps {
  onOpenReport?: (title: string, summary: any) => void;
}

// Representative historical US CPI factors indexed (BLS CPI-U)
const HISTORICAL_CPI: Record<number, number> = {
  1970: 38.8,
  1975: 53.8,
  1980: 82.4,
  1985: 107.6,
  1990: 130.7,
  1995: 152.4,
  2000: 172.2,
  2005: 195.3,
  2010: 218.056,
  2015: 237.017,
  2020: 258.811,
  2021: 270.970,
  2022: 292.655,
  2023: 304.702,
  2024: 314.175,
  2025: 323.286,
  2026: 332.661,
};

export const InflationCalculator: React.FC<InflationCalculatorProps> = ({ onOpenReport }) => {
  const [amount, setAmount] = useState<number>(100);
  const [mode, setMode] = useState<'historical' | 'future'>('historical');
  const [startYear, setStartYear] = useState<number>(2000);
  const [endYear, setEndYear] = useState<number>(2026);
  const [futureInflationRate, setFutureInflationRate] = useState<number>(2.9);
  const [futureYears, setFutureYears] = useState<number>(20);

  // Compute Historical
  const historicalResult = useMemo(() => {
    const cpiStart = HISTORICAL_CPI[startYear] || 172.2;
    const cpiEnd = HISTORICAL_CPI[endYear] || 332.661;
    const factor = cpiEnd / cpiStart;
    const adjustedAmount = amount * factor;
    const cumulativeInflation = (factor - 1) * 100;
    const yearsDiff = Math.max(1, endYear - startYear);
    const annualizedRate = (Math.pow(factor, 1 / yearsDiff) - 1) * 100;
    return {
      adjustedAmount,
      cumulativeInflation,
      annualizedRate,
    };
  }, [amount, startYear, endYear]);

  // Compute Future
  const futureResult = useMemo(() => {
    const rate = futureInflationRate / 100;
    const futureCost = amount * Math.pow(1 + rate, futureYears);
    const futurePurchasingPower = amount / Math.pow(1 + rate, futureYears);
    const cumulativeInflation = (Math.pow(1 + rate, futureYears) - 1) * 100;
    return {
      futureCost,
      futurePurchasingPower,
      cumulativeInflation,
    };
  }, [amount, futureInflationRate, futureYears]);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            US Inflation &amp; Purchasing Power Calculator
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Track historical purchasing power changes using official US Bureau of Labor Statistics (BLS CPI-U) benchmarks and project future inflation erosion.
          </p>
        </div>

        <button
          onClick={() =>
            onOpenReport?.('US Inflation Analysis', {
              type: 'inflation',
              mode,
              amount,
              result: mode === 'historical' ? historicalResult : futureResult,
            })
          }
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs transition-colors shrink-0"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Download Inflation Report</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-5">
            {/* Mode Switcher */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold text-slate-600">
              <button
                onClick={() => setMode('historical')}
                className={`flex-1 py-2 rounded-lg transition-colors ${
                  mode === 'historical' ? 'bg-white text-slate-900 shadow-xs' : 'hover:text-slate-900'
                }`}
              >
                Historical US CPI (1970–2026)
              </button>
              <button
                onClick={() => setMode('future')}
                className={`flex-1 py-2 rounded-lg transition-colors ${
                  mode === 'future' ? 'bg-white text-slate-900 shadow-xs' : 'hover:text-slate-900'
                }`}
              >
                Future Inflation Forecast
              </button>
            </div>

            {/* Amount */}
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Dollar Amount</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-semibold text-sm">
                  $
                </span>
                <input
                  type="number"
                  step="10"
                  value={amount || ''}
                  onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                  className="w-full pl-8 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-semibold text-base focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-mono"
                />
              </div>
            </div>

            {mode === 'historical' ? (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Start Year
                  </label>
                  <select
                    value={startYear}
                    onChange={(e) => setStartYear(parseInt(e.target.value, 10))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium text-xs focus:bg-white focus:outline-none"
                  >
                    {Object.keys(HISTORICAL_CPI)
                      .map(Number)
                      .filter((y) => y < endYear)
                      .map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">End Year</label>
                  <select
                    value={endYear}
                    onChange={(e) => setEndYear(parseInt(e.target.value, 10))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium text-xs focus:bg-white focus:outline-none"
                  >
                    {Object.keys(HISTORICAL_CPI)
                      .map(Number)
                      .filter((y) => y > startYear)
                      .map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                  </select>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Future Annual Inflation Rate
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.1"
                      value={futureInflationRate || ''}
                      onChange={(e) => setFutureInflationRate(parseFloat(e.target.value) || 0)}
                      className="w-full pl-3 pr-7 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-semibold text-xs font-mono"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">
                      %
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400">Current US CPI: 2.9%</span>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Years in Future
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={futureYears || ''}
                    onChange={(e) => setFutureYears(parseInt(e.target.value, 10) || 1)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-semibold text-xs font-mono"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-5">
            {mode === 'historical' ? (
              <>
                <p className="text-xs uppercase font-bold tracking-wider text-slate-500">
                  Value of ${amount} ({startYear}) in {endYear}
                </p>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-mono tracking-tight tabular-nums">
                    {formatCurrency(historicalResult.adjustedAmount)}
                  </span>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/60 space-y-2 text-xs text-slate-700">
                  <div className="flex justify-between">
                    <span>Cumulative US Inflation:</span>
                    <strong className="text-rose-600 font-mono">
                      +{formatPercent(historicalResult.cumulativeInflation, 1)}
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Average Annual Inflation Rate:</span>
                    <strong className="text-slate-900 font-mono">
                      {formatPercent(historicalResult.annualizedRate, 2)} / yr
                    </strong>
                  </div>
                </div>

                <p className="text-xs text-slate-500">
                  Due to consumer price inflation over {endYear - startYear} years, an item that cost{' '}
                  <strong>{formatCurrency(amount, false)}</strong> in {startYear} would cost approximately{' '}
                  <strong>{formatCurrency(historicalResult.adjustedAmount)}</strong> in {endYear}.
                </p>
              </>
            ) : (
              <>
                <p className="text-xs uppercase font-bold tracking-wider text-slate-500">
                  Future Equivalent Cost ({futureYears} Years)
                </p>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-mono tracking-tight tabular-nums">
                    {formatCurrency(futureResult.futureCost)}
                  </span>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/60 space-y-2 text-xs text-slate-700">
                  <div className="flex justify-between">
                    <span>Future Purchasing Power of ${amount}:</span>
                    <strong className="text-rose-600 font-mono">
                      {formatCurrency(futureResult.futurePurchasingPower)}
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Cumulative Erosion:</span>
                    <strong className="text-slate-900 font-mono">
                      {formatPercent(futureResult.cumulativeInflation, 1)}
                    </strong>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
