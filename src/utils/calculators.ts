import {
  MortgageInputs,
  MortgageResult,
  AmortizationRow,
  AnnualAmortizationRow,
  TakeHomePayInputs,
  TakeHomePayResult,
  Retirement401kInputs,
  Retirement401kResult,
  RetirementYearProjection,
  AutoLoanInputs,
  AutoLoanResult,
  PersonalLoanInputs,
  PersonalLoanResult,
  CompoundInterestInputs,
  CompoundInterestResult,
  CompoundYearRow,
} from '../types';

import {
  US_STATES_TAX_DATA,
  FEDERAL_TAX_BRACKETS_SINGLE,
  FEDERAL_TAX_BRACKETS_MARRIED,
  FEDERAL_TAX_BRACKETS_HOH,
  STANDARD_DEDUCTIONS,
  FICA_SOCIAL_SECURITY_RATE,
  FICA_SOCIAL_SECURITY_CAP,
  FICA_MEDICARE_RATE,
  FICA_ADDITIONAL_MEDICARE_RATE,
  FICA_ADDITIONAL_MEDICARE_THRESHOLD_SINGLE,
  FICA_ADDITIONAL_MEDICARE_THRESHOLD_MARRIED,
} from '../data/usTaxRates';

// Currency and number formatters
export const formatCurrency = (val: number, includeCents: boolean = true): string => {
  if (isNaN(val) || !isFinite(val)) return '$0.00';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: includeCents ? 2 : 0,
    maximumFractionDigits: includeCents ? 2 : 0,
  }).format(val);
};

export const formatNumber = (val: number, decimals: number = 0): string => {
  if (isNaN(val) || !isFinite(val)) return '0';
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(val);
};

export const formatPercent = (val: number, decimals: number = 2): string => {
  if (isNaN(val) || !isFinite(val)) return '0%';
  return `${val.toFixed(decimals)}%`;
};

