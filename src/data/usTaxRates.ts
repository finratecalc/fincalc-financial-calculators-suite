export interface USStateTaxProfile {
  code: string;
  name: string;
  hasIncomeTax: boolean;
  type: 'none' | 'flat' | 'graduated';
  flatRate?: number;
  averageEffectiveIncomeTaxRate: number; // Approximate effective rate for standard median bracket
  averagePropertyTaxRate: number; // % of assessed home value
  averageSalesTaxRate: number; // Combined state + local sales tax
  averageHomeownersInsuranceAnnual: number;
}

export const US_STATES_TAX_DATA: Record<string, USStateTaxProfile> = {
  AL: { code: 'AL', name: 'Alabama', hasIncomeTax: true, type: 'graduated', averageEffectiveIncomeTaxRate: 4.2, averagePropertyTaxRate: 0.41, averageSalesTaxRate: 9.29, averageHomeownersInsuranceAnnual: 1850 },
  AK: { code: 'AK', name: 'Alaska', hasIncomeTax: false, type: 'none', averageEffectiveIncomeTaxRate: 0.0, averagePropertyTaxRate: 1.19, averageSalesTaxRate: 1.76, averageHomeownersInsuranceAnnual: 1100 },
  AZ: { code: 'AZ', name: 'Arizona', hasIncomeTax: true, type: 'flat', flatRate: 2.5, averageEffectiveIncomeTaxRate: 2.5, averagePropertyTaxRate: 0.62, averageSalesTaxRate: 8.37, averageHomeownersInsuranceAnnual: 1450 },
  AR: { code: 'AR', name: 'Arkansas', hasIncomeTax: true, type: 'graduated', averageEffectiveIncomeTaxRate: 4.4, averagePropertyTaxRate: 0.62, averageSalesTaxRate: 9.47, averageHomeownersInsuranceAnnual: 2200 },
  CA: { code: 'CA', name: 'California', hasIncomeTax: true, type: 'graduated', averageEffectiveIncomeTaxRate: 6.8, averagePropertyTaxRate: 0.75, averageSalesTaxRate: 8.85, averageHomeownersInsuranceAnnual: 1650 },
  CO: { code: 'CO', name: 'Colorado', hasIncomeTax: true, type: 'flat', flatRate: 4.4, averageEffectiveIncomeTaxRate: 4.4, averagePropertyTaxRate: 0.51, averageSalesTaxRate: 7.77, averageHomeownersInsuranceAnnual: 2350 },
  CT: { code: 'CT', name: 'Connecticut', hasIncomeTax: true, type: 'graduated', averageEffectiveIncomeTaxRate: 5.5, averagePropertyTaxRate: 2.15, averageSalesTaxRate: 6.35, averageHomeownersInsuranceAnnual: 1550 },
  DE: { code: 'DE', name: 'Delaware', hasIncomeTax: true, type: 'graduated', averageEffectiveIncomeTaxRate: 5.2, averagePropertyTaxRate: 0.57, averageSalesTaxRate: 0.00, averageHomeownersInsuranceAnnual: 980 },
  FL: { code: 'FL', name: 'Florida', hasIncomeTax: false, type: 'none', averageEffectiveIncomeTaxRate: 0.0, averagePropertyTaxRate: 0.91, averageSalesTaxRate: 7.02, averageHomeownersInsuranceAnnual: 3400 },
  GA: { code: 'GA', name: 'Georgia', hasIncomeTax: true, type: 'flat', flatRate: 5.49, averageEffectiveIncomeTaxRate: 5.49, averagePropertyTaxRate: 0.90, averageSalesTaxRate: 7.37, averageHomeownersInsuranceAnnual: 1680 },
  HI: { code: 'HI', name: 'Hawaii', hasIncomeTax: true, type: 'graduated', averageEffectiveIncomeTaxRate: 7.1, averagePropertyTaxRate: 0.28, averageSalesTaxRate: 4.44, averageHomeownersInsuranceAnnual: 1250 },
  ID: { code: 'ID', name: 'Idaho', hasIncomeTax: true, type: 'flat', flatRate: 5.8, averageEffectiveIncomeTaxRate: 5.8, averagePropertyTaxRate: 0.63, averageSalesTaxRate: 6.02, averageHomeownersInsuranceAnnual: 1100 },
  IL: { code: 'IL', name: 'Illinois', hasIncomeTax: true, type: 'flat', flatRate: 4.95, averageEffectiveIncomeTaxRate: 4.95, averagePropertyTaxRate: 2.08, averageSalesTaxRate: 8.86, averageHomeownersInsuranceAnnual: 1720 },
  IN: { code: 'IN', name: 'Indiana', hasIncomeTax: true, type: 'flat', flatRate: 3.05, averageEffectiveIncomeTaxRate: 3.05, averagePropertyTaxRate: 0.81, averageSalesTaxRate: 7.00, averageHomeownersInsuranceAnnual: 1350 },
  IA: { code: 'IA', name: 'Iowa', hasIncomeTax: true, type: 'graduated', averageEffectiveIncomeTaxRate: 4.8, averagePropertyTaxRate: 1.57, averageSalesTaxRate: 6.94, averageHomeownersInsuranceAnnual: 1550 },
  KS: { code: 'KS', name: 'Kansas', hasIncomeTax: true, type: 'graduated', averageEffectiveIncomeTaxRate: 5.1, averagePropertyTaxRate: 1.41, averageSalesTaxRate: 8.71, averageHomeownersInsuranceAnnual: 2650 },
  KY: { code: 'KY', name: 'Kentucky', hasIncomeTax: true, type: 'flat', flatRate: 4.0, averageEffectiveIncomeTaxRate: 4.0, averagePropertyTaxRate: 0.86, averageSalesTaxRate: 6.00, averageHomeownersInsuranceAnnual: 1820 },
  LA: { code: 'LA', name: 'Louisiana', hasIncomeTax: true, type: 'graduated', averageEffectiveIncomeTaxRate: 3.8, averagePropertyTaxRate: 0.56, averageSalesTaxRate: 9.55, averageHomeownersInsuranceAnnual: 2900 },
  ME: { code: 'ME', name: 'Maine', hasIncomeTax: true, type: 'graduated', averageEffectiveIncomeTaxRate: 5.8, averagePropertyTaxRate: 1.28, averageSalesTaxRate: 5.50, averageHomeownersInsuranceAnnual: 1120 },
  MD: { code: 'MD', name: 'Maryland', hasIncomeTax: true, type: 'graduated', averageEffectiveIncomeTaxRate: 5.4, averagePropertyTaxRate: 1.09, averageSalesTaxRate: 6.00, averageHomeownersInsuranceAnnual: 1480 },
  MA: { code: 'MA', name: 'Massachusetts', hasIncomeTax: true, type: 'flat', flatRate: 5.0, averageEffectiveIncomeTaxRate: 5.0, averagePropertyTaxRate: 1.17, averageSalesTaxRate: 6.25, averageHomeownersInsuranceAnnual: 1650 },
  MI: { code: 'MI', name: 'Michigan', hasIncomeTax: true, type: 'flat', flatRate: 4.25, averageEffectiveIncomeTaxRate: 4.25, averagePropertyTaxRate: 1.44, averageSalesTaxRate: 6.00, averageHomeownersInsuranceAnnual: 1580 },
  MN: { code: 'MN', name: 'Minnesota', hasIncomeTax: true, type: 'graduated', averageEffectiveIncomeTaxRate: 6.2, averagePropertyTaxRate: 1.12, averageSalesTaxRate: 7.49, averageHomeownersInsuranceAnnual: 1850 },
  MS: { code: 'MS', name: 'Mississippi', hasIncomeTax: true, type: 'flat', flatRate: 4.7, averageEffectiveIncomeTaxRate: 4.7, averagePropertyTaxRate: 0.79, averageSalesTaxRate: 7.07, averageHomeownersInsuranceAnnual: 2200 },
  MO: { code: 'MO', name: 'Missouri', hasIncomeTax: true, type: 'graduated', averageEffectiveIncomeTaxRate: 4.4, averagePropertyTaxRate: 0.97, averageSalesTaxRate: 8.33, averageHomeownersInsuranceAnnual: 1980 },
  MT: { code: 'MT', name: 'Montana', hasIncomeTax: true, type: 'graduated', averageEffectiveIncomeTaxRate: 5.3, averagePropertyTaxRate: 0.83, averageSalesTaxRate: 0.00, averageHomeownersInsuranceAnnual: 1500 },
  NE: { code: 'NE', name: 'Nebraska', hasIncomeTax: true, type: 'graduated', averageEffectiveIncomeTaxRate: 5.2, averagePropertyTaxRate: 1.73, averageSalesTaxRate: 6.94, averageHomeownersInsuranceAnnual: 2550 },
  NV: { code: 'NV', name: 'Nevada', hasIncomeTax: false, type: 'none', averageEffectiveIncomeTaxRate: 0.0, averagePropertyTaxRate: 0.60, averageSalesTaxRate: 8.23, averageHomeownersInsuranceAnnual: 1150 },
  NH: { code: 'NH', name: 'New Hampshire', hasIncomeTax: false, type: 'none', averageEffectiveIncomeTaxRate: 0.0, averagePropertyTaxRate: 2.18, averageSalesTaxRate: 0.00, averageHomeownersInsuranceAnnual: 1050 },
  NJ: { code: 'NJ', name: 'New Jersey', hasIncomeTax: true, type: 'graduated', averageEffectiveIncomeTaxRate: 6.0, averagePropertyTaxRate: 2.23, averageSalesTaxRate: 6.60, averageHomeownersInsuranceAnnual: 1350 },
  NM: { code: 'NM', name: 'New Mexico', hasIncomeTax: true, type: 'graduated', averageEffectiveIncomeTaxRate: 4.5, averagePropertyTaxRate: 0.80, averageSalesTaxRate: 7.72, averageHomeownersInsuranceAnnual: 1390 },
  NY: { code: 'NY', name: 'New York', hasIncomeTax: true, type: 'graduated', averageEffectiveIncomeTaxRate: 6.2, averagePropertyTaxRate: 1.73, averageSalesTaxRate: 8.52, averageHomeownersInsuranceAnnual: 1680 },
  NC: { code: 'NC', name: 'North Carolina', hasIncomeTax: true, type: 'flat', flatRate: 4.5, averageEffectiveIncomeTaxRate: 4.5, averagePropertyTaxRate: 0.80, averageSalesTaxRate: 6.99, averageHomeownersInsuranceAnnual: 1600 },
  ND: { code: 'ND', name: 'North Dakota', hasIncomeTax: true, type: 'graduated', averageEffectiveIncomeTaxRate: 1.8, averagePropertyTaxRate: 0.98, averageSalesTaxRate: 6.96, averageHomeownersInsuranceAnnual: 1650 },
  OH: { code: 'OH', name: 'Ohio', hasIncomeTax: true, type: 'graduated', averageEffectiveIncomeTaxRate: 3.6, averagePropertyTaxRate: 1.57, averageSalesTaxRate: 7.24, averageHomeownersInsuranceAnnual: 1250 },
  OK: { code: 'OK', name: 'Oklahoma', hasIncomeTax: true, type: 'graduated', averageEffectiveIncomeTaxRate: 4.2, averagePropertyTaxRate: 0.90, averageSalesTaxRate: 8.98, averageHomeownersInsuranceAnnual: 2750 },
  OR: { code: 'OR', name: 'Oregon', hasIncomeTax: true, type: 'graduated', averageEffectiveIncomeTaxRate: 7.4, averagePropertyTaxRate: 0.97, averageSalesTaxRate: 0.00, averageHomeownersInsuranceAnnual: 980 },
  PA: { code: 'PA', name: 'Pennsylvania', hasIncomeTax: true, type: 'flat', flatRate: 3.07, averageEffectiveIncomeTaxRate: 3.07, averagePropertyTaxRate: 1.58, averageSalesTaxRate: 6.34, averageHomeownersInsuranceAnnual: 1150 },
  RI: { code: 'RI', name: 'Rhode Island', hasIncomeTax: true, type: 'graduated', averageEffectiveIncomeTaxRate: 5.1, averagePropertyTaxRate: 1.53, averageSalesTaxRate: 7.00, averageHomeownersInsuranceAnnual: 1780 },
  SC: { code: 'SC', name: 'South Carolina', hasIncomeTax: true, type: 'graduated', averageEffectiveIncomeTaxRate: 5.0, averagePropertyTaxRate: 0.56, averageSalesTaxRate: 7.44, averageHomeownersInsuranceAnnual: 1820 },
  SD: { code: 'SD', name: 'South Dakota', hasIncomeTax: false, type: 'none', averageEffectiveIncomeTaxRate: 0.0, averagePropertyTaxRate: 1.22, averageSalesTaxRate: 6.40, averageHomeownersInsuranceAnnual: 1950 },
  TN: { code: 'TN', name: 'Tennessee', hasIncomeTax: false, type: 'none', averageEffectiveIncomeTaxRate: 0.0, averagePropertyTaxRate: 0.67, averageSalesTaxRate: 9.55, averageHomeownersInsuranceAnnual: 1900 },
  TX: { code: 'TX', name: 'Texas', hasIncomeTax: false, type: 'none', averageEffectiveIncomeTaxRate: 0.0, averagePropertyTaxRate: 1.68, averageSalesTaxRate: 8.20, averageHomeownersInsuranceAnnual: 2700 },
  UT: { code: 'UT', name: 'Utah', hasIncomeTax: true, type: 'flat', flatRate: 4.65, averageEffectiveIncomeTaxRate: 4.65, averagePropertyTaxRate: 0.58, averageSalesTaxRate: 7.19, averageHomeownersInsuranceAnnual: 1100 },
  VT: { code: 'VT', name: 'Vermont', hasIncomeTax: true, type: 'graduated', averageEffectiveIncomeTaxRate: 5.6, averagePropertyTaxRate: 1.90, averageSalesTaxRate: 6.24, averageHomeownersInsuranceAnnual: 1050 },
  VA: { code: 'VA', name: 'Virginia', hasIncomeTax: true, type: 'graduated', averageEffectiveIncomeTaxRate: 5.2, averagePropertyTaxRate: 0.82, averageSalesTaxRate: 5.75, averageHomeownersInsuranceAnnual: 1350 },
  WA: { code: 'WA', name: 'Washington', hasIncomeTax: false, type: 'none', averageEffectiveIncomeTaxRate: 0.0, averagePropertyTaxRate: 0.94, averageSalesTaxRate: 9.29, averageHomeownersInsuranceAnnual: 1300 },
  WV: { code: 'WV', name: 'West Virginia', hasIncomeTax: true, type: 'graduated', averageEffectiveIncomeTaxRate: 4.8, averagePropertyTaxRate: 0.59, averageSalesTaxRate: 6.55, averageHomeownersInsuranceAnnual: 1250 },
  WI: { code: 'WI', name: 'Wisconsin', hasIncomeTax: true, type: 'graduated', averageEffectiveIncomeTaxRate: 5.3, averagePropertyTaxRate: 1.73, averageSalesTaxRate: 5.43, averageHomeownersInsuranceAnnual: 1200 },
  WY: { code: 'WY', name: 'Wyoming', hasIncomeTax: false, type: 'none', averageEffectiveIncomeTaxRate: 0.0, averagePropertyTaxRate: 0.61, averageSalesTaxRate: 5.36, averageHomeownersInsuranceAnnual: 1300 },
  DC: { code: 'DC', name: 'Washington D.C.', hasIncomeTax: true, type: 'graduated', averageEffectiveIncomeTaxRate: 6.5, averagePropertyTaxRate: 0.57, averageSalesTaxRate: 6.00, averageHomeownersInsuranceAnnual: 1400 },
};

