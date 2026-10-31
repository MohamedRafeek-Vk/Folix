import React, { useState } from 'react';
import { PortfolioData, TemplateType } from '../types/portfolio';
import { TemplateRenderer } from '../templates/TemplateRenderer';
import { TEMPLATES_LIST } from '../templates/templatesData';
import { ArrowLeft, Monitor, Tablet, Smartphone, Sparkles, Send, Edit3, Check } from 'lucide-react';

interface Props {
  data: PortfolioData;
  onBackToEdit: () => void;
  onBackToTemplates: () => void;
  onPublishClick: () => void;
  onTemplateChange: (tmpl: TemplateType) => void;
}

export const PortfolioPreview: React.FC<Props> = ({
  data,
  onBackToEdit,
  onBackToTemplates,
  onPublishClick,
  onTemplateChange
}) => {
  const [device, setDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col font-sans">
      {/* Top Floating Control Bar */}
      <header className="sticky top-0 z-50 border-b border-white/[0.1] bg-slate-950/90 backdrop-blur-xl px-4 sm:px-6 py-3">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Back & Info */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
            <button
              onClick={onBackToEdit}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300 bg-white/[0.05] hover:bg-white/[0.1] transition"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Data</span>
            </button>

            <button
              onClick={onBackToTemplates}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300 bg-white/[0.05] hover:bg-white/[0.1] transition"
            >
              <span>Change Template</span>
            </button>

            <span className="hidden lg:inline-block text-xs font-mono text-slate-500">
              Previewing: <span className="text-indigo-400 capitalize">{data.selectedTemplate}</span>
            </span>
          </div>

          {/* Quick Template Switcher Pills */}
          <div className="flex items-center gap-1 bg-white/[0.04] p-1 rounded-xl border border-white/[0.06] overflow-x-auto max-w-full">
            {TEMPLATES_LIST.map(tmpl => {
              const active = data.selectedTemplate === tmpl.id;
              return (
                <button
                  key={tmpl.id}
                  onClick={() => onTemplateChange(tmpl.id)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition ${
                    active
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-white/[0.05]'
                  }`}
                >
                  {tmpl.name}
                </button>
              );
            })}
          </div>

          {/* Device Toggles & Publish CTA */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-end">
            <div className="hidden sm:flex items-center bg-white/[0.04] p-1 rounded-xl border border-white/[0.06]">
              <button
                onClick={() => setDevice('desktop')}
                className={`p-1.5 rounded-lg text-xs transition ${
                  device === 'desktop' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
                title="Desktop View"
              >
                <Monitor className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setDevice('tablet')}
                className={`p-1.5 rounded-lg text-xs transition ${
                  device === 'tablet' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
                title="Tablet View"
              >
                <Tablet className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setDevice('mobile')}
                className={`p-1.5 rounded-lg text-xs transition ${
                  device === 'mobile' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
                title="Mobile View"
              >
                <Smartphone className="w-3.5 h-3.5" />
              </button>
            </div>

            <button
              onClick={onPublishClick}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white text-xs sm:text-sm font-bold shadow-lg shadow-emerald-500/25 flex items-center gap-2 transition hover:scale-105 active:scale-95"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Publish Portfolio</span>
            </button>
          </div>
        </div>
      </header>

      {/* Frame Container */}
      <div className="flex-1 overflow-auto p-4 sm:p-6 flex items-start justify-center bg-slate-900/60">
        <div
          className={`transition-all duration-300 w-full overflow-hidden shadow-2xl ${
            device === 'desktop'
              ? 'max-w-7xl rounded-2xl border border-white/[0.08]'
              : device === 'tablet'
              ? 'max-w-[768px] rounded-3xl border-4 border-slate-800 my-4'
              : 'max-w-[390px] rounded-[40px] border-8 border-slate-800 my-4'
          }`}
        >
          <TemplateRenderer data={data} />
        </div>
      </div>
    </div>
  );
};