// 1. MORTGAGE CALCULATOR
export const calculateMortgage = (inputs: MortgageInputs): MortgageResult => {
  const homePrice = Math.max(0, inputs.homePrice);
  const downPayment =
    inputs.downPaymentMode === 'percent'
      ? (homePrice * inputs.downPaymentPercent) / 100
      : inputs.downPaymentDollar;

  const loanAmount = Math.max(0, homePrice - downPayment);
  const termMonths = Math.max(1, inputs.loanTermYears * 12);
  const monthlyRate = inputs.interestRate / 100 / 12;

  // Monthly Principal & Interest (P&I)
  let monthlyPI = 0;
  if (loanAmount > 0) {
    if (monthlyRate === 0) {
      monthlyPI = loanAmount / termMonths;
    } else {
      monthlyPI =
        (loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, termMonths))) /
        (Math.pow(1 + monthlyRate, termMonths) - 1);
    }
  }

  // Monthly Escrow components
  const monthlyPropertyTax = (inputs.propertyTaxAnnual || 0) / 12;
  const monthlyInsurance = (inputs.homeInsuranceAnnual || 0) / 12;
  const monthlyHoa = (inputs.hoaAnnual || 0) / 12;

  // PMI Rule: Conventional loans typically require PMI if down payment is < 20% (LTV > 80%)
  const ltv = homePrice > 0 ? (loanAmount / homePrice) * 100 : 0;
  const requiresPmi = inputs.includePmiAuto && ltv > 80;
  const monthlyPmiRate = (inputs.pmiRate || 0.58) / 100 / 12;
  const initialMonthlyPmi = requiresPmi ? loanAmount * monthlyPmiRate : 0;

  // Standard total interest without extra payments
  const totalInterestStandard = Math.max(0, monthlyPI * termMonths - loanAmount);

  // Generate Amortization Schedule & calculate extra payment impact
  let balance = loanAmount;
  let totalInterestActual = 0;
  let totalPmiPaid = 0;
  let pmiMonthsDuration = 0;
  let actualPayoffMonths = 0;

  const amortizationMonthly: AmortizationRow[] = [];
  const annualMap = new Map<number, { principal: number; interest: number; extra: number; pmi: number; balance: number }>();

  // Date parsing
  const [startYearStr, startMonthStr] = (inputs.startDate || '2026-11').split('-');
  let currentYear = parseInt(startYearStr, 10) || 2026;
  let currentMonthIndex = (parseInt(startMonthStr, 10) || 11) - 1;

  for (let m = 1; m <= termMonths && balance > 0.01; m++) {
    actualPayoffMonths = m;
    const interestForMonth = balance * monthlyRate;
    let scheduledPrincipal = monthlyPI - interestForMonth;

    if (scheduledPrincipal > balance) {
      scheduledPrincipal = balance;
    }

    // Extra payments
    let extraForMonth = inputs.extraPaymentMonthly || 0;
    // Annual extra payment in month 12 of each calendar year
    if (m % 12 === 0 && inputs.extraPaymentAnnual) {
      extraForMonth += inputs.extraPaymentAnnual;
    }
    // One time payment
    if (inputs.extraPaymentOneTime && m === (inputs.extraPaymentOneTimeMonth || 1)) {
      extraForMonth += inputs.extraPaymentOneTime;
    }

    if (scheduledPrincipal + extraForMonth > balance) {
      extraForMonth = Math.max(0, balance - scheduledPrincipal);
    }

    const totalPrincipalThisMonth = scheduledPrincipal + extraForMonth;
    balance = Math.max(0, balance - totalPrincipalThisMonth);
    totalInterestActual += interestForMonth;

    // Check PMI cancellation (Homeowners Protection Act: cancelled when balance drops to 80% of original value)
    let currentPmi = 0;
    if (requiresPmi && (balance + totalPrincipalThisMonth) > homePrice * 0.8) {
      currentPmi = initialMonthlyPmi;
      totalPmiPaid += currentPmi;
      pmiMonthsDuration++;
    }

    const date = new Date(currentYear, currentMonthIndex);
    const dateStr = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

    amortizationMonthly.push({
      month: m,
      year: currentYear,
      dateStr,
      payment: totalPrincipalThisMonth + interestForMonth + monthlyPropertyTax + monthlyInsurance + monthlyHoa + currentPmi,
      principal: scheduledPrincipal,
      interest: interestForMonth,
      extraPrincipal: extraForMonth,
      totalPrincipalPaid: loanAmount - balance,
      totalInterestPaid: totalInterestActual,
      remainingBalance: balance,
      pmiPaid: currentPmi,
    });

    // Aggregate by calendar year
    if (!annualMap.has(currentYear)) {
      annualMap.set(currentYear, { principal: 0, interest: 0, extra: 0, pmi: 0, balance: 0 });
    }
    const yearEntry = annualMap.get(currentYear)!;
    yearEntry.principal += scheduledPrincipal;
    yearEntry.interest += interestForMonth;
    yearEntry.extra += extraForMonth;
    yearEntry.pmi += currentPmi;
    yearEntry.balance = balance;

    // Advance calendar month
    currentMonthIndex++;
    if (currentMonthIndex > 11) {
      currentMonthIndex = 0;
      currentYear++;
    }
  }

  const amortizationAnnual: AnnualAmortizationRow[] = Array.from(annualMap.entries()).map(
    ([year, val]) => ({
      year,
      principal: val.principal,
      interest: val.interest,
      extraPrincipal: val.extra,
      totalPaid: val.principal + val.extra + val.interest,
      endingBalance: val.balance,
      pmiPaid: val.pmi,
    })
  );

  const interestSaved = Math.max(0, totalInterestStandard - totalInterestActual);
  const monthsSaved = Math.max(0, termMonths - actualPayoffMonths);
  const totalCostActual = loanAmount + totalInterestActual + totalPmiPaid;

  const totalMonthlyPayment =
    monthlyPI + monthlyPropertyTax + monthlyInsurance + monthlyHoa + initialMonthlyPmi;

  return {
    loanAmount,
    monthlyPrincipalInterest: monthlyPI,
    monthlyPropertyTax,
    monthlyInsurance,
    monthlyHoa,
    monthlyPmi: initialMonthlyPmi,
    totalMonthlyPayment,
    totalInterestStandard,
    totalInterestActual,
    totalCostActual,
    interestSaved,
    originalPayoffMonths: termMonths,
    actualPayoffMonths,
    monthsSaved,
    pmiMonthsDuration,
    totalPmiPaid,
    amortizationMonthly,
    amortizationAnnual,
  };
};

