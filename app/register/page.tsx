import AuthForm from "@/components/AuthForm";
import Header from "@/components/Header";

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50 font-sans text-slate-800">
      <Header />
      <AuthForm mode="register" />
    </div>
  );
}
