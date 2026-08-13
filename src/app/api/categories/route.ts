import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { verifyToken, getTokenFromHeader } from '@/lib/auth'

// GET /api/categories
export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { order: 'asc' },
      include: { _count: { select: { articles: { where: { status: 1 } } } } },
    })

    return NextResponse.json(
      categories.map((c: any) => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        description: c.description,
        order: c.order,
        articleCount: c._count.articles,
      }))
    )
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Server xatosi' }, { status: 500 })
  }
}

// POST /api/categories [Admin]
export async function POST(req: NextRequest) {
  try {
    const token = getTokenFromHeader(req.headers.get('authorization'))
    if (!token) return NextResponse.json({ error: 'Ruxsat yo\'q' }, { status: 401 })
    await verifyToken(token)

    const { name, description, order } = await req.json()
    if (!name) return NextResponse.json({ error: 'Nom kiritilishi shart' }, { status: 400 })

    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()

    const category = await prisma.category.create({
      data: { name, slug, description: description || '', order: order || 0 },
    })

    return NextResponse.json({ ...category, articleCount: 0 }, { status: 201 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Server xatosi' }, { status: 500 })
  }
}