// 2. US TAKE-HOME PAY (PAYCHECK) CALCULATOR
export const calculateTakeHomePay = (inputs: TakeHomePayInputs): TakeHomePayResult => {
  const gross = Math.max(0, inputs.grossSalary);
  const periodsPerYear = {
    annual: 1,
    monthly: 12,
    'semi-monthly': 24,
    'bi-weekly': 26,
    weekly: 52,
  }[inputs.payFrequency] || 26;

  // Pre-tax deductions
  const preTaxAnnual =
    (inputs.k401ContributionAnnual || 0) +
    (inputs.hsaAnnual || 0) +
    (inputs.healthInsuranceAnnual || 0) +
    (inputs.otherPreTaxAnnual || 0);

  const federalAdjustedGross = Math.max(0, gross - preTaxAnnual);

  // Standard Deduction
  const standardDeduction = STANDARD_DEDUCTIONS[inputs.filingStatus] || 14600;
  const taxableFederalIncome = Math.max(0, federalAdjustedGross - standardDeduction);

  // Federal Income Tax brackets
  let brackets = FEDERAL_TAX_BRACKETS_SINGLE;
  if (inputs.filingStatus === 'married-joint') {
    brackets = FEDERAL_TAX_BRACKETS_MARRIED;
  } else if (inputs.filingStatus === 'head-of-household') {
    brackets = FEDERAL_TAX_BRACKETS_HOH;
  }

  let federalTaxAnnual = 0;
  let prevLimit = 0;
  for (const bracket of brackets) {
    if (taxableFederalIncome > prevLimit) {
      const taxableInBracket = Math.min(taxableFederalIncome, bracket.max) - prevLimit;
      federalTaxAnnual += taxableInBracket * bracket.rate;
      prevLimit = bracket.max;
    } else {
      break;
    }
  }

  // FICA: Social Security (6.2% on income up to $168,600)
  const socialSecurityTaxable = Math.min(gross, FICA_SOCIAL_SECURITY_CAP);
  const socialSecurityAnnual = socialSecurityTaxable * FICA_SOCIAL_SECURITY_RATE;

  // FICA: Medicare (1.45% + 0.9% additional Medicare above $200k single / $250k joint)
  let medicareAnnual = gross * FICA_MEDICARE_RATE;
  const additionalThreshold =
    inputs.filingStatus === 'married-joint'
      ? FICA_ADDITIONAL_MEDICARE_THRESHOLD_MARRIED
      : FICA_ADDITIONAL_MEDICARE_THRESHOLD_SINGLE;

  if (gross > additionalThreshold) {
    medicareAnnual += (gross - additionalThreshold) * FICA_ADDITIONAL_MEDICARE_RATE;
  }

  const totalFica = socialSecurityAnnual + medicareAnnual;

  // State Tax calculation based on US state profile
  const stateProfile = US_STATES_TAX_DATA[inputs.usState] || US_STATES_TAX_DATA.CA;
  let stateTaxAnnual = 0;
  if (stateProfile.hasIncomeTax) {
    if (stateProfile.type === 'flat' && stateProfile.flatRate) {
      stateTaxAnnual = federalAdjustedGross * (stateProfile.flatRate / 100);
    } else {
      // Effective progressive approximation based on state tier
      stateTaxAnnual = federalAdjustedGross * (stateProfile.averageEffectiveIncomeTaxRate / 100);
    }
  }

  const netAnnual = Math.max(0, gross - federalTaxAnnual - stateTaxAnnual - totalFica - preTaxAnnual);

  return {
    grossPerPaycheck: gross / periodsPerYear,
    netPerPaycheck: netAnnual / periodsPerYear,
    federalTaxPerPaycheck: federalTaxAnnual / periodsPerYear,
    stateTaxPerPaycheck: stateTaxAnnual / periodsPerYear,
    socialSecurityPerPaycheck: socialSecurityAnnual / periodsPerYear,
    medicarePerPaycheck: medicareAnnual / periodsPerYear,
    preTaxDeductionsPerPaycheck: preTaxAnnual / periodsPerYear,
    effectiveTaxRate: gross > 0 ? ((federalTaxAnnual + stateTaxAnnual + totalFica) / gross) * 100 : 0,
    annual: {
      gross,
      federalTax: federalTaxAnnual,
      stateTax: stateTaxAnnual,
      socialSecurity: socialSecurityAnnual,
      medicare: medicareAnnual,
      totalFica,
      preTaxDeductions: preTaxAnnual,
      netTakeHome: netAnnual,
    },
  };
};

