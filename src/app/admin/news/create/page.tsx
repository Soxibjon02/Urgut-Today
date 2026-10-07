'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft,
  Save,
  Upload,
  Plus,
  Check,
  FolderPlus,
  X,
  Layers,
} from 'lucide-react'
import AdminLayout from '@/components/AdminLayout'
import { LAYOUT_OPTIONS } from '@/components/news-layouts/NewsLayoutTemplates'

interface Category {
  id: number
  name: string
  slug: string
}

export default function AdminNewsCreatePage() {
  const router = useRouter()

  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([])
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)

  // New Category inline creation state
  const [isCatModalOpen, setIsCatModalOpen] = useState(false)
  const [newCatName, setNewCatName] = useState('')
  const [newCatDesc, setNewCatDesc] = useState('')
  const [newCatLayout, setNewCatLayout] = useState('bbc-lead')
  const [creatingCat, setCreatingCat] = useState(false)

  const [title, setTitle] = useState('')
  const [shortDescription, setShortDescription] = useState('')
  const [content, setContent] = useState('')
  const [coverImageUrl, setCoverImageUrl] = useState('')
  const [author, setAuthor] = useState('Urgut Today Tahririyati')
  const [status, setStatus] = useState<number>(1)
  const [isFeatured, setIsFeatured] = useState(false)
  const [tagsInput, setTagsInput] = useState('Urgut, Yangiliklar')

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories')
      const data = await res.json()
      setCategories(data)
      if (data.length > 0 && selectedCategoryIds.length === 0) {
        setSelectedCategoryIds([data[0].id])
      }
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  const toggleCategory = (catId: number) => {
    setSelectedCategoryIds((prev) =>
      prev.includes(catId)
        ? prev.length > 1
          ? prev.filter((id) => id !== catId)
          : prev // keep at least 1
        : [...prev, catId]
    )
  }

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newCatName.trim()) return

    const token = localStorage.getItem('urgut_admin_token')
    try {
      setCreatingCat(true)
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: newCatName.trim(),
          description: newCatDesc.trim(),
          order: categories.length + 1,
          layoutType: newCatLayout,
        }),
      })

      if (res.ok) {
        const createdCat = await res.json()
        setCategories((prev) => [...prev, createdCat])
        setSelectedCategoryIds((prev) => [...prev, createdCat.id])
        setNewCatName('')
        setNewCatDesc('')
        setIsCatModalOpen(false)
      } else {
        alert("Bo'lim yaratishda xatolik yuz berdi")
      }
    } catch {
      alert('Tarmoq xatosi')
    } finally {
      setCreatingCat(false)
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setUploading(true)
      const token = localStorage.getItem('urgut_admin_token')
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch('/api/uploads', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      })

      const data = await res.json()
      if (res.ok) {
        setCoverImageUrl(data.url)
      } else {
        alert(data.error || 'Rasm yuklashda xatolik')
      }
    } catch {
      alert('Rasm yuklashda xatolik')
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !shortDescription || !content) {
      alert("Majburiy maydonlarni to'ldiring")
      return
    }

    if (selectedCategoryIds.length === 0) {
      alert("Kamida bitta bo'limni tanlang")
      return
    }

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0)
    const token = localStorage.getItem('urgut_admin_token')

    const payload = {
      title,
      shortDescription,
      content,
      coverImageUrl,
      categoryIds: selectedCategoryIds,
      categoryId: selectedCategoryIds[0],
      author,
      status: Number(status),
      isFeatured,
      tags,
    }

    try {
      setSaving(true)
      const res = await fetch('/api/news', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        router.push('/admin/news')
      } else {
        alert('Saqlashda xatolik yuz berdi')
      }
    } catch {
      alert('Saqlashda xatolik')
    } finally {
      setSaving(false)
    }
  }

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/news"
            className="p-2 bg-white rounded-lg border text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-black text-slate-900">Yangi Maqola Yaratish</h1>
            <p className="text-xs text-slate-500 font-semibold mt-0.5">
              Bir vaqtning o&apos;zida bir nechta bo&apos;limlarga biriktirish mumkin
            </p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6"
        >
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Maqola Sarlavhasi *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2.5 text-sm font-bold text-slate-900 focus:outline-none focus:border-red-700"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Qisqa Mazmun (Lid) *
            </label>
            <textarea
              required
              rows={2}
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:border-red-700"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              To&apos;liq Matn (HTML) *
            </label>
            <textarea
              required
              rows={10}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-xs font-mono text-slate-900 focus:outline-none focus:border-red-700"
            />
          </div>

          {/* ── MULTI-CATEGORY SELECTION & ON-THE-FLY CREATION ── */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <label className="block text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-red-600" /> Bo&apos;limlar (Kategoriyalar) *
                </label>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Xabar tegishli bo&apos;lgan bir yoki bir nechta bo&apos;limni tanlang (masalan: ham Sport, ham Muhim, ham Dolzarb)
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsCatModalOpen(true)}
                className="px-3 py-1.5 rounded-lg bg-red-700 hover:bg-red-800 text-white text-xs font-bold flex items-center gap-1.5 self-start sm:self-auto transition-colors shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" /> Yangi Bo&apos;lim Qo&apos;shish
              </button>
            </div>

            {/* Category Pills */}
            <div className="flex flex-wrap gap-2 pt-1">
              {categories.map((cat) => {
                const isSelected = selectedCategoryIds.includes(cat.id)
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => toggleCategory(cat.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-red-700 text-white shadow-xs scale-105'
                        : 'bg-white text-slate-700 border border-slate-300 hover:border-red-400'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    <span>{cat.name}</span>
                  </button>
                )
              })}
            </div>

            <div className="text-[11px] text-slate-500 font-semibold pt-1 border-t border-slate-200/60">
              Tanlangan ({selectedCategoryIds.length} ta):{' '}
              <span className="text-red-700 font-bold">
                {categories
                  .filter((c) => selectedCategoryIds.includes(c.id))
                  .map((c) => c.name)
                  .join(', ') || 'Hech biri tanlanmagan'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Muallif</label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Chop Etish Holati *
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs font-bold"
              >
                <option value={1}>Chop Etilgan</option>
                <option value={0}>Qoralama</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Teglar (vergul bilan)
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="Urgut, Sport, Ta'lim"
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs"
            />
          </div>

          <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-lg border border-amber-200">
            <input
              type="checkbox"
              id="isFeatured"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
              className="w-4 h-4 accent-red-700 cursor-pointer"
            />
            <label htmlFor="isFeatured" className="text-xs font-bold text-slate-700 cursor-pointer">
              Asosiy yangilik sifatida belgilash (Bosh sahifa Asosiy Hero blokida ko&apos;rsatiladi)
            </label>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Muqova Rasmi (Cloudinary)
            </label>
            <div className="flex gap-3 items-center">
              <input
                type="text"
                value={coverImageUrl}
                onChange={(e) => setCoverImageUrl(e.target.value)}
                placeholder="Rasm URL..."
                className="flex-1 bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs"
              />
              <label className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-4 py-2 rounded-lg cursor-pointer flex items-center gap-1.5 shrink-0">
                <Upload className="w-3.5 h-3.5" />
                {uploading ? 'Yuklanmoqda...' : 'Fayl yuklash'}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
            <Link
              href="/admin/news"
              className="px-5 py-2.5 bg-slate-100 text-slate-700 rounded-lg text-xs font-bold hover:bg-slate-200 transition-colors"
            >
              Bekor qilish
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 bg-red-700 hover:bg-red-800 text-white rounded-lg text-xs font-bold flex items-center gap-2 shadow-xs transition-colors"
            >
              <Save className="w-4 h-4" /> {saving ? 'Saqlanmoqda...' : 'Saqlash'}
            </button>
          </div>
        </form>

        {/* ── POPUP: CREATE CATEGORY ON THE FLY ── */}
        {isCatModalOpen && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <form
              onSubmit={handleCreateCategory}
              className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b">
                <div className="flex items-center gap-2">
                  <FolderPlus className="w-5 h-5 text-red-600" />
                  <h3 className="text-base font-black text-slate-900">Yangi Bo&apos;lim Qo&apos;shish</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsCatModalOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Bo&apos;lim Nomi *</label>
                <input
                  type="text"
                  required
                  placeholder="Masalan: Dolzarb, Eksklyuziv, Iqtisodiyot..."
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs font-bold"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Tavsif (ixtiyoriy)</label>
                <input
                  type="text"
                  placeholder="Bo'lim haqida qisqacha"
                  value={newCatDesc}
                  onChange={(e) => setNewCatDesc(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Sahifa Uslubi (Layout):
                </label>
                <select
                  value={newCatLayout}
                  onChange={(e) => setNewCatLayout(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs font-bold"
                >
                  {LAYOUT_OPTIONS.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {opt.badge} — {opt.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setIsCatModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-xs font-bold hover:bg-slate-200"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  disabled={creatingCat}
                  className="px-5 py-2 bg-red-700 text-white rounded-lg text-xs font-bold hover:bg-red-800"
                >
                  {creatingCat ? 'Qo\'shilmoqda...' : 'Qo\'shish va Biriktirish'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
