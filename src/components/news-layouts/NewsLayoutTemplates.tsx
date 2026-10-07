'use client'

import React from 'react'
import Link from 'next/link'
import {
  Flame,
  Clock,
  Eye,
  Heart,
  TrendingUp,
  Bookmark,
  Share2,
  ArrowRight,
  Layers,
  Sparkles,
  ChevronRight,
  BarChart2,
} from 'lucide-react'
import { NewsCard, CategoryBadge } from '@/components/NewsCard'

export interface ArticleItem {
  id: number
  title: string
  slug: string
  shortDescription: string
  coverImageUrl?: string
  categoryId: number
  categoryName: string
  categorySlug: string
  author?: string
  status: number
  isFeatured: boolean
  viewCount: number
  likeCount?: number
  publishedAt: string
}

export type LayoutType =
  | 'bbc-lead'
  | 'cnn-magazine'
  | 'editorial-sidebar'
  | 'cards-grid'
  | 'compact-list'

export const LAYOUT_OPTIONS = [
  {
    id: 'bbc-lead' as LayoutType,
    name: 'BBC Lead & Analysis',
    badge: 'BBC Uslubi',
    description: '1 ta Katta Asosiy xabar + 3 ta Yonidagi Qisqa xabar + 3 tahliliy karta',
  },
  {
    id: 'cnn-magazine' as LayoutType,
    name: 'CNN Bento & Highlights',
    badge: 'CNN Uslubi',
    description: "Bento vizual grid + Muhim urg'ular satri + Jurnalistik 3 ustun",
  },
  {
    id: 'editorial-sidebar' as LayoutType,
    name: 'Reuters / NYT Editorial & Sidebar',
    badge: 'Reuters Uslubi',
    description: "Chapda boy maqolalar lentasi + O'ngda eng o'qilganlar (Trending)",
  },
  {
    id: 'cards-grid' as LayoutType,
    name: 'Zamonaviy Kartalar Paneli',
    badge: 'Klassik Grid',
    description: "3 va 4 ustunli zamonaviy ko'rgazmali kartalar to'plami",
  },
  {
    id: 'compact-list' as LayoutType,
    name: 'Zich Vaqt Lentasi (Tezkor / Sport)',
    badge: 'Tezkor Lenta',
    description: "Aniq vaqt ko'rsatkichlari bilan boyitilgan zich xronologik oqim",
  },
]

function formatDate(dateStr: string) {
  try {
    const d = new Date(dateStr)
    return d.toLocaleDateString('uz-UZ', { day: 'numeric', month: 'short' })
  } catch {
    return dateStr
  }
}

function formatTime(dateStr: string) {
  try {
    const d = new Date(dateStr)
    return d.toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' })
  } catch {
    return ''
  }
}

