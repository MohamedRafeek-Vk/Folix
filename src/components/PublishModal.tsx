import React, { useState, useEffect } from 'react';
import { PortfolioData } from '../types/portfolio';
import { sanitizeSlug, savePortfolio, getPortfolioBySlug } from '../utils/storage';
import { Globe, Copy, Check, ExternalLink, AlertTriangle, Sparkles, ArrowRight, Loader2 } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  portfolioData: PortfolioData;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (publishedSlug: string) => void;
}

export const PublishModal: React.FC<Props> = ({
  portfolioData,
  isOpen,
  onClose,
  onSuccess
}) => {
  // Generate initial recommended slug from user's name
  const defaultSlug = portfolioData.name
    ? sanitizeSlug(portfolioData.name.split(' ')[0] || 'portfolio')
    : 'portfolio';

  const [inputSlug, setInputSlug] = useState(portfolioData.slug || defaultSlug);
  const [cleanSlug, setCleanSlug] = useState(sanitizeSlug(portfolioData.slug || defaultSlug));
  const [alreadyExists, setAlreadyExists] = useState(false);
  const [published, setPublished] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  useEffect(() => {
    const sanitized = sanitizeSlug(inputSlug);
    setCleanSlug(sanitized);
    if (sanitized) {
      const existing = getPortfolioBySlug(sanitized);
      setAlreadyExists(!!existing);
    } else {
      setAlreadyExists(false);
    }
  }, [inputSlug]);

  if (!isOpen) return null;

  const origin = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5173';
  const fullUrl = `${origin}/p/${cleanSlug}`;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Automatically sanitize and lower-case
    const val = e.target.value.toLowerCase().replace(/\s+/g, '-');
    setInputSlug(val);
  };

  const handlePublish = async () => {
    if (!cleanSlug) return;
    setIsPublishing(true);

    const dataToSave: PortfolioData = {
      ...portfolioData,
      slug: cleanSlug,
      publishedAt: new Date().toISOString()
    };

    const result = savePortfolio(dataToSave);
    setIsPublishing(false);

    if (result.success) {
      setPublished(true);
      // Fire confetti celebration
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (err) {
        // ignore if confetti fails
      }
    }
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in font-sans">
      <div className="bg-slate-900 border border-white/[0.1] rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white text-lg p-1"
        >
          ✕
        </button>

        {!published ? (
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center shadow-lg shadow-indigo-500/10">
                <Globe className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-white tracking-tight">
                Publish Your Portfolio
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Choose a custom URL name. Your portfolio will be accessible instantly without accounts or logins.
              </p>
            </div>

            {/* Input field */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300">
                Custom Portfolio Name / Slug *
              </label>
              <div className="flex items-center rounded-xl bg-slate-950 border border-white/[0.1] px-3.5 py-2.5 focus-within:border-indigo-500">
                <span className="text-xs font-mono text-slate-500 shrink-0">/p/</span>
                <input
                  type="text"
                  value={inputSlug}
                  onChange={handleInputChange}
                  placeholder="e.g. rafeek"
                  className="w-full bg-transparent text-white text-sm font-mono focus:outline-none pl-1"
                  autoFocus
                />
              </div>

              {/* URL preview */}
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-between text-xs font-mono text-slate-300">
                <span className="truncate max-w-[280px]">
                  {cleanSlug ? fullUrl : 'Please enter a name'}
                </span>
                <span className="text-[10px] uppercase px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Ready
                </span>
              </div>
            </div>

            {/* Overwrite note */}
            {alreadyExists && (
              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-2.5 text-amber-200 text-xs">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-amber-300">Notice: Existing Portfolio</span>
                  <p className="text-amber-400/90 text-[11px] mt-0.5 leading-relaxed">
                    A portfolio named "<span className="font-mono">{cleanSlug}</span>" already exists. Publishing now will overwrite it with your latest version.
                  </p>
                </div>
              </div>
            )}

            {/* Confirmation Buttons */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="w-1/3 py-3 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-xs font-semibold text-slate-300 transition"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={!cleanSlug || isPublishing}
                onClick={handlePublish}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:opacity-95 disabled:opacity-50 text-white font-bold text-xs sm:text-sm shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition"
              >
                {isPublishing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Publishing...</span>
                  </>
                ) : (
                  <>
                    <span>{alreadyExists ? 'Overwrite & Publish' : 'Confirm & Publish'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          /* Success Screen */
          <div className="space-y-6 text-center py-2 animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/10">
              <Check className="w-8 h-8 stroke-[2.5]" />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-extrabold text-white">
                Portfolio Published!
              </h3>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                Your portfolio is now live at your vanity URL in this browser.
              </p>
            </div>

            {/* URL Copy Box */}
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-white/[0.1] flex items-center justify-between gap-2">
              <span className="text-xs font-mono text-emerald-300 truncate text-left pl-1">
                {fullUrl}
              </span>
              <button
                onClick={handleCopyUrl}
                className="p-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-slate-300 hover:text-white transition shrink-0"
                title="Copy URL"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            <div className="space-y-2.5 pt-2">
              <button
                onClick={() => onSuccess(cleanSlug)}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-bold text-xs sm:text-sm shadow-xl shadow-emerald-500/25 flex items-center justify-center gap-2 transition"
              >
                <span>View Live Portfolio</span>
                <ExternalLink className="w-4 h-4" />
              </button>

              <button
                onClick={onClose}
                className="w-full py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.08] text-xs font-semibold text-slate-400 hover:text-white transition"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
