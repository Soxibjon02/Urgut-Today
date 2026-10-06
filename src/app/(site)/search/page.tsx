'use client'

import React, { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { NewsCard } from '@/components/NewsCard'
import { Search, SearchX } from 'lucide-react'

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

function SearchContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const initialQuery = searchParams.get('q') || ''
  const [searchInput, setSearchInput] = useState(initialQuery)
  const [articles, setArticles] = useState<ArticleList[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setSearchInput(initialQuery)
    if (!initialQuery) {
      setArticles([])
      setLoading(false)
      return
    }

    const fetchSearch = async () => {
      try {
        setLoading(true)
        const res = await fetch(`/api/news?search=${encodeURIComponent(initialQuery)}&page=1&pageSize=24`)
        const data = await res.json()
        setArticles(data.items || [])
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchSearch()
  }, [initialQuery])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchInput.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchInput.trim())}`)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 md:py-10 space-y-8">
      {/* Search Input Box */}
      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
        <div className="relative flex items-center">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Qidirilayotgan mavzu yoki so'zni yozing..."
            className="w-full pl-12 pr-28 py-3.5 rounded-2xl bg-white dark:bg-[#1c2128] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-red-600 shadow-sm text-sm"
          />
          <Search className="w-5 h-5 text-slate-400 absolute left-4" />
          <button
            type="submit"
            className="absolute right-2 px-5 py-2 rounded-xl bg-red-700 hover:bg-red-800 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-xs"
          >
            Qidirish
          </button>
        </div>
      </form>

      {/* Results Header */}
      <div className="border-b-4 border-red-700 pb-4">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 dark:text-slate-100">
          Qidiruv natijalari: {initialQuery ? <span className="text-red-700 dark:text-red-400">&quot;{initialQuery}&quot;</span> : <span className="text-slate-400">barcha xabarlar</span>}
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm mt-1">
          Topilgan yangiliklar soni: {articles.length} ta
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-[#1c2128] rounded-2xl border border-slate-200 dark:border-slate-800 p-4 space-y-3">
              <div className="skeleton h-44 w-full rounded-xl" />
              <div className="skeleton h-5 w-3/4" />
            </div>
          ))}
        </div>
      ) : articles.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-[#1c2128] rounded-2xl border border-slate-200 dark:border-slate-800 p-8 text-slate-500">
          <SearchX className="w-12 h-12 mx-auto stroke-1 mb-2 opacity-50" />
          <p className="font-semibold text-base">Hech narsa topilmadi</p>
          <p className="text-xs mt-1">Boshqa kalit so&apos;z yoki kategoriya orqali qidirib ko&apos;ring.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {articles.map((art) => (
            <NewsCard key={art.id} article={art} variant="standard" />
          ))}
        </div>
      )}
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="skeleton h-12 w-full max-w-xl mx-auto rounded-2xl" />
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  )
}
