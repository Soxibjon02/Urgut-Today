'use client'

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
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

interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  articleCount: number;
}

export default function CategoryPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [category, setCategory] = useState<Category | null>(null);
  const [articles, setArticles] = useState<ArticleList[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const catRes = await fetch('/api/categories');
        const cats: Category[] = await catRes.json();
        const found = cats.find((c) => c.slug.toLowerCase() === slug.toLowerCase());
        setCategory(found || null);

        const newsRes = await fetch(`/api/news?categorySlug=${slug}&page=1&pageSize=20`);
        const newsData = await newsRes.json();
        setArticles(newsData.items || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
        <div className="skeleton h-10 w-1/4" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg border p-4 space-y-3">
              <div className="skeleton h-40 w-full" />
              <div className="skeleton h-6 w-3/4" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <div className="border-b-4 border-red-700 pb-4">
        <h1 className="text-3xl font-black uppercase text-slate-900">{category ? category.name : slug}</h1>
        {category?.description && <p className="text-slate-600 text-sm mt-1">{category.description}</p>}
      </div>

      {articles.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-slate-200 p-8">
          <p className="text-slate-600 font-semibold">Ushbu kategoriyada hozircha yangiliklar yo'q.</p>
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
