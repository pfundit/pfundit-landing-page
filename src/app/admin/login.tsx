'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
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
        <div className="mb-8 text-center">
          <p className="text-[0.68rem] font-bold uppercase tracking-[0.24em] text-[#D4A437]">Admin Access</p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-[#0f1b3d]">Pfundit Admin</h1>
          <p className="mt-3 text-sm leading-relaxed text-[#0f1b3d]/60">Sign in to manage jobs, applications, and contact submissions.</p>
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
            <input
              type="password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-xl border border-[#0f1b3d]/15 bg-[#F0F5FF]/60 px-4 py-3 text-sm text-[#0f1b3d] outline-none transition-colors placeholder:text-[#0f1b3d]/30 focus:border-[#D4A437] focus:bg-white focus:ring-1 focus:ring-[#D4A437]"
              placeholder="••••••••"
            />
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
