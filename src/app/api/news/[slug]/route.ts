import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { verifyToken, getTokenFromHeader } from '@/lib/auth'

// GET /api/news/[slug]
export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  try {
    const article = await prisma.newsArticle.findUnique({
      where: { slug },
      include: { category: true, categories: true },
    })

    if (!article || article.status !== 1) {
      return NextResponse.json({ error: 'Topilmadi' }, { status: 404 })
    }

    // Increment view count
    await prisma.newsArticle.update({
      where: { id: article.id },
      data: { viewCount: { increment: 1 } },
    })

    const cats: Array<{ id: number; name: string; slug: string }> =
      Array.isArray(article.categories) && article.categories.length > 0
        ? article.categories
        : article.category
        ? [article.category]
        : []
    const primary = cats[0] || { id: 0, name: 'Umumiy', slug: 'umumiy' }

    return NextResponse.json({
      id: article.id,
      title: article.title,
      slug: article.slug,
      shortDescription: article.shortDescription,
      content: article.content,
      coverImageUrl: article.coverImageUrl,
      additionalImages: article.additionalImages,
      categoryId: primary.id,
      categoryName: primary.name,
      categorySlug: primary.slug,
      categories: cats,
      categoryIds: cats.map((c) => c.id),
      author: article.author,
      sourceUrl: article.sourceUrl,
      videoUrl: article.videoUrl,
      status: article.status,
      isFeatured: article.isFeatured,
      tags: article.tags,
      viewCount: article.viewCount + 1,
      likeCount: article.likeCount || 0,
      createdAt: article.createdAt,
      updatedAt: article.updatedAt,
      publishedAt: article.publishedAt,
    })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Server xatosi' }, { status: 500 })
  }
}

// PUT /api/news/[slug] (edit by id - slug is actually the id here)
export async function PUT(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const token = getTokenFromHeader(req.headers.get('authorization'))
    if (!token) return NextResponse.json({ error: 'Ruxsat yo\'q' }, { status: 401 })
    await verifyToken(token)

    const { slug } = await params
    const data = await req.json()

    const selectedCategoryIds: number[] = Array.isArray(data.categoryIds) && data.categoryIds.length > 0
      ? data.categoryIds.map(Number)
      : data.categoryId ? [Number(data.categoryId)] : []

    const updateData: any = {
      title: data.title,
      shortDescription: data.shortDescription,
      content: data.content,
      coverImageUrl: data.coverImageUrl || null,
      additionalImages: data.additionalImages || [],
      author: data.author || null,
      sourceUrl: data.sourceUrl || null,
      videoUrl: data.videoUrl || null,
      status: Number(data.status),
      isFeatured: Boolean(data.isFeatured),
      tags: data.tags || [],
    }

    if (selectedCategoryIds.length > 0) {
      updateData.categoryId = selectedCategoryIds[0]
      updateData.categories = {
        set: selectedCategoryIds.map((id) => ({ id })),
      }
    }

    const updated = await prisma.newsArticle.update({
      where: { id: Number(slug) },
      data: updateData,
      include: { category: true, categories: true },
    })

    return NextResponse.json(updated)
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Server xatosi' }, { status: 500 })
  }
}

// DELETE /api/news/[slug]
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const token = getTokenFromHeader(req.headers.get('authorization'))
    if (!token) return NextResponse.json({ error: 'Ruxsat yo\'q' }, { status: 401 })
    await verifyToken(token)

    const { slug } = await params
    await prisma.newsArticle.delete({ where: { id: Number(slug) } })
    return new NextResponse(null, { status: 204 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Server xatosi' }, { status: 500 })
  }
}

// PATCH /api/news/[slug] — toggle status
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const token = getTokenFromHeader(req.headers.get('authorization'))
    if (!token) return NextResponse.json({ error: 'Ruxsat yo\'q' }, { status: 401 })
    await verifyToken(token)

    const { slug } = await params
    const { searchParams } = new URL(req.url)
    const status = parseInt(searchParams.get('status') || '0')

    await prisma.newsArticle.update({
      where: { id: Number(slug) },
      data: { status },
    })

    return new NextResponse(null, { status: 204 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Server xatosi' }, { status: 500 })
  }
}
