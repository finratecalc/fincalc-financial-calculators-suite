import { CalculatorType } from './types';

export interface CalcSeoMeta {
  slug: string;
  title: string;
  description: string;
  name: string;
  faqs: { question: string; answer: string }[];
}

const SITE_ORIGIN = 'https://finratecalc.com';

export const CALC_SEO_META: Record<string, CalcSeoMeta> = {
  mortgage: {
    slug: '/',
    name: 'US Mortgage Calculator',
    title: 'US Mortgage Calculator – Taxes, PMI & Payoff | FinRateCalc',
    description:
      'Estimate monthly US mortgage payments with property tax, homeowners insurance, PMI, and extra payoff savings using live FRED benchmark rates.',
    faqs: [
      {
        question: 'How much down payment do I really need in the US?',
        answer:
          'While 20% down eliminates Private Mortgage Insurance (PMI), conventional loans start at 3% down, FHA loans at 3.5%, and VA/USDA loans offer 0% down for eligible borrowers.',
      },
      {
        question: 'Should I choose a 15-year or a 30-year fixed loan?',
        answer:
          'A 30-year loan keeps monthly payments lower, while a 15-year fixed loan carries a lower interest rate and cuts total lifetime interest dramatically.',
      },
    ],
  },
  'personal-loan': {
    slug: '/personal-loan-calculator',
    name: 'Personal Loan Calculator',
    title: 'Personal Loan Calculator – Monthly APR | FinRateCalc',
    description:
      'Calculate fixed monthly personal loan payments, total interest cost, and origination fee impact across 12 to 84 month repayment terms.',
    faqs: [
      {
        question: 'Does paying off a personal loan early save interest?',
        answer:
          'Yes, provided your lender does not charge a prepayment penalty. Reducing principal early lowers remaining interest accruals.',
      },
    ],
  },
  compound: {
    slug: '/compound-interest-calculator',
    name: 'Compound Interest Calculator',
    title: 'Compound Interest Calculator – Growth | FinRateCalc',
    description:
      'Project US investment growth with monthly contributions, daily or annual compounding, S&P 500 benchmarks, and inflation-adjusted returns.',
    faqs: [
      {
        question: 'What is the Rule of 72 in compound interest?',
        answer:
          'Divide 72 by your annual rate of return to estimate how many years it takes for an investment to double (e.g., at 8%, 72 / 8 = 9 years).',
      },
    ],
  },
  'auto-loan': {
    slug: '/auto-loan-calculator',
    name: 'Auto Loan Calculator',
    title: 'Auto Loan Calculator – Car Payment & Tax | FinRateCalc',
    description:
      'Calculate monthly car loan payments with trade-in value, sales tax, dealer fees, and 36 to 84 month financing comparisons.',
    faqs: [
      {
        question: 'Does a trade-in reduce car sales tax?',
        answer:
          'In most US states, sales tax is calculated on the difference between the vehicle price and your trade-in allowance.',
      },
    ],
  },
  '401k': {
    slug: '/401k-retirement-calculator',
    name: '401(k) Retirement Calculator',
    title: '401(k) Retirement Calculator – 2026 Match | FinRateCalc',
    description:
      'Forecast your 401(k) retirement nest egg with employer matching, salary growth, catch-up limits, and the $23,500 IRS contribution cap.',
    faqs: [
      {
        question: 'Does employer match count toward the $23,500 401(k) cap?',
        answer:
          'No. The $23,500 cap applies to your own elective deferrals; employer matching falls under the higher combined IRS plan limit.',
      },
    ],
  },
  'extra-payments': {
    slug: '/extra-mortgage-payment-calculator',
    name: 'Extra Mortgage Payment Calculator',
    title: 'Extra Mortgage Payment Calculator – Payoff | FinRateCalc',
    description:
      'See how extra monthly, annual, or biweekly mortgage principal payments shave years off your loan and save tens of thousands in interest.',
    faqs: [
      {
        question: 'How many years does one extra mortgage payment per year save?',
        answer:
          'Making one extra principal-and-interest payment per year on a typical 30-year mortgage around 6.5% can cut roughly 4 to 5 years off your loan.',
      },
    ],
  },
  inflation: {
    slug: '/inflation-calculator',
    name: 'US Inflation Calculator',
    title: 'US Inflation Calculator – CPI Power | FinRateCalc',
    description:
      'Measure how US Consumer Price Index (CPI) inflation erodes purchasing power and estimate future costs of living over 5 to 40 years.',
    faqs: [
      {
        question: 'What US inflation rate should I use for long-term planning?',
        answer:
          'Financial planners commonly test 2.5% to 3.0% annualized inflation alongside current BLS CPI readings.',
      },
    ],
  },
  'take-home': {
    slug: '/take-home-pay-calculator',
    name: 'US Take-Home Pay Calculator',
    title: 'US Take-Home Pay Calculator – Net Salary | FinRateCalc',
    description:
      'Convert gross annual salary or hourly pay into net biweekly and monthly take-home pay after Federal brackets, FICA, and 401(k) deductions.',
    faqs: [
      {
        question: 'How do 401(k) contributions affect take-home pay?',
        answer:
          'Traditional pre-tax 401(k) deferrals reduce Federal taxable wages dollar-for-dollar, lowering current tax withholding.',
      },
    ],
  },
  directory: {
    slug: '/financial-calculators',
    name: 'US Financial Calculators Directory',
    title: 'US Financial Calculators Directory | FinRateCalc',
    description:
      'Browse all free US financial calculators on FinRateCalc: mortgage, personal loan, auto loan, 401(k), compound interest, inflation, and paycheck tools.',
    faqs: [
      {
        question: 'Are all FinRateCalc calculators free to use?',
        answer:
          'Yes. Every calculator runs locally in your browser with PDF report and comparison support at zero cost.',
      },
    ],
  },
};

