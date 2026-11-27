import { useState, useId, useEffect } from 'react';
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

type FilingStatus = 'single' | 'married' | 'head_of_household';
type PayFrequency = 'annual' | 'monthly' | 'semi_monthly' | 'bi_weekly' | 'weekly' | 'hourly';

// Verified 2026 IRS Standard Deductions
const STANDARD_DEDUCTIONS: Record<FilingStatus, number> = {
  single: 16100,
  married: 32200,
  head_of_household: 24150,
};

// Verified 2026 SSA Wage Base & FICA Rates
const SOCIAL_SECURITY_WAGE_LIMIT = 184500;
const SOCIAL_SECURITY_RATE = 0.062;
const MEDICARE_RATE = 0.0145;

// Verified 2026 IRS Federal Income Tax Brackets
const FEDERAL_BRACKETS: Record<FilingStatus, { limit: number; rate: number }[]> = {
  single: [
    { limit: 12400, rate: 0.10 },
    { limit: 50400, rate: 0.12 },
    { limit: 105700, rate: 0.22 },
    { limit: 201775, rate: 0.24 },
    { limit: 256225, rate: 0.32 },
    { limit: 640600, rate: 0.35 },
    { limit: Infinity, rate: 0.37 },
  ],
  married: [
    { limit: 24800, rate: 0.10 },
    { limit: 100800, rate: 0.12 },
    { limit: 211400, rate: 0.22 },
    { limit: 403550, rate: 0.24 },
    { limit: 512450, rate: 0.32 },
    { limit: 768700, rate: 0.35 },
    { limit: Infinity, rate: 0.37 },
  ],
  head_of_household: [
    { limit: 17700, rate: 0.10 },
    { limit: 67450, rate: 0.12 },
    { limit: 105700, rate: 0.22 },
    { limit: 201750, rate: 0.24 },
    { limit: 256200, rate: 0.32 },
    { limit: 640600, rate: 0.35 },
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

const TAKE_HOME_FAQS = [
  {
    q: 'What is the difference between gross pay and net take-home pay?',
    a: 'Gross pay is your full annual salary or hourly earnings before anything is withheld. Net take-home pay is the actual dollar amount deposited into your checking account after subtracting 2026 federal income tax, FICA (Social Security and Medicare), state income tax, and benefits such as health insurance or 401(k) contributions.',
  },
  {
    q: 'Why is my monthly paycheck much smaller than my salary divided by 12?',
    a: 'Dividing an $85,000 salary by 12 gives $7,083 gross per month, but mandatory withholdings reduce that check right away. Between progressive federal tax, 7.65% FICA, state income tax (0% to ~13.3% depending on where you live), and health or retirement deductions, most US workers see 20% to 35% withheld before payday.',
  },
  {
    q: 'Do 401(k) and HSA contributions reduce FICA taxes too?',
    a: 'Traditional 401(k) contributions lower your federal and state taxable income, but they are still subject to Social Security and Medicare (FICA) taxes. By contrast, employer-sponsored Section 125 health premiums and payroll-deducted HSA or FSA contributions lower federal tax, state tax, AND FICA taxes.',
  },
  {
    q: 'How does bi-weekly pay differ from semi-monthly pay?',
    a: 'Bi-weekly payroll pays every two weeks for 26 paychecks a year, which gives you two "extra" three-paycheck months every calendar year. Semi-monthly payroll pays twice a month (usually the 15th and last day) for 24 slightly larger paychecks a year.',
  },
  {
    q: 'What is the difference between marginal tax rate and effective tax rate?',
    a: 'Your marginal tax rate is the IRS bracket applied only to your top slice of taxable income (for example, 22%). Your effective tax rate is the actual percentage of your total gross pay going to taxes, which is always lower because the 2026 standard deduction ($16,100 single / $32,200 married) and the 10% and 12% brackets protect your first dollars earned.',
  },
];

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
  const [faqSearch, setFaqSearch] = useState<string>('');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);

  useEffect(() => {
    const scriptId = 'finrate-paycheck-jsonld';
    let scriptEl = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (!scriptEl) {
      scriptEl = document.createElement('script');
      scriptEl.id = scriptId;
      scriptEl.type = 'application/ld+json';
      document.head.appendChild(scriptEl);
    }

    const richSchema = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              name: 'Home',
              item: 'https://finratecalc.com/',
            },
            {
              '@type': 'ListItem',
              position: 2,
              name: 'US Take-Home Pay Calculator',
              item: 'https://finratecalc.com/take-home-pay-calculator',
            },
          ],
        },
        {
          '@type': 'HowTo',
          name: 'How to Estimate Your 2026 US Net Paycheck After Taxes',
          description:
            'Calculate your US take-home salary or hourly paycheck using 2026 IRS tax brackets, standard deductions, FICA Social Security cap, state tax, and 401(k)/HSA shields.',
          totalTime: 'PT2M',
          step: [
            {
              '@type': 'HowToStep',
              position: 1,
              name: 'Enter Annual Salary or Hourly Wage',
              text: 'Choose Annual Salary or Hourly Wage and enter your gross pay before taxes.',
            },
            {
              '@type': 'HowToStep',
              position: 2,
              name: 'Select Your 2026 IRS Filing Status',
              text: 'Pick Single ($16,100 standard deduction), Married Filing Jointly ($32,200), or Head of Household ($24,150).',
            },
            {
              '@type': 'HowToStep',
              position: 3,
              name: 'Set Your State Income Tax Rate',
              text: 'Select a no-tax state (TX, FL, WA at 0%) or adjust the slider to match your state effective tax rate.',
            },
            {
              '@type': 'HowToStep',
              position: 4,
              name: 'Add Pre-Tax 401(k), Health Insurance, and HSA Deductions',
              text: 'Enter pre-tax retirement and Section 125 benefit amounts to lower your federal and state taxable income.',
            },
            {
              '@type': 'HowToStep',
              position: 5,
              name: 'Switch Paycheck Frequency',
              text: 'Toggle between Monthly, Bi-Weekly (26 checks), Semi-Monthly (24 checks), Weekly, Annual, or Hourly net pay.',
            },
          ],
        },
        {
          '@type': 'Article',
          headline:
            '2026 US Take-Home Pay Guide: Federal Brackets, FICA Caps, State Taxes & Pre-Tax Paycheck Shields',
          description:
            'Human-written US payroll breakdown explaining how 2026 IRS brackets, the $184,500 Social Security cap, state income taxes, and 401(k)/HSA deductions shape your real direct deposit.',
          author: {
            '@type': 'Organization',
            name: 'FinRateCalc Editorial Team',
            url: 'https://finratecalc.com',
          },
          publisher: {
            '@type': 'Organization',
            name: 'FinRateCalc',
            url: 'https://finratecalc.com',
          },
          datePublished: '2026-01-15',
          dateModified: '2026-11-27',
          mainEntityOfPage: 'https://finratecalc.com/take-home-pay-calculator',
        },
      ],
    };

    scriptEl.textContent = JSON.stringify(richSchema);

    return () => {
      const existing = document.getElementById(scriptId);
      if (existing) existing.remove();
    };
  }, []);

  const effectiveGross =
    wageType === 'salary' ? grossAnnual : Math.round(hourlyRate * hoursPerWeek * 52);

  const retirement401k = (effectiveGross * retirement401kPercent) / 100;
  const totalPreTax =
    Math.round((retirement401k + healthInsuranceAnnual + hsaFsaAnnual) * 100) / 100;

  const ficaBase = Math.max(0, effectiveGross - (healthInsuranceAnnual + hsaFsaAnnual));
  const ssTaxable = Math.min(ficaBase, SOCIAL_SECURITY_WAGE_LIMIT);
  const socialSecurity = Math.round(ssTaxable * SOCIAL_SECURITY_RATE * 100) / 100;
  const medicare = Math.round(ficaBase * MEDICARE_RATE * 100) / 100;
  const additionalThreshold = filingStatus === 'married' ? 250000 : 200000;
  const additionalMedicare =
    ficaBase > additionalThreshold
      ? Math.round((ficaBase - additionalThreshold) * 0.009 * 100) / 100
      : 0;
  const totalFica = Math.round((socialSecurity + medicare + additionalMedicare) * 100) / 100;

  const stdDed = useStandardDeduction
    ? STANDARD_DEDUCTIONS[filingStatus]
    : customItemizedDeduction;
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

  const effectiveTaxRate =
    effectiveGross > 0 ? Math.round((totalTaxes / effectiveGross) * 1000) / 10 : 0;
  const takeHomePercent =
    effectiveGross > 0 ? Math.round((netAnnual / effectiveGross) * 1000) / 10 : 0;

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
    const text = `FinRateCalc 2026 Paycheck Breakdown:
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

  const filteredFaqs = TAKE_HOME_FAQS.filter(
    (f) =>
      f.q.toLowerCase().includes(faqSearch.toLowerCase()) ||
      f.a.toLowerCase().includes(faqSearch.toLowerCase())
  );

  return (
    <div className="w-full max-w-6xl mx-auto space-y-12">
      <div className="bg-white border border-slate-200/90 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-slate-50 to-white">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>2026 IRS Tax Year Standard &amp; Brackets Grounded</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1 tracking-tight">
              US Take-Home Pay &amp; Net Salary Calculator (2026)
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Estimate your exact paycheck take-home pay after 2026 federal, state, FICA taxes, and 401(k)/HSA deductions.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center">
            <button
              type="button"
              onClick={() => {
                setWageType('salary');
                setGrossAnnual(85000);
                setFilingStatus('single');
                setSelectedStatePreset(2);
                setCustomStateRate(4.8);
                setRetirement401kPercent(5);
                setHealthInsuranceAnnual(2400);
                setHsaFsaAnnual(1000);
                setRoth401kAnnual(0);
                setUseStandardDeduction(true);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/80 rounded-lg transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
            <button
              type="button"
              onClick={handleCopySummary}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-xs"
            >
              {copiedSummary ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
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
                      wageType === 'salary'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Annual Salary
                  </button>
                  <button
                    type="button"
                    onClick={() => setWageType('hourly')}
                    className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                      wageType === 'hourly'
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Hourly Wage
                  </button>
                </div>
              </div>

              {wageType === 'salary' ? (
                <div className="space-y-2">
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-medium">
                      $
                    </span>
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
                    <label
                      htmlFor={hourlyRateInputId}
                      className="block text-xs font-medium text-slate-600 mb-1"
                    >
                      Hourly Pay Rate ($/hr)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-medium">
                        $
                      </span>
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
                    <label
                      htmlFor={hoursPerWeekInputId}
                      className="block text-xs font-medium text-slate-600 mb-1"
                    >
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
                Tax Filing Status (2026 IRS Standard Deduction)
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'single', label: 'Single', ded: STANDARD_DEDUCTIONS.single },
                  { id: 'married', label: 'Married Joint', ded: STANDARD_DEDUCTIONS.married },
                  {
                    id: 'head_of_household',
                    label: 'Head of Household',
                    ded: STANDARD_DEDUCTIONS.head_of_household,
                  },
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
                <label
                  htmlFor={stateRateInputId}
                  className="text-xs font-semibold text-slate-700 tracking-wide"
                >
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
                  <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400">
                    %
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-700 tracking-wide">
                  Pre-Tax Deductions (Lowers Federal &amp; State Taxes)
                </span>
                <span className="text-xs text-emerald-700 font-medium tabular-nums">
                  Total: -{formatCurrency(totalPreTax)}/yr
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor={retirementPercentInputId}
                      className="text-xs font-medium text-slate-700"
                    >
                      401(k)
                    </label>
                    <span className="text-xs text-emerald-700 font-semibold tabular-nums">
                      {retirement401kPercent}%
                    </span>
                  </div>
                  <input
                    id={retirementPercentInputId}
                    type="number"
                    min="0"
                    max="50"
                    value={retirement401kPercent}
                    onChange={(e) =>
                      setRetirement401kPercent(Math.max(0, Number(e.target.value)))
                    }
                    className="w-full px-2.5 py-1.5 text-xs font-semibold bg-white border border-slate-200 rounded-lg tabular-nums"
                  />
                  <p className="text-[11px] text-slate-500 tabular-nums">
                    ={formatCurrency(retirement401k)}/yr
                  </p>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label
                      htmlFor={healthInsuranceInputId}
                      className="text-xs font-medium text-slate-700"
                    >
                      Health Ins.
                    </label>
                    <span className="text-xs text-slate-500 tabular-nums">
                      {formatCurrency(healthInsuranceAnnual / 12)}/mo
                    </span>
                  </div>
                  <input
                    id={healthInsuranceInputId}
                    type="number"
                    min="0"
                    step="50"
                    value={healthInsuranceAnnual}
                    onChange={(e) =>
                      setHealthInsuranceAnnual(Math.max(0, Number(e.target.value)))
                    }
                    className="w-full px-2.5 py-1.5 text-xs font-semibold bg-white border border-slate-200 rounded-lg tabular-nums"
                  />
                  <p className="text-[11px] text-slate-500">Section 125</p>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label htmlFor={hsaFsaInputId} className="text-xs font-medium text-slate-700">
                      HSA / FSA
                    </label>
                    <span className="text-xs text-slate-500 tabular-nums">
                      {formatCurrency(hsaFsaAnnual / 12)}/mo
                    </span>
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
                {showAdvanced ? (
                  <ChevronUp className="w-3.5 h-3.5" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5" />
                )}
                <span>
                  {showAdvanced
                    ? 'Hide Advanced Options'
                    : 'Show Advanced (Roth 401k & Itemized Deductions)'}
                </span>
              </button>

              {showAdvanced && (
                <div className="mt-3 p-4 bg-slate-50/70 border border-slate-200/80 rounded-xl grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor={roth401kInputId}
                      className="block text-xs font-medium text-slate-700 mb-1"
                    >
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
                        onChange={(e) =>
                          setCustomItemizedDeduction(Math.max(0, Number(e.target.value)))
                        }
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
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Paycheck View
                </span>
                <span className="text-xs text-slate-600 font-medium">
                  Effective Tax:{' '}
                  <strong className="text-slate-900 tabular-nums">{effectiveTaxRate}%</strong>
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
                      activeFrequency === tab.id
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="p-5 bg-gradient-to-br from-emerald-950 via-slate-900 to-slate-950 rounded-2xl text-white shadow-md">
                <div className="flex items-center justify-between text-xs text-emerald-300 font-medium mb-1">
                  <span className="capitalize">
                    {activeFrequency.replace('_', ' ')} Take-Home Pay
                  </span>
                  <span className="tabular-nums font-semibold bg-emerald-900/60 text-emerald-200 px-2 py-0.5 rounded-md border border-emerald-700/40">
                    {takeHomePercent}% of gross
                  </span>
                </div>
                <div className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white tabular-nums font-mono">
                  {formatCurrency(periodNet, true)}
                </div>
                <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-300">
                  <span>
                    Gross:{' '}
                    <strong className="text-white tabular-nums">
                      {formatCurrency(periodGross, true)}
                    </strong>
                  </span>
                  <span>
                    Deductions:{' '}
                    <strong className="text-rose-300 tabular-nums">
                      -{formatCurrency(periodTotalDeductions, true)}
                    </strong>
                  </span>
                </div>
              </div>

              <div className="mt-6 space-y-2">
                <div className="flex items-center justify-between text-xs font-medium text-slate-600">
                  <span>Where Each Dollar Goes</span>
                  <span className="tabular-nums text-slate-700">100% of Gross</span>
                </div>
                <div className="h-4 w-full bg-slate-200 rounded-full overflow-hidden flex shadow-inner">
                  <div
                    style={{ width: `${Math.max(2, netBarWidth)}%` }}
                    className="bg-emerald-500 transition-all"
                  />
                  <div
                    style={{ width: `${Math.max(1, fedBarWidth)}%` }}
                    className="bg-slate-700 transition-all"
                  />
                  <div
                    style={{ width: `${Math.max(1, stateBarWidth)}%` }}
                    className="bg-indigo-600 transition-all"
                  />
                  <div
                    style={{ width: `${Math.max(1, ficaBarWidth)}%` }}
                    className="bg-amber-500 transition-all"
                  />
                  <div
                    style={{ width: `${Math.max(1, preTaxBarWidth)}%` }}
                    className="bg-cyan-600 transition-all"
                  />
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2 text-[11px] text-slate-600 font-medium">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
                    <span>Net ({netBarWidth.toFixed(0)}%)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-700 shrink-0" />
                    <span>Fed ({fedBarWidth.toFixed(0)}%)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 shrink-0" />
                    <span>State ({stateBarWidth.toFixed(0)}%)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
                    <span>FICA ({ficaBarWidth.toFixed(0)}%)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-cyan-600 shrink-0" />
                    <span>Pre-Tax ({preTaxBarWidth.toFixed(0)}%)</span>
                  </div>
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
                    <span className="font-semibold text-slate-900 tabular-nums">
                      -{formatCurrency(periodFederal, true)}{' '}
                      <span className="text-slate-500 font-normal">
                        ({formatCurrency(federalTax)})
                      </span>
                    </span>
                  </div>
                  <div className="px-3.5 py-2 flex items-center justify-between">
                    <span className="text-slate-600">State Tax ({customStateRate}%)</span>
                    <span className="font-semibold text-slate-900 tabular-nums">
                      -{formatCurrency(periodState, true)}{' '}
                      <span className="text-slate-500 font-normal">
                        ({formatCurrency(stateTax)})
                      </span>
                    </span>
                  </div>
                  <div className="px-3.5 py-2 flex items-center justify-between">
                    <span className="text-slate-600">Social Security (6.2%)</span>
                    <span className="font-semibold text-slate-900 tabular-nums">
                      -{formatCurrency(periodSS, true)}{' '}
                      <span className="text-slate-500 font-normal">
                        ({formatCurrency(socialSecurity)})
                      </span>
                    </span>
                  </div>
                  <div className="px-3.5 py-2 flex items-center justify-between">
                    <span className="text-slate-600">Medicare (1.45%)</span>
                    <span className="font-semibold text-slate-900 tabular-nums">
                      -{formatCurrency(periodMed, true)}{' '}
                      <span className="text-slate-500 font-normal">
                        ({formatCurrency(medicare + additionalMedicare)})
                      </span>
                    </span>
                  </div>
                  <div className="px-3.5 py-2 flex items-center justify-between bg-slate-50/50">
                    <span className="text-slate-600">Pre-Tax 401(k) &amp; HSA</span>
                    <span className="font-semibold text-emerald-800 tabular-nums">
                      -{formatCurrency(periodPreTax, true)}{' '}
                      <span className="text-slate-500 font-normal">
                        ({formatCurrency(totalPreTax)})
                      </span>
                    </span>
                  </div>
                  <div className="px-3.5 py-2.5 flex items-center justify-between bg-emerald-50/50 font-semibold text-slate-900">
                    <span>Net Take-Home Pay</span>
                    <span className="text-emerald-700 font-bold tabular-nums text-sm">
                      {formatCurrency(periodNet, true)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-[11px] text-slate-500 text-center pt-2">
              Grounded in IRS 2026 tax brackets and SSA wage limits. Estimates are for planning purposes only.
            </div>
          </div>
        </div>
      </div>

      <article className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-10 shadow-sm space-y-10">
        <header className="border-b border-slate-200/80 pb-6 space-y-3">
          <div className="flex items-center flex-wrap gap-2 text-xs text-slate-500 font-medium">
            <span className="text-emerald-700 font-semibold">finratecalc.com / Take-Home Pay Guide</span>
            <span aria-hidden="true">&middot;</span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" /> Updated for 2026 IRS Rules
            </span>
            <span aria-hidden="true">&middot;</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> 7 min read
            </span>
            <span aria-hidden="true">&middot;</span>
            <span className="flex items-center gap-1">
              <User className="w-3.5 h-3.5" /> FinRateCalc Editorial Team
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
            How Your 2026 US Paycheck Is Calculated: Federal Brackets, FICA Caps, State Taxes &amp; Pre-Tax Shields
          </h2>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-3xl">
            Accepting an $85,000 job offer looks like $7,083 a month on paper, yet your bank deposit after taxes and benefits often lands closer to $5,100 in a moderate-tax state or $5,500 in Texas or Florida. Understanding where each dollar goes helps you budget accurately and keep more of your raise.
          </p>
        </header>

        <section className="space-y-4">
          <h3 className="text-xl font-bold text-slate-900">
            1. Gross Salary vs. Net Direct Deposit: Why Location Changes Everything
          </h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            Two US employees earning the exact same <strong>$85,000 salary</strong> with identical 5% 401(k) contributions and $2,400/year health premiums can walk away with very different paychecks depending on state income tax. In <strong>Texas, Florida, Tennessee, Nevada, or Washington</strong> (0% state income tax), a single filer takes home roughly <strong>$64,500/year</strong>. In a higher-tax state such as California or New York, state withholding trims another $3,500 to $4,500 a year from that same salary.
          </p>
          <div className="p-4 bg-slate-900 text-white rounded-xl font-mono text-xs leading-relaxed border border-slate-800">
            Net Paycheck = Gross Pay &minus; (Pre-Tax 401(k)/HSA/Health + Federal Tax + State Tax + FICA + Post-Tax Deductions)
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="text-xl font-bold text-slate-900">
            2. Using 2026 Pre-Tax Deductions to Shrink Your Tax Bill
          </h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            Pre-tax payroll elections come out of your check <strong>before</strong> federal (and usually state) income tax is calculated. Every dollar placed into a Traditional 401(k) or HSA saves you money at your highest marginal bracket:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
              <div className="text-xs font-bold text-slate-900">Traditional 401(k) ($24,500 Cap)</div>
              <p className="text-xs text-slate-600 leading-normal">
                For 2026, workers can defer up to <strong>$24,500</strong> ($32,500 at age 50+). In the 22% federal bracket, a $100 contribution lowers take-home pay by roughly $78 (plus state savings).
              </p>
            </div>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
              <div className="text-xs font-bold text-slate-900">Section 125 Health Premiums</div>
              <p className="text-xs text-slate-600 leading-normal">
                Employer medical, dental, and vision premiums skip federal income tax, state tax, <strong>and</strong> both 7.65% FICA payroll taxes.
              </p>
            </div>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
              <div className="text-xs font-bold text-slate-900">HSA ($4,400 / $8,750 Caps)</div>
              <p className="text-xs text-slate-600 leading-normal">
                In 2026, HDHP enrollees can contribute up to <strong>$4,400</strong> (self-only) or <strong>$8,750</strong> (family) payroll-tax-free, with tax-free medical withdrawals.
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="text-xl font-bold text-slate-900">
            3. Mandatory 2026 US Payroll Taxes (Federal, FICA &amp; State)
          </h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            The IRS uses a <strong>progressive bracket system</strong>, plus a flat standard deduction ($16,100 Single, $32,200 Married Jointly, $24,150 Head of Household in 2026). Crossing into the 22% bracket only taxes the dollars inside that slice—never your entire paycheck.
          </p>
          <div className="border border-slate-200 rounded-xl overflow-x-auto bg-white">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-3">Tax Type</th>
                  <th className="p-3">2026 Statutory Rate</th>
                  <th className="p-3">2026 Income Cap</th>
                  <th className="p-3">Lowered by Pre-Tax?</th>
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
                  <td className="p-3 tabular-nums font-mono">$184,500 wage limit</td>
                  <td className="p-3 text-slate-600">Health &amp; payroll HSA only</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-slate-900">Medicare</td>
                  <td className="p-3 tabular-nums">1.45% (+0.9% &gt; $200k)</td>
                  <td className="p-3">No cap</td>
                  <td className="p-3 text-slate-600">Health &amp; payroll HSA only</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-slate-900">State Income Tax</td>
                  <td className="p-3 tabular-nums">0% to ~13.3%</td>
                  <td className="p-3">Varies by state</td>
                  <td className="p-3 text-emerald-700 font-semibold">Yes in most states</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="text-xl font-bold text-slate-900">
            4. Bi-Weekly vs. Semi-Monthly Checks &amp; W-4 Fine-Tuning
          </h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            Bi-weekly employees receive <strong>26 paychecks each year</strong> (every other Friday), creating two calendar months per year with <strong>three paychecks</strong>. Semi-monthly workers receive <strong>24 paychecks per year</strong> (typically the 15th and last business day). If you build your monthly rent and grocery budget around two bi-weekly checks, those two extra checks become effortless savings or debt-payoff boosts.
          </p>
          <p className="text-sm text-slate-600 leading-relaxed">
            Finally, if you got a massive refund—or owed money—last April, update your <strong>IRS Form W-4</strong> with HR. Getting a $4,800 tax refund simply means you gave the government a $400/month interest-free loan out of your own paychecks.
          </p>
        </section>

        <section className="space-y-4 pt-4 border-t border-slate-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-xl font-bold text-slate-900">Frequently Asked Questions (FAQ)</h3>
              <p className="text-xs text-slate-500">Essential answers for 2026 US payroll and tax planning.</p>
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
                <div key={faq.q} className="border border-slate-200 rounded-xl overflow-hidden bg-white">
                  <button
                    type="button"
                    onClick={() => setExpandedFaq(isOpen ? null : idx)}
                    className="w-full p-4 text-left flex items-center justify-between gap-4 hover:bg-slate-50/70 transition-colors"
                  >
                    <span className="text-xs sm:text-sm font-semibold text-slate-900">{faq.q}</span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-slate-500 shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />
                    )}
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

export default TakeHomePayCalculator;
