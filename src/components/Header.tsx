'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Menu, X, Search, Phone, ShieldCheck } from 'lucide-react'

interface Category {
  id: number
  name: string
  slug: string
  articleCount: number
}

interface SiteSettings {
  siteName: string
  logoText: string
  subtitle: string
  phone: string
}

export default function Header() {
  const [categories, setCategories] = useState<Category[]>([])
  const [settings, setSettings] = useState<SiteSettings>({
    siteName: 'Urgut Today',
    logoText: 'URGUT TODAY',
    subtitle: "Samarqand • Urgut tumani",
    phone: '+998 90 123 45 67',
  })
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    fetch('/api/categories').then(r => r.json()).then(setCategories).catch(() => {})
    fetch('/api/settings').then(r => r.json()).then(setSettings).catch(() => {})
  }, [])

  useEffect(() => {
    setIsMenuOpen(false)
    setIsSearchOpen(false)
  }, [pathname])

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setIsSearchOpen(false)
      setSearchQuery('')
    }
  }, [searchQuery, router])

  const todayDate = new Date().toLocaleDateString('uz-UZ', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  })

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
      {/* Top Utility Bar */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4 hidden md:block">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <span className="capitalize font-medium text-slate-400">{todayDate}</span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-300 font-semibold">{settings.subtitle}</span>
          </div>
          <div className="flex items-center gap-4">
            <a href={`tel:${settings.phone}`} className="flex items-center gap-1 hover:text-white transition-colors">
              <Phone className="w-3 h-3" />{settings.phone}
            </a>
            <Link href="/admin/login" className="flex items-center gap-1 text-slate-400 hover:text-amber-400 transition-colors">
              <ShieldCheck className="w-3.5 h-3.5" />Admin Kirish
            </Link>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 py-3 md:py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 -ml-2 rounded-md text-slate-700 hover:bg-slate-100 lg:hidden">
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 md:w-11 md:h-11 rounded-lg bg-red-700 text-white flex items-center justify-center font-black text-xl shadow-md group-hover:bg-red-800 transition-colors">UT</div>
            <div className="flex flex-col">
              <span className="text-xl md:text-2xl font-extrabold tracking-tight text-slate-900 leading-none group-hover:text-red-700 transition-colors">
                {settings.logoText || 'URGUT TODAY'}
              </span>
              <span className="text-[10px] font-bold tracking-widest text-red-700 uppercase mt-0.5">Samarqand • Urgut tumani</span>
            </div>
          </Link>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-bold text-slate-800">
          <Link href="/" className="hover:text-red-700 transition-colors">Bosh sahifa</Link>
          <Link href="/latest" className="hover:text-red-700 transition-colors">Eng so'nggi</Link>
          {categories.slice(0, 6).map(cat => (
            <Link key={cat.id} href={`/category/${cat.slug}`} className="hover:text-red-700 transition-colors">{cat.name}</Link>
          ))}
          <Link href="/about" className="hover:text-red-700 transition-colors">Biz haqimizda</Link>
        </nav>

        <div className="flex items-center gap-2">
          <button onClick={() => setIsSearchOpen(!isSearchOpen)} className="p-2 rounded-full text-slate-700 hover:bg-slate-100 transition-colors" aria-label="Qidirish">
            <Search className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Category Bar */}
      <div className="hidden lg:block bg-slate-100 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center gap-6 overflow-x-auto text-xs font-semibold text-slate-700">
          <span className="font-bold text-red-700 uppercase shrink-0">Kategoriyalar:</span>
          {categories.map(cat => (
            <Link key={cat.id} href={`/category/${cat.slug}`} className="hover:text-red-700 whitespace-nowrap transition-colors">
              {cat.name} ({cat.articleCount})
            </Link>
          ))}
        </div>
      </div>

      {/* Search Bar */}
      {isSearchOpen && (
        <div className="bg-slate-900 text-white p-4 border-t border-slate-800">
          <form onSubmit={handleSearch} className="max-w-3xl mx-auto flex gap-2">
            <input
              type="text"
              placeholder="Urgut yangiliklaridan qidirish..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              autoFocus
              className="flex-1 bg-slate-800 border border-slate-700 rounded-md px-4 py-2 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-red-500"
            />
            <button type="submit" className="bg-red-700 hover:bg-red-800 px-5 py-2 rounded-md font-bold text-sm transition-colors flex items-center gap-1">
              <Search className="w-4 h-4" /> Qidirish
            </button>
            <button type="button" onClick={() => setIsSearchOpen(false)} className="p-2 text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </form>
        </div>
      )}

      {/* Mobile Drawer */}
      {isMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex">
          <div className="w-4/5 max-w-sm bg-white h-full flex flex-col justify-between p-6 shadow-2xl">
            <div>
              <div className="flex justify-between items-center pb-4 border-b border-slate-200 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded bg-red-700 text-white flex items-center justify-center font-bold">UT</div>
                  <span className="font-extrabold text-slate-900">{settings.logoText}</span>
                </div>
                <button onClick={() => setIsMenuOpen(false)} className="p-1 rounded-md text-slate-500 hover:bg-slate-100">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <nav className="flex flex-col gap-2 font-bold text-slate-800 text-base">
                <Link href="/" className="px-3 py-2 rounded-md hover:bg-slate-100 hover:text-red-700">Bosh sahifa</Link>
                <Link href="/latest" className="px-3 py-2 rounded-md hover:bg-slate-100 hover:text-red-700">Eng so'nggi yangiliklar</Link>
                <div className="my-2 border-t border-slate-100 pt-2">
                  <span className="text-xs uppercase tracking-wider text-slate-400 font-bold px-3">Kategoriyalar</span>
                  <div className="mt-2 flex flex-col gap-1">
                    {categories.map(cat => (
                      <Link key={cat.id} href={`/category/${cat.slug}`} className="px-3 py-1.5 text-sm font-semibold text-slate-700 hover:bg-slate-100 hover:text-red-700 rounded-md flex justify-between">
                        <span>{cat.name}</span>
                        <span className="text-xs text-slate-400 font-normal">{cat.articleCount}</span>
                      </Link>
                    ))}
                  </div>
                </div>
                <div className="my-2 border-t border-slate-100 pt-2 flex flex-col gap-1">
                  <Link href="/about" className="px-3 py-2 rounded-md hover:bg-slate-100 hover:text-red-700">Biz haqimizda</Link>
                  <Link href="/contact" className="px-3 py-2 rounded-md hover:bg-slate-100 hover:text-red-700">Aloqa</Link>
                </div>
              </nav>
            </div>
            <div className="pt-4 border-t border-slate-200 flex flex-col gap-3">
              <Link href="/admin/login" className="w-full text-center bg-slate-900 text-white font-bold py-2.5 rounded-md hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 text-sm">
                <ShieldCheck className="w-4 h-4" /> Admin Paneli
              </Link>
              <p className="text-[11px] text-center text-slate-400">© 2026 Urgut Today</p>
            </div>
          </div>
          <div className="flex-1" onClick={() => setIsMenuOpen(false)} />
        </div>
      )}
    </header>
  )
}
