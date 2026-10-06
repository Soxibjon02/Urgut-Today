'use client'

import React, { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { NewsCard } from '@/components/NewsCard'
import { Sparkles, Layers } from 'lucide-react'

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

interface Category {
  id: number
  name: string
  slug: string
  description: string
  articleCount: number
}

export default function CategoryPage() {
  const params = useParams()
  const slug = params?.slug as string

  const [category, setCategory] = useState<Category | null>(null)
  const [articles, setArticles] = useState<ArticleList[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!slug) return

    const fetchData = async () => {
      try {
        setLoading(true)
        const catRes = await fetch('/api/categories')
        const cats: Category[] = await catRes.json()
        const found = cats.find((c) => c.slug.toLowerCase() === slug.toLowerCase())
        setCategory(found || null)

        const newsRes = await fetch(`/api/news?categorySlug=${slug}&page=1&pageSize=20`)
        const newsData = await newsRes.json()
        setArticles(newsData.items || [])
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [slug])

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
        <div className="skeleton h-10 w-1/4" />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-[#1c2128] rounded-2xl border border-slate-200 dark:border-slate-800 p-4 space-y-3">
              <div className="skeleton h-44 w-full rounded-xl" />
              <div className="skeleton h-5 w-3/4" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 md:py-10 space-y-8">
      <div className="border-b-4 border-red-700 pb-4">
        <div className="flex items-center gap-1.5 text-xs font-black uppercase text-red-600 dark:text-red-400 mb-1">
          <Layers className="w-4 h-4" /> Kategoriya
        </div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black uppercase text-slate-900 dark:text-slate-100 tracking-tight">
          {category ? category.name : slug}
        </h1>
        {category?.description && (
          <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm mt-1">
            {category.description}
          </p>
        )}
      </div>

      {articles.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-[#1c2128] rounded-2xl border border-slate-200 dark:border-slate-800 p-8 text-slate-500">
          <p className="font-semibold text-base">Ushbu kategoriyada hozircha yangiliklar yo&apos;q.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {articles.map((art) => (
            <NewsCard key={art.id} article={art} variant="standard" />
          ))}
        </div>
      )}
    </div>
  )
}
