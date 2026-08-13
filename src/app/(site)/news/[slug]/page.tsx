'use client'

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Clock, Eye, ExternalLink, Calendar, User, ArrowLeft, Tag, Send, Globe, Share2 } from 'lucide-react';
import { NewsCard, CategoryBadge } from '@/components/NewsCard';

interface ArticleDetail {
  id: number;
  title: string;
  slug: string;
  shortDescription: string;
  content: string;
  coverImageUrl?: string;
  additionalImages: string[];
  categoryId: number;
  categoryName: string;
  categorySlug: string;
  author?: string;
  sourceUrl?: string;
  videoUrl?: string;
  status: number;
  isFeatured: boolean;
  tags: string[];
  viewCount: number;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

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

export default function ArticleDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [article, setArticle] = useState<ArticleDetail | null>(null);
  const [related, setRelated] = useState<ArticleList[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!slug) return;
    const fetchArticle = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/news/${slug}`);
        if (!res.ok) {
          setArticle(null);
          return;
        }
        const data: ArticleDetail = await res.json();
        setArticle(data);

        // Fetch related articles
        const relRes = await fetch(`/api/news/related/${slug}?count=4`);
        if (relRes.ok) {
          const relData = await relRes.json();
          setRelated(relData);
        }

        document.title = `${data.title} — Urgut Today`;
      } catch (err) {
        console.error('Error loading article:', err);
        setArticle(null);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
    window.scrollTo(0, 0);
  }, [slug]);

  const handleShareCopy = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-4">
        <div className="skeleton h-8 w-1/3" />
        <div className="skeleton h-12 w-full" />
        <div className="skeleton h-6 w-1/2" />
        <div className="skeleton h-96 w-full" />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">Sahifa topilmadi</h2>
        <p className="text-slate-600 text-sm">Siz qidirayotgan yangilik o'chirilgan yoki manzili o'zgargan bo'lishi mumkin.</p>
        <Link href="/" className="inline-block bg-red-700 text-white font-bold text-xs px-5 py-2.5 rounded">
          Bosh sahifaga qaytish
        </Link>
      </div>
    );
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('uz-UZ', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 md:py-10 space-y-8">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-red-700 transition-colors uppercase tracking-wider"
      >
        <ArrowLeft className="w-4 h-4" /> Bosh sahifaga qaytish
      </Link>

      <article className="bg-white rounded-xl border border-slate-200 p-6 md:p-10 shadow-xs space-y-6">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Link href={`/category/${article.categorySlug}`}>
              <CategoryBadge name={article.categoryName} size="md" />
            </Link>
            {article.isFeatured && (
              <span className="bg-amber-100 text-amber-900 font-bold text-xs px-2.5 py-0.5 rounded">
                Asosiy Xabar
              </span>
            )}
          </div>

          <h1 className="text-2xl md:text-4xl font-extrabold text-slate-900 leading-tight">
            {article.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-500 pt-2 border-b border-slate-100 pb-4">
            <span className="flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-red-700" />
              {article.author || 'Urgut Today Tahririyati'}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-red-700" />
              Chop etildi: {formatDate(article.publishedAt)}
            </span>
            <span className="flex items-center gap-1">
              <Eye className="w-3.5 h-3.5 text-red-700" />
              Ko'rishlar: {article.viewCount}
            </span>
          </div>
        </div>

        <p className="text-base md:text-lg font-bold text-slate-800 leading-relaxed bg-slate-50 p-4 rounded-lg border-l-4 border-red-700">
          {article.shortDescription}
        </p>

        {article.coverImageUrl && (
          <div className="rounded-lg overflow-hidden bg-slate-100 shadow-sm max-h-[500px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={article.coverImageUrl}
              alt={article.title}
              className="w-full h-full max-h-[500px] object-cover"
            />
          </div>
        )}

        <div
          className="article-content text-slate-800 text-base md:text-lg leading-relaxed space-y-4"
          dangerouslySetInnerHTML={{ __html: article.content }}
        />

        {article.additionalImages && article.additionalImages.length > 0 && (
          <div className="pt-4">
            <h4 className="text-sm font-bold uppercase text-slate-900 mb-3">Foto lavhalar:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {article.additionalImages.map((img, idx) => (
                <div key={idx} className="rounded-lg overflow-hidden bg-slate-100 aspect-[4/3]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img} alt={`${article.title} ${idx + 1}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        )}

        {article.sourceUrl && (
          <div className="p-4 bg-slate-100 rounded-lg flex items-center justify-between text-xs font-semibold text-slate-700">
            <span>Rasmiy manba / Havola:</span>
            <a
              href={article.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-red-700 hover:underline flex items-center gap-1 font-bold"
            >
              Manbani ko'rish <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        )}

        {article.tags && article.tags.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap pt-2">
            <Tag className="w-3.5 h-3.5 text-slate-400" />
            {article.tags.map((tag, idx) => (
              <span key={idx} className="text-xs bg-slate-100 text-slate-600 font-semibold px-2.5 py-1 rounded">
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Share buttons */}
        <div className="pt-6 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Ulashish:</span>
          <div className="flex items-center gap-2">
            <a
              href={`https://t.me/share/url?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(article.title)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs px-3 py-1.5 rounded flex items-center gap-1 transition-colors"
            >
              <Send className="w-3.5 h-3.5" /> Telegram
            </a>
            <a
              href={`https://api.whatsapp.com/send?text=${encodeURIComponent(article.title + ' ' + currentUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-3 py-1.5 rounded flex items-center gap-1 transition-colors"
            >
              <Globe className="w-3.5 h-3.5" /> WhatsApp
            </a>
            <button
              onClick={handleShareCopy}
              className="bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs px-3 py-1.5 rounded flex items-center gap-1 transition-colors"
            >
              <Share2 className="w-3.5 h-3.5" /> {copied ? "Nusxalandi!" : "Nusxalash"}
            </button>
          </div>
        </div>
      </article>

      {related.length > 0 && (
        <section className="pt-6">
          <div className="border-b-2 border-slate-900 pb-2 mb-6 flex items-center justify-between">
            <h3 className="text-lg md:text-xl font-black text-slate-900 uppercase">
              Sizga qiziq bo'lishi mumkin
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {related.map((relArt) => (
              <NewsCard key={relArt.id} article={relArt} variant="standard" />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
