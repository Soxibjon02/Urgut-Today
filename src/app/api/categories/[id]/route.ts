import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { verifyToken, getTokenFromHeader } from '@/lib/auth'

// PUT /api/categories/[id]
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const token = getTokenFromHeader(req.headers.get('authorization'))
    if (!token) return NextResponse.json({ error: 'Ruxsat yo\'q' }, { status: 401 })
    await verifyToken(token)

    const { id } = await params
    const { name, description, order } = await req.json()

    const updated = await prisma.category.update({
      where: { id: Number(id) },
      data: { name, description, order },
    })

    return NextResponse.json(updated)
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Server xatosi' }, { status: 500 })
  }
}

// DELETE /api/categories/[id]
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const token = getTokenFromHeader(req.headers.get('authorization'))
    if (!token) return NextResponse.json({ error: 'Ruxsat yo\'q' }, { status: 401 })
    await verifyToken(token)

    const { id } = await params
    await prisma.category.delete({ where: { id: Number(id) } })
    return new NextResponse(null, { status: 204 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Server xatosi' }, { status: 500 })
  }
}
