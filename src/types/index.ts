export type CalculatorType =
  | 'mortgage'
  | 'take-home'
  | '401k'
  | 'auto-loan'
  | 'personal-loan'
  | 'compound'
  | 'extra-payments'
  | 'inflation'
  | 'directory';

export interface MarketRate {
  id: string;
  label: string;
  value: string;
  rateNum: number;
  change?: string;
  benchmarkSource: string;
  targetCalc?: CalculatorType;
  tooltipText?: string;
}

export interface MortgageInputs {
  homePrice: number;
  downPaymentPercent: number;
  downPaymentDollar: number;
  downPaymentMode: 'percent' | 'dollar';
  loanTermYears: number;
  interestRate: number;
  propertyTaxAnnual: number;
  homeInsuranceAnnual: number;
  hoaAnnual: number;
  pmiRate: number; // e.g. 0.58% annual
  includePmiAuto: boolean;
  extraPaymentMonthly: number;
  extraPaymentAnnual: number;
  extraPaymentOneTime: number;
  extraPaymentOneTimeMonth: number;
  startDate: string; // YYYY-MM
}

export interface AmortizationRow {
  month: number;
  year: number;
  dateStr: string;
  payment: number;
  principal: number;
  interest: number;
  extraPrincipal: number;
  totalPrincipalPaid: number;
  totalInterestPaid: number;
  remainingBalance: number;
  pmiPaid: number;
}

export interface AnnualAmortizationRow {
  year: number;
  principal: number;
  interest: number;
  extraPrincipal: number;
  totalPaid: number;
  endingBalance: number;
  pmiPaid: number;
}

export interface MortgageResult {
  loanAmount: number;
  monthlyPrincipalInterest: number;
  monthlyPropertyTax: number;
  monthlyInsurance: number;
  monthlyHoa: number;
  monthlyPmi: number;
  totalMonthlyPayment: number;
  totalInterestStandard: number;
  totalInterestActual: number;
  totalCostActual: number;
  interestSaved: number;
  originalPayoffMonths: number;
  actualPayoffMonths: number;
  monthsSaved: number;
  pmiMonthsDuration: number;
  totalPmiPaid: number;
  amortizationMonthly: AmortizationRow[];
  amortizationAnnual: AnnualAmortizationRow[];
}

export interface TakeHomePayInputs {
  grossSalary: number;
  payFrequency: 'annual' | 'monthly' | 'semi-monthly' | 'bi-weekly' | 'weekly';
  filingStatus: 'single' | 'married-joint' | 'head-of-household';
  usState: string;
  k401ContributionAnnual: number;
  hsaAnnual: number;
  healthInsuranceAnnual: number;
  otherPreTaxAnnual: number;
}

export interface TakeHomePayResult {
  grossPerPaycheck: number;
  netPerPaycheck: number;
  federalTaxPerPaycheck: number;
  stateTaxPerPaycheck: number;
  socialSecurityPerPaycheck: number;
  medicarePerPaycheck: number;
  preTaxDeductionsPerPaycheck: number;
  effectiveTaxRate: number;
  annual: {
    gross: number;
    federalTax: number;
    stateTax: number;
    socialSecurity: number;
    medicare: number;
    totalFica: number;
    preTaxDeductions: number;
    netTakeHome: number;
  };
}

export interface Retirement401kInputs {
  currentAge: number;
  retirementAge: number;
  currentSalary: number;
  currentBalance: number;
  contributionPercent: number;
  employerMatchPercent: number; // e.g. 50% match
  employerMatchUpToPercent: number; // up to 6% of salary
  annualSalaryIncrease: number; // e.g. 3%
  annualReturn: number; // e.g. 7.5%
  inflationRate: number; // e.g. 2.5%
  adjustForInflation: boolean;
}

export interface RetirementYearProjection {
  age: number;
  salary: number;
  employeeContrib: number;
  employerContrib: number;
  interestEarned: number;
  endBalance: number;
  purchasingPowerBalance: number;
}

export interface Retirement401kResult {
  totalBalanceAtRetirement: number;
  inflationAdjustedBalance: number;
  totalEmployeeContributions: number;
  totalEmployerContributions: number;
  totalInterestEarned: number;
  monthlyIncome4PercentRule: number;
  projections: RetirementYearProjection[];
}

export interface AutoLoanInputs {
  vehiclePrice: number;
  downPayment: number;
  tradeInValue: number;
  tradeInOwed: number;
  salesTaxPercent: number;
  dealerDocAndRegistrationFees: number;
  interestRate: number;
  loanTermMonths: number;
}

export interface AutoLoanResult {
  monthlyPayment: number;
  totalLoanAmount: number;
  totalSalesTax: number;
  outTheDoorPrice: number;
  totalInterest: number;
  totalCostOfVehicle: number;
}

export interface PersonalLoanInputs {
  loanAmount: number;
  interestRate: number;
  loanTermMonths: number;
  originationFeePercent: number;
  compareCreditCardApr: number;
}

export interface PersonalLoanResult {
  monthlyPayment: number;
  totalInterest: number;
  originationFeeDollar: number;
  totalRepayment: number;
  creditCardMonthlyPayment: number;
  creditCardTotalInterest: number;
  totalSavingsVsCreditCard: number;
  monthsFasterThanCard: number;
}

export interface CompoundInterestInputs {
  initialDeposit: number;
  monthlyDeposit: number;
  annualInterestRate: number;
  years: number;
  compoundFrequency: 'monthly' | 'annually' | 'daily';
  inflationAdjustedRate: number;
}

export interface CompoundYearRow {
  year: number;
  deposits: number;
  interest: number;
  balance: number;
}

export interface CompoundInterestResult {
  endBalance: number;
  totalPrincipal: number;
  totalInterest: number;
  yearlySchedule: CompoundYearRow[];
}

export interface InflationInputs {
  amount: number;
  startYear: number;
  endYear: number;
  mode: 'historical' | 'future';
  futureRate: number;
  futureYears: number;
}

export interface RecentCalculation {
  id: string;
  type: CalculatorType;
  title: string;
  subtitle: string;
  timestamp: number;
  summaryValue: string;
  data: any;
}
