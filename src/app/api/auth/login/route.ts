import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import bcrypt from 'bcryptjs'
import { signToken } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Email va parol kiritilishi shart' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      return NextResponse.json({ error: 'Email yoki parol noto\'g\'ri' }, { status: 401 })
    }

    const isValid = await bcrypt.compare(password, user.passwordHash)
    if (!isValid) {
      return NextResponse.json({ error: 'Email yoki parol noto\'g\'ri' }, { status: 401 })
    }

    const token = await signToken({ userId: user.id, email: user.email, role: user.role })

    return NextResponse.json({
      token,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
    })
  } catch (err) {
    console.error('Login error:', err)
    return NextResponse.json({ error: 'Server xatosi' }, { status: 500 })
  }
}
