import { auth } from "@/lib/auth";
import { Wallet } from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";

export default async function Header() {
  const session = await auth.api.getSession({ headers: await headers() });
  return (
    <>
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur-md transition-colors">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex w-full items-center justify-between">
            <Link href="/" className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-tr from-emerald-500 to-teal-400 text-white shadow-md shadow-emerald-500/20">
                <Wallet className="h-5 w-5" />
              </div>
              <div>
                <h1>SmartMoney</h1>
                <p className="hidden text-xs text-slate-400 sm:block">
                  ระบบบันทึกรายรับ-รายจ่าย ประจำวัน
                </p>
              </div>
            </Link>
            <nav className="flex items-center gap-2">
              {session ? (
                <div className="max-w-48 text-right sm:max-w-none">
                  <p className="truncate text-sm font-semibold text-slate-700">
                    ยินดีต้อนรับ:{" "}
                    <span className="font-bold text-blue-500">
                      {session.user.name || "ผู้ใช้งาน"}
                    </span>
                  </p>
                </div>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
                  >
                    เข้าสู่ระบบ
                  </Link>
                  <Link
                    href="/register"
                    className="rounded-lg bg-emerald-500 px-3 py-2 text-sm font-medium text-white transition hover:bg-emerald-600"
                  >
                    สมัครสมาชิก
                  </Link>
                </>
              )}
            </nav>
          </div>
        </div>
      </header>
    </>
  );
}
