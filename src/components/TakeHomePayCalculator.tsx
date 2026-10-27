/**
 * FinRateCalc - Take-Home Pay Calculator & SEO Article Component
 * Path: src/components/TakeHomePayCalculator.tsx
 * Compatible with Default Export & Named Export
 */

import { useState, useId } from 'react';
import {
  ShieldCheck,
  RotateCcw,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  Calendar,
  Clock,
  User,
  Search,
} from 'lucide-react';

// ==========================================
// 1. TAX LOGIC & 2026 BRACKETS
// ==========================================
type FilingStatus = 'single' | 'married' | 'head_of_household';
type PayFrequency = 'annual' | 'monthly' | 'semi_monthly' | 'bi_weekly' | 'weekly' | 'hourly';

const STANDARD_DEDUCTIONS: Record<FilingStatus, number> = {
  single: 15000,
  married: 30000,
  head_of_household: 22500,
};

const SOCIAL_SECURITY_WAGE_LIMIT = 168600;
const SOCIAL_SECURITY_RATE = 0.062;
const MEDICARE_RATE = 0.0145;

const FEDERAL_BRACKETS: Record<FilingStatus, { limit: number; rate: number }[]> = {
  single: [
    { limit: 11925, rate: 0.10 },
    { limit: 48475, rate: 0.12 },
    { limit: 103350, rate: 0.22 },
    { limit: 197300, rate: 0.24 },
    { limit: 250525, rate: 0.32 },
    { limit: 626350, rate: 0.35 },
    { limit: Infinity, rate: 0.37 },
  ],
  married: [
    { limit: 23850, rate: 0.10 },
    { limit: 96950, rate: 0.12 },
    { limit: 206700, rate: 0.22 },
    { limit: 394600, rate: 0.24 },
    { limit: 501050, rate: 0.32 },
    { limit: 751600, rate: 0.35 },
    { limit: Infinity, rate: 0.37 },
  ],
  head_of_household: [
    { limit: 17000, rate: 0.10 },
    { limit: 64850, rate: 0.12 },
    { limit: 103350, rate: 0.22 },
    { limit: 197300, rate: 0.24 },
    { limit: 250500, rate: 0.32 },
    { limit: 626350, rate: 0.35 },
    { limit: Infinity, rate: 0.37 },
  ],
};

const FREQ_DIVISORS: Record<PayFrequency, number> = {
  annual: 1,
  monthly: 12,
  semi_monthly: 24,
  bi_weekly: 26,
  weekly: 52,
  hourly: 2080,
};

function formatCurrency(amount: number, showDecimals: boolean = false): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: showDecimals ? 2 : 0,
    maximumFractionDigits: showDecimals ? 2 : 0,
  }).format(amount);
}

const STATE_PRESETS = [
  { name: 'TX / FL / WA (0% No State Tax)', rate: 0 },
  { name: 'PA / IN (~3.1% Flat Tax)', rate: 3.1 },
  { name: 'IL / NC / CO (~4.8% Average)', rate: 4.8 },
  { name: 'CA / NY / NJ (~7.5% High Bracket)', rate: 7.5 },
];

const SALARY_PRESETS = [45000, 65000, 85000, 120000, 160000, 220000];

