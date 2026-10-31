import React from 'react';
import { PortfolioData } from '../types/portfolio';
import { Sparkles, Palette, ArrowUpRight, Mail, MapPin, Globe, Github, Linkedin, Twitter, Compass } from 'lucide-react';

export const CreativeTemplate: React.FC<{ data: PortfolioData }> = ({ data }) => {
  return (
    <div className="min-h-screen bg-[#121118] text-[#f4efe6] font-sans selection:bg-amber-400/30 selection:text-amber-200">
      {/* Decorative Warm Light Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-32 right-10 w-[500px] h-[500px] bg-gradient-to-br from-amber-600/20 via-rose-600/15 to-purple-800/10 rounded-full blur-[120px]" />
        <div className="absolute top-[800px] -left-20 w-[450px] h-[450px] bg-amber-500/10 rounded-full blur-[140px]" />
      </div>

      {/* Header */}
      <header className="relative z-20 border-b border-white/[0.08] bg-[#121118]/80 backdrop-blur-md sticky top-0">
        <div className="max-w-5xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-gradient-to-r from-amber-400 to-rose-400" />
            <span className="font-semibold tracking-wider uppercase text-xs text-amber-200/80 font-mono">
              {data.name || 'Studio'}
            </span>
          </div>

          <nav className="flex items-center gap-6 text-xs uppercase tracking-widest text-slate-300">
            {data.projects?.length > 0 && <a href="#work" className="hover:text-amber-300 transition">Work</a>}
            {data.experience?.length > 0 && <a href="#story" className="hover:text-amber-300 transition">Story</a>}
            <a href="#contact" className="px-4 py-2 rounded-full border border-amber-400/40 hover:bg-amber-400 hover:text-black transition duration-300 font-medium">
              Let's Talk
            </a>
          </nav>
        </div>
      </header>

      <main className="relative z-10 max-w-5xl mx-auto px-6 py-20 space-y-28">
        {/* Hero Section */}
        <section className="space-y-8 pt-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gradient-to-r from-amber-500/10 to-rose-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Creative Portfolio & Works</span>
          </div>

          <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight leading-[1.08] text-white">
            Crafting experiences at the intersection of <span className="italic font-serif font-normal bg-gradient-to-r from-amber-300 via-rose-300 to-amber-200 bg-clip-text text-transparent">design</span> and <span className="underline decoration-rose-500/50 underline-offset-8">technology</span>.
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-6 border-t border-white/[0.08]">
            <div>
              <p className="text-xs uppercase tracking-widest text-amber-300/70 font-mono">Creator</p>
              <h2 className="text-xl font-bold text-white mt-1">{data.name || 'Creative'}</h2>
              <p className="text-sm text-slate-400 mt-0.5">{data.profession || 'Designer & Art Director'}</p>
            </div>

            <div className="md:col-span-2">
              <p className="text-xs uppercase tracking-widest text-amber-300/70 font-mono">Philosophy</p>
              <p className="text-sm sm:text-base text-slate-300 mt-1 leading-relaxed">
                {data.summary || 'Designing meaningful digital products and brands that blend beauty, empathy, and seamless functionality.'}
              </p>
            </div>
          </div>

          {/* Location & Socials */}
          <div className="flex flex-wrap items-center gap-6 pt-2 text-xs font-mono text-slate-400">
            {data.location && (
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-amber-400" />
                {data.location}
              </span>
            )}
            {data.email && (
              <a href={`mailto:${data.email}`} className="flex items-center gap-1.5 hover:text-amber-300 transition">
                <Mail className="w-4 h-4 text-amber-400" />
                {data.email}
              </a>
            )}
            <div className="flex items-center gap-3 ml-auto">
              {data.socialLinks?.github && (
                <a href={data.socialLinks.github} target="_blank" rel="noreferrer" className="hover:text-amber-300 transition">
                  <Github className="w-4 h-4" />
                </a>
              )}
              {data.socialLinks?.linkedin && (
                <a href={data.socialLinks.linkedin} target="_blank" rel="noreferrer" className="hover:text-amber-300 transition">
                  <Linkedin className="w-4 h-4" />
                </a>
              )}
              {data.socialLinks?.twitter && (
                <a href={data.socialLinks.twitter} target="_blank" rel="noreferrer" className="hover:text-amber-300 transition">
                  <Twitter className="w-4 h-4" />
                </a>
              )}
              {data.socialLinks?.website && (
                <a href={data.socialLinks.website} target="_blank" rel="noreferrer" className="hover:text-amber-300 transition">
                  <Globe className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        </section>

        {/* Selected Works Gallery */}
        {data.projects?.length > 0 && (
          <section id="work" className="space-y-8">
            <div className="flex items-end justify-between border-b border-white/[0.08] pb-4">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-amber-300/70">Selected Showcase</span>
                <h2 className="text-3xl sm:text-4xl font-bold text-white mt-1">Featured Works</h2>
              </div>
              <span className="text-xs font-mono text-slate-400">{data.projects.length} artifacts</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {data.projects.map((proj, idx) => (
                <div key={proj.id} className="group relative p-8 rounded-3xl bg-white/[0.03] border border-white/[0.08] hover:border-amber-400/40 transition duration-500 flex flex-col justify-between overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-amber-500/10 to-transparent rounded-bl-full pointer-events-none" />

                  <div className="space-y-4">
                    <span className="text-xs font-mono text-amber-400/80">0{idx + 1} // Project</span>
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-2xl font-bold text-white group-hover:text-amber-300 transition">
                        {proj.title}
                      </h3>
                      {proj.link && (
                        <a href={proj.link} target="_blank" rel="noreferrer" className="p-2 rounded-full border border-white/[0.1] group-hover:border-amber-400 group-hover:bg-amber-400 group-hover:text-black transition">
                          <ArrowUpRight className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                    <p className="text-sm text-slate-300 leading-relaxed">
                      {proj.description}
                    </p>
                  </div>

                  {proj.technologies?.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-6">
                      {proj.technologies.map((tech, i) => (
                        <span key={i} className="text-xs px-3 py-1 rounded-full bg-white/[0.05] border border-white/[0.08] text-slate-300">
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Experience Story */}
        {data.experience?.length > 0 && (
          <section id="story" className="space-y-8">
            <div className="border-b border-white/[0.08] pb-4">
              <span className="text-xs font-mono uppercase tracking-widest text-rose-300/70">The Journey</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mt-1">Creative Experience</h2>
            </div>

            <div className="space-y-6">
              {data.experience.map(exp => (
                <div key={exp.id} className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.04] transition space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <h3 className="text-xl font-bold text-white">{exp.role}</h3>
                    <span className="text-xs font-mono text-amber-300/80">{exp.startDate} – {exp.endDate}</span>
                  </div>
                  <p className="text-sm font-medium text-slate-400">{exp.company} {exp.location ? `• ${exp.location}` : ''}</p>
                  {exp.description && (
                    <p className="text-sm text-slate-300 leading-relaxed">{exp.description}</p>
                  )}
                  {exp.highlights && exp.highlights.length > 0 && (
                    <ul className="space-y-1 pt-1">
                      {exp.highlights.map((h, i) => (
                        <li key={i} className="text-sm text-slate-400 flex items-start gap-2">
                          <span className="text-amber-400 mt-1">✦</span>
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

        {/* Creative Toolkit / Skills */}
        {data.skills?.length > 0 && (
          <section className="space-y-6">
            <span className="text-xs font-mono uppercase tracking-widest text-amber-300/70">Creative Toolkit</span>
            <div className="flex flex-wrap gap-2.5">
              {data.skills.map((skill, i) => (
                <span key={i} className="px-4 py-2 rounded-2xl text-xs font-medium bg-white/[0.04] border border-white/[0.08] hover:border-amber-400/50 hover:bg-amber-400/10 text-slate-200 transition">
                  {skill}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Contact Banner */}
        <section id="contact" className="p-10 sm:p-14 rounded-3xl bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-purple-500/10 border border-amber-500/20 text-center space-y-6">
          <Palette className="w-8 h-8 text-amber-400 mx-auto" />
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white">Let's create something memorable.</h2>
          <p className="text-slate-300 max-w-lg mx-auto text-sm">
            Always open to visionary design commissions, leadership opportunities, and thoughtful conversations.
          </p>
          <div className="pt-2">
            {data.email && (
              <a href={`mailto:${data.email}`} className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-amber-400 hover:bg-amber-300 text-black font-semibold shadow-lg shadow-amber-400/20 transition">
                <Mail className="w-4 h-4" />
                Say Hello
              </a>
            )}
          </div>
        </section>
      </main>

      <footer className="relative z-10 border-t border-white/[0.08] py-8 text-center text-xs text-slate-500 font-mono">
        <p>© {new Date().getFullYear()} {data.name || 'Creative'}. Generated via PortfolioAI.</p>
      </footer>
    </div>
  );
};
