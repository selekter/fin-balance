"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { transactionSchema } from "@/lib/schemas/transaction";
import type { TransactionRecord } from "@/lib/transactions";

type CreateTransactionResult =
  | { success: true; transaction: TransactionRecord }
  | { success: false; error: string };

export async function getTransactionDashboardData() {
  const now = new Date();
  const today = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
  const weekStart = new Date(today);
  weekStart.setUTCDate(today.getUTCDate() - 6);
  const monthsStart = new Date(Date.UTC(now.getFullYear(), now.getMonth() - 5, 1));

  const [recentTransactions, dailyTransactions, monthlyTransactions] = await Promise.all([
    prisma.transaction.findMany({
      orderBy: [{ date: "desc" }, { createdAt: "desc" }],
      take: 10,
      select: { id: true, type: true, title: true, category: true, amount: true, date: true },
    }),
    prisma.transaction.findMany({
      where: { date: { gte: weekStart, lt: new Date(today.getTime() + 86400000) } },
      orderBy: [{ date: "desc" }, { createdAt: "desc" }],
      select: { id: true, type: true, title: true, category: true, amount: true, date: true },
    }),
    prisma.transaction.findMany({
      where: {
        date: {
          gte: monthsStart,
          lt: new Date(Date.UTC(now.getFullYear(), now.getMonth() + 1, 1)),
        },
      },
      select: { type: true, amount: true, date: true },
    }),
  ]);

  const monthTotals = monthlyTransactions.reduce((totals, transaction) => {
    const key = `${transaction.date.getUTCFullYear()}-${String(transaction.date.getUTCMonth() + 1).padStart(2, "0")}`;
    const total = totals.get(key) ?? { income: 0, expense: 0, incomeCount: 0, expenseCount: 0 };
    if (transaction.type === "INCOME") {
      total.income += Number(transaction.amount.toString());
      total.incomeCount += 1;
    } else {
      total.expense += Number(transaction.amount.toString());
      total.expenseCount += 1;
    }
    totals.set(key, total);
    return totals;
  }, new Map<string, { income: number; expense: number; incomeCount: number; expenseCount: number }>());

  const days = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(weekStart);
    date.setUTCDate(weekStart.getUTCDate() + index);
    const key = date.toISOString().slice(0, 10);
    const transactions = dailyTransactions
      .filter((transaction) => transaction.date.toISOString().slice(0, 10) === key)
      .map((transaction) => ({
        id: transaction.id,
        type: transaction.type === "INCOME" ? ("income" as const) : ("expense" as const),
        title: transaction.title,
        category: transaction.category,
        amount: transaction.amount.toString(),
      }));
    const totals = transactions
      .reduce((result, transaction) => {
        result[transaction.type] += Number(transaction.amount);
        return result;
      }, { income: 0, expense: 0 });
    return { date: key, ...totals, transactions };
  });

  const months = Array.from({ length: 6 }, (_, index) => {
    const date = new Date(Date.UTC(now.getFullYear(), now.getMonth() - 5 + index, 1));
    const key = `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`;
    return {
      date: key,
      ...(monthTotals.get(key) ?? { income: 0, expense: 0, incomeCount: 0, expenseCount: 0 }),
    };
  });
  const currentMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const currentMonth = monthTotals.get(currentMonthKey) ?? {
    income: 0,
    expense: 0,
    incomeCount: 0,
    expenseCount: 0,
  };

  return {
    transactions: recentTransactions.map((transaction) => ({
      ...transaction,
      type: transaction.type === "INCOME" ? ("income" as const) : ("expense" as const),
      amount: transaction.amount.toString(),
      date: transaction.date.toISOString().slice(0, 10),
    })),
    days,
    months,
    currentMonth,
  };
}

export async function createTransaction(
  formData: FormData,
): Promise<CreateTransactionResult> {
  const result = transactionSchema.safeParse({
    type: formData.get("type"),
    title: formData.get("title"),
    amount: formData.get("amount"),
    category: formData.get("category"),
    date: formData.get("date"),
  });

  if (!result.success) {
    return {
      success: false,
      error: result.error.issues[0]?.message ?? "ข้อมูลที่ส่งมาไม่ถูกต้อง",
    };
  }

  const { type, title, amount, category, date } = result.data;
  const transactionDate = new Date(`${date}T00:00:00.000Z`);

  const transaction = await prisma.transaction.create({
    data: {
      type: type === "income" ? "INCOME" : "EXPENSE",
      title,
      amount,
      category,
      date: transactionDate,
    },
    select: {
      id: true,
      type: true,
      title: true,
      category: true,
      amount: true,
      date: true,
    },
  });

  revalidatePath("/");

  return {
    success: true,
    transaction: {
      ...transaction,
      type: transaction.type === "INCOME" ? "income" : "expense",
      amount: transaction.amount.toString(),
      date: transaction.date.toISOString().slice(0, 10),
    },
  };
}
