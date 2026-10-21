import Header from "@/components/Header";
import SummaryCards from "@/components/SummaryCards";
import TransactionForm from "@/components/TransactionForm";
import DailySummary from "@/components/DailySummary";
import {
  getTransactionDashboardData,
  // getTransactionDashboardDataV2,
} from "@/app/actions/transactions";
import { TrendingDown, TrendingUp } from "lucide-react";

const currency = (amount: number) =>
  `\u0e3f${amount.toLocaleString("th-TH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const monthLabel = (month: string) =>
  new Intl.DateTimeFormat("th-TH", {
    month: "short",
    year: "2-digit",
    timeZone: "UTC",
  }).format(new Date(`${month}-01T00:00:00.000Z`));

export default async function App() {
  const { transactions, days, months, currentMonth } =
    await getTransactionDashboardData();
  // const { monthlyAggregations } = await getTransactionDashboardDataV2();

  // console.log(monthlyAggregations);

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 font-sans text-slate-800 transition-colors duration-200">
      <Header />
      {/* Main Content */}
      <main className="mx-auto w-full max-w-7xl grow px-4 py-8 sm:px-6 lg:px-8">
        <SummaryCards
          incomeAmount={currentMonth.income}
          incomeCount={currentMonth.incomeCount}
          expenseAmount={currentMonth.expense}
          expenseCount={currentMonth.expenseCount}
        />
        <section className="mb-8 grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
          <DailySummary days={days} />
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-5">
              <h2 className="text-lg font-semibold text-slate-800">
                สรุปรายเดือน
              </h2>
              <p className="mt-1 text-sm text-slate-400">
                ยอดรับจ่ายย้อนหลัง 6 เดือน
              </p>
            </div>
            <div className="divide-y divide-slate-100">
              {months
                .slice()
                .reverse()
                .map((month) => (
                  <div
                    key={month.date}
                    className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
                  >
                    <div className="min-w-20">
                      <p className="text-sm font-medium text-slate-700">
                        {monthLabel(month.date)}
                      </p>
                      <p
                        className={`mt-0.5 text-sm font-medium ${month.income - month.expense >= 0 ? "text-emerald-600" : "text-rose-500"}`}
                      >
                        สุทธิ {currency(month.income - month.expense)}
                      </p>
                    </div>
                    <div className="space-y-1 text-right text-sm">
                      <p className="flex items-center justify-end gap-1 text-emerald-600">
                        <TrendingUp className="h-3 w-3" />
                        {currency(month.income)}
                      </p>
                      <p className="flex items-center justify-end gap-1 text-rose-500">
                        <TrendingDown className="h-3 w-3" />
                        {currency(month.expense)}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </section>
        <TransactionForm initialTransactions={transactions} />
      </main>
    </div>
  );
}