// ─────────────────────────────────────────────────────────────
// 1. BBC LEAD & ANALYSIS TEMPLATE
// ─────────────────────────────────────────────────────────────
export function BBCLeadTemplate({
  articles,
  showSideList = false,
}: {
  articles: ArticleItem[]
  showSideList?: boolean
}) {
  if (articles.length === 0) return null

  const hero = articles[0]
  const sideArticles = articles.slice(1, 4)
  const spotlightArticles = showSideList ? articles.slice(4, 7) : articles.slice(1, 4)
  const remaining = showSideList ? articles.slice(7) : articles.slice(4)

  return (
    <div className="space-y-10">
      {/* BBC Top Block: Full-width Hero or 8+4 columns if showSideList is enabled */}
      {showSideList ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          <div className="lg:col-span-8">
            <NewsCard article={hero} variant="featured" />
          </div>

          <div className="lg:col-span-4 bg-white dark:bg-[#1c2128] rounded-2xl p-5 border border-slate-200 dark:border-slate-800 flex flex-col justify-between shadow-xs">
            <div>
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100 dark:border-slate-800">
                <span className="text-xs font-black uppercase tracking-wider text-red-700 dark:text-red-400 flex items-center gap-1.5">
                  <Flame className="w-4 h-4" /> DOLZARB VOQEALAR
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-400">
                  Top 3
                </span>
              </div>

              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {sideArticles.map((art, idx) => (
                  <div key={art.id} className="py-3.5 first:pt-1 last:pb-1 group">
                    <div className="flex items-center gap-2 mb-1 text-[11px] text-slate-400">
                      <span className="w-5 h-5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-black text-xs flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <span className="font-bold text-red-700 dark:text-red-400 uppercase text-[10px]">
                        {art.categoryName}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {formatDate(art.publishedAt)}
                      </span>
                    </div>
                    <Link href={`/news/${art.slug}`}>
                      <h3 className="text-sm font-extrabold text-slate-900 dark:text-slate-100 group-hover:text-red-700 dark:group-hover:text-red-400 transition-colors line-clamp-2 leading-snug">
                        {art.title}
                      </h3>
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 mt-3 text-right">
              <span className="text-[11px] font-bold text-slate-400">Xolis va tahliliy xabarlar</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full">
          <NewsCard article={hero} variant="featured" />
        </div>
      )}

      {/* BBC Spotlight 3-Column Strip */}
      {spotlightArticles.length > 0 && (
        <div className="border-t-2 border-b-2 border-slate-200 dark:border-slate-800 py-6">
          <div className="text-xs font-black uppercase tracking-wider text-slate-500 mb-4 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" /> MUHIM MAVZULAR SHARHI
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {spotlightArticles.map((art) => (
              <div key={art.id} className="group flex flex-col justify-between">
                <div>
                  <div className="aspect-[16/9] rounded-xl overflow-hidden mb-3 bg-slate-900">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={art.coverImageUrl || '/placeholder.jpg'}
                      alt={art.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <span className="text-[10px] font-bold text-red-700 dark:text-red-400 uppercase">
                    {art.categoryName}
                  </span>
                  <Link href={`/news/${art.slug}`}>
                    <h4 className="text-sm font-extrabold text-slate-900 dark:text-slate-100 group-hover:text-red-700 transition-colors line-clamp-2 mt-1 leading-snug">
                      {art.title}
                    </h4>
                  </Link>
                  <p className="text-xs text-slate-500 line-clamp-2 mt-1.5 leading-relaxed">
                    {art.shortDescription}
                  </p>
                </div>
                <div className="mt-3 text-[11px] text-slate-400 flex items-center gap-2">
                  <Clock className="w-3 h-3" /> {formatDate(art.publishedAt)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Remaining in 4 columns */}
      {remaining.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {remaining.map((art) => (
            <NewsCard key={art.id} article={art} variant="standard" />
          ))}
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// 2. CNN BENTO & MAGAZINE TEMPLATE
// ─────────────────────────────────────────────────────────────
export function CNNMagazineTemplate({ articles }: { articles: ArticleItem[] }) {
  if (articles.length === 0) return null

  const hero = articles[0]
  const subFeatured = articles.slice(1, 3)
  const tickerHighlights = articles.slice(3, 7)
  const gridNews = articles.slice(7)

  return (
    <div className="space-y-8">
      {/* CNN Bento Visual Box */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Massive Headline Visual */}
        <div className="lg:col-span-7 relative rounded-3xl overflow-hidden min-h-[360px] md:min-h-[460px] group bg-slate-950 flex flex-col justify-end p-6 md:p-10 shadow-lg">
          {hero.coverImageUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={hero.coverImageUrl}
              alt={hero.title}
              className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-105 group-hover:opacity-90 transition-all duration-700"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />

          <div className="relative z-10 space-y-3">
            <div className="flex items-center gap-2">
              <span className="bg-red-700 text-white font-black text-xs px-3 py-1 rounded-md uppercase tracking-wider">
                CNN ASOSIY
              </span>
              <span className="text-xs text-slate-300 font-bold uppercase tracking-wider">
                {hero.categoryName}
              </span>
            </div>

            <Link href={`/news/${hero.slug}`}>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white hover:text-red-400 transition-colors leading-tight">
                {hero.title}
              </h2>
            </Link>

            <p className="text-slate-300 text-xs sm:text-sm line-clamp-2 md:line-clamp-3 leading-relaxed max-w-2xl">
              {hero.shortDescription}
            </p>

            <div className="pt-2 flex items-center gap-4 text-xs text-slate-400 font-medium">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-red-500" /> {formatDate(hero.publishedAt)}
              </span>
              <span className="flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5" /> {hero.viewCount} ko&apos;rildi
              </span>
            </div>
          </div>
        </div>

        {/* 2 Medium Stacked Visuals */}
        <div className="lg:col-span-5 grid grid-cols-1 gap-5">
          {subFeatured.map((art) => (
            <div
              key={art.id}
              className="relative rounded-2xl overflow-hidden min-h-[200px] md:min-h-[220px] group bg-slate-950 flex flex-col justify-end p-5 shadow-sm"
            >
              {art.coverImageUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={art.coverImageUrl}
                  alt={art.title}
                  className="absolute inset-0 w-full h-full object-cover opacity-75 group-hover:scale-105 transition-transform duration-500"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
              <div className="relative z-10">
                <span className="text-[10px] font-bold text-red-400 uppercase tracking-wider">
                  {art.categoryName}
                </span>
                <Link href={`/news/${art.slug}`}>
                  <h3 className="text-base md:text-lg font-black text-white hover:text-red-400 transition-colors line-clamp-2 leading-snug mt-1">
                    {art.title}
                  </h3>
                </Link>
                <div className="text-[11px] text-slate-400 mt-2 flex items-center gap-2">
                  <Clock className="w-3 h-3" /> {formatDate(art.publishedAt)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CNN Highlights Bar */}
      {tickerHighlights.length > 0 && (
        <div className="bg-slate-100 dark:bg-[#1c2128] rounded-2xl p-4 border border-slate-200 dark:border-slate-800">
          <div className="text-[11px] font-black uppercase text-red-700 dark:text-red-400 tracking-wider mb-2.5 flex items-center gap-1.5">
            <Flame className="w-4 h-4" /> CNN MUHIM QISQACHA XULOSALAR:
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-200 dark:divide-slate-800">
            {tickerHighlights.map((art) => (
              <div key={art.id} className="pt-2 sm:pt-0 sm:px-3 first:pl-0 last:pr-0 group">
                <Link href={`/news/${art.slug}`}>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-red-700 dark:group-hover:text-red-400 line-clamp-2 leading-snug">
                    • {art.title}
                  </h4>
                </Link>
                <span className="text-[10px] text-slate-400 mt-1 block">
                  {formatDate(art.publishedAt)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Remaining Articles Grid */}
      {gridNews.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {gridNews.map((art) => (
            <NewsCard key={art.id} article={art} variant="standard" />
          ))}
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// 3. REUTERS / NYT EDITORIAL & SIDEBAR TEMPLATE
// ─────────────────────────────────────────────────────────────
export function EditorialSidebarTemplate({ articles }: { articles: ArticleItem[] }) {
  if (articles.length === 0) return null

  // Sort top 5 by viewCount for Trending sidebar
  const trending = [...articles].sort((a, b) => b.viewCount - a.viewCount).slice(0, 5)

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Left Main Stream (8 columns) */}
      <div className="lg:col-span-8 space-y-5">
        {articles.map((art, idx) => (
          <article
            key={art.id}
            className="group bg-white dark:bg-[#1c2128] rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-5 flex flex-col sm:flex-row gap-5 shadow-xs hover:shadow-md transition-all hover:border-red-300 dark:hover:border-red-900"
          >
            {art.coverImageUrl && (
              <div className="sm:w-56 h-40 shrink-0 rounded-xl overflow-hidden bg-slate-900 relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={art.coverImageUrl}
                  alt={art.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2 left-2">
                  <CategoryBadge name={art.categoryName} size="sm" />
                </div>
              </div>
            )}

            <div className="flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs text-slate-400 mb-1.5">
                  <span className="font-extrabold text-red-700 dark:text-red-400 uppercase text-[10px]">
                    {art.categoryName}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-[11px]">
                    <Clock className="w-3 h-3 text-red-600" /> {formatDate(art.publishedAt)}
                  </span>
                  {art.author && (
                    <>
                      <span>•</span>
                      <span className="text-[11px] font-medium text-slate-500">{art.author}</span>
                    </>
                  )}
                </div>

                <Link href={`/news/${art.slug}`}>
                  <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-slate-100 group-hover:text-red-700 dark:group-hover:text-red-400 transition-colors leading-snug mb-2">
                    {art.title}
                  </h3>
                </Link>

                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                  {art.shortDescription}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 mt-3 flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <Eye className="w-3 h-3" /> {art.viewCount}
                  </span>
                  <span className="flex items-center gap-1 text-rose-600 dark:text-rose-400 font-semibold">
                    <Heart className="w-3 h-3 fill-rose-600/30 text-rose-600" /> {art.likeCount || 0}
                  </span>
                </div>
                <Link
                  href={`/news/${art.slug}`}
                  className="text-xs font-bold text-red-700 dark:text-red-400 hover:underline flex items-center gap-1"
                >
                  O&apos;qish <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Right Sticky Sidebar (4 columns) */}
      <div className="lg:col-span-4 sticky top-20 space-y-6">
        {/* Trending Top 5 Card */}
        <div className="bg-white dark:bg-[#1c2128] rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-red-600" /> ENG KO&apos;P O&apos;QILGANLAR
            </h3>
            <span className="text-[10px] font-bold text-slate-400">Trend</span>
          </div>

          <div className="space-y-4">
            {trending.map((art, idx) => (
              <div key={art.id} className="flex gap-3 items-start group">
                <span className="w-7 h-7 rounded-xl bg-red-50 dark:bg-red-950/60 text-red-700 dark:text-red-400 font-black text-sm flex items-center justify-center shrink-0 border border-red-200 dark:border-red-900/50">
                  {idx + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <Link href={`/news/${art.slug}`}>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 group-hover:text-red-700 dark:group-hover:text-red-400 transition-colors line-clamp-2 leading-snug">
                      {art.title}
                    </h4>
                  </Link>
                  <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-1">
                    <span className="font-semibold">{art.categoryName}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Eye className="w-3 h-3" /> {art.viewCount}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Editorial Notice Banner */}
        <div className="rounded-2xl bg-gradient-to-tr from-red-800 to-red-600 text-white p-5 shadow-md space-y-2">
          <span className="text-[10px] font-black uppercase tracking-wider text-red-200">
            Urgut Today Axboroti
          </span>
          <h4 className="text-sm font-black leading-snug">
            Eng so&apos;nggi yangiliklardan birinchi bo&apos;lib xabardor bo&apos;ling!
          </h4>
          <p className="text-xs text-red-100 leading-relaxed">
            Telegram kanalimizda har kuni 20 dan ortiq tezkor xabarlar berib boriladi.
          </p>
          <a
            href="https://t.me/urgut_today"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-2 bg-white text-red-700 font-black text-xs px-4 py-2 rounded-xl uppercase tracking-wider shadow-xs hover:bg-slate-100 transition-colors"
          >
            Kanalga a&apos;zo bo&apos;lish →
          </a>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// 4. CARDS GRID TEMPLATE (Modern 3 & 4 Columns)
// ─────────────────────────────────────────────────────────────
export function CardsGridTemplate({ articles }: { articles: ArticleItem[] }) {
  if (articles.length === 0) return null

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {articles.map((art) => (
        <NewsCard key={art.id} article={art} variant="standard" />
      ))}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// 5. COMPACT CHRONOLOGICAL LIST (Sport / Fast News style)
// ─────────────────────────────────────────────────────────────
export function CompactListTemplate({ articles }: { articles: ArticleItem[] }) {
  if (articles.length === 0) return null

  return (
    <div className="max-w-4xl mx-auto bg-white dark:bg-[#1c2128] rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs divide-y divide-slate-100 dark:divide-slate-800">
      <div className="p-4 bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <span className="text-xs font-black uppercase tracking-wider text-red-700 dark:text-red-400 flex items-center gap-2">
          <Clock className="w-4 h-4" /> XRONOLOGIK VAQT BO&apos;YICHA LENTA
        </span>
        <span className="text-xs text-slate-500 font-semibold">{articles.length} ta xabar</span>
      </div>

      {articles.map((art) => (
        <article
          key={art.id}
          className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors flex items-start gap-4 group"
        >
          {/* Time Marker */}
          <div className="flex flex-col items-center shrink-0 w-16 pt-0.5">
            <span className="text-xs font-black text-red-700 dark:text-red-400 font-mono">
              {formatTime(art.publishedAt)}
            </span>
            <span className="text-[10px] text-slate-400 font-medium">
              {formatDate(art.publishedAt)}
            </span>
          </div>

          {/* Thumbnail if any */}
          {art.coverImageUrl && (
            <div className="w-20 h-16 sm:w-24 sm:h-18 rounded-lg overflow-hidden bg-slate-900 shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={art.coverImageUrl}
                alt={art.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
            </div>
          )}

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-extrabold uppercase text-slate-500 dark:text-slate-400 tracking-wider">
                {art.categoryName}
              </span>
              {art.isFeatured && (
                <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded-sm bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-400">
                  MUHIM
                </span>
              )}
            </div>

            <Link href={`/news/${art.slug}`}>
              <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-slate-100 group-hover:text-red-700 dark:group-hover:text-red-400 transition-colors line-clamp-2 leading-snug">
                {art.title}
              </h3>
            </Link>

            <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-1">
              {art.shortDescription}
            </p>
          </div>

          {/* Quick arrow */}
          <div className="shrink-0 self-center hidden sm:block">
            <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-red-600 transition-colors" />
          </div>
        </article>
      ))}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// Unified Dynamic Layout Renderer
// ─────────────────────────────────────────────────────────────
export function NewsLayoutRenderer({
  layoutType = 'bbc-lead',
  articles,
  showSideList = false,
}: {
  layoutType?: LayoutType | string
  articles: ArticleItem[]
  showSideList?: boolean
}) {
  switch (layoutType) {
    case 'bbc-lead':
      return <BBCLeadTemplate articles={articles} showSideList={showSideList} />
    case 'cnn-magazine':
      return <CNNMagazineTemplate articles={articles} />
    case 'editorial-sidebar':
      return <EditorialSidebarTemplate articles={articles} />
    case 'compact-list':
      return <CompactListTemplate articles={articles} />
    case 'cards-grid':
    default:
      return <CardsGridTemplate articles={articles} />
  }
}
