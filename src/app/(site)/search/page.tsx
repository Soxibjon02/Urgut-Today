'use client'

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { NewsCard } from '@/components/NewsCard';

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

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';

  const [articles, setArticles] = useState<ArticleList[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!query) {
      setLoading(false);
      return;
    }

    const fetchSearch = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/news?search=${encodeURIComponent(query)}&page=1&pageSize=20`);
        const data = await res.json();
        setArticles(data.items || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSearch();
  }, [query]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <div className="border-b-4 border-red-700 pb-4">
        <h1 className="text-2xl font-black text-slate-900">
          Qidiruv natijalari: <span className="text-red-700">"{query}"</span>
        </h1>
        <p className="text-slate-600 text-xs mt-1">Topilgan yangiliklar soni: {articles.length}</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg border p-4 space-y-3">
              <div className="skeleton h-40 w-full" />
              <div className="skeleton h-6 w-3/4" />
            </div>
          ))}
        </div>
      ) : articles.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-slate-200 p-8">
          <p className="text-slate-600 font-semibold">Hech narsa topilmadi. Boshqa so'z bilan qidirib ko'ring.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {articles.map((art) => (
            <NewsCard key={art.id} article={art} variant="standard" />
          ))}
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-4 py-8"><div className="skeleton h-10 w-48" /></div>}>
      <SearchContent />
    </Suspense>
  );
}
