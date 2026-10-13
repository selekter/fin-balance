"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, LockKeyhole, Wallet } from "lucide-react";
import { signIn, signUp } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

type AuthMode = "login" | "register";

const inputClassName =
  "w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-300 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/10";

export default function AuthForm({ mode }: { mode: AuthMode }) {
  const router = useRouter();
  const isRegister = mode === "register";
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");

    try {
      const result = isRegister
        ? await signUp.email({
            name: String(formData.get("name") ?? "").trim(),
            email,
            password,
          })
        : await signIn.email({ email, password });

      if (result.error) {
        setError(result.error.message || "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
        return;
      }

      router.push("/");
    } catch {
      setError("ไม่สามารถเชื่อมต่อได้ กรุณาลองใหม่อีกครั้ง");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="flex grow items-center justify-center px-4 py-10 sm:px-6">
      <section className="w-full max-w-md rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xl shadow-slate-200/50 sm:p-8">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-800"
        >
          <ArrowLeft className="h-4 w-4" /> กลับหน้าหลัก
        </Link>

        <div className="mb-7 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600">
            {isRegister ? (
              <Wallet className="h-6 w-6" />
            ) : (
              <LockKeyhole className="h-6 w-6" />
            )}
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-800">
              {isRegister ? "สร้างบัญชี SmartMoney" : "เข้าสู่ระบบ"}
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              {isRegister
                ? "เริ่มจัดการรายรับและรายจ่ายของคุณ"
                : "เข้าสู่บัญชีเพื่อจัดการการเงินของคุณ"}
            </p>
          </div>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {isRegister && (
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-slate-600">
                ชื่อที่แสดง
              </span>
              <input
                name="name"
                type="text"
                autoComplete="name"
                required
                maxLength={255}
                placeholder="ชื่อของคุณ"
                className={cn(inputClassName)}
              />
            </label>
          )}

          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-slate-600">
              อีเมล
            </span>
            <input
              name="email"
              type="email"
              autoComplete="email"
              required
              maxLength={254}
              placeholder="you@example.com"
              className={cn(inputClassName)}
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-slate-600">
              รหัสผ่าน
            </span>
            <input
              name="password"
              type="password"
              autoComplete={isRegister ? "new-password" : "current-password"}
              required
              minLength={8}
              maxLength={128}
              placeholder={
                isRegister ? "อย่างน้อย 8 ตัวอักษร" : "รหัสผ่านของคุณ"
              }
              className={cn(inputClassName)}
            />
          </label>

          {error && (
            <p
              role="alert"
              className="rounded-xl bg-rose-50 px-3.5 py-3 text-sm text-rose-600"
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex w-full items-center justify-center rounded-xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting
              ? "กำลังดำเนินการ..."
              : isRegister
                ? "สมัครสมาชิก"
                : "เข้าสู่ระบบ"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          {isRegister ? "มีบัญชีอยู่แล้ว?" : "ยังไม่มีบัญชี?"}{" "}
          <Link
            href={isRegister ? "/login" : "/register"}
            className="font-semibold text-emerald-600 hover:text-emerald-700"
          >
            {isRegister ? "เข้าสู่ระบบ" : "สมัครสมาชิก"}
          </Link>
        </p>
      </section>
    </main>
  );
}
