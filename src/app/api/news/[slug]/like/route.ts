import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// GET /api/news/[slug]/like?identifier=...
export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const { searchParams } = new URL(req.url)
  const identifier = searchParams.get('identifier') || req.headers.get('x-client-id') || ''

  try {
    const article = await prisma.newsArticle.findUnique({
      where: { slug },
      select: { id: true, likeCount: true },
    })

    if (!article) {
      return NextResponse.json({ error: 'Topilmadi' }, { status: 404 })
    }

    let hasLiked = false
    if (identifier) {
      const existing = await prisma.articleLike.findUnique({
        where: {
          articleId_identifier: {
            articleId: article.id,
            identifier,
          },
        },
      })
      hasLiked = !!existing
    }

    return NextResponse.json({
      likeCount: article.likeCount || 0,
      hasLiked,
    })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Server xatosi' }, { status: 500 })
  }
}

// POST /api/news/[slug]/like
export async function POST(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  try {
    const body = await req.json().catch(() => ({}))
    const identifier = body.identifier || req.headers.get('x-client-id') || ''

    if (!identifier) {
      return NextResponse.json({ error: 'Foydalanuvchi identifikatori topilmadi' }, { status: 400 })
    }

    const article = await prisma.newsArticle.findUnique({
      where: { slug },
      select: { id: true, likeCount: true },
    })

    if (!article) {
      return NextResponse.json({ error: 'Maqola topilmadi' }, { status: 404 })
    }

    // Check if already liked
    const existing = await prisma.articleLike.findUnique({
      where: {
        articleId_identifier: {
          articleId: article.id,
          identifier,
        },
      },
    })

    let hasLiked = false
    let newCount = article.likeCount || 0

    if (existing) {
      // Unlike: remove like and decrement count
      await prisma.articleLike.delete({
        where: { id: existing.id },
      })
      newCount = Math.max(0, newCount - 1)
      await prisma.newsArticle.update({
        where: { id: article.id },
        data: { likeCount: newCount },
      })
      hasLiked = false
    } else {
      // Like: create like and increment count
      await prisma.articleLike.create({
        data: {
          articleId: article.id,
          identifier,
        },
      })
      newCount = newCount + 1
      await prisma.newsArticle.update({
        where: { id: article.id },
        data: { likeCount: newCount },
      })
      hasLiked = true
    }

    return NextResponse.json({
      likeCount: newCount,
      hasLiked,
    })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Server xatosi' }, { status: 500 })
  }
}