export function getCalcFromPathname(pathname: string): CalculatorType {
  const clean = pathname === '/' ? '/' : pathname.replace(/\/+$/, '').toLowerCase();
  const matchedEntry = Object.entries(CALC_SEO_META).find(([, meta]) => meta.slug === clean);
  return (matchedEntry ? matchedEntry[0] : 'mortgage') as CalculatorType;
}

function upsertMeta(selector: string, attrName: 'name' | 'property', attrVal: string, content: string) {
  let el = document.head.querySelector(selector) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attrName, attrVal);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

export function applyCalculatorSEO(calcType: CalculatorType) {
  const meta = CALC_SEO_META[calcType] ?? CALC_SEO_META.mortgage;
  const canonicalUrl = meta.slug === '/' ? `${SITE_ORIGIN}/` : `${SITE_ORIGIN}${meta.slug}`;

  document.title = meta.title;
  upsertMeta('meta[name="description"]', 'name', 'description', meta.description);
  upsertMeta('meta[property="og:title"]', 'property', 'og:title', meta.title);
  upsertMeta('meta[property="og:description"]', 'property', 'og:description', meta.description);
  upsertMeta('meta[property="og:url"]', 'property', 'og:url', canonicalUrl);
  upsertMeta('meta[name="twitter:title"]', 'name', 'twitter:title', meta.title);
  upsertMeta('meta[name="twitter:description"]', 'name', 'twitter:description', meta.description);

  let canonicalLink = document.head.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!canonicalLink) {
    canonicalLink = document.createElement('link');
    canonicalLink.rel = 'canonical';
    document.head.appendChild(canonicalLink);
  }
  canonicalLink.href = canonicalUrl;

  const jsonLdGraph = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: meta.name,
      url: canonicalUrl,
      description: meta.description,
      applicationCategory: 'FinanceApplication',
      operatingSystem: 'All',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: meta.faqs.map((faq) => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer,
        },
      })),
    },
  ];

  let script = document.getElementById('finrate-dynamic-jsonld') as HTMLScriptElement | null;
  if (!script) {
    script = document.createElement('script');
    script.id = 'finrate-dynamic-jsonld';
    script.type = 'application/ld+json';
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(jsonLdGraph);
}
