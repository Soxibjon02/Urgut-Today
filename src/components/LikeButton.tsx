'use client'

import React, { useState, useEffect } from 'react'
import { Heart } from 'lucide-react'
import { getClientIdentifier, getGoogleUser } from '@/lib/clientAuth'

interface LikeButtonProps {
  slug: string
  initialCount?: number
  size?: 'sm' | 'md' | 'lg'
  showText?: boolean
}

export function LikeButton({
  slug,
  initialCount = 0,
  size = 'md',
  showText = true,
}: LikeButtonProps) {
  const [likeCount, setLikeCount] = useState(initialCount)
  const [hasLiked, setHasLiked] = useState(false)
  const [loading, setLoading] = useState(false)
  const [animating, setAnimating] = useState(false)

  useEffect(() => {
    setLikeCount(initialCount)
  }, [initialCount])

  useEffect(() => {
    if (!slug) return
    const googleUser = getGoogleUser()
    const identifier = googleUser?.email || getClientIdentifier()

    fetch(`/api/news/${slug}/like?identifier=${encodeURIComponent(identifier)}`)
      .then((r) => r.json())
      .then((data) => {
        if (typeof data.likeCount === 'number') {
          setLikeCount(data.likeCount)
        }
        if (typeof data.hasLiked === 'boolean') {
          setHasLiked(data.hasLiked)
        }
      })
      .catch(() => {})
  }, [slug])

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (loading) return

    const googleUser = getGoogleUser()
    const identifier = googleUser?.email || getClientIdentifier()

    // Optimistic UI update
    const nextLiked = !hasLiked
    setHasLiked(nextLiked)
    setLikeCount((prev) => (nextLiked ? prev + 1 : Math.max(0, prev - 1)))
    setAnimating(true)
    setTimeout(() => setAnimating(false), 300)

    try {
      setLoading(true)
      const res = await fetch(`/api/news/${slug}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier }),
      })
      const data = await res.json()
      if (typeof data.likeCount === 'number') {
        setLikeCount(data.likeCount)
      }
      if (typeof data.hasLiked === 'boolean') {
        setHasLiked(data.hasLiked)
      }
    } catch (err) {
      // Revert on error
      setHasLiked(!nextLiked)
      setLikeCount((prev) => (nextLiked ? Math.max(0, prev - 1) : prev + 1))
    } finally {
      setLoading(false)
    }
  }

  const iconSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  }

  const buttonPaddings = {
    sm: 'px-2 py-1 text-xs gap-1',
    md: 'px-3 py-1.5 text-xs gap-1.5',
    lg: 'px-4 py-2 text-sm gap-2',
  }

  return (
    <button
      onClick={handleToggle}
      className={`inline-flex items-center rounded-xl font-bold transition-all border shadow-xs transform active:scale-95 ${
        buttonPaddings[size]
      } ${
        hasLiked
          ? 'bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400'
          : 'bg-white dark:bg-[#1c2128] border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 hover:border-rose-200'
      }`}
      title={hasLiked ? "Yoqdi (Bekor qilish)" : "Menga yoqdi"}
      aria-label="Like"
    >
      <Heart
        className={`${iconSizes[size]} transition-transform duration-300 ${
          hasLiked
            ? 'fill-rose-600 text-rose-600 stroke-[2]'
            : 'text-slate-400 group-hover:text-rose-600'
        } ${animating ? 'scale-125' : 'scale-100'}`}
      />
      <span>{likeCount}</span>
      {showText && size !== 'sm' && (
        <span className="hidden sm:inline text-[11px] font-normal text-slate-500">
          {hasLiked ? "Yoqdi" : "Yoqdi"}
        </span>
      )}
    </button>
  )
}
