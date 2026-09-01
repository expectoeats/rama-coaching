"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Lock, Mail, Eye, EyeOff, LogIn, GraduationCap, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      // Try student login first
      let res = await fetch("/api/auth/student/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      let data = await res.json();
      if (data.success) {
        router.push("/student");
        router.refresh();
        return;
      }
      // Fallback to admin login
      res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      data = await res.json();
      if (data.success) {
        router.push("/admin");
        router.refresh();
        return;
      }
      setError(data.error || "Invalid credentials. Password is set by admin.");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4">
      {/* Background */}
      <div className="absolute inset-0">
        <img src="/login-bg.jpg" alt="Login background" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-[2px]" />
        <div className="absolute inset-0 bg-gradient-to-br from-navy-deep/40 via-transparent to-black/30" />
      </div>

      {/* Top bar */}
      <Link href="/" className="absolute top-6 left-6 z-20 flex items-center gap-2 bg-white/95 backdrop-blur px-3 py-2 rounded-lg shadow-lg hover:bg-white transition">
        <img src="/logo.jpeg" alt="Rama" className="w-8 h-8 rounded-md object-contain" />
        <span className="text-sm font-bold text-slate-800 hidden sm:block">Rama Coaching</span>
      </Link>

      <div className="relative z-10 w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-0 rounded-2xl overflow-hidden shadow-2xl bg-white">
        {/* Left - Branding / Info */}
        <div className="hidden lg:flex flex-col justify-between p-10 text-white relative overflow-hidden bg-navy-deep">
          <img src="/login-bg.jpg" alt="" className="absolute inset-0 w-full h-full object-cover opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-br from-navy-deep via-navy to-slate-900/80" />
          <div className="relative">
            <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center mb-6">
              <GraduationCap className="w-7 h-7 text-navy" />
            </div>
            <h1 className="text-3xl font-bold leading-tight">Welcome Back</h1>
            <p className="text-white/80 mt-3 text-sm leading-relaxed">Sign in to access your student dashboard, certificates, courses and more at Rama Coaching Center.</p>
            <ul className="mt-8 space-y-3 text-sm text-white/90">
              <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-emerald-400" /> 5000+ Students Trusted</li>
              <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-emerald-400" /> Government Recognized Certificates</li>
              <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-emerald-400" /> Secure & Fast Verification</li>
            </ul>
          </div>
          <div className="relative text-xs text-white/60">
            <p>© 2026 Rama Coaching Center, Fatehpur</p>
            <p className="mt-1">And Computer Education Center</p>
          </div>
        </div>

        {/* Right - Form */}
        <div className="p-8 sm:p-10 flex flex-col justify-center bg-white">
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <img src="/logo.jpeg" alt="Rama" className="w-10 h-10 rounded-lg object-contain border" />
            <div>
              <p className="text-sm font-bold text-slate-800">Rama Coaching Center</p>
              <p className="text-xs text-slate-500">Student Portal</p>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-800">Student Login</h2>
            <p className="text-sm text-slate-500 mt-1">Enter your credentials to continue</p>
          </div>

          {error ? (
            <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{error}</div>
          ) : null}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="student@example.com"
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-navy/20 focus:border-navy outline-none text-sm bg-white"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-medium text-slate-700">Password</label>
                <Link href="#" className="text-xs text-navy hover:underline">Forgot password?</Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type={show ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-navy/20 focus:border-navy outline-none text-sm"
                />
                <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 bg-navy hover:bg-navy-deep text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-60 shadow-md"
            >
              {loading ? <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <LogIn className="w-4 h-4" />}
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="mt-6 text-center space-y-3">
            <p className="text-sm text-slate-600">
              Don&apos;t have an account? <Link href="#" className="font-semibold text-navy hover:underline">Register</Link>
            </p>
            <div className="pt-3 border-t border-slate-100">
              <Link href="/admin/login" className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-navy transition">
                Login as Admin <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <p className="text-xs text-slate-400">Admin? Click “Login as Admin” and you’ll be redirected to /admin after login.</p>
          </div>

          <div className="mt-6 rounded-lg bg-slate-50 border border-slate-200 p-3">
            <p className="text-xs font-semibold text-slate-700 mb-1">Demo Student</p>
            <p className="text-xs text-slate-600">Use any student email from DB, or admin:</p>
            <p className="text-xs text-slate-600">admin@ramacoaching.com / Admin@123 (goes to /admin)</p>
          </div>
        </div>
      </div>
    </div>
  );
}
