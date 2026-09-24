'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        router.push('/admin');
        router.refresh();
        return;
      }

      const data = (await response.json()) as { error?: string };
      setError(data.error || 'Login failed');
    } catch {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F0F5FF] p-4">
      <div className="w-full max-w-md rounded-[2rem] border border-[#0f1b3d]/10 bg-white p-8 shadow-[0_24px_80px_rgba(15,27,61,0.12)] sm:p-10">
        <div className="mb-8 text-center flex flex-col items-center">
          <Image
            src="/logo-main.svg"
            alt="Pfundit"
            width={2378}
            height={699}
            className="h-7 w-auto aspect-[2378/699] object-contain mb-4"
            priority
          />
          <h1 className="text-[0.68rem] font-bold uppercase tracking-[0.24em] text-[#D4A437]">Admin Access</h1>
          <p className="mt-2 text-sm leading-relaxed text-[#0f1b3d]/60">Sign in to manage jobs, applications, and contact submissions.</p>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-[0.18em] text-[#0f1b3d]/70">
              Username
            </label>
            <input
              type="text"
              required
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              className="w-full rounded-xl border border-[#0f1b3d]/15 bg-[#F0F5FF]/60 px-4 py-3 text-sm text-[#0f1b3d] outline-none transition-colors placeholder:text-[#0f1b3d]/30 focus:border-[#D4A437] focus:bg-white focus:ring-1 focus:ring-[#D4A437]"
              placeholder="admin"
            />
          </div>

          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-[0.18em] text-[#0f1b3d]/70">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-xl border border-[#0f1b3d]/15 bg-[#F0F5FF]/60 pl-4 pr-11 py-3 text-sm text-[#0f1b3d] outline-none transition-colors placeholder:text-[#0f1b3d]/30 focus:border-[#D4A437] focus:bg-white focus:ring-1 focus:ring-[#D4A437]"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-[#0f1b3d]/40 transition-colors hover:text-[#0f1b3d] focus:outline-none"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                    />
                  </svg>
                ) : (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center rounded-full bg-[#0f1b3d] py-3.5 text-sm font-bold text-white transition-all hover:bg-[#0f1b3d]/90 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
