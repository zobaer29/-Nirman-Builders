"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { auth, googleProvider } from '@/lib/firebase';
import { signInWithPopup } from 'firebase/auth';

export default function Login() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (searchParams.get('registered') === 'true') {
      setSuccessMsg('Registration successful! Please login.');
    }
  }, [searchParams]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Login failed');
      }


      if (data.roleId === 1) {
        router.push('/admin');
      }
      else if (data.roleId === 2) {
        router.push('/user');
      } else if (data.roleId === 3) {
        router.push('/contractor');
      } else {
        router.push('/worker');
      }

      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: user.email, name: user.displayName, photoUrl: user.photoURL }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Google login failed');
      }

      if (data.roleId === 1) {
        router.push('/admin');
      } else if (data.roleId === 2) {
        router.push('/user');
      } else if (data.roleId === 3) {
        router.push('/contractor');
      } else {
        router.push('/worker');
      }

      router.refresh();
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to sign in with Google');
    } finally {
      setLoading(false);
    }
  };

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

          {successMsg && (
            <div className="mb-4 p-3 bg-emerald-500/20 border border-emerald-500 rounded-lg text-emerald-200 text-sm">
              {successMsg}
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-lg text-red-200 text-sm">
              {error}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              required
              className="w-full bg-transparent border border-white/30 rounded-full px-6 py-3 outline-none focus:border-white placeholder:text-white/60"
            />

            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
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
              disabled={loading}
              className="w-full bg-emerald-500 hover:bg-emerald-600 py-3 rounded-full font-bold transition active:scale-95 text-white disabled:opacity-70"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>

            <div className="relative flex items-center justify-center my-4">
              <div className="absolute border-t border-white/20 w-full"></div>
              <span className="relative px-4 text-sm text-white/60 bg-[#1e293b] rounded-full">Or</span>
            </div>

            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 bg-white/10 hover:bg-white/20 border border-white/20 py-3 rounded-full font-bold transition active:scale-95 text-white disabled:opacity-70"
            >
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
              Sign in with Google
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
