import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// GET /api/news/[slug]/comments
export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  try {
    const article = await prisma.newsArticle.findUnique({
      where: { slug },
      select: { id: true },
    })

    if (!article) {
      return NextResponse.json({ error: 'Maqola topilmadi' }, { status: 404 })
    }

    const comments = await prisma.comment.findMany({
      where: { articleId: article.id },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ comments })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Server xatosi' }, { status: 500 })
  }
}

// POST /api/news/[slug]/comments
export async function POST(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  try {
    const body = await req.json()
    const { authorName, authorEmail, authorImage, content } = body

    if (!authorName || !authorEmail || !content || !content.trim()) {
      return NextResponse.json(
        { error: 'Barcha maydonlarni to\'ldiring (Ism, Email, Fikr matni)' },
        { status: 400 }
      )
    }

    const article = await prisma.newsArticle.findUnique({
      where: { slug },
      select: { id: true },
    })

    if (!article) {
      return NextResponse.json({ error: 'Maqola topilmadi' }, { status: 404 })
    }

    const comment = await prisma.comment.create({
      data: {
        articleId: article.id,
        authorName: authorName.trim(),
        authorEmail: authorEmail.trim().toLowerCase(),
        authorImage: authorImage || null,
        content: content.trim(),
      },
    })

    return NextResponse.json({ comment }, { status: 201 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Server xatosi' }, { status: 500 })
  }
}
