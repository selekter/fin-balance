import { cn } from "@/lib/utils";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Info,
  TrendingDown,
  TrendingUp,
  Wallet,
} from "lucide-react";

interface SummaryCardsProps {
  incomeAmount: number;
  incomeCount: number;
  expenseAmount: number;
  expenseCount: number;
}

const formatAmount = (amount: number) =>
  amount.toLocaleString("th-TH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

export default function SummaryCards({
  incomeAmount,
  incomeCount,
  expenseAmount,
  expenseCount,
}: SummaryCardsProps) {
  const netAmount = incomeAmount - expenseAmount;

  return (
    <div className="mb-8 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
      {/* Net Balance */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition-all">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs font-medium text-slate-400">
            ยอดคงเหลือสุทธิ
          </span>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-500">
            <Wallet className="h-4 w-4" />
          </div>
        </div>
        <div
          className={cn(
            "mb-1 text-2xl font-bold tracking-tight",
            netAmount < 0 ? "text-rose-500" : "text-slate-800",
          )}
        >
          ฿{formatAmount(netAmount)}
        </div>
        <div className="flex items-center gap-1 text-[11px] text-slate-400">
          <Info className="h-3 w-3 text-blue-500" />
          <span>คำนวณจาก รายรับ - รายจ่าย</span>
        </div>
        <div className="absolute right-0 bottom-0 left-0 h-1 bg-linear-to-r from-blue-500 to-indigo-500" />
      </div>

      {/* Income */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition-all">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs font-medium text-slate-400">รายรับรวม</span>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500">
            <ArrowDownLeft className="h-4 w-4" />
          </div>
        </div>
        <div className="mb-1 text-2xl font-bold tracking-tight text-emerald-500">
          ฿{formatAmount(incomeAmount)}
        </div>
        <div className="flex items-center gap-1 text-[11px] font-medium text-emerald-500/80">
          <TrendingUp className="h-3 w-3" />
          <span>{incomeCount} รายการบันทึก</span>
        </div>
        <div className="absolute right-0 bottom-0 left-0 h-1 bg-emerald-500" />
      </div>

      {/* Expense */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition-all">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs font-medium text-slate-400">รายจ่ายรวม</span>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-500/10 text-rose-500">
            <ArrowUpRight className="h-4 w-4" />
          </div>
        </div>
        <div className="mb-1 text-2xl font-bold tracking-tight text-rose-500">
          ฿{formatAmount(expenseAmount)}
        </div>
        <div className="flex items-center gap-1 text-[11px] font-medium text-rose-500/80">
          <TrendingDown className="h-3 w-3" />
          <span>{expenseCount} รายการบันทึก</span>
        </div>
        <div className="absolute right-0 bottom-0 left-0 h-1 bg-rose-500" />
      </div>
    </div>
  );
}
