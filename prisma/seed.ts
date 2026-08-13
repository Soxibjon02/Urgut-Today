import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seed data yuklanmoqda...')

  // Admin user
  const existing = await prisma.user.findUnique({ where: { email: 'admin@urguttoday.uz' } })
  if (!existing) {
    const hash = await bcrypt.hash('Admin@123456', 12)
    await prisma.user.create({
      data: {
        email: 'admin@urguttoday.uz',
        fullName: 'Urgut Today Admin',
        passwordHash: hash,
        role: 'SuperAdmin',
      },
    })
    console.log('✅ Admin user yaratildi')
  }

  // Categories
  const catCount = await prisma.category.count()
  if (catCount === 0) {
    const categories = [
      { name: 'Urgut', slug: 'urgut', description: 'Urgut tumani hayotiga oid asosiy xabarlar', order: 1 },
      { name: 'Yangiliklar', slug: 'yangiliklar', description: "Eng so'nggi mahalliy yangiliklar", order: 2 },
      { name: 'Jamiyat', slug: 'jamiyat', description: 'Mahalliy aholi va ijtimoiy soha yangiliklari', order: 3 },
      { name: "Ta'lim", slug: 'talim', description: 'Maktablar, kollejlar va ta\'lim yangiliklari', order: 4 },
      { name: 'Sport', slug: 'sport', description: 'Urgutlik sportchilar va musobaqalar', order: 5 },
      { name: 'Madaniyat', slug: 'madaniyat', description: "San'at, adabiyot va bayramlar", order: 6 },
      { name: 'Iqtisodiyot', slug: 'iqtisodiyot', description: 'Erkin iqtisodiy zona va tadbirkorlik', order: 7 },
      { name: 'Texnologiya', slug: 'texnologiya', description: 'IT va raqamlashtirish yangiliklari', order: 8 },
      { name: "E'lonlar", slug: 'elonlar', description: "Rasmiy e'lonlar va bildirishnomalar", order: 9 },
      { name: 'Muhim', slug: 'muhim', description: 'Favqulodda va muhim shoshilinch axborotlar', order: 10 },
    ]
    await prisma.category.createMany({ data: categories })
    console.log('✅ Kategoriyalar yaratildi')
  }

  // Site settings
  const settingsCount = await prisma.siteSetting.count()
  if (settingsCount === 0) {
    const settings = [
      { key: 'siteName', value: 'Urgut Today' },
      { key: 'logoText', value: 'URGUT TODAY' },
      { key: 'subtitle', value: "Samarqand • Urgut tumani — Mahalliy yangiliklar portali" },
      { key: 'phone', value: '+998 90 123 45 67' },
      { key: 'email', value: 'info@urguttoday.uz' },
      { key: 'telegramUrl', value: 'https://t.me/urguttoday' },
      { key: 'facebookUrl', value: '' },
      { key: 'instagramUrl', value: '' },
      { key: 'footerText', value: "Urgut tumani bo'yicha ishonchli va tezkor axborot manbai. 2026 yildan buyon xizmatda." },
    ]
    await prisma.siteSetting.createMany({ data: settings })
    console.log('✅ Sayt sozlamalari yaratildi')
  }

  // Sample news articles
  const newsCount = await prisma.newsArticle.count()
  if (newsCount === 0) {
    const iqtisodiyot = await prisma.category.findUnique({ where: { slug: 'iqtisodiyot' } })
    const talim = await prisma.category.findUnique({ where: { slug: 'talim' } })
    const sport = await prisma.category.findUnique({ where: { slug: 'sport' } })
    const jamiyat = await prisma.category.findUnique({ where: { slug: 'jamiyat' } })
    const muhim = await prisma.category.findUnique({ where: { slug: 'muhim' } })
    const urgut = await prisma.category.findUnique({ where: { slug: 'urgut' } })

    const now = new Date()
    const articles = [
      {
        title: "Urgut Erkin Iqtisodiy Zonasida Yangi Yirik Sanoat Korxonasi Ishga Tushirildi",
        slug: "urgut-erkin-iqtisodiy-zonasida-yangi-yirik-sanoat-korxonasi",
        shortDescription: "Bugun Urgut tumanida qiymati 45 million dollarlik zamonaviy to'qimachilik va maishiy texnika ishlab chiqarish majmuasi tantanali ravishda ochildi.",
        content: `<p>Urgut Erkin Iqtisodiy Zonasida yangi yirik sanoat korxonasi ishga tushirildi. Ushbu loyiha 45 million dollar investitsiya jalb qildi va 850 nafar mahalliy aholi uchun ish o'rni yaratdi.</p>
<h3>Korxona haqida</h3>
<p>Zamonaviy to'qimachilik majmuasi yiliga 2 million dona mahsulot ishlab chiqarish quvvatiga ega. Mahsulotlar ichki bozor va eksportga mo'ljallangan.</p>
<blockquote class="border-l-4 border-red-700 pl-4 italic text-slate-700 my-4">Ushbu korxona Urgut tumani iqtisodiyotini rivojlantirish va mahalliy aholi turmush darajasini yuksaltirish yo'lida muhim qadam hisoblanadi.</blockquote>
<p>Tuman hokimi so'zlariga ko'ra, 2026 yil oxirigacha EIZ'da yana 3 ta yangi korxona faoliyat boshlaydi.</p>`,
        coverImageUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1200&auto=format&fit=crop&q=80",
        categoryId: iqtisodiyot!.id,
        author: "Sardor Rahimov",
        status: 1,
        isFeatured: true,
        tags: ["EIZ", "Iqtisodiyot", "Sanoat", "Investitsiya"],
        viewCount: 1420,
        publishedAt: new Date(now.getTime() - 3 * 60 * 60 * 1000),
      },
      {
        title: "Urgut Tumanidagi 15-sonli Maktabda Zamonaviy Kompyuter Xonasi va Kutubxona Ochildi",
        slug: "urgut-15-sonli-maktabda-kompyuter-xonasi-ochildi",
        shortDescription: "O'quvchilarning IT ko'nikmalarini oshirish maqsadida maktab so'nggi rusumdagi kompyuterlar bilan jihozlandi.",
        content: `<p>Urgut tumanidagi 15-sonli umumiy o'rta ta'lim maktabida 30 ta zamonaviy kompyuter bilan jihozlangan yangi xona va 5000 kitoblik kutubxona ochildi.</p>
<h3>Loyiha tafsilotlari</h3>
<p>Maktab direktorining aytishicha, yangi kompyuter xonasi o'quvchilarga dasturlash, grafik dizayn va raqamli savodxonlik bo'yicha darslar o'tish imkonini beradi.</p>
<p>Kutubxona fondida o'zbek va rus tillaridagi darslik va badiiy adabiyotlar, shuningdek, ilmiy-ommabop jurnal va gazetalar mavjud.</p>`,
        coverImageUrl: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=1200&auto=format&fit=crop&q=80",
        categoryId: talim!.id,
        author: "Malika Zokirova",
        status: 1,
        isFeatured: false,
        tags: ["Maktab", "Ta'lim", "IT", "Kompyuter"],
        viewCount: 890,
        publishedAt: new Date(now.getTime() - 6 * 60 * 60 * 1000),
      },
      {
        title: "Urgutlik Yosh Sportchi Xalqaro Kurash Turnirida Oltin Medalni Qo'lga Kiritdi",
        slug: "urgutlik-sportchi-kurash-turnirida-oltin-medal",
        shortDescription: "Buxoro shahrida o'tkazilgan xalqaro turnirda Urgut sport maktabi tarbiyalanuvchisi faxrli 1-o'rinni egalladi.",
        content: `<p>17 yoshli Shaxzod Elmurodov Buxoroda bo'lib o'tgan xalqaro kurash turnirida oltin medal qo'lga kiritdi. Sportchi 73 kg vaznida 8 nafar raqibini mag'lub etdi.</p>
<h3>Muvaffaqiyat siri</h3>
<p>Shaxzod 5 yildan beri Urgut sport maktabida mashg'ulot olib boradi. Murabbiysi Bahodir Toshmatov o'z shogirdining kelajagiga ishonch bildirdi.</p>`,
        coverImageUrl: "https://images.unsplash.com/photo-1517649763962-0c623266ddc0?w=1200&auto=format&fit=crop&q=80",
        categoryId: sport!.id,
        author: "Jamshid Alimov",
        status: 1,
        isFeatured: false,
        tags: ["Kurash", "Sport", "Medal", "Yosh sportchilar"],
        viewCount: 1150,
        publishedAt: new Date(now.getTime() - 9 * 60 * 60 * 1000),
      },
      {
        title: "Urgut Markazida Keng Ko'lamli Obodonlashtirish va Ko'kalamzorlashtirish Oyligi Boshlandi",
        slug: "urgut-markazida-obodonlashtirish-oyligi",
        shortDescription: "Tuman markazida 500 dan ortiq ko'chat ekilishi va yangi yashil zona tashkil etilishi rejalashtirilgan.",
        content: `<p>Urgut tuman hokimligi tashabbusi bilan keng ko'lamli obodonlashtirish va ko'kalamzorlashtirish oyligi boshlandi. Oylik davomida 500 dan ortiq daraxt ko'chatlari ekib chiqiladi.</p>
<h3>Reja</h3>
<p>Asosiy diqqat Mustaqillik ko'chasi va markaziy xiyobonga qaratiladi. Shuningdek, maktablar va mahalla binolari atrofi tartibga keltiriladi.</p>`,
        coverImageUrl: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=1200&auto=format&fit=crop&q=80",
        categoryId: jamiyat!.id,
        author: "Dilnoza Yusupova",
        status: 1,
        isFeatured: false,
        tags: ["Obodonlashtirish", "Ko'kalamzorlashtirish", "Ekologiya"],
        viewCount: 670,
        publishedAt: new Date(now.getTime() - 12 * 60 * 60 * 1000),
      },
      {
        title: "Urgut Tuman Elektr Tarmoqlarida Rejalashtirilgan Texnik Ta'mirlash Ishlari Haqida Ogohlik",
        slug: "urgut-elektr-tarmoqlarida-texnik-tamirlash",
        shortDescription: "15-17 avgust kunlari ba'zi mahallalar va ko'chalarda elektr energiyasi vaqtincha uziladi.",
        content: `<p><strong>Diqqat!</strong> 15-17 avgust 2026 yil kunlari Urgut tuman elektr tarmoqlarida rejalashtirilgan texnik ta'mirlash ishlari olib boriladi.</p>
<h3>Uzilish jadvali</h3>
<ul>
  <li>15-avgust: 09:00 - 17:00 — Chilonzor va Bog'ishamol mahalllalari</li>
  <li>16-avgust: 08:00 - 16:00 — Markaziy ko'cha (1-5-uylar)</li>
  <li>17-avgust: 10:00 - 18:00 — Industrial zona</li>
</ul>
<p>Noqulaylik uchun uzr so'raymiz. Qo'shimcha ma'lumot uchun: <strong>+998 76 345 67 89</strong></p>`,
        coverImageUrl: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=1200&auto=format&fit=crop&q=80",
        categoryId: muhim!.id,
        author: "Urgut Today Tahririyati",
        status: 1,
        isFeatured: true,
        tags: ["Elektr", "Ogohlik", "Texnik ishlar"],
        viewCount: 2100,
        publishedAt: new Date(now.getTime() - 1 * 60 * 60 * 1000),
      },
      {
        title: "Urgut Tog'larida Eko-Turizm Marshrutlari: Samarqand Viloyati Master-Plani Tasdiqlandi",
        slug: "urgut-toglarida-eko-turizm-marshrutlari",
        shortDescription: "Samarqand viloyati hokimligi Urgut tog' hududlarida eko-turizm yo'nalishlarini rivojlantirish bo'yicha master-planini tasdiqladi.",
        content: `<p>Samarqand viloyati hokimligi Urgut tumanining tog' hududlarida eko-turizm marshrutlarini tashkil etish bo'yicha 5 yillik master-planini tasdiqladi.</p>
<h3>Rejalar</h3>
<p>Birinchi bosqichda 3 ta yangi marshrut tashkil etiladi: Urgut-Omonqo'ton, Urgut-Zaamin tog' yoli va Amirsoy yo'nalishi.</p>
<p>Turizm infratuzilmasini rivojlantirish uchun 12 million dollar investitsiya jalb qilish rejalashtirilgan.</p>`,
        coverImageUrl: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200&auto=format&fit=crop&q=80",
        categoryId: urgut!.id,
        author: "Bekzod Normatov",
        status: 1,
        isFeatured: false,
        tags: ["Turizm", "Eko-turizm", "Tog'lar", "Urgut"],
        viewCount: 530,
        publishedAt: new Date(now.getTime() - 18 * 60 * 60 * 1000),
      },
    ]

    for (const article of articles) {
      await prisma.newsArticle.create({ data: article })
    }
    console.log('✅ Namunali yangiliklar yaratildi')
  }

  console.log('🎉 Seed data muvaffaqiyatli yuklandi!')
}

main()
  .catch((e) => {
    console.error('❌ Seed xatosi:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
