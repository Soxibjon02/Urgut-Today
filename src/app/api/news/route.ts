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
  category: { select: { id: true, name: true, slug: true } },
  categories: { select: { id: true, name: true, slug: true } },
  author: true,
  status: true,
  isFeatured: true,
  viewCount: true,
  likeCount: true,
  publishedAt: true,
}

function mapArticle(a: any) {
  const cats: Array<{ id: number; name: string; slug: string }> =
    Array.isArray(a.categories) && a.categories.length > 0
      ? a.categories
      : a.category
      ? [a.category]
      : []
  const primary = cats[0] || { id: 0, name: 'Umumiy', slug: 'umumiy' }

  return {
    id: a.id,
    title: a.title,
    slug: a.slug,
    shortDescription: a.shortDescription,
    coverImageUrl: a.coverImageUrl,
    categoryId: primary.id,
    categoryName: primary.name,
    categorySlug: primary.slug,
    categories: cats,
    author: a.author || 'Urgut Today Tahririyati',
    status: a.status,
    isFeatured: a.isFeatured,
    viewCount: a.viewCount,
    likeCount: a.likeCount || 0,
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
  const datePreset = searchParams.get('datePreset') || searchParams.get('preset') || ''
  const specificDate = searchParams.get('date') || ''
  const startDate = searchParams.get('startDate') || ''
  const endDate = searchParams.get('endDate') || ''
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
      where.OR = [
        { category: { slug: { equals: categorySlug, mode: 'insensitive' } } },
        { categories: { some: { slug: { equals: categorySlug, mode: 'insensitive' } } } },
      ]
    }

    if (isFeatured === 'true') where.isFeatured = true

    // Date filtering: today, yesterday, specific date, or date range
    if (datePreset === 'today') {
      const now = new Date()
      const dStr = now.toISOString().split('T')[0]
      where.publishedAt = {
        gte: new Date(`${dStr}T00:00:00.000Z`),
        lte: new Date(`${dStr}T23:59:59.999Z`),
      }
    } else if (datePreset === 'yesterday') {
      const y = new Date()
      y.setDate(y.getDate() - 1)
      const dStr = y.toISOString().split('T')[0]
      where.publishedAt = {
        gte: new Date(`${dStr}T00:00:00.000Z`),
        lte: new Date(`${dStr}T23:59:59.999Z`),
      }
    } else if (specificDate) {
      where.publishedAt = {
        gte: new Date(`${specificDate}T00:00:00.000Z`),
        lte: new Date(`${specificDate}T23:59:59.999Z`),
      }
    } else if (startDate || endDate) {
      where.publishedAt = {}
      if (startDate) {
        where.publishedAt.gte = new Date(`${startDate}T00:00:00.000Z`)
      }
      if (endDate) {
        where.publishedAt.lte = new Date(`${endDate}T23:59:59.999Z`)
      }
    }

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
      additionalImages, categoryId, categoryIds, author, sourceUrl,
      videoUrl, status, isFeatured, tags,
    } = data

    const selectedCategoryIds: number[] = Array.isArray(categoryIds) && categoryIds.length > 0
      ? categoryIds.map(Number)
      : categoryId ? [Number(categoryId)] : []

    if (!title || !shortDescription || !content || selectedCategoryIds.length === 0) {
      return NextResponse.json({ error: 'Majburiy maydonlar to\'ldirilmagan yoki bo\'lim tanlanmagan' }, { status: 400 })
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
        categoryId: selectedCategoryIds[0],
        categories: {
          connect: selectedCategoryIds.map((id) => ({ id })),
        },
        author: author || null,
        sourceUrl: sourceUrl || null,
        videoUrl: videoUrl || null,
        status: Number(status),
        isFeatured: Boolean(isFeatured),
        tags: tags || [],
        publishedAt: new Date(),
      },
      include: { category: true, categories: true },
    })

    return NextResponse.json(mapArticle(article), { status: 201 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Server xatosi' }, { status: 500 })
  }
}
