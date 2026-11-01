'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { PortfolioData, TemplateType } from '../types/portfolio';
import { LandingPage } from '../components/LandingPage';
import { ResumeUploader } from '../components/ResumeUploader';
import { ExtractedResumeEditor } from '../components/ExtractedResumeEditor';
import { TemplateGallery } from '../components/TemplateGallery';
import { PortfolioPreview } from '../components/PortfolioPreview';
import { PublishModal } from '../components/PublishModal';
import { SAMPLE_RESUMES } from '../data/sampleResumes';
import { savePortfolio, getPortfolioBySlug, getAllPortfolios, sanitizeSlug } from '../utils/storage';

export type AppView = 'landing' | 'upload' | 'edit' | 'templates' | 'preview';

const createEmptyPortfolio = (): PortfolioData => ({
  slug: '',
  name: '',
  profession: '',
  summary: '',
  email: '',
  phone: '',
  location: '',
  profileImage: '',
  skills: [],
  technicalSkills: [],
  softSkills: [],
  experience: [],
  education: [],
  projects: [],
  certifications: [],
  achievements: [],
  socialLinks: {},
  selectedTemplate: 'modern',
  publishedAt: new Date().toISOString()
});

export default function HomePage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [view, setView] = useState<AppView>('landing');
  const [uploadedFilename, setUploadedFilename] = useState<string>('');
  const [isPublishModalOpen, setIsPublishModalOpen] = useState<boolean>(false);

  // Active Portfolio Data being built - starts clean without preloaded dummy content
  const [currentPortfolio, setCurrentPortfolio] = useState<PortfolioData>(createEmptyPortfolio);

  useEffect(() => {
    setMounted(true);

    // Check if URL has ?edit=slug
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const editSlug = params.get('edit');
      if (editSlug) {
        const item = getPortfolioBySlug(editSlug);
        if (item) {
          setCurrentPortfolio(item);
          setView('edit');
        }
      }
    }
  }, []);

  const navigateTo = (newView: AppView) => {
    setView(newView);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleStartCreating = () => {
    // When starting a new portfolio, ensure state is completely clean
    if (currentPortfolio.slug === 'rafeek' || currentPortfolio.slug === 'elena' || !currentPortfolio.name) {
      setCurrentPortfolio(createEmptyPortfolio());
      setUploadedFilename('');
    }
    navigateTo('upload');
  };

  // 1. Resume Parsed Callback - Fresh extraction without merging old dummy content
  const handleResumeParsed = (extracted: Partial<PortfolioData>, filename: string) => {
    setUploadedFilename(filename);

    const baseName = (extracted.name || 'portfolio').trim();
    const firstWord = baseName.split(/\s+/)[0] || 'portfolio';
    const generatedSlug = sanitizeSlug(firstWord) || `portfolio-${Date.now().toString(36).slice(-4)}`;

    // Build fresh portfolio state strictly from the newly parsed resume
    const freshPortfolio: PortfolioData = {
      slug: generatedSlug,
      name: extracted.name || '',
      profession: extracted.profession || '',
      summary: extracted.summary || '',
      email: extracted.email || '',
      phone: extracted.phone || '',
      location: extracted.location || '',
      profileImage: extracted.profileImage || '',
      skills: extracted.skills || [],
      technicalSkills: extracted.technicalSkills || [],
      softSkills: extracted.softSkills || [],
      experience: extracted.experience || [],
      education: extracted.education || [],
      projects: extracted.projects || [],
      certifications: extracted.certifications || [],
      achievements: extracted.achievements || [],
      socialLinks: extracted.socialLinks || {},
      selectedTemplate: currentPortfolio.selectedTemplate || 'modern',
      publishedAt: new Date().toISOString()
    };

    setCurrentPortfolio(freshPortfolio);
    navigateTo('edit');
  };

  // 2. Editor Save & Continue
  const handleEditorContinue = (updatedData: PortfolioData) => {
    setCurrentPortfolio(updatedData);
    navigateTo('templates');
  };

  // 3. Template Selection
  const handleSelectTemplate = (template: TemplateType) => {
    setCurrentPortfolio(prev => ({ ...prev, selectedTemplate: template }));
  };

  // 4. Sample Preview from Landing
  const handlePreviewSample = (template: TemplateType) => {
    const devSample = SAMPLE_RESUMES.softwareEngineer;
    setCurrentPortfolio({
      slug: 'rafeek',
      name: devSample.name || 'Mohamed Rafeek',
      profession: devSample.profession || 'Senior Full Stack & AI Engineer',
      summary: devSample.summary || '',
      email: devSample.email || '',
      phone: devSample.phone || '',
      location: devSample.location || '',
      profileImage: devSample.profileImage || '',
      skills: devSample.skills || [],
      technicalSkills: devSample.skills || [],
      softSkills: [],
      experience: devSample.experience || [],
      education: devSample.education || [],
      projects: devSample.projects || [],
      certifications: devSample.certifications || [],
      achievements: devSample.achievements || [],
      socialLinks: devSample.socialLinks || {},
      selectedTemplate: template,
      publishedAt: new Date().toISOString()
    });
    navigateTo('preview');
  };

  // 5. Publish Success -> Redirect to /p/[slug]
  const handlePublishSuccess = (newSlug: string) => {
    setIsPublishModalOpen(false);
    router.push(`/p/${newSlug}`);
  };

  // 6. View Published Portfolio
  const handleViewPublished = (slug: string) => {
    router.push(`/p/${slug}`);
  };

  // 7. Edit an existing portfolio
  const handleEditExisting = (data: PortfolioData) => {
    setCurrentPortfolio(data);
    navigateTo('edit');
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center font-sans">
        <div className="space-y-3 text-center">
          <div className="w-10 h-10 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-400 font-mono">Loading Folix...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      {/* View Router */}
      {view === 'landing' && (
        <LandingPage
          onStartCreating={handleStartCreating}
          onPreviewSample={handlePreviewSample}
          onViewPublished={handleViewPublished}
          onEditPortfolio={handleEditExisting}
        />
      )}

      {view === 'upload' && (
        <ResumeUploader
          onParsed={handleResumeParsed}
          onCancel={() => navigateTo('landing')}
        />
      )}

      {view === 'edit' && (
        <ExtractedResumeEditor
          key={`${uploadedFilename || 'portfolio'}_${currentPortfolio.slug || ''}_${currentPortfolio.name || ''}`}
          initialData={currentPortfolio}
          filename={uploadedFilename}
          onSaveAndContinue={handleEditorContinue}
          onBack={() => navigateTo('upload')}
        />
      )}

      {view === 'templates' && (
        <TemplateGallery
          selectedTemplate={currentPortfolio.selectedTemplate}
          portfolioData={currentPortfolio}
          onSelectTemplate={handleSelectTemplate}
          onContinueToPreview={() => navigateTo('preview')}
          onBackToEdit={() => navigateTo('edit')}
        />
      )}

      {view === 'preview' && (
        <PortfolioPreview
          data={currentPortfolio}
          onBackToEdit={() => navigateTo('edit')}
          onBackToTemplates={() => navigateTo('templates')}
          onPublishClick={() => setIsPublishModalOpen(true)}
          onTemplateChange={handleSelectTemplate}
        />
      )}

      {/* Publish Modal */}
      <PublishModal
        isOpen={isPublishModalOpen}
        portfolioData={currentPortfolio}
        onClose={() => setIsPublishModalOpen(false)}
        onSuccess={handlePublishSuccess}
      />
    </div>
  );
}
