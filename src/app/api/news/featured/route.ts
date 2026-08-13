import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// GET /api/news/featured?count=5
export async function GET(req: NextRequest) {
  const count = parseInt(new URL(req.url).searchParams.get('count') || '5')

  try {
    const articles = await prisma.newsArticle.findMany({
      where: { status: 1, isFeatured: true },
      orderBy: { publishedAt: 'desc' },
      take: count,
      include: { category: true },
    })

    // If not enough featured, fill with latest
    if (articles.length < count) {
      const existing = articles.map((a: any) => a.id)
      const extra = await prisma.newsArticle.findMany({
        where: { status: 1, id: { notIn: existing } },
        orderBy: { publishedAt: 'desc' },
        take: count - articles.length,
        include: { category: true },
      })
      articles.push(...extra)
    }

    return NextResponse.json(
      articles.map((a: any) => ({
        id: a.id,
        title: a.title,
        slug: a.slug,
        shortDescription: a.shortDescription,
        coverImageUrl: a.coverImageUrl,
        categoryId: a.categoryId,
        categoryName: a.category.name,
        categorySlug: a.category.slug,
        author: a.author || 'Urgut Today Tahririyati',
        status: a.status,
        isFeatured: a.isFeatured,
        viewCount: a.viewCount,
        publishedAt: a.publishedAt,
      }))
    )
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Server xatosi' }, { status: 500 })
  }
}
