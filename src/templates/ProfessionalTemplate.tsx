import React from 'react';
import { PortfolioData } from '../types/portfolio';
import { Mail, MapPin, Phone, Github, Linkedin, Globe, Award, Briefcase, GraduationCap, CheckCircle2 } from 'lucide-react';

export const ProfessionalTemplate: React.FC<{ data: PortfolioData }> = ({ data }) => {
  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 font-sans selection:bg-blue-100">
      {/* Executive Header Banner */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="font-bold text-slate-900 text-lg tracking-tight">{data.name || 'Executive Portfolio'}</h1>
            <p className="text-xs text-slate-500 font-medium">{data.profession || 'Professional'}</p>
          </div>

          <div className="flex items-center gap-4 text-xs font-medium text-slate-600">
            {data.email && (
              <a href={`mailto:${data.email}`} className="px-4 py-2 rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition shadow-sm">
                Connect Directly
              </a>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12 space-y-12">
        {/* Executive Profile Card */}
        <section className="p-8 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
            <div className="space-y-2">
              <span className="text-xs uppercase font-semibold tracking-wider text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md">
                Verified Candidate Profile
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                {data.name || 'Your Full Name'}
              </h2>
              <p className="text-lg text-slate-600 font-medium">
                {data.profession || 'Executive / Senior Professional'}
              </p>
            </div>

            <div className="flex flex-col gap-2 text-sm text-slate-600 shrink-0">
              {data.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  <span>{data.location}</span>
                </div>
              )}
              {data.email && (
                <a href={`mailto:${data.email}`} className="flex items-center gap-2 hover:text-blue-600 transition">
                  <Mail className="w-4 h-4 text-slate-400" />
                  <span>{data.email}</span>
                </a>
              )}
              {data.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-slate-400" />
                  <span>{data.phone}</span>
                </div>
              )}
            </div>
          </div>

          {/* Executive Summary */}
          {data.summary && (
            <div className="space-y-2">
              <h3 className="text-xs uppercase tracking-wider font-bold text-slate-400">Executive Summary</h3>
              <p className="text-slate-700 leading-relaxed text-base">
                {data.summary}
              </p>
            </div>
          )}

          {/* Links */}
          <div className="flex items-center gap-4 pt-2">
            {data.socialLinks?.linkedin && (
              <a href={data.socialLinks.linkedin} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 hover:underline">
                <Linkedin className="w-3.5 h-3.5" />
                <span>LinkedIn Profile</span>
              </a>
            )}
            {data.socialLinks?.github && (
              <a href={data.socialLinks.github} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:underline">
                <Github className="w-3.5 h-3.5" />
                <span>GitHub</span>
              </a>
            )}
            {data.socialLinks?.website && (
              <a href={data.socialLinks.website} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:underline">
                <Globe className="w-3.5 h-3.5" />
                <span>Personal Website</span>
              </a>
            )}
          </div>
        </section>

        {/* Experience Section */}
        {data.experience?.length > 0 && (
          <section className="space-y-6">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-xl">
              <Briefcase className="w-5 h-5 text-blue-700" />
              <h2>Professional Experience</h2>
            </div>

            <div className="space-y-4">
              {data.experience.map(exp => (
                <div key={exp.id} className="p-6 rounded-xl bg-white border border-slate-200/80 shadow-sm space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">{exp.role}</h3>
                      <p className="text-sm font-semibold text-blue-700">{exp.company} {exp.location ? `• ${exp.location}` : ''}</p>
                    </div>
                    <span className="text-xs font-semibold px-3 py-1 rounded bg-slate-100 text-slate-600 w-fit">
                      {exp.startDate} – {exp.endDate}
                    </span>
                  </div>

                  {exp.description && (
                    <p className="text-sm text-slate-600 leading-relaxed">{exp.description}</p>
                  )}

                  {exp.highlights && exp.highlights.length > 0 && (
                    <div className="space-y-1.5 pt-2">
                      {exp.highlights.map((h, i) => (
                        <div key={i} className="flex items-start gap-2 text-sm text-slate-700">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{h}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Core Competencies & Skills */}
        {data.skills?.length > 0 && (
          <section className="p-8 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-slate-900">Core Competencies & Expertise</h2>
            <div className="flex flex-wrap gap-2">
              {data.skills.map((skill, i) => (
                <span key={i} className="px-3.5 py-1.5 rounded-md text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                  {skill}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Projects Section */}
        {data.projects?.length > 0 && (
          <section className="space-y-6">
            <h2 className="text-xl font-bold text-slate-900">Selected Key Initiatives & Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.projects.map(proj => (
                <div key={proj.id} className="p-6 rounded-xl bg-white border border-slate-200/80 shadow-sm flex flex-col justify-between space-y-3">
                  <div className="space-y-2">
                    <h3 className="font-bold text-slate-900 text-base">{proj.title}</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">{proj.description}</p>
                  </div>
                  {proj.technologies?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {proj.technologies.map((t, idx) => (
                        <span key={idx} className="text-[11px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-mono">
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education & Credentials */}
        {(data.education?.length > 0 || data.certifications?.length > 0) && (
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {data.education?.length > 0 && (
              <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-4">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
                  <GraduationCap className="w-4 h-4 text-blue-700" />
                  <h3>Academic Credentials</h3>
                </div>
                <div className="space-y-3">
                  {data.education.map(edu => (
                    <div key={edu.id} className="space-y-0.5">
                      <h4 className="font-semibold text-slate-900 text-sm">{edu.degree}</h4>
                      <p className="text-xs text-slate-600">{edu.institution} {edu.location ? `• ${edu.location}` : ''}</p>
                      <span className="text-xs text-slate-400 font-medium">Graduation: {edu.endYear}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {data.certifications?.length > 0 && (
              <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-4">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
                  <Award className="w-4 h-4 text-blue-700" />
                  <h3>Certifications & Accreditations</h3>
                </div>
                <div className="space-y-3">
                  {data.certifications.map(c => (
                    <div key={c.id} className="space-y-0.5">
                      <h4 className="font-semibold text-slate-900 text-sm">{c.name}</h4>
                      <p className="text-xs text-slate-600">{c.issuer} {c.date ? `• ${c.date}` : ''}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}
      </main>

      <footer className="border-t border-slate-200 bg-white py-8 text-center text-xs text-slate-500">
        <p>© {new Date().getFullYear()} {data.name || 'Executive'}. Confidential & verified portfolio.</p>
      </footer>
    </div>
  );
};
