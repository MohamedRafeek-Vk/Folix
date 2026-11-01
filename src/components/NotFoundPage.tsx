import React from 'react';
import { Sparkles, ArrowRight, AlertCircle, Home, Globe } from 'lucide-react';
import { getAllPortfolios } from '../utils/storage';

interface Props {
  requestedSlug?: string;
  onCreateNew: () => void;
}

export const NotFoundPage: React.FC<Props> = ({ requestedSlug, onCreateNew }) => {
  const all = getAllPortfolios();
  const existingSlugs = Object.keys(all);

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 font-sans selection:bg-indigo-500/30">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto shadow-xl shadow-indigo-500/10">
          <AlertCircle className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-mono uppercase tracking-widest text-indigo-400">404 — Not Found</span>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Portfolio Not Found
          </h1>
          <p className="text-sm text-slate-400 leading-relaxed">
            {requestedSlug ? (
              <>
                No published portfolio was found at <code className="text-indigo-300 font-mono bg-indigo-500/10 px-1.5 py-0.5 rounded">/p/{requestedSlug}</code>.
              </>
            ) : (
              'The requested page or portfolio does not exist.'
            )}
          </p>
        </div>

        {/* Existing portfolios if any */}
        {existingSlugs.length > 0 && (
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.08] text-left space-y-2">
            <p className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-indigo-400" />
              <span>Recently Created Portfolios:</span>
            </p>
            <div className="flex flex-wrap gap-1.5">
              {existingSlugs.map(slug => (
                <a
                  key={slug}
                  href={`/p/${slug}`}
                  className="text-xs font-mono px-2.5 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 hover:bg-indigo-500/20 transition"
                >
                  /p/{slug}
                </a>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={onCreateNew}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 transition"
          >
            <Sparkles className="w-4 h-4" />
            <span>Create This Portfolio</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <a
            href="/"
            className="w-full sm:w-auto px-5 py-3 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 hover:text-white font-medium text-xs sm:text-sm flex items-center justify-center gap-2 transition"
          >
            <Home className="w-4 h-4" />
            <span>Go to Home</span>
          </a>
        </div>
      </div>
    </div>
  );
};
