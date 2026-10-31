import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, CheckCircle2, AlertCircle, ArrowRight, Loader2, Sparkles, FileCode, UserCheck } from 'lucide-react';
import { extractTextFromFile, parseResumeText } from '../utils/resumeParser';
import { PortfolioData } from '../types/portfolio';
import { SAMPLE_RESUMES } from '../data/sampleResumes';

interface Props {
  onParsed: (data: Partial<PortfolioData>, filename: string) => void;
  onCancel: () => void;
}

export const ResumeUploader: React.FC<Props> = ({ onParsed, onCancel }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processSelectedFile(e.target.files[0]);
    }
  };

  const processSelectedFile = async (selectedFile: File) => {
    const ext = selectedFile.name.split('.').pop()?.toLowerCase();
    if (ext !== 'pdf' && ext !== 'docx' && ext !== 'txt') {
      setError('Unsupported file type. Please upload a PDF (.pdf) or Word document (.docx).');
      return;
    }

    setFile(selectedFile);
    setError(null);
    setIsProcessing(true);

    try {
      setCurrentStep('Reading resume file...');
      await new Promise(r => setTimeout(r, 400));

      setCurrentStep('Extracting document contents...');
      const rawText = await extractTextFromFile(selectedFile);

      if (!rawText || rawText.trim().length < 20) {
        throw new Error('Could not extract readable text from this document. It might be an image scan or password-protected.');
      }

      setCurrentStep('Analyzing professional details & work history...');
      await new Promise(r => setTimeout(r, 500));

      setCurrentStep('Structuring portfolio sections...');
      const parsedData = parseResumeText(rawText);
      await new Promise(r => setTimeout(r, 300));

      setIsProcessing(false);
      onParsed(parsedData, selectedFile.name);
    } catch (err: any) {
      console.error('Extraction error:', err);
      setIsProcessing(false);
      setError(err?.message || 'Failed to process the document. Please try another file.');
    }
  };

  const handleLoadSample = (sampleKey: keyof typeof SAMPLE_RESUMES) => {
    const sample = SAMPLE_RESUMES[sampleKey];
    setIsProcessing(true);
    setCurrentStep(`Loading ${sample.label} demo resume...`);
    setTimeout(() => {
      setIsProcessing(false);
      onParsed(sample, `${sample.label.replace(/\s+/g, '_')}_Resume.pdf`);
    }, 400);
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-12 space-y-8 animate-fade-in">
      <div className="text-center space-y-3">
        <button
          onClick={onCancel}
          className="text-xs text-slate-400 hover:text-white transition font-medium mb-2"
        >
          ← Back to Overview
        </button>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Upload Your Resume
        </h2>
        <p className="text-sm text-slate-400 max-w-lg mx-auto">
          We support PDF and DOCX files. Our automated extractor will analyze your background and create your portfolio in seconds.
        </p>
      </div>

      {/* Upload Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !isProcessing && fileInputRef.current?.click()}
        className={`relative p-10 sm:p-14 rounded-3xl border-2 border-dashed transition-all duration-300 text-center cursor-pointer flex flex-col items-center justify-center space-y-4 ${
          isDragging
            ? 'border-indigo-500 bg-indigo-500/10 scale-[1.01]'
            : 'border-white/[0.12] bg-white/[0.02] hover:border-indigo-500/50 hover:bg-white/[0.04]'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.docx,.txt"
          onChange={handleFileChange}
          className="hidden"
          disabled={isProcessing}
        />

        <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center shadow-lg shadow-indigo-500/10">
          {isProcessing ? (
            <Loader2 className="w-8 h-8 animate-spin" />
          ) : (
            <UploadCloud className="w-8 h-8" />
          )}
        </div>

        <div className="space-y-1">
          <p className="text-base font-semibold text-white">
            {isProcessing ? currentStep : 'Drag and drop your resume file here'}
          </p>
          <p className="text-xs text-slate-400">
            or <span className="text-indigo-400 underline font-medium">browse from your computer</span>
          </p>
        </div>

        <div className="flex items-center gap-2 text-[11px] font-mono text-slate-500 pt-2">
          <span>Supported formats:</span>
          <span className="px-2 py-0.5 rounded bg-white/[0.05] border border-white/[0.08] text-slate-300 font-semibold">.PDF</span>
          <span className="px-2 py-0.5 rounded bg-white/[0.05] border border-white/[0.08] text-slate-300 font-semibold">.DOCX</span>
        </div>
      </div>

      {/* Uploaded File status */}
      {file && !error && (
        <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-indigo-400 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-white truncate max-w-xs sm:max-w-md">
                {file.name}
              </p>
              <p className="text-xs text-slate-400">
                {(file.size / 1024).toFixed(1)} KB • {isProcessing ? currentStep : 'Extraction completed'}
              </p>
            </div>
          </div>
          {isProcessing ? (
            <Loader2 className="w-4 h-4 text-indigo-400 animate-spin" />
          ) : (
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          )}
        </div>
      )}

      {/* Error alert */}
      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-start gap-3 text-red-200 text-xs sm:text-sm">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-red-300">Extraction Notice</p>
            <p className="text-red-400/90 mt-0.5">{error}</p>
          </div>
        </div>
      )}

      {/* One-click Demo Sample Resumes */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-white/[0.06] space-y-4">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-indigo-400">
          <Sparkles className="w-4 h-4" />
          <span>No resume file ready? Test instantly</span>
        </div>

        <p className="text-xs text-slate-400">
          Try the generator with pre-formatted professional resumes:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            onClick={() => handleLoadSample('softwareEngineer')}
            disabled={isProcessing}
            className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.08] hover:border-indigo-500/40 hover:bg-white/[0.06] text-left transition group"
          >
            <div className="flex items-center justify-between">
              <span className="font-semibold text-white text-xs group-hover:text-indigo-300 transition">
                Mohamed Rafeek
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300">
                Tech / Dev
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Senior Full Stack & AI Engineer (React, Go, Microservices)
            </p>
          </button>

          <button
            onClick={() => handleLoadSample('productDesigner')}
            disabled={isProcessing}
            className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.08] hover:border-purple-500/40 hover:bg-white/[0.06] text-left transition group"
          >
            <div className="flex items-center justify-between">
              <span className="font-semibold text-white text-xs group-hover:text-purple-300 transition">
                Elena Rostova
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/10 text-purple-300">
                Design / UX
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Principal Product & UX Designer (Design Systems, Strategy)
            </p>
          </button>
        </div>
      </div>
    </div>
  );
};
