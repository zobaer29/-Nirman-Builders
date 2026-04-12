"use client";

import Link from 'next/link';

export default function Login() {
  return (
    <div className="relative min-h-[calc(100vh-80px)] w-full flex items-center justify-center p-4 bg-slate-900 text-white overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src="/img/construction-workers-sunset.jpg"
          alt="Login Background"
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-transparent to-slate-900/80"></div>
      </div>

      {/* Login Section */}
      <div className="flex items-center justify-center relative z-10 w-full">
        {/* Login Card */}
        <div className="w-full max-w-md p-8 bg-white/5 backdrop-blur-xl border border-white/20 rounded-3xl shadow-lg">
          <h2 className="text-3xl font-bold text-center mb-8">Login</h2>

          <form action="/api/login" method="POST" className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <input
              type="text"
              name="username"
              placeholder="Username"
              required
              className="w-full bg-transparent border border-white/30 rounded-full px-6 py-3 outline-none focus:border-white placeholder:text-white/60"
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              required
              className="w-full bg-transparent border border-white/30 rounded-full px-6 py-3 outline-none focus:border-white placeholder:text-white/60"
            />

            <div className="flex justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="accent-white" />
                Remember me
              </label>
              <Link href="#" className="hover:underline">Forgot?</Link>
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-500 hover:bg-emerald-600 py-3 rounded-full font-bold transition active:scale-95 text-white"
            >
              Login
            </button>

            <p className="text-center text-sm">
              Don't have an account?{' '}
              <Link href="/register" className="font-semibold hover:underline">
                Register
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
