'use client'

export interface BookmarkedArticle {
  id: number
  title: string
  slug: string
  shortDescription: string
  coverImageUrl?: string
  categoryName: string
  publishedAt: string
  savedAt: number
}

const STORAGE_KEY = 'urgut_today_bookmarks_v1'

export function getBookmarks(): BookmarkedArticle[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch (e) {
    console.error('Failed to parse bookmarks', e)
    return []
  }
}

export function isBookmarked(id: number): boolean {
  if (typeof window === 'undefined') return false
  const list = getBookmarks()
  return list.some((item) => item.id === id)
}

export function toggleBookmark(article: {
  id: number
  title: string
  slug: string
  shortDescription: string
  coverImageUrl?: string
  categoryName: string
  publishedAt: string
}): boolean {
  if (typeof window === 'undefined') return false
  const current = getBookmarks()
  const exists = current.some((item) => item.id === article.id)

  let updated: BookmarkedArticle[]
  if (exists) {
    updated = current.filter((item) => item.id !== article.id)
  } else {
    const newItem: BookmarkedArticle = {
      id: article.id,
      title: article.title,
      slug: article.slug,
      shortDescription: article.shortDescription,
      coverImageUrl: article.coverImageUrl,
      categoryName: article.categoryName,
      publishedAt: article.publishedAt,
      savedAt: Date.now(),
    }
    updated = [newItem, ...current]
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    window.dispatchEvent(new Event('bookmarks-updated'))
  } catch (e) {
    console.error('Failed to save bookmark', e)
  }

  return !exists
}
