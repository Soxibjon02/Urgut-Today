'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Clock, Eye, ArrowRight, ImageOff, Bookmark, Share2, Check, Heart } from 'lucide-react'
import { isBookmarked, toggleBookmark } from '@/lib/bookmarks'

interface NewsArticle {
  id: number
  title: string
  slug: string
  shortDescription: string
  coverImageUrl?: string
  categoryName: string
  categorySlug: string
  categories?: Array<{ id: number; name: string; slug: string }>
  author?: string
  status: number
  isFeatured: boolean
  viewCount: number
  likeCount?: number
  publishedAt: string
}

interface NewsCardProps {
  article: NewsArticle
  variant?: 'featured' | 'standard' | 'compact'
}

function formatDate(dateStr: string) {
  try {
    const d = new Date(dateStr)
    return d.toLocaleDateString('uz-UZ', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  } catch {
    return dateStr
  }
}

function CoverImage({ src, alt, categoryName }: { src?: string; alt: string; categoryName: string }) {
  const [error, setError] = useState(false)

  if (!src || error) {
    return (
      <div className="w-full h-full min-h-[160px] bg-gradient-to-br from-slate-800 via-slate-900 to-red-950 flex flex-col items-center justify-center p-4 text-center select-none">
        <ImageOff className="w-8 h-8 text-slate-500 mb-2" />
        <span className="text-red-400 font-extrabold text-xs uppercase tracking-wider mb-1">
          {categoryName}
        </span>
        <span className="text-slate-300 text-xs font-semibold line-clamp-2 px-2">{alt}</span>
      </div>
    )
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      onError={() => setError(true)}
      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      loading="lazy"
    />
  )
}

export function CategoryBadge({ name, size = 'sm' }: { name: string; size?: 'sm' | 'md' }) {
  return (
    <span
      className={`inline-block bg-gradient-to-r from-red-700 to-red-600 text-white font-extrabold rounded-md uppercase tracking-wider shadow-xs ${
        size === 'sm' ? 'text-[10px] px-2.5 py-0.5' : 'text-xs px-3 py-1'
      }`}
    >
      {name}
    </span>
  )
}

export function NewsCard({ article, variant = 'standard' }: NewsCardProps) {
  const [saved, setSaved] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    setSaved(isBookmarked(article.id))
    const handler = () => setSaved(isBookmarked(article.id))
    window.addEventListener('bookmarks-updated', handler)
    return () => window.removeEventListener('bookmarks-updated', handler)
  }, [article.id])

  const handleBookmark = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const next = toggleBookmark(article)
    setSaved(next)
  }

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const url = typeof window !== 'undefined' ? `${window.location.origin}/news/${article.slug}` : ''
    if (typeof navigator !== 'undefined' && navigator.share) {
      navigator.share({
        title: article.title,
        text: article.shortDescription,
        url,
      }).catch(() => {})
    } else if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  // 1. FEATURED HERO CARD
  if (variant === 'featured') {
    return (
      <article className="group bg-white dark:bg-[#1c2128] rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col md:flex-row h-full">
        <div className="md:w-3/5 relative min-h-[260px] md:min-h-[380px] bg-slate-900 overflow-hidden">
          <Link href={`/news/${article.slug}`} className="block w-full h-full">
            <CoverImage src={article.coverImageUrl} alt={article.title} categoryName={article.categoryName} />
          </Link>
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 max-w-[85%]">
            {article.categories && article.categories.length > 0 ? (
              article.categories.map((c) => (
                <CategoryBadge key={c.slug} name={c.name} size="sm" />
              ))
            ) : (
              <CategoryBadge name={article.categoryName} size="md" />
            )}
            {article.isFeatured && (
              <span className="bg-amber-500 text-slate-950 font-black text-xs px-2.5 py-1 rounded-md uppercase tracking-wider shadow-xs">
                ASOSIY
              </span>
            )}
          </div>
          {/* Quick Action buttons */}
          <div className="absolute top-3 right-3 flex items-center gap-1.5">
            <button
              onClick={handleBookmark}
              className="p-2 rounded-full bg-black/50 hover:bg-black/80 backdrop-blur-md text-white transition-all transform active:scale-90"
              title={saved ? "Saqlanganlardan o'chirish" : "Saqlab qo'yish"}
            >
              <Bookmark className={`w-4 h-4 ${saved ? 'fill-red-500 text-red-500' : ''}`} />
            </button>
            <button
              onClick={handleShare}
              className="p-2 rounded-full bg-black/50 hover:bg-black/80 backdrop-blur-md text-white transition-all transform active:scale-90"
              title="Ulashish"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div className="md:w-2/5 p-6 md:p-8 flex flex-col justify-between bg-white dark:bg-[#1c2128]">
          <div>
            <Link href={`/news/${article.slug}`}>
              <h2 className="text-xl md:text-2xl font-black text-slate-900 dark:text-slate-100 group-hover:text-red-700 dark:group-hover:text-red-400 transition-colors leading-tight mb-3">
                {article.title}
              </h2>
            </Link>
            <p className="text-slate-600 dark:text-slate-300 text-xs md:text-sm line-clamp-4 leading-relaxed mb-6">
              {article.shortDescription}
            </p>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 font-medium">
                <Clock className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
                {formatDate(article.publishedAt)}
              </span>
              <span className="flex items-center gap-1">
                <Eye className="w-3.5 h-3.5 text-slate-400" />
                {article.viewCount}
              </span>
              <span className="flex items-center gap-1 text-rose-600 dark:text-rose-400 font-semibold">
                <Heart className="w-3.5 h-3.5 fill-rose-600/30 text-rose-600" />
                {article.likeCount || 0}
              </span>
            </div>
            <Link
              href={`/news/${article.slug}`}
              className="inline-flex items-center gap-1 font-extrabold text-red-700 dark:text-red-400 hover:text-red-800 transition-colors"
            >
              Batafsil <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </article>
    )
  }

  // 2. COMPACT SIDEBAR CARD
  if (variant === 'compact') {
    return (
      <article className="group flex gap-3 py-3 border-b border-slate-800/80 last:border-0 items-start">
        <div className="w-20 h-16 shrink-0 rounded-lg overflow-hidden bg-slate-900 relative">
          <Link href={`/news/${article.slug}`}>
            <CoverImage src={article.coverImageUrl} alt={article.title} categoryName={article.categoryName} />
          </Link>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-extrabold uppercase text-red-400 tracking-wider">
              {article.categoryName}
            </span>
            <span className="text-[10px] text-slate-600">•</span>
            <span className="text-[10px] text-slate-400 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {formatDate(article.publishedAt)}
            </span>
          </div>
          <Link href={`/news/${article.slug}`}>
            <h4 className="text-xs md:text-sm font-bold text-slate-100 group-hover:text-red-400 transition-colors line-clamp-2 leading-snug">
              {article.title}
            </h4>
          </Link>
        </div>
      </article>
    )
  }

  // 3. STANDARD GRID CARD
  return (
    <article className="group bg-white dark:bg-[#1c2128] rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col h-full hover:-translate-y-1">
      <div className="relative aspect-[16/9] overflow-hidden bg-slate-900">
        <Link href={`/news/${article.slug}`}>
          <CoverImage src={article.coverImageUrl} alt={article.title} categoryName={article.categoryName} />
        </Link>
        <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1 max-w-[85%]">
          {article.categories && article.categories.length > 0 ? (
            article.categories.map((c) => (
              <CategoryBadge key={c.slug} name={c.name} size="sm" />
            ))
          ) : (
            <CategoryBadge name={article.categoryName} size="sm" />
          )}
        </div>
        {/* Floating card action buttons */}
        <div className="absolute top-2.5 right-2.5 flex items-center gap-1 opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
          <button
            onClick={handleBookmark}
            className="p-1.5 rounded-full bg-black/60 hover:bg-black/90 backdrop-blur-xs text-white transition-all transform active:scale-90"
            title={saved ? "Saqlanganlardan o'chirish" : "Saqlab qo'yish"}
          >
            <Bookmark className={`w-3.5 h-3.5 ${saved ? 'fill-red-500 text-red-500' : ''}`} />
          </button>
          <button
            onClick={handleShare}
            className="p-1.5 rounded-full bg-black/60 hover:bg-black/90 backdrop-blur-xs text-white transition-all transform active:scale-90"
            title="Ulashish"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      <div className="p-4 md:p-5 flex flex-col justify-between flex-1">
        <div>
          <Link href={`/news/${article.slug}`}>
            <h3 className="text-sm md:text-base font-extrabold text-slate-900 dark:text-slate-100 group-hover:text-red-700 dark:group-hover:text-red-400 transition-colors line-clamp-2 leading-snug mb-2">
              {article.title}
            </h3>
          </Link>
          <p className="text-slate-600 dark:text-slate-300 text-xs line-clamp-2 leading-relaxed mb-4">
            {article.shortDescription}
          </p>
        </div>

        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mt-auto">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 font-medium text-[11px]">
              <Clock className="w-3 h-3 text-red-600 dark:text-red-400" />
              {formatDate(article.publishedAt)}
            </span>
            <span className="flex items-center gap-1 text-[11px]">
              <Eye className="w-3 h-3 text-slate-400" />
              {article.viewCount}
            </span>
            <span className="flex items-center gap-1 text-[11px] text-rose-600 dark:text-rose-400 font-semibold">
              <Heart className="w-3 h-3 fill-rose-600/30 text-rose-600" />
              {article.likeCount || 0}
            </span>
          </div>
          <Link
            href={`/news/${article.slug}`}
            className="inline-flex items-center gap-1 font-extrabold text-xs text-red-700 dark:text-red-400 hover:text-red-800 transition-colors"
          >
            Batafsil
          </Link>
        </div>
      </div>
    </article>
  )
}
