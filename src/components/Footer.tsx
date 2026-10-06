'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Phone,
  Mail,
  MapPin,
  Send,
  Globe,
  Share2,
  ShieldCheck,
  Video,
  ExternalLink,
} from 'lucide-react'

interface SiteSettings {
  siteName: string
  logoText: string
  subtitle: string
  phone: string
  email: string
  address: string
  telegramUrl: string
  facebookUrl: string
  instagramUrl: string
  youtubeUrl: string
  twitterUrl: string
  tiktokUrl: string
  footerText: string
  copyrightText: string
}

export default function Footer() {
  const [settings, setSettings] = useState<SiteSettings>({
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

  useEffect(() => {
    fetch('/api/settings')
      .then((r) => r.json())
      .then((data) => setSettings((prev) => ({ ...prev, ...data })))
      .catch(() => {})
  }, [])

  // Dynamic social links: only those that have a non-empty URL
  const socialLinks = [
    {
      name: 'Telegram',
      url: settings.telegramUrl,
      color: 'hover:bg-[#229ED9]',
      icon: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.75-.55 2.92-1.27 4.86-2.11 5.83-2.52 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .34z" />
        </svg>
      ),
    },
    {
      name: 'Instagram',
      url: settings.instagramUrl,
      color: 'hover:bg-[#E1306C]',
      icon: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        </svg>
      ),
    },
    {
      name: 'Facebook',
      url: settings.facebookUrl,
      color: 'hover:bg-[#1877F2]',
      icon: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      ),
    },
    {
      name: 'YouTube',
      url: settings.youtubeUrl,
      color: 'hover:bg-[#FF0000]',
      icon: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      ),
    },
    {
      name: 'X (Twitter)',
      url: settings.twitterUrl,
      color: 'hover:bg-black',
      icon: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
    },
    {
      name: 'TikTok',
      url: settings.tiktokUrl,
      color: 'hover:bg-[#000000]',
      icon: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M12.525.02c1.31 0 2.6.43 3.66 1.23a6.83 6.83 0 0 0 4.22 1.48v3.52a10.3 10.3 0 0 1-4.22-1.07v8.8a6.97 6.97 0 1 1-6.97-6.97c.4 0 .78.04 1.16.11v3.57a3.48 3.48 0 1 0 2.15 3.29V.02z" />
        </svg>
      ),
    },
  ].filter((item) => !!item.url && item.url.trim() !== '')

  return (
    <footer className="bg-slate-900 dark:bg-[#0d1117] text-slate-300 pt-12 pb-12 border-t-4 border-red-700 mt-16 transition-colors">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-12 gap-8 mb-10">
        {/* Brand & Socials (Col 1-5) */}
        <div className="md:col-span-5 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-red-700 to-red-600 text-white flex items-center justify-center font-black text-xl shadow-md">
              UT
            </div>
            <div>
              <span className="text-xl font-black text-white tracking-wider block leading-none">
                {settings.logoText || 'URGUT TODAY'}
              </span>
              <span className="text-[10px] text-red-500 font-bold uppercase tracking-widest mt-1 block">
                {settings.subtitle || 'Samarqand • Urgut tumani'}
              </span>
            </div>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
            {settings.footerText}
          </p>

          {/* Social media links: ONLY show configured ones */}
          {socialLinks.length > 0 && (
            <div className="pt-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-2.5">
                Ijtimoiy tarmoqlarimiz:
              </span>
              <div className="flex flex-wrap items-center gap-2">
                {socialLinks.map((item) => (
                  <a
                    key={item.name}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-9 h-9 rounded-xl bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center transition-all ${item.color} shadow-sm`}
                    aria-label={item.name}
                    title={item.name}
                  >
                    {item.icon}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Quick Navigation (Col 6-8) */}
        <div className="md:col-span-3 space-y-3">
          <h4 className="text-white font-bold text-sm uppercase tracking-wider border-b border-slate-800 dark:border-slate-800 pb-2">
            Asosiy Bo&apos;limlar
          </h4>
          <ul className="space-y-2 text-xs">
            <li>
              <Link href="/" className="hover:text-red-400 transition-colors">
                Bosh sahifa
              </Link>
            </li>
            <li>
              <Link href="/latest" className="hover:text-red-400 transition-colors">
                Eng so&apos;nggi xabarlar
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-red-400 transition-colors">
                Biz haqimizda
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-red-400 transition-colors">
                Bog&apos;lanish va Takliflar
              </Link>
            </li>
            <li>
              <Link href="/search" className="hover:text-red-400 transition-colors">
                Yangiliklar qidiruvi
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact Info & Admin (Col 9-12) */}
        <div className="md:col-span-4 space-y-3">
          <h4 className="text-white font-bold text-sm uppercase tracking-wider border-b border-slate-800 dark:border-slate-800 pb-2">
            Tahririyat bilan aloqa
          </h4>
          <ul className="space-y-2.5 text-xs text-slate-400">
            {settings.phone && (
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-red-500 shrink-0" />
                <a href={`tel:${settings.phone}`} className="hover:text-white transition-colors">
                  {settings.phone}
                </a>
              </li>
            )}
            {settings.email && (
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-red-500 shrink-0" />
                <a href={`mailto:${settings.email}`} className="hover:text-white transition-colors">
                  {settings.email}
                </a>
              </li>
            )}
            {settings.address && (
              <li className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />
                <span>{settings.address}</span>
              </li>
            )}
          </ul>

          <div className="pt-2">
            <Link
              href="/admin/login"
              className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-red-400 transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-slate-400" /> Tahririyat tizimiga kirish
            </Link>
          </div>
        </div>
      </div>

      {/* Clean Bottom Copyright Line */}
      <div className="max-w-7xl mx-auto px-4 pt-6 border-t border-slate-800/80 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p>
          &copy; {new Date().getFullYear()} {settings.siteName}. {settings.copyrightText}
        </p>
        <p className="text-[11px] text-slate-500">
          Urgut tumani mustaqil ommaviy axborot vositasi
        </p>
      </div>
    </footer>
  )
}