// 2025/2026 IRS Federal Income Tax Brackets (Standard Deduction: Single $14,600, Married Joint $29,200, HoH $21,900)
export const FEDERAL_TAX_BRACKETS_SINGLE = [
  { max: 11925, rate: 0.10 },
  { max: 48475, rate: 0.12 },
  { max: 103350, rate: 0.22 },
  { max: 197300, rate: 0.24 },
  { max: 250525, rate: 0.32 },
  { max: 626350, rate: 0.35 },
  { max: Infinity, rate: 0.37 },
];

export const FEDERAL_TAX_BRACKETS_MARRIED = [
  { max: 23850, rate: 0.10 },
  { max: 96950, rate: 0.12 },
  { max: 206700, rate: 0.22 },
  { max: 394600, rate: 0.24 },
  { max: 501050, rate: 0.32 },
  { max: 751600, rate: 0.35 },
  { max: Infinity, rate: 0.37 },
];

export const FEDERAL_TAX_BRACKETS_HOH = [
  { max: 17000, rate: 0.10 },
  { max: 64850, rate: 0.12 },
  { max: 103350, rate: 0.22 },
  { max: 197300, rate: 0.24 },
  { max: 250500, rate: 0.32 },
  { max: 626350, rate: 0.35 },
  { max: Infinity, rate: 0.37 },
];

export const STANDARD_DEDUCTIONS = {
  single: 14600,
  'married-joint': 29200,
  'head-of-household': 21900,
};

// 2024/2025 FICA constants
export const FICA_SOCIAL_SECURITY_RATE = 0.062;
export const FICA_SOCIAL_SECURITY_CAP = 168600; // Wage base limit
export const FICA_MEDICARE_RATE = 0.0145;
export const FICA_ADDITIONAL_MEDICARE_RATE = 0.009; // On income above $200k single / $250k joint
export const FICA_ADDITIONAL_MEDICARE_THRESHOLD_SINGLE = 200000;
export const FICA_ADDITIONAL_MEDICARE_THRESHOLD_MARRIED = 250000;
