"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { auth, googleProvider } from '@/lib/firebase';
import { signInWithPopup } from 'firebase/auth';

export default function Register() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      // Registration successful
      router.push('/login?registered=true');
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
        body: JSON.stringify({ email: user.email, name: user.displayName }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Google signup failed');
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

        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-lg text-red-200 text-sm">
            {error}
          </div>
        )}

        <form className="space-y-5" onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Username"
            required
            className="w-full bg-transparent border-2 border-white/30 rounded-full px-6 py-3 outline-none focus:border-white placeholder:text-white/60"
          />

          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email Address"
            required
            className="w-full bg-transparent border-2 border-white/30 rounded-full px-6 py-3 outline-none focus:border-white placeholder:text-white/60"
          />

          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            required
            className="w-full bg-transparent border-2 border-white/30 rounded-full px-6 py-3 outline-none focus:border-white placeholder:text-white/60"
          />

          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm Password"
            required
            className="w-full bg-transparent border-2 border-white/30 rounded-full px-6 py-3 outline-none focus:border-white placeholder:text-white/60"
          />

          <label className="flex items-start gap-2 text-sm cursor-pointer">
            <input type="checkbox" required className="accent-white w-4 h-4 mt-0.5" />
            <span>I agree to the Terms and Privacy Policy</span>
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-slate-900 font-bold py-3 rounded-full hover:bg-gray-200 transition active:scale-95 disabled:opacity-70"
          >
            {loading ? 'Registering...' : 'Register'}
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
            Sign up with Google
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
