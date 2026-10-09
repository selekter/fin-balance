"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { transactionSchema } from "@/lib/schemas/transaction";
import type { TransactionRecord } from "@/lib/transactions";

type CreateTransactionResult =
  | { success: true; transaction: TransactionRecord }
  | { success: false; error: string };

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
