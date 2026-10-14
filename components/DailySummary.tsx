"use client";

import { useState } from "react";
import { CalendarDays } from "lucide-react";
import { cn } from "@/lib/utils";

type DailySummaryDay = {
  date: string;
  income: number;
  expense: number;
  transactions: {
    id: string;
    type: "income" | "expense";
    title: string;
    category: string;
    amount: string;
  }[];
};

const currency = (amount: number) =>
  `\u0e3f${amount.toLocaleString("th-TH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const formatDate = (date: string, options: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat("th-TH", { ...options, timeZone: "UTC" }).format(
    new Date(`${date}T00:00:00.000Z`),
  );

export default function DailySummary({ days }: { days: DailySummaryDay[] }) {
  const [selectedDate, setSelectedDate] = useState(days.at(-1)?.date ?? "");
  const selectedDay = days.find((day) => day.date === selectedDate);

  return (
    <div className="overflow-auto rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-800">สรุปรายวัน</h2>
          <p className="mt-1 text-sm text-slate-400">
            เลือกวันที่เพื่อดูรายการรับจ่าย
          </p>
        </div>
        <CalendarDays className="h-5 w-5 text-slate-400" />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {days
          .slice()
          .reverse()
          .map((day) => (
            <button
              key={day.date}
              type="button"
              aria-pressed={selectedDate === day.date}
              onClick={() => setSelectedDate(day.date)}
              className={cn(
                "min-w-20 cursor-pointer rounded-xl border px-3 py-2 text-left transition",
                selectedDate === day.date
                  ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                  : "border-slate-200 bg-white text-slate-600 hover:border-emerald-300 hover:bg-slate-50",
              )}
            >
              <span className="block text-xs font-semibold">
                {formatDate(day.date, { weekday: "short" })}
              </span>
              <span className="mt-0.5 block text-xs">
                {formatDate(day.date, { day: "numeric", month: "short" })}
              </span>
            </button>
          ))}
      </div>

      {selectedDay && (
        <div className="mt-4">
          <div className="grid grid-cols-3 gap-2 rounded-xl bg-slate-50 p-3 text-center">
            <div>
              <p className="text-[11px] text-slate-400">รายรับ</p>
              <p className="mt-1 text-xs font-semibold text-emerald-600 sm:text-sm">
                {currency(selectedDay.income)}
              </p>
            </div>
            <div>
              <p className="text-[11px] text-slate-400">รายจ่าย</p>
              <p className="mt-1 text-xs font-semibold text-rose-500 sm:text-sm">
                {currency(selectedDay.expense)}
              </p>
            </div>
            <div>
              <p className="text-[11px] text-slate-400">สุทธิ</p>
              <p
                className={cn(
                  "mt-1 text-xs font-semibold sm:text-sm",
                  selectedDay.income - selectedDay.expense >= 0
                    ? "text-blue-600"
                    : "text-rose-600",
                )}
              >
                {currency(selectedDay.income - selectedDay.expense)}
              </p>
            </div>
          </div>

          {selectedDay.transactions.length === 0 ? (
            <p className="mt-4 rounded-xl border border-dashed border-slate-200 px-3 py-8 text-center text-sm text-slate-400">
              ไม่มีรายการในวันนี้
            </p>
          ) : (
            <ul className="mt-3 divide-y divide-slate-100">
              {selectedDay.transactions.map((transaction) => (
                <li
                  key={transaction.id}
                  className="flex items-center justify-between gap-3 py-3"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-slate-700">
                      {transaction.title}
                    </p>
                    <p className="truncate text-xs text-slate-400">
                      {transaction.category}
                    </p>
                  </div>
                  <span
                    className={cn(
                      "shrink-0 text-sm font-semibold",
                      transaction.type === "income"
                        ? "text-emerald-600"
                        : "text-rose-600",
                    )}
                  >
                    {transaction.type === "income" ? "+" : "−"}
                    {currency(Number(transaction.amount))}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
