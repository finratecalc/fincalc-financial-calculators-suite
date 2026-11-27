import React, { useState, useMemo, useEffect } from 'react';
import {
  Car,
  Download,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Calendar,
  Clock,
  User,
} from 'lucide-react';
import { AutoLoanInputs, AutoLoanResult } from '../types';
import { calculateAutoLoan, formatCurrency } from '../utils/calculators';
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

const AUTO_LOAN_FAQS = [
  {
    q: 'What is included in an out-the-door (OTD) car price?',
    a: 'Your out-the-door price is the true total cost of buying the vehicle: the agreed selling price plus state and local sales tax, dealer documentation fees, title and DMV registration fees, and any optional add-ons, minus rebates or trade-in equity. Negotiating on the OTD price stops dealers from hiding extra fees inside a lower monthly payment.',
  },
  {
    q: 'Does a trade-in reduce sales tax on a new car in the US?',
    a: 'In most US states (including Texas, Florida, Illinois, and New York), sales tax is charged only on the difference between the new car price and your trade-in allowance. For example, trading in a $12,000 car toward a $38,000 vehicle leaves $26,000 taxable. However, a few states such as California charge sales tax on the full agreed vehicle price before deducting trade-in value.',
  },
  {
    q: 'What is the 20/4/10 rule for buying a car?',
    a: 'The 20/4/10 guideline helps US buyers avoid being "upside down" on a car loan: put at least 20% down, keep the financing term to 4 years (48 months) or less, and keep total monthly transportation costs (loan payment, auto insurance, and fuel) under 10% of your gross monthly income.',
  },
  {
    q: 'Is a 72-month or 84-month auto loan a bad idea?',
    a: 'Longer terms lower your monthly bill, but they sharply increase total interest paid and stretch out negative equity. On a $35,000 loan at 7% APR, moving from 60 months to 84 months lowers the payment by roughly $165/month, yet adds more than $2,750 in extra interest and keeps you owing more than the car is worth for years.',
  },
  {
    q: 'Should I get pre-approved by a credit union before visiting the dealership?',
    a: 'Yes. Getting an auto loan pre-approval from a local credit union or online bank gives you a real baseline APR ("buy rate"). Dealership finance offices can legally mark up your interest rate by 1% to 2%, so bringing your own pre-approval forces the dealer to either beat your credit union rate or accept your check.',
  },
];

