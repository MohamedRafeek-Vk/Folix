import React from 'react';
import { PortfolioData } from '../types/portfolio';
import { Terminal, GitBranch, GitCommit, GitFork, Star, Mail, MapPin, Phone, Github, Linkedin, Globe, ExternalLink } from 'lucide-react';

export const DeveloperTemplate: React.FC<{ data: PortfolioData }> = ({ data }) => {
  return (
    <div className="min-h-screen bg-[#0d1117] text-[#c9d1d9] font-mono selection:bg-[#58a6ff]/30 selection:text-[#58a6ff]">
      {/* Top Terminal Bar */}
      <header className="border-b border-[#30363d] bg-[#161b22]/90 backdrop-blur sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#ff5f56]" />
              <span className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
              <span className="w-3 h-3 rounded-full bg-[#27c93f]" />
            </div>
            <span className="text-xs text-[#8b949e]">~/{data.slug || 'user'}/portfolio.sh</span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            {data.socialLinks?.github && (
              <a href={data.socialLinks.github} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-[#8b949e] hover:text-[#58a6ff] transition">
                <Github className="w-3.5 h-3.5" />
                <span>GitHub</span>
              </a>
            )}
            {data.email && (
              <a href={`mailto:${data.email}`} className="px-2.5 py-1 rounded bg-[#238636] hover:bg-[#2ea043] text-white text-xs font-semibold transition">
                Contact
              </a>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12 space-y-16">
        {/* Terminal Hero */}
        <section className="p-6 rounded-lg bg-[#161b22] border border-[#30363d] shadow-xl space-y-4">
          <div className="text-xs text-[#8b949e] flex items-center gap-2">
            <Terminal className="w-4 h-4 text-[#58a6ff]" />
            <span>bash - 80x24</span>
          </div>

          <div className="space-y-3 font-mono text-sm leading-relaxed">
            <p>
              <span className="text-[#7ee787]">dev@portfolio</span>:<span className="text-[#58a6ff]">~</span>$ whoami
            </p>
            <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
              {data.name || 'Developer'}
            </h1>
            <p className="text-[#a5d6ff]">
              &gt; {data.profession || 'Software Engineer'}
            </p>

            {data.summary && (
              <div className="pt-2 text-[#8b949e] border-l-2 border-[#30363d] pl-4 italic">
                {data.summary}
              </div>
            )}

            <div className="pt-3 flex flex-wrap gap-x-6 gap-y-2 text-xs text-[#8b949e]">
              {data.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#58a6ff]" />
                  {data.location}
                </span>
              )}
              {data.email && (
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-[#58a6ff]" />
                  {data.email}
                </span>
              )}
              {data.phone && (
                <span className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-[#58a6ff]" />
                  {data.phone}
                </span>
              )}
            </div>
          </div>
        </section>

        {/* Skills: Tree command */}
        {data.skills?.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-[#7ee787]">
              <span>$ tree ./tech-stack --depth=1</span>
            </div>
            <div className="p-5 rounded-lg bg-[#161b22] border border-[#30363d]">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {data.skills.map((skill, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs p-2 rounded bg-[#0d1117] border border-[#30363d]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#58a6ff]" />
                    <span className="text-[#c9d1d9] truncate">{skill}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Projects: Repositories */}
        {data.projects?.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-[#7ee787]">$ gh repo list --visibility=public</span>
              <span className="text-xs text-[#8b949e]">{data.projects.length} repositories</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.projects.map(proj => (
                <div key={proj.id} className="p-5 rounded-lg bg-[#161b22] border border-[#30363d] hover:border-[#58a6ff] transition flex flex-col justify-between space-y-3">
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2 text-[#58a6ff] font-semibold text-sm">
                        <GitBranch className="w-4 h-4 shrink-0" />
                        <span className="hover:underline cursor-pointer">{proj.title}</span>
                      </div>
                      <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-[#21262d] text-[#8b949e] border border-[#30363d]">
                        Public
                      </span>
                    </div>
                    <p className="text-xs text-[#8b949e] leading-relaxed">
                      {proj.description}
                    </p>
                  </div>

                  <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-[#21262d] text-xs text-[#8b949e]">
                    <div className="flex flex-wrap gap-1.5">
                      {proj.technologies?.map((tech, idx) => (
                        <span key={idx} className="text-[11px] text-[#a5d6ff]">
                          #{tech}
                        </span>
                      ))}
                    </div>
                    {proj.link && (
                      <a href={proj.link} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-[#58a6ff] hover:underline">
                        <span>deploy</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Experience: Git Log format */}
        {data.experience?.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-[#7ee787]">
              <span>$ git log --oneline --graph --decorate</span>
            </div>

            <div className="p-6 rounded-lg bg-[#161b22] border border-[#30363d] space-y-6">
              {data.experience.map((exp, idx) => (
                <div key={exp.id} className="relative pl-6 border-l-2 border-[#30363d] space-y-2">
                  <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-[#161b22] border-2 border-[#58a6ff] flex items-center justify-center">
                    <GitCommit className="w-2.5 h-2.5 text-[#58a6ff]" />
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[#d2a8ff] text-xs font-mono">commit {exp.id.slice(-6) || '7b3d1f'}</span>
                      <h3 className="text-sm font-bold text-white">{exp.role}</h3>
                      <span className="text-xs text-[#7ee787]">@ {exp.company}</span>
                    </div>
                    <span className="text-xs text-[#8b949e] font-mono">{exp.startDate}..{exp.endDate}</span>
                  </div>

                  {exp.description && (
                    <p className="text-xs text-[#8b949e] leading-relaxed pt-1">
                      {exp.description}
                    </p>
                  )}

                  {exp.highlights && exp.highlights.length > 0 && (
                    <div className="space-y-1 pt-1">
                      {exp.highlights.map((h, i) => (
                        <div key={i} className="text-xs text-[#8b949e] flex items-start gap-1.5">
                          <span className="text-[#58a6ff]">+</span>
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

        {/* Education & Certs */}
        {(data.education?.length > 0 || data.certifications?.length > 0) && (
          <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.education?.length > 0 && (
              <div className="p-5 rounded-lg bg-[#161b22] border border-[#30363d] space-y-3">
                <div className="text-xs text-[#7ee787]">$ cat ./education.json</div>
                <div className="space-y-3">
                  {data.education.map(edu => (
                    <div key={edu.id} className="text-xs space-y-0.5">
                      <p className="font-semibold text-white">{edu.degree}</p>
                      <p className="text-[#8b949e]">{edu.institution} ({edu.endYear})</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {data.certifications?.length > 0 && (
              <div className="p-5 rounded-lg bg-[#161b22] border border-[#30363d] space-y-3">
                <div className="text-xs text-[#7ee787]">$ gpg --list-keys --certifications</div>
                <div className="space-y-3">
                  {data.certifications.map(c => (
                    <div key={c.id} className="text-xs space-y-0.5">
                      <p className="font-semibold text-white">{c.name}</p>
                      <p className="text-[#8b949e]">{c.issuer} • {c.date}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}
      </main>

      {/* Terminal Footer */}
      <footer className="border-t border-[#30363d] py-6 text-center text-xs text-[#8b949e]">
        <p>exit 0 • Built with PortfolioAI</p>
      </footer>
    </div>
  );
};
