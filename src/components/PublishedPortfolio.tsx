import React, { useEffect, useState } from 'react';
import { PortfolioData } from '../types/portfolio';
import { getPortfolioBySlug } from '../utils/storage';
import { TemplateRenderer } from '../templates/TemplateRenderer';
import { NotFoundPage } from './NotFoundPage';
import { Sparkles, Edit3, ArrowLeft, Share2, Check } from 'lucide-react';

interface Props {
  slug: string;
  onEdit?: (data: PortfolioData) => void;
  onHomeClick: () => void;
}

export const PublishedPortfolio: React.FC<Props> = ({ slug, onEdit, onHomeClick }) => {
  const [data, setData] = useState<PortfolioData | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setLoading(true);
    const found = getPortfolioBySlug(slug);
    setData(found);
    setLoading(false);
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center font-sans">
        <div className="space-y-3 text-center">
          <div className="w-10 h-10 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-400 font-mono">Loading /p/{slug}...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return <NotFoundPage requestedSlug={slug} onCreateNew={onHomeClick} />;
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative">
      {/* Floating Visitor Banner / Control Pill */}
      <aside className="fixed bottom-5 right-5 z-50 flex items-center gap-2 p-1.5 rounded-full bg-slate-950/85 backdrop-blur-lg border border-white/[0.12] shadow-2xl text-xs font-sans animate-fade-in" aria-label="Portfolio actions">
        <button
          onClick={onHomeClick}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition shadow-sm"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Folix</span>
        </button>

        {onEdit && (
          <button
            onClick={() => onEdit(data)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/[0.08] hover:bg-white/[0.15] text-slate-200 transition"
            title="Edit this portfolio data"
          >
            <Edit3 className="w-3 h-3 text-slate-400" />
            <span>Edit</span>
          </button>
        )}

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
};
