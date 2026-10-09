import { Wallet } from "lucide-react";

export default function Header() {
  return (
    <>
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur-md transition-colors">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-tr from-emerald-500 to-teal-400 text-white shadow-md shadow-emerald-500/20">
              <Wallet className="h-5 w-5" />
            </div>
            <div>
              <h1>SmartMoney</h1>
              <p className="hidden text-xs text-slate-400 sm:block">
                ระบบบันทึกรายรับ-รายจ่าย ประจำวัน
              </p>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