// ==========================================
// 2. MAIN COMPONENT
// ==========================================
export function TakeHomePayCalculator(_props?: any) {
  const annualSalaryInputId = useId();
  const hourlyRateInputId = useId();
  const hoursPerWeekInputId = useId();
  const stateRateInputId = useId();
  const retirementPercentInputId = useId();
  const healthInsuranceInputId = useId();
  const hsaFsaInputId = useId();
  const roth401kInputId = useId();
  const customDeductionInputId = useId();

  const [wageType, setWageType] = useState<'salary' | 'hourly'>('salary');
  const [hourlyRate, setHourlyRate] = useState<number>(38);
  const [hoursPerWeek, setHoursPerWeek] = useState<number>(40);

  const [grossAnnual, setGrossAnnual] = useState<number>(85000);
  const [filingStatus, setFilingStatus] = useState<FilingStatus>('single');
  const [selectedStatePreset, setSelectedStatePreset] = useState<number>(2);
  const [customStateRate, setCustomStateRate] = useState<number>(4.8);

  const [retirement401kPercent, setRetirement401kPercent] = useState<number>(5);
  const [healthInsuranceAnnual, setHealthInsuranceAnnual] = useState<number>(2400);
  const [hsaFsaAnnual, setHsaFsaAnnual] = useState<number>(1000);
  const [roth401kAnnual, setRoth401kAnnual] = useState<number>(0);
  const [useStandardDeduction, setUseStandardDeduction] = useState<boolean>(true);
  const [customItemizedDeduction, setCustomItemizedDeduction] = useState<number>(18000);

  const [activeFrequency, setActiveFrequency] = useState<PayFrequency>('monthly');
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);
  const [copiedSummary, setCopiedSummary] = useState<boolean>(false);
  const [copiedMd, setCopiedMd] = useState<boolean>(false);
  const [faqSearch, setFaqSearch] = useState<string>('');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);

  const effectiveGross = wageType === 'salary' ? grossAnnual : Math.round(hourlyRate * hoursPerWeek * 52);

  const retirement401k = (effectiveGross * retirement401kPercent) / 100;
  const totalPreTax = Math.round((retirement401k + healthInsuranceAnnual + hsaFsaAnnual) * 100) / 100;

  const ficaBase = Math.max(0, effectiveGross - (healthInsuranceAnnual + hsaFsaAnnual));
  const ssTaxable = Math.min(ficaBase, SOCIAL_SECURITY_WAGE_LIMIT);
  const socialSecurity = Math.round(ssTaxable * SOCIAL_SECURITY_RATE * 100) / 100;
  const medicare = Math.round(ficaBase * MEDICARE_RATE * 100) / 100;
  const additionalThreshold = filingStatus === 'married' ? 250000 : 200000;
  const additionalMedicare = ficaBase > additionalThreshold ? Math.round((ficaBase - additionalThreshold) * 0.009 * 100) / 100 : 0;
  const totalFica = Math.round((socialSecurity + medicare + additionalMedicare) * 100) / 100;

  const stdDed = useStandardDeduction ? STANDARD_DEDUCTIONS[filingStatus] : customItemizedDeduction;
  const federalTaxable = Math.max(0, effectiveGross - totalPreTax - stdDed);

  let federalTax = 0;
  let prevLimit = 0;
  const brackets = FEDERAL_BRACKETS[filingStatus];
  for (const b of brackets) {
    if (federalTaxable > prevLimit) {
      const slice = Math.min(federalTaxable, b.limit) - prevLimit;
      federalTax += slice * b.rate;
    }
    if (federalTaxable <= b.limit) break;
    prevLimit = b.limit;
  }
  federalTax = Math.round(federalTax * 100) / 100;

  const stateTaxable = Math.max(0, effectiveGross - totalPreTax - stdDed * 0.7);
  const stateTax = Math.round(stateTaxable * (customStateRate / 100) * 100) / 100;

  const totalTaxes = Math.round((federalTax + stateTax + totalFica) * 100) / 100;
  const totalAllDeductions = Math.round((totalTaxes + totalPreTax + roth401kAnnual) * 100) / 100;
  const netAnnual = Math.max(0, Math.round((effectiveGross - totalAllDeductions) * 100) / 100);

  const effectiveTaxRate = effectiveGross > 0 ? Math.round((totalTaxes / effectiveGross) * 1000) / 10 : 0;
  const takeHomePercent = effectiveGross > 0 ? Math.round((netAnnual / effectiveGross) * 1000) / 10 : 0;

  const divisor = FREQ_DIVISORS[activeFrequency];
  const periodGross = effectiveGross / divisor;
  const periodNet = netAnnual / divisor;
  const periodFederal = federalTax / divisor;
  const periodState = stateTax / divisor;
  const periodSS = socialSecurity / divisor;
  const periodMed = (medicare + additionalMedicare) / divisor;
  const periodPreTax = totalPreTax / divisor;
  const periodTotalDeductions = totalAllDeductions / divisor;

  const netBarWidth = takeHomePercent;
  const fedBarWidth = effectiveGross > 0 ? (federalTax / effectiveGross) * 100 : 0;
  const stateBarWidth = effectiveGross > 0 ? (stateTax / effectiveGross) * 100 : 0;
  const ficaBarWidth = effectiveGross > 0 ? (totalFica / effectiveGross) * 100 : 0;
  const preTaxBarWidth = effectiveGross > 0 ? (totalPreTax / effectiveGross) * 100 : 0;

  const handleCopySummary = () => {
    const text = `FinRateCalc Paycheck Breakdown:
Gross Salary: ${formatCurrency(effectiveGross)}/yr
Net Take-Home Pay (${activeFrequency}): ${formatCurrency(periodNet, true)}
Annual Take-Home: ${formatCurrency(netAnnual)}
Effective Tax Rate: ${effectiveTaxRate}%
Federal Tax: ${formatCurrency(federalTax)}
State Tax: ${formatCurrency(stateTax)}
FICA (Social Security & Medicare): ${formatCurrency(totalFica)}
Pre-Tax 401(k) & Benefits: ${formatCurrency(totalPreTax)}
Calculated on: finratecalc.com`;

    navigator.clipboard.writeText(text);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2000);
  };

  const handleCopyMarkdown = () => {
    const md = `# Take-Home Pay Calculator & Net Salary Guide
## How to Calculate Your Real Paycheck After Taxes and Deductions (2026 Edition)

When an employer offers you an annual salary of $75,000, your gross monthly pay is $6,250. However, after taxes and deductions, your actual net direct deposit is closer to $4,650.

### The Master Payroll Formula
Net Take-Home Pay = Gross Income - (Pre-Tax Deductions + Federal Tax + State Tax + FICA Taxes + Post-Tax Deductions)

### 1. Pre-Tax Deductions (Tax Shield)
- Traditional 401(k) / 403(b): Reduces federal and state income taxes.
- Section 125 Healthcare: Reduces federal tax, state tax, AND FICA taxes.
- HSA / FSA: Triple-tax advantaged contributions.

### 2. Mandatory Taxes
- Federal Progressive Brackets: 10%, 12%, 22%, 24%, 32%, 35%, 37%.
- Social Security (OASDI): 6.2% up to $168,600 wage limit.
- Medicare: 1.45% uncapped (+0.9% additional on income >$200k).
- State Income Taxes: 0% (TX, FL, WA) to ~13.3% (CA).

### Paycheck Frequencies
- Monthly: 12 checks/yr
- Bi-Weekly: 26 checks/yr (includes 2 three-paycheck months)
- Semi-Monthly: 24 checks/yr (15th and end of month)
- Weekly: 52 checks/yr
`;
    navigator.clipboard.writeText(md);
    setCopiedMd(true);
    setTimeout(() => setCopiedMd(false), 2000);
  };

  const FAQS = [
    {
      q: 'What is the difference between gross pay and net take-home pay?',
      a: 'Gross pay is your agreed baseline earnings before any taxes or deductions. Net take-home pay is the final sum deposited into your bank account after subtracting federal and state income taxes, FICA (Social Security and Medicare), and company benefits.',
    },
    {
      q: 'Why is my take-home pay significantly less than my gross salary divided by 12?',
      a: 'Your gross salary does not account for compulsory withholdings: Federal income tax (10% to 37%), FICA taxes (7.65%), state taxes (0% to 13%), and company deductions (health insurance and 401k). Combined, these typically reduce your paycheck by 20% to 38%.',
    },
    {
      q: 'Do 401(k) contributions reduce all my taxes?',
      a: 'Traditional 401(k) contributions reduce your federal and state taxable income, which lowers your income tax. However, 401(k) contributions are still subject to FICA taxes (Social Security and Medicare). In contrast, Section 125 health insurance and HSA contributions reduce federal tax, state tax, AND FICA taxes.',
    },
    {
      q: 'How does bi-weekly pay differ from semi-monthly pay?',
      a: 'Bi-weekly employees receive 26 paychecks per year (every two weeks), meaning two months per year contain three paychecks. Semi-monthly employees receive 24 paychecks per year (typically on the 15th and last day of each month).',
    },
    {
      q: 'What is the difference between marginal tax rate and effective tax rate?',
      a: 'Your marginal tax rate is the highest bracket applied to your top dollar of income. Your effective tax rate is your actual blended rate: total taxes paid divided by total gross salary. Your effective rate is always lower due to the standard deduction and progressive tax brackets.',
    },
  ];

  const filteredFaqs = FAQS.filter(
    (f) => f.q.toLowerCase().includes(faqSearch.toLowerCase()) || f.a.toLowerCase().includes(faqSearch.toLowerCase())
  );

  return (
    <div className="w-full max-w-6xl mx-auto space-y-12">
      {/* 1. CALCULATOR CARD */}
      <div className="bg-white border border-slate-200/90 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-slate-50 to-white">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>2026 IRS Tax Year Standard & Brackets Grounded</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
              Interactive Take-Home Pay Calculator
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Estimate your exact paycheck take-home pay after federal, state, FICA taxes, and 401(k) deductions.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center">
            <button
              onClick={() => {
                setWageType('salary');
                setGrossAnnual(85000);
                setFilingStatus('single');
                setSelectedStatePreset(2);
                setCustomStateRate(4.8);
                setRetirement401kPercent(5);
                setHealthInsuranceAnnual(2400);
                setHsaFsaAnnual(1000);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/80 rounded-lg transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
            <button
              onClick={handleCopySummary}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-xs"
            >
              {copiedSummary ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedSummary ? 'Copied!' : 'Copy Summary'}</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-100">
          <div className="lg:col-span-7 p-6 sm:p-8 space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-slate-700 tracking-wide">
                  Income Calculation Type
                </label>
                <div className="inline-flex p-1 bg-slate-100 rounded-lg">
                  <button
                    type="button"
                    onClick={() => setWageType('salary')}
                    className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                      wageType === 'salary' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Annual Salary
                  </button>
                  <button
                    type="button"
                    onClick={() => setWageType('hourly')}
                    className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                      wageType === 'hourly' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Hourly Wage
                  </button>
                </div>
              </div>

              {wageType === 'salary' ? (
                <div className="space-y-2">
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-medium">$</span>
                    <input
                      id={annualSalaryInputId}
                      type="number"
                      min="0"
                      step="1000"
                      value={grossAnnual || ''}
                      onChange={(e) => setGrossAnnual(Math.max(0, Number(e.target.value)))}
                      className="w-full pl-8 pr-4 py-2.5 text-base font-semibold text-slate-900 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 tabular-nums"
                      placeholder="85000"
                    />
                  </div>
                  <div className="flex items-center gap-1.5 flex-wrap pt-1">
                    <span className="text-xs text-slate-600 font-medium">Quick Presets:</span>
                    {SALARY_PRESETS.map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setGrossAnnual(preset)}
                        className={`text-xs px-2.5 py-1 rounded-md border transition-colors tabular-nums ${
                          grossAnnual === preset
                            ? 'bg-emerald-50 border-emerald-300 text-emerald-800 font-semibold'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {formatCurrency(preset)}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor={hourlyRateInputId} className="block text-xs font-medium text-slate-600 mb-1">
                      Hourly Pay Rate ($/hr)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-medium">$</span>
                      <input
                        id={hourlyRateInputId}
                        type="number"
                        min="0"
                        step="0.5"
                        value={hourlyRate || ''}
                        onChange={(e) => setHourlyRate(Math.max(0, Number(e.target.value)))}
                        className="w-full pl-8 pr-4 py-2.5 text-sm font-semibold text-slate-900 bg-slate-50 border border-slate-200 rounded-xl tabular-nums"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor={hoursPerWeekInputId} className="block text-xs font-medium text-slate-600 mb-1">
                      Hours Worked Per Week
                    </label>
                    <input
                      id={hoursPerWeekInputId}
                      type="number"
                      min="1"
                      max="80"
                      value={hoursPerWeek || ''}
                      onChange={(e) => setHoursPerWeek(Math.max(1, Number(e.target.value)))}
                      className="w-full px-3.5 py-2.5 text-sm font-semibold text-slate-900 bg-slate-50 border border-slate-200 rounded-xl tabular-nums"
                    />
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 tracking-wide mb-2">
                Tax Filing Status
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'single', label: 'Single', ded: STANDARD_DEDUCTIONS.single },
                  { id: 'married', label: 'Married Joint', ded: STANDARD_DEDUCTIONS.married },
                  { id: 'head_of_household', label: 'Head of Household', ded: STANDARD_DEDUCTIONS.head_of_household },
                ].map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setFilingStatus(s.id as FilingStatus)}
                    className={`p-3 text-left rounded-xl border transition-all ${
                      filingStatus === s.id
                        ? 'bg-emerald-50/70 border-emerald-400 text-emerald-950 ring-1 ring-emerald-400/30'
                        : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="text-xs font-bold leading-tight">{s.label}</div>
                    <div className="text-[11px] text-slate-500 mt-1 tabular-nums">
                      Std. Ded: {formatCurrency(s.ded)}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor={stateRateInputId} className="text-xs font-semibold text-slate-700 tracking-wide">
                  State Income Tax Rate
                </label>
                <span className="text-xs text-slate-500 tabular-nums">
                  Current: <strong className="text-slate-800">{customStateRate}%</strong>
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2">
                {STATE_PRESETS.map((preset, idx) => (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => {
                      setSelectedStatePreset(idx);
                      setCustomStateRate(preset.rate);
                    }}
                    className={`p-2.5 text-xs text-left rounded-lg border transition-colors ${
                      selectedStatePreset === idx
                        ? 'bg-emerald-50/60 border-emerald-400 text-emerald-950 font-semibold'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {preset.name}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-3">
                <input
                  id={stateRateInputId}
                  type="range"
                  min="0"
                  max="13.3"
                  step="0.1"
                  value={customStateRate}
                  onChange={(e) => {
                    setCustomStateRate(Number(e.target.value));
                    setSelectedStatePreset(-1);
                  }}
                  className="w-full accent-emerald-600 h-2 bg-slate-200 rounded-lg cursor-pointer"
                />
                <div className="relative w-24 shrink-0">
                  <input
                    type="number"
                    min="0"
                    max="15"
                    step="0.1"
                    value={customStateRate}
                    onChange={(e) => {
                      setCustomStateRate(Math.max(0, Number(e.target.value)));
                      setSelectedStatePreset(-1);
                    }}
                    className="w-full pr-6 pl-2.5 py-1.5 text-xs font-semibold text-slate-900 bg-slate-50 border border-slate-200 rounded-lg tabular-nums"
                  />
                  <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400">%</span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-700 tracking-wide">
                  Pre-Tax Deductions (Lowers Federal & State Taxes)
                </span>
                <span className="text-xs text-emerald-700 font-medium tabular-nums">
                  Total: -{formatCurrency(totalPreTax)}/yr
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label htmlFor={retirementPercentInputId} className="text-xs font-medium text-slate-700">
                      401(k)
                    </label>
                    <span className="text-xs text-emerald-700 font-semibold tabular-nums">{retirement401kPercent}%</span>
                  </div>
                  <input
                    id={retirementPercentInputId}
                    type="number"
                    min="0"
                    max="50"
                    value={retirement401kPercent}
                    onChange={(e) => setRetirement401kPercent(Math.max(0, Number(e.target.value)))}
                    className="w-full px-2.5 py-1.5 text-xs font-semibold bg-white border border-slate-200 rounded-lg tabular-nums"
                  />
                  <p className="text-[11px] text-slate-500 tabular-nums">={formatCurrency(retirement401k)}/yr</p>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label htmlFor={healthInsuranceInputId} className="text-xs font-medium text-slate-700">
                      Health Ins.
                    </label>
                    <span className="text-xs text-slate-500 tabular-nums">{formatCurrency(healthInsuranceAnnual / 12)}/mo</span>
                  </div>
                  <input
                    id={healthInsuranceInputId}
                    type="number"
                    min="0"
                    step="50"
                    value={healthInsuranceAnnual}
                    onChange={(e) => setHealthInsuranceAnnual(Math.max(0, Number(e.target.value)))}
                    className="w-full px-2.5 py-1.5 text-xs font-semibold bg-white border border-slate-200 rounded-lg tabular-nums"
                  />
                  <p className="text-[11px] text-slate-500">Section 125</p>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label htmlFor={hsaFsaInputId} className="text-xs font-medium text-slate-700">
                      HSA / FSA
                    </label>
                    <span className="text-xs text-slate-500 tabular-nums">{formatCurrency(hsaFsaAnnual / 12)}/mo</span>
                  </div>
                  <input
                    id={hsaFsaInputId}
                    type="number"
                    min="0"
                    step="50"
                    value={hsaFsaAnnual}
                    onChange={(e) => setHsaFsaAnnual(Math.max(0, Number(e.target.value)))}
                    className="w-full px-2.5 py-1.5 text-xs font-semibold bg-white border border-slate-200 rounded-lg tabular-nums"
                  />
                  <p className="text-[11px] text-slate-500">Triple advantaged</p>
                </div>
              </div>
            </div>

            <div>
              <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 py-1 transition-colors"
              >
                {showAdvanced ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                <span>{showAdvanced ? 'Hide Advanced Options' : 'Show Advanced (Roth 401k & Itemized Deductions)'}</span>
              </button>

              {showAdvanced && (
                <div className="mt-3 p-4 bg-slate-50/70 border border-slate-200/80 rounded-xl grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor={roth401kInputId} className="block text-xs font-medium text-slate-700 mb-1">
                      Roth 401(k) / Post-Tax ($/yr)
                    </label>
                    <input
                      id={roth401kInputId}
                      type="number"
                      min="0"
                      value={roth401kAnnual}
                      onChange={(e) => setRoth401kAnnual(Math.max(0, Number(e.target.value)))}
                      className="w-full px-3 py-1.5 text-xs font-semibold bg-white border border-slate-200 rounded-lg tabular-nums"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-medium text-slate-700">Deduction Type</label>
                      <button
                        type="button"
                        onClick={() => setUseStandardDeduction(!useStandardDeduction)}
                        className="text-[11px] text-emerald-700 hover:underline font-semibold"
                      >
                        {useStandardDeduction ? 'Use Itemized' : 'Use Standard'}
                      </button>
                    </div>
                    {useStandardDeduction ? (
                      <div className="text-xs text-slate-600 p-2 bg-white rounded-lg border border-slate-200 tabular-nums">
                        Standard: {formatCurrency(STANDARD_DEDUCTIONS[filingStatus])}
                      </div>
                    ) : (
                      <input
                        id={customDeductionInputId}
                        type="number"
                        min="0"
                        value={customItemizedDeduction}
                        onChange={(e) => setCustomItemizedDeduction(Math.max(0, Number(e.target.value)))}
                        className="w-full px-3 py-1.5 text-xs font-semibold bg-white border border-slate-200 rounded-lg tabular-nums"
                      />
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-5 p-6 sm:p-8 bg-slate-50/40 flex flex-col justify-between space-y-6">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Paycheck View</span>
                <span className="text-xs text-slate-600 font-medium">
                  Effective Tax: <strong className="text-slate-900 tabular-nums">{effectiveTaxRate}%</strong>
                </span>
              </div>

              <div className="grid grid-cols-3 gap-1 p-1 bg-slate-200/70 rounded-xl mb-6">
                {[
                  { id: 'monthly', label: 'Monthly' },
                  { id: 'bi_weekly', label: 'Bi-Weekly' },
                  { id: 'semi_monthly', label: 'Semi-Mo' },
                  { id: 'weekly', label: 'Weekly' },
                  { id: 'annual', label: 'Annual' },
                  { id: 'hourly', label: 'Hourly' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveFrequency(tab.id as PayFrequency)}
                    className={`py-1.5 text-xs font-semibold rounded-lg transition-all ${
                      activeFrequency === tab.id ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="p-5 bg-gradient-to-br from-emerald-950 via-slate-900 to-slate-950 rounded-2xl text-white shadow-md">
                <div className="flex items-center justify-between text-xs text-emerald-300 font-medium mb-1">
                  <span className="capitalize">{activeFrequency.replace('_', ' ')} Take-Home Pay</span>
                  <span className="tabular-nums font-semibold bg-emerald-900/60 text-emerald-200 px-2 py-0.5 rounded-md border border-emerald-700/40">
                    {takeHomePercent}% of gross
                  </span>
                </div>
                <div className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white tabular-nums font-mono">
                  {formatCurrency(periodNet, true)}
                </div>
                <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-300">
                  <span>Gross: <strong className="text-white tabular-nums">{formatCurrency(periodGross, true)}</strong></span>
                  <span>Deductions: <strong className="text-rose-300 tabular-nums">-{formatCurrency(periodTotalDeductions, true)}</strong></span>
                </div>
              </div>

              <div className="mt-6 space-y-2">
                <div className="flex items-center justify-between text-xs font-medium text-slate-600">
                  <span>Where Each Dollar Goes</span>
                  <span className="tabular-nums text-slate-700">100% of Gross</span>
                </div>
                <div className="h-4 w-full bg-slate-200 rounded-full overflow-hidden flex shadow-inner">
                  <div style={{ width: `${Math.max(2, netBarWidth)}%` }} className="bg-emerald-500 transition-all" />
                  <div style={{ width: `${Math.max(1, fedBarWidth)}%` }} className="bg-slate-700 transition-all" />
                  <div style={{ width: `${Math.max(1, stateBarWidth)}%` }} className="bg-indigo-600 transition-all" />
                  <div style={{ width: `${Math.max(1, ficaBarWidth)}%` }} className="bg-amber-500 transition-all" />
                  <div style={{ width: `${Math.max(1, preTaxBarWidth)}%` }} className="bg-cyan-600 transition-all" />
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2 text-[11px] text-slate-600 font-medium">
                  <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" /><span>Net ({netBarWidth.toFixed(0)}%)</span></div>
                  <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-slate-700 shrink-0" /><span>Fed ({fedBarWidth.toFixed(0)}%)</span></div>
                  <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-indigo-600 shrink-0" /><span>State ({stateBarWidth.toFixed(0)}%)</span></div>
                  <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" /><span>FICA ({ficaBarWidth.toFixed(0)}%)</span></div>
                  <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-cyan-600 shrink-0" /><span>Pre-Tax ({preTaxBarWidth.toFixed(0)}%)</span></div>
                </div>
              </div>

              <div className="mt-6 border border-slate-200/80 rounded-xl overflow-hidden bg-white">
                <div className="px-3.5 py-2.5 bg-slate-100/70 border-b border-slate-200/80 flex items-center justify-between text-xs font-semibold text-slate-700">
                  <span>Deduction Item</span>
                  <span>{activeFrequency.replace('_', ' ')} / Annual</span>
                </div>
                <div className="divide-y divide-slate-100 text-xs">
                  <div className="px-3.5 py-2 flex items-center justify-between">
                    <span className="text-slate-600">Federal Income Tax</span>
                    <span className="font-semibold text-slate-900 tabular-nums">-{formatCurrency(periodFederal, true)} <span className="text-slate-500 font-normal">({formatCurrency(federalTax)})</span></span>
                  </div>
                  <div className="px-3.5 py-2 flex items-center justify-between">
                    <span className="text-slate-600">State Tax ({customStateRate}%)</span>
                    <span className="font-semibold text-slate-900 tabular-nums">-{formatCurrency(periodState, true)} <span className="text-slate-500 font-normal">({formatCurrency(stateTax)})</span></span>
                  </div>
                  <div className="px-3.5 py-2 flex items-center justify-between">
                    <span className="text-slate-600">Social Security (6.2%)</span>
                    <span className="font-semibold text-slate-900 tabular-nums">-{formatCurrency(periodSS, true)} <span className="text-slate-500 font-normal">({formatCurrency(socialSecurity)})</span></span>
                  </div>
                  <div className="px-3.5 py-2 flex items-center justify-between">
                    <span className="text-slate-600">Medicare (1.45%)</span>
                    <span className="font-semibold text-slate-900 tabular-nums">-{formatCurrency(periodMed, true)} <span className="text-slate-500 font-normal">({formatCurrency(medicare + additionalMedicare)})</span></span>
                  </div>
                  <div className="px-3.5 py-2 flex items-center justify-between bg-slate-50/50">
                    <span className="text-slate-600">Pre-Tax 401(k) & HSA</span>
                    <span className="font-semibold text-emerald-800 tabular-nums">-{formatCurrency(periodPreTax, true)} <span className="text-slate-500 font-normal">({formatCurrency(totalPreTax)})</span></span>
                  </div>
                  <div className="px-3.5 py-2.5 flex items-center justify-between bg-emerald-50/50 font-semibold text-slate-900">
                    <span>Net Take-Home Pay</span>
                    <span className="text-emerald-700 font-bold tabular-nums text-sm">{formatCurrency(periodNet, true)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-[11px] text-slate-500 text-center pt-2">
              IRS 2026 tax standards. Calculations do not constitute certified tax advice.
            </div>
          </div>
        </div>
      </div>

      {/* 2. SEO HUMAN-WRITTEN ARTICLE */}
      <article className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-10 shadow-sm space-y-10">
        <header className="border-b border-slate-200/80 pb-6 space-y-3">
          <div className="flex items-center flex-wrap gap-2 text-xs text-slate-500 font-medium">
            <span className="text-emerald-700 font-semibold">finratecalc.com / Take Home Pay</span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> Updated January 2026</span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> 8 min read</span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" /> FinRateCalc Editorial Team</span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Take-Home Pay Calculator & Net Salary Guide: How to Calculate Your Real Paycheck After Taxes and Deductions
          </h1>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-3xl">
            A comprehensive, mathematical walkthrough of gross vs. net pay, progressive federal tax brackets, state withholdings, FICA Social Security and Medicare taxes, and Section 125 pre-tax shields.
          </p>

          <div className="pt-2 flex items-center gap-2">
            <button
              onClick={handleCopyMarkdown}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors"
            >
              {copiedMd ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedMd ? 'Markdown Copied!' : 'Copy Article Markdown'}</span>
            </button>
          </div>
        </header>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900">1. The Master Paycheck Equation</h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            When you sign an employment agreement for a <strong>$75,000 annual salary</strong>, dividing it by 12 gives an expected <strong>$6,250 per month</strong>. However, upon checking your pay stub, the actual direct deposit is typically closer to <strong>$4,400 to $4,650</strong>. 
          </p>
          <div className="p-4 bg-slate-900 text-white rounded-xl font-mono text-xs leading-relaxed border border-slate-800">
            Net Take-Home Pay = Gross Pay - (Pre-Tax Deductions + Federal Tax + State Tax + FICA Taxes + Post-Tax Deductions)
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900">2. Pre-Tax Deductions: Your Best Defense Against High Taxes</h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Pre-tax deductions are subtracted directly from gross earnings <strong>before</strong> income taxes are computed. This lowers your taxable income base, meaning every dollar contributed saves you money at your highest marginal tax bracket:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
              <div className="text-xs font-bold text-slate-900">Traditional 401(k) / 403(b)</div>
              <p className="text-xs text-slate-600 leading-normal">
                Reduces federal and state income tax base. For a 22% bracket earner, a $100 contribution only reduces take-home pay by roughly $78.
              </p>
            </div>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
              <div className="text-xs font-bold text-slate-900">Section 125 Healthcare</div>
              <p className="text-xs text-slate-600 leading-normal">
                Health, dental, and vision premiums paid through cafeteria plans are exempt from federal tax, state tax, and both FICA taxes.
              </p>
            </div>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
              <div className="text-xs font-bold text-slate-900">HSA / FSA Accounts</div>
              <p className="text-xs text-slate-600 leading-normal">
                Health Savings Accounts provide triple-tax benefits: tax-deductible deposits, tax-free investment growth, and tax-free withdrawals for healthcare.
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900">3. Mandatory Government Taxes (Federal, FICA & State)</h2>
          <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-3">Tax Type</th>
                  <th className="p-3">2026 Statutory Rate</th>
                  <th className="p-3">Income Cap</th>
                  <th className="p-3">Reduced by Pre-Tax?</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-600">
                <tr>
                  <td className="p-3 font-semibold text-slate-900">Federal Income Tax</td>
                  <td className="p-3 tabular-nums">10% to 37% (Progressive)</td>
                  <td className="p-3">No cap</td>
                  <td className="p-3 text-emerald-700 font-semibold">Yes (401k, HSA, Health)</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-slate-900">Social Security (OASDI)</td>
                  <td className="p-3 tabular-nums">6.2%</td>
                  <td className="p-3 tabular-nums font-mono">$168,600 wage limit</td>
                  <td className="p-3 text-slate-600">Only Health / HSA</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-slate-900">Medicare</td>
                  <td className="p-3 tabular-nums">1.45% (+0.9% &gt; $200k)</td>
                  <td className="p-3">No cap</td>
                  <td className="p-3 text-slate-600">Only Health / HSA</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-slate-900">State Income Tax</td>
                  <td className="p-3 tabular-nums">0% to ~13.3%</td>
                  <td className="p-3">By state</td>
                  <td className="p-3 text-emerald-700 font-semibold">Yes in most states</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900">4. Paycheck Frequencies: Bi-Weekly vs. Semi-Monthly</h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Bi-weekly workers receive <strong>26 paychecks each year</strong> (every other week), meaning two months per year have <strong>three paychecks</strong>. Semi-monthly workers receive <strong>24 paychecks per year</strong> (typically the 15th and last day of each month). If you budget based on 2 paychecks each month, bi-weekly schedules give you two bonus paychecks every year to accelerate savings.
          </p>
        </section>

        <section className="space-y-4 pt-4 border-t border-slate-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Frequently Asked Questions (FAQ)</h2>
              <p className="text-xs text-slate-500">Essential answers for payroll and tax planning.</p>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search questions..."
                value={faqSearch}
                onChange={(e) => setFaqSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:bg-white"
              />
            </div>
          </div>

          <div className="space-y-2 pt-2">
            {filteredFaqs.map((faq, idx) => {
              const isOpen = expandedFaq === idx;
              return (
                <div key={idx} className="border border-slate-200 rounded-xl overflow-hidden bg-white">
                  <button
                    type="button"
                    onClick={() => setExpandedFaq(isOpen ? null : idx)}
                    className="w-full p-4 text-left flex items-center justify-between gap-4 hover:bg-slate-50/70 transition-colors"
                  >
                    <span className="text-xs sm:text-sm font-semibold text-slate-900">{faq.q}</span>
                    {isOpen ? <ChevronUp className="w-4 h-4 text-slate-500 shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />}
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/30">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </article>
    </div>
  );
}

// Support both Named and Default Import
export default TakeHomePayCalculator;
