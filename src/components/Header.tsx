'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  Menu,
  X,
  Search,
  Phone,
  ShieldCheck,
  Sun,
  Moon,
  Download,
  Bookmark,
  ChevronDown,
  Calendar,
  CloudSun,
  DollarSign,
  Layers,
  Sparkles,
} from 'lucide-react'
import { useTheme } from 'next-themes'
import { usePWA } from './PWAContext'
import { getBookmarks } from '@/lib/bookmarks'

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
  if (!mounted) return <div className="w-8 h-8" />
  const isDark = theme === 'dark'
  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="w-8 h-8 rounded-full flex items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-amber-500 transition-colors"
      aria-label={isDark ? 'Kunduzgi rejim' : 'Tungi rejim'}
      title={isDark ? 'Kunduzgi rejim' : 'Tungi rejim'}
    >
      {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
    </button>
  )
}

interface HeaderProps {
  onOpenBookmarks?: () => void
}

export default function Header({ onOpenBookmarks }: HeaderProps) {
  const [categories, setCategories] = useState<Category[]>([])
  const [settings, setSettings] = useState<SiteSettings>({
    siteName: 'Urgut Today',
    logoText: 'URGUT TODAY',
    subtitle: 'Samarqand • Urgut tumani',
    phone: '+998 90 123 45 67',
  })
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isCatDropdownOpen, setIsCatDropdownOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [bookmarkCount, setBookmarkCount] = useState(0)
  const [widgets, setWidgets] = useState({
    weather: { temp: '+18°C', condition: 'Ochiq havo', city: 'Urgut' },
    currency: { usd: '12 850', diff: '' },
  })

  const dropdownRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()
  const router = useRouter()
  const { promptInstall, isInstalled, isInstallable } = usePWA()

  useEffect(() => {
    fetch('/api/categories').then((r) => r.json()).then(setCategories).catch(() => {})
    fetch('/api/settings').then((r) => r.json()).then(setSettings).catch(() => {})
    fetch('/api/widgets')
      .then((r) => r.json())
      .then((data) => {
        if (data.weather && data.currency) {
          setWidgets(data)
        }
      })
      .catch(() => {})

    const updateCount = () => setBookmarkCount(getBookmarks().length)
    updateCount()
    window.addEventListener('bookmarks-updated', updateCount)
    return () => window.removeEventListener('bookmarks-updated', updateCount)
  }, [])

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsCatDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    setIsMenuOpen(false)
    setIsSearchOpen(false)
    setIsCatDropdownOpen(false)
  }, [pathname])

  const handleSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      if (searchQuery.trim()) {
        router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
        setIsSearchOpen(false)
        setSearchQuery('')
      }
    },
    [searchQuery, router]
  )

  const today = new Date()
  const days = ['Yakshanba', 'Dushanba', 'Seshanba', 'Chorshanba', 'Payshanba', 'Juma', 'Shanba']
  const months = ['yanvar', 'fevral', 'mart', 'aprel', 'may', 'iyun', 'iyul', 'avgust', 'sentabr', 'oktabr', 'noyabr', 'dekabr']
  const todayFormatted = `${days[today.getDay()]}, ${today.getDate()}-${months[today.getMonth()]}, ${today.getFullYear()}`

  return (
    <header className="site-header sticky top-0 z-40 bg-white/95 dark:bg-[#161b22]/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors shadow-xs">
      {/* ── Top Sleek Bar (Clean, single-line, informative) ── */}
      <div className="hidden lg:block bg-slate-900 text-slate-300 text-xs py-1.5 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4 text-slate-400">
            <span className="font-semibold text-slate-300">{todayFormatted}</span>
            <span className="text-slate-700">|</span>
            <span className="flex items-center gap-1.5 hover:text-slate-200 transition-colors" title={`${widgets.weather.city}: ${widgets.weather.condition}`}>
              <CloudSun className="w-3.5 h-3.5 text-amber-400" /> {widgets.weather.city} {widgets.weather.temp}
            </span>
            <span className="text-slate-700">|</span>
            <span className="flex items-center gap-1.5 hover:text-slate-200 transition-colors" title="Markaziy Bank rasmiy kursi">
              <DollarSign className="w-3.5 h-3.5 text-emerald-400" /> USD: {widgets.currency.usd}
            </span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            {!isInstalled && isInstallable && (
              <button
                onClick={() => promptInstall()}
                className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-700 hover:bg-red-800 text-white font-bold text-[11px] transition-colors shadow-xs"
              >
                <Download className="w-3 h-3" /> Ilovani o&apos;rnatish
              </button>
            )}
            <a href={`tel:${settings.phone}`} className="flex items-center gap-1.5 hover:text-white transition-colors">
              <Phone className="w-3 h-3 text-red-500" /> {settings.phone}
            </a>
            <Link
              href="/admin/login"
              className="flex items-center gap-1.5 hover:text-white transition-colors text-slate-400"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-red-500" /> Admin Kirish
            </Link>
          </div>
        </div>
      </div>

      {/* ── Main Unified Header (NO redundant 3rd category row) ── */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Left: Mobile menu toggle + Brand Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-1.5 -ml-1.5 rounded-lg lg:hidden text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Menyu"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-gradient-to-tr from-red-700 to-red-600 text-white flex items-center justify-center font-black text-lg md:text-xl shadow-md group-hover:scale-105 transition-transform shrink-0">
              UT
            </div>
            <div className="flex flex-col">
              <span className="text-xl md:text-2xl font-black tracking-tight leading-none text-slate-900 dark:text-slate-100 group-hover:text-red-700 dark:group-hover:text-red-400 transition-colors">
                {settings.logoText || 'URGUT TODAY'}
              </span>
              <span className="text-[10px] font-bold tracking-widest text-red-600 dark:text-red-400 uppercase mt-0.5">
                Samarqand • Urgut tumani
              </span>
            </div>
          </Link>
        </div>

        {/* Center: Clean & non-redundant Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2 text-sm font-bold">
          <Link
            href="/"
            className={`px-3 py-1.5 rounded-xl transition-colors ${
              pathname === '/'
                ? 'text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-950/40'
                : 'text-slate-700 dark:text-slate-200 hover:text-red-700 dark:hover:text-red-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
            }`}
          >
            Bosh sahifa
          </Link>

          <Link
            href="/latest"
            className={`px-3 py-1.5 rounded-xl transition-colors ${
              pathname === '/latest'
                ? 'text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-950/40'
                : 'text-slate-700 dark:text-slate-200 hover:text-red-700 dark:hover:text-red-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
            }`}
          >
            Eng so&apos;nggi
          </Link>

          {/* Categories Dropdown (Sleek, Replaces clumsy 3rd row!) */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsCatDropdownOpen(!isCatDropdownOpen)}
              className={`px-3 py-1.5 rounded-xl transition-colors flex items-center gap-1.5 ${
                pathname.startsWith('/category')
                  ? 'text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-950/40'
                  : 'text-slate-700 dark:text-slate-200 hover:text-red-700 dark:hover:text-red-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
              }`}
            >
              <span>Kategoriyalar</span>
              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isCatDropdownOpen ? 'rotate-180 text-red-600' : ''}`} />
            </button>

            {isCatDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-64 rounded-2xl bg-white dark:bg-[#1c2128] border border-slate-200 dark:border-slate-800 shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 px-3 py-1.5">
                  Barcha bo&apos;limlar ({categories.length})
                </div>
                <div className="max-h-80 overflow-y-auto space-y-0.5">
                  {categories.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/category/${cat.slug}`}
                      onClick={() => setIsCatDropdownOpen(false)}
                      className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-red-50 dark:hover:bg-red-950/50 hover:text-red-700 dark:hover:text-red-400 transition-colors"
                    >
                      <span>{cat.name}</span>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500">
                        {cat.articleCount}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Quick Date Filter link */}
          <Link
            href="/latest?filter=date"
            className="px-3 py-1.5 rounded-xl text-slate-700 dark:text-slate-200 hover:text-red-700 dark:hover:text-red-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors flex items-center gap-1.5"
          >
            <Calendar className="w-4 h-4 text-red-600" />
            <span>Sana bo&apos;yicha</span>
          </Link>

          <Link
            href="/about"
            className={`px-3 py-1.5 rounded-xl transition-colors ${
              pathname === '/about'
                ? 'text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-950/40'
                : 'text-slate-700 dark:text-slate-200 hover:text-red-700 dark:hover:text-red-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
            }`}
          >
            Biz haqimizda
          </Link>

          <Link
            href="/contact"
            className={`px-3 py-1.5 rounded-xl transition-colors ${
              pathname === '/contact'
                ? 'text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-950/40'
                : 'text-slate-700 dark:text-slate-200 hover:text-red-700 dark:hover:text-red-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
            }`}
          >
            Bog&apos;lanish
          </Link>
        </nav>

        {/* Right: Quick actions (Search, Bookmarks, Theme toggle) */}
        <div className="flex items-center gap-2">
          {onOpenBookmarks && (
            <button
              onClick={onOpenBookmarks}
              className="relative p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Saqlangan xabarlar"
              aria-label="Saqlangan xabarlar"
            >
              <Bookmark className="w-5 h-5" />
              {bookmarkCount > 0 && (
                <span className="absolute top-0.5 right-0.5 bg-red-600 text-white text-[10px] font-black rounded-full h-4 min-w-[16px] px-1 flex items-center justify-center">
                  {bookmarkCount}
                </span>
              )}
            </button>
          )}

          <button
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Qidirish"
            title="Qidirish"
          >
            <Search className="w-5 h-5" />
          </button>

          <ThemeToggle />
        </div>
      </div>

      {/* ── Search Bar Dropdown ── */}
      {isSearchOpen && (
        <div className="p-3.5 bg-slate-100 dark:bg-[#0d1117] border-t border-slate-200 dark:border-slate-800 animate-in slide-in-from-top-2 duration-150">
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto flex gap-2">
            <input
              type="text"
              placeholder="Urgut yangiliklaridan qidirish..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
              className="flex-1 rounded-xl px-4 py-2.5 text-xs sm:text-sm bg-white dark:bg-[#1c2128] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-red-600"
            />
            <button
              type="submit"
              className="bg-red-700 hover:bg-red-800 text-white px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <Search className="w-4 h-4" /> Qidirish
            </button>
            <button
              type="button"
              onClick={() => setIsSearchOpen(false)}
              className="p-2 text-slate-500 hover:text-red-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </form>
        </div>
      )}

      {/* ── Mobile Drawer ── */}
      {isMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 z-50 flex bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setIsMenuOpen(false)}
        >
          <div
            className="w-4/5 max-w-sm h-full bg-white dark:bg-[#161b22] border-r border-slate-200 dark:border-slate-800 p-6 shadow-2xl flex flex-col justify-between overflow-y-auto text-slate-900 dark:text-slate-100"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <div className="flex justify-between items-center pb-4 mb-4 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-red-700 text-white flex items-center justify-center font-black">
                    UT
                  </div>
                  <div>
                    <span className="font-extrabold text-base block">{settings.logoText}</span>
                    <span className="text-[10px] text-slate-500 uppercase">Yangiliklar ilovasi</span>
                  </div>
                </div>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Mobile Navigation Links */}
              <div className="space-y-1 mb-6">
                <Link
                  href="/"
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold text-sm text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors"
                >
                  Bosh sahifa
                </Link>
                <Link
                  href="/latest"
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold text-sm text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors"
                >
                  Eng so&apos;nggi yangiliklar
                </Link>
                <Link
                  href="/latest?filter=date"
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold text-sm text-red-700 dark:text-red-400 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors"
                >
                  <Calendar className="w-4 h-4" /> Sana bo&apos;yicha saralash
                </Link>
                <Link
                  href="/about"
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold text-sm text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors"
                >
                  Biz haqimizda
                </Link>
                <Link
                  href="/contact"
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold text-sm text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors"
                >
                  Bog&apos;lanish
                </Link>
              </div>

              {/* Mobile Categories Accordion/List */}
              <div className="border-t border-slate-200 dark:border-slate-800 pt-4 mb-4">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3 px-3 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-red-600" /> Bo&apos;limlar ({categories.length})
                </h4>
                <div className="space-y-1">
                  {categories.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/category/${cat.slug}`}
                      className="flex items-center justify-between px-3 py-2 rounded-lg text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors"
                    >
                      <span>{cat.name}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500">
                        {cat.articleCount}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Mavzuni tanlang:</span>
                <ThemeToggle />
              </div>
              <Link
                href="/admin/login"
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                <ShieldCheck className="w-4 h-4 text-red-500" /> Admin Kirish
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
