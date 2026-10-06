'use client'

import React, { useState } from 'react'
import { Send, CheckCircle2, Phone, Mail, MapPin } from 'lucide-react'

export default function ContactPage() {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')
  const [sent, setSent] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSent(true)
    setName('')
    setPhone('')
    setMessage('')
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 md:py-12 space-y-8">
      <div className="border-b-4 border-red-700 pb-4">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 dark:text-slate-100 uppercase tracking-tight">
          Bog&apos;lanish va Takliflar
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm mt-1">
          Tahririyat bilan bog&apos;lanish yoki yangilik yuborish
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Contact Info Column */}
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-[#1c2128] border border-slate-200 dark:border-slate-800 shadow-xs">
            <Phone className="w-5 h-5 text-red-600 mb-2" />
            <span className="text-xs text-slate-400 font-bold uppercase block">Telefon</span>
            <a href="tel:+998901234567" className="text-sm font-extrabold text-slate-900 dark:text-slate-100 hover:text-red-600">
              +998 90 123 45 67
            </a>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-[#1c2128] border border-slate-200 dark:border-slate-800 shadow-xs">
            <Mail className="w-5 h-5 text-red-600 mb-2" />
            <span className="text-xs text-slate-400 font-bold uppercase block">Elektron pochta</span>
            <a href="mailto:info@urguttoday.uz" className="text-sm font-extrabold text-slate-900 dark:text-slate-100 hover:text-red-600">
              info@urguttoday.uz
            </a>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-[#1c2128] border border-slate-200 dark:border-slate-800 shadow-xs">
            <MapPin className="w-5 h-5 text-red-600 mb-2" />
            <span className="text-xs text-slate-400 font-bold uppercase block">Manzil</span>
            <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              Samarqand viloyati, Urgut tumani markazi
            </span>
          </div>
        </div>

        {/* Contact Form */}
        <div className="md:col-span-2 bg-white dark:bg-[#1c2128] rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm">
          {sent && (
            <div className="p-4 mb-6 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 font-bold text-xs rounded-2xl flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <span>Xabaringiz muvaffaqiyatli yuborildi! Tahririyat tez orada siz bilan bog&apos;lanadi.</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Ism va Familiyangiz *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Masalan: Jamshid Aliyev"
                className="w-full bg-slate-50 dark:bg-slate-900/60 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-red-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Telefon Raqamingiz *
              </label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+998 90 123 45 67"
                className="w-full bg-slate-50 dark:bg-slate-900/60 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-red-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Xabar yoki Yangilik Matni *
              </label>
              <textarea
                required
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Taklif, murojaat yoki muhim xabar tafsilotlari..."
                className="w-full bg-slate-50 dark:bg-slate-900/60 border border-slate-300 dark:border-slate-700 rounded-xl p-4 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-red-600"
              />
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto bg-red-700 hover:bg-red-800 text-white font-bold text-xs px-8 py-3.5 rounded-xl uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" /> Xabarni Yuborish
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
