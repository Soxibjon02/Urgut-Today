'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import {
  Clock,
  Eye,
  Calendar,
  User,
  ArrowLeft,
  Share2,
  Bookmark,
  Check,
  Send,
  Sparkles,
} from 'lucide-react'
import { NewsCard, CategoryBadge } from '@/components/NewsCard'
import { isBookmarked, toggleBookmark } from '@/lib/bookmarks'
import { LikeButton } from '@/components/LikeButton'
import { CommentsSection } from '@/components/CommentsSection'

interface ArticleDetail {
  id: number
  title: string
  slug: string
  shortDescription: string
  content: string
  coverImageUrl?: string
  additionalImages: string[]
  categoryId: number
  categoryName: string
  categorySlug: string
  author?: string
  sourceUrl?: string
  videoUrl?: string
  status: number
  isFeatured: boolean
  tags: string[]
  viewCount: number
  likeCount: number
  createdAt: string
  updatedAt: string
  publishedAt: string
}

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
  likeCount?: number
  publishedAt: string
}

export default function ArticleDetailPage() {
  const params = useParams()
  const slug = params?.slug as string

  const [article, setArticle] = useState<ArticleDetail | null>(null)
  const [related, setRelated] = useState<ArticleList[]>([])
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const [saved, setSaved] = useState(false)
  const [readProgress, setReadProgress] = useState(0)

  useEffect(() => {
    if (!slug) return
    const fetchArticle = async () => {
      try {
        setLoading(true)
        const res = await fetch(`/api/news/${slug}`)
        if (!res.ok) {
          setArticle(null)
          return
        }
        const data: ArticleDetail = await res.json()
        setArticle(data)
        setSaved(isBookmarked(data.id))

        // Fetch related articles
        const relRes = await fetch(`/api/news/related/${slug}?count=4`)
        if (relRes.ok) {
          const relData = await relRes.json()
          setRelated(relData)
        }

        document.title = `${data.title} — Urgut Today`
      } catch (err) {
        console.error('Error loading article:', err)
        setArticle(null)
      } finally {
        setLoading(false)
      }
    }

    fetchArticle()
    window.scrollTo(0, 0)
  }, [slug])

  // Track reading progress
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight
      if (totalHeight > 0) {
        setReadProgress((window.scrollY / totalHeight) * 100)
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleBookmark = () => {
    if (!article) return
    const next = toggleBookmark(article)
    setSaved(next)
  }

  const handleShare = () => {
    if (!article) return
    const url = typeof window !== 'undefined' ? window.location.href : ''
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

  const handleTelegramShare = () => {
    if (!article) return
    const url = encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')
    const text = encodeURIComponent(article.title)
    window.open(`https://t.me/share/url?url=${url}&text=${text}`, '_blank')
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-4">
        <div className="skeleton h-8 w-1/3" />
        <div className="skeleton h-12 w-full" />
        <div className="skeleton h-6 w-1/2" />
        <div className="skeleton h-96 w-full" />
      </div>
    )
  }

  if (!article) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Sahifa topilmadi</h2>
        <p className="text-slate-600 dark:text-slate-400 text-sm">
          Siz qidirayotgan yangilik o&apos;chirilgan yoki manzili o&apos;zgargan bo&apos;lishi mumkin.
        </p>
        <Link
          href="/"
          className="inline-block bg-red-700 hover:bg-red-800 text-white font-bold text-xs px-6 py-3 rounded-xl transition-colors"
        >
          Bosh sahifaga qaytish
        </Link>
      </div>
    )
  }

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('uz-UZ', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    } catch {
      return dateStr
    }
  }

  return (
    <>
      {/* Reading progress bar */}
      <div className="fixed top-0 left-0 right-0 h-1 z-50 bg-transparent">
        <div
          className="h-full bg-gradient-to-r from-red-600 to-amber-500 transition-all duration-150"
          style={{ width: `${readProgress}%` }}
        />
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 md:py-10 space-y-8">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-red-700 dark:hover:text-red-400 transition-colors uppercase tracking-wider"
          >
            <ArrowLeft className="w-4 h-4" /> Bosh sahifaga qaytish
          </Link>

          {/* Top Quick Actions */}
          <div className="flex items-center gap-2">
            <LikeButton slug={article.slug} initialCount={article.likeCount} size="md" />

            <button
              onClick={handleBookmark}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#1c2128] text-xs font-bold hover:text-red-600 transition-all shadow-xs"
            >
              <Bookmark className={`w-4 h-4 ${saved ? 'fill-red-600 text-red-600' : ''}`} />
              <span className="hidden sm:inline">{saved ? 'Saqlangan' : 'Saqlash'}</span>
            </button>

            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#1c2128] text-xs font-bold hover:text-red-600 transition-all shadow-xs"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4" />}
              <span className="hidden sm:inline">{copied ? 'Nusxalandi' : 'Ulashish'}</span>
            </button>
          </div>
        </div>

        <article className="bg-white dark:bg-[#1c2128] rounded-3xl border border-slate-200 dark:border-slate-800 p-5 sm:p-8 md:p-10 shadow-sm space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <Link href={`/category/${article.categorySlug}`}>
                <CategoryBadge name={article.categoryName} size="md" />
              </Link>
              {article.isFeatured && (
                <span className="bg-amber-100 dark:bg-amber-950/70 text-amber-900 dark:text-amber-300 font-bold text-xs px-2.5 py-1 rounded-md">
                  Asosiy Xabar
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 dark:text-slate-100 leading-tight">
              {article.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-500 dark:text-slate-400 pt-2 border-b border-slate-100 dark:border-slate-800 pb-4">
              <span className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-red-600" />
                {article.author || 'Urgut Today Tahririyati'}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-red-600" />
                {formatDate(article.publishedAt)}
              </span>
              <span className="flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-red-600" />
                {article.viewCount} ko&apos;rishlar
              </span>
              <LikeButton slug={article.slug} initialCount={article.likeCount} size="sm" showText={false} />
            </div>
          </div>

          {/* Short Lead Description */}
          <div className="text-base sm:text-lg font-semibold text-slate-800 dark:text-slate-200 leading-relaxed bg-slate-50 dark:bg-slate-900/60 p-4 sm:p-5 rounded-2xl border-l-4 border-red-700">
            {article.shortDescription}
          </div>

          {/* Cover image */}
          {article.coverImageUrl && (
            <div className="rounded-2xl overflow-hidden bg-slate-900 shadow-md max-h-[520px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={article.coverImageUrl}
                alt={article.title}
                className="w-full h-full max-h-[520px] object-cover"
              />
            </div>
          )}

          {/* Main article content HTML */}
          <div
            className="article-content text-slate-800 dark:text-slate-200 text-base sm:text-lg leading-relaxed space-y-4 pt-2"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />

          {/* Additional gallery images */}
          {article.additionalImages && article.additionalImages.length > 0 && (
            <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-red-600" /> Foto lavhalar:
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {article.additionalImages.map((img, idx) => (
                  <div key={idx} className="rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 aspect-[4/3] shadow-xs">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img} alt={`${article.title} - ${idx + 1}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Article Footer & Social Share */}
          <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-500 font-semibold">
                Sizga yoqdimi?
              </span>
              <LikeButton slug={article.slug} initialCount={article.likeCount} size="md" />
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleTelegramShare}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#229ED9] hover:bg-[#1e8bc0] text-white font-bold text-xs transition-colors shadow-xs"
              >
                <Send className="w-3.5 h-3.5" /> Telegramda ulashish
              </button>
              <button
                onClick={handleShare}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-200 font-bold text-xs transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Share2 className="w-3.5 h-3.5" />}
                {copied ? 'Havola nusxalandi' : 'Ulashish'}
              </button>
            </div>
          </div>
        </article>

        {/* ── COMMENTS & DISCUSSION SECTION (Google Sign-In) ── */}
        <CommentsSection slug={article.slug} articleTitle={article.title} />

        {/* Related News */}
        {related.length > 0 && (
          <section className="space-y-6 pt-4">
            <h3 className="text-xl font-black text-slate-900 dark:text-slate-100 uppercase tracking-tight border-b-2 border-red-700 pb-2">
              Mavzuga doir xabarlar
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {related.map((art) => (
                <NewsCard key={art.id} article={art} variant="standard" />
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  )
}
