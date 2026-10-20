import React, { useState, useEffect } from 'react';
import { CalculatorType, MarketRate, RecentCalculation } from './types';
import { Header } from './components/Header';
import { MortgageCalculator } from './components/MortgageCalculator';
import { TakeHomePayCalculator } from './components/TakeHomePayCalculator';
import { Retirement401kCalculator } from './components/Retirement401kCalculator';
import { AutoLoanCalculator } from './components/AutoLoanCalculator';
import { PersonalLoanCalculator } from './components/PersonalLoanCalculator';
import { CompoundInterestCalculator } from './components/CompoundInterestCalculator';
import { ExtraPaymentsCalculator } from './components/ExtraPaymentsCalculator';
import { InflationCalculator } from './components/InflationCalculator';
import { AllCalculatorsDirectory } from './components/AllCalculatorsDirectory';
import { ScenarioComparisonModal } from './components/ScenarioComparisonModal';
import { ReportModal } from './components/ReportModal';
import { Footer } from './components/Footer';
import { calculateMortgage } from './utils/calculators';

export default function App() {
  const [activeCalc, setActiveCalc] = useState<CalculatorType>('mortgage');
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [reportTitle, setReportTitle] = useState('US Financial Analysis Report');
  const [reportData, setReportData] = useState<any>(null);

  // Recent calculations state initialized from localStorage
  const [recentCalculations, setRecentCalculations] = useState<RecentCalculation[]>(() => {
    try {
      const saved = localStorage.getItem('finratecalc_recent');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // ignore
    }
    // Default initial mock history item so the Recent counter has data like the screenshot
    return [
      {
        id: 'rec-1',
        type: 'mortgage',
        title: 'Mortgage: $400,000 (30-Yr)',
        subtitle: '20% Down · 6.5% Interest Rate',
        timestamp: Date.now() - 1000 * 60 * 15,
        summaryValue: '$2,539.28/mo',
        data: { homePrice: 400000, term: 30, rate: 6.5 },
      },
      {
        id: 'rec-2',
        type: 'take-home',
        title: 'Take-Home Pay ($95k Salary)',
        subtitle: 'California · Single · Bi-Weekly',
        timestamp: Date.now() - 1000 * 60 * 60,
        summaryValue: '$2,410.60/chk',
        data: { gross: 95000, state: 'CA' },
      },
      {
        id: 'rec-3',
        type: '401k',
        title: '401(k) Retirement Nest Egg',
        subtitle: 'Age 30 to 65 · 10% Contribution',
        timestamp: Date.now() - 1000 * 60 * 120,
        summaryValue: '$1,842,500',
        data: { currentAge: 30, retireAge: 65 },
      },
    ];
  });

  // Save recents to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('finratecalc_recent', JSON.stringify(recentCalculations));
    } catch (e) {
      // ignore
    }
  }, [recentCalculations]);

  // Handle clicking market rate in the top bar
  const handleApplyMarketRate = (rate: MarketRate) => {
    if (rate.targetCalc) {
      setActiveCalc(rate.targetCalc);
    }
  };

  // Open formatted PDF report
  const handleOpenReport = (title?: string, data?: any) => {
    if (title && data) {
      setReportTitle(title);
      setReportData(data);
    } else {
      // Default report from mortgage
      const defaultCalc = calculateMortgage({
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
        extraPaymentOneTimeMonth: 1,
        startDate: '2026-11',
      });
      setReportTitle('Mortgage Loan & Escrow Report');
      setReportData({
        type: 'mortgage',
        inputs: { homePrice: 400000, loanTermYears: 30, interestRate: 6.5 },
        result: defaultCalc,
      });
    }
    setIsReportOpen(true);
  };

  const handleSelectRecent = (item: RecentCalculation) => {
    setActiveCalc(item.type);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-emerald-100 selection:text-emerald-900">
      {/* Header */}
      <Header
        activeCalc={activeCalc}
        onSelectCalc={(type) => setActiveCalc(type)}
        onOpenReport={() => handleOpenReport()}
        onOpenCompare={() => setIsCompareOpen(true)}
        onApplyMarketRate={handleApplyMarketRate}
        recentCalculations={recentCalculations}
        onSelectRecent={handleSelectRecent}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {activeCalc === 'mortgage' && (
          <MortgageCalculator onOpenReport={handleOpenReport} />
        )}

        {activeCalc === 'take-home' && (
          <TakeHomePayCalculator onOpenReport={handleOpenReport} />
        )}

        {activeCalc === '401k' && (
          <Retirement401kCalculator onOpenReport={handleOpenReport} />
        )}

        {activeCalc === 'auto-loan' && (
          <AutoLoanCalculator onOpenReport={handleOpenReport} />
        )}

        {activeCalc === 'personal-loan' && (
          <PersonalLoanCalculator onOpenReport={handleOpenReport} />
        )}

        {activeCalc === 'compound' && (
          <CompoundInterestCalculator onOpenReport={handleOpenReport} />
        )}

        {activeCalc === 'extra-payments' && (
          <ExtraPaymentsCalculator onOpenReport={handleOpenReport} />
        )}

        {activeCalc === 'inflation' && (
          <InflationCalculator onOpenReport={handleOpenReport} />
        )}

        {activeCalc === 'directory' && (
          <AllCalculatorsDirectory onSelectCalc={(type) => setActiveCalc(type)} />
        )}
      </main>

      {/* Footer */}
      <Footer onSelectCalc={(type) => setActiveCalc(type)} />

      {/* Modals */}
      <ScenarioComparisonModal
        isOpen={isCompareOpen}
        onClose={() => setIsCompareOpen(false)}
      />

      <ReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        reportTitle={reportTitle}
        reportData={reportData}
      />
    </div>
  );
}
