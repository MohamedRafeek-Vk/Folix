import React from 'react';
import { PortfolioData } from '../types/portfolio';
import { Mail, MapPin, Phone, Github, Linkedin, Globe, Twitter, ArrowUpRight, Sparkles } from 'lucide-react';

export const MinimalTemplate: React.FC<{ data: PortfolioData }> = ({ data }) => {
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
    <div className="min-h-screen bg-[#fafafa] text-zinc-900 font-sans selection:bg-zinc-200">
      {/* Top Header */}
      <header className="border-b border-zinc-200/80 bg-white/80 backdrop-blur sticky top-0 z-20">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <a href="#" className="font-semibold text-lg tracking-tight text-zinc-900 hover:opacity-80 transition">
            {data.name || 'Portfolio'}
          </a>
          <nav className="flex items-center gap-6 text-sm text-zinc-600">
            {data.summary && <a href="#about" className="hover:text-zinc-950 transition">About</a>}
            {data.skills?.length > 0 && <a href="#skills" className="hover:text-zinc-950 transition">Skills</a>}
            {sortedExperience.length > 0 && <a href="#experience" className="hover:text-zinc-950 transition">Experience</a>}
            {data.projects?.length > 0 && <a href="#projects" className="hover:text-zinc-950 transition">Projects</a>}
            {sortedEducation.length > 0 && <a href="#education" className="hover:text-zinc-950 transition">Education</a>}
            {hasCertificationsOrAchievements && <a href="#certifications" className="hover:text-zinc-950 transition">Credentials</a>}
            <a href="#contact" className="px-3.5 py-1.5 rounded-full bg-zinc-900 text-white text-xs font-medium hover:bg-zinc-800 transition">
              Contact
            </a>
          </nav>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-16 space-y-20">
        {/* 1. Hero / Introduction */}
        <section className="space-y-6 pt-4">
          <div className="space-y-2">
            <span className="text-xs font-mono uppercase tracking-widest text-zinc-400">Personal Portfolio</span>
            <div className="flex flex-col sm:flex-row sm:items-center gap-5 pt-1">
              {data.profileImage && (
                <div className="w-20 h-20 rounded-full overflow-hidden border border-zinc-300 shrink-0 shadow-sm">
                  <img src={data.profileImage} alt={data.name} className="w-full h-full object-cover" />
                </div>
              )}
              <div>
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-zinc-950">
                  {data.name || 'Your Name'}
                </h1>
                <p className="text-xl md:text-2xl text-zinc-600 font-light mt-1">
                  {data.profession || 'Professional Title'}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-600 pt-2">
            {data.location && (
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-zinc-400" />
                {data.location}
              </span>
            )}
            {data.email && (
              <a href={`mailto:${data.email}`} className="inline-flex items-center gap-1.5 hover:text-zinc-950 transition">
                <Mail className="w-4 h-4 text-zinc-400" />
                {data.email}
              </a>
            )}
            {data.phone && (
              <span className="inline-flex items-center gap-1.5">
                <Phone className="w-4 h-4 text-zinc-400" />
                {data.phone}
              </span>
            )}
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-3 pt-2">
            {data.socialLinks?.github && (
              <a href={data.socialLinks.github} target="_blank" rel="noreferrer" className="p-2 rounded-full border border-zinc-200 hover:bg-zinc-100 text-zinc-700 transition" title="GitHub">
                <Github className="w-4 h-4" />
              </a>
            )}
            {data.socialLinks?.linkedin && (
              <a href={data.socialLinks.linkedin} target="_blank" rel="noreferrer" className="p-2 rounded-full border border-zinc-200 hover:bg-zinc-100 text-zinc-700 transition" title="LinkedIn">
                <Linkedin className="w-4 h-4" />
              </a>
            )}
            {data.socialLinks?.website && (
              <a href={data.socialLinks.website} target="_blank" rel="noreferrer" className="p-2 rounded-full border border-zinc-200 hover:bg-zinc-100 text-zinc-700 transition" title="Website">
                <Globe className="w-4 h-4" />
              </a>
            )}
            {data.socialLinks?.twitter && (
              <a href={data.socialLinks.twitter} target="_blank" rel="noreferrer" className="p-2 rounded-full border border-zinc-200 hover:bg-zinc-100 text-zinc-700 transition" title="Twitter">
                <Twitter className="w-4 h-4" />
              </a>
            )}
          </div>
        </section>

        {/* 2. About Me */}
        {data.summary && (
          <section id="about" className="space-y-4 pt-4 border-t border-zinc-200">
            <h2 className="text-xs font-mono uppercase tracking-widest text-zinc-400">About Me</h2>
            <p className="text-lg text-zinc-700 leading-relaxed font-normal">
              {data.summary}
            </p>
          </section>
        )}

        {/* 3. Skills */}
        {data.skills?.length > 0 && (
          <section id="skills" className="space-y-6 pt-4 border-t border-zinc-200">
            <h2 className="text-xs font-mono uppercase tracking-widest text-zinc-400">Skills & Expertise</h2>
            <div className="space-y-4">
              {data.technicalSkills && data.technicalSkills.length > 0 && (
                <div className="space-y-2">
                  <span className="text-xs text-zinc-500 font-mono">Technical</span>
                  <div className="flex flex-wrap gap-2">
                    {data.technicalSkills.map((skill, i) => (
                      <span key={i} className="px-3.5 py-1.5 rounded-full text-xs font-medium bg-white border border-zinc-200 text-zinc-800 shadow-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {data.softSkills && data.softSkills.length > 0 && (
                <div className="space-y-2 pt-2">
                  <span className="text-xs text-zinc-500 font-mono">Core Competencies</span>
                  <div className="flex flex-wrap gap-2">
                    {data.softSkills.map((skill, i) => (
                      <span key={i} className="px-3.5 py-1.5 rounded-full text-xs font-medium bg-zinc-100 border border-zinc-200 text-zinc-700">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {(!data.technicalSkills || data.technicalSkills.length === 0) && (!data.softSkills || data.softSkills.length === 0) && (
                <div className="flex flex-wrap gap-2">
                  {data.skills.map((skill, i) => (
                    <span key={i} className="px-3.5 py-1.5 rounded-full text-xs font-medium bg-white border border-zinc-200 text-zinc-800 shadow-sm">
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
          <section id="experience" className="space-y-8 pt-4 border-t border-zinc-200">
            <div className="flex items-baseline justify-between">
              <h2 className="text-xs font-mono uppercase tracking-widest text-zinc-400">Work Experience</h2>
              <span className="text-xs text-zinc-400 font-mono">{sortedExperience.length} Positions</span>
            </div>
            <div className="space-y-10">
              {sortedExperience.map(exp => (
                <div key={exp.id} className="space-y-3 group">
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                    <div>
                      <h3 className="text-lg font-semibold text-zinc-950 group-hover:text-zinc-700 transition">
                        {exp.role}
                      </h3>
                      <p className="text-sm text-zinc-600 font-medium">
                        {exp.company} {exp.location ? `• ${exp.location}` : ''}
                      </p>
                    </div>
                    <span className="text-xs font-mono text-zinc-400 shrink-0">
                      {exp.startDate} – {exp.endDate}
                    </span>
                  </div>
                  {exp.description && (
                    <p className="text-sm text-zinc-600 leading-relaxed">
                      {exp.description}
                    </p>
                  )}
                  {exp.highlights && exp.highlights.length > 0 && (
                    <ul className="space-y-1 pt-1">
                      {exp.highlights.map((h, i) => (
                        <li key={i} className="text-sm text-zinc-600 flex items-start gap-2">
                          <span className="text-zinc-400 mt-1.5 w-1.5 h-1.5 rounded-full bg-zinc-300 shrink-0" />
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 5. Projects Section */}
        {data.projects?.length > 0 && (
          <section id="projects" className="space-y-8 pt-4 border-t border-zinc-200">
            <div className="flex items-baseline justify-between">
              <h2 className="text-xs font-mono uppercase tracking-widest text-zinc-400">Selected Projects</h2>
              <span className="text-xs text-zinc-400 font-mono">{data.projects.length} Projects</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {data.projects.map(proj => (
                <div key={proj.id} className="p-6 rounded-2xl bg-white border border-zinc-200/80 hover:border-zinc-300 hover:shadow-sm transition flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold text-zinc-950 text-base">{proj.title}</h3>
                      {proj.link && (
                        <a href={proj.link} target="_blank" rel="noreferrer" className="text-zinc-400 hover:text-zinc-950 transition">
                          <ArrowUpRight className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                    <p className="text-sm text-zinc-600 leading-relaxed">
                      {proj.description}
                    </p>
                  </div>
                  {proj.technologies?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-4">
                      {proj.technologies.map((t, idx) => (
                        <span key={idx} className="text-xs px-2.5 py-0.5 rounded-md bg-zinc-100 text-zinc-600 font-mono">
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
          <section id="education" className="space-y-6 pt-4 border-t border-zinc-200">
            <div className="flex items-baseline justify-between">
              <h2 className="text-xs font-mono uppercase tracking-widest text-zinc-400">Education</h2>
              <span className="text-xs text-zinc-400 font-mono">{sortedEducation.length} Institutions</span>
            </div>
            <div className="space-y-6">
              {sortedEducation.map(edu => (
                <div key={edu.id} className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                  <div className="space-y-1">
                    <h3 className="font-medium text-zinc-900 text-base">{edu.degree}</h3>
                    <p className="text-sm text-zinc-600">{edu.institution} {edu.location ? `• ${edu.location}` : ''}</p>
                    {edu.fieldOfStudy && <p className="text-xs text-zinc-500">{edu.fieldOfStudy}</p>}
                  </div>
                  <span className="text-xs text-zinc-400 font-mono shrink-0">{edu.endYear}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 7. Certifications & Achievements */}
        {hasCertificationsOrAchievements && (
          <section id="certifications" className="space-y-6 pt-4 border-t border-zinc-200">
            <h2 className="text-xs font-mono uppercase tracking-widest text-zinc-400">Certifications & Achievements</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {data.certifications && data.certifications.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider font-mono">Certifications</h3>
                  <div className="space-y-3">
                    {data.certifications.map(c => (
                      <div key={c.id} className="space-y-1">
                        <h4 className="font-medium text-zinc-900 text-sm">{c.name}</h4>
                        <p className="text-xs text-zinc-600">{c.issuer} {c.date ? `• ${c.date}` : ''}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {data.achievements && data.achievements.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider font-mono">Key Achievements</h3>
                  <div className="space-y-2">
                    {data.achievements.map((ach, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-zinc-700">
                        <Sparkles className="w-3.5 h-3.5 text-zinc-400 shrink-0 mt-0.5" />
                        <span>{ach}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* 8. Contact CTA Section */}
        <section id="contact" className="p-8 rounded-3xl bg-zinc-900 text-white space-y-4">
          <span className="text-xs font-mono uppercase tracking-widest text-zinc-400">Get In Touch</span>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
            Interested in collaborating or discussing opportunities?
          </h2>
          <p className="text-sm text-zinc-400 max-w-lg">
            Feel free to reach out via email or connect on professional platforms.
          </p>
          <div className="pt-2">
            {data.email && (
              <a href={`mailto:${data.email}`} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-zinc-900 text-sm font-medium hover:bg-zinc-100 transition shadow-sm">
                <Mail className="w-4 h-4" />
                Send an Email
              </a>
            )}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-200 py-8 text-center text-xs text-zinc-500">
        <p>© {new Date().getFullYear()} {data.name || 'Portfolio'}. Generated with Folix.</p>
      </footer>
    </div>
  );
};
