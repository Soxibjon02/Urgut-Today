'use client'

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { PlusCircle, Search, Edit, Trash2, Eye, CheckCircle2, XCircle } from 'lucide-react';
import AdminLayout from '@/components/AdminLayout';

interface ArticleList {
  id: number;
  title: string;
  slug: string;
  shortDescription: string;
  coverImageUrl?: string;
  categoryId: number;
  categoryName: string;
  categorySlug: string;
  author: string;
  status: number;
  isFeatured: boolean;
  viewCount: number;
  publishedAt: string;
}

interface Category {
  id: number;
  name: string;
  slug: string;
}

export default function AdminNewsListPage() {
  const [articles, setArticles] = useState<ArticleList[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('urgut_admin_token');
      const query = new URLSearchParams();
      if (search) query.append('search', search);
      if (selectedCategory) query.append('categorySlug', selectedCategory);
      if (selectedStatus !== '') query.append('status', selectedStatus);

      const res = await fetch(`/api/news?${query.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setArticles(data.items || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetch('/api/categories').then((r) => r.json()).then(setCategories).catch(console.error);
  }, []);

  useEffect(() => {
    fetchNews();
  }, [selectedCategory, selectedStatus]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchNews();
  };

  const handleToggleStatus = async (id: number, currentStatus: number) => {
    const newStatus = currentStatus === 1 ? 0 : 1;
    const token = localStorage.getItem('urgut_admin_token');
    try {
      await fetch(`/api/news/${id}?status=${newStatus}`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchNews();
    } catch (err) {
      alert("Xatolik yuz berdi");
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    const token = localStorage.getItem('urgut_admin_token');
    try {
      await fetch(`/api/news/${deleteId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      setDeleteId(null);
      fetchNews();
    } catch (err) {
      alert("O'chirishda xatolik");
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900">Yangiliklar Ro'yxati</h1>
            <p className="text-xs text-slate-500 font-semibold mt-1">Barcha maqolalarni boshqarish va tahrirlash</p>
          </div>

          <Link
            href="/admin/news/create"
            className="bg-red-700 hover:bg-red-800 text-white font-bold text-xs px-4 py-2.5 rounded-lg transition-colors flex items-center gap-2 shadow-xs"
          >
            <PlusCircle className="w-4 h-4" /> Yangi Yangilik Qo'shish
          </Link>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            <div className="sm:col-span-6 relative">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Qidirish..."
                className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-3 pr-8 py-2 text-xs focus:outline-none focus:border-red-700"
              />
              <button type="submit" className="absolute right-2 top-2 text-slate-400">
                <Search className="w-4 h-4" />
              </button>
            </div>

            <div className="sm:col-span-3">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs font-semibold focus:outline-none focus:border-red-700"
              >
                <option value="">Barcha Kategoriyalar</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.slug}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-3">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs font-semibold focus:outline-none focus:border-red-700"
              >
                <option value="">Barcha Holatlar</option>
                <option value="1">Chop etilgan</option>
                <option value="0">Qoralama</option>
              </select>
            </div>
          </form>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
          {loading ? (
            <div className="p-8 text-center text-xs text-slate-500 font-bold">Yuklanmoqda...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-900 text-slate-300 uppercase text-[10px] font-bold tracking-wider">
                  <tr>
                    <th className="p-3">Sarlavha</th>
                    <th className="p-3">Kategoriya</th>
                    <th className="p-3">Holat</th>
                    <th className="p-3">Ko'rishlar</th>
                    <th className="p-3 text-right">Amallar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {articles.map((art) => (
                    <tr key={art.id} className="hover:bg-slate-50">
                      <td className="p-3 font-bold text-slate-900 max-w-xs truncate">{art.title}</td>
                      <td className="p-3 font-semibold text-slate-600">{art.categoryName}</td>
                      <td className="p-3">
                        <button
                          onClick={() => handleToggleStatus(art.id, art.status)}
                          className={`px-2.5 py-1 rounded font-bold text-[10px] flex items-center gap-1 ${
                            art.status === 1 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {art.status === 1 ? <CheckCircle2 className="w-3 h-3 text-emerald-600" /> : <XCircle className="w-3 h-3 text-amber-600" />}
                          {art.status === 1 ? 'Chop etilgan' : 'Qoralama'}
                        </button>
                      </td>
                      <td className="p-3 text-slate-500">{art.viewCount}</td>
                      <td className="p-3 text-right space-x-2">
                        <Link href={`/news/${art.slug}`} target="_blank" className="p-1 text-slate-400 hover:text-slate-700 inline-block">
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link href={`/admin/news/edit/${art.id}`} className="p-1 text-blue-600 hover:text-blue-800 inline-block">
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button onClick={() => setDeleteId(art.id)} className="p-1 text-red-600 hover:text-red-800">
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

        {deleteId && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl space-y-4">
              <h3 className="text-lg font-extrabold text-slate-900">Maqolani o'chirishni tasdiqlaysizmi?</h3>
              <p className="text-slate-600 text-xs">Ushbu amalni ortga qaytarib bo'lmaydi.</p>
              <div className="flex justify-end gap-3 pt-2">
                <button onClick={() => setDeleteId(null)} className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-xs font-bold">
                  Bekor qilish
                </button>
                <button onClick={handleDelete} className="px-4 py-2 bg-red-700 text-white rounded-lg text-xs font-bold">
                  O'chirish
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
