'use client'

import React, { useState, useEffect } from 'react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { BreakingNewsTicker } from '@/components/BreakingNewsTicker'
import { MobileBottomNav } from '@/components/MobileBottomNav'
import { BookmarksDrawer } from '@/components/BookmarksDrawer'
import { InstallModal } from '@/components/InstallModal'
import { OfflineIndicator } from '@/components/OfflineIndicator'
import { useRouter } from 'next/navigation'

export function SiteShell({ children }: { children: React.ReactNode }) {
  const [isBookmarksOpen, setIsBookmarksOpen] = useState(false)
  const [tickerArticles, setTickerArticles] = useState<{ id: number; title: string; slug: string }[]>([])
  const router = useRouter()

  useEffect(() => {
    fetch('/api/news?page=1&pageSize=5')
      .then((r) => r.json())
      .then((data) => {
        if (data.items) {
          setTickerArticles(
            data.items.map((a: { id: number; title: string; slug: string }) => ({
              id: a.id,
              title: a.title,
              slug: a.slug,
            }))
          )
        }
      })
      .catch(() => {})
  }, [])

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors duration-300">
      <OfflineIndicator />
      <BreakingNewsTicker latestArticles={tickerArticles} />
      <Header onOpenBookmarks={() => setIsBookmarksOpen(true)} />

      <main className="flex-1 pb-20 lg:pb-8">{children}</main>

      <Footer />

      {/* Mobile App Navigation */}
      <MobileBottomNav
        onOpenBookmarks={() => setIsBookmarksOpen(true)}
        onOpenSearch={() => router.push('/search')}
      />

      {/* Bookmarks Drawer */}
      <BookmarksDrawer isOpen={isBookmarksOpen} onClose={() => setIsBookmarksOpen(false)} />

      {/* PWA Install Modal */}
      <InstallModal />
    </div>
  )
}
