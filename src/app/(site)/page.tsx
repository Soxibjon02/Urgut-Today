'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Flame, Clock, TrendingUp, Sparkles } from 'lucide-react'
import { NewsCard } from '@/components/NewsCard'

interface Article {
  id: number; title: string; slug: string; shortDescription: string
  coverImageUrl?: string; categoryId: number; categoryName: string
  categorySlug: string; author: string; status: number; isFeatured: boolean
  viewCount: number; publishedAt: string
}

interface Category {
  id: number; name: string; slug: string; articleCount: number
}

function Skeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="bg-white rounded-lg border border-slate-200 overflow-hidden">
          <div className="skeleton h-40 w-full" />
          <div className="p-4 space-y-2">
            <div className="skeleton h-4 w-1/3" />
            <div className="skeleton h-5 w-full" />
            <div className="skeleton h-4 w-2/3" />
          </div>
        </div>
      ))}
    </div>
  )
}

export default function HomePage() {
  const [featured, setFeatured] = useState<Article[]>([])
  const [latest, setLatest] = useState<Article[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [catArticles, setCatArticles] = useState<Record<string, Article[]>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [featuredRes, latestRes, catsRes] = await Promise.all([
          fetch('/api/news/featured?count=5').then(r => r.json()),
          fetch('/api/news?page=1&pageSize=8').then(r => r.json()),
          fetch('/api/categories').then(r => r.json()),
        ])
        setFeatured(featuredRes)
        setLatest(latestRes.items || [])
        setCategories(catsRes)

        // Fetch category articles
        const topCats = catsRes.slice(0, 4)
        const catMap: Record<string, Article[]> = {}
        await Promise.all(topCats.map(async (cat: Category) => {
          const res = await fetch(`/api/news?categorySlug=${cat.slug}&page=1&pageSize=3`).then(r => r.json())
          catMap[cat.slug] = res.items || []
        }))
        setCatArticles(catMap)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const mainHero = featured[0] || latest[0]
  const secondary = featured.slice(1, 5)

  if (loading) return (
    <div className="max-w-7xl mx-auto px-4 py-8"><Skeleton /></div>
  )

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      {mainHero ? (
        <section className="bg-slate-900 text-white py-6 md:py-10 border-b-4 border-red-700">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center gap-2 mb-4">
              <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600" />
              </span>
              <span className="text-xs font-black uppercase tracking-widest text-red-500 flex items-center gap-1">
                <Flame className="w-4 h-4" /> ASOSIY YANGILIK
              </span>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-8">
                <NewsCard article={mainHero} variant="featured" />
              </div>
              <div className="lg:col-span-4 bg-slate-800/80 rounded-lg p-5 border border-slate-700 flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-black uppercase tracking-wider text-slate-300 border-b border-slate-700 pb-3 mb-3 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-red-500" /> MUHIM VOQEALAR
                  </h3>
                  <div className="divide-y divide-slate-700/60">
                    {secondary.map(art => (
                      <div key={art.id} className="py-2.5">
                        <NewsCard article={art} variant="compact" />
                      </div>
                    ))}
                  </div>
                </div>
                <Link href="/latest" className="mt-4 block w-full text-center bg-red-700 hover:bg-red-800 text-white font-bold text-xs py-2.5 rounded transition-colors">
                  Barcha muhim xabarlarni ko'rish →
                </Link>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      <div className="max-w-7xl mx-auto px-4 space-y-12">
        {/* Latest */}
        <section>
          <div className="flex items-center justify-between border-b-2 border-slate-900 pb-3 mb-6">
            <h2 className="text-xl md:text-2xl font-black text-slate-900 flex items-center gap-2 uppercase tracking-tight">
              <Clock className="w-6 h-6 text-red-700" /> Eng so'nggi yangiliklar
            </h2>
            <Link href="/latest" className="text-xs font-extrabold text-red-700 hover:underline uppercase tracking-wider">Barchasi →</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {latest.slice(0, 8).map(art => <NewsCard key={art.id} article={art} variant="standard" />)}
          </div>
        </section>

        {/* Category Sections */}
        {categories.slice(0, 4).map(cat => {
          const articles = catArticles[cat.slug] || []
          if (articles.length === 0) return null
          return (
            <section key={cat.id} className="pt-4">
              <div className="flex items-center justify-between border-b-2 border-red-700 pb-2 mb-6">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-6 bg-red-700 inline-block" />
                  <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">{cat.name}</h2>
                </div>
                <Link href={`/category/${cat.slug}`} className="text-xs font-bold text-slate-600 hover:text-red-700 transition-colors uppercase">
                  Barchasini ko'rish ({cat.articleCount}) →
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {articles.map(art => <NewsCard key={art.id} article={art} variant="standard" />)}
              </div>
            </section>
          )
        })}

        {/* About Banner */}
        <section className="bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-xl p-8 shadow-xl relative overflow-hidden">
          <div className="max-w-2xl relative z-10 space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-red-400 flex items-center gap-1">
              <Sparkles className="w-4 h-4" /> URGUT TODAY MEDIA
            </span>
            <h3 className="text-2xl md:text-3xl font-extrabold">
              Urgut tumani bo'yicha rasmiy va ishonchli xabarlar manbai
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              Mahalliy sanoat, ta'lim, obodonlashtirish va madaniy tadbirlardan doimiy xabardor bo'ling.
            </p>
            <div className="pt-2">
              <Link href="/about" className="inline-block bg-red-700 hover:bg-red-800 text-white font-bold text-xs px-5 py-2.5 rounded transition-colors">
                Loyiha haqida batafsil
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
