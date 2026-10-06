'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Bookmark, X, Trash2, ArrowRight, Clock } from 'lucide-react'
import { getBookmarks, BookmarkedArticle, toggleBookmark } from '@/lib/bookmarks'

interface BookmarksDrawerProps {
  isOpen: boolean
  onClose: () => void
}

export function BookmarksDrawer({ isOpen, onClose }: BookmarksDrawerProps) {
  const [bookmarks, setBookmarks] = useState<BookmarkedArticle[]>([])

  const reload = () => {
    setBookmarks(getBookmarks())
  }

  useEffect(() => {
    reload()
    window.addEventListener('bookmarks-updated', reload)
    return () => window.removeEventListener('bookmarks-updated', reload)
  }, [])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md h-full bg-white dark:bg-[#161b22] border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col text-slate-900 dark:text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-4 md:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-400">
              <Bookmark className="w-5 h-5 fill-red-700 dark:fill-red-400" />
            </div>
            <div>
              <h3 className="font-extrabold text-base md:text-lg leading-tight">Saqlangan xabarlar</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {bookmarks.length} ta maqola saqlangan
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Bookmarks List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {bookmarks.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400 dark:text-slate-500">
              <Bookmark className="w-12 h-12 stroke-[1.5] mb-3 opacity-40" />
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Hozircha saqlangan yangiliklar yo&apos;q
              </p>
              <p className="text-xs mt-1 max-w-xs">
                O&apos;zingizga qiziq bo&apos;lgan yangiliklarni keyinroq o&apos;qish uchun belgilab qo&apos;yishingiz mumkin.
              </p>
            </div>
          ) : (
            bookmarks.map((art) => (
              <div
                key={art.id}
                className="group relative p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 hover:bg-white dark:hover:bg-slate-800/80 transition-all flex gap-3 items-start"
              >
                {art.coverImageUrl && (
                  <div className="w-20 h-16 rounded-lg overflow-hidden bg-slate-200 dark:bg-slate-800 shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={art.coverImageUrl}
                      alt={art.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-bold text-red-700 dark:text-red-400 uppercase tracking-wider">
                    {art.categoryName}
                  </span>
                  <Link
                    href={`/news/${art.slug}`}
                    onClick={onClose}
                    className="block text-xs md:text-sm font-bold text-slate-900 dark:text-slate-100 line-clamp-2 group-hover:text-red-700 dark:group-hover:text-red-400 transition-colors mt-0.5 leading-snug"
                  >
                    {art.title}
                  </Link>
                  <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-200/60 dark:border-slate-800 text-[11px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(art.publishedAt).toLocaleDateString('uz-UZ', { day: 'numeric', month: 'short' })}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleBookmark(art)
                      }}
                      className="text-slate-400 hover:text-red-600 transition-colors p-1"
                      title="O'chirish"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {bookmarks.length > 0 && (
          <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0d1117] flex justify-between items-center text-xs">
            <span className="text-slate-500">Qurilma xotirasida saqlanadi</span>
            <button
              onClick={() => {
                localStorage.removeItem('urgut_today_bookmarks_v1')
                window.dispatchEvent(new Event('bookmarks-updated'))
              }}
              className="text-red-600 dark:text-red-400 hover:underline font-semibold"
            >
              Barchasini tozalash
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
