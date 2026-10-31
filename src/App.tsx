import React, { useState, useEffect } from 'react';
import { PortfolioData, TemplateType } from './types/portfolio';
import { LandingPage } from './components/LandingPage';
import { ResumeUploader } from './components/ResumeUploader';
import { ExtractedResumeEditor } from './components/ExtractedResumeEditor';
import { TemplateGallery } from './components/TemplateGallery';
import { PortfolioPreview } from './components/PortfolioPreview';
import { PublishModal } from './components/PublishModal';
import { PublishedPortfolio } from './components/PublishedPortfolio';
import { SAMPLE_RESUMES } from './data/sampleResumes';
import { savePortfolio, getPortfolioBySlug, getAllPortfolios } from './utils/storage';

export type AppView = 'landing' | 'upload' | 'edit' | 'templates' | 'preview' | 'published';

export default function App() {
  const [view, setView] = useState<AppView>('landing');
  const [publishedSlug, setPublishedSlug] = useState<string>('');
  const [uploadedFilename, setUploadedFilename] = useState<string>('');
  const [isPublishModalOpen, setIsPublishModalOpen] = useState<boolean>(false);

  // Active Portfolio Data being built
  const [currentPortfolio, setCurrentPortfolio] = useState<PortfolioData>(() => {
    // Default starting point with sample developer data
    const devSample = SAMPLE_RESUMES.softwareEngineer;
    return {
      slug: 'rafeek',
      name: devSample.name || 'Mohamed Rafeek',
      profession: devSample.profession || 'Senior Full Stack & AI Engineer',
      summary: devSample.summary || '',
      email: devSample.email || '',
      phone: devSample.phone || '',
      location: devSample.location || '',
      skills: devSample.skills || [],
      experience: devSample.experience || [],
      education: devSample.education || [],
      projects: devSample.projects || [],
      certifications: devSample.certifications || [],
      socialLinks: devSample.socialLinks || {},
      selectedTemplate: 'modern',
      publishedAt: new Date().toISOString()
    };
  });

  // Check URL path on load and on popstate for /p/:slug
  useEffect(() => {
    // Pre-populate sample 'rafeek' into localStorage if not present, so /p/rafeek is immediately available!
    const existing = getAllPortfolios();
    if (!existing['rafeek']) {
      savePortfolio({
        ...currentPortfolio,
        slug: 'rafeek',
        selectedTemplate: 'modern',
        publishedAt: new Date().toISOString()
      });
    }

    const checkRoute = () => {
      const path = window.location.pathname;
      const match = path.match(/^\/p\/([a-zA-Z0-9_-]+)/);
      if (match && match[1]) {
        setPublishedSlug(match[1].toLowerCase());
        setView('published');
      } else {
        // If at root
        if (view === 'published') {
          setView('landing');
        }
      }
    };

    checkRoute();
    window.addEventListener('popstate', checkRoute);
    return () => window.removeEventListener('popstate', checkRoute);
  }, []);

  const navigateTo = (newView: AppView, newPath?: string) => {
    setView(newView);
    if (newPath) {
      window.history.pushState({}, '', newPath);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 1. Resume Parsed Callback
  const handleResumeParsed = (extracted: Partial<PortfolioData>, filename: string) => {
    setUploadedFilename(filename);
    setCurrentPortfolio(prev => ({
      ...prev,
      ...extracted,
      socialLinks: {
        ...prev.socialLinks,
        ...(extracted.socialLinks || {})
      },
      skills: extracted.skills && extracted.skills.length > 0 ? extracted.skills : prev.skills,
      experience: extracted.experience && extracted.experience.length > 0 ? extracted.experience : prev.experience,
      education: extracted.education && extracted.education.length > 0 ? extracted.education : prev.education,
      projects: extracted.projects && extracted.projects.length > 0 ? extracted.projects : prev.projects,
      certifications: extracted.certifications && extracted.certifications.length > 0 ? extracted.certifications : prev.certifications,
    }));
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
    setCurrentPortfolio(prev => ({ ...prev, selectedTemplate: template }));
    navigateTo('preview');
  };

  // 5. Publish Success
  const handlePublishSuccess = (newSlug: string) => {
    setIsPublishModalOpen(false);
    setPublishedSlug(newSlug);
    navigateTo('published', `/p/${newSlug}`);
  };

  // 6. View Published Portfolio
  const handleViewPublished = (slug: string) => {
    setPublishedSlug(slug);
    navigateTo('published', `/p/${slug}`);
  };

  // 7. Edit an existing portfolio
  const handleEditExisting = (data: PortfolioData) => {
    setCurrentPortfolio(data);
    navigateTo('edit');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      {/* View Router */}
      {view === 'landing' && (
        <LandingPage
          onStartCreating={() => navigateTo('upload')}
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

      {view === 'published' && (
        <PublishedPortfolio
          slug={publishedSlug}
          onEdit={handleEditExisting}
          onHomeClick={() => navigateTo('landing', '/')}
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
