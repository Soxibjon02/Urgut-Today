'use client'

import React, { useState, useEffect, useCallback } from 'react'
import {
  MessageSquare,
  Send,
  Edit2,
  Trash2,
  Check,
  X,
  LogIn,
  LogOut,
  ShieldAlert,
  Clock,
  Sparkles,
} from 'lucide-react'
import { GoogleUser, getGoogleUser, setGoogleUser } from '@/lib/clientAuth'
import { GoogleSignInModal } from './GoogleSignInModal'

interface CommentItem {
  id: number
  articleId: number
  authorName: string
  authorEmail: string
  authorImage?: string
  content: string
  createdAt: string
  updatedAt: string
}

interface CommentsSectionProps {
  slug: string
  articleTitle: string
}

function formatCommentDate(dateStr: string) {
  try {
    const d = new Date(dateStr)
    const now = new Date()
    const diffMs = now.getTime() - d.getTime()
    const diffMinutes = Math.floor(diffMs / (1000 * 60))
    const diffHours = Math.floor(diffMinutes / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffMinutes < 1) return 'Hozirgina'
    if (diffMinutes < 60) return `${diffMinutes} daqiqa oldin`
    if (diffHours < 24) return `${diffHours} soat oldin`
    if (diffDays < 7) return `${diffDays} kun oldin`

    return d.toLocaleDateString('uz-UZ', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  } catch {
    return dateStr
  }
}

export function CommentsSection({ slug, articleTitle }: CommentsSectionProps) {
  const [comments, setComments] = useState<CommentItem[]>([])
  const [loading, setLoading] = useState(true)
  const [currentUser, setCurrentUser] = useState<GoogleUser | null>(null)
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false)
  const [newContent, setNewContent] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // Edit comment states
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editContent, setEditContent] = useState('')
  const [savingEdit, setSavingEdit] = useState(false)

  const loadComments = useCallback(async () => {
    try {
      setLoading(true)
      const res = await fetch(`/api/news/${slug}/comments`)
      const data = await res.json()
      setComments(data.comments || [])
    } catch (err) {
      console.error('Failed to load comments:', err)
    } finally {
      setLoading(false)
    }
  }, [slug])

  useEffect(() => {
    loadComments()
    setCurrentUser(getGoogleUser())

    const handleUserChange = () => setCurrentUser(getGoogleUser())
    window.addEventListener('google-user-changed', handleUserChange)
    return () => window.removeEventListener('google-user-changed', handleUserChange)
  }, [loadComments])

  // Submit new comment
  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentUser) {
      setIsSignInModalOpen(true)
      return
    }

    if (!newContent.trim()) return

    try {
      setSubmitting(true)
      const res = await fetch(`/api/news/${slug}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          authorName: currentUser.name,
          authorEmail: currentUser.email,
          authorImage: currentUser.picture,
          content: newContent.trim(),
        }),
      })

      if (res.ok) {
        const data = await res.json()
        setComments((prev) => [data.comment, ...prev])
        setNewContent('')
      } else {
        const err = await res.json()
        alert(err.error || 'Fikr qoldirishda xatolik')
      }
    } catch {
      alert('Tarmoq xatosi')
    } finally {
      setSubmitting(false)
    }
  }

  // Save edited comment
  const handleSaveEdit = async (commentId: number) => {
    if (!currentUser || !editContent.trim()) return

    try {
      setSavingEdit(true)
      const res = await fetch(`/api/news/${slug}/comments/${commentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userEmail: currentUser.email,
          content: editContent.trim(),
        }),
      })

      if (res.ok) {
        const data = await res.json()
        setComments((prev) =>
          prev.map((c) => (c.id === commentId ? { ...c, content: data.comment.content } : c))
        )
        setEditingId(null)
        setEditContent('')
      } else {
        const err = await res.json()
        alert(err.error || 'Tahrirlashda xatolik')
      }
    } catch {
      alert('Tarmoq xatosi')
    } finally {
      setSavingEdit(false)
    }
  }

  // Delete comment
  const handleDeleteComment = async (commentId: number) => {
    if (!currentUser) return
    const confirmed = window.confirm('Rostdan ham ushbu fikringizni o‘chirmoqchimisiz?')
    if (!confirmed) return

    try {
      const res = await fetch(
        `/api/news/${slug}/comments/${commentId}?userEmail=${encodeURIComponent(
          currentUser.email
        )}`,
        {
          method: 'DELETE',
        }
      )

      if (res.ok) {
        setComments((prev) => prev.filter((c) => c.id !== commentId))
      } else {
        const err = await res.json()
        alert(err.error || 'O‘chirishda xatolik')
      }
    } catch {
      alert('Tarmoq xatosi')
    }
  }

  const handleLogout = () => {
    setGoogleUser(null)
  }

  return (
    <section className="bg-white dark:bg-[#1c2128] rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 md:p-10 shadow-sm space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-2xl bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-400">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900 dark:text-slate-100">
              Fikrlar va Muhokama
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {comments.length} ta fikr qoldirilgan
            </p>
          </div>
        </div>

        {/* Current user badge or Sign in button */}
        {currentUser ? (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              {currentUser.picture && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={currentUser.picture}
                  alt={currentUser.name}
                  className="w-8 h-8 rounded-full border border-red-500 shadow-xs"
                />
              )}
              <div className="hidden sm:block text-right">
                <span className="text-xs font-bold text-slate-900 dark:text-slate-100 block leading-tight">
                  {currentUser.name}
                </span>
                <span className="text-[10px] text-slate-400 block">{currentUser.email}</span>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 text-slate-400 hover:text-red-600 transition-colors rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
              title="Google hisobidan chiqish"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => setIsSignInModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-red-950/50 text-slate-700 dark:text-slate-200 hover:text-red-700 font-bold text-xs transition-all border border-slate-200 dark:border-slate-700"
          >
            {/* Google Icon */}
            <svg viewBox="0 0 24 24" className="w-4 h-4">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Google orqali kirish</span>
          </button>
        )}
      </div>

      {/* Comment Input Box */}
      {currentUser ? (
        <form onSubmit={handleSubmitComment} className="space-y-3">
          <div className="relative">
            <textarea
              rows={3}
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              placeholder="Ushbu xabar bo'yicha o'z fikringizni yozib qoldiring..."
              className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-300 dark:border-slate-700 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-red-600 transition-all"
              required
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-slate-400">
              Siz <strong className="text-slate-600 dark:text-slate-300">{currentUser.name}</strong> sifatida yozmoqdasiz
            </span>
            <button
              type="submit"
              disabled={submitting || !newContent.trim()}
              className="px-6 py-2.5 rounded-xl bg-red-700 hover:bg-red-800 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-sm transition-all"
            >
              <Send className="w-3.5 h-3.5" />
              {submitting ? 'Yuborilmoqda...' : 'Fikrni yuborish'}
            </button>
          </div>
        </form>
      ) : (
        <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-50 to-red-50/30 dark:from-slate-900/40 dark:to-red-950/20 border border-slate-200 dark:border-slate-800 text-center space-y-3">
          <div className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 shadow-xs mx-auto flex items-center justify-center p-2 border border-slate-200 dark:border-slate-700">
            <svg viewBox="0 0 24 24" className="w-6 h-6">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
          </div>
          <div>
            <h4 className="font-extrabold text-sm text-slate-900 dark:text-slate-100">
              Fikr bildirish uchun Google hisobingiz orqali kiring
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Fikringiz sizning Google profilingiz nomi va rasmi bilan ko&apos;rinadi.
            </p>
          </div>
          <button
            onClick={() => setIsSignInModalOpen(true)}
            className="px-6 py-2.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-100 text-slate-800 dark:text-slate-100 border border-slate-300 dark:border-slate-700 font-black text-xs uppercase tracking-wider shadow-sm transition-all inline-flex items-center gap-2"
          >
            <LogIn className="w-4 h-4 text-red-600" /> Google hisobi bilan kirish
          </button>
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-4 pt-2">
        {loading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 space-y-2"
              >
                <div className="skeleton h-4 w-32" />
                <div className="skeleton h-4 w-full" />
              </div>
            ))}
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-10 text-slate-400 dark:text-slate-500">
            <MessageSquare className="w-10 h-10 mx-auto stroke-1 mb-2 opacity-50" />
            <p className="font-semibold text-sm">Hozircha fikrlar mavjud emas</p>
            <p className="text-xs mt-0.5">Birinchi bo&apos;lib o&apos;z fikringizni bildiring!</p>
          </div>
        ) : (
          comments.map((comment) => {
            const isMyComment =
              currentUser &&
              currentUser.email.toLowerCase() === comment.authorEmail.toLowerCase()
            const isEditing = editingId === comment.id

            return (
              <div
                key={comment.id}
                className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 space-y-3 transition-colors"
              >
                {/* Author row */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    {comment.authorImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={comment.authorImage}
                        alt={comment.authorName}
                        className="w-9 h-9 rounded-full object-cover border border-slate-200 dark:border-slate-700 shrink-0"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-red-700 text-white font-bold flex items-center justify-center text-xs shrink-0">
                        {comment.authorName.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-slate-100">
                          {comment.authorName}
                        </span>
                        {isMyComment && (
                          <span className="text-[10px] font-black px-1.5 py-0.2 rounded-md bg-red-100 dark:bg-red-950/80 text-red-700 dark:text-red-400">
                            Siz
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <Clock className="w-3 h-3" />
                        {formatCommentDate(comment.createdAt)}
                      </span>
                    </div>
                  </div>

                  {/* Actions for comment author: Edit & Delete */}
                  {isMyComment && !isEditing && (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          setEditingId(comment.id)
                          setEditContent(comment.content)
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
                        title="Tahrirlash"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteComment(comment.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
                        title="O‘chirish"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Content or Edit Form */}
                {isEditing ? (
                  <div className="space-y-2 pt-1">
                    <textarea
                      rows={2}
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="w-full p-3 rounded-xl bg-white dark:bg-[#161b22] border border-red-400 text-xs sm:text-sm text-slate-900 dark:text-slate-100 focus:outline-none"
                    />
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => {
                          setEditingId(null)
                          setEditContent('')
                        }}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-500 hover:text-slate-700 transition-colors"
                      >
                        Bekor qilish
                      </button>
                      <button
                        onClick={() => handleSaveEdit(comment.id)}
                        disabled={savingEdit || !editContent.trim()}
                        className="px-4 py-1.5 rounded-lg bg-red-700 hover:bg-red-800 text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
                      >
                        <Check className="w-3.5 h-3.5" />
                        {savingEdit ? 'Saqlanmoqda...' : 'Saqlash'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed pl-12">
                    {comment.content}
                  </p>
                )}
              </div>
            )
          })
        )}
      </div>

      {/* Google Sign-in Modal */}
      <GoogleSignInModal
        isOpen={isSignInModalOpen}
        onClose={() => setIsSignInModalOpen(false)}
        onSuccess={(user) => {
          setCurrentUser(user)
        }}
      />
    </section>
  )
}
