import React from 'react';
import { TemplateType, TemplateMeta, PortfolioData } from '../types/portfolio';
import { TEMPLATES_LIST } from '../templates/templatesData';
import { Check, ArrowRight, ArrowLeft, Eye, Sparkles } from 'lucide-react';

interface Props {
  selectedTemplate: TemplateType;
  portfolioData: PortfolioData;
  onSelectTemplate: (tmpl: TemplateType) => void;
  onContinueToPreview: () => void;
  onBackToEdit: () => void;
}

export const TemplateGallery: React.FC<Props> = ({
  selectedTemplate,
  portfolioData,
  onSelectTemplate,
  onContinueToPreview,
  onBackToEdit
}) => {
  return (
    <div className="max-w-6xl mx-auto px-6 py-12 space-y-10 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-6">
        <div>
          <button
            onClick={onBackToEdit}
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition font-medium mb-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to edit details</span>
          </button>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">
            Choose Your Portfolio Design
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Pick one of 5 handcrafted themes. All templates adapt dynamically to your resume data.
          </p>
        </div>

        <button
          onClick={onContinueToPreview}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs sm:text-sm font-semibold shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 shrink-0 transition"
        >
          <span>Preview with My Data</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Grid of Templates */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {TEMPLATES_LIST.map((tmpl: TemplateMeta) => {
          const isSelected = selectedTemplate === tmpl.id;
          return (
            <div
              key={tmpl.id}
              onClick={() => onSelectTemplate(tmpl.id)}
              className={`group relative p-6 rounded-2xl cursor-pointer transition-all duration-300 flex flex-col justify-between ${
                isSelected
                  ? 'bg-gradient-to-b from-indigo-950/40 to-slate-900 border-2 border-indigo-500 shadow-xl shadow-indigo-500/20 scale-[1.01]'
                  : 'bg-white/[0.02] border border-white/[0.08] hover:border-white/[0.18] hover:bg-white/[0.04]'
              }`}
            >
              {/* Active Badge */}
              {isSelected && (
                <div className="absolute top-4 right-4 flex items-center gap-1 px-2.5 py-1 rounded-full bg-indigo-500 text-white text-[11px] font-bold shadow-sm">
                  <Check className="w-3 h-3 stroke-[3]" />
                  <span>Selected</span>
                </div>
              )}

              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-white/[0.05] border border-white/[0.08] text-slate-300">
                    {tmpl.badge}
                  </span>
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: tmpl.accentColor }} />
                </div>

                <div>
                  <h3 className="text-xl font-bold text-white group-hover:text-indigo-300 transition">
                    {tmpl.name}
                  </h3>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                    {tmpl.description}
                  </p>
                </div>

                {/* Template Mockup Sketch */}
                <div className="p-3.5 rounded-xl bg-black/40 border border-white/[0.04] space-y-2">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-slate-600" />
                    <div className="w-12 h-1.5 rounded-full bg-slate-700" />
                  </div>
                  <div className="w-3/4 h-2 rounded-full bg-slate-500" />
                  <div className="w-1/2 h-1.5 rounded-full bg-slate-700" />
                  <div className="flex gap-1 pt-1">
                    <div className="w-8 h-3 rounded bg-white/[0.08]" />
                    <div className="w-8 h-3 rounded bg-white/[0.08]" />
                    <div className="w-8 h-3 rounded bg-white/[0.08]" />
                  </div>
                </div>

                <p className="text-[11px] text-slate-400">
                  <span className="font-semibold text-slate-300">Best for: </span>
                  {tmpl.idealFor}
                </p>
              </div>

              <div className="pt-6">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectTemplate(tmpl.id);
                    onContinueToPreview();
                  }}
                  className={`w-full py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
                    isSelected
                      ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30'
                      : 'bg-white/[0.06] hover:bg-white/[0.1] text-slate-300 hover:text-white'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>{isSelected ? 'Preview Selected' : 'Select & Preview'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="p-5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Sparkles className="w-5 h-5 text-indigo-400 shrink-0" />
          <p className="text-xs text-indigo-200">
            You can always switch between templates inside the interactive preview before or after publishing.
          </p>
        </div>
        <button
          onClick={onContinueToPreview}
          className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shrink-0 transition"
        >
          Open Preview Mode
        </button>
      </div>
    </div>
  );
};
