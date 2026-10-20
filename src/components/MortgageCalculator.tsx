import React, { useState, useMemo } from 'react';
import {
  Download,
  FileSpreadsheet,
  RotateCcw,
  Info,
  Calendar,
  Sparkles,
  TrendingDown,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { MortgageInputs, MortgageResult } from '../types';
import { calculateMortgage, formatCurrency, formatPercent, formatNumber } from '../utils/calculators';
import { US_STATES_TAX_DATA } from '../data/usTaxRates';
import { US_MORTGAGE_BENCHMARKS } from '../data/usMarketRates';

interface MortgageCalculatorProps {
  onSaveRecent?: (resultSummary: string, data: any) => void;
  onOpenReport?: (title: string, summary: any) => void;
}

const DEFAULT_INPUTS: MortgageInputs = {
  homePrice: 400000,
  downPaymentPercent: 20,
  downPaymentDollar: 80000,
  downPaymentMode: 'percent',
  loanTermYears: 30,
  interestRate: 6.5,
  propertyTaxAnnual: 4800,
  homeInsuranceAnnual: 1400,
  hoaAnnual: 0,
  pmiRate: 0.58,
  includePmiAuto: true,
  extraPaymentMonthly: 0,
  extraPaymentAnnual: 0,
  extraPaymentOneTime: 0,
  extraPaymentOneTimeMonth: 12,
  startDate: '2026-11',
};

export const MortgageCalculator: React.FC<MortgageCalculatorProps> = ({
  onSaveRecent,
  onOpenReport,
}) => {
  const [inputs, setInputs] = useState<MortgageInputs>(DEFAULT_INPUTS);
  const [selectedState, setSelectedState] = useState<string>('US_AVG');
  const [scheduleView, setScheduleView] = useState<'yearly' | 'monthly'>('yearly');
  const [schedulePage, setSchedulePage] = useState<number>(1);
  const [showAdvancedEscrow, setShowAdvancedEscrow] = useState<boolean>(true);
  const [showExtraPayoff, setShowExtraPayoff] = useState<boolean>(true);
  const [yearFilter, setYearFilter] = useState<string>('all');

  // Compute results
  const result: MortgageResult = useMemo(() => {
    return calculateMortgage(inputs);
  }, [inputs]);

  // Handlers for inputs
  const handleHomePriceChange = (val: number) => {
    const newPrice = Math.max(0, val);
    let newDollar = inputs.downPaymentDollar;
    let newPercent = inputs.downPaymentPercent;

    if (inputs.downPaymentMode === 'percent') {
      newDollar = Math.round((newPrice * inputs.downPaymentPercent) / 100);
    } else {
      newPercent = newPrice > 0 ? (newDollar / newPrice) * 100 : 0;
    }

    // Auto-update property tax default based on selected state if applicable
    let newTax = inputs.propertyTaxAnnual;
    if (selectedState !== 'CUSTOM' && selectedState !== 'US_AVG' && US_STATES_TAX_DATA[selectedState]) {
      const stateRate = US_STATES_TAX_DATA[selectedState].averagePropertyTaxRate;
      newTax = Math.round((newPrice * stateRate) / 100);
    }

    setInputs((prev) => ({
      ...prev,
      homePrice: newPrice,
      downPaymentDollar: newDollar,
      downPaymentPercent: parseFloat(newPercent.toFixed(2)),
      propertyTaxAnnual: newTax,
    }));
  };

  const handleDownPercentChange = (percent: number) => {
    const validPercent = Math.max(0, Math.min(100, percent));
    const dollar = Math.round((inputs.homePrice * validPercent) / 100);
    setInputs((prev) => ({
      ...prev,
      downPaymentPercent: validPercent,
      downPaymentDollar: dollar,
      downPaymentMode: 'percent',
    }));
  };

  const handleDownDollarChange = (dollar: number) => {
    const validDollar = Math.max(0, Math.min(inputs.homePrice, dollar));
    const percent = inputs.homePrice > 0 ? (validDollar / inputs.homePrice) * 100 : 0;
    setInputs((prev) => ({
      ...prev,
      downPaymentDollar: validDollar,
      downPaymentPercent: parseFloat(percent.toFixed(2)),
      downPaymentMode: 'dollar',
    }));
  };

  const handleStateSelect = (stateCode: string) => {
    setSelectedState(stateCode);
    if (stateCode === 'US_AVG') {
      setInputs((prev) => ({
        ...prev,
        propertyTaxAnnual: Math.round(prev.homePrice * 0.012),
        homeInsuranceAnnual: 1400,
      }));
    } else if (US_STATES_TAX_DATA[stateCode]) {
      const profile = US_STATES_TAX_DATA[stateCode];
      setInputs((prev) => ({
        ...prev,
        propertyTaxAnnual: Math.round((prev.homePrice * profile.averagePropertyTaxRate) / 100),
        homeInsuranceAnnual: profile.averageHomeownersInsuranceAnnual,
      }));
    }
  };

  // Presets
  const applyPreset = (presetType: '30y-400k' | '15y-320k' | 'fha-350k' | 'jumbo-850k') => {
    if (presetType === '30y-400k') {
      setInputs({
        ...DEFAULT_INPUTS,
        homePrice: 400000,
        downPaymentPercent: 20,
        downPaymentDollar: 80000,
        loanTermYears: 30,
        interestRate: 6.5,
        propertyTaxAnnual: 4800,
        homeInsuranceAnnual: 1400,
      });
    } else if (presetType === '15y-320k') {
      setInputs({
        ...DEFAULT_INPUTS,
        homePrice: 400000,
        downPaymentPercent: 20,
        downPaymentDollar: 80000,
        loanTermYears: 15,
        interestRate: 5.89,
        propertyTaxAnnual: 4800,
        homeInsuranceAnnual: 1400,
      });
    } else if (presetType === 'fha-350k') {
      setInputs({
        ...DEFAULT_INPUTS,
        homePrice: 350000,
        downPaymentPercent: 3.5,
        downPaymentDollar: 12250,
        loanTermYears: 30,
        interestRate: 6.25,
        propertyTaxAnnual: 4200,
        homeInsuranceAnnual: 1350,
        pmiRate: 0.85,
        includePmiAuto: true,
      });
    } else if (presetType === 'jumbo-850k') {
      setInputs({
        ...DEFAULT_INPUTS,
        homePrice: 850000,
        downPaymentPercent: 20,
        downPaymentDollar: 170000,
        loanTermYears: 30,
        interestRate: 6.78,
        propertyTaxAnnual: 10200,
        homeInsuranceAnnual: 2200,
      });
    }
  };

  // CSV Export
  const exportCSV = () => {
    const headers = [
      'Month',
      'Date',
      'Total Payment',
      'Principal',
      'Interest',
      'Extra Principal',
      'Remaining Balance',
      'Total Interest Paid',
      'PMI Paid',
    ];
    const rows = result.amortizationMonthly.map((r) => [
      r.month,
      r.dateStr,
      r.payment.toFixed(2),
      r.principal.toFixed(2),
      r.interest.toFixed(2),
      r.extraPrincipal.toFixed(2),
      r.remainingBalance.toFixed(2),
      r.totalInterestPaid.toFixed(2),
      r.pmiPaid.toFixed(2),
    ]);
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `FinRateCalc_Mortgage_Amortization_${inputs.homePrice}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Trigger PDF Report
  const handleDownloadPDF = () => {
    if (onOpenReport) {
      onOpenReport('Mortgage Loan Report', {
        type: 'mortgage',
        inputs,
        result,
      });
    } else {
      window.print();
    }
  };

  // Donut chart calculations
  const total = result.totalMonthlyPayment;
  const piPct = total > 0 ? (result.monthlyPrincipalInterest / total) * 100 : 0;
  const taxPct = total > 0 ? (result.monthlyPropertyTax / total) * 100 : 0;
  const insPct = total > 0 ? (result.monthlyInsurance / total) * 100 : 0;
  const pmiPct = total > 0 ? (result.monthlyPmi / total) * 100 : 0;
  const hoaPct = total > 0 ? (result.monthlyHoa / total) * 100 : 0;

  // SVG Donut strokes
  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  const strokePI = (piPct / 100) * circumference;
  const strokeTax = (taxPct / 100) * circumference;
  const strokeIns = (insPct / 100) * circumference;
  const strokePmi = (pmiPct / 100) * circumference;
  const strokeHoa = (hoaPct / 100) * circumference;

  const offsetPI = 0;
  const offsetTax = -strokePI;
  const offsetIns = -(strokePI + strokeTax);
  const offsetPmi = -(strokePI + strokeTax + strokeIns);
  const offsetHoa = -(strokePI + strokeTax + strokeIns + strokePmi);

  // Filter amortization
  const displayedMonthly = useMemo(() => {
    if (yearFilter === 'all') {
      const startIdx = (schedulePage - 1) * 36;
      return result.amortizationMonthly.slice(startIdx, startIdx + 36);
    }
    return result.amortizationMonthly.filter((r) => r.year.toString() === yearFilter);
  }, [result.amortizationMonthly, yearFilter, schedulePage]);

  const uniqueYears = useMemo(() => {
    const years = new Set<number>();
    result.amortizationMonthly.forEach((r) => years.add(r.year));
    return Array.from(years);
  }, [result.amortizationMonthly]);

  return (
    <div className="space-y-6">
      {/* 1. TITLE & TOP ACTION BAR */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Mortgage Calculator
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Estimate monthly payments with taxes, insurance, PMI, and extra payoff acceleration.
            </p>
          </div>

          {/* Action buttons & Presets */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={handleDownloadPDF}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Report as PDF</span>
            </button>

            <button
              onClick={exportCSV}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg transition-colors shadow-2xs"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
              <span>Export CSV</span>
            </button>

            {/* Presets */}
            <div className="hidden sm:flex items-center gap-1 pl-2 border-l border-slate-200 text-xs text-slate-500">
              <span className="text-[11px] font-medium mr-1">Presets:</span>
              <button
                onClick={() => applyPreset('30y-400k')}
                className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors"
              >
                30-Yr Fixed (400k)
              </button>
              <button
                onClick={() => applyPreset('15y-320k')}
                className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors"
              >
                15-Yr Fixed (320k)
              </button>
              <button
                onClick={() => applyPreset('fha-350k')}
                className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors"
              >
                FHA (3.5% Down)
              </button>
            </div>

            <button
              onClick={() => setInputs(DEFAULT_INPUTS)}
              title="Reset to defaults"
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 2. MAIN 2-COLUMN SECTION (INPUTS VS RESULTS) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: PARAMETERS (7 COLS) */}
        <div className="lg:col-span-7 space-y-6">
          {/* LOAN PARAMETERS CARD */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-5">
            <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
              Loan Parameters
            </h2>

            {/* Home Price */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-semibold text-slate-700">Home Price</label>
                <span className="text-xs text-slate-400 font-mono">
                  {formatCurrency(inputs.homePrice, false)}
                </span>
              </div>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-semibold text-sm">
                  $
                </span>
                <input
                  type="number"
                  min="0"
                  step="5000"
                  value={inputs.homePrice || ''}
                  onChange={(e) => handleHomePriceChange(parseFloat(e.target.value) || 0)}
                  className="w-full pl-8 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-semibold text-base focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-mono tabular-nums"
                  placeholder="400000"
                />
              </div>
              <input
                type="range"
                min="50000"
                max="2000000"
                step="10000"
                value={inputs.homePrice}
                onChange={(e) => handleHomePriceChange(parseFloat(e.target.value))}
                className="w-full mt-2 accent-emerald-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
              />
            </div>

            {/* Down Payment (Percent & Dollar sync) */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-semibold text-slate-700">Down Payment</label>
                <span className="text-xs text-slate-500">
                  {inputs.downPaymentPercent < 20 ? (
                    <span className="text-amber-600 font-medium">
                      &lt;20% requires US PMI (~{formatPercent(inputs.pmiRate)}/yr)
                    </span>
                  ) : (
                    <span className="text-emerald-600 font-medium">No PMI required (20%+ equity)</span>
                  )}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* Percent box */}
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.5"
                    value={inputs.downPaymentPercent || ''}
                    onChange={(e) => handleDownPercentChange(parseFloat(e.target.value) || 0)}
                    className="w-full pl-3.5 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-semibold text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-mono tabular-nums"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-semibold">
                    %
                  </span>
                </div>

                {/* Dollar box */}
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-semibold text-sm">
                    $
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="1000"
                    value={inputs.downPaymentDollar || ''}
                    onChange={(e) => handleDownDollarChange(parseFloat(e.target.value) || 0)}
                    className="w-full pl-8 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-semibold text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-mono tabular-nums"
                  />
                </div>
              </div>

              {/* Quick % chips */}
              <div className="flex items-center gap-1.5 mt-2">
                <span className="text-[11px] text-slate-400 mr-1">Quick:</span>
                {[3.5, 5, 10, 15, 20, 25].map((pct) => (
                  <button
                    key={pct}
                    onClick={() => handleDownPercentChange(pct)}
                    className={`px-2 py-0.5 text-xs rounded transition-colors font-medium ${
                      inputs.downPaymentPercent === pct
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                    }`}
                  >
                    {pct}%
                  </button>
                ))}
              </div>
            </div>

            {/* Loan Term & Interest Rate */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Term */}
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                  Loan Term
                </label>
                <select
                  value={inputs.loanTermYears}
                  onChange={(e) =>
                    setInputs((prev) => ({
                      ...prev,
                      loanTermYears: parseInt(e.target.value, 10),
                    }))
                  }
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                >
                  <option value={30}>30 Years (360 mos)</option>
                  <option value={20}>20 Years (240 mos)</option>
                  <option value={15}>15 Years (180 mos)</option>
                  <option value={10}>10 Years (120 mos)</option>
                </select>
              </div>

              {/* Interest Rate */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-xs font-semibold text-slate-700">Interest Rate</label>
                  <div className="flex items-center gap-1.5 text-[10px] text-emerald-600 font-medium">
                    {US_MORTGAGE_BENCHMARKS.slice(0, 2).map((b) => (
                      <button
                        key={b.label}
                        onClick={() => setInputs((prev) => ({ ...prev, interestRate: b.rate }))}
                        className="hover:underline"
                      >
                        {b.label}: {b.rate}%
                      </button>
                    ))}
                  </div>
                </div>

                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    max="20"
                    step="0.01"
                    value={inputs.interestRate || ''}
                    onChange={(e) =>
                      setInputs((prev) => ({
                        ...prev,
                        interestRate: parseFloat(e.target.value) || 0,
                      }))
                    }
                    className="w-full pl-3.5 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-semibold text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-mono tabular-nums"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-semibold">
                    %
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* TAXES, INSURANCE & ESCROW */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-4">
            <div
              className="flex items-center justify-between cursor-pointer"
              onClick={() => setShowAdvancedEscrow(!showAdvancedEscrow)}
            >
              <div>
                <h2 className="text-base font-bold text-slate-900">Taxes, Insurance & Escrow</h2>
                <p className="text-xs text-slate-500">
                  Standard US lender escrow impounds required by Fannie Mae / Freddie Mac
                </p>
              </div>
              <button className="text-slate-400 hover:text-slate-600">
                {showAdvancedEscrow ? (
                  <ChevronUp className="w-5 h-5" />
                ) : (
                  <ChevronDown className="w-5 h-5" />
                )}
              </button>
            </div>

            {showAdvancedEscrow && (
              <div className="space-y-4 pt-2">
                {/* State selector for accurate US Property Tax & Insurance presets */}
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                  <div className="text-xs text-slate-700 font-semibold flex items-center gap-1.5">
                    <Info className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Auto-fill state tax & insurance averages:</span>
                  </div>
                  <select
                    value={selectedState}
                    onChange={(e) => handleStateSelect(e.target.value)}
                    className="text-xs px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg font-medium text-slate-800"
                  >
                    <option value="US_AVG">US National Average (1.05% tax)</option>
                    {Object.values(US_STATES_TAX_DATA).map((s) => (
                      <option key={s.code} value={s.code}>
                        {s.name} ({s.averagePropertyTaxRate}% prop. tax)
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Property Tax */}
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Annual Property Tax
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-semibold text-xs">
                        $
                      </span>
                      <input
                        type="number"
                        min="0"
                        step="100"
                        value={inputs.propertyTaxAnnual || ''}
                        onChange={(e) =>
                          setInputs((prev) => ({
                            ...prev,
                            propertyTaxAnnual: parseFloat(e.target.value) || 0,
                          }))
                        }
                        className="w-full pl-7 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-medium text-xs font-mono tabular-nums"
                      />
                    </div>
                    <span className="text-[11px] text-slate-400">
                      {formatCurrency(result.monthlyPropertyTax)} / mo
                    </span>
                  </div>

                  {/* Homeowners Insurance */}
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Annual Homeowners Insurance
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-semibold text-xs">
                        $
                      </span>
                      <input
                        type="number"
                        min="0"
                        step="50"
                        value={inputs.homeInsuranceAnnual || ''}
                        onChange={(e) =>
                          setInputs((prev) => ({
                            ...prev,
                            homeInsuranceAnnual: parseFloat(e.target.value) || 0,
                          }))
                        }
                        className="w-full pl-7 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-medium text-xs font-mono tabular-nums"
                      />
                    </div>
                    <span className="text-[11px] text-slate-400">
                      {formatCurrency(result.monthlyInsurance)} / mo
                    </span>
                  </div>

                  {/* HOA Fees */}
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Annual HOA / Condo Dues
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-semibold text-xs">
                        $
                      </span>
                      <input
                        type="number"
                        min="0"
                        step="50"
                        value={inputs.hoaAnnual || ''}
                        onChange={(e) =>
                          setInputs((prev) => ({
                            ...prev,
                            hoaAnnual: parseFloat(e.target.value) || 0,
                          }))
                        }
                        className="w-full pl-7 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-medium text-xs font-mono tabular-nums"
                      />
                    </div>
                    <span className="text-[11px] text-slate-400">
                      {formatCurrency(result.monthlyHoa)} / mo
                    </span>
                  </div>

                  {/* PMI Rate */}
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-xs font-semibold text-slate-700">
                        Annual PMI Rate
                      </label>
                      <label className="flex items-center gap-1 text-[11px] text-slate-500 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={inputs.includePmiAuto}
                          onChange={(e) =>
                            setInputs((prev) => ({
                              ...prev,
                              includePmiAuto: e.target.checked,
                            }))
                          }
                          className="accent-emerald-600 rounded"
                        />
                        <span>Auto PMI</span>
                      </label>
                    </div>
                    <div className="relative">
                      <input
                        type="number"
                        min="0"
                        max="3"
                        step="0.05"
                        value={inputs.pmiRate || ''}
                        onChange={(e) =>
                          setInputs((prev) => ({
                            ...prev,
                            pmiRate: parseFloat(e.target.value) || 0,
                          }))
                        }
                        className="w-full pl-3 pr-7 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-medium text-xs font-mono tabular-nums"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs">
                        %
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400">
                      {result.monthlyPmi > 0
                        ? `${formatCurrency(result.monthlyPmi)}/mo (Drops off after ${Math.ceil(
                            result.pmiMonthsDuration / 12
                          )} yrs)`
                        : 'No PMI applicable'}
                    </span>
                  </div>
                </div>

                {/* First Payment Start Date */}
                <div className="pt-1 flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <label className="text-xs font-semibold text-slate-700">
                    First Payment Date:
                  </label>
                  <input
                    type="month"
                    value={inputs.startDate}
                    onChange={(e) =>
                      setInputs((prev) => ({ ...prev, startDate: e.target.value }))
                    }
                    className="text-xs px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg font-medium text-slate-700"
                  />
                </div>
              </div>
            )}
          </div>

          {/* PAYOFF ACCELERATION & EXTRA PAYMENTS */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-4">
            <div
              className="flex items-center justify-between cursor-pointer"
              onClick={() => setShowExtraPayoff(!showExtraPayoff)}
            >
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-600" />
                <div>
                  <h2 className="text-base font-bold text-slate-900">
                    Payoff Acceleration & Extra Payments
                  </h2>
                  <p className="text-xs text-slate-500">
                    Knock years off your mortgage and save tens of thousands in interest
                  </p>
                </div>
              </div>
              <button className="text-slate-400 hover:text-slate-600">
                {showExtraPayoff ? (
                  <ChevronUp className="w-5 h-5" />
                ) : (
                  <ChevronDown className="w-5 h-5" />
                )}
              </button>
            </div>

            {showExtraPayoff && (
              <div className="space-y-4 pt-2">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Extra Monthly
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-semibold text-xs">
                        $
                      </span>
                      <input
                        type="number"
                        min="0"
                        step="50"
                        value={inputs.extraPaymentMonthly || ''}
                        onChange={(e) =>
                          setInputs((prev) => ({
                            ...prev,
                            extraPaymentMonthly: parseFloat(e.target.value) || 0,
                          }))
                        }
                        placeholder="0"
                        className="w-full pl-7 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-medium text-xs font-mono tabular-nums"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Extra Yearly
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-semibold text-xs">
                        $
                      </span>
                      <input
                        type="number"
                        min="0"
                        step="500"
                        value={inputs.extraPaymentAnnual || ''}
                        onChange={(e) =>
                          setInputs((prev) => ({
                            ...prev,
                            extraPaymentAnnual: parseFloat(e.target.value) || 0,
                          }))
                        }
                        placeholder="0"
                        className="w-full pl-7 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-medium text-xs font-mono tabular-nums"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      One-Time Lump Sum
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-semibold text-xs">
                        $
                      </span>
                      <input
                        type="number"
                        min="0"
                        step="1000"
                        value={inputs.extraPaymentOneTime || ''}
                        onChange={(e) =>
                          setInputs((prev) => ({
                            ...prev,
                            extraPaymentOneTime: parseFloat(e.target.value) || 0,
                          }))
                        }
                        placeholder="0"
                        className="w-full pl-7 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-medium text-xs font-mono tabular-nums"
                      />
                    </div>
                  </div>
                </div>

                {/* Savings Callout if extra payment active */}
                {result.interestSaved > 0 && (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 flex items-center justify-between text-xs text-emerald-900">
                    <div className="flex items-center gap-2">
                      <TrendingDown className="w-5 h-5 text-emerald-600 shrink-0" />
                      <div>
                        <span className="font-bold">Acceleration Benefit:</span> You will save{' '}
                        <span className="font-extrabold text-emerald-700">
                          {formatCurrency(result.interestSaved)}
                        </span>{' '}
                        in interest and pay off your mortgage{' '}
                        <span className="font-extrabold text-emerald-700">
                          {Math.floor(result.monthsSaved / 12)} years{' '}
                          {result.monthsSaved % 12 > 0 ? `${result.monthsSaved % 12} mos` : ''}
                        </span>{' '}
                        earlier!
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: RESULTS, KPI TILES & INTERACTIVE BREAKDOWN (5 COLS) */}
        <div className="lg:col-span-5 space-y-6">
          {/* TOTAL MONTHLY PAYMENT HERO CARD */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs uppercase font-bold tracking-wider text-slate-500">
                  Total Monthly Payment
                </p>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-mono tracking-tight tabular-nums">
                    {formatCurrency(result.totalMonthlyPayment)}
                  </span>
                  <span className="text-sm font-semibold text-slate-400">/ mo</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs font-semibold text-slate-500">Loan Amount:</p>
                <p className="text-base font-bold text-slate-900 font-mono tabular-nums">
                  {formatCurrency(result.loanAmount, false)}
                </p>
              </div>
            </div>

            {/* KPI STATS GRID (Matching FinRateCalc Screenshot) */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
              <div>
                <p className="text-xs text-slate-500 font-medium">Total Interest</p>
                <p className="text-lg font-bold text-rose-600 font-mono tabular-nums">
                  {formatCurrency(result.totalInterestActual, false)}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-500 font-medium">Total Loan Cost</p>
                <p className="text-lg font-bold text-slate-900 font-mono tabular-nums">
                  {formatCurrency(result.totalCostActual, false)}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-500 font-medium">Payoff Term</p>
                <p className="text-base font-bold text-slate-800">
                  {result.actualPayoffMonths < result.originalPayoffMonths ? (
                    <span className="text-emerald-600">
                      {(result.actualPayoffMonths / 12).toFixed(1)} Years
                    </span>
                  ) : (
                    <span>{inputs.loanTermYears} Years</span>
                  )}
                </p>
              </div>

              <div>
                <p className="text-xs text-slate-500 font-medium">Down Payment</p>
                <p className="text-base font-bold text-slate-800 font-mono tabular-nums">
                  {formatPercent(inputs.downPaymentPercent, 1)}
                </p>
              </div>
            </div>
          </div>

          {/* MONTHLY PAYMENT BREAKDOWN DONUT & LEGEND */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs space-y-5">
            <h3 className="text-xs uppercase font-bold tracking-wider text-slate-500">
              Monthly Payment Breakdown
            </h3>

            <div className="flex flex-col sm:flex-row items-center gap-6 justify-center">
              {/* SVG Donut Chart */}
              <div className="relative w-44 h-44 shrink-0 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
                  {/* Background Track */}
                  <circle
                    cx="80"
                    cy="80"
                    r={radius}
                    className="stroke-slate-100 fill-none"
                    strokeWidth="18"
                  />

                  {/* Principal & Interest (Blue/Indigo) */}
                  <circle
                    cx="80"
                    cy="80"
                    r={radius}
                    fill="none"
                    stroke="#4f46e5"
                    strokeWidth="18"
                    strokeDasharray={`${strokePI} ${circumference}`}
                    strokeDashoffset={offsetPI}
                    className="transition-all duration-500"
                  />

                  {/* Property Tax (Cyan/Sky) */}
                  <circle
                    cx="80"
                    cy="80"
                    r={radius}
                    fill="none"
                    stroke="#0284c7"
                    strokeWidth="18"
                    strokeDasharray={`${strokeTax} ${circumference}`}
                    strokeDashoffset={offsetTax}
                    className="transition-all duration-500"
                  />

                  {/* Insurance (Emerald) */}
                  <circle
                    cx="80"
                    cy="80"
                    r={radius}
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="18"
                    strokeDasharray={`${strokeIns} ${circumference}`}
                    strokeDashoffset={offsetIns}
                    className="transition-all duration-500"
                  />

                  {/* PMI (Amber) */}
                  {result.monthlyPmi > 0 && (
                    <circle
                      cx="80"
                      cy="80"
                      r={radius}
                      fill="none"
                      stroke="#f59e0b"
                      strokeWidth="18"
                      strokeDasharray={`${strokePmi} ${circumference}`}
                      strokeDashoffset={offsetPmi}
                      className="transition-all duration-500"
                    />
                  )}

                  {/* HOA (Purple) */}
                  {result.monthlyHoa > 0 && (
                    <circle
                      cx="80"
                      cy="80"
                      r={radius}
                      fill="none"
                      stroke="#9333ea"
                      strokeWidth="18"
                      strokeDasharray={`${strokeHoa} ${circumference}`}
                      strokeDashoffset={offsetHoa}
                      className="transition-all duration-500"
                    />
                  )}
                </svg>

                {/* Center text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-2">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                    Payment
                  </span>
                  <span className="text-base font-extrabold text-slate-900 font-mono">
                    {formatCurrency(result.totalMonthlyPayment, false)}
                  </span>
                </div>
              </div>

              {/* Legend with Values & Percentages */}
              <div className="w-full space-y-2.5 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-indigo-600" />
                    <span className="font-medium text-slate-700">Principal & Interest</span>
                  </div>
                  <div className="text-right font-mono">
                    <span className="font-bold text-slate-900">
                      {formatCurrency(result.monthlyPrincipalInterest)}
                    </span>
                    <span className="text-slate-400 ml-1.5">{formatPercent(piPct, 0)}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-sky-600" />
                    <span className="font-medium text-slate-700">Property Tax</span>
                  </div>
                  <div className="text-right font-mono">
                    <span className="font-bold text-slate-900">
                      {formatCurrency(result.monthlyPropertyTax)}
                    </span>
                    <span className="text-slate-400 ml-1.5">{formatPercent(taxPct, 0)}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-emerald-500" />
                    <span className="font-medium text-slate-700">Homeowners Ins.</span>
                  </div>
                  <div className="text-right font-mono">
                    <span className="font-bold text-slate-900">
                      {formatCurrency(result.monthlyInsurance)}
                    </span>
                    <span className="text-slate-400 ml-1.5">{formatPercent(insPct, 0)}</span>
                  </div>
                </div>

                {result.monthlyPmi > 0 && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-amber-500" />
                      <span className="font-medium text-slate-700">PMI Insurance</span>
                    </div>
                    <div className="text-right font-mono">
                      <span className="font-bold text-slate-900">
                        {formatCurrency(result.monthlyPmi)}
                      </span>
                      <span className="text-slate-400 ml-1.5">{formatPercent(pmiPct, 0)}</span>
                    </div>
                  </div>
                )}

                {result.monthlyHoa > 0 && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-purple-600" />
                      <span className="font-medium text-slate-700">HOA Dues</span>
                    </div>
                    <div className="text-right font-mono">
                      <span className="font-bold text-slate-900">
                        {formatCurrency(result.monthlyHoa)}
                      </span>
                      <span className="text-slate-400 ml-1.5">{formatPercent(hoaPct, 0)}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. AMORTIZATION SCHEDULE TABLE (YEARLY / MONTHLY VIEW) */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Amortization Schedule</h2>
            <p className="text-xs text-slate-500">
              Complete year-by-year principal reduction and interest payoff timeline
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* View Switcher */}
            <div className="flex items-center bg-slate-100 p-1 rounded-lg text-xs font-medium text-slate-600">
              <button
                onClick={() => setScheduleView('yearly')}
                className={`px-3 py-1 rounded-md transition-colors ${
                  scheduleView === 'yearly'
                    ? 'bg-white text-slate-900 shadow-xs font-semibold'
                    : 'hover:text-slate-900'
                }`}
              >
                Yearly Summary
              </button>
              <button
                onClick={() => setScheduleView('monthly')}
                className={`px-3 py-1 rounded-md transition-colors ${
                  scheduleView === 'monthly'
                    ? 'bg-white text-slate-900 shadow-xs font-semibold'
                    : 'hover:text-slate-900'
                }`}
              >
                Monthly Schedule
              </button>
            </div>

            <button
              onClick={exportCSV}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
              <span>CSV</span>
            </button>
          </div>
        </div>

        {/* Schedule View: Yearly */}
        {scheduleView === 'yearly' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Year</th>
                  <th className="py-2.5 px-3 text-right">Principal Paid</th>
                  <th className="py-2.5 px-3 text-right">Interest Paid</th>
                  {inputs.extraPaymentMonthly > 0 ||
                  inputs.extraPaymentAnnual > 0 ||
                  inputs.extraPaymentOneTime > 0 ? (
                    <th className="py-2.5 px-3 text-right">Extra Principal</th>
                  ) : null}
                  <th className="py-2.5 px-3 text-right">Total Paid</th>
                  <th className="py-2.5 px-3 text-right">Ending Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono tabular-nums">
                {result.amortizationAnnual.map((row) => (
                  <tr key={row.year} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-2.5 px-3 font-semibold text-slate-900">{row.year}</td>
                    <td className="py-2.5 px-3 text-right text-emerald-700 font-medium">
                      {formatCurrency(row.principal, false)}
                    </td>
                    <td className="py-2.5 px-3 text-right text-rose-600 font-medium">
                      {formatCurrency(row.interest, false)}
                    </td>
                    {inputs.extraPaymentMonthly > 0 ||
                    inputs.extraPaymentAnnual > 0 ||
                    inputs.extraPaymentOneTime > 0 ? (
                      <td className="py-2.5 px-3 text-right text-indigo-600 font-medium">
                        {row.extraPrincipal > 0 ? formatCurrency(row.extraPrincipal, false) : '-'}
                      </td>
                    ) : null}
                    <td className="py-2.5 px-3 text-right text-slate-700">
                      {formatCurrency(row.totalPaid, false)}
                    </td>
                    <td className="py-2.5 px-3 text-right font-bold text-slate-900">
                      {formatCurrency(row.endingBalance, false)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Schedule View: Monthly */}
        {scheduleView === 'monthly' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-slate-500">Filter Year:</span>
                <select
                  value={yearFilter}
                  onChange={(e) => setYearFilter(e.target.value)}
                  className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-md font-medium text-slate-800"
                >
                  <option value="all">All Months</option>
                  {uniqueYears.map((y) => (
                    <option key={y} value={y.toString()}>
                      Year {y}
                    </option>
                  ))}
                </select>
              </div>

              {yearFilter === 'all' && (
                <div className="flex items-center gap-2 text-slate-500">
                  <span>Page {schedulePage} of {Math.ceil(result.amortizationMonthly.length / 36)}</span>
                  <div className="flex gap-1">
                    <button
                      disabled={schedulePage <= 1}
                      onClick={() => setSchedulePage((p) => Math.max(1, p - 1))}
                      className="px-2 py-0.5 border border-slate-200 rounded hover:bg-slate-100 disabled:opacity-40"
                    >
                      Prev
                    </button>
                    <button
                      disabled={schedulePage >= Math.ceil(result.amortizationMonthly.length / 36)}
                      onClick={() =>
                        setSchedulePage((p) =>
                          Math.min(Math.ceil(result.amortizationMonthly.length / 36), p + 1)
                        )
                      }
                      className="px-2 py-0.5 border border-slate-200 rounded hover:bg-slate-100 disabled:opacity-40"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="overflow-x-auto max-h-96">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-200 sticky top-0">
                  <tr>
                    <th className="py-2.5 px-3">#</th>
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 px-3 text-right">Payment</th>
                    <th className="py-2.5 px-3 text-right">Principal</th>
                    <th className="py-2.5 px-3 text-right">Interest</th>
                    <th className="py-2.5 px-3 text-right">Balance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono tabular-nums">
                  {displayedMonthly.map((row) => (
                    <tr key={row.month} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-2 px-3 text-slate-400">{row.month}</td>
                      <td className="py-2 px-3 font-semibold text-slate-800">{row.dateStr}</td>
                      <td className="py-2 px-3 text-right text-slate-700">
                        {formatCurrency(row.payment)}
                      </td>
                      <td className="py-2 px-3 text-right text-emerald-700 font-medium">
                        {formatCurrency(row.principal + row.extraPrincipal)}
                      </td>
                      <td className="py-2 px-3 text-right text-rose-600 font-medium">
                        {formatCurrency(row.interest)}
                      </td>
                      <td className="py-2 px-3 text-right font-bold text-slate-900">
                        {formatCurrency(row.remainingBalance)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
