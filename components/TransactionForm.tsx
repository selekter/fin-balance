"use client";

import { useState } from "react";
import type { SubmitEvent } from "react";
import { useRouter } from "next/navigation";
import { ArrowDownLeft, ArrowUpRight, Plus, ReceiptText } from "lucide-react";
import { cn } from "@/lib/utils";
import { createTransaction } from "@/app/actions/transactions";
import type { TransactionRecord, TransactionType } from "@/lib/transactions";
import { useSession } from "@/lib/auth-client";

const categories: Record<TransactionType, string[]> = {
  income: ["เงินเดือน", "งานเสริม", "การลงทุน", "อื่น ๆ"],
  expense: ["อาหาร", "เดินทาง", "ช้อปปิ้ง", "บิลและค่าสาธารณูปโภค", "อื่น ๆ"],
};

export default function TransactionForm({
  initialTransactions,
}: {
  initialTransactions: TransactionRecord[];
}) {
  const router = useRouter();
  const [type, setType] = useState<TransactionType>("expense");
  const [transactions, setTransactions] = useState(initialTransactions);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { data: session, isPending } = useSession();

  const getTodayString = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  if (isPending) {
    return <p className="mt-8 text-center">Loading...</p>;
  }

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setError(null);
    setIsSaving(true);

    try {
      const result = await createTransaction(new FormData(form));
      if (!result.success) {
        setError(result.error);
        return;
      }

      setTransactions((current) =>
        [result.transaction, ...current].slice(0, 10),
      );
      form.reset();
      router.refresh();
    } catch {
      setError("บันทึกรายการไม่สำเร็จ กรุณาลองอีกครั้ง");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <section className="flex flex-col gap-6 md:flex-row">
      {session?.user && (
        <>
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6 md:min-w-md">
            <div className="mb-5">
              <h2 className="text-lg font-semibold text-slate-800">
                เพิ่มรายการ
              </h2>
              <p className="mt-1 text-sm text-slate-400">
                บันทึกรายรับหรือรายจ่ายของคุณ
              </p>
            </div>

            <div className="mb-5 grid grid-cols-2 rounded-xl bg-slate-100 p-1">
              <button
                type="button"
                onClick={() => setType("expense")}
                aria-pressed={type === "expense"}
                className={cn(
                  "flex items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition hover:cursor-pointer",
                  type === "expense"
                    ? "bg-white text-rose-600 shadow-sm"
                    : "text-slate-500 hover:text-slate-700",
                )}
              >
                <ArrowUpRight className="h-4 w-4" /> รายจ่าย
              </button>
              <button
                type="button"
                onClick={() => setType("income")}
                aria-pressed={type === "income"}
                className={cn(
                  "flex cursor-pointer items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition",
                  type === "income"
                    ? "bg-white text-emerald-600 shadow-sm"
                    : "text-slate-500 hover:text-slate-700",
                )}
              >
                <ArrowDownLeft className="h-4 w-4" /> รายรับ
              </button>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <input type="hidden" name="type" value={type} />
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-slate-600">
                  รายการ
                </span>
                <input
                  name="title"
                  required
                  maxLength={120}
                  placeholder={
                    type === "income" ? "เช่น เงินเดือน" : "เช่น ค่าอาหาร"
                  }
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm transition outline-none placeholder:text-slate-300 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/10"
                />
              </label>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-1.5 block text-sm font-medium text-slate-600">
                    จำนวนเงิน (บาท)
                  </span>
                  <input
                    name="amount"
                    type="number"
                    min="0.01"
                    max="9999999999.99"
                    step="0.01"
                    required
                    placeholder="0.00"
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm transition outline-none placeholder:text-slate-300 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/10"
                  />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-sm font-medium text-slate-600">
                    หมวดหมู่
                  </span>
                  <select
                    key={type}
                    name="category"
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-700 transition outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/10"
                  >
                    {categories[type].map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-slate-600">
                  วันที่
                </span>
                <input
                  name="date"
                  type="date"
                  required
                  defaultValue={getTodayString()}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-700 transition outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/10"
                />
              </label>

              {error && (
                <p role="alert" className="text-sm font-medium text-rose-600">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={isSaving}
                className={cn(
                  "flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-white shadow-sm transition disabled:opacity-20",
                  type === "income"
                    ? "bg-emerald-500 hover:bg-emerald-600"
                    : "bg-rose-500 hover:bg-rose-600",
                )}
              >
                <Plus className="h-4 w-4" />
                {isSaving
                  ? "กำลังบันทึก..."
                  : `บันทึก${type === "income" ? "รายรับ" : "รายจ่าย"}`}
              </button>
            </form>
          </div>
        </>
      )}

      <div className="flex-1 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-800">
              รายการล่าสุด
            </h2>
            <p className="mt-1 text-sm text-slate-400">รายการที่คุณบันทึกไว้</p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
            <ReceiptText className="h-5 w-5" />
          </div>
        </div>

        {transactions.length === 0 ? (
          <div className="flex min-h-52 flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 px-4 text-center">
            <ReceiptText className="mb-3 h-8 w-8 text-slate-300" />
            <p className="text-sm font-medium text-slate-500">ยังไม่มีรายการ</p>
            <p className="mt-1 text-xs text-slate-400">
              รายการที่บันทึกจะแสดงที่นี่
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-slate-100">
            {transactions.map((transaction) => (
              <li
                key={transaction.id}
                className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div
                    className={cn(
                      "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
                      transaction.type === "income"
                        ? "bg-emerald-500/10 text-emerald-600"
                        : "bg-rose-500/10 text-rose-600",
                    )}
                  >
                    {transaction.type === "income" ? (
                      <ArrowDownLeft className="h-4 w-4" />
                    ) : (
                      <ArrowUpRight className="h-4 w-4" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm text-slate-700">
                      {transaction.title}
                    </p>
                    <p className="text-sm text-slate-400">
                      {transaction.category} · {transaction.date}
                    </p>
                  </div>
                </div>
                <span
                  className={cn(
                    "shrink-0 text-sm",
                    transaction.type === "income"
                      ? "text-emerald-600"
                      : "text-rose-600",
                  )}
                >
                  {transaction.type === "income" ? "+" : "−"}฿
                  {Number(transaction.amount).toLocaleString("th-TH", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}{" "}
                  บาท
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
