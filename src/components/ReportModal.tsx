import React from 'react';
import { X, Printer, ShieldCheck, Download, FileSpreadsheet } from 'lucide-react';
import { formatCurrency, formatPercent } from '../utils/calculators';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  reportTitle?: string;
  reportData?: any;
}

export const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  reportTitle = 'US Financial Analysis Report',
  reportData,
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const currentDate = new Date().toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const mResult = reportData?.result;
  const mInputs = reportData?.inputs;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto print:p-0 print:bg-white print:static">
      <div className="bg-white rounded-2xl max-w-4xl w-full p-6 sm:p-10 shadow-2xl border border-slate-200 space-y-6 animate-in fade-in zoom-in-95 duration-150 print:border-none print:shadow-none print:p-0">
        {/* Modal Controls (Hidden in Print) */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 no-print">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <h2 className="text-lg font-bold text-slate-900">Executive Report Preview</h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save as PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* PRINTABLE DOCUMENT BODY */}
        <div className="space-y-6 text-slate-900">
          {/* Header */}
          <div className="flex items-start justify-between border-b-2 border-slate-900 pb-5">
            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-slate-900">
                  FinRate<span className="text-emerald-600">Calc</span>
                </span>
                <span className="text-xs font-bold text-slate-400">.com</span>
              </div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                US Financial Tools &amp; Lending Verification
              </p>
            </div>

            <div className="text-right text-xs">
              <p className="font-bold text-slate-900">{reportTitle}</p>
              <p className="text-slate-500">Prepared: {currentDate}</p>
              <p className="text-slate-400 text-[10px]">Reference: FRC-US-{Date.now().toString().slice(-6)}</p>
            </div>
          </div>

          {/* Key Summary Cards */}
          {mResult && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-slate-50 p-5 rounded-xl border border-slate-200">
              <div>
                <p className="text-[11px] font-semibold text-slate-500 uppercase">
                  {reportData?.type === 'mortgage' ? 'Monthly Payment' : 'Estimated Value'}
                </p>
                <p className="text-2xl font-extrabold text-slate-900 font-mono mt-1">
                  {formatCurrency(mResult.totalMonthlyPayment || mResult.netPerPaycheck || mResult.totalBalanceAtRetirement || mResult.monthlyPayment)}
                </p>
              </div>

              <div>
                <p className="text-[11px] font-semibold text-slate-500 uppercase">
                  {reportData?.type === 'mortgage' ? 'Principal Loan' : 'Principal / Baseline'}
                </p>
                <p className="text-lg font-bold text-slate-800 font-mono mt-1">
                  {formatCurrency(mResult.loanAmount || mInputs?.grossSalary || mInputs?.vehiclePrice || mInputs?.loanAmount, false)}
                </p>
              </div>

              <div>
                <p className="text-[11px] font-semibold text-slate-500 uppercase">Total Interest</p>
                <p className="text-lg font-bold text-rose-600 font-mono mt-1">
                  {formatCurrency(mResult.totalInterestActual || mResult.totalInterest || mResult.totalInterestEarned, false)}
                </p>
              </div>

              <div>
                <p className="text-[11px] font-semibold text-slate-500 uppercase">Payoff Horizon</p>
                <p className="text-lg font-bold text-slate-800 mt-1">
                  {mResult.actualPayoffMonths ? `${(mResult.actualPayoffMonths / 12).toFixed(1)} Yrs` : `${mInputs?.loanTermYears || mInputs?.years || 30} Yrs`}
                </p>
              </div>
            </div>
          )}

          {/* Mortgage Amortization Sample if mortgage */}
          {mResult?.amortizationAnnual && (
            <div className="space-y-3 pt-2">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Annual Amortization Projection (First 10 Years)
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border border-slate-200">
                  <thead className="bg-slate-100 text-slate-600 font-semibold border-b border-slate-200">
                    <tr>
                      <th className="py-2 px-3">Year</th>
                      <th className="py-2 px-3 text-right">Principal</th>
                      <th className="py-2 px-3 text-right">Interest</th>
                      <th className="py-2 px-3 text-right">Total Paid</th>
                      <th className="py-2 px-3 text-right">Remaining Balance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono tabular-nums">
                    {mResult.amortizationAnnual.slice(0, 10).map((row: any) => (
                      <tr key={row.year}>
                        <td className="py-1.5 px-3 font-semibold text-slate-900">{row.year}</td>
                        <td className="py-1.5 px-3 text-right">{formatCurrency(row.principal, false)}</td>
                        <td className="py-1.5 px-3 text-right text-rose-600">{formatCurrency(row.interest, false)}</td>
                        <td className="py-1.5 px-3 text-right">{formatCurrency(row.totalPaid, false)}</td>
                        <td className="py-1.5 px-3 text-right font-bold text-slate-900">{formatCurrency(row.endingBalance, false)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Legal / Regulatory Disclaimers for US Market */}
          <div className="pt-6 border-t border-slate-200 text-[10px] text-slate-500 space-y-1.5 leading-relaxed">
            <p className="font-bold text-slate-700">Important Financial &amp; Legal Disclosures:</p>
            <p>
              This report is generated by FinRateCalc.com for informational and preliminary estimation purposes only. It complies with standard US loan formulas under the Truth in Lending Act (TILA / Regulation Z) and Freddie Mac / Fannie Mae underwriting conventions.
            </p>
            <p>
              Actual mortgage approval, annual percentage rate (APR), private mortgage insurance (PMI) quotes, and property tax assessments are subject to independent lender qualification, credit score (FICO), property appraisal, and county tax collector determinations. Not an offer to enter into a loan agreement.
            </p>
          </div>
        </div>

        {/* Modal Bottom Footer (No Print) */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 no-print">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            Close
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Print Report</span>
          </button>
        </div>
      </div>
    </div>
  );
};
