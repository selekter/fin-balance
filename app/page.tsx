import Header from "@/components/Header";
import SummaryCards from "@/components/SummaryCards";
import TransactionForm from "@/components/TransactionForm";
import prisma from "@/lib/prisma";

export default async function App() {
  const [recentTransactions, summaries] = await Promise.all([
    prisma.transaction.findMany({
      orderBy: [{ date: "desc" }, { createdAt: "desc" }],
      take: 10,
      select: {
        id: true,
        type: true,
        title: true,
        category: true,
        amount: true,
        date: true,
      },
    }),
    prisma.transaction.groupBy({
      by: ["type"],
      _sum: { amount: true },
      _count: { _all: true },
    }),
  ]);

  const income = summaries.find((summary) => summary.type === "INCOME");
  const expense = summaries.find((summary) => summary.type === "EXPENSE");
  const incomeAmount = Number(income?._sum.amount?.toString() ?? 0);
  const expenseAmount = Number(expense?._sum.amount?.toString() ?? 0);
  const initialTransactions = recentTransactions.map((transaction) => ({
    ...transaction,
    type: transaction.type === "INCOME" ? ("income" as const) : ("expense" as const),
    amount: transaction.amount.toString(),
    date: transaction.date.toISOString().slice(0, 10),
  }));

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 font-sans text-slate-800 transition-colors duration-200">
      <Header />
      {/* Main Content */}
      <main className="mx-auto w-full max-w-7xl grow px-4 py-8 sm:px-6 lg:px-8">
        <SummaryCards
          incomeAmount={incomeAmount}
          incomeCount={income?._count._all ?? 0}
          expenseAmount={expenseAmount}
          expenseCount={expense?._count._all ?? 0}
        />
        <TransactionForm initialTransactions={initialTransactions} />
      </main>
    </div>
  );
}
