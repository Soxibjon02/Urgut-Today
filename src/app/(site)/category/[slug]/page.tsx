'use client'

import React, { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Layers, LayoutTemplate, SlidersHorizontal, Sparkles } from 'lucide-react'
import {
  NewsLayoutRenderer,
  LayoutType,
  LAYOUT_OPTIONS,
  ArticleItem,
} from '@/components/news-layouts/NewsLayoutTemplates'

interface Category {
  id: number
  name: string
  slug: string
  description: string
  order: number
  layoutType: LayoutType
  articleCount: number
}

export default function CategoryPage() {
  const params = useParams()
  const slug = params?.slug as string

  const [category, setCategory] = useState<Category | null>(null)
  const [articles, setArticles] = useState<ArticleItem[]>([])
  const [loading, setLoading] = useState(true)
  const [activeLayout, setActiveLayout] = useState<LayoutType>('bbc-lead')

  useEffect(() => {
    if (!slug) return

    const fetchData = async () => {
      try {
        setLoading(true)
        const catRes = await fetch('/api/categories')
        const cats: Category[] = await catRes.json()
        const found = cats.find((c) => c.slug.toLowerCase() === slug.toLowerCase())
        if (found) {
          setCategory(found)
          if (found.layoutType) {
            setActiveLayout(found.layoutType)
          }
        }

        const newsRes = await fetch(`/api/news?categorySlug=${slug}&page=1&pageSize=24`)
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
            <div
              key={i}
              className="bg-white dark:bg-[#1c2128] rounded-2xl border border-slate-200 dark:border-slate-800 p-4 space-y-3"
            >
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
      {/* Category Header with Layout Controls */}
      <div className="border-b-4 border-red-700 pb-5 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-black uppercase text-red-600 dark:text-red-400 mb-1">
            <Layers className="w-4 h-4" /> Kategoriya sahifasi
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black uppercase text-slate-900 dark:text-slate-100 tracking-tight">
            {category ? category.name : slug}
          </h1>
          {category?.description && (
            <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
              {category.description}
            </p>
          )}
        </div>

        {/* Layout Style Switcher Tabs */}
        {articles.length > 0 && (
          <div className="bg-slate-100 dark:bg-[#161b22] p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center gap-1 overflow-x-auto self-start md:self-end">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 px-2 flex items-center gap-1">
              <SlidersHorizontal className="w-3 h-3" /> Ko&apos;rinish:
            </span>
            {LAYOUT_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                onClick={() => setActiveLayout(opt.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all min-w-max ${
                  activeLayout === opt.id
                    ? 'bg-red-700 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-white dark:hover:bg-slate-800'
                }`}
                title={opt.description}
              >
                {opt.badge}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main Content Rendered in chosen Layout */}
      {articles.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-[#1c2128] rounded-2xl border border-slate-200 dark:border-slate-800 p-8 text-slate-500">
          <p className="font-semibold text-base">Ushbu kategoriyada hozircha yangiliklar yo&apos;q.</p>
        </div>
      ) : (
        <NewsLayoutRenderer layoutType={activeLayout} articles={articles} />
      )}
    </div>
  )
}
