'use client'

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Newspaper, Eye, CheckCircle2, FileEdit, FolderTree, PlusCircle } from 'lucide-react';
import AdminLayout from '@/components/AdminLayout';

interface Stats {
  totalNews: number;
  publishedNews: number;
  draftNews: number;
  totalViews: number;
  categoryCount: number;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats>({
    totalNews: 0,
    publishedNews: 0,
    draftNews: 0,
    totalViews: 0,
    categoryCount: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('urgut_admin_token');
    fetch('/api/news?stats=true', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => setStats(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const statCards = [
    { label: 'Jami Maqolalar', value: stats.totalNews, icon: Newspaper, color: 'bg-blue-600' },
    { label: 'Chop Etilgan', value: stats.publishedNews, icon: CheckCircle2, color: 'bg-emerald-600' },
    { label: 'Qoralamalar', value: stats.draftNews, icon: FileEdit, color: 'bg-amber-600' },
    { label: 'Umumiy Ko\'rishlar', value: stats.totalViews, icon: Eye, color: 'bg-purple-600' },
    { label: 'Kategoriyalar', value: stats.categoryCount, icon: FolderTree, color: 'bg-slate-700' },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900">Boshqaruv Paneli</h1>
            <p className="text-xs text-slate-500 font-semibold mt-1">Urgut Today portalining statistikasi va tezkor amallar</p>
          </div>

          <Link
            href="/admin/news/create"
            className="bg-red-700 hover:bg-red-800 text-white font-bold text-xs px-4 py-2.5 rounded-lg transition-colors flex items-center gap-2 shadow-xs"
          >
            <PlusCircle className="w-4 h-4" /> Yangi Yangilik Qo'shish
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl p-6 border border-slate-200">
                <div className="skeleton h-12 w-full" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {statCards.map((card, idx) => {
              const Icon = card.icon;
              return (
                <div key={idx} className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{card.label}</span>
                    <h3 className="text-3xl font-black text-slate-900 mt-1">{card.value}</h3>
                  </div>
                  <div className={`w-12 h-12 rounded-xl ${card.color} text-white flex items-center justify-center shadow-md`}>
                    <Icon className="w-6 h-6" />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