export const AutoLoanCalculator: React.FC<AutoLoanCalculatorProps> = ({ onOpenReport }) => {
  const [inputs, setInputs] = useState<AutoLoanInputs>(DEFAULT_INPUTS);
  const [selectedState, setSelectedState] = useState<string>('US_AVG');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);

  const result: AutoLoanResult = useMemo(() => {
    return calculateAutoLoan(inputs);
  }, [inputs]);

  useEffect(() => {
    const scriptId = 'finrate-auto-jsonld';
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
              name: 'US Auto Loan Calculator',
              item: 'https://finratecalc.com/auto-loan-calculator',
            },
          ],
        },
        {
          '@type': 'FinancialProduct',
          name: 'US Auto Loan & Out-the-Door Financing Estimator',
          description:
            'Calculate US monthly car payments with state sales tax, dealer doc and DMV registration fees, trade-in equity, and APR amortization.',
          url: 'https://finratecalc.com/auto-loan-calculator',
          category: 'Auto Loan',
          currency: 'USD',
          feesAndCommissionsSpecification:
            'Models dealer documentation fees, state sales tax, and DMV title/registration costs.',
          provider: {
            '@type': 'Organization',
            name: 'FinRateCalc',
            url: 'https://finratecalc.com',
          },
        },
        {
          '@type': 'HowTo',
          name: 'How to Calculate Your True Monthly Car Payment & Out-the-Door Price',
          description:
            'Step-by-step US auto loan calculation factoring in cash down payment, trade-in equity, state sales tax, dealer doc fees, and APR.',
          totalTime: 'PT2M',
          step: [
            {
              '@type': 'HowToStep',
              position: 1,
              name: 'Enter the Agreed Vehicle Price',
              text: 'Input the negotiated selling price (not just sticker MSRP) before dealer add-ons or rebates.',
            },
            {
              '@type': 'HowToStep',
              position: 2,
              name: 'Subtract Cash Down and Net Trade-In Equity',
              text: 'Add your cash down payment plus your trade-in offer minus any remaining loan balance owed on your current vehicle.',
            },
            {
              '@type': 'HowToStep',
              position: 3,
              name: 'Select Your US State Sales Tax & Dealer Fees',
              text: 'Choose your state average sales tax rate and enter estimated dealer documentation and DMV registration fees.',
            },
            {
              '@type': 'HowToStep',
              position: 4,
              name: 'Pick Your Loan Term and APR',
              text: 'Compare 36, 48, 60, 72, or 84-month terms using your credit union pre-approval or national new/used APR benchmarks.',
            },
            {
              '@type': 'HowToStep',
              position: 5,
              name: 'Review Out-the-Door Price and Total Interest',
              text: 'Check both the monthly payment and lifetime interest cost before signing any dealership finance contract.',
            },
          ],
        },
        {
          '@type': 'Article',
          headline:
            'US Auto Loan Guide: How Out-the-Door Pricing, State Sales Tax, and Loan Terms Impact Your True Cost',
          description:
            'A practical guide for US car buyers on calculating out-the-door pricing, trade-in sales tax credits, dealer doc fees, and choosing between 48, 60, and 72-month auto loans.',
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
          mainEntityOfPage: 'https://finratecalc.com/auto-loan-calculator',
        },
      ],
    };

    scriptEl.textContent = JSON.stringify(richSchema);

    return () => {
      const existing = document.getElementById(scriptId);
      if (existing) existing.remove();
    };
  }, []);

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
    <div className="space-y-8">
      {/* Title */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>50-State Sales Tax &amp; Out-the-Door Estimator</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Car className="w-6 h-6 text-emerald-600 shrink-0 hidden sm:inline" />
            <span>US Auto Loan &amp; Financing Calculator</span>
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Calculate your monthly car payment, true out-the-door price with US state sales tax, dealer doc fees, and trade-in equity.
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            onOpenReport?.('Auto Financing Breakdown', {
              type: 'auto-loan',
              inputs,
              result,
            })
          }
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs transition-colors shrink-0 self-start md:self-center"
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
                    type="button"
                    onClick={() => setInputs((prev) => ({ ...prev, interestRate: 6.84 }))}
                    className="hover:underline"
                  >
                    New Car Avg: 6.84%
                  </button>
                  <button
                    type="button"
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

      {/* US Auto Loan Buyer Guide & FAQ Article */}
      <article className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-10 shadow-xs space-y-9">
        <header className="border-b border-slate-200/80 pb-6 space-y-3">
          <div className="flex items-center flex-wrap gap-2 text-xs text-slate-500 font-medium">
            <span className="text-emerald-700 font-semibold">finratecalc.com / Auto Loan Guide</span>
            <span aria-hidden="true">&middot;</span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" /> Updated for 2026 US Auto Rates
            </span>
            <span aria-hidden="true">&middot;</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> 6 min read
            </span>
            <span aria-hidden="true">&middot;</span>
            <span className="flex items-center gap-1">
              <User className="w-3.5 h-3.5" /> FinRateCalc Editorial Team
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
            How US Auto Loans Really Work: Out-the-Door Pricing, State Sales Tax, and Avoiding Dealer Markups
          </h2>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-3xl">
            Most online car payment estimators leave out the two costs that blow up dealership budgets: state sales tax and documentation fees. Here is how to calculate your real monthly payment before stepping onto the lot.
          </p>
        </header>

        <section className="space-y-3">
          <h3 className="text-xl font-bold text-slate-900">
            1. Sticker Price vs. Out-the-Door (OTD) Price
          </h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            When you negotiate a <strong>$38,000 vehicle</strong> at a US dealership, $38,000 is rarely what you end up financing. Once you add 7.5% state and county sales tax ($2,400+ depending on trade-in rules), a dealer documentation fee ($150 to $995 depending on your state), and DMV title and registration charges, your true <strong>out-the-door price</strong> climbs closer to <strong>$41,350</strong>.
          </p>
          <p className="text-sm text-slate-600 leading-relaxed">
            If a salesperson asks, &ldquo;What monthly payment are you aiming for?&rdquo; instead of discussing the OTD price, be careful. A finance manager can easily hit a $550/month target by quietly stretching your loan from 60 months to 84 months—costing you thousands of extra dollars in interest.
          </p>
        </section>

        <section className="space-y-3">
          <h3 className="text-xl font-bold text-slate-900">
            2. How State Sales Tax &amp; Trade-In Credits Work
          </h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            Every state treats vehicle taxes differently. In states like <strong>Texas, Florida, New York, Illinois, and Ohio</strong>, your trade-in allowance directly lowers the taxable price of your next car. Trading in a $10,000 vehicle on a $38,000 purchase means you only pay sales tax on the <strong>$28,000 difference</strong>.
          </p>
          <p className="text-sm text-slate-600 leading-relaxed">
            By contrast, states like <strong>California</strong> tax the full agreed price of the car regardless of your trade-in value, while states such as <strong>Oregon, Montana, New Hampshire, and Delaware</strong> charge 0% state sales tax on vehicles. Use the state selector above to test how your local tax rate changes the final financed balance.
          </p>
        </section>

        <section className="space-y-4">
          <h3 className="text-xl font-bold text-slate-900">
            3. Loan Term Comparison: 48 vs. 60 vs. 72 vs. 84 Months
          </h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            Longer auto loans look attractive on paper because they shrink your monthly payment, yet cars depreciate fastest in their first four years. Look at how term length changes total interest on a <strong>$32,000 financed balance at 6.84% APR</strong>:
          </p>
          <div className="border border-slate-200 rounded-xl overflow-x-auto bg-white">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                <tr>
                  <th className="p-3">Loan Term</th>
                  <th className="p-3">Monthly Payment</th>
                  <th className="p-3">Total Interest Paid</th>
                  <th className="p-3">Equity Risk</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-600">
                <tr>
                  <td className="p-3 font-semibold text-slate-900">48 Months (4 Yrs)</td>
                  <td className="p-3 font-mono">$764 / mo</td>
                  <td className="p-3 font-mono text-emerald-700 font-semibold">$4,672</td>
                  <td className="p-3">Builds equity quickly</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-slate-900">60 Months (5 Yrs)</td>
                  <td className="p-3 font-mono">$631 / mo</td>
                  <td className="p-3 font-mono">$5,875</td>
                  <td className="p-3">Balanced US standard</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-slate-900">72 Months (6 Yrs)</td>
                  <td className="p-3 font-mono">$543 / mo</td>
                  <td className="p-3 font-mono text-amber-700">$7,108</td>
                  <td className="p-3">Moderate negative-equity risk</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-slate-900">84 Months (7 Yrs)</td>
                  <td className="p-3 font-mono">$481 / mo</td>
                  <td className="p-3 font-mono text-rose-600 font-semibold">$8,367</td>
                  <td className="p-3">High risk of owing more than car value</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="space-y-3">
          <h3 className="text-xl font-bold text-slate-900">
            4. Three Smart Habits Before You Sign in the Finance Office
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
              <div className="text-xs font-bold text-slate-900">Follow the 20/4/10 Rule</div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Aim for 20% upfront (cash plus trade-in equity), a 4- to 5-year loan max, and total car costs (payment, insurance, gas) under 10% of gross income.
              </p>
            </div>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
              <div className="text-xs font-bold text-slate-900">Bring a Credit Union Quote</div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Get pre-approved at a local credit union within a 14-day rate-shopping window (counts as one credit inquiry) so the dealer has to beat your APR.
              </p>
            </div>
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
              <div className="text-xs font-bold text-slate-900">Watch Negative Trade Equity</div>
              <p className="text-xs text-slate-600 leading-relaxed">
                If your Trade-In Loan Owed exceeds the car&apos;s trade-in offer, rolling that unpaid balance into a new loan compounds interest on two cars at once.
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-4 pt-4 border-t border-slate-200">
          <div>
            <h3 className="text-xl font-bold text-slate-900">Frequently Asked Questions</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Common US auto financing, sales tax, and dealer fee questions answered.
            </p>
          </div>

          <div className="space-y-2">
            {AUTO_LOAN_FAQS.map((faq, idx) => {
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
};
