import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { verifyToken, getTokenFromHeader } from '@/lib/auth'

const newsSelect = {
  id: true,
  title: true,
  slug: true,
  shortDescription: true,
  coverImageUrl: true,
  categoryId: true,
  category: { select: { name: true, slug: true } },
  author: true,
  status: true,
  isFeatured: true,
  viewCount: true,
  publishedAt: true,
}

function mapArticle(a: any) {
  return {
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
  }
}

// GET /api/news
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const search = searchParams.get('search') || ''
  const categorySlug = searchParams.get('categorySlug') || ''
  const status = searchParams.get('status')
  const isFeatured = searchParams.get('isFeatured')
  const page = parseInt(searchParams.get('page') || '1')
  const pageSize = parseInt(searchParams.get('pageSize') || '10')

  // Check for stats endpoint
  const isStats = searchParams.get('stats') === 'true'
  if (isStats) {
    try {
      const token = getTokenFromHeader(req.headers.get('authorization'))
      if (!token) return NextResponse.json({ error: 'Ruxsat yo\'q' }, { status: 401 })
      await verifyToken(token)

      const [totalNews, publishedNews, draftNews, categoryCount, viewsAgg] = await Promise.all([
        prisma.newsArticle.count(),
        prisma.newsArticle.count({ where: { status: 1 } }),
        prisma.newsArticle.count({ where: { status: 0 } }),
        prisma.category.count(),
        prisma.newsArticle.aggregate({ _sum: { viewCount: true } }),
      ])

      return NextResponse.json({
        totalNews,
        publishedNews,
        draftNews,
        categoryCount,
        totalViews: viewsAgg._sum.viewCount || 0,
      })
    } catch (err) {
      return NextResponse.json({ error: 'Server xatosi' }, { status: 500 })
    }
  }

  try {
    const where: any = {}

    // Public users only see published. Admins see all if status param provided
    const authHeader = req.headers.get('authorization')
    const isAdmin = authHeader?.startsWith('Bearer ')

    if (!isAdmin) {
      where.status = 1
    } else if (status !== null && status !== '') {
      where.status = parseInt(status)
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { shortDescription: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
      ]
    }

    if (categorySlug) {
      where.category = { slug: { equals: categorySlug, mode: 'insensitive' } }
    }

    if (isFeatured === 'true') where.isFeatured = true

    const [items, totalItems] = await Promise.all([
      prisma.newsArticle.findMany({
        where,
        select: newsSelect,
        orderBy: { publishedAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.newsArticle.count({ where }),
    ])

    return NextResponse.json({
      items: items.map(mapArticle),
      totalItems,
      page,
      pageSize,
      totalPages: Math.ceil(totalItems / pageSize),
    })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Server xatosi' }, { status: 500 })
  }
}

// POST /api/news [Admin]
export async function POST(req: NextRequest) {
  try {
    const token = getTokenFromHeader(req.headers.get('authorization'))
    if (!token) return NextResponse.json({ error: 'Ruxsat yo\'q' }, { status: 401 })
    await verifyToken(token)

    const data = await req.json()
    const {
      title, shortDescription, content, coverImageUrl,
      additionalImages, categoryId, author, sourceUrl,
      videoUrl, status, isFeatured, tags,
    } = data

    if (!title || !shortDescription || !content || !categoryId) {
      return NextResponse.json({ error: 'Majburiy maydonlar to\'ldirilmagan' }, { status: 400 })
    }

    // Generate unique slug
    let slug = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
      .slice(0, 100)

    const existing = await prisma.newsArticle.findFirst({ where: { slug } })
    if (existing) slug = `${slug}-${Date.now()}`

    const article = await prisma.newsArticle.create({
      data: {
        title,
        slug,
        shortDescription,
        content,
        coverImageUrl: coverImageUrl || null,
        additionalImages: additionalImages || [],
        categoryId: Number(categoryId),
        author: author || null,
        sourceUrl: sourceUrl || null,
        videoUrl: videoUrl || null,
        status: Number(status),
        isFeatured: Boolean(isFeatured),
        tags: tags || [],
        publishedAt: new Date(),
      },
      include: { category: true },
    })

    return NextResponse.json(article, { status: 201 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Server xatosi' }, { status: 500 })
  }
}
