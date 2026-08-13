'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Phone, Mail, Send, Globe, Share2, ShieldCheck } from 'lucide-react'

interface SiteSettings {
  siteName: string
  logoText: string
  phone: string
  email: string
  telegramUrl: string
  facebookUrl: string
  instagramUrl: string
  footerText: string
}

export default function Footer() {
  const [settings, setSettings] = useState<SiteSettings>({
    siteName: 'Urgut Today',
    logoText: 'URGUT TODAY',
    phone: '+998 90 123 45 67',
    email: 'info@urguttoday.uz',
    telegramUrl: '',
    facebookUrl: '',
    instagramUrl: '',
    footerText: "Urgut tumani bo'yicha ishonchli axborot manbai.",
  })

  useEffect(() => {
    fetch('/api/settings').then(r => r.json()).then(setSettings).catch(() => {})
  }, [])

  return (
    <footer className="bg-slate-900 text-slate-300 pt-12 pb-8 border-t-4 border-red-700 mt-16">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
        {/* Brand */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded bg-red-700 text-white flex items-center justify-center font-black text-xl">UT</div>
            <span className="text-xl font-black text-white tracking-wider">{settings.logoText || 'URGUT TODAY'}</span>
          </div>
          <p className="text-sm text-slate-400 leading-relaxed">{settings.footerText}</p>
          <div className="flex items-center gap-3 pt-2">
            {settings.telegramUrl && (
              <a href={settings.telegramUrl} target="_blank" rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-red-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors" aria-label="Telegram">
                <Send className="w-4 h-4" />
              </a>
            )}
            {settings.facebookUrl && (
              <a href={settings.facebookUrl} target="_blank" rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-red-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors" aria-label="Facebook">
                <Globe className="w-4 h-4" />
              </a>
            )}
            {settings.instagramUrl && (
              <a href={settings.instagramUrl} target="_blank" rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-red-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors" aria-label="Instagram">
                <Share2 className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>

        {/* Navigation */}
        <div>
          <h4 className="text-white font-bold text-base mb-4 border-b border-slate-800 pb-2">Bo'limlar</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/" className="hover:text-red-400 transition-colors">Bosh sahifa</Link></li>
            <li><Link href="/latest" className="hover:text-red-400 transition-colors">Eng so'nggi yangiliklar</Link></li>
            <li><Link href="/category/urgut" className="hover:text-red-400 transition-colors">Urgut tuman yangiliklari</Link></li>
            <li><Link href="/category/iqtisodiyot" className="hover:text-red-400 transition-colors">Iqtisodiyot va Biznes</Link></li>
            <li><Link href="/category/talim" className="hover:text-red-400 transition-colors">Ta'lim va IT</Link></li>
          </ul>
        </div>

        {/* Links */}
        <div>
          <h4 className="text-white font-bold text-base mb-4 border-b border-slate-800 pb-2">Ma'lumotlar</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/about" className="hover:text-red-400 transition-colors">Biz haqimizda</Link></li>
            <li><Link href="/contact" className="hover:text-red-400 transition-colors">Aloqa va Takliflar</Link></li>
            <li><Link href="/category/elonlar" className="hover:text-red-400 transition-colors">E'lonlar va Bildirishnomalar</Link></li>
            <li>
              <Link href="/admin/login" className="text-amber-400 hover:underline flex items-center gap-1 mt-4">
                <ShieldCheck className="w-4 h-4" /> Tahririyat Admin Paneli
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-white font-bold text-base mb-4 border-b border-slate-800 pb-2">Bog'lanish</h4>
          <div className="space-y-3 text-sm text-slate-400">
            <p className="flex items-center gap-2"><Phone className="w-4 h-4 text-red-500 shrink-0" /><span>{settings.phone}</span></p>
            <p className="flex items-center gap-2"><Mail className="w-4 h-4 text-red-500 shrink-0" /><span>{settings.email}</span></p>
            <p className="text-xs text-slate-500 mt-3 leading-relaxed">Manzil: Samarqand viloyati, Urgut tumani, Mustaqillik shoh ko'chasi.</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pt-6 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500 gap-4">
        <p>© 2026 {settings.siteName}. Barcha huquqlar himoyalangan.</p>
        <p>Materiallardan foydalanilganda Manba ko'rsatilishi shart.</p>
      </div>
    </footer>
  )
}
