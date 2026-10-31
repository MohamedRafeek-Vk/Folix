import React, { useState } from 'react';
import { PortfolioData, WorkExperience, Education, Project, Certification } from '../types/portfolio';
import { User, Briefcase, GraduationCap, Code, Award, Share2, Plus, Trash2, ArrowRight, ArrowLeft, Check, Sparkles } from 'lucide-react';

interface Props {
  initialData: Partial<PortfolioData>;
  filename?: string;
  onSaveAndContinue: (data: PortfolioData) => void;
  onBack: () => void;
}

export const ExtractedResumeEditor: React.FC<Props> = ({
  initialData,
  filename,
  onSaveAndContinue,
  onBack
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'experience' | 'projects' | 'skills' | 'education' | 'links'>('profile');

  // Form State
  const [name, setName] = useState(initialData.name || '');
  const [profession, setProfession] = useState(initialData.profession || '');
  const [summary, setSummary] = useState(initialData.summary || '');
  const [email, setEmail] = useState(initialData.email || '');
  const [phone, setPhone] = useState(initialData.phone || '');
  const [location, setLocation] = useState(initialData.location || '');

  // Skills
  const [skills, setSkills] = useState<string[]>(initialData.skills || []);
  const [newSkillInput, setNewSkillInput] = useState('');

  // Experience
  const [experience, setExperience] = useState<WorkExperience[]>(initialData.experience || []);

  // Education
  const [education, setEducation] = useState<Education[]>(initialData.education || []);

  // Projects
  const [projects, setProjects] = useState<Project[]>(initialData.projects || []);

  // Certifications
  const [certifications, setCertifications] = useState<Certification[]>(initialData.certifications || []);

  // Social Links
  const [github, setGithub] = useState(initialData.socialLinks?.github || '');
  const [linkedin, setLinkedin] = useState(initialData.socialLinks?.linkedin || '');
  const [website, setWebsite] = useState(initialData.socialLinks?.website || '');
  const [twitter, setTwitter] = useState(initialData.socialLinks?.twitter || '');

  // Skill Management
  const handleAddSkill = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newSkillInput.trim()) return;
    const split = newSkillInput.split(',').map(s => s.trim()).filter(Boolean);
    const updated = Array.from(new Set([...skills, ...split]));
    setSkills(updated);
    setNewSkillInput('');
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter(s => s !== skillToRemove));
  };

  // Experience Management
  const handleAddExperience = () => {
    const newExp: WorkExperience = {
      id: `exp-${Date.now()}`,
      role: 'Software Engineer',
      company: 'Tech Corp',
      startDate: '2022',
      endDate: 'Present',
      current: true,
      description: 'Led development of core features and collaborated with cross-functional teams.'
    };
    setExperience([newExp, ...experience]);
  };

  const handleUpdateExperience = (id: string, field: keyof WorkExperience, value: any) => {
    setExperience(experience.map(exp => exp.id === id ? { ...exp, [field]: value } : exp));
  };

  const handleRemoveExperience = (id: string) => {
    setExperience(experience.filter(exp => exp.id !== id));
  };

  // Education Management
  const handleAddEducation = () => {
    const newEdu: Education = {
      id: `edu-${Date.now()}`,
      degree: 'B.S. in Computer Science',
      institution: 'State University',
      endYear: '2022'
    };
    setEducation([...education, newEdu]);
  };

  const handleUpdateEducation = (id: string, field: keyof Education, value: any) => {
    setEducation(education.map(edu => edu.id === id ? { ...edu, [field]: value } : edu));
  };

  const handleRemoveEducation = (id: string) => {
    setEducation(education.filter(edu => edu.id !== id));
  };

  // Project Management
  const handleAddProject = () => {
    const newProj: Project = {
      id: `proj-${Date.now()}`,
      title: 'Full Stack Web Platform',
      description: 'An interactive web application built with modern reactive technologies.',
      technologies: ['React', 'TypeScript', 'Tailwind'],
      featured: true
    };
    setProjects([newProj, ...projects]);
  };

  const handleUpdateProject = (id: string, field: keyof Project, value: any) => {
    setProjects(projects.map(proj => proj.id === id ? { ...proj, [field]: value } : proj));
  };

  const handleRemoveProject = (id: string) => {
    setProjects(projects.filter(proj => proj.id !== id));
  };

  // Certifications Management
  const handleAddCert = () => {
    const newCert: Certification = {
      id: `cert-${Date.now()}`,
      name: 'Certified Cloud Practitioner',
      issuer: 'Cloud Provider',
      date: '2023'
    };
    setCertifications([...certifications, newCert]);
  };

  const handleUpdateCert = (id: string, field: keyof Certification, value: any) => {
    setCertifications(certifications.map(c => c.id === id ? { ...c, [field]: value } : c));
  };

  const handleRemoveCert = (id: string) => {
    setCertifications(certifications.filter(c => c.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const compiledData: PortfolioData = {
      slug: initialData.slug || '',
      name: name.trim() || 'My Portfolio',
      profession: profession.trim() || 'Professional',
      summary: summary.trim(),
      email: email.trim(),
      phone: phone.trim(),
      location: location.trim(),
      skills,
      experience,
      education,
      projects,
      certifications,
      socialLinks: {
        github: github.trim(),
        linkedin: linkedin.trim(),
        website: website.trim(),
        twitter: twitter.trim(),
        email: email.trim()
      },
      selectedTemplate: initialData.selectedTemplate || 'modern',
      publishedAt: initialData.publishedAt || new Date().toISOString()
    };

    onSaveAndContinue(compiledData);
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 space-y-8 animate-fade-in">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-6">
        <div>
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition font-medium mb-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Upload different resume</span>
          </button>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <span>Review & Refine Extracted Data</span>
            <span className="text-xs font-mono font-normal px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Parsed Successfully
            </span>
          </h2>
          {filename && (
            <p className="text-xs text-slate-400 mt-1">
              Extracted from <span className="text-slate-200 font-mono">{filename}</span>
            </p>
          )}
        </div>

        <button
          onClick={handleSubmit}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs sm:text-sm font-semibold shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 shrink-0 transition"
        >
          <span>Choose Template & Preview</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Tabs Bar */}
      <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-none border-b border-white/[0.06]">
        <button
          onClick={() => setActiveTab('profile')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium whitespace-nowrap transition ${
            activeTab === 'profile'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
              : 'bg-white/[0.03] text-slate-400 hover:bg-white/[0.06] hover:text-white'
          }`}
        >
          <User className="w-3.5 h-3.5" />
          <span>Profile & Bio</span>
        </button>

        <button
          onClick={() => setActiveTab('skills')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium whitespace-nowrap transition ${
            activeTab === 'skills'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
              : 'bg-white/[0.03] text-slate-400 hover:bg-white/[0.06] hover:text-white'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Skills ({skills.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('experience')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium whitespace-nowrap transition ${
            activeTab === 'experience'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
              : 'bg-white/[0.03] text-slate-400 hover:bg-white/[0.06] hover:text-white'
          }`}
        >
          <Briefcase className="w-3.5 h-3.5" />
          <span>Experience ({experience.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('projects')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium whitespace-nowrap transition ${
            activeTab === 'projects'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
              : 'bg-white/[0.03] text-slate-400 hover:bg-white/[0.06] hover:text-white'
          }`}
        >
          <Code className="w-3.5 h-3.5" />
          <span>Projects ({projects.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('education')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium whitespace-nowrap transition ${
            activeTab === 'education'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
              : 'bg-white/[0.03] text-slate-400 hover:bg-white/[0.06] hover:text-white'
          }`}
        >
          <GraduationCap className="w-3.5 h-3.5" />
          <span>Education & Certs ({education.length + certifications.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('links')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-medium whitespace-nowrap transition ${
            activeTab === 'links'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
              : 'bg-white/[0.03] text-slate-400 hover:bg-white/[0.06] hover:text-white'
          }`}
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>Social & Links</span>
        </button>
      </div>

      {/* Tab Panels */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* TAB 1: Profile & Bio */}
        {activeTab === 'profile' && (
          <div className="p-6 sm:p-8 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <User className="w-4 h-4 text-indigo-400" />
              <span>Personal & Professional Identity</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Full Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Mohamed Rafeek"
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/[0.08] focus:border-indigo-500 focus:outline-none text-white text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Professional Title / Headline *</label>
                <input
                  type="text"
                  value={profession}
                  onChange={e => setProfession(e.target.value)}
                  placeholder="e.g. Senior Full Stack Engineer"
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/[0.08] focus:border-indigo-500 focus:outline-none text-white text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="e.g. contact@domain.com"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/[0.08] focus:border-indigo-500 focus:outline-none text-white text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Phone Number</label>
                <input
                  type="text"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="e.g. +1 (555) 019-2834"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/[0.08] focus:border-indigo-500 focus:outline-none text-white text-sm"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-semibold text-slate-300">Location</label>
                <input
                  type="text"
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  placeholder="e.g. San Francisco, CA or Remote"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/[0.08] focus:border-indigo-500 focus:outline-none text-white text-sm"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-semibold text-slate-300">Professional Summary / About</label>
                <textarea
                  rows={4}
                  value={summary}
                  onChange={e => setSummary(e.target.value)}
                  placeholder="Brief synopsis of your experience, technical focus, and career milestones..."
                  className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-white/[0.08] focus:border-indigo-500 focus:outline-none text-white text-sm leading-relaxed"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Skills */}
        {activeTab === 'skills' && (
          <div className="p-6 sm:p-8 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <span>Skills & Competencies ({skills.length})</span>
              </h3>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={newSkillInput}
                onChange={e => setNewSkillInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddSkill(); } }}
                placeholder="Type a skill and press Enter or add multiple with commas..."
                className="flex-1 px-4 py-2.5 rounded-xl bg-slate-900 border border-white/[0.08] focus:border-indigo-500 focus:outline-none text-white text-sm"
              />
              <button
                type="button"
                onClick={() => handleAddSkill()}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs flex items-center gap-1.5 transition"
              >
                <Plus className="w-4 h-4" />
                <span>Add</span>
              </button>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              {skills.map((skill, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white/[0.05] border border-white/[0.08] text-slate-200 group hover:border-red-500/40"
                >
                  <span>{skill}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="text-slate-400 hover:text-red-400 transition"
                  >
                    ×
                  </button>
                </span>
              ))}
              {skills.length === 0 && (
                <p className="text-xs text-slate-500 italic">No skills added yet. Add key technologies, languages, or tools above.</p>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: Experience */}
        {activeTab === 'experience' && (
          <div className="p-6 sm:p-8 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-indigo-400" />
                <span>Work Experience ({experience.length})</span>
              </h3>
              <button
                type="button"
                onClick={handleAddExperience}
                className="px-4 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-xs font-semibold text-slate-200 flex items-center gap-1.5 transition"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Position</span>
              </button>
            </div>

            <div className="space-y-6">
              {experience.map((exp, index) => (
                <div key={exp.id} className="p-5 rounded-xl bg-slate-900/80 border border-white/[0.08] space-y-4 relative">
                  <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
                    <span className="text-xs font-mono text-indigo-400">Position 0{index + 1}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveExperience(exp.id)}
                      className="text-slate-500 hover:text-red-400 transition text-xs flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-slate-400">Role / Job Title</label>
                      <input
                        type="text"
                        value={exp.role}
                        onChange={e => handleUpdateExperience(exp.id, 'role', e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/[0.06] text-white text-xs"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-slate-400">Company / Organization</label>
                      <input
                        type="text"
                        value={exp.company}
                        onChange={e => handleUpdateExperience(exp.id, 'company', e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/[0.06] text-white text-xs"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-slate-400">Start Date</label>
                      <input
                        type="text"
                        value={exp.startDate}
                        onChange={e => handleUpdateExperience(exp.id, 'startDate', e.target.value)}
                        placeholder="e.g. 2021"
                        className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/[0.06] text-white text-xs"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-slate-400">End Date</label>
                      <input
                        type="text"
                        value={exp.endDate}
                        onChange={e => handleUpdateExperience(exp.id, 'endDate', e.target.value)}
                        placeholder="e.g. Present"
                        className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/[0.06] text-white text-xs"
                      />
                    </div>

                    <div className="sm:col-span-2 space-y-1">
                      <label className="text-[11px] font-semibold text-slate-400">Description & Accomplishments</label>
                      <textarea
                        rows={2}
                        value={exp.description}
                        onChange={e => handleUpdateExperience(exp.id, 'description', e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/[0.06] text-white text-xs leading-relaxed"
                      />
                    </div>
                  </div>
                </div>
              ))}

              {experience.length === 0 && (
                <p className="text-xs text-slate-500 italic text-center py-4">No experience entries recorded. Click "Add Position" to add one.</p>
              )}
            </div>
          </div>
        )}

        {/* TAB 4: Projects */}
        {activeTab === 'projects' && (
          <div className="p-6 sm:p-8 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Code className="w-4 h-4 text-indigo-400" />
                <span>Featured Projects ({projects.length})</span>
              </h3>
              <button
                type="button"
                onClick={handleAddProject}
                className="px-4 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-xs font-semibold text-slate-200 flex items-center gap-1.5 transition"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Project</span>
              </button>
            </div>

            <div className="space-y-6">
              {projects.map((proj, idx) => (
                <div key={proj.id} className="p-5 rounded-xl bg-slate-900/80 border border-white/[0.08] space-y-4">
                  <div className="flex items-center justify-between border-b border-white/[0.06] pb-3">
                    <span className="text-xs font-mono text-purple-400">Project 0{idx + 1}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveProject(proj.id)}
                      className="text-slate-500 hover:text-red-400 transition text-xs flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-slate-400">Project Name</label>
                      <input
                        type="text"
                        value={proj.title}
                        onChange={e => handleUpdateProject(proj.id, 'title', e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/[0.06] text-white text-xs"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-slate-400">Demo / Repository Link</label>
                      <input
                        type="url"
                        value={proj.link || ''}
                        onChange={e => handleUpdateProject(proj.id, 'link', e.target.value)}
                        placeholder="https://example.com"
                        className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/[0.06] text-white text-xs"
                      />
                    </div>

                    <div className="sm:col-span-2 space-y-1">
                      <label className="text-[11px] font-semibold text-slate-400">Project Description</label>
                      <textarea
                        rows={2}
                        value={proj.description}
                        onChange={e => handleUpdateProject(proj.id, 'description', e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/[0.06] text-white text-xs leading-relaxed"
                      />
                    </div>

                    <div className="sm:col-span-2 space-y-1">
                      <label className="text-[11px] font-semibold text-slate-400">Technologies (comma-separated)</label>
                      <input
                        type="text"
                        value={proj.technologies?.join(', ') || ''}
                        onChange={e => handleUpdateProject(proj.id, 'technologies', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                        placeholder="React, TypeScript, Node.js"
                        className="w-full px-3 py-2 rounded-lg bg-black/40 border border-white/[0.06] text-white text-xs"
                      />
                    </div>
                  </div>
                </div>
              ))}

              {projects.length === 0 && (
                <p className="text-xs text-slate-500 italic text-center py-4">No projects listed. Click "Add Project" to add your highlights.</p>
              )}
            </div>
          </div>
        )}

        {/* TAB 5: Education & Certifications */}
        {activeTab === 'education' && (
          <div className="p-6 sm:p-8 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-8">
            {/* Education */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-indigo-400" />
                  <span>Academic Background</span>
                </h3>
                <button
                  type="button"
                  onClick={handleAddEducation}
                  className="px-3.5 py-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-xs font-semibold text-slate-200 flex items-center gap-1.5 transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Degree</span>
                </button>
              </div>

              <div className="space-y-3">
                {education.map(edu => (
                  <div key={edu.id} className="p-4 rounded-xl bg-slate-900/80 border border-white/[0.08] flex items-center justify-between gap-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 flex-1">
                      <input
                        type="text"
                        value={edu.degree}
                        onChange={e => handleUpdateEducation(edu.id, 'degree', e.target.value)}
                        placeholder="Degree / Certificate"
                        className="px-3 py-2 rounded-lg bg-black/40 border border-white/[0.06] text-white text-xs"
                      />
                      <input
                        type="text"
                        value={edu.institution}
                        onChange={e => handleUpdateEducation(edu.id, 'institution', e.target.value)}
                        placeholder="University / Institute"
                        className="px-3 py-2 rounded-lg bg-black/40 border border-white/[0.06] text-white text-xs"
                      />
                      <input
                        type="text"
                        value={edu.endYear}
                        onChange={e => handleUpdateEducation(edu.id, 'endYear', e.target.value)}
                        placeholder="Year"
                        className="px-3 py-2 rounded-lg bg-black/40 border border-white/[0.06] text-white text-xs"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveEducation(edu.id)}
                      className="text-slate-500 hover:text-red-400 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Certifications */}
            <div className="space-y-4 pt-4 border-t border-white/[0.06]">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Award className="w-4 h-4 text-purple-400" />
                  <span>Certifications & Accreditations</span>
                </h3>
                <button
                  type="button"
                  onClick={handleAddCert}
                  className="px-3.5 py-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-xs font-semibold text-slate-200 flex items-center gap-1.5 transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Certification</span>
                </button>
              </div>

              <div className="space-y-3">
                {certifications.map(c => (
                  <div key={c.id} className="p-4 rounded-xl bg-slate-900/80 border border-white/[0.08] flex items-center justify-between gap-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 flex-1">
                      <input
                        type="text"
                        value={c.name}
                        onChange={e => handleUpdateCert(c.id, 'name', e.target.value)}
                        placeholder="Certification Title"
                        className="px-3 py-2 rounded-lg bg-black/40 border border-white/[0.06] text-white text-xs"
                      />
                      <input
                        type="text"
                        value={c.issuer}
                        onChange={e => handleUpdateCert(c.id, 'issuer', e.target.value)}
                        placeholder="Issuer (e.g. AWS, Google)"
                        className="px-3 py-2 rounded-lg bg-black/40 border border-white/[0.06] text-white text-xs"
                      />
                      <input
                        type="text"
                        value={c.date || ''}
                        onChange={e => handleUpdateCert(c.id, 'date', e.target.value)}
                        placeholder="Year"
                        className="px-3 py-2 rounded-lg bg-black/40 border border-white/[0.06] text-white text-xs"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveCert(c.id)}
                      className="text-slate-500 hover:text-red-400 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: Social Links */}
        {activeTab === 'links' && (
          <div className="p-6 sm:p-8 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Share2 className="w-4 h-4 text-indigo-400" />
              <span>Social & Online Presence</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">GitHub Profile URL</label>
                <input
                  type="url"
                  value={github}
                  onChange={e => setGithub(e.target.value)}
                  placeholder="https://github.com/username"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/[0.08] focus:border-indigo-500 focus:outline-none text-white text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">LinkedIn Profile URL</label>
                <input
                  type="url"
                  value={linkedin}
                  onChange={e => setLinkedin(e.target.value)}
                  placeholder="https://linkedin.com/in/username"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/[0.08] focus:border-indigo-500 focus:outline-none text-white text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Personal Website / Blog</label>
                <input
                  type="url"
                  value={website}
                  onChange={e => setWebsite(e.target.value)}
                  placeholder="https://mywebsite.com"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/[0.08] focus:border-indigo-500 focus:outline-none text-white text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Twitter / X URL</label>
                <input
                  type="url"
                  value={twitter}
                  onChange={e => setTwitter(e.target.value)}
                  placeholder="https://x.com/username"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/[0.08] focus:border-indigo-500 focus:outline-none text-white text-sm"
                />
              </div>
            </div>
          </div>
        )}

        {/* Bottom Action Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-white/[0.08]">
          <button
            type="button"
            onClick={onBack}
            className="px-5 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-xs font-semibold text-slate-300 transition"
          >
            Back
          </button>

          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs sm:text-sm font-semibold shadow-lg shadow-indigo-500/25 flex items-center gap-2 transition"
          >
            <span>Proceed to Template Selection</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};
