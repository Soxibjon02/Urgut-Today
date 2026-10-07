'use client'

import React, { useState, useEffect } from 'react'
import {
  Layers,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  Save,
  RotateCcw,
  Sparkles,
  Flame,
  Clock,
  Smartphone,
  CheckCircle2,
  ExternalLink,
  Sliders,
  LayoutGrid,
} from 'lucide-react'
import AdminLayout from '@/components/AdminLayout'
import {
  LayoutBlock,
  DEFAULT_HOMEPAGE_LAYOUT,
} from '@/app/api/layout/route'
import { LAYOUT_OPTIONS, LayoutType } from '@/components/news-layouts/NewsLayoutTemplates'

export default function AdminPageLayoutPage() {
  const [blocks, setBlocks] = useState<LayoutBlock[]>(DEFAULT_HOMEPAGE_LAYOUT)
  const [categories, setCategories] = useState<{ id: number; name: string; slug: string }[]>([])
  const [saving, setSaving] = useState(false)
  const [savedSuccess, setSavedSuccess] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        const [layoutRes, catsRes] = await Promise.all([
          fetch('/api/layout').then((r) => r.json()),
          fetch('/api/categories').then((r) => r.json()),
        ])
        if (layoutRes.blocks && Array.isArray(layoutRes.blocks)) {
          setBlocks(layoutRes.blocks)
        }
        if (Array.isArray(catsRes)) {
          setCategories(catsRes)
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const moveBlock = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= blocks.length) return
    const updated = [...blocks]
    const temp = updated[index]
    updated[index] = updated[targetIndex]
    updated[targetIndex] = temp
    setBlocks(updated)
  }

  const toggleBlock = (index: number) => {
    const updated = [...blocks]
    updated[index].enabled = !updated[index].enabled
    setBlocks(updated)
  }

  const toggleSideList = (index: number) => {
    const updated = [...blocks]
    updated[index].showSideList = !updated[index].showSideList
    setBlocks(updated)
  }

  const changeStyle = (index: number, style: LayoutType) => {
    const updated = [...blocks]
    updated[index].style = style
    setBlocks(updated)
  }

  const changeItemCount = (index: number, count: number) => {
    const updated = [...blocks]
    updated[index].itemCount = count
    setBlocks(updated)
  }

  const handleReset = () => {
    if (!confirm('Barcha bloklar joylashuvini dastlabki tavsiya etilgan holatga qaytarasizmi?')) return
    setBlocks(DEFAULT_HOMEPAGE_LAYOUT)
  }

  const handleSave = async () => {
    const token = localStorage.getItem('urgut_admin_token')
    try {
      setSaving(true)
      setSavedSuccess(false)
      const res = await fetch('/api/layout', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ blocks }),
      })

      if (res.ok) {
        setSavedSuccess(true)
        setTimeout(() => setSavedSuccess(false), 4000)
      } else {
        alert('Saqlashda xatolik yuz berdi')
      }
    } catch (err) {
      alert('Tarmoq xatosi')
    } finally {
      setSaving(false)
    }
  }

  const getBlockIcon = (type: string) => {
    switch (type) {
      case 'hero':
        return <Flame className="w-5 h-5 text-red-600" />
      case 'date_filter':
        return <Sliders className="w-5 h-5 text-blue-600" />
      case 'latest':
        return <Clock className="w-5 h-5 text-amber-600" />
      case 'pwa_promo':
        return <Smartphone className="w-5 h-5 text-emerald-600" />
      case 'category':
        return <Layers className="w-5 h-5 text-purple-600" />
      default:
        return <Sparkles className="w-5 h-5 text-slate-600" />
    }
  }

  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900">
              Sahifalar Joylashuvi va Bloklar Boshqaruvi
            </h1>
            <p className="text-xs text-slate-500 font-semibold mt-1">
              Bosh sahifa bloklari tartibi, ko&apos;rinishi va BBC / CNN / Reuters uslublarini moslashtirish
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={handleReset}
              className="px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors"
              title="Dastlabki holatga qaytarish"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Dastlabki holat
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-5 py-2.5 rounded-xl bg-red-700 hover:bg-red-800 text-white text-xs font-black uppercase tracking-wider flex items-center gap-2 shadow-md transition-colors"
            >
              <Save className="w-4 h-4" /> {saving ? 'Saqlanmoqda...' : 'Saqlash'}
            </button>
          </div>
        </div>

        {savedSuccess && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>Yangi sahifa tartibi muvaffaqiyatli saqlandi va saytda faollashdi!</span>
            </div>
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-emerald-700 flex items-center gap-1"
            >
              Saytda ko&apos;rish <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        )}

        {/* Layout Visual Info Box */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-red-400 block mb-1">
              CNN & BBC EDITORIAL BUILDER
            </span>
            <h3 className="text-sm font-black">
              Sahifadagi har bir bo&apos;lim o&apos;rnini erkin o&apos;zgartiring
            </h3>
            <p className="text-xs text-slate-300 mt-0.5">
              Yuqoriga / Pastga tugmalari orqali bloklar ketma-ketligini belgilang. Uslubni o&apos;zgartirib xalqaro darajadagi dizaynni yarating.
            </p>
          </div>
          <a
            href="/"
            target="_blank"
            className="px-4 py-2 rounded-xl bg-red-700 hover:bg-red-800 text-white text-xs font-bold flex items-center gap-1.5 shrink-0"
          >
            Jonli saytni ko&apos;rish <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Blocks List */}
        {loading ? (
          <div className="p-12 text-center text-xs font-bold text-slate-500 bg-white rounded-2xl border">
            Yuklanmoqda...
          </div>
        ) : (
          <div className="space-y-3">
            {blocks.map((block, idx) => (
              <div
                key={block.id}
                className={`p-4 sm:p-5 rounded-2xl border transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
                  block.enabled
                    ? 'bg-white border-slate-200 shadow-xs'
                    : 'bg-slate-50/80 border-dashed border-slate-300 opacity-60'
                }`}
              >
                {/* Left: Reorder buttons + Title */}
                <div className="flex items-center gap-3">
                  <div className="flex flex-col gap-1">
                    <button
                      onClick={() => moveBlock(idx, 'up')}
                      disabled={idx === 0}
                      className="p-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      title="Yuqoriga surish"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => moveBlock(idx, 'down')}
                      disabled={idx === blocks.length - 1}
                      className="p-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      title="Pastga surish"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <span className="w-7 h-7 rounded-lg bg-slate-100 text-slate-700 font-black text-xs flex items-center justify-center">
                    {idx + 1}
                  </span>

                  <div className="p-2 rounded-xl bg-slate-100">{getBlockIcon(block.type)}</div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-extrabold text-slate-900">{block.title}</h4>
                      {!block.enabled && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-600">
                          Yashirilgan
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-slate-400 font-mono">ID: {block.id}</span>
                  </div>
                </div>

                {/* Right: Style Selector & Visibility Toggle */}
                <div className="flex flex-wrap items-center gap-3 self-end md:self-auto w-full md:w-auto justify-between md:justify-end">
                  {/* Style selector for compatible blocks */}
                  {(block.type === 'hero' ||
                    block.type === 'latest' ||
                    block.type === 'category') && (
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold text-slate-500 uppercase">Uslub:</span>
                      <select
                        value={block.style}
                        onChange={(e) => changeStyle(idx, e.target.value as LayoutType)}
                        className="bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-red-600"
                      >
                        {LAYOUT_OPTIONS.map((opt) => (
                          <option key={opt.id} value={opt.id}>
                            {opt.badge} — {opt.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Hero side list toggle */}
                  {block.type === 'hero' && (
                    <button
                      type="button"
                      onClick={() => toggleSideList(idx)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors ${
                        block.showSideList
                          ? 'bg-red-50 text-red-700 border border-red-200'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                      title="Asosiy yangilik yonidagi qo'shimcha tahlil panelini ko'rsatish yoki yashirish"
                    >
                      <span className="text-[11px]">Yon tahlil qatori:</span>
                      <span className="font-extrabold text-[11px]">
                        {block.showSideList ? 'Yoqilgan' : 'O‘chirilgan'}
                      </span>
                    </button>
                  )}

                  {/* Item count for latest news */}
                  {block.type === 'latest' && (
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold text-slate-500 uppercase">Soni:</span>
                      <select
                        value={block.itemCount || 8}
                        onChange={(e) => changeItemCount(idx, Number(e.target.value))}
                        className="bg-slate-50 border border-slate-300 rounded-lg px-2 py-1.5 text-xs font-bold text-slate-800"
                      >
                        <option value={4}>4 ta</option>
                        <option value={8}>8 ta</option>
                        <option value={12}>12 ta</option>
                        <option value={16}>16 ta</option>
                      </select>
                    </div>
                  )}

                  {/* Toggle Visibility */}
                  <button
                    onClick={() => toggleBlock(idx)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors ${
                      block.enabled
                        ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
                        : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                    }`}
                  >
                    {block.enabled ? (
                      <>
                        <Eye className="w-3.5 h-3.5" /> Faol
                      </>
                    ) : (
                      <>
                        <EyeOff className="w-3.5 h-3.5" /> Yashirilgan
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Bottom Save Action */}
        <div className="pt-4 border-t flex justify-end gap-3">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-8 py-3 rounded-xl bg-red-700 hover:bg-red-800 text-white font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-md transition-all"
          >
            <Save className="w-4 h-4" /> {saving ? 'Saqlanmoqda...' : 'O\'zgarishlarni Saqlash'}
          </button>
        </div>
      </div>
    </AdminLayout>
  )
}
