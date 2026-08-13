import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// GET /api/news/related/[slug]?count=4
export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const count = parseInt(new URL(req.url).searchParams.get('count') || '4')

  try {
    const article = await prisma.newsArticle.findUnique({
      where: { slug },
      select: { categoryId: true, id: true },
    })

    if (!article) {
      return NextResponse.json([])
    }

    const related = await prisma.newsArticle.findMany({
      where: {
        status: 1,
        categoryId: article.categoryId,
        id: { not: article.id },
      },
      orderBy: { publishedAt: 'desc' },
      take: count,
      include: { category: true },
    })

    return NextResponse.json(
      related.map((a: any) => ({
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
