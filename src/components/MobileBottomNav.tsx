'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Flame, Search, Bookmark, Download, Check } from 'lucide-react'
import { usePWA } from './PWAContext'
import { getBookmarks } from '@/lib/bookmarks'

interface MobileBottomNavProps {
  onOpenBookmarks: () => void
  onOpenSearch: () => void
}

export function MobileBottomNav({ onOpenBookmarks, onOpenSearch }: MobileBottomNavProps) {
  const pathname = usePathname()
  const { isInstalled, promptInstall } = usePWA()
  const [bookmarkCount, setBookmarkCount] = useState(0)

  useEffect(() => {
    const updateCount = () => setBookmarkCount(getBookmarks().length)
    updateCount()
    window.addEventListener('bookmarks-updated', updateCount)
    return () => window.removeEventListener('bookmarks-updated', updateCount)
  }, [])

  // Hide on admin routes
  if (pathname.startsWith('/admin')) {
    return null
  }

  const isHome = pathname === '/'
  const isLatest = pathname === '/latest'
  const isSearch = pathname.startsWith('/search')

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-[#161b22]/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] pb-[max(env(safe-area-inset-bottom),0.5rem)] pt-1.5 transition-colors">
      <div className="max-w-md mx-auto grid grid-cols-5 px-2">
        {/* 1. Home */}
        <Link
          href="/"
          className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all ${
            isHome
              ? 'text-red-700 dark:text-red-400 font-extrabold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Home className={`w-5 h-5 ${isHome ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
          <span className="text-[10px] mt-1 tracking-tight">Asosiy</span>
        </Link>

        {/* 2. Latest */}
        <Link
          href="/latest"
          className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all ${
            isLatest
              ? 'text-red-700 dark:text-red-400 font-extrabold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Flame className={`w-5 h-5 ${isLatest ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
          <span className="text-[10px] mt-1 tracking-tight">So&apos;nggi</span>
        </Link>

        {/* 3. Search */}
        <button
          onClick={onOpenSearch}
          className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all ${
            isSearch
              ? 'text-red-700 dark:text-red-400 font-extrabold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <Search className="w-5 h-5 stroke-[1.8]" />
          <span className="text-[10px] mt-1 tracking-tight">Qidiruv</span>
        </button>

        {/* 4. Bookmarks */}
        <button
          onClick={onOpenBookmarks}
          className="relative flex flex-col items-center justify-center py-1 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-all"
        >
          <div className="relative">
            <Bookmark className="w-5 h-5 stroke-[1.8]" />
            {bookmarkCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-red-700 text-white text-[9px] font-black rounded-full h-4 min-w-[16px] px-1 flex items-center justify-center">
                {bookmarkCount}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-1 tracking-tight">Saqlangan</span>
        </button>

        {/* 5. Install App */}
        <button
          onClick={() => promptInstall()}
          className="flex flex-col items-center justify-center py-1 rounded-xl text-slate-500 dark:text-slate-400 hover:text-red-700 dark:hover:text-red-400 transition-all group"
        >
          <div className="relative">
            {isInstalled ? (
              <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <Check className="w-3.5 h-3.5 stroke-[2.5]" />
              </div>
            ) : (
              <div className="relative">
                <Download className="w-5 h-5 stroke-[2] text-red-600 dark:text-red-400 animate-pulse" />
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-red-600 animate-ping" />
              </div>
            )}
          </div>
          <span className="text-[10px] mt-1 font-bold text-red-700 dark:text-red-400 tracking-tight">
            {isInstalled ? 'Ilova' : "O'rnatish"}
          </span>
        </button>
      </div>
    </div>
  )
}
