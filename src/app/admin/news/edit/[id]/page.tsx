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
  const router = useRouter();

  const [categories, setCategories] = useState<Category[]>([]);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [content, setContent] = useState('');
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [categoryId, setCategoryId] = useState<number>(1);
  const [author, setAuthor] = useState('');
  const [status, setStatus] = useState<number>(1);
  const [isFeatured, setIsFeatured] = useState(false);
  const [tagsInput, setTagsInput] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('urgut_admin_token');

    const loadCategories = fetch('/api/categories').then(r => r.json());
    const loadNews = fetch('/api/news', {
      headers: { Authorization: `Bearer ${token}` },
    }).then(r => r.json());

    Promise.all([loadCategories, loadNews])
      .then(async ([cats, newsData]) => {
        setCategories(cats);

        const list: any[] = newsData.items || [];
        const found = list.find((item: any) => item.id === Number(id));

        if (found) {
          const detail = await fetch(`/api/news/${found.slug}`).then(r => r.json());
          setTitle(detail.title || '');
          setShortDescription(detail.shortDescription || '');
          setContent(detail.content || '');
          setCoverImageUrl(detail.coverImageUrl || '');
          setCategoryId(detail.categoryId || (cats[0]?.id ?? 1));
          setAuthor(detail.author || '');
          setStatus(detail.status ?? 1);
          setIsFeatured(detail.isFeatured ?? false);
          setTagsInput(Array.isArray(detail.tags) ? detail.tags.join(', ') : '');
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

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
      if (res.ok) setCoverImageUrl(data.url);
      else alert(data.error || 'Rasm yuklashda xatolik');
    } catch {
      alert('Rasm yuklashda xatolik');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !shortDescription || !content) {
      alert("Majburiy maydonlarni to'ldiring");
      return;
    }
    const tags = tagsInput.split(',').map(t => t.trim()).filter(t => t.length > 0);
    const token = localStorage.getItem('urgut_admin_token');
    const payload = { title, shortDescription, content, coverImageUrl, categoryId: Number(categoryId), author, status: Number(status), isFeatured, tags };
    try {
      setSaving(true);
      const res = await fetch(`/api/news/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });
      if (res.ok) router.push('/admin/news');
      else alert('Saqlashda xatolik yuz berdi');
    } catch {
      alert('Saqlashda xatolik');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-xs font-bold text-slate-500">Maqola ma'lumotlari yuklanmoqda...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/admin/news" className="p-2 bg-white rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-black text-slate-900">Maqolani Tahrirlash</h1>
            <p className="text-xs text-slate-500 font-semibold mt-0.5">ID: {id}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Maqola Sarlavhasi *</label>
            <input type="text" required value={title} onChange={e => setTitle(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2.5 text-sm font-bold text-slate-900 focus:outline-none focus:border-red-700" />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Qisqa Mazmun (Lid) *</label>
            <textarea required rows={2} value={shortDescription} onChange={e => setShortDescription(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:border-red-700" />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">To'liq Matn (HTML) *</label>
            <textarea required rows={12} value={content} onChange={e => setContent(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-xs font-mono text-slate-900 focus:outline-none focus:border-red-700" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Kategoriya *</label>
              <select value={categoryId} onChange={e => setCategoryId(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs font-semibold focus:outline-none focus:border-red-700">
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Chop Etish Holati *</label>
              <select value={status} onChange={e => setStatus(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs font-bold focus:outline-none focus:border-red-700">
                <option value={1}>Chop Etilgan</option>
                <option value={0}>Qoralama</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Muallif</label>
              <input type="text" value={author} onChange={e => setAuthor(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Teglar (vergul bilan)</label>
              <input type="text" value={tagsInput} onChange={e => setTagsInput(e.target.value)}
                placeholder="Urgut, Sport, Ta'lim"
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs" />
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-lg border border-amber-200">
            <input type="checkbox" id="isFeatured" checked={isFeatured} onChange={e => setIsFeatured(e.target.checked)}
              className="w-4 h-4 accent-red-700 cursor-pointer" />
            <label htmlFor="isFeatured" className="text-xs font-bold text-slate-700 cursor-pointer">
              Asosiy yangilik sifatida belgilash (Hero blokida ko'rsatiladi)
            </label>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Muqova Rasmi</label>
            <div className="flex gap-3 items-center">
              <input type="text" value={coverImageUrl} onChange={e => setCoverImageUrl(e.target.value)}
                placeholder="Rasm URL manzili..."
                className="flex-1 bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs" />
              <label className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-4 py-2 rounded-lg cursor-pointer flex items-center gap-1.5 shrink-0 transition-colors">
                <Upload className="w-3.5 h-3.5" />
                {uploading ? 'Yuklanmoqda...' : 'Fayl yuklash'}
                <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
              </label>
            </div>
            {coverImageUrl && (
              <div className="mt-2 w-40 h-24 rounded overflow-hidden border border-slate-200">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={coverImageUrl} alt="Muqova" className="w-full h-full object-cover" />
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
            <Link href="/admin/news" className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-colors">
              Bekor qilish
            </Link>
            <button type="submit" disabled={saving}
              className="px-6 py-2.5 bg-red-700 hover:bg-red-800 text-white rounded-lg text-xs font-bold flex items-center gap-2 disabled:opacity-60 transition-colors">
              <Save className="w-4 h-4" />
              {saving ? 'Saqlanmoqda...' : 'O\'zgarishlarni Saqlash'}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
