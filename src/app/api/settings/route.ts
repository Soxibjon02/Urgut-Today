import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { verifyToken, getTokenFromHeader } from '@/lib/auth'

// GET /api/settings
export async function GET() {
  try {
    const settings = await prisma.siteSetting.findMany()
    const map: Record<string, string> = {}
    settings.forEach((s: any) => { map[s.key] = s.value })

    return NextResponse.json({
      siteName: map['siteName'] || 'Urgut Today',
      logoText: map['logoText'] || 'URGUT TODAY',
      subtitle: map['subtitle'] || 'Samarqand • Urgut tumani',
      phone: map['phone'] || '+998 90 000 00 00',
      email: map['email'] || 'info@urguttoday.uz',
      telegramUrl: map['telegramUrl'] || '',
      facebookUrl: map['facebookUrl'] || '',
      instagramUrl: map['instagramUrl'] || '',
      footerText: map['footerText'] || 'Urgut tumani bo\'yicha ishonchli va tezkor axborot manbai.',
    })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Server xatosi' }, { status: 500 })
  }
}

// PUT /api/settings [Admin]
export async function PUT(req: NextRequest) {
  try {
    const token = getTokenFromHeader(req.headers.get('authorization'))
    if (!token) return NextResponse.json({ error: 'Ruxsat yo\'q' }, { status: 401 })
    await verifyToken(token)

    const body = await req.json()
    const entries = Object.entries(body) as [string, string][]

    await Promise.all(
      entries.map(([key, value]) =>
        prisma.siteSetting.upsert({
          where: { key },
          update: { value: String(value) },
          create: { key, value: String(value) },
        })
      )
    )

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Server xatosi' }, { status: 500 })
  }
}
