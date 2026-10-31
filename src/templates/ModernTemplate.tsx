import React from 'react';
import { PortfolioData } from '../types/portfolio';
import { Mail, MapPin, Phone, Github, Linkedin, Globe, Twitter, ArrowUpRight, Sparkles, Briefcase, GraduationCap, Award, Code2 } from 'lucide-react';

export const ModernTemplate: React.FC<{ data: PortfolioData }> = ({ data }) => {
  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Background ambient lighting */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-tr from-indigo-600/20 via-purple-600/15 to-pink-500/10 blur-[130px] rounded-full" />
        <div className="absolute top-[600px] -left-40 w-[500px] h-[500px] bg-indigo-600/10 blur-[150px] rounded-full" />
      </div>

      {/* Modern Navigation */}
      <header className="relative z-20 border-b border-white/[0.06] bg-[#090d16]/70 backdrop-blur-xl sticky top-0">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-indigo-500/20">
              {data.name?.charAt(0) || 'P'}
            </div>
            <span className="font-semibold tracking-tight text-white">{data.name || 'Portfolio'}</span>
          </div>
          <nav className="hidden sm:flex items-center gap-6 text-sm text-slate-400">
            {data.summary && <a href="#about" className="hover:text-white transition">About</a>}
            {data.experience?.length > 0 && <a href="#experience" className="hover:text-white transition">Experience</a>}
            {data.projects?.length > 0 && <a href="#projects" className="hover:text-white transition">Projects</a>}
            {data.skills?.length > 0 && <a href="#skills" className="hover:text-white transition">Skills</a>}
            <a href="#contact" className="px-4 py-1.5 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium shadow-md shadow-indigo-600/30 transition">
              Get in Touch
            </a>
          </nav>
        </div>
      </header>

      <main className="relative z-10 max-w-5xl mx-auto px-6 py-16 space-y-24">
        {/* Hero Section */}
        <section className="space-y-6 pt-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Available for new opportunities
          </div>

          <div className="space-y-3">
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
              Hi, I'm <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">{data.name || 'Developer'}</span>
            </h1>
            <p className="text-xl sm:text-2xl text-slate-300 font-medium">
              {data.profession || 'Full Stack Engineer & Builder'}
            </p>
          </div>

          {data.summary && (
            <p className="text-base sm:text-lg text-slate-400 max-w-2xl leading-relaxed">
              {data.summary}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-6 pt-2 text-sm text-slate-400">
            {data.location && (
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-indigo-400" />
                <span>{data.location}</span>
              </div>
            )}
            {data.email && (
              <a href={`mailto:${data.email}`} className="flex items-center gap-2 hover:text-white transition">
                <Mail className="w-4 h-4 text-indigo-400" />
                <span>{data.email}</span>
              </a>
            )}
            {data.phone && (
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-indigo-400" />
                <span>{data.phone}</span>
              </div>
            )}
          </div>

          {/* Social Row */}
          <div className="flex items-center gap-3 pt-2">
            {data.socialLinks?.github && (
              <a href={data.socialLinks.github} target="_blank" rel="noreferrer" className="p-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:border-indigo-500/50 hover:bg-white/[0.08] text-slate-300 hover:text-white transition">
                <Github className="w-4 h-4" />
              </a>
            )}
            {data.socialLinks?.linkedin && (
              <a href={data.socialLinks.linkedin} target="_blank" rel="noreferrer" className="p-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:border-indigo-500/50 hover:bg-white/[0.08] text-slate-300 hover:text-white transition">
                <Linkedin className="w-4 h-4" />
              </a>
            )}
            {data.socialLinks?.website && (
              <a href={data.socialLinks.website} target="_blank" rel="noreferrer" className="p-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:border-indigo-500/50 hover:bg-white/[0.08] text-slate-300 hover:text-white transition">
                <Globe className="w-4 h-4" />
              </a>
            )}
            {data.socialLinks?.twitter && (
              <a href={data.socialLinks.twitter} target="_blank" rel="noreferrer" className="p-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:border-indigo-500/50 hover:bg-white/[0.08] text-slate-300 hover:text-white transition">
                <Twitter className="w-4 h-4" />
              </a>
            )}
          </div>
        </section>

        {/* Experience Section */}
        {data.experience?.length > 0 && (
          <section id="experience" className="space-y-6">
            <div className="flex items-center gap-2 text-indigo-400 font-mono text-xs uppercase tracking-wider">
              <Briefcase className="w-4 h-4" />
              <span>Career Journey</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Work Experience</h2>

            <div className="space-y-4">
              {data.experience.map(exp => (
                <div key={exp.id} className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.12] transition-all duration-300 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h3 className="text-lg font-semibold text-white">{exp.role}</h3>
                      <p className="text-sm text-indigo-300 font-medium">
                        {exp.company} {exp.location ? `• ${exp.location}` : ''}
                      </p>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-mono bg-white/[0.05] border border-white/[0.08] text-slate-400 w-fit">
                      {exp.startDate} – {exp.endDate}
                    </span>
                  </div>
                  {exp.description && (
                    <p className="text-sm text-slate-400 leading-relaxed">{exp.description}</p>
                  )}
                  {exp.highlights && exp.highlights.length > 0 && (
                    <div className="space-y-1.5 pt-1">
                      {exp.highlights.map((h, i) => (
                        <div key={i} className="flex items-start gap-2 text-sm text-slate-400">
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 shrink-0" />
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

        {/* Projects Showcase */}
        {data.projects?.length > 0 && (
          <section id="projects" className="space-y-6">
            <div className="flex items-center gap-2 text-purple-400 font-mono text-xs uppercase tracking-wider">
              <Code2 className="w-4 h-4" />
              <span>Featured Works</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Key Projects</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {data.projects.map(proj => (
                <div key={proj.id} className="group p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-indigo-500/40 hover:bg-white/[0.04] transition-all duration-300 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition">
                        {proj.title}
                      </h3>
                      {proj.link && (
                        <a href={proj.link} target="_blank" rel="noreferrer" className="p-2 rounded-lg bg-white/[0.05] hover:bg-indigo-600 text-slate-300 hover:text-white transition">
                          <ArrowUpRight className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                    <p className="text-sm text-slate-400 leading-relaxed">{proj.description}</p>
                  </div>
                  {proj.technologies?.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-6">
                      {proj.technologies.map((t, i) => (
                        <span key={i} className="px-2.5 py-1 rounded-md text-xs font-mono bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
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

        {/* Skills Section */}
        {data.skills?.length > 0 && (
          <section id="skills" className="space-y-6">
            <div className="flex items-center gap-2 text-pink-400 font-mono text-xs uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>Capabilities</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Technical Skills</h2>

            <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
              <div className="flex flex-wrap gap-2.5">
                {data.skills.map((skill, i) => (
                  <span key={i} className="px-3.5 py-1.5 rounded-lg text-xs font-medium bg-white/[0.05] border border-white/[0.08] hover:border-indigo-500/50 hover:bg-indigo-500/10 text-slate-200 transition">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Education & Credentials */}
        {(data.education?.length > 0 || data.certifications?.length > 0) && (
          <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {data.education?.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-indigo-400 font-mono text-xs uppercase tracking-wider">
                  <GraduationCap className="w-4 h-4" />
                  <span>Education</span>
                </div>
                <div className="space-y-3">
                  {data.education.map(edu => (
                    <div key={edu.id} className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-1">
                      <h4 className="font-semibold text-white text-sm">{edu.degree}</h4>
                      <p className="text-xs text-slate-400">{edu.institution} {edu.location ? `• ${edu.location}` : ''}</p>
                      <span className="text-xs font-mono text-indigo-400">{edu.endYear}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {data.certifications?.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-purple-400 font-mono text-xs uppercase tracking-wider">
                  <Award className="w-4 h-4" />
                  <span>Certifications</span>
                </div>
                <div className="space-y-3">
                  {data.certifications.map(c => (
                    <div key={c.id} className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-1">
                      <h4 className="font-semibold text-white text-sm">{c.name}</h4>
                      <p className="text-xs text-slate-400">{c.issuer}</p>
                      <span className="text-xs font-mono text-purple-400">{c.date}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}

        {/* Contact Banner */}
        <section id="contact" className="relative overflow-hidden p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-indigo-900/40 via-purple-900/30 to-slate-900/40 border border-indigo-500/20 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-bold text-white">Let's Build Something Great</h2>
          <p className="text-slate-400 max-w-lg mx-auto text-sm sm:text-base">
            Have a project in mind, need architecture consulting, or looking for an impactful addition to your team?
          </p>
          <div className="pt-2">
            {data.email && (
              <a href={`mailto:${data.email}`} className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium shadow-lg shadow-indigo-600/30 transition">
                <Mail className="w-4 h-4" />
                Say Hello at {data.email}
              </a>
            )}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/[0.06] py-8 text-center text-xs text-slate-500">
        <p>© {new Date().getFullYear()} {data.name || 'Portfolio'}. Powered by PortfolioAI.</p>
      </footer>
    </div>
  );
};
