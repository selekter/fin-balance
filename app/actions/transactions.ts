"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import type { TransactionRecord } from "@/lib/transactions";

type CreateTransactionResult =
  | { success: true; transaction: TransactionRecord }
  | { success: false; error: string };

export async function createTransaction(
  formData: FormData,
): Promise<CreateTransactionResult> {
  const rawType = formData.get("type");
  const title = String(formData.get("title") ?? "").trim();
  const amount = String(formData.get("amount") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim();
  const date = String(formData.get("date") ?? "");

  if (rawType !== "income" && rawType !== "expense") {
    return { success: false, error: "กรุณาเลือกประเภทรายการ" };
  }
  if (!title || title.length > 120) {
    return { success: false, error: "กรุณากรอกชื่อรายการไม่เกิน 120 ตัวอักษร" };
  }
  if (!/^(?:\d+)(?:\.\d{1,2})?$/.test(amount) || Number(amount) <= 0) {
    return { success: false, error: "กรุณากรอกจำนวนเงินที่ถูกต้อง (ไม่เกิน 2 ตำแหน่ง)" };
  }
  if (!category || category.length > 60) {
    return { success: false, error: "กรุณาเลือกหมวดหมู่" };
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return { success: false, error: "กรุณาเลือกวันที่ให้ถูกต้อง" };
  }

  const transactionDate = new Date(`${date}T00:00:00.000Z`);
  if (
    Number.isNaN(transactionDate.getTime()) ||
    transactionDate.toISOString().slice(0, 10) !== date
  ) {
    return { success: false, error: "วันที่ไม่ถูกต้อง" };
  }

  const transaction = await prisma.transaction.create({
    data: {
      type: rawType === "income" ? "INCOME" : "EXPENSE",
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
