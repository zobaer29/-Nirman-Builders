"use client";

import Link from 'next/link';

export default function Register() {
  return (
    <div className="relative min-h-[calc(100vh-80px)] w-full flex items-center justify-center p-4 bg-slate-900 text-white overflow-hidden py-10">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="/img/construction-workers-sunset.jpg"
          alt="Construction Background"
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 via-transparent to-slate-900/80"></div>
      </div>

      {/* Glow effect */}
      <div className="absolute w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl -top-10 -left-10"></div>

      {/* Form Card */}
      <div className="relative z-10 w-full max-w-md p-8 md:p-10 bg-white/5 border-2 border-white/20 backdrop-blur-xl rounded-3xl">
        <h2 className="text-3xl font-bold text-center mb-8">Create Account</h2>

        <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
          <input
            type="text"
            placeholder="Full Name"
            className="w-full bg-transparent border-2 border-white/30 rounded-full px-6 py-3 outline-none focus:border-white placeholder:text-white/60"
          />

          <input
            type="email"
            placeholder="Email Address"
            className="w-full bg-transparent border-2 border-white/30 rounded-full px-6 py-3 outline-none focus:border-white placeholder:text-white/60"
          />

          <input
            type="text"
            placeholder="Username"
            className="w-full bg-transparent border-2 border-white/30 rounded-full px-6 py-3 outline-none focus:border-white placeholder:text-white/60"
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full bg-transparent border-2 border-white/30 rounded-full px-6 py-3 outline-none focus:border-white placeholder:text-white/60"
          />

          <input
            type="password"
            placeholder="Confirm Password"
            className="w-full bg-transparent border-2 border-white/30 rounded-full px-6 py-3 outline-none focus:border-white placeholder:text-white/60"
          />

          <label className="flex items-start gap-2 text-sm cursor-pointer">
            <input type="checkbox" className="accent-white w-4 h-4 mt-0.5" />
            <span>I agree to the Terms and Privacy Policy</span>
          </label>

          <button className="w-full bg-white text-slate-900 font-bold py-3 rounded-full hover:bg-gray-200 transition active:scale-95">
            Register
          </button>

          <p className="text-center text-sm">
            Already have an account?{' '}
            <Link href="/login" className="font-semibold hover:underline">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
