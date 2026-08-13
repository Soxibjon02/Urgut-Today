import { NextRequest, NextResponse } from 'next/server'
import { verifyToken, getTokenFromHeader } from '@/lib/auth'
import { uploadToCloudinary } from '@/lib/cloudinary'


// POST /api/uploads [Admin]
export async function POST(req: NextRequest) {
  try {
    const token = getTokenFromHeader(req.headers.get('authorization'))
    if (!token) return NextResponse.json({ error: 'Ruxsat yo\'q' }, { status: 401 })
    await verifyToken(token)

    const formData = await req.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'Fayl topilmadi' }, { status: 400 })
    }

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Ruxsat etilmagan fayl turi. JPG, PNG, WebP, GIF qabul qilinadi.' }, { status: 400 })
    }

    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      return NextResponse.json({ error: 'Fayl hajmi 10MB dan oshmasligi kerak' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const url = await uploadToCloudinary(buffer, file.name)

    return NextResponse.json({ url })
  } catch (err) {
    console.error('Upload error:', err)
    return NextResponse.json({ error: 'Yuklashda xatolik yuz berdi' }, { status: 500 })
  }
}
