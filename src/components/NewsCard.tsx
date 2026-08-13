import Link from 'next/link'
import { Clock, Eye, ArrowRight } from 'lucide-react'

interface NewsArticle {
  id: number
  title: string
  slug: string
  shortDescription: string
  coverImageUrl?: string
  categoryName: string
  categorySlug: string
  author: string
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
  return new Date(dateStr).toLocaleDateString('uz-UZ', {
    day: 'numeric', month: 'long', year: 'numeric',
  })
}

function CoverImage({ src, alt, className }: { src?: string; alt: string; className?: string }) {
  if (!src) {
    return (
      <div className={`bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center ${className}`}>
        <span className="text-slate-400 text-xs font-bold uppercase tracking-wider px-2 text-center">{alt.slice(0, 30)}</span>
      </div>
    )
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={alt} className={`object-cover ${className}`} loading="lazy" />
  )
}

export function CategoryBadge({ name, size = 'sm' }: { name: string; size?: 'sm' | 'md' }) {
  return (
    <span className={`bg-red-700 text-white font-bold rounded ${size === 'sm' ? 'text-[10px] px-2 py-0.5' : 'text-xs px-2.5 py-1'}`}>
      {name}
    </span>
  )
}

export function NewsCard({ article, variant = 'standard' }: NewsCardProps) {
  if (variant === 'featured') {
    return (
      <article className="group bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row">
        <div className="md:w-3/5 relative min-h-[260px] md:min-h-[380px] overflow-hidden bg-slate-100">
          <Link href={`/news/${article.slug}`}>
            <CoverImage src={article.coverImageUrl} alt={article.title}
              className="w-full h-full min-h-[260px] md:min-h-[380px] group-hover:scale-105 transition-transform duration-300" />
          </Link>
        </div>
        <div className="md:w-2/5 p-6 md:p-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <CategoryBadge name={article.categoryName} size="md" />
              {article.isFeatured && (
                <span className="bg-amber-100 text-amber-900 font-bold text-xs px-2 py-0.5 rounded">ASOSIY</span>
              )}
            </div>
            <Link href={`/news/${article.slug}`}>
              <h2 className="text-xl md:text-2xl lg:text-3xl font-extrabold text-slate-900 group-hover:text-red-700 transition-colors leading-tight mb-3">
                {article.title}
              </h2>
            </Link>
            <p className="text-slate-600 text-sm md:text-base line-clamp-3 mb-4 leading-relaxed">{article.shortDescription}</p>
          </div>
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 font-medium"><Clock className="w-3.5 h-3.5" />{formatDate(article.publishedAt)}</span>
              <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" />{article.viewCount}</span>
            </div>
            <Link href={`/news/${article.slug}`} className="inline-flex items-center gap-1 font-bold text-red-700 group-hover:translate-x-1 transition-transform">
              Batafsil <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </article>
    )
  }

  if (variant === 'compact') {
    return (
      <article className="group flex gap-3 py-3 border-b border-slate-100 last:border-0 items-start">
        <div className="w-20 h-16 shrink-0 rounded overflow-hidden bg-slate-100 relative">
          <Link href={`/news/${article.slug}`}>
            <CoverImage src={article.coverImageUrl} alt={article.title} className="w-full h-full group-hover:scale-105 transition-transform duration-300" />
          </Link>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold uppercase text-red-700 tracking-wider">{article.categoryName}</span>
            <span className="text-[10px] text-slate-400">•</span>
            <span className="text-[10px] text-slate-400 flex items-center gap-1"><Clock className="w-3 h-3" />{formatDate(article.publishedAt)}</span>
          </div>
          <Link href={`/news/${article.slug}`}>
            <h4 className="text-sm font-bold text-slate-900 group-hover:text-red-700 transition-colors line-clamp-2 leading-snug">{article.title}</h4>
          </Link>
        </div>
      </article>
    )
  }

  return (
    <article className="group bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm news-card-hover flex flex-col h-full">
      <div className="relative aspect-[16/9] overflow-hidden bg-slate-100">
        <Link href={`/news/${article.slug}`}>
          <CoverImage src={article.coverImageUrl} alt={article.title} className="w-full h-full group-hover:scale-105 transition-transform duration-300" />
        </Link>
        <div className="absolute top-3 left-3">
          <CategoryBadge name={article.categoryName} size="sm" />
        </div>
      </div>
      <div className="p-4 md:p-5 flex flex-col justify-between flex-1">
        <div>
          <Link href={`/news/${article.slug}`}>
            <h3 className="text-base md:text-lg font-bold text-slate-900 group-hover:text-red-700 transition-colors line-clamp-2 leading-snug mb-2">{article.title}</h3>
          </Link>
          <p className="text-slate-600 text-xs md:text-sm line-clamp-2 mb-4 leading-relaxed">{article.shortDescription}</p>
        </div>
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 mt-auto">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{formatDate(article.publishedAt)}</span>
            <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" />{article.viewCount}</span>
          </div>
          <Link href={`/news/${article.slug}`} className="inline-flex items-center gap-1 font-semibold text-red-700 hover:underline">Batafsil</Link>
        </div>
      </div>
    </article>
  )
}
