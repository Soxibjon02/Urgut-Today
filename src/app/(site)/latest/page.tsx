'use client'

import React, { useState, useEffect, useCallback, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { NewsCard } from '@/components/NewsCard'
import { Flame, Clock, Calendar } from 'lucide-react'
import { DateNewsFilter, DateFilterState } from '@/components/DateNewsFilter'

interface ArticleList {
  id: number
  title: string
  slug: string
  shortDescription: string
  coverImageUrl?: string
  categoryId: number
  categoryName: string
  categorySlug: string
  author: string
  status: number
  isFeatured: boolean
  viewCount: number
  publishedAt: string
}

function LatestNewsContent() {
  const searchParams = useSearchParams()
  const [articles, setArticles] = useState<ArticleList[]>([])
  const [loading, setLoading] = useState(true)
  const [dateFilters, setDateFilters] = useState<DateFilterState>({ preset: 'all' })

  const fetchArticles = useCallback(async (filters: DateFilterState) => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      params.set('page', '1')
      params.set('pageSize', '30')

      if (filters.preset && filters.preset !== 'all') {
        params.set('datePreset', filters.preset)
      }
      if (filters.date) {
        params.set('date', filters.date)
      }
      if (filters.startDate) {
        params.set('startDate', filters.startDate)
      }
      if (filters.endDate) {
        params.set('endDate', filters.endDate)
      }

      const res = await fetch(`/api/news?${params.toString()}`)
      const data = await res.json()
      setArticles(data.items || [])
    } catch (err) {
      console.error(err)
      setArticles([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchArticles(dateFilters)
  }, [dateFilters, fetchArticles])

  const handleFilterChange = (newFilters: DateFilterState) => {
    setDateFilters(newFilters)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 md:py-10 space-y-6 sm:space-y-8">
      {/* Page Title */}
      <div className="border-b-4 border-red-700 pb-4">
        <div className="flex items-center gap-2 text-red-600 dark:text-red-400 font-extrabold text-xs uppercase tracking-wider mb-1">
          <Flame className="w-4 h-4" /> Jonli Lenta
        </div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black uppercase text-slate-900 dark:text-slate-100 tracking-tight">
          Eng So&apos;nggi Yangiliklar
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm mt-1">
          Urgut tumani va Samarqand viloyatidagi yangiliklarni sana va vaqt bo&apos;yicha saralang
        </p>
      </div>

      {/* Date Filter Component */}
      <DateNewsFilter onFilterChange={handleFilterChange} activeFilters={dateFilters} />

      {/* News Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="bg-white dark:bg-[#1c2128] rounded-2xl border border-slate-200 dark:border-slate-800 p-4 space-y-3"
            >
              <div className="skeleton h-44 w-full rounded-xl" />
              <div className="skeleton h-5 w-3/4" />
              <div className="skeleton h-4 w-1/2" />
            </div>
          ))}
        </div>
      ) : articles.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-[#1c2128] rounded-2xl border border-slate-200 dark:border-slate-800 p-8 text-slate-500">
          <Calendar className="w-12 h-12 mx-auto stroke-1 mb-2 opacity-50 text-red-600" />
          <p className="text-base font-bold text-slate-800 dark:text-slate-200">
            Tanlangan sana bo&apos;yicha yangiliklar topilmadi
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Boshqa sana oralig&apos;ini tanlang yoki «Barchasi» tugmasini bosing.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {articles.map((art) => (
            <NewsCard key={art.id} article={art} variant="standard" />
          ))}
        </div>
      )}
    </div>
  )
}

export default function LatestNewsPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="skeleton h-10 w-48 mb-6" />
          <div className="skeleton h-44 w-full" />
        </div>
      }
    >
      <LatestNewsContent />
    </Suspense>
  )
}
