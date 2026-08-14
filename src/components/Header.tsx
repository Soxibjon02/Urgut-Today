'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Menu, X, Search, Phone, ShieldCheck, Sun, Moon } from 'lucide-react'
import { useTheme } from 'next-themes'

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

function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted) return <div className="w-9 h-9" />
  const isDark = theme === 'dark'
  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="theme-toggle"
      aria-label={isDark ? 'Kunduzgi rejim' : 'Tungi rejim'}
      title={isDark ? 'Kunduzgi rejim' : 'Tungi rejim'}
    >
      {isDark
        ? <Sun className="w-4 h-4" style={{ color: '#fbbf24' }} />
        : <Moon className="w-4 h-4" style={{ color: '#475569' }} />
      }
    </button>
  )
}

export default function Header() {
  const [categories, setCategories] = useState<Category[]>([])
  const [settings, setSettings] = useState<SiteSettings>({
    siteName: 'Urgut Today',
    logoText: 'URGUT TODAY',
    subtitle: 'Samarqand • Urgut tumani',
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
    <header className="site-header sticky top-0 z-40 shadow-sm">

      {/* ── Top Utility Bar ── */}
      <div className="site-topbar text-xs py-1.5 px-4 hidden md:flex">
        <div className="max-w-7xl w-full mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <span className="capitalize font-medium">{todayDate}</span>
            <span style={{ color: 'var(--border-strong)' }}>|</span>
            <span className="font-semibold">{settings.subtitle} — Mahalliy yangiliklar portali</span>
          </div>
          <div className="flex items-center gap-4">
            <a href={`tel:${settings.phone}`} className="flex items-center gap-1">
              <Phone className="w-3 h-3" />{settings.phone}
            </a>
            <Link href="/admin/login" className="flex items-center gap-1" style={{ color: 'var(--text-topbar-sub)' }}>
              <ShieldCheck className="w-3.5 h-3.5" />Admin Kirish
            </Link>
          </div>
        </div>
      </div>

      {/* ── Main Header ── */}
      <div className="max-w-7xl mx-auto px-4 py-3 md:py-4 flex items-center justify-between">

        {/* Left: hamburger + logo */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 -ml-2 rounded-md lg:hidden transition-colors"
            style={{ color: 'var(--text-secondary)', backgroundColor: 'transparent' }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--bg-secondary)')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 md:w-11 md:h-11 rounded-lg bg-red-700 text-white flex items-center justify-center font-black text-xl shadow-md group-hover:bg-red-800 transition-colors shrink-0">
              UT
            </div>
            <div className="flex flex-col">
              <span
                className="text-xl md:text-2xl font-extrabold tracking-tight leading-none group-hover:text-red-700 transition-colors"
                style={{ color: 'var(--text-primary)' }}
              >
                {settings.logoText || 'URGUT TODAY'}
              </span>
              <span className="text-[10px] font-bold tracking-widest text-red-700 uppercase mt-0.5">
                Samarqand • Urgut tumani
              </span>
            </div>
          </Link>
        </div>

        {/* Center: desktop nav */}
        <nav className="hidden lg:flex items-center gap-5 text-sm font-bold">
          {[
            { href: '/', label: "Bosh sahifa" },
            { href: '/latest', label: "Eng so'nggi" },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="hover:text-red-700 transition-colors"
              style={{ color: 'var(--text-primary)' }}
            >
              {label}
            </Link>
          ))}
          {categories.slice(0, 5).map(cat => (
            <Link
              key={cat.id}
              href={`/category/${cat.slug}`}
              className="hover:text-red-700 transition-colors"
              style={{ color: 'var(--text-primary)' }}
            >
              {cat.name}
            </Link>
          ))}
          <Link href="/about" className="hover:text-red-700 transition-colors" style={{ color: 'var(--text-primary)' }}>
            Biz haqimizda
          </Link>
        </nav>

        {/* Right: search + theme toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="p-2 rounded-full transition-colors"
            style={{ color: 'var(--text-secondary)' }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--bg-secondary)')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
            aria-label="Qidirish"
          >
            <Search className="w-5 h-5" />
          </button>
          <ThemeToggle />
        </div>
      </div>

      {/* ── Category Bar ── */}
      <div className="site-catbar hidden lg:block">
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center gap-6 overflow-x-auto text-xs font-semibold">
          <span className="font-bold text-red-700 uppercase shrink-0">Kategoriyalar:</span>
          {categories.map(cat => (
            <Link key={cat.id} href={`/category/${cat.slug}`} className="whitespace-nowrap">
              {cat.name} ({cat.articleCount})
            </Link>
          ))}
        </div>
      </div>

      {/* ── Search Overlay ── */}
      {isSearchOpen && (
        <div style={{ backgroundColor: 'var(--bg-topbar)', borderTop: '1px solid var(--border-color)' }} className="p-4">
          <form onSubmit={handleSearch} className="max-w-3xl mx-auto flex gap-2">
            <input
              type="text"
              placeholder="Urgut yangiliklaridan qidirish..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              autoFocus
              style={{
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-primary)',
              }}
              className="flex-1 rounded-md px-4 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:border-red-500"
            />
            <button type="submit" className="bg-red-700 hover:bg-red-800 text-white px-5 py-2 rounded-md font-bold text-sm transition-colors flex items-center gap-1">
              <Search className="w-4 h-4" /> Qidirish
            </button>
            <button type="button" onClick={() => setIsSearchOpen(false)} style={{ color: 'var(--text-muted)' }} className="p-2 hover:text-red-700 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </form>
        </div>
      )}

      {/* ── Mobile Drawer ── */}
      {isMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex" style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}>
          <div className="mobile-drawer w-4/5 max-w-sm h-full flex flex-col justify-between p-6 shadow-2xl overflow-y-auto">
            <div>
              {/* Drawer header */}
              <div className="flex justify-between items-center pb-4 mb-4" style={{ borderBottom: '1px solid var(--border-color)' }}>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded bg-red-700 text-white flex items-center justify-center font-bold">UT</div>
                  <span className="font-extrabold" style={{ color: 'var(--text-primary)' }}>{settings.logoText}</span>
                </div>
                <div className="flex items-center gap-2">
                  <ThemeToggle />
                  <button
                    onClick={() => setIsMenuOpen(false)}
                    className="p-1 rounded-md transition-colors"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Nav links */}
              <nav className="flex flex-col gap-1">
                {[
                  { href: '/', label: 'Bosh sahifa' },
                  { href: '/latest', label: "Eng so'nggi yangiliklar" },
                ].map(({ href, label }) => (
                  <Link
                    key={href}
                    href={href}
                    className="px-3 py-2 rounded-md font-bold text-base transition-colors hover:text-red-700"
                    style={{ color: 'var(--text-primary)' }}
                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--bg-secondary)')}
                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    {label}
                  </Link>
                ))}

                <div className="my-3" style={{ borderTop: '1px solid var(--border-color)' }} />
                <span className="text-xs uppercase tracking-wider font-bold px-3" style={{ color: 'var(--text-muted)' }}>Kategoriyalar</span>
                <div className="mt-1 flex flex-col gap-0.5">
                  {categories.map(cat => (
                    <Link
                      key={cat.id}
                      href={`/category/${cat.slug}`}
                      className="px-3 py-1.5 text-sm font-semibold rounded-md flex justify-between transition-colors hover:text-red-700"
                      style={{ color: 'var(--text-secondary)' }}
                      onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--bg-secondary)')}
                      onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      <span>{cat.name}</span>
                      <span style={{ color: 'var(--text-muted)' }} className="text-xs font-normal">{cat.articleCount}</span>
                    </Link>
                  ))}
                </div>

                <div className="my-3" style={{ borderTop: '1px solid var(--border-color)' }} />
                {[
                  { href: '/about', label: 'Biz haqimizda' },
                  { href: '/contact', label: 'Aloqa' },
                ].map(({ href, label }) => (
                  <Link
                    key={href}
                    href={href}
                    className="px-3 py-2 rounded-md font-bold text-base transition-colors hover:text-red-700"
                    style={{ color: 'var(--text-primary)' }}
                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--bg-secondary)')}
                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    {label}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Footer of drawer */}
            <div className="pt-4 flex flex-col gap-3" style={{ borderTop: '1px solid var(--border-color)' }}>
              <Link
                href="/admin/login"
                className="w-full text-center text-white font-bold py-2.5 rounded-md flex items-center justify-center gap-2 text-sm transition-colors"
                style={{ backgroundColor: 'var(--text-primary)' }}
              >
                <ShieldCheck className="w-4 h-4" /> Admin Paneli
              </Link>
              <p className="text-[11px] text-center" style={{ color: 'var(--text-muted)' }}>© 2026 Urgut Today</p>
            </div>
          </div>
          <div className="flex-1" onClick={() => setIsMenuOpen(false)} />
        </div>
      )}
    </header>
  )
}
