'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { PortfolioData } from '../../../types/portfolio';
import { fetchPublishedPortfolio, getPublicPortfolioUrl } from '../../../utils/storage';
import { TemplateRenderer } from '../../../templates/TemplateRenderer';
import { NotFoundPage } from '../../../components/NotFoundPage';
import { Sparkles, Edit3, Share2, Check } from 'lucide-react';

function PublishedPortfolioContent() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const slug = (params?.slug as string) || '';
  const idParam = searchParams?.get('id') || undefined;

  const [data, setData] = useState<PortfolioData | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!slug) return;
    let isCancelled = false;
    setLoading(true);

    async function loadPortfolio() {
      try {
        const found = await fetchPublishedPortfolio(slug, idParam);
        if (!isCancelled) {
          setData(found);
          setLoading(false);
        }
      } catch (err) {
        console.error('Error loading portfolio:', err);
        if (!isCancelled) {
          setData(null);
          setLoading(false);
        }
      }
    }

    loadPortfolio();

    return () => {
      isCancelled = true;
    };
  }, [slug, idParam]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center font-sans">
        <div className="space-y-3 text-center">
          <div className="w-10 h-10 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-400 font-mono">Loading portfolio /p/{slug}...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <NotFoundPage
        requestedSlug={slug}
        onCreateNew={() => router.push('/')}
      />
    );
  }

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      const shareUrl = getPublicPortfolioUrl(slug);
      navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleEdit = () => {
    router.push(`/?edit=${encodeURIComponent(slug)}`);
  };

  const handleHomeClick = () => {
    router.push('/');
  };

  return (
    <div className="relative">
      {/* Floating Control Pill */}
      <aside
        className="fixed bottom-5 right-5 z-50 flex items-center gap-2 p-1.5 rounded-full bg-slate-950/85 backdrop-blur-lg border border-white/[0.12] shadow-2xl text-xs font-sans animate-fade-in"
        aria-label="Portfolio actions"
      >
        <button
          onClick={handleHomeClick}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition shadow-sm"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Folix</span>
        </button>

        <button
          onClick={handleEdit}
          className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/[0.08] hover:bg-white/[0.15] text-slate-200 transition"
          title="Edit this portfolio data"
        >
          <Edit3 className="w-3 h-3 text-slate-400" />
          <span>Edit</span>
        </button>

        <button
          onClick={handleShare}
          className="p-1.5 rounded-full bg-white/[0.08] hover:bg-white/[0.15] text-slate-200 transition"
          title="Copy link"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
        </button>
      </aside>

      {/* Render the selected template */}
      <TemplateRenderer data={data} />
    </div>
  );
}

export default function PublishedPortfolioPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center font-sans">
          <div className="space-y-3 text-center">
            <div className="w-10 h-10 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs text-slate-400 font-mono">Loading portfolio...</p>
          </div>
        </div>
      }
    >
      <PublishedPortfolioContent />
    </Suspense>
  );
}
