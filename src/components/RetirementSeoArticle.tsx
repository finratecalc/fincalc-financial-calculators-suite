import React from 'react';

export const RetirementSeoArticle: React.FC = () => {
  return (
    <section
      id="retirement-planner-guide"
      aria-labelledby="retirement-guide-heading"
      className="mt-14 pt-10 border-t border-slate-200 text-slate-800 max-w-5xl mx-auto px-4"
    >
      <div className="mb-6">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          US 401(k) Retirement Guide • 2026 Edition
        </span>
        <h2
          id="retirement-guide-heading"
          className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-3"
        >
          How to Maximize Your 401(k) Nest Egg, Employer Match &amp; Retirement Income
        </h2>
      </div>

      {/* Key Takeaways */}
      <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 mb-8">
        <h3 className="text-sm font-bold text-emerald-950 uppercase tracking-wide mb-2">
          Key Takeaways at a Glance
        </h3>
        <ul className="space-y-2 text-xs sm:text-sm text-emerald-900">
          <li>
            • <strong>Capture 100% of Employer Match First:</strong> An employer 401(k) match is an
            immediate, guaranteed 50% to 100% return before market growth even begins.
          </li>
          <li>
            • <strong>IRS Elective Deferral Cap ($23,500):</strong> Employer matching dollars do
            not count toward your personal $23,500 annual employee deferral limit.
          </li>
          <li>
            • <strong>The 4% Safe Withdrawal Rule:</strong> Every $1,000,000 saved supports roughly
            $40,000/year ($3,333/month) in inflation-adjusted retirement withdrawals.
          </li>
        </ul>
      </div>

      <div className="space-y-6 text-sm text-slate-700 leading-relaxed">
        <div id="how-planner-works" className="space-y-2">
          <h3 className="text-xl font-bold text-slate-900">
            How the 401(k) Compounding &amp; Salary Growth Formula Works
          </h3>
          <p>
            This planner models annual salary increases, your percentage contribution, your
            employer&apos;s matching formula, and compound market returns each year until your
            target retirement age. Because contributions scale alongside merit raises, maintaining a
            consistent savings percentage accelerates wealth significantly in your 40s and 50s.
          </p>
        </div>

        <div id="irs-limits" className="space-y-2">
          <h3 className="text-xl font-bold text-slate-900">
            IRS 401(k) Contribution Caps &amp; Catch-Up Rules
          </h3>
          <p>
            Under IRS guidelines, employees can defer up to <strong>$23,500</strong> per year in
            pre-tax Traditional or after-tax Roth 401(k) contributions, with additional catch-up
            contributions available starting at age 50. Total combined employee plus employer
            contributions follow the higher IRS Section 415(c) plan limit.
          </p>
        </div>

        <div id="traditional-vs-roth" className="space-y-2">
          <h3 className="text-xl font-bold text-slate-900">
            Traditional 401(k) vs. Roth 401(k)
          </h3>
          <p>
            Traditional 401(k) deferrals lower your taxable income today and grow tax-deferred until
            withdrawal, making them attractive during peak earning years. Roth 401(k) contributions
            are taxed upfront, allowing qualified withdrawals and all investment earnings in
            retirement to remain 100% federal tax-free.
          </p>
        </div>

        <div id="four-percent-rule" className="space-y-2">
          <h3 className="text-xl font-bold text-slate-900">
            Understanding the 4% Safe Withdrawal Rule
          </h3>
          <p>
            Derived from the Trinity Study, the 4% rule estimates how much you can withdraw in year
            one of retirement (and adjust for CPI inflation each year after) from a diversified
            stock-and-bond portfolio with a high probability of lasting 30+ years.
          </p>
        </div>

        <div id="retirement-faq" className="space-y-3 pt-2">
          <h3 className="text-xl font-bold text-slate-900">Frequently Asked Questions (FAQ)</h3>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <h4 className="font-bold text-slate-900 text-sm">
              Does employer matching count toward my $23,500 401(k) limit?
            </h4>
            <p className="mt-1 text-xs text-slate-600">
              No. Your $23,500 cap applies only to your own elective salary deferrals. Employer
              matching and profit-sharing contributions sit on top of your personal deferral limit.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <h4 className="font-bold text-slate-900 text-sm">
              What rate of return should I use for a long-term 401(k) forecast?
            </h4>
            <p className="mt-1 text-xs text-slate-600">
              Many US retirement planners model 7% to 8% nominal returns (or 5% to 7.5% real
              inflation-adjusted returns) for diversified equity-heavy portfolios over 20+ years.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RetirementSeoArticle;
