'use client'

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Upload } from 'lucide-react';
import AdminLayout from '@/components/AdminLayout';

interface Category {
  id: number;
  name: string;
}

export default function AdminNewsEditPage() {
  const params = useParams();
  const id = params?.id as string;
  const isEditMode = !!id;
  const router = useRouter();

  const [categories, setCategories] = useState<Category[]>([]);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [title, setTitle] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [content, setContent] = useState('');
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [categoryId, setCategoryId] = useState<number>(1);
  const [author, setAuthor] = useState('Urgut Today Tahririyati');
  const [status, setStatus] = useState<number>(1);
  const [isFeatured, setIsFeatured] = useState(false);
  const [tagsInput, setTagsInput] = useState('Urgut, Yangiliklar');

  useEffect(() => {
    fetch('/api/categories')
      .then((r) => r.json())
      .then((data) => {
        setCategories(data);
        if (data.length > 0 && !isEditMode) setCategoryId(data[0].id);
      })
      .catch(console.error);

    if (isEditMode) {
      const token = localStorage.getItem('urgut_admin_token');
      fetch('/api/news', { headers: { Authorization: `Bearer ${token}` } })
        .then((r) => r.json())
        .then((res) => {
          const article = res.items.find((item: any) => item.id === Number(id));
          if (article) {
            fetch(`/api/news/${article.slug}`)
              .then((r) => r.json())
              .then((detail) => {
                setTitle(detail.title);
                setShortDescription(detail.shortDescription);
                setContent(detail.content);
                setCoverImageUrl(detail.coverImageUrl || '');
                setCategoryId(detail.categoryId);
                setAuthor(detail.author || 'Urgut Today Tahririyati');
                setStatus(detail.status);
                setIsFeatured(detail.isFeatured);
                setTagsInput(detail.tags ? detail.tags.join(', ') : '');
              });
          }
        });
    }
  }, [id, isEditMode]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const token = localStorage.getItem('urgut_admin_token');
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/uploads', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        setCoverImageUrl(data.url);
      } else {
        alert(data.error || 'Rasm yuklashda xatolik');
      }
    } catch (err) {
      alert('Rasm yuklashda xatolik');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !shortDescription || !content) {
      alert('Majburiy maydonlarni to\'ldiring');
      return;
    }

    const tags = tagsInput.split(',').map((t) => t.trim()).filter((t) => t.length > 0);
    const token = localStorage.getItem('urgut_admin_token');

    const payload = {
      title,
      shortDescription,
      content,
      coverImageUrl,
      categoryId: Number(categoryId),
      author,
      status: Number(status),
      isFeatured,
      tags,
    };

    try {
      setSaving(true);
      const url = isEditMode ? `/api/news/${id}` : '/api/news';
      const method = isEditMode ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        router.push('/admin/news');
      } else {
        alert('Saqlashda xatolik yuz berdi');
      }
    } catch (err) {
      alert('Saqlashda xatolik');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/admin/news" className="p-2 bg-white rounded-lg border text-slate-700">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-black text-slate-900">
              {isEditMode ? 'Maqolani Tahrirlash' : 'Yangi Maqola Yaratish'}
            </h1>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Maqola Sarlavhasi *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2.5 text-sm font-bold text-slate-900 focus:outline-none focus:border-red-700"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Qisqa Mazmun (Lid) *</label>
            <textarea
              required
              rows={2}
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:border-red-700"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">To'liq Matn (HTML) *</label>
            <textarea
              required
              rows={10}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-xs font-mono text-slate-900 focus:outline-none focus:border-red-700"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Kategoriya *</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs font-semibold"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Chop Etish Holati *</label>
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
            <label className="block text-xs font-bold text-slate-700 mb-1">Muqova Rasmi (Cloudinary)</label>
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
                <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
              </label>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
            <Link href="/admin/news" className="px-5 py-2.5 bg-slate-100 text-slate-700 rounded-lg text-xs font-bold">
              Bekor qilish
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 bg-red-700 hover:bg-red-800 text-white rounded-lg text-xs font-bold flex items-center gap-2"
            >
              <Save className="w-4 h-4" /> {saving ? 'Saqlanmoqda...' : 'Saqlash'}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
