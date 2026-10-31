import React, { useState } from 'react';
import { Sparkles, ArrowRight, UploadCloud, Layout, Globe, Check, Eye, Trash2, ExternalLink } from 'lucide-react';
import { TEMPLATES_LIST } from '../templates/templatesData';
import { TemplateType, PortfolioData } from '../types/portfolio';
import { getAllPortfolios, deletePortfolio } from '../utils/storage';
import { SAMPLE_RESUMES } from '../data/sampleResumes';

interface Props {
  onStartCreating: () => void;
  onPreviewSample: (template: TemplateType) => void;
  onViewPublished: (slug: string) => void;
  onEditPortfolio?: (data: PortfolioData) => void;
}

export const LandingPage: React.FC<Props> = ({
  onStartCreating,
  onPreviewSample,
  onViewPublished,
  onEditPortfolio
}) => {
  const [selectedShowcaseTemplate, setSelectedShowcaseTemplate] = useState<TemplateType>('modern');
  const [publishedPortfolios, setPublishedPortfolios] = useState<Record<string, PortfolioData>>(() => getAllPortfolios());
  const [showMySitesModal, setShowMySitesModal] = useState(false);

  const refreshPublished = () => {
    setPublishedPortfolios(getAllPortfolios());
  };

  const handleDelete = (slug: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`Are you sure you want to delete /p/${slug}?`)) {
      deletePortfolio(slug);
      refreshPublished();
    }
  };

  const publishedList = Object.values(publishedPortfolios);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Top Navbar */}
      <nav className="border-b border-white/[0.08] bg-slate-950/70 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 p-0.5 shadow-lg shadow-indigo-500/25">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-indigo-400" />
              </div>
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight text-white flex items-center gap-1.5">
                Portfolio<span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">AI</span>
              </span>
              <span className="hidden sm:inline-block text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 ml-2">
                MVP
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {publishedList.length > 0 && (
              <button
                onClick={() => { refreshPublished(); setShowMySitesModal(true); }}
                className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium text-slate-300 bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] hover:text-white transition"
              >
                <Globe className="w-3.5 h-3.5 text-indigo-400" />
                <span>My Portfolios ({publishedList.length})</span>
              </button>
            )}

            <button
              onClick={onStartCreating}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs sm:text-sm font-semibold shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition duration-200"
            >
              <span>Create My Portfolio</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-24 md:pt-28 md:pb-32 px-6">
        {/* Glow ambient effects */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-gradient-to-tr from-indigo-600/20 via-purple-600/20 to-pink-500/10 blur-[150px] pointer-events-none rounded-full" />

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.1] text-indigo-300 text-xs font-medium shadow-sm">
            <span className="flex h-2 w-2 rounded-full bg-indigo-400 animate-pulse" />
            Zero coding required • 100% Client-side privacy
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white leading-[1.12]">
            Turn Your Resume Into a{' '}
            <span className="bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 bg-clip-text text-transparent">
              Stunning Portfolio
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Upload your PDF or DOCX resume. Our automated extractor parses your experience, skills, and projects into a responsive, live portfolio website ready to share in seconds.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={onStartCreating}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:opacity-95 text-white font-semibold text-base shadow-xl shadow-indigo-600/30 hover:scale-[1.02] active:scale-[0.98] transition flex items-center justify-center gap-3"
            >
              <UploadCloud className="w-5 h-5" />
              <span>Create My Portfolio</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onPreviewSample('modern')}
              className="w-full sm:w-auto px-6 py-4 rounded-xl bg-white/[0.04] border border-white/[0.1] hover:bg-white/[0.08] text-slate-200 font-medium text-base transition flex items-center justify-center gap-2"
            >
              <Eye className="w-4 h-4 text-slate-400" />
              <span>View Sample Portfolio</span>
            </button>
          </div>

          {/* Quick trust metrics */}
          <div className="pt-8 flex flex-wrap items-center justify-center gap-8 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>PDF & DOCX parsing</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>5 Designer templates</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Custom URL publishing</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Instant browser storage</span>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-6 border-y border-white/[0.06] bg-slate-900/40 relative z-10">
        <div className="max-w-6xl mx-auto space-y-16">
          <div className="text-center space-y-3">
            <span className="text-xs uppercase font-mono tracking-widest text-indigo-400">Streamlined Workflow</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">How It Works</h2>
            <p className="text-sm text-slate-400 max-w-lg mx-auto">
              From raw resume to a published web portfolio in three effortless steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Step 1 */}
            <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-indigo-500/30 transition duration-300 space-y-5 relative">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-lg font-mono">
                01
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-white">Upload Resume</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Drag and drop your existing PDF or DOCX file. Our engine automatically parses your title, bio, experience, education, and skills into editable structured fields.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-purple-500/30 transition duration-300 space-y-5 relative">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-lg font-mono">
                02
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-white">Choose Template</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Pick from 5 bespoke layouts — Minimal, Modern, Developer, Creative, or Professional. Switch instantly to preview your information across each design.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-pink-500/30 transition duration-300 space-y-5 relative">
              <div className="w-12 h-12 rounded-xl bg-pink-500/10 border border-pink-500/20 text-pink-400 flex items-center justify-center font-bold text-lg font-mono">
                03
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-white">Publish with Custom URL</h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Choose a unique vanity link like <code className="text-pink-300 font-mono text-xs bg-pink-500/10 px-1 py-0.5 rounded">/p/rafeek</code>. Share your portfolio link anywhere with zero account setup.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Template Showcase Section */}
      <section className="py-24 px-6 relative z-10">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2">
              <span className="text-xs uppercase font-mono tracking-widest text-indigo-400">Design Collection</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                Curated Portfolio Templates
              </h2>
              <p className="text-sm text-slate-400">
                Crafted for distinct professions, aesthetics, and career stages.
              </p>
            </div>

            <button
              onClick={onStartCreating}
              className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
            >
              <span>Build yours now</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Template Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {TEMPLATES_LIST.map(tmpl => {
              const isSelected = selectedShowcaseTemplate === tmpl.id;
              return (
                <div
                  key={tmpl.id}
                  className={`group p-6 rounded-2xl bg-white/[0.02] border transition-all duration-300 flex flex-col justify-between ${
                    isSelected
                      ? 'border-indigo-500/60 shadow-lg shadow-indigo-500/10 bg-white/[0.04]'
                      : 'border-white/[0.06] hover:border-white/[0.15]'
                  }`}
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-white/[0.05] text-slate-300 border border-white/[0.08]">
                        {tmpl.badge}
                      </span>
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: tmpl.accentColor }} />
                    </div>

                    <div>
                      <h3 className="text-xl font-bold text-white group-hover:text-indigo-300 transition">
                        {tmpl.name}
                      </h3>
                      <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                        {tmpl.description}
                      </p>
                    </div>

                    <div className="p-3 rounded-xl bg-black/30 border border-white/[0.04] text-[11px] text-slate-400">
                      <span className="font-semibold text-slate-300">Ideal for: </span>
                      {tmpl.idealFor}
                    </div>
                  </div>

                  <div className="pt-6 flex items-center gap-2">
                    <button
                      onClick={() => onPreviewSample(tmpl.id)}
                      className="w-full py-2.5 rounded-xl bg-white/[0.05] hover:bg-indigo-600 text-slate-200 hover:text-white text-xs font-semibold transition flex items-center justify-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Live Preview</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Bottom Banner */}
      <section className="py-20 px-6 border-t border-white/[0.06] bg-gradient-to-b from-transparent to-indigo-950/20 relative z-10">
        <div className="max-w-4xl mx-auto p-10 sm:p-14 rounded-3xl bg-gradient-to-r from-indigo-900/40 via-purple-900/30 to-pink-900/20 border border-indigo-500/30 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Ready to show off your achievements?
          </h2>
          <p className="text-sm sm:text-base text-slate-300 max-w-lg mx-auto">
            Build your portfolio in under 60 seconds. No credit card, no sign-up, no complicated hosting configurations.
          </p>
          <div className="pt-2">
            <button
              onClick={onStartCreating}
              className="px-8 py-3.5 rounded-xl bg-white text-slate-950 hover:bg-slate-100 font-bold text-sm shadow-xl shadow-black/40 hover:scale-105 active:scale-95 transition inline-flex items-center gap-2"
            >
              <span>Get Started Free</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-white/[0.06] py-8 text-center text-xs text-slate-500 font-sans">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span className="font-semibold text-slate-400">PortfolioAI</span>
            <span>— The instant resume to website platform.</span>
          </div>
          <p>© {new Date().getFullYear()} PortfolioAI. Client-side browser storage.</p>
        </div>
      </footer>

      {/* My Published Sites Modal */}
      {showMySitesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-white/[0.1] rounded-2xl max-w-lg w-full p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
              <div className="flex items-center gap-2 text-white font-bold text-lg">
                <Globe className="w-5 h-5 text-indigo-400" />
                <h3>My Published Portfolios</h3>
              </div>
              <button
                onClick={() => setShowMySitesModal(false)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            {publishedList.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-6">
                You haven't published any portfolios yet.
              </p>
            ) : (
              <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                {publishedList.map(item => (
                  <div
                    key={item.slug}
                    onClick={() => { setShowMySitesModal(false); onViewPublished(item.slug); }}
                    className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-indigo-500/40 hover:bg-white/[0.06] transition flex items-center justify-between cursor-pointer group"
                  >
                    <div>
                      <h4 className="font-bold text-white text-sm group-hover:text-indigo-300 transition">
                        {item.name || 'Unnamed Portfolio'}
                      </h4>
                      <p className="text-xs text-indigo-400 font-mono mt-0.5">
                        /p/{item.slug}
                      </p>
                      <p className="text-[11px] text-slate-500 mt-1">
                        Template: <span className="capitalize">{item.selectedTemplate}</span> • {new Date(item.publishedAt).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowMySitesModal(false);
                          if (onEditPortfolio) onEditPortfolio(item);
                        }}
                        className="p-2 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 text-xs"
                        title="Edit Data"
                      >
                        Edit
                      </button>

                      <button
                        onClick={(e) => handleDelete(item.slug, e)}
                        className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition"
                        title="Delete Portfolio"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowMySitesModal(false)}
                className="px-4 py-2 rounded-xl bg-white/[0.08] hover:bg-white/[0.12] text-xs font-semibold text-slate-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
