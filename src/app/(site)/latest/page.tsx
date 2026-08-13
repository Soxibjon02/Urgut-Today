'use client'

import React, { useState, useEffect } from 'react';
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

export default function LatestNewsPage() {
  const [articles, setArticles] = useState<ArticleList[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/news?page=1&pageSize=20')
      .then((r) => r.json())
      .then((data) => setArticles(data.items || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <div className="border-b-4 border-red-700 pb-4">
        <h1 className="text-3xl font-black uppercase text-slate-900">Eng So'nggi Yangiliklar</h1>
        <p className="text-slate-600 text-sm mt-1">Urgut va atrofidagi so'nggi voqealar ketma-ketligi</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg border p-4 space-y-3">
              <div className="skeleton h-40 w-full" />
              <div className="skeleton h-6 w-3/4" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {articles.map((art) => (
            <NewsCard key={art.id} article={art} variant="standard" />
          ))}
        </div>
      )}
    </div>
  );
}
