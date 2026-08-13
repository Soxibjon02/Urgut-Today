'use client'

import React, { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import AdminLayout from '@/components/AdminLayout';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({
    siteName: 'Urgut Today',
    logoText: 'URGUT TODAY',
    subtitle: 'Samarqand • Urgut tumani',
    phone: '+998 90 123 45 67',
    email: 'info@urguttoday.uz',
    telegramUrl: '',
    facebookUrl: '',
    instagramUrl: '',
    footerText: "Urgut tumani bo'yicha ishonchli va tezkor axborot manbai.",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/settings')
      .then((r) => r.json())
      .then((data) => setSettings(data))
      .catch(console.error);
  }, []);

  const handleChange = (key: string, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('urgut_admin_token');

    try {
      setSaving(true);
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(settings),
      });

      if (res.ok) {
        alert('Sozlamalar muvaffaqiyatli saqlandi!');
      } else {
        alert('Saqlashda xatolik');
      }
    } catch (err) {
      alert('Xatolik');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Sayt Sozlamalari</h1>
          <p className="text-xs text-slate-500 font-semibold mt-1">Sayt nomi, aloqa ma'lumotlari va ijtimoiy tarmoq havolalari</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Sayt Nomi</label>
              <input
                type="text"
                value={settings.siteName}
                onChange={(e) => handleChange('siteName', e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Logo Matni</label>
              <input
                type="text"
                value={settings.logoText}
                onChange={(e) => handleChange('logoText', e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs font-bold"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Subsarlavha (Slogan)</label>
            <input
              type="text"
              value={settings.subtitle}
              onChange={(e) => handleChange('subtitle', e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Telefon Raqam</label>
              <input
                type="text"
                value={settings.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs font-semibold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Email Manzil</label>
              <input
                type="email"
                value={settings.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs font-semibold"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-100">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Telegram URL</label>
              <input
                type="text"
                value={settings.telegramUrl}
                onChange={(e) => handleChange('telegramUrl', e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Facebook URL</label>
              <input
                type="text"
                value={settings.facebookUrl}
                onChange={(e) => handleChange('facebookUrl', e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Instagram URL</label>
              <input
                type="text"
                value={settings.instagramUrl}
                onChange={(e) => handleChange('instagramUrl', e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Footer Matni</label>
            <textarea
              rows={3}
              value={settings.footerText}
              onChange={(e) => handleChange('footerText', e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-xs leading-relaxed"
            />
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 bg-red-700 hover:bg-red-800 text-white rounded-lg text-xs font-bold flex items-center gap-2"
            >
              <Save className="w-4 h-4" /> {saving ? 'Saqlanmoqda...' : 'Sozlamalarni Saqlash'}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