// 3. 401(k) RETIREMENT PLANNER
export const calculate401k = (inputs: Retirement401kInputs): Retirement401kResult => {
  const years = Math.max(1, inputs.retirementAge - inputs.currentAge);
  let balance = Math.max(0, inputs.currentBalance);
  let currentSalary = Math.max(0, inputs.currentSalary);
  let totalEmployeeContrib = 0;
  let totalEmployerContrib = 0;

  const projections: RetirementYearProjection[] = [];
  const returnRate = (inputs.annualReturn || 7) / 100;
  const salaryGrowthRate = (inputs.annualSalaryIncrease || 3) / 100;
  const inflationRate = (inputs.inflationRate || 2.5) / 100;

  // IRS 401(k) limit for elective deferral
  const irsLimit = 23500;
  const catchUpLimit = 7500;

  for (let i = 1; i <= years; i++) {
    const age = inputs.currentAge + i;
    const isCatchUp = age >= 50;
    const maxEmployeeAllowed = irsLimit + (isCatchUp ? catchUpLimit : 0);

    // Calculate employee contribution
    let employeeYearly = (currentSalary * (inputs.contributionPercent || 10)) / 100;
    if (employeeYearly > maxEmployeeAllowed) {
      employeeYearly = maxEmployeeAllowed;
    }

    // Calculate employer match
    // e.g. 50% match up to 6% of salary
    const matchCap = (currentSalary * (inputs.employerMatchUpToPercent || 6)) / 100;
    const eligibleAmount = Math.min(employeeYearly, matchCap);
    const employerYearly = eligibleAmount * ((inputs.employerMatchPercent || 50) / 100);

    // Investment returns during the year (assuming mid-year contributions)
    const investmentReturn = (balance + (employeeYearly + employerYearly) / 2) * returnRate;

    balance = balance + employeeYearly + employerYearly + investmentReturn;
    totalEmployeeContrib += employeeYearly;
    totalEmployerContrib += employerYearly;

    // Purchasing power adjustment
    const inflationFactor = Math.pow(1 + inflationRate, i);
    const purchasingPowerBalance = balance / inflationFactor;

    projections.push({
      age,
      salary: currentSalary,
      employeeContrib: employeeYearly,
      employerContrib: employerYearly,
      interestEarned: investmentReturn,
      endBalance: balance,
      purchasingPowerBalance,
    });

    currentSalary *= 1 + salaryGrowthRate;
  }

  const finalBalance = balance;
  const totalContributed = totalEmployeeContrib + totalEmployerContrib + inputs.currentBalance;
  const totalInterestEarned = Math.max(0, finalBalance - totalContributed);
  const inflationAdjustedBalance =
    projections.length > 0 ? projections[projections.length - 1].purchasingPowerBalance : finalBalance;

  // 4% Safe Withdrawal Rule (annual 4% / 12 months)
  const monthlyIncome4PercentRule = (finalBalance * 0.04) / 12;

  return {
    totalBalanceAtRetirement: finalBalance,
    inflationAdjustedBalance,
    totalEmployeeContributions: totalEmployeeContrib,
    totalEmployerContributions: totalEmployerContrib,
    totalInterestEarned,
    monthlyIncome4PercentRule,
    projections,
  };
};

