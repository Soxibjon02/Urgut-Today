import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { verifyToken, getTokenFromHeader } from '@/lib/auth'

export interface LayoutBlock {
  id: string
  type: 'hero' | 'ticker' | 'date_filter' | 'latest' | 'category' | 'trending' | 'pwa_promo' | 'about_promo'
  title: string
  enabled: boolean
  style: 'bbc-lead' | 'cnn-magazine' | 'editorial-sidebar' | 'cards-grid' | 'compact-list' | 'standard'
  showSideList?: boolean
  categoryId?: number
  categorySlug?: string
  itemCount?: number
}

export const DEFAULT_HOMEPAGE_LAYOUT: LayoutBlock[] = [
  {
    id: 'block_hero',
    type: 'hero',
    title: 'Asosiy Yangilik (Hero Lead)',
    enabled: true,
    style: 'bbc-lead',
    showSideList: false,
  },
  {
    id: 'block_date_filter',
    type: 'date_filter',
    title: "Sana bo'yicha saralash filtri",
    enabled: true,
    style: 'standard',
  },
  {
    id: 'block_latest',
    type: 'latest',
    title: "Eng so'nggi yangiliklar lentalari",
    enabled: true,
    style: 'cards-grid',
    itemCount: 8,
  },
  {
    id: 'block_pwa_promo',
    type: 'pwa_promo',
    title: "Mobil ilova o'rnatish banneri (PWA)",
    enabled: true,
    style: 'standard',
  },
  {
    id: 'block_categories',
    type: 'category',
    title: 'Kategoriyalar maxsus bloklari',
    enabled: true,
    style: 'cnn-magazine',
  },
  {
    id: 'block_about_promo',
    type: 'about_promo',
    title: 'Urgut Media haqida promo banneri',
    enabled: true,
    style: 'standard',
  },
]

// GET /api/layout
export async function GET() {
  try {
    const setting = await prisma.siteSetting.findUnique({
      where: { key: 'homepage_layout' },
    })

    if (!setting || !setting.value) {
      return NextResponse.json({ blocks: DEFAULT_HOMEPAGE_LAYOUT })
    }

    try {
      const parsed = JSON.parse(setting.value)
      return NextResponse.json({ blocks: Array.isArray(parsed) ? parsed : DEFAULT_HOMEPAGE_LAYOUT })
    } catch {
      return NextResponse.json({ blocks: DEFAULT_HOMEPAGE_LAYOUT })
    }
  } catch (err) {
    console.error('Error fetching layout:', err)
    return NextResponse.json({ blocks: DEFAULT_HOMEPAGE_LAYOUT })
  }
}

// PUT /api/layout [Admin]
export async function PUT(req: NextRequest) {
  try {
    const token = getTokenFromHeader(req.headers.get('authorization'))
    if (!token) return NextResponse.json({ error: "Ruxsat yo'q" }, { status: 401 })
    await verifyToken(token)

    const body = await req.json()
    const blocks = body.blocks

    if (!Array.isArray(blocks)) {
      return NextResponse.json({ error: "Noto'g'ri ma'lumot formati" }, { status: 400 })
    }

    await prisma.siteSetting.upsert({
      where: { key: 'homepage_layout' },
      update: { value: JSON.stringify(blocks) },
      create: { key: 'homepage_layout', value: JSON.stringify(blocks) },
    })

    return NextResponse.json({ success: true, blocks })
  } catch (err) {
    console.error('Error saving layout:', err)
    return NextResponse.json({ error: 'Server xatosi' }, { status: 500 })
  }
}
