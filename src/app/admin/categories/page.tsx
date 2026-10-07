'use client'

import React, { useState, useEffect } from 'react'
import { PlusCircle, Edit, Trash2, LayoutTemplate, Layers, CheckCircle2 } from 'lucide-react'
import AdminLayout from '@/components/AdminLayout'
import { LayoutType, LAYOUT_OPTIONS } from '@/components/news-layouts/NewsLayoutTemplates'

interface Category {
  id: number
  name: string
  slug: string
  description: string
  order: number
  layoutType: LayoutType
  articleCount: number
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [order, setOrder] = useState(0)
  const [layoutType, setLayoutType] = useState<LayoutType>('bbc-lead')

  const fetchCategories = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/categories')
      const data = await res.json()
      setCategories(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  const handleOpenModal = (cat?: Category) => {
    if (cat) {
      setEditingCategory(cat)
      setName(cat.name)
      setDescription(cat.description)
      setOrder(cat.order)
      setLayoutType(cat.layoutType || 'bbc-lead')
    } else {
      setEditingCategory(null)
      setName('')
      setDescription('')
      setOrder(categories.length + 1)
      setLayoutType('bbc-lead')
    }
    setIsModalOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const token = localStorage.getItem('urgut_admin_token')
    const url = editingCategory ? `/api/categories/${editingCategory.id}` : '/api/categories'
    const method = editingCategory ? 'PUT' : 'POST'

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          description,
          order: Number(order),
          layoutType,
        }),
      })

      if (res.ok) {
        setIsModalOpen(false)
        fetchCategories()
      } else {
        alert('Xatolik yuz berdi')
      }
    } catch (err) {
      alert('Xatolik')
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Kategoriyani o'chirishni tasdiqlaysizmi?")) return
    const token = localStorage.getItem('urgut_admin_token')
    try {
      await fetch(`/api/categories/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      fetchCategories()
    } catch (err) {
      alert("O'chirishda xatolik")
    }
  }

  const getLayoutBadge = (type?: string) => {
    const opt = LAYOUT_OPTIONS.find((o) => o.id === type) || LAYOUT_OPTIONS[0]
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-extrabold bg-red-50 text-red-700 border border-red-200">
        <LayoutTemplate className="w-3 h-3 text-red-600" />
        {opt.badge}
      </span>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900">Kategoriyalar va Sahifa Dizayni</h1>
            <p className="text-xs text-slate-500 font-semibold mt-1">
              Har bir bo&apos;lim uchun BBC, CNN va Reuters uslubidagi sahifa joylashuvlarini (Layout) sozlash
            </p>
          </div>

          <button
            onClick={() => handleOpenModal()}
            className="bg-red-700 hover:bg-red-800 text-white font-bold text-xs px-4 py-2.5 rounded-lg flex items-center gap-2 self-start shadow-xs transition-colors"
          >
            <PlusCircle className="w-4 h-4" /> Yangi Kategoriya
          </button>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          {loading ? (
            <div className="p-8 text-center text-xs font-bold text-slate-500">Yuklanmoqda...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-900 text-slate-300 uppercase text-[10px] font-bold">
                  <tr>
                    <th className="p-3.5">Tartib</th>
                    <th className="p-3.5">Nomi</th>
                    <th className="p-3.5">Slug</th>
                    <th className="p-3.5">Sahifa Dizayni (Layout)</th>
                    <th className="p-3.5">Maqolalar Soni</th>
                    <th className="p-3.5 text-right">Amallar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {categories.map((cat) => (
                    <tr key={cat.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-3.5 font-bold text-slate-500">{cat.order}</td>
                      <td className="p-3.5 font-bold text-slate-900">{cat.name}</td>
                      <td className="p-3.5 text-slate-500 font-mono text-[11px]">{cat.slug}</td>
                      <td className="p-3.5">{getLayoutBadge(cat.layoutType)}</td>
                      <td className="p-3.5 font-bold text-red-700">{cat.articleCount}</td>
                      <td className="p-3.5 text-right space-x-2">
                        <button
                          onClick={() => handleOpenModal(cat)}
                          className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors"
                          title="Tahrirlash"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(cat.id)}
                          className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors"
                          title="O'chirish"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-7 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
            >
              <div className="border-b pb-3">
                <h3 className="text-lg font-black text-slate-900">
                  {editingCategory ? 'Kategoriyani Tahrirlash' : 'Yangi Kategoriya Yaratish'}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Bo&apos;lim nomi, tartibi va xalqaro media uslubidagi sahifa dizaynini tanlang
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nomi *</label>
                <input
                  type="text"
                  required
                  placeholder="Masalan: Urgut Yangiliklari, Jamiyat, Sport..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2 text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Tavsif</label>
                <input
                  type="text"
                  placeholder="Bo'lim haqida qisqa ma'lumot"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Tartib Raqami</label>
                <input
                  type="number"
                  value={order}
                  onChange={(e) => setOrder(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2 text-xs font-bold"
                />
              </div>

              {/* ── Visual Layout Template Picker ── */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Sahifa Joylashuvi Dizayni (Layout Template):
                </label>
                <div className="space-y-2">
                  {LAYOUT_OPTIONS.map((opt) => {
                    const isSelected = layoutType === opt.id
                    return (
                      <div
                        key={opt.id}
                        onClick={() => setLayoutType(opt.id)}
                        className={`p-3 rounded-xl border-2 cursor-pointer transition-all flex items-start gap-3 ${
                          isSelected
                            ? 'border-red-600 bg-red-50/60 shadow-xs'
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded-full mt-0.5 flex items-center justify-center shrink-0 border ${
                            isSelected ? 'border-red-600 bg-red-600 text-white' : 'border-slate-400'
                          }`}
                        >
                          {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-black text-slate-900">{opt.name}</span>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                                isSelected
                                  ? 'bg-red-700 text-white'
                                  : 'bg-slate-100 text-slate-600'
                              }`}
                            >
                              {opt.badge}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                            {opt.description}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-xs font-bold hover:bg-slate-200 transition-colors"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-red-700 text-white rounded-lg text-xs font-bold hover:bg-red-800 transition-colors shadow-xs"
                >
                  Saqlash
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
