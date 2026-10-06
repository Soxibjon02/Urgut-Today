'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Flame, CloudSun, DollarSign, Calendar } from 'lucide-react'

interface QuickTickerProps {
  latestArticles?: { id: number; title: string; slug: string }[]
}

interface WidgetsData {
  weather: {
    temp: string
    condition: string
    city: string
  }
  currency: {
    usd: string
    diff: string
  }
}

export function BreakingNewsTicker({ latestArticles = [] }: QuickTickerProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [timeStr, setTimeStr] = useState('')
  const [widgets, setWidgets] = useState<WidgetsData>({
    weather: { temp: '+18°C', condition: 'Ochiq havo', city: 'Urgut' },
    currency: { usd: '12 850', diff: '' },
  })

  useEffect(() => {
    // 1. Fetch live online weather & CBU exchange rate
    fetch('/api/widgets')
      .then((r) => r.json())
      .then((data) => {
        if (data.weather && data.currency) {
          setWidgets(data)
        }
      })
      .catch(() => {})

    // 2. Clock updater
    const updateTime = () => {
      const now = new Date()
      setTimeStr(
        now.toLocaleDateString('uz-UZ', {
          weekday: 'short',
          day: 'numeric',
          month: 'short',
        }) + ' • ' + now.toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' })
      )
    }
    updateTime()
    const timer = setInterval(updateTime, 30000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    if (latestArticles.length <= 1) return
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % latestArticles.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [latestArticles.length])

  const activeArticle = latestArticles[currentIndex]

  return (
    <div className="bg-slate-900 text-slate-200 border-b border-slate-800 text-xs py-2 px-3 sm:px-4">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        {/* Left: Ticker Headline */}
        <div className="flex items-center gap-2.5 overflow-hidden flex-1 min-w-0">
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-red-600/90 text-white font-black text-[10px] tracking-wider uppercase shrink-0 shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
            <Flame className="w-3 h-3 inline" /> TEZKOR
          </div>

          {activeArticle ? (
            <Link
              href={`/news/${activeArticle.slug}`}
              className="text-slate-200 hover:text-red-400 transition-colors truncate font-semibold text-xs inline-block"
            >
              {activeArticle.title}
            </Link>
          ) : (
            <span className="text-slate-400 truncate text-xs">
              Urgut tumani va Samarqand viloyati rasmiy xabarlari
            </span>
          )}
        </div>

        {/* Right: Live Online Weather & Real CBU Currency & Time */}
        <div className="flex items-center gap-3 text-[11px] text-slate-400 font-medium shrink-0 self-end sm:self-auto overflow-x-auto max-w-full">
          <div className="hidden md:flex items-center gap-1 hover:text-slate-200 transition-colors">
            <Calendar className="w-3 h-3 text-red-500" />
            <span>{timeStr}</span>
          </div>

          <div
            className="flex items-center gap-1 hover:text-slate-200 transition-colors"
            title={`${widgets.weather.city}: ${widgets.weather.condition}`}
          >
            <CloudSun className="w-3.5 h-3.5 text-amber-400" />
            <span>
              {widgets.weather.city} {widgets.weather.temp}
            </span>
          </div>

          <div
            className="flex items-center gap-1 hover:text-slate-200 transition-colors"
            title="O'zbekiston Respublikasi Markaziy Banki rasmiy kursi"
          >
            <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
            <span>USD: {widgets.currency.usd}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
