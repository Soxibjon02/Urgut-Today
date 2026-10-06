'use client'

import React, { useState, useEffect } from 'react'
import { Save, Share2, Phone, Mail, MapPin, Globe, CheckCircle2 } from 'lucide-react'
import AdminLayout from '@/components/AdminLayout'

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({
    siteName: 'Urgut Today',
    logoText: 'URGUT TODAY',
    subtitle: 'Samarqand • Urgut tumani',
    phone: '+998 90 123 45 67',
    email: 'info@urguttoday.uz',
    address: 'Samarqand viloyati, Urgut tumani markazi',
    telegramUrl: '',
    facebookUrl: '',
    instagramUrl: '',
    youtubeUrl: '',
    twitterUrl: '',
    tiktokUrl: '',
    footerText: "Urgut tumani bo'yicha ishonchli va tezkor axborot manbai.",
    copyrightText: 'Barcha huquqlar himoyalangan.',
  })
  const [saving, setSaving] = useState(false)
  const [savedSuccess, setSavedSuccess] = useState(false)

  useEffect(() => {
    fetch('/api/settings')
      .then((r) => r.json())
      .then((data) => setSettings((prev) => ({ ...prev, ...data })))
      .catch(console.error)
  }, [])

  const handleChange = (key: string, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const token = localStorage.getItem('urgut_admin_token')

    try {
      setSaving(true)
      setSavedSuccess(false)
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(settings),
      })

      if (res.ok) {
        setSavedSuccess(true)
        setTimeout(() => setSavedSuccess(false), 4000)
      } else {
        alert('Saqlashda xatolik yuz berdi')
      }
    } catch (err) {
      alert('Tarmoq xatosi')
    } finally {
      setSaving(false)
    }
  }

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Sayt va Footer Sozlamalari</h1>
          <p className="text-xs text-slate-500 font-semibold mt-1">
            Sayt nomi, aloqa ma&apos;lumotlari, ijtimoiy tarmoqlar (faqat to&apos;ldirilganlari saytda ko&apos;rinadi)
          </p>
        </div>

        {savedSuccess && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span>Sozlamalar muvaffaqiyatli saqlandi va saytda yangilandi!</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          {/* 1. Asosiy Brend ma'lumotlari */}
          <div>
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider mb-4 border-b pb-2">
              1. Asosiy Ma&apos;lumotlar
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Sayt Nomi</label>
                <input
                  type="text"
                  value={settings.siteName}
                  onChange={(e) => handleChange('siteName', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2 text-xs font-bold"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Logo Matni</label>
                <input
                  type="text"
                  value={settings.logoText}
                  onChange={(e) => handleChange('logoText', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2 text-xs font-bold"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-xs font-bold text-slate-700 mb-1">Subsarlavha (Slogan)</label>
              <input
                type="text"
                value={settings.subtitle}
                onChange={(e) => handleChange('subtitle', e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2 text-xs"
              />
            </div>
          </div>

          {/* 2. Aloqa Ma'lumotlari */}
          <div>
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider mb-4 border-b pb-2">
              2. Aloqa Ma&apos;lumotlari
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Telefon Raqam</label>
                <input
                  type="text"
                  value={settings.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2 text-xs font-semibold"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email Manzil</label>
                <input
                  type="email"
                  value={settings.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2 text-xs font-semibold"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Manzil</label>
                <input
                  type="text"
                  value={settings.address}
                  onChange={(e) => handleChange('address', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2 text-xs"
                />
              </div>
            </div>
          </div>

          {/* 3. Ijtimoiy Tarmoqlar (Social Media) */}
          <div>
            <div className="flex items-center justify-between border-b pb-2 mb-4">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Share2 className="w-4 h-4 text-red-600" /> 3. Ijtimoiy Tarmoqlar
              </h3>
              <span className="text-[11px] text-slate-500">
                Bo&apos;sh qoldirilgan tarmoqlar saytda avtomatik yashiriladi
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#229ED9]" /> Telegram Havolasi
                </label>
                <input
                  type="text"
                  placeholder="https://t.me/urgut_today"
                  value={settings.telegramUrl}
                  onChange={(e) => handleChange('telegramUrl', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#E1306C]" /> Instagram Havolasi
                </label>
                <input
                  type="text"
                  placeholder="https://instagram.com/urguttoday"
                  value={settings.instagramUrl}
                  onChange={(e) => handleChange('instagramUrl', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#1877F2]" /> Facebook Havolasi
                </label>
                <input
                  type="text"
                  placeholder="https://facebook.com/urguttoday"
                  value={settings.facebookUrl}
                  onChange={(e) => handleChange('facebookUrl', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#FF0000]" /> YouTube Havolasi
                </label>
                <input
                  type="text"
                  placeholder="https://youtube.com/@urguttoday"
                  value={settings.youtubeUrl}
                  onChange={(e) => handleChange('youtubeUrl', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#000000]" /> X (Twitter) Havolasi
                </label>
                <input
                  type="text"
                  placeholder="https://x.com/urguttoday"
                  value={settings.twitterUrl}
                  onChange={(e) => handleChange('twitterUrl', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#00F2FE]" /> TikTok Havolasi
                </label>
                <input
                  type="text"
                  placeholder="https://tiktok.com/@urguttoday"
                  value={settings.tiktokUrl}
                  onChange={(e) => handleChange('tiktokUrl', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs"
                />
              </div>
            </div>
          </div>

          {/* 4. Footer Matni */}
          <div>
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider mb-4 border-b pb-2">
              4. Footer Matnlari
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Footer Asosiy Tavsifi
                </label>
                <textarea
                  rows={2}
                  value={settings.footerText}
                  onChange={(e) => handleChange('footerText', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-xs leading-relaxed"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Copyright (Mualliflik huquqi matni)
                </label>
                <input
                  type="text"
                  value={settings.copyrightText}
                  onChange={(e) => handleChange('copyrightText', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-8 py-3 bg-red-700 hover:bg-red-800 text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 shadow-md transition-all"
            >
              <Save className="w-4 h-4" /> {saving ? 'Saqlanmoqda...' : 'Sozlamalarni Saqlash'}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  )
}
