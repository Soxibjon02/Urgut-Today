'use client'

import React, { useState, useEffect } from 'react';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import AdminLayout from '@/components/AdminLayout';

interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  order: number;
  articleCount: number;
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [order, setOrder] = useState(0);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/categories');
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleOpenModal = (cat?: Category) => {
    if (cat) {
      setEditingCategory(cat);
      setName(cat.name);
      setDescription(cat.description);
      setOrder(cat.order);
    } else {
      setEditingCategory(null);
      setName('');
      setDescription('');
      setOrder(categories.length + 1);
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('urgut_admin_token');
    const url = editingCategory ? `/api/categories/${editingCategory.id}` : '/api/categories';
    const method = editingCategory ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, description, order: Number(order) }),
      });

      if (res.ok) {
        setIsModalOpen(false);
        fetchCategories();
      } else {
        alert('Xatolik yuz berdi');
      }
    } catch (err) {
      alert('Xatolik');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Kategoriyani o\'chirishni tasdiqlaysizmi?')) return;
    const token = localStorage.getItem('urgut_admin_token');
    try {
      await fetch(`/api/categories/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchCategories();
    } catch (err) {
      alert("O'chirishda xatolik");
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-black text-slate-900">Kategoriyalar Boshqaruvi</h1>
            <p className="text-xs text-slate-500 font-semibold mt-1">Saytdagi rukn va bo'limlarni boshqarish</p>
          </div>

          <button
            onClick={() => handleOpenModal()}
            className="bg-red-700 hover:bg-red-800 text-white font-bold text-xs px-4 py-2.5 rounded-lg flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" /> Yangi Kategoriya
          </button>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
          {loading ? (
            <div className="p-8 text-center text-xs font-bold text-slate-500">Yuklanmoqda...</div>
          ) : (
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-900 text-slate-300 uppercase text-[10px] font-bold">
                <tr>
                  <th className="p-3">Tartib</th>
                  <th className="p-3">Nomi</th>
                  <th className="p-3">Slug</th>
                  <th className="p-3">Maqolalar Soni</th>
                  <th className="p-3 text-right">Amallar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {categories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-slate-50">
                    <td className="p-3 font-bold text-slate-500">{cat.order}</td>
                    <td className="p-3 font-bold text-slate-900">{cat.name}</td>
                    <td className="p-3 text-slate-500 font-mono">{cat.slug}</td>
                    <td className="p-3 font-bold text-red-700">{cat.articleCount}</td>
                    <td className="p-3 text-right space-x-2">
                      <button onClick={() => handleOpenModal(cat)} className="p-1 text-blue-600 hover:text-blue-800">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(cat.id)} className="p-1 text-red-600 hover:text-red-800">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <form onSubmit={handleSubmit} className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl space-y-4">
              <h3 className="text-lg font-extrabold text-slate-900">
                {editingCategory ? 'Kategoriyani Tahrirlash' : 'Yangi Kategoriya Yaratish'}
              </h3>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nomi *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Tavsif</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Tartib Raqami</label>
                <input
                  type="number"
                  value={order}
                  onChange={(e) => setOrder(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs font-bold"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-xs font-bold">
                  Bekor qilish
                </button>
                <button type="submit" className="px-4 py-2 bg-red-700 text-white rounded-lg text-xs font-bold">
                  Saqlash
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
