'use client'

import React, { useState } from 'react'
import { Calendar, Clock, X, Filter, Check, CalendarRange } from 'lucide-react'

export interface DateFilterState {
  preset?: 'all' | 'today' | 'yesterday'
  date?: string
  startDate?: string
  endDate?: string
}

interface DateNewsFilterProps {
  onFilterChange: (filters: DateFilterState) => void
  activeFilters: DateFilterState
}

export function DateNewsFilter({ onFilterChange, activeFilters }: DateNewsFilterProps) {
  const [showSpecificPicker, setShowSpecificPicker] = useState(false)
  const [showRangePicker, setShowRangePicker] = useState(false)
  const [customDate, setCustomDate] = useState(activeFilters.date || '')
  const [rangeStart, setRangeStart] = useState(activeFilters.startDate || '')
  const [rangeEnd, setRangeEnd] = useState(activeFilters.endDate || '')

  const handlePreset = (preset: 'all' | 'today' | 'yesterday') => {
    setShowSpecificPicker(false)
    setShowRangePicker(false)
    setCustomDate('')
    setRangeStart('')
    setRangeEnd('')
    onFilterChange({ preset })
  }

  const handleApplySpecific = (e: React.FormEvent) => {
    e.preventDefault()
    if (!customDate) return
    setShowRangePicker(false)
    onFilterChange({ date: customDate })
  }

  const handleApplyRange = (e: React.FormEvent) => {
    e.preventDefault()
    if (!rangeStart && !rangeEnd) return
    setShowSpecificPicker(false)
    onFilterChange({ startDate: rangeStart, endDate: rangeEnd })
  }

  const handleClear = () => {
    setShowSpecificPicker(false)
    setShowRangePicker(false)
    setCustomDate('')
    setRangeStart('')
    setRangeEnd('')
    onFilterChange({ preset: 'all' })
  }

  const isTodayActive = activeFilters.preset === 'today'
  const isYesterdayActive = activeFilters.preset === 'yesterday'
  const isAllActive = !activeFilters.date && !activeFilters.startDate && !activeFilters.endDate && (!activeFilters.preset || activeFilters.preset === 'all')
  const isSpecificActive = !!activeFilters.date
  const isRangeActive = !!activeFilters.startDate || !!activeFilters.endDate

  return (
    <div className="bg-white dark:bg-[#161b22] border border-slate-200 dark:border-slate-800 rounded-2xl p-3 sm:p-4 shadow-xs space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2.5">
        {/* Left: Quick preset buttons */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          <span className="text-xs font-black uppercase text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mr-1">
            <Filter className="w-3.5 h-3.5 text-red-600" /> Sana:
          </span>

          {/* 1. Barchasi */}
          <button
            onClick={() => handlePreset('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              isAllActive
                ? 'bg-red-700 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            Barchasi
          </button>

          {/* 2. Bugun */}
          <button
            onClick={() => handlePreset('today')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              isTodayActive
                ? 'bg-red-700 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <Clock className="w-3.5 h-3.5" /> Bugun
          </button>

          {/* 3. Kecha */}
          <button
            onClick={() => handlePreset('yesterday')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              isYesterdayActive
                ? 'bg-red-700 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <Clock className="w-3.5 h-3.5" /> Kecha
          </button>

          {/* 4. Aniq sana button */}
          <button
            onClick={() => {
              setShowSpecificPicker(!showSpecificPicker)
              setShowRangePicker(false)
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              isSpecificActive
                ? 'bg-red-700 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>{isSpecificActive ? activeFilters.date : 'Sana tanlash'}</span>
          </button>

          {/* 5. Oraliq sana button */}
          <button
            onClick={() => {
              setShowRangePicker(!showRangePicker)
              setShowSpecificPicker(false)
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
              isRangeActive
                ? 'bg-red-700 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            <CalendarRange className="w-3.5 h-3.5" />
            <span>Oraliq sana</span>
          </button>
        </div>

        {/* Right: Active filter status & reset button */}
        {!isAllActive && (
          <button
            onClick={handleClear}
            className="inline-flex items-center gap-1 text-xs font-bold text-red-600 dark:text-red-400 hover:underline px-2 py-1"
          >
            <X className="w-3.5 h-3.5" /> Tozalash
          </button>
        )}
      </div>

      {/* Specific Date Picker Panel */}
      {showSpecificPicker && (
        <form
          onSubmit={handleApplySpecific}
          className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-wrap items-center gap-3 animate-in fade-in duration-150"
        >
          <span className="text-xs font-bold text-slate-600 dark:text-slate-400">
            Kerakli kunni tanlang:
          </span>
          <input
            type="date"
            value={customDate}
            onChange={(e) => setCustomDate(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-white dark:bg-[#1c2128] border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-red-600"
            required
          />
          <button
            type="submit"
            className="px-4 py-1.5 bg-red-700 hover:bg-red-800 text-white text-xs font-bold rounded-lg transition-colors"
          >
            Ko&apos;rsatish
          </button>
          <button
            type="button"
            onClick={() => setShowSpecificPicker(false)}
            className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            Bekor qilish
          </button>
        </form>
      )}

      {/* Date Range Picker Panel */}
      {showRangePicker && (
        <form
          onSubmit={handleApplyRange}
          className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-wrap items-center gap-3 animate-in fade-in duration-150"
        >
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Dan:</span>
            <input
              type="date"
              value={rangeStart}
              onChange={(e) => setRangeStart(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-white dark:bg-[#1c2128] border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-red-600"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Gacha:</span>
            <input
              type="date"
              value={rangeEnd}
              onChange={(e) => setRangeEnd(e.target.value)}
              className="px-3 py-1.5 rounded-lg bg-white dark:bg-[#1c2128] border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-red-600"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-1.5 bg-red-700 hover:bg-red-800 text-white text-xs font-bold rounded-lg transition-colors"
          >
            Filtrlash
          </button>
          <button
            type="button"
            onClick={() => setShowRangePicker(false)}
            className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            Bekor qilish
          </button>
        </form>
      )}

      {/* Active Filter description message */}
      {(isTodayActive || isYesterdayActive || isSpecificActive || isRangeActive) && (
        <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1.5 pt-0.5">
          <Check className="w-3.5 h-3.5 text-emerald-500" />
          <span>
            {isTodayActive && "Bugun chop etilgan yangiliklar ko'rsatilmoqda"}
            {isYesterdayActive && "Kecha chop etilgan yangiliklar ko'rsatilmoqda"}
            {isSpecificActive && `${activeFilters.date} sanasida chop etilgan yangiliklar ko'rsatilmoqda`}
            {isRangeActive && `${activeFilters.startDate || 'Boshidan'} dan ${activeFilters.endDate || 'Hozirgacha'} bo'lgan yangiliklar ko'rsatilmoqda`}
          </span>
        </div>
      )}
    </div>
  )
}