// 4. US AUTO LOAN CALCULATOR
export const calculateAutoLoan = (inputs: AutoLoanInputs): AutoLoanResult => {
  const vehiclePrice = Math.max(0, inputs.vehiclePrice);
  const downPayment = Math.max(0, inputs.downPayment);
  const tradeInEquity = Math.max(0, (inputs.tradeInValue || 0) - (inputs.tradeInOwed || 0));

  // In many US states, trade-in reduces taxable amount
  const taxableAmount = Math.max(0, vehiclePrice - (inputs.tradeInValue || 0));
  const totalSalesTax = taxableAmount * ((inputs.salesTaxPercent || 0) / 100);
  const fees = inputs.dealerDocAndRegistrationFees || 0;

  const totalCostOfVehicle = vehiclePrice + totalSalesTax + fees;
  const totalLoanAmount = Math.max(0, totalCostOfVehicle - downPayment - tradeInEquity);

  const months = Math.max(1, inputs.loanTermMonths);
  const monthlyRate = (inputs.interestRate || 6.5) / 100 / 12;

  let monthlyPayment = 0;
  if (totalLoanAmount > 0) {
    if (monthlyRate === 0) {
      monthlyPayment = totalLoanAmount / months;
    } else {
      monthlyPayment =
        (totalLoanAmount * (monthlyRate * Math.pow(1 + monthlyRate, months))) /
        (Math.pow(1 + monthlyRate, months) - 1);
    }
  }

  const totalRepayment = monthlyPayment * months;
  const totalInterest = Math.max(0, totalRepayment - totalLoanAmount);

  return {
    monthlyPayment,
    totalLoanAmount,
    totalSalesTax,
    outTheDoorPrice: totalCostOfVehicle,
    totalInterest,
    totalCostOfVehicle: totalLoanAmount + totalInterest + downPayment + tradeInEquity,
  };
};

// 5. PERSONAL LOAN & DEBT CONSOLIDATION CALCULATOR
export const calculatePersonalLoan = (inputs: PersonalLoanInputs): PersonalLoanResult => {
  const principal = Math.max(0, inputs.loanAmount);
  const originationFeeDollar = principal * ((inputs.originationFeePercent || 0) / 100);
  const months = Math.max(1, inputs.loanTermMonths);
  const monthlyRate = (inputs.interestRate || 9.5) / 100 / 12;

  let monthlyPayment = 0;
  if (principal > 0) {
    if (monthlyRate === 0) {
      monthlyPayment = principal / months;
    } else {
      monthlyPayment =
        (principal * (monthlyRate * Math.pow(1 + monthlyRate, months))) /
        (Math.pow(1 + monthlyRate, months) - 1);
    }
  }

  const totalRepayment = monthlyPayment * months + originationFeeDollar;
  const totalInterest = Math.max(0, totalRepayment - principal);

  // Compare against credit card APR (typical US average 21.5% with minimum 2.5% payment)
  const cardRate = (inputs.compareCreditCardApr || 21.49) / 100 / 12;
  // If paid off at roughly minimum payment (~2.5% of balance or standard 60-month payoff)
  let cardBalance = principal;
  let cardTotalInterest = 0;
  let cardMonths = 0;
  const cardMonthlyPayment = Math.max(50, principal * 0.025);

  while (cardBalance > 1 && cardMonths < 360) {
    cardMonths++;
    const interest = cardBalance * cardRate;
    cardTotalInterest += interest;
    const principalPaid = Math.min(cardBalance, cardMonthlyPayment - interest);
    if (principalPaid <= 0) break; // Won't pay off
    cardBalance -= principalPaid;
  }

  const totalSavingsVsCreditCard = Math.max(0, cardTotalInterest - totalInterest);
  const monthsFasterThanCard = Math.max(0, cardMonths - months);

  return {
    monthlyPayment,
    totalInterest,
    originationFeeDollar,
    totalRepayment,
    creditCardMonthlyPayment: cardMonthlyPayment,
    creditCardTotalInterest: cardTotalInterest,
    totalSavingsVsCreditCard,
    monthsFasterThanCard,
  };
};

// 6. COMPOUND INTEREST CALCULATOR
export const calculateCompoundInterest = (inputs: CompoundInterestInputs): CompoundInterestResult => {
  let balance = Math.max(0, inputs.initialDeposit);
  const monthly = Math.max(0, inputs.monthlyDeposit);
  const r = (inputs.annualInterestRate || 7) / 100;
  const years = Math.max(1, inputs.years);

  const schedule: CompoundYearRow[] = [];
  let totalDeposited = balance;

  for (let y = 1; y <= years; y++) {
    let yearInterest = 0;
    for (let m = 1; m <= 12; m++) {
      const monthInterest = balance * (r / 12);
      yearInterest += monthInterest;
      balance += monthInterest + monthly;
      totalDeposited += monthly;
    }
    schedule.push({
      year: y,
      deposits: totalDeposited,
      interest: balance - totalDeposited,
      balance,
    });
  }

  return {
    endBalance: balance,
    totalPrincipal: totalDeposited,
    totalInterest: Math.max(0, balance - totalDeposited),
    yearlySchedule: schedule,
  };
};
