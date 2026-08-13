'use client'

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Lock, Mail } from 'lucide-react';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      setLoading(true);
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Kirishda xatolik yuz berdi');
        return;
      }

      localStorage.setItem('urgut_admin_token', data.token);
      router.push('/admin/dashboard');
    } catch (err) {
      setError('Server bilan ulanishda xatolik');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-8 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-red-700 text-white font-black text-2xl flex items-center justify-center mx-auto shadow-md">
            UT
          </div>
          <h1 className="text-2xl font-black text-slate-900">Admin Paneli</h1>
          <p className="text-xs text-slate-500 font-semibold">Urgut Today tahririyat boshqaruv tizimi</p>
        </div>

        {error && (
          <div className="p-3 bg-red-100 text-red-800 font-bold text-xs rounded-lg text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Email *</label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="soxibgaybullayev439@gmail.com"
                className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-9 pr-3 py-2 text-xs font-semibold focus:outline-none focus:border-red-700"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Parol *</label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-9 pr-3 py-2 text-xs font-semibold focus:outline-none focus:border-red-700"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-700 hover:bg-red-800 text-white font-bold text-xs py-3 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-md"
          >
            <ShieldCheck className="w-4 h-4" />
            {loading ? 'Kirilmoqda...' : 'Tizimga Kirish'}
          </button>
        </form>

        <div className="pt-4 border-t border-slate-100 text-center text-[11px] text-slate-400">
          Defolt login: admin@urguttoday.uz | Admin@123456
        </div>
      </div>
    </div>
  );
}
