import React from 'react';
import { PortfolioData } from '../types/portfolio';
import { Mail, MapPin, Phone, Github, Linkedin, Globe, Award, Briefcase, GraduationCap, CheckCircle2, User, Sparkles } from 'lucide-react';

export const ProfessionalTemplate: React.FC<{ data: PortfolioData }> = ({ data }) => {
  // Sort experience & education descending (most recent first)
  const sortedExperience = [...(data.experience || [])].sort((a, b) => {
    const isCurrentA = a.current || /present|current|ongoing/i.test(a.endDate || '');
    const isCurrentB = b.current || /present|current|ongoing/i.test(b.endDate || '');
    if (isCurrentA && !isCurrentB) return -1;
    if (!isCurrentA && isCurrentB) return 1;
    const yearA = (a.endDate || a.startDate || '').match(/(?:19|20)\d{2}/);
    const yearB = (b.endDate || b.startDate || '').match(/(?:19|20)\d{2}/);
    const valA = yearA ? parseInt(yearA[0], 10) : 0;
    const valB = yearB ? parseInt(yearB[0], 10) : 0;
    return valB - valA;
  });

  const sortedEducation = [...(data.education || [])].sort((a, b) => {
    const yearA = (a.endYear || a.startYear || '').match(/(?:19|20)\d{2}/);
    const yearB = (b.endYear || b.startYear || '').match(/(?:19|20)\d{2}/);
    const valA = yearA ? parseInt(yearA[0], 10) : 0;
    const valB = yearB ? parseInt(yearB[0], 10) : 0;
    return valB - valA;
  });

  const hasCertificationsOrAchievements = (data.certifications && data.certifications.length > 0) || (data.achievements && data.achievements.length > 0);

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 font-sans selection:bg-blue-100">
      {/* Executive Header Banner */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {data.profileImage && (
              <div className="w-8 h-8 rounded-full overflow-hidden border border-slate-200 shrink-0">
                <img src={data.profileImage} alt={data.name} className="w-full h-full object-cover" />
              </div>
            )}
            <div>
              <h1 className="font-bold text-slate-900 text-lg tracking-tight">{data.name || 'Executive Portfolio'}</h1>
              <p className="text-xs text-slate-500 font-medium">{data.profession || 'Professional'}</p>
            </div>
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
        {/* 1. Hero / Executive Profile Card */}
        <section className="p-8 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
            <div className="flex items-center gap-5">
              {data.profileImage && (
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border border-slate-200 shadow-sm shrink-0">
                  <img src={data.profileImage} alt={data.name} className="w-full h-full object-cover" />
                </div>
              )}
              <div className="space-y-1.5">
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

          {/* Links */}
          <div className="flex flex-wrap items-center gap-4 pt-1">
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

        {/* 2. About Me */}
        {data.summary && (
          <section id="about" className="p-8 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-blue-700 font-bold text-sm uppercase tracking-wider">
              <User className="w-4 h-4" />
              <span>Executive Summary</span>
            </div>
            <p className="text-slate-700 leading-relaxed text-base">
              {data.summary}
            </p>
          </section>
        )}

        {/* 3. Skills: Core Competencies */}
        {data.skills?.length > 0 && (
          <section id="skills" className="p-8 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-6">
            <h2 className="text-lg font-bold text-slate-900">Core Competencies & Expertise</h2>

            <div className="space-y-4">
              {data.technicalSkills && data.technicalSkills.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Technical Proficiencies</span>
                  <div className="flex flex-wrap gap-2">
                    {data.technicalSkills.map((skill, i) => (
                      <span key={i} className="px-3.5 py-1.5 rounded-md text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {data.softSkills && data.softSkills.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Leadership & Strategic Skills</span>
                  <div className="flex flex-wrap gap-2">
                    {data.softSkills.map((skill, i) => (
                      <span key={i} className="px-3.5 py-1.5 rounded-md text-xs font-semibold bg-blue-50 text-blue-800 border border-blue-200">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {(!data.technicalSkills || data.technicalSkills.length === 0) && (!data.softSkills || data.softSkills.length === 0) && (
                <div className="flex flex-wrap gap-2">
                  {data.skills.map((skill, i) => (
                    <span key={i} className="px-3.5 py-1.5 rounded-md text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                      {skill}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}

        {/* 4. Work Experience */}
        {sortedExperience.length > 0 && (
          <section id="experience" className="space-y-6">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-xl">
              <Briefcase className="w-5 h-5 text-blue-700" />
              <h2>Professional Experience</h2>
            </div>

            <div className="space-y-4">
              {sortedExperience.map(exp => (
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

        {/* 5. Projects Section */}
        {data.projects?.length > 0 && (
          <section id="projects" className="space-y-6">
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

        {/* 6. Education */}
        {sortedEducation.length > 0 && (
          <section id="education" className="space-y-6">
            <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
                <GraduationCap className="w-4 h-4 text-blue-700" />
                <h3>Academic Credentials</h3>
              </div>
              <div className="space-y-3">
                {sortedEducation.map(edu => (
                  <div key={edu.id} className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 border-b border-slate-100 pb-3 last:border-b-0 last:pb-0">
                    <div className="space-y-0.5">
                      <h4 className="font-semibold text-slate-900 text-sm">{edu.degree}</h4>
                      <p className="text-xs text-slate-600">{edu.institution} {edu.location ? `• ${edu.location}` : ''}</p>
                      {edu.fieldOfStudy && <p className="text-xs text-blue-700 font-medium">{edu.fieldOfStudy}</p>}
                    </div>
                    <span className="text-xs text-slate-400 font-medium shrink-0">Graduation: {edu.endYear}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* 7. Certifications & Achievements */}
        {hasCertificationsOrAchievements && (
          <section id="certifications" className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {data.certifications && data.certifications.length > 0 && (
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

            {data.achievements && data.achievements.length > 0 && (
              <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-4">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <h3>Key Honors & Achievements</h3>
                </div>
                <div className="space-y-2.5">
                  {data.achievements.map((ach, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{ach}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}

        {/* 8. Contact Section */}
        <section id="contact" className="p-8 rounded-2xl bg-slate-900 text-white space-y-4 text-center">
          <h2 className="text-2xl font-bold">Direct Professional Inquiry</h2>
          <p className="text-slate-400 text-sm max-w-md mx-auto">
            Available for executive consulting, advisory, and full-time leadership opportunities.
          </p>
          <div className="pt-2">
            {data.email && (
              <a href={`mailto:${data.email}`} className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition">
                <Mail className="w-4 h-4" />
                Contact via Email
              </a>
            )}
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white py-8 text-center text-xs text-slate-500">
        <p>© {new Date().getFullYear()} {data.name || 'Executive'}. Confidential & verified portfolio.</p>
      </footer>
    </div>
  );
};
