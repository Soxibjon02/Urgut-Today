# 🚀 Urgut Today — Vercel Deploy Qollanmasi (Next.js + Neon + Cloudinary)

Barcha backend (API Routes), database (Prisma) va frontend Next.js ga 100% o'tkazildi!
Endi loyihangiz Vercel'da **bir nechta chertish** bilan ishga tushadi.

---

## 1-Qadam: Neon PostgreSQL bazasini tayyorlash

1. **[https://neon.tech](https://neon.tech)** saytiga kiring va bepul ro'yxatdan o'ting.
2. **"Create Project"** tugmasini bosing (masalan: `urgut-today-db`).
3. Ochilgan oynada **Connection String** ni ko'rasiz. Format:
   `postgresql://username:password@ep-xyz.us-east-1.aws.neon.tech/neondb?sslmode=require`
4. Ushbu connection string'ni nusxalab oling.

---

## 2-Qadam: Cloudinary (Rasm saqlash) sozlash

1. **[https://cloudinary.com](https://cloudinary.com)** saytiga kirib bepul ro'yxatdan o'ting.
2. Dashboard sahifasidan quyidagilarni nusxalang:
   - **Cloud Name**
   - **API Key**
   - **API Secret**

---

## 3-Qadam: GitHub'ga yuklash

Loyihani GitHub'ga joylang:
```powershell
cd "c:\Users\Soxibjon\Desktop\Urgut Today\nextjs"
git init
git add .
git commit -m "Initial commit for Vercel deploy"
git branch -M main
git remote add origin https://github.com/USERNAME/urgut-today.git
git push -u origin main
```

---

## 4-Qadam: Vercel'ga Deploy qilish

1. **[https://vercel.com](https://vercel.com)** ga kiring va GitHub akkountingiz bilan kiring.
2. **"Add New..."** -> **"Project"** bosing.
3. `urgut-today` repository'sini tanlang.
4. **Root Directory**: `./` deb qoldiring (yoki `nextjs` bo'lsa tanlang).
5. **Environment Variables** bo'limiga quyidagilarni kiriting:

| Variable Name | Qiymati |
|---|---|
| `DATABASE_URL` | Neon Connection String (1-qadam) |
| `DIRECT_URL` | Neon Connection String (1-qadam) |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary Cloud Name (2-qadam) |
| `CLOUDINARY_API_KEY` | Cloudinary API Key (2-qadam) |
| `CLOUDINARY_API_SECRET` | Cloudinary API Secret (2-qadam) |
| `JWT_SECRET` | `UrgutToday_SuperSecret_2026_Key` |

6. **Deploy** tugmasini bosing! 🚀

---

## 5-Qadam: Baza jadvallarini yaratish va Seed qilish

Deploy bo'lgach, bazani jadvallar va namunali xabarlar bilan to'ldirish uchun kompyuteringizdagi `.env.local` fayliga Neon va Cloudinary kalitlarini qo'ying hamda terminalda quyidagilarni bajaring:

```powershell
cd "c:\Users\Soxibjon\Desktop\Urgut Today\nextjs"

# 1. Bazada jadvallarni yaratish
npx prisma db push

# 2. Admin va namunali Urgut yangiliklarini yuklash
npx prisma db seed
```

---

## 🔐 Admin Paroli (Deploydan so'ng)

- **URL:** `https://saytingiz-nomi.vercel.app/admin/login`
- **Email:** `admin@urguttoday.uz`
- **Parol:** `Admin@123456`
