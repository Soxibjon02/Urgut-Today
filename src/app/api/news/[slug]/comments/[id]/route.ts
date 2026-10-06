import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { verifyToken, getTokenFromHeader } from '@/lib/auth'

// PUT /api/news/[slug]/comments/[id] - Edit comment
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string; id: string }> }
) {
  const { id } = await params
  const commentId = parseInt(id)

  if (isNaN(commentId)) {
    return NextResponse.json({ error: 'ID noto\'g\'ri' }, { status: 400 })
  }

  try {
    const body = await req.json()
    const { userEmail, content } = body

    if (!content || !content.trim()) {
      return NextResponse.json({ error: 'Fikr matni bo\'sh bo\'lmasligi kerak' }, { status: 400 })
    }

    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
    })

    if (!comment) {
      return NextResponse.json({ error: 'Fikr topilmadi' }, { status: 404 })
    }

    // Check if requester is author or admin
    const authHeader = req.headers.get('authorization')
    let isAdmin = false
    if (authHeader) {
      try {
        const token = getTokenFromHeader(authHeader)
        if (token) {
          await verifyToken(token)
          isAdmin = true
        }
      } catch {}
    }

    const isAuthor =
      userEmail && comment.authorEmail.toLowerCase() === String(userEmail).trim().toLowerCase()

    if (!isAuthor && !isAdmin) {
      return NextResponse.json(
        { error: 'Faqat o\'zingiz yozgan fikrni tahrirlashingiz mumkin' },
        { status: 403 }
      )
    }

    const updated = await prisma.comment.update({
      where: { id: commentId },
      data: { content: content.trim() },
    })

    return NextResponse.json({ comment: updated })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Server xatosi' }, { status: 500 })
  }
}

// DELETE /api/news/[slug]/comments/[id] - Delete comment
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string; id: string }> }
) {
  const { id } = await params
  const commentId = parseInt(id)

  if (isNaN(commentId)) {
    return NextResponse.json({ error: 'ID noto\'g\'ri' }, { status: 400 })
  }

  try {
    const { searchParams } = new URL(req.url)
    const userEmail = searchParams.get('userEmail') || req.headers.get('x-user-email') || ''

    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
    })

    if (!comment) {
      return NextResponse.json({ error: 'Fikr topilmadi' }, { status: 404 })
    }

    // Check if requester is author or admin
    const authHeader = req.headers.get('authorization')
    let isAdmin = false
    if (authHeader) {
      try {
        const token = getTokenFromHeader(authHeader)
        if (token) {
          await verifyToken(token)
          isAdmin = true
        }
      } catch {}
    }

    const isAuthor =
      userEmail && comment.authorEmail.toLowerCase() === String(userEmail).trim().toLowerCase()

    if (!isAuthor && !isAdmin) {
      return NextResponse.json(
        { error: 'Faqat o\'zingiz yozgan fikrni o\'chirishingiz mumkin' },
        { status: 403 }
      )
    }

    await prisma.comment.delete({
      where: { id: commentId },
    })

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Server xatosi' }, { status: 500 })
  }
}
