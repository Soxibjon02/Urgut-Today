'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Clock, Eye, ArrowRight, ImageOff } from 'lucide-react'

interface NewsArticle {
  id: number
  title: string
  slug: string
  shortDescription: string
  coverImageUrl?: string
  categoryName: string
  categorySlug: string
  author?: string
  status: number
  isFeatured: boolean
  viewCount: number
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
      month: 'long',
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
      <div className="w-full h-full min-h-[160px] bg-gradient-to-br from-slate-800 to-slate-900 flex flex-col items-center justify-center p-4 text-center select-none">
        <ImageOff className="w-8 h-8 text-slate-500 mb-2" />
        <span className="text-red-400 font-extrabold text-xs uppercase tracking-wider mb-1">{categoryName}</span>
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
      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
      loading="lazy"
    />
  )
}

export function CategoryBadge({ name, size = 'sm' }: { name: string; size?: 'sm' | 'md' }) {
  return (
    <span
      className={`inline-block bg-red-700 text-white font-extrabold rounded uppercase tracking-wider shadow-xs ${
        size === 'sm' ? 'text-[10px] px-2 py-0.5' : 'text-xs px-2.5 py-1'
      }`}
    >
      {name}
    </span>
  )
}

export function NewsCard({ article, variant = 'standard' }: NewsCardProps) {
  // 1. FEATURED HERO CARD
  if (variant === 'featured') {
    return (
      <article className="group bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col md:flex-row h-full">
        <div className="md:w-3/5 relative min-h-[260px] md:min-h-[360px] bg-slate-900 overflow-hidden">
          <Link href={`/news/${article.slug}`} className="block w-full h-full">
            <CoverImage src={article.coverImageUrl} alt={article.title} categoryName={article.categoryName} />
          </Link>
          <div className="absolute top-3 left-3 flex gap-2">
            <CategoryBadge name={article.categoryName} size="md" />
            {article.isFeatured && (
              <span className="bg-amber-500 text-slate-950 font-black text-xs px-2.5 py-1 rounded uppercase tracking-wider">
                ASOSIY
              </span>
            )}
          </div>
        </div>

        <div className="md:w-2/5 p-6 md:p-8 flex flex-col justify-between bg-white">
          <div>
            <Link href={`/news/${article.slug}`}>
              <h2 className="text-xl md:text-2xl font-black text-slate-900 group-hover:text-red-700 transition-colors leading-tight mb-3">
                {article.title}
              </h2>
            </Link>
            <p className="text-slate-600 text-xs md:text-sm line-clamp-4 leading-relaxed mb-6">
              {article.shortDescription}
            </p>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 font-medium">
                <Clock className="w-3.5 h-3.5 text-red-700" />
                {formatDate(article.publishedAt)}
              </span>
              <span className="flex items-center gap-1">
                <Eye className="w-3.5 h-3.5 text-slate-400" />
                {article.viewCount}
              </span>
            </div>
            <Link
              href={`/news/${article.slug}`}
              className="inline-flex items-center gap-1 font-extrabold text-red-700 hover:text-red-800 transition-colors"
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
      <article className="group flex gap-3 py-3 border-b border-slate-700/60 last:border-0 items-start">
        <div className="w-20 h-16 shrink-0 rounded overflow-hidden bg-slate-900 relative">
          <Link href={`/news/${article.slug}`}>
            <CoverImage src={article.coverImageUrl} alt={article.title} categoryName={article.categoryName} />
          </Link>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-extrabold uppercase text-red-400 tracking-wider">
              {article.categoryName}
            </span>
            <span className="text-[10px] text-slate-500">•</span>
            <span className="text-[10px] text-slate-400 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {formatDate(article.publishedAt)}
            </span>
          </div>
          <Link href={`/news/${article.slug}`}>
            <h4 className="text-xs md:text-sm font-bold text-white group-hover:text-red-400 transition-colors line-clamp-2 leading-snug">
              {article.title}
            </h4>
          </Link>
        </div>
      </article>
    )
  }

  // 3. STANDARD GRID CARD
  return (
    <article className="group bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs news-card-hover flex flex-col h-full">
      <div className="relative aspect-[16/9] overflow-hidden bg-slate-900">
        <Link href={`/news/${article.slug}`}>
          <CoverImage src={article.coverImageUrl} alt={article.title} categoryName={article.categoryName} />
        </Link>
        <div className="absolute top-3 left-3">
          <CategoryBadge name={article.categoryName} size="sm" />
        </div>
      </div>

      <div className="p-4 md:p-5 flex flex-col justify-between flex-1">
        <div>
          <Link href={`/news/${article.slug}`}>
            <h3 className="text-sm md:text-base font-extrabold text-slate-900 group-hover:text-red-700 transition-colors line-clamp-2 leading-snug mb-2">
              {article.title}
            </h3>
          </Link>
          <p className="text-slate-600 text-xs line-clamp-2 leading-relaxed mb-4">
            {article.shortDescription}
          </p>
        </div>

        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 mt-auto">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 font-medium text-[11px]">
              <Clock className="w-3 h-3 text-red-700" />
              {formatDate(article.publishedAt)}
            </span>
            <span className="flex items-center gap-1 text-[11px]">
              <Eye className="w-3 h-3 text-slate-400" />
              {article.viewCount}
            </span>
          </div>
          <Link
            href={`/news/${article.slug}`}
            className="inline-flex items-center gap-1 font-extrabold text-xs text-red-700 hover:underline"
          >
            Batafsil
          </Link>
        </div>
      </div>
    </article>
  )
}
