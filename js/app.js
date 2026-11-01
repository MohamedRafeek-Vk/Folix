// Folix - Instant Portfolio Generator Engine
// Zero-dependency, client-side, 100% responsive, beautiful SaaS UI

// ==========================================
// 1. Storage Helpers
// ==========================================
const STORAGE_KEY = 'folix_portfolios';

function getAllPortfolios() {
  try {
    let raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // Backward compatibility with legacy key
      raw = localStorage.getItem('portfolioai_portfolios');
    }
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    console.error('Failed reading localStorage', e);
    return {};
  }
}

function getPortfolioBySlug(slug) {
  if (!slug) return null;
  const all = getAllPortfolios();
  return all[slug.toLowerCase().trim()] || null;
}

function savePortfolio(data) {
  try {
    const cleanSlug = sanitizeSlug(data.slug || 'portfolio');
    const all = getAllPortfolios();
    const isOverwrite = !!all[cleanSlug];
    
    const record = {
      ...data,
      slug: cleanSlug,
      publishedAt: isOverwrite ? (all[cleanSlug].publishedAt || new Date().toISOString()) : new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    all[cleanSlug] = record;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
    return { success: true, overwritten: isOverwrite, slug: cleanSlug };
  } catch (e) {
    console.error('Failed saving portfolio', e);
    return { success: false, overwritten: false, slug: '' };
  }
}

function deletePortfolio(slug) {
  try {
    const cleanSlug = slug.toLowerCase().trim();
    const all = getAllPortfolios();
    if (all[cleanSlug]) {
      delete all[cleanSlug];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
      return true;
    }
    return false;
  } catch (e) {
    return false;
  }
}

function sanitizeSlug(str) {
  return String(str || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '') || 'portfolio';
}

// ==========================================
// 2. Sample Resumes for Immediate 1-Click Testing
// ==========================================
const SAMPLE_RESUMES = {
  softwareEngineer: {
    name: "Mohamed Rafeek",
    profession: "Senior Full Stack & AI Engineer",
    summary: "Senior Full Stack Engineer with 6+ years of experience designing scalable microservices, real-time web applications, and AI-powered developer tools. Passionate about clean system architecture, high-throughput backend systems, and delightful UX.",
    email: "rafeek.dev@example.com",
    phone: "+1 (555) 349-2810",
    location: "San Francisco, CA",
    skills: [
      "TypeScript", "React", "Next.js", "Node.js", "Go", "Python",
      "PostgreSQL", "Redis", "Docker", "Kubernetes", "GraphQL", "Tailwind CSS",
      "AWS", "OpenAI API", "System Design", "CI/CD"
    ],
    socialLinks: {
      github: "https://github.com",
      linkedin: "https://linkedin.com",
      website: "https://rafeek.tech",
      twitter: "https://twitter.com",
      email: "rafeek.dev@example.com"
    },
    experience: [
      {
        id: "exp-1",
        role: "Lead Full Stack Engineer",
        company: "Veloce Cloud Systems",
        location: "San Francisco, CA",
        startDate: "2022",
        endDate: "Present",
        current: true,
        description: "Spearheaded the architecture of core collaborative analytics dashboard used by 120k+ daily developers. Improved p99 latency by 42% through query caching with Redis and optimistic UI updates.",
        highlights: [
          "Architected real-time WebSocket infrastructure handling 40,000 concurrent events",
          "Mentored a team of 8 engineers and introduced TypeScript strictness across 15 repositories",
          "Reduced cloud infrastructure costs by 28% through Docker container right-sizing"
        ]
      },
      {
        id: "exp-2",
        role: "Senior Software Engineer",
        company: "HyperScale Media",
        location: "Austin, TX",
        startDate: "2020",
        endDate: "2022",
        current: false,
        description: "Built scalable internal tools and automated media processing pipelines. Designed modern React component library and migrated legacy monolith services into decoupled Node.js microservices.",
        highlights: [
          "Developed distributed video transcoder pipeline processing 5TB+ daily media assets",
          "Created modular design system utilized across 4 customer-facing products"
        ]
      },
      {
        id: "exp-3",
        role: "Software Developer",
        company: "Nexus Labs",
        location: "Boston, MA",
        startDate: "2018",
        endDate: "2020",
        current: false,
        description: "Developed customer portal features, payment integrations with Stripe, and optimized PostgreSQL database queries for high transaction volumes.",
        highlights: [
          "Integrated Stripe Billing engine reducing customer churn by 14%",
          "Wrote automated end-to-end testing suites increasing test coverage to 91%"
        ]
      }
    ],
    education: [
      {
        id: "edu-1",
        degree: "B.S. in Computer Science",
        institution: "University of California, Berkeley",
        location: "Berkeley, CA",
        endYear: "2018"
      }
    ],
    projects: [
      {
        id: "proj-1",
        title: "OmniFlow AI Workflow Automation",
        description: "An open-source node-based automation engine that connects LLMs to API endpoints with sandboxed execution, real-time logging, and interactive flow canvas.",
        technologies: ["React", "TypeScript", "FastAPI", "Python", "Tailwind CSS"],
        link: "https://github.com",
        featured: true
      },
      {
        id: "proj-2",
        title: "HyperKV Distributed In-Memory Store",
        description: "Lightweight, persistent key-value store with Raft consensus, zero-allocation serialization, and sub-millisecond read latency.",
        technologies: ["Go", "Raft", "gRPC", "Docker"],
        link: "https://github.com",
        featured: true
      },
      {
        id: "proj-3",
        title: "DevMetrics CLI & GitHub Action",
        description: "Command-line diagnostic tool that visualizes PR review bottlenecks, code churn, and test flakiness across distributed teams.",
        technologies: ["Node.js", "TypeScript", "GitHub API", "Ink"],
        link: "https://github.com",
        featured: false
      }
    ],
    certifications: [
      {
        id: "cert-1",
        name: "AWS Certified Solutions Architect – Professional",
        issuer: "Amazon Web Services",
        date: "2023"
      },
      {
        id: "cert-2",
        name: "Certified Kubernetes Administrator (CKA)",
        issuer: "Cloud Native Computing Foundation",
        date: "2022"
      }
    ]
  },
  productDesigner: {
    name: "Elena Rostova",
    profession: "Principal Product & UX Designer",
    summary: "Human-centered Product Designer with 7+ years shaping complex enterprise software, mobile experiences, and modern design systems. Focused on elevating usability through data-backed design, rapid prototyping, and polished micro-interactions.",
    email: "elena.design@example.com",
    phone: "+1 (555) 782-9901",
    location: "New York, NY",
    skills: [
      "Product Strategy", "Figma", "Design Systems", "UI Prototyping",
      "User Research", "Wireframing", "Interaction Design", "Usability Testing",
      "Information Architecture", "HTML/CSS", "Design Tokens", "Framer"
    ],
    socialLinks: {
      github: "https://github.com",
      linkedin: "https://linkedin.com",
      website: "https://elenarostova.design",
      twitter: "https://twitter.com",
      email: "elena.design@example.com"
    },
    experience: [
      {
        id: "exp-1",
        role: "Principal Product Designer",
        company: "Stratos Design Studio",
        location: "New York, NY",
        startDate: "2021",
        endDate: "Present",
        current: true,
        description: "Directing the end-to-end design lifecycle for flagship fintech B2B products. Established the company-wide design tokens library bridging Figma and React components.",
        highlights: [
          "Redesigned the portfolio dashboard resulting in a 38% increase in daily active user engagement",
          "Conducted 60+ user interviews uncovering key friction points in onboarding flows"
        ]
      },
      {
        id: "exp-2",
        role: "Senior UX Designer",
        company: "Aurora Health Tech",
        location: "Boston, MA",
        startDate: "2018",
        endDate: "2021",
        current: false,
        description: "Led patient portal UI redesign adhering to strict WCAG 2.1 AA accessibility guidelines. Partnered closely with clinical teams and mobile developers.",
        highlights: [
          "Decreased patient appointment scheduling drop-off by 29%",
          "Built interactive prototype tested across 12 medical facilities"
        ]
      }
    ],
    education: [
      {
        id: "edu-1",
        degree: "B.F.A. in Interaction Design",
        institution: "Rhode Island School of Design (RISD)",
        location: "Providence, RI",
        endYear: "2018"
      }
    ],
    projects: [
      {
        id: "proj-1",
        title: "Aura Design System",
        description: "A comprehensive open design system with 200+ accessible components, dark/light themes, typography scales, and interactive Figma UI kit.",
        technologies: ["Figma", "Design Tokens", "Framer", "React"],
        link: "https://figma.com",
        featured: true
      },
      {
        id: "proj-2",
        title: "FinPulse Mobile Wealth Manager",
        description: "Personal investment iOS app focused on emotional financial wellness, automated budget goals, and intuitive wealth allocation charts.",
        technologies: ["iOS", "Figma", "Protopie", "User Research"],
        link: "https://apple.com",
        featured: true
      }
    ],
    certifications: [
      {
        id: "cert-1",
        name: "Nielsen Norman Group UX Master Certified",
        issuer: "NN/g",
        date: "2022"
      }
    ]
  }
};

// ==========================================
// 3. Client-Side Resume Extraction Engine
// ==========================================
async function extractTextFromFile(file) {
  const ext = file.name.split('.').pop().toLowerCase();
  
  if (ext === 'docx') {
    // Read raw docx text by parsing document.xml or text nodes
    const buffer = await file.arrayBuffer();
    const decoder = new TextDecoder('utf-8', { fatal: false });
    const content = decoder.decode(buffer);
    
    // Extract XML text tags <w:t>...</w:t> or <w:t xml:space="preserve">...</w:t>
    const matches = content.match(/<w:t[^>]*>(.*?)<\/w:t>/g);
    if (matches && matches.length > 0) {
      return matches.map(m => m.replace(/<\/?[^>]+(>|$)/g, '')).join(' ');
    }
    
    // Fallback regex for clean text chunks inside binary
    const words = content.match(/[A-Za-z0-9@.,:\-\(\)\s]{4,}/g);
    return words ? words.join(' ') : content;
  } else if (ext === 'pdf') {
    // Parse PDF text streams directly
    const buffer = await file.arrayBuffer();
    const decoder = new TextDecoder('latin1');
    const content = decoder.decode(buffer);
    
    // Extract text in parentheses (text) Tj or [(text)] TJ
    const textPieces = [];
    const textMatches = content.match(/\(([^()]{2,})\)\s*Tj/g) || [];
    for (const m of textMatches) {
      const clean = m.replace(/^\(/, '').replace(/\)\s*Tj$/, '').trim();
      if (clean && !/^[\\\/\d]+$/.test(clean)) {
        textPieces.push(clean);
      }
    }
    
    // Also look for bracketed TJ arrays: [ (Mohamed) 20 (Rafeek) ] TJ
    const arrayMatches = content.match(/\[([^\[\]]+)\]\s*TJ/g) || [];
    for (const arr of arrayMatches) {
      const inner = arr.match(/\(([^()]+)\)/g) || [];
      const joined = inner.map(i => i.slice(1, -1)).join(' ');
      if (joined) textPieces.push(joined);
    }
    
    if (textPieces.length > 5) {
      return textPieces.join('\n');
    }
    
    // Fallback: extract legible printable strings
    const readable = content.match(/[A-Za-z0-9@.,:\-\/+\(\)\s]{4,}/g);
    return readable ? readable.filter(s => /[a-zA-Z]{3,}/.test(s)).join('\n') : '';
  } else {
    // Plain text or markdown
    return await file.text();
  }
}

function parseResumeText(rawText) {
  if (!rawText) return {};
  
  const lines = rawText
    .split(/\r?\n/)
    .map(l => l.trim())
    .filter(l => l.length > 0);
    
  // 1. Email Regex
  const emailMatch = rawText.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/i);
  const email = emailMatch ? emailMatch[1].trim() : '';
  
  // 2. Phone Regex
  const phoneMatch = rawText.match(/(?:(?:\+?1\s*(?:[.-]\s*)?)?(?:\(\s*([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9])\s*\)|([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9]))\s*(?:[.-]\s*)?)?([2-9]1[02-9]|[2-9][02-9]1|[2-9][02-9]{2})\s*(?:[.-]\s*)?([0-9]{4})/i)
    || rawText.match(/(\+?\d{1,3}[-.\s]?)?(\(?\d{3}\)?[-.\s]?)?\d{3}[-.\s]?\d{4}/);
  const phone = phoneMatch && phoneMatch[0].length >= 10 ? phoneMatch[0].trim() : '';
  
  // 3. Social Links
  const socialLinks = {};
  if (email) socialLinks.email = email;
  
  const githubMatch = rawText.match(/(?:https?:\/\/)?(?:www\.)?github\.com\/([a-zA-Z0-9_-]+)/i);
  if (githubMatch) socialLinks.github = githubMatch[0].startsWith('http') ? githubMatch[0] : `https://${githubMatch[0]}`;
  
  const linkedinMatch = rawText.match(/(?:https?:\/\/)?(?:www\.)?linkedin\.com\/(?:in|pub)\/([a-zA-Z0-9_-]+)/i);
  if (linkedinMatch) socialLinks.linkedin = linkedinMatch[0].startsWith('http') ? linkedinMatch[0] : `https://${linkedinMatch[0]}`;
  
  const twitterMatch = rawText.match(/(?:https?:\/\/)?(?:www\.)?(?:twitter\.com|x\.com)\/([a-zA-Z0-9_]+)/i);
  if (twitterMatch) socialLinks.twitter = twitterMatch[0].startsWith('http') ? twitterMatch[0] : `https://${twitterMatch[0]}`;
  
  const websiteMatch = rawText.match(/(?:https?:\/\/)?([a-zA-Z0-9.-]+\.(?:com|org|net|io|tech|dev|me|design|ai))(?:\/[^\s]*)?/i);
  if (websiteMatch && !websiteMatch[0].includes('github') && !websiteMatch[0].includes('linkedin') && !websiteMatch[0].includes('twitter')) {
    socialLinks.website = websiteMatch[0].startsWith('http') ? websiteMatch[0] : `https://${websiteMatch[0]}`;
  }
  
  // 4. Name Extraction
  let name = '';
  const blacklistHeaders = ['curriculum vitae', 'resume', 'cv', 'contact', 'email', 'phone', 'portfolio', 'page 1', 'skills', 'experience'];
  for (let i = 0; i < Math.min(lines.length, 8); i++) {
    const line = lines[i].replace(/[|•,]/g, '').trim();
    const lower = line.toLowerCase();
    if (
      !blacklistHeaders.some(h => lower.includes(h)) &&
      !line.includes('@') &&
      !line.includes('http') &&
      !/\d{3}/.test(line) &&
      line.length >= 3 &&
      line.length <= 40 &&
      /^[a-zA-Z\s.'-]+$/.test(line)
    ) {
      name = line;
      break;
    }
  }
  
  // 5. Profession / Title
  let profession = '';
  const commonTitles = [
    'Senior Full Stack & AI Engineer', 'Full Stack Developer', 'Software Engineer',
    'Frontend Developer', 'Backend Developer', 'Principal Product Designer',
    'UI/UX Designer', 'Product Designer', 'Data Scientist', 'Machine Learning Engineer',
    'DevOps Engineer', 'Cloud Architect', 'Solutions Architect', 'Mobile Developer'
  ];
  for (const t of commonTitles) {
    if (rawText.toLowerCase().includes(t.toLowerCase())) {
      profession = t;
      break;
    }
  }
  if (!profession && lines.length > 1) {
    for (let i = 0; i < Math.min(lines.length, 6); i++) {
      if (lines[i] === name && lines[i + 1]) {
        const next = lines[i + 1].trim();
        if (!next.includes('@') && !next.includes('http') && next.length < 50) {
          profession = next;
        }
        break;
      }
    }
  }
  
  // 6. Location
  let location = '';
  const locMatch = rawText.match(/([A-Z][a-zA-Z\s.-]+,\s*[A-Z]{2}(?:\s+\d{5})?|[A-Z][a-zA-Z\s.-]+,\s*(?:United States|Canada|United Kingdom|Germany|India|Australia|France|Remote))/);
  if (locMatch) {
    location = locMatch[0].trim();
  }
  
  // 7. Summary
  let summary = '';
  const summaryMatch = rawText.match(/(?:summary|about|profile|overview)[:\s\n]+([^]{40,400}?)(?=\n\s*(?:experience|education|skills|projects|work)|$)/i);
  if (summaryMatch && summaryMatch[1]) {
    summary = summaryMatch[1].replace(/\s+/g, ' ').trim();
  } else {
    for (let i = 0; i < Math.min(lines.length, 12); i++) {
      const line = lines[i];
      if (line.length > 70 && !line.includes('@') && !line.includes('http') && !line.includes('---')) {
        summary = line;
        break;
      }
    }
  }
  
  // 8. Skills
  const skills = [];
  const skillKeywords = [
    "JavaScript", "TypeScript", "React", "Next.js", "Vue", "Angular", "Node.js", "Python",
    "Go", "Java", "C++", "C#", "Rust", "SQL", "PostgreSQL", "MongoDB", "Redis", "Docker",
    "Kubernetes", "AWS", "GCP", "Azure", "GraphQL", "Tailwind CSS", "HTML5", "CSS3",
    "Git", "CI/CD", "Figma", "UI/UX", "Product Design", "System Design", "Microservices"
  ];
  for (const sk of skillKeywords) {
    const regex = new RegExp(`\\b${sk.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
    if (regex.test(rawText) && !skills.includes(sk)) {
      skills.push(sk);
    }
  }
  
  // 9. Work Experience & Education & Projects
  const experience = [];
  const expMatch = rawText.match(/(?:experience|work history|employment)[:\s\n]+([^]{50,1500}?)(?=\n\s*(?:education|skills|projects|certifications)|$)/i);
  if (expMatch && expMatch[1]) {
    const chunks = expMatch[1].split(/\n{2,}|\n(?=[A-Z][a-zA-Z\s]+(?:–|-|\d{4}))/);
    chunks.forEach((chunk, i) => {
      const clean = chunk.trim();
      if (clean.length > 20) {
        const linesChunk = clean.split('\n');
        const roleAndCo = linesChunk[0] || 'Software Professional';
        const dateMatch = clean.match(/(?:19|20)\d{2}\s*[-–—to]+\s*(?:(?:19|20)\d{2}|Present)/i);
        experience.push({
          id: `exp-${i + 1}`,
          role: roleAndCo.split(/[-–@|at]/)[0]?.trim() || 'Software Engineer',
          company: roleAndCo.split(/[-–@|at]/)[1]?.trim() || 'Technology Company',
          startDate: dateMatch ? dateMatch[0].split(/[-–—to]+/)[0]?.trim() : '2021',
          endDate: dateMatch ? dateMatch[0].split(/[-–—to]+/)[1]?.trim() : 'Present',
          current: /present/i.test(clean),
          description: linesChunk.slice(1).join(' ').trim() || clean
        });
      }
    });
  }
  
  const education = [];
  const eduMatch = rawText.match(/(?:education|academic)[:\s\n]+([^]{20,600}?)(?=\n\s*(?:experience|skills|projects|certifications)|$)/i);
  if (eduMatch && eduMatch[1]) {
    const yearMatch = eduMatch[1].match(/(?:19|20)\d{2}/);
    education.push({
      id: "edu-1",
      degree: eduMatch[1].split('\n')[0]?.trim() || "Bachelor of Science",
      institution: eduMatch[1].split('\n')[1]?.trim() || "University",
      endYear: yearMatch ? yearMatch[0] : "2020"
    });
  }
  
  return {
    name,
    profession,
    summary,
    email,
    phone,
    location,
    skills: skills.length > 0 ? skills : (SAMPLE_RESUMES.softwareEngineer.skills.slice(0, 8)),
    socialLinks,
    experience: experience.length > 0 ? experience : SAMPLE_RESUMES.softwareEngineer.experience,
    education: education.length > 0 ? education : SAMPLE_RESUMES.softwareEngineer.education,
    projects: SAMPLE_RESUMES.softwareEngineer.projects,
    certifications: SAMPLE_RESUMES.softwareEngineer.certifications
  };
}

// ==========================================
// 4. Lightweight Canvas Confetti
// ==========================================
function triggerConfetti() {
  const canvas = document.getElementById('confetti-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  canvas.style.display = 'block';

  const particles = [];
  const colors = ['#6366f1', '#a855f7', '#ec4899', '#10b981', '#f59e0b', '#3b82f6'];

  for (let i = 0; i < 90; i++) {
    particles.push({
      x: canvas.width / 2,
      y: canvas.height * 0.45,
      r: Math.random() * 5 + 3,
      dx: (Math.random() - 0.5) * 14,
      dy: (Math.random() - 0.7) * 16,
      color: colors[Math.floor(Math.random() * colors.length)],
      tilt: Math.random() * 10 - 5,
      tiltSpeed: Math.random() * 0.1 + 0.05,
      alpha: 1
    });
  }

  let start = Date.now();
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let alive = false;
    particles.forEach(p => {
      p.x += p.dx;
      p.y += p.dy;
      p.dy += 0.35; // gravity
      p.tilt += p.tiltSpeed;
      p.alpha -= 0.012;
      if (p.alpha > 0) {
        alive = true;
        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    });

    if (alive && Date.now() - start < 3000) {
      requestAnimationFrame(animate);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      canvas.style.display = 'none';
    }
  }
  requestAnimationFrame(animate);
}

// ==========================================
// 5. Template Definitions
// ==========================================
const TEMPLATES_LIST = [
  {
    id: 'minimal',
    name: 'Minimal',
    badge: 'Clean & Editorial',
    description: 'A clean, uncluttered layout emphasizing elegant typography, thoughtful whitespace, and distraction-free presentation.',
    accentColor: '#18181b',
    idealFor: 'Developers, writers, product managers, and consultants who appreciate simplicity.'
  },
  {
    id: 'modern',
    name: 'Modern',
    badge: 'Contemporary SaaS',
    description: 'Dynamic dark SaaS layout featuring ambient glow gradients, glassmorphism cards, glowing status pills, and sleek badge accents.',
    accentColor: '#6366f1',
    idealFor: 'Full-stack engineers, AI developers, startup builders, and tech professionals.'
  },
  {
    id: 'developer',
    name: 'Developer',
    badge: 'Terminal & GitHub',
    description: 'Technical terminal aesthetic with interactive CLI banners, commit-history career timelines, and repository-style project cards.',
    accentColor: '#238636',
    idealFor: 'Backend devs, open-source contributors, DevOps engineers, and system architects.'
  },
  {
    id: 'creative',
    name: 'Creative',
    badge: 'Visual & Bold',
    description: 'Expressive layout with warm artistic lighting, bold editorial serif accents, large showcase cards, and playful typography.',
    accentColor: '#f59e0b',
    idealFor: 'UI/UX designers, product designers, creative technologists, and art directors.'
  },
  {
    id: 'professional',
    name: 'Professional',
    badge: 'Executive & Corporate',
    description: 'Structured corporate style portfolio highlighting verified leadership credentials, quantitative impact, and career milestones.',
    accentColor: '#1d4ed8',
    idealFor: 'Senior executives, engineering leaders, consultants, and traditional industry job seekers.'
  }
];

// ==========================================
// 6. Template Renderers
// ==========================================
function renderMinimalTemplate(d) {
  return `
    <div class="min-h-screen bg-[#fafafa] text-zinc-900 font-sans selection:bg-zinc-200">
      <header class="border-b border-zinc-200 bg-white/80 backdrop-blur sticky top-0 z-20">
        <div class="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <a href="#" class="font-semibold text-lg tracking-tight text-zinc-900 hover:opacity-80 transition">${escapeHtml(d.name || 'Portfolio')}</a>
          <nav class="flex items-center gap-6 text-sm text-zinc-600">
            ${d.summary ? '<a href="#about" class="hover:text-zinc-950 transition">About</a>' : ''}
            ${d.experience?.length ? '<a href="#experience" class="hover:text-zinc-950 transition">Experience</a>' : ''}
            ${d.projects?.length ? '<a href="#projects" class="hover:text-zinc-950 transition">Projects</a>' : ''}
            ${d.skills?.length ? '<a href="#skills" class="hover:text-zinc-950 transition">Skills</a>' : ''}
            <a href="#contact" class="px-3.5 py-1.5 rounded-full bg-zinc-900 text-white text-xs font-medium hover:bg-zinc-800 transition">Contact</a>
          </nav>
        </div>
      </header>
      <main class="max-w-4xl mx-auto px-6 py-16 space-y-20">
        <section class="space-y-6 pt-4">
          <div class="space-y-2">
            <span class="text-xs font-mono uppercase tracking-widest text-zinc-400">Personal Portfolio</span>
            <h1 class="text-4xl md:text-5xl font-bold tracking-tight text-zinc-950">${escapeHtml(d.name || 'Your Name')}</h1>
            <p class="text-xl md:text-2xl text-zinc-600 font-light">${escapeHtml(d.profession || 'Professional Title')}</p>
          </div>
          <div class="flex flex-wrap items-center gap-5 text-sm text-zinc-600 pt-2">
            ${d.location ? `<span class="inline-flex items-center gap-1.5">📍 ${escapeHtml(d.location)}</span>` : ''}
            ${d.email ? `<a href="mailto:${escapeHtml(d.email)}" class="inline-flex items-center gap-1.5 hover:text-zinc-950 transition">✉️ ${escapeHtml(d.email)}</a>` : ''}
            ${d.phone ? `<span class="inline-flex items-center gap-1.5">📞 ${escapeHtml(d.phone)}</span>` : ''}
          </div>
          <div class="flex items-center gap-3 pt-2">
            ${d.socialLinks?.github ? `<a href="${escapeHtml(d.socialLinks.github)}" target="_blank" class="px-3 py-1 rounded-full border border-zinc-200 text-xs font-medium hover:bg-zinc-100">GitHub ↗</a>` : ''}
            ${d.socialLinks?.linkedin ? `<a href="${escapeHtml(d.socialLinks.linkedin)}" target="_blank" class="px-3 py-1 rounded-full border border-zinc-200 text-xs font-medium hover:bg-zinc-100">LinkedIn ↗</a>` : ''}
            ${d.socialLinks?.website ? `<a href="${escapeHtml(d.socialLinks.website)}" target="_blank" class="px-3 py-1 rounded-full border border-zinc-200 text-xs font-medium hover:bg-zinc-100">Website ↗</a>` : ''}
          </div>
        </section>
        ${d.summary ? `
          <section id="about" class="space-y-4 pt-4 border-t border-zinc-200">
            <h2 class="text-xs font-mono uppercase tracking-widest text-zinc-400">About</h2>
            <p class="text-lg text-zinc-700 leading-relaxed font-normal">${escapeHtml(d.summary)}</p>
          </section>
        ` : ''}
        ${d.experience?.length ? `
          <section id="experience" class="space-y-8 pt-4 border-t border-zinc-200">
            <h2 class="text-xs font-mono uppercase tracking-widest text-zinc-400">Experience</h2>
            <div class="space-y-10">
              ${d.experience.map(exp => `
                <div class="space-y-2">
                  <div class="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                    <div>
                      <h3 class="text-lg font-semibold text-zinc-950">${escapeHtml(exp.role)}</h3>
                      <p class="text-sm text-zinc-600 font-medium">${escapeHtml(exp.company)} ${exp.location ? `• ${escapeHtml(exp.location)}` : ''}</p>
                    </div>
                    <span class="text-xs font-mono text-zinc-400 shrink-0">${escapeHtml(exp.startDate)} – ${escapeHtml(exp.endDate)}</span>
                  </div>
                  ${exp.description ? `<p class="text-sm text-zinc-600 leading-relaxed">${escapeHtml(exp.description)}</p>` : ''}
                  ${exp.highlights?.length ? `
                    <ul class="space-y-1 pt-1">
                      ${exp.highlights.map(h => `<li class="text-sm text-zinc-600 flex items-start gap-2"><span class="text-zinc-400 mt-1">•</span><span>${escapeHtml(h)}</span></li>`).join('')}
                    </ul>
                  ` : ''}
                </div>
              `).join('')}
            </div>
          </section>
        ` : ''}
        ${d.projects?.length ? `
          <section id="projects" class="space-y-8 pt-4 border-t border-zinc-200">
            <h2 class="text-xs font-mono uppercase tracking-widest text-zinc-400">Selected Projects</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              ${d.projects.map(p => `
                <div class="p-6 rounded-2xl bg-white border border-zinc-200/80 hover:shadow-sm transition flex flex-col justify-between">
                  <div class="space-y-2">
                    <div class="flex items-start justify-between gap-2">
                      <h3 class="font-semibold text-zinc-950">${escapeHtml(p.title)}</h3>
                      ${p.link ? `<a href="${escapeHtml(p.link)}" target="_blank" class="text-zinc-400 hover:text-zinc-900">↗</a>` : ''}
                    </div>
                    <p class="text-sm text-zinc-600 leading-relaxed">${escapeHtml(p.description)}</p>
                  </div>
                  ${p.technologies?.length ? `
                    <div class="flex flex-wrap gap-1.5 pt-4">
                      ${p.technologies.map(t => `<span class="text-xs px-2.5 py-0.5 rounded bg-zinc-100 text-zinc-600 font-mono">${escapeHtml(t)}</span>`).join('')}
                    </div>
                  ` : ''}
                </div>
              `).join('')}
            </div>
          </section>
        ` : ''}
        ${d.skills?.length ? `
          <section id="skills" class="space-y-6 pt-4 border-t border-zinc-200">
            <h2 class="text-xs font-mono uppercase tracking-widest text-zinc-400">Skills & Expertise</h2>
            <div class="flex flex-wrap gap-2">
              ${d.skills.map(s => `<span class="px-3.5 py-1.5 rounded-full text-xs font-medium bg-white border border-zinc-200 text-zinc-800">${escapeHtml(s)}</span>`).join('')}
            </div>
          </section>
        ` : ''}
        ${(d.education?.length || d.certifications?.length) ? `
          <section class="grid grid-cols-1 md:grid-cols-2 gap-10 pt-4 border-t border-zinc-200">
            ${d.education?.length ? `
              <div class="space-y-4">
                <h2 class="text-xs font-mono uppercase tracking-widest text-zinc-400">Education</h2>
                <div class="space-y-3">
                  ${d.education.map(e => `
                    <div>
                      <h3 class="font-medium text-zinc-900 text-sm">${escapeHtml(e.degree)}</h3>
                      <p class="text-xs text-zinc-600">${escapeHtml(e.institution)} • ${escapeHtml(e.endYear)}</p>
                    </div>
                  `).join('')}
                </div>
              </div>
            ` : ''}
            ${d.certifications?.length ? `
              <div class="space-y-4">
                <h2 class="text-xs font-mono uppercase tracking-widest text-zinc-400">Certifications</h2>
                <div class="space-y-3">
                  ${d.certifications.map(c => `
                    <div>
                      <h3 class="font-medium text-zinc-900 text-sm">${escapeHtml(c.name)}</h3>
                      <p class="text-xs text-zinc-600">${escapeHtml(c.issuer)} • ${escapeHtml(c.date || '')}</p>
                    </div>
                  `).join('')}
                </div>
              </div>
            ` : ''}
          </section>
        ` : ''}
        <section id="contact" class="p-8 rounded-3xl bg-zinc-900 text-white space-y-4">
          <span class="text-xs font-mono uppercase tracking-widest text-zinc-400">Get In Touch</span>
          <h2 class="text-2xl sm:text-3xl font-bold tracking-tight">Interested in collaborating or discussing opportunities?</h2>
          <p class="text-sm text-zinc-400 max-w-lg">Feel free to reach out via email or connect on professional platforms.</p>
          ${d.email ? `<div class="pt-2"><a href="mailto:${escapeHtml(d.email)}" class="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-zinc-900 text-sm font-medium hover:bg-zinc-100 transition shadow-sm">✉️ Send an Email</a></div>` : ''}
        </section>
      </main>
      <footer class="border-t border-zinc-200 py-8 text-center text-xs text-zinc-500">
        <p>© ${new Date().getFullYear()} ${escapeHtml(d.name || 'Portfolio')}. Generated with Folix.</p>
      </footer>
    </div>
  `;
}

function renderModernTemplate(d) {
  return `
    <div class="min-h-screen bg-[#090d16] text-slate-100 font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      <header class="border-b border-white/[0.06] bg-[#090d16]/70 backdrop-blur-xl sticky top-0 z-20">
        <div class="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-indigo-500/20">
              ${escapeHtml((d.name || 'P').charAt(0))}
            </div>
            <span class="font-semibold tracking-tight text-white">${escapeHtml(d.name || 'Portfolio')}</span>
          </div>
          <nav class="hidden sm:flex items-center gap-6 text-sm text-slate-400">
            ${d.summary ? '<a href="#about" class="hover:text-white transition">About</a>' : ''}
            ${d.experience?.length ? '<a href="#experience" class="hover:text-white transition">Experience</a>' : ''}
            ${d.projects?.length ? '<a href="#projects" class="hover:text-white transition">Projects</a>' : ''}
            ${d.skills?.length ? '<a href="#skills" class="hover:text-white transition">Skills</a>' : ''}
            <a href="#contact" class="px-4 py-1.5 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium shadow-md shadow-indigo-600/30 transition">Get in Touch</a>
          </nav>
        </div>
      </header>
      <main class="max-w-5xl mx-auto px-6 py-16 space-y-24">
        <section class="space-y-6 pt-8">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-medium">
            <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Available for new opportunities
          </div>
          <div class="space-y-3">
            <h1 class="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
              Hi, I'm <span class="bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">${escapeHtml(d.name || 'Developer')}</span>
            </h1>
            <p class="text-xl sm:text-2xl text-slate-300 font-medium">${escapeHtml(d.profession || 'Full Stack Engineer & Builder')}</p>
          </div>
          ${d.summary ? `<p class="text-base sm:text-lg text-slate-400 max-w-2xl leading-relaxed">${escapeHtml(d.summary)}</p>` : ''}
          <div class="flex flex-wrap items-center gap-6 pt-2 text-sm text-slate-400">
            ${d.location ? `<div class="flex items-center gap-2">📍 <span>${escapeHtml(d.location)}</span></div>` : ''}
            ${d.email ? `<a href="mailto:${escapeHtml(d.email)}" class="flex items-center gap-2 hover:text-white transition">✉️ <span>${escapeHtml(d.email)}</span></a>` : ''}
            ${d.phone ? `<div class="flex items-center gap-2">📞 <span>${escapeHtml(d.phone)}</span></div>` : ''}
          </div>
          <div class="flex items-center gap-3 pt-2">
            ${d.socialLinks?.github ? `<a href="${escapeHtml(d.socialLinks.github)}" target="_blank" class="px-3.5 py-1.5 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:border-indigo-500/50 text-slate-300 hover:text-white text-xs font-medium">GitHub ↗</a>` : ''}
            ${d.socialLinks?.linkedin ? `<a href="${escapeHtml(d.socialLinks.linkedin)}" target="_blank" class="px-3.5 py-1.5 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:border-indigo-500/50 text-slate-300 hover:text-white text-xs font-medium">LinkedIn ↗</a>` : ''}
            ${d.socialLinks?.website ? `<a href="${escapeHtml(d.socialLinks.website)}" target="_blank" class="px-3.5 py-1.5 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:border-indigo-500/50 text-slate-300 hover:text-white text-xs font-medium">Website ↗</a>` : ''}
          </div>
        </section>
        ${d.experience?.length ? `
          <section id="experience" class="space-y-6">
            <h2 class="text-2xl sm:text-3xl font-bold text-white tracking-tight">Work Experience</h2>
            <div class="space-y-4">
              ${d.experience.map(exp => `
                <div class="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.12] transition space-y-3">
                  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h3 class="text-lg font-semibold text-white">${escapeHtml(exp.role)}</h3>
                      <p class="text-sm text-indigo-300 font-medium">${escapeHtml(exp.company)} ${exp.location ? `• ${escapeHtml(exp.location)}` : ''}</p>
                    </div>
                    <span class="px-3 py-1 rounded-full text-xs font-mono bg-white/[0.05] border border-white/[0.08] text-slate-400 w-fit">${escapeHtml(exp.startDate)} – ${escapeHtml(exp.endDate)}</span>
                  </div>
                  ${exp.description ? `<p class="text-sm text-slate-400 leading-relaxed">${escapeHtml(exp.description)}</p>` : ''}
                  ${exp.highlights?.length ? `
                    <div class="space-y-1.5 pt-1">
                      ${exp.highlights.map(h => `<div class="flex items-start gap-2 text-sm text-slate-400"><span class="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 shrink-0"></span><span>${escapeHtml(h)}</span></div>`).join('')}
                    </div>
                  ` : ''}
                </div>
              `).join('')}
            </div>
          </section>
        ` : ''}
        ${d.projects?.length ? `
          <section id="projects" class="space-y-6">
            <h2 class="text-2xl sm:text-3xl font-bold text-white tracking-tight">Key Projects</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              ${d.projects.map(proj => `
                <div class="group p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-indigo-500/40 hover:bg-white/[0.04] transition flex flex-col justify-between">
                  <div class="space-y-3">
                    <div class="flex items-center justify-between">
                      <h3 class="text-lg font-bold text-white group-hover:text-indigo-300 transition">${escapeHtml(proj.title)}</h3>
                      ${proj.link ? `<a href="${escapeHtml(proj.link)}" target="_blank" class="p-1.5 rounded-lg bg-white/[0.05] hover:bg-indigo-600 text-slate-300 hover:text-white transition">↗</a>` : ''}
                    </div>
                    <p class="text-sm text-slate-400 leading-relaxed">${escapeHtml(proj.description)}</p>
                  </div>
                  ${proj.technologies?.length ? `
                    <div class="flex flex-wrap gap-2 pt-6">
                      ${proj.technologies.map(t => `<span class="px-2.5 py-1 rounded-md text-xs font-mono bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">${escapeHtml(t)}</span>`).join('')}
                    </div>
                  ` : ''}
                </div>
              `).join('')}
            </div>
          </section>
        ` : ''}
        ${d.skills?.length ? `
          <section id="skills" class="space-y-6">
            <h2 class="text-2xl sm:text-3xl font-bold text-white tracking-tight">Technical Skills</h2>
            <div class="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
              <div class="flex flex-wrap gap-2.5">
                ${d.skills.map(skill => `<span class="px-3.5 py-1.5 rounded-lg text-xs font-medium bg-white/[0.05] border border-white/[0.08] hover:border-indigo-500/50 hover:bg-indigo-500/10 text-slate-200 transition">${escapeHtml(skill)}</span>`).join('')}
              </div>
            </div>
          </section>
        ` : ''}
        <section id="contact" class="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-indigo-900/40 via-purple-900/30 to-slate-900/40 border border-indigo-500/20 text-center space-y-6">
          <h2 class="text-3xl sm:text-4xl font-bold text-white">Let's Build Something Great</h2>
          <p class="text-slate-400 max-w-lg mx-auto text-sm sm:text-base">Have an opportunity or project in mind? Reach out anytime.</p>
          ${d.email ? `<div class="pt-2"><a href="mailto:${escapeHtml(d.email)}" class="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium shadow-lg shadow-indigo-600/30 transition">✉️ Connect at ${escapeHtml(d.email)}</a></div>` : ''}
        </section>
      </main>
      <footer class="border-t border-white/[0.06] py-8 text-center text-xs text-slate-500">
        <p>© ${new Date().getFullYear()} ${escapeHtml(d.name || 'Portfolio')}. Powered by Folix.</p>
      </footer>
    </div>
  `;
}

function renderDeveloperTemplate(d) {
  return `
    <div class="min-h-screen bg-[#0d1117] text-[#c9d1d9] font-mono selection:bg-[#58a6ff]/30 selection:text-[#58a6ff]">
      <header class="border-b border-[#30363d] bg-[#161b22]/90 backdrop-blur sticky top-0 z-20">
        <div class="max-w-5xl mx-auto px-6 py-3 flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="flex items-center gap-1.5">
              <span class="w-3 h-3 rounded-full bg-[#ff5f56]"></span>
              <span class="w-3 h-3 rounded-full bg-[#ffbd2e]"></span>
              <span class="w-3 h-3 rounded-full bg-[#27c93f]"></span>
            </div>
            <span class="text-xs text-[#8b949e]">~/${escapeHtml(d.slug || 'user')}/portfolio.sh</span>
          </div>
          <div class="flex items-center gap-4 text-xs">
            ${d.socialLinks?.github ? `<a href="${escapeHtml(d.socialLinks.github)}" target="_blank" class="text-[#8b949e] hover:text-[#58a6ff] transition">GitHub ↗</a>` : ''}
            ${d.email ? `<a href="mailto:${escapeHtml(d.email)}" class="px-2.5 py-1 rounded bg-[#238636] hover:bg-[#2ea043] text-white text-xs font-semibold transition">Contact</a>` : ''}
          </div>
        </div>
      </header>
      <main class="max-w-5xl mx-auto px-6 py-12 space-y-16">
        <section class="p-6 rounded-lg bg-[#161b22] border border-[#30363d] space-y-4 shadow-xl">
          <div class="text-xs text-[#8b949e]">bash - 80x24</div>
          <div class="space-y-3 font-mono text-sm leading-relaxed">
            <p><span class="text-[#7ee787]">dev@portfolio</span>:<span class="text-[#58a6ff]">~</span>$ whoami</p>
            <h1 class="text-3xl sm:text-4xl font-bold text-white tracking-tight">${escapeHtml(d.name || 'Developer')}</h1>
            <p class="text-[#a5d6ff]">&gt; ${escapeHtml(d.profession || 'Software Engineer')}</p>
            ${d.summary ? `<div class="pt-2 text-[#8b949e] border-l-2 border-[#30363d] pl-4 italic">${escapeHtml(d.summary)}</div>` : ''}
            <div class="pt-3 flex flex-wrap gap-x-6 gap-y-2 text-xs text-[#8b949e]">
              ${d.location ? `<span>📍 ${escapeHtml(d.location)}</span>` : ''}
              ${d.email ? `<span>✉️ ${escapeHtml(d.email)}</span>` : ''}
              ${d.phone ? `<span>📞 ${escapeHtml(d.phone)}</span>` : ''}
            </div>
          </div>
        </section>
        ${d.skills?.length ? `
          <section class="space-y-4">
            <div class="text-sm text-[#7ee787]">$ tree ./tech-stack --depth=1</div>
            <div class="p-5 rounded-lg bg-[#161b22] border border-[#30363d]">
              <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                ${d.skills.map(s => `<div class="flex items-center gap-2 text-xs p-2 rounded bg-[#0d1117] border border-[#30363d]"><span class="w-1.5 h-1.5 rounded-full bg-[#58a6ff]"></span><span class="text-[#c9d1d9] truncate">${escapeHtml(s)}</span></div>`).join('')}
              </div>
            </div>
          </section>
        ` : ''}
        ${d.projects?.length ? `
          <section class="space-y-4">
            <div class="text-sm text-[#7ee787]">$ gh repo list --visibility=public (${d.projects.length} repositories)</div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              ${d.projects.map(proj => `
                <div class="p-5 rounded-lg bg-[#161b22] border border-[#30363d] hover:border-[#58a6ff] transition flex flex-col justify-between space-y-3">
                  <div class="space-y-2">
                    <div class="flex items-start justify-between gap-2">
                      <span class="text-[#58a6ff] font-semibold text-sm">⑂ ${escapeHtml(proj.title)}</span>
                      <span class="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-[#21262d] text-[#8b949e] border border-[#30363d]">Public</span>
                    </div>
                    <p class="text-xs text-[#8b949e] leading-relaxed">${escapeHtml(proj.description)}</p>
                  </div>
                  <div class="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-[#21262d] text-xs text-[#8b949e]">
                    <div class="flex flex-wrap gap-1.5">
                      ${proj.technologies?.map(t => `<span class="text-[11px] text-[#a5d6ff]">#${escapeHtml(t)}</span>`).join('') || ''}
                    </div>
                    ${proj.link ? `<a href="${escapeHtml(proj.link)}" target="_blank" class="text-[#58a6ff] hover:underline">deploy ↗</a>` : ''}
                  </div>
                </div>
              `).join('')}
            </div>
          </section>
        ` : ''}
        ${d.experience?.length ? `
          <section class="space-y-4">
            <div class="text-sm text-[#7ee787]">$ git log --oneline --graph</div>
            <div class="p-6 rounded-lg bg-[#161b22] border border-[#30363d] space-y-6">
              ${d.experience.map(exp => `
                <div class="pl-4 border-l-2 border-[#58a6ff] space-y-1">
                  <div class="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                    <div>
                      <span class="text-sm font-bold text-white">${escapeHtml(exp.role)}</span>
                      <span class="text-xs text-[#7ee787]"> @ ${escapeHtml(exp.company)}</span>
                    </div>
                    <span class="text-xs text-[#8b949e]">${escapeHtml(exp.startDate)}..${escapeHtml(exp.endDate)}</span>
                  </div>
                  ${exp.description ? `<p class="text-xs text-[#8b949e] pt-1">${escapeHtml(exp.description)}</p>` : ''}
                </div>
              `).join('')}
            </div>
          </section>
        ` : ''}
      </main>
      <footer class="border-t border-[#30363d] py-6 text-center text-xs text-[#8b949e]">
        <p>exit 0 • Built with Folix</p>
      </footer>
    </div>
  `;
}

function renderCreativeTemplate(d) {
  return `
    <div class="min-h-screen bg-[#121118] text-[#f4efe6] font-sans selection:bg-amber-400/30 selection:text-amber-200">
      <header class="border-b border-white/[0.08] bg-[#121118]/80 backdrop-blur-md sticky top-0 z-20">
        <div class="max-w-5xl mx-auto px-6 py-5 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="w-3 h-3 rounded-full bg-gradient-to-r from-amber-400 to-rose-400"></span>
            <span class="font-semibold tracking-wider uppercase text-xs text-amber-200/80 font-mono">${escapeHtml(d.name || 'Studio')}</span>
          </div>
          <nav class="flex items-center gap-6 text-xs uppercase tracking-widest text-slate-300">
            ${d.projects?.length ? '<a href="#work" class="hover:text-amber-300 transition">Work</a>' : ''}
            ${d.experience?.length ? '<a href="#story" class="hover:text-amber-300 transition">Story</a>' : ''}
            <a href="#contact" class="px-4 py-2 rounded-full border border-amber-400/40 hover:bg-amber-400 hover:text-black transition font-medium">Let's Talk</a>
          </nav>
        </div>
      </header>
      <main class="max-w-5xl mx-auto px-6 py-20 space-y-28">
        <section class="space-y-8 pt-4">
          <div class="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gradient-to-r from-amber-500/10 to-rose-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono">
            <span>✦ Creative Portfolio & Showcase</span>
          </div>
          <h1 class="text-5xl sm:text-7xl font-extrabold tracking-tight leading-[1.08] text-white">
            Crafting experiences at the intersection of <span class="italic font-serif font-normal bg-gradient-to-r from-amber-300 via-rose-300 to-amber-200 bg-clip-text text-transparent">design</span> and <span class="underline decoration-rose-500/50 underline-offset-8">technology</span>.
          </h1>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8 pt-6 border-t border-white/[0.08]">
            <div>
              <p class="text-xs uppercase tracking-widest text-amber-300/70 font-mono">Creator</p>
              <h2 class="text-xl font-bold text-white mt-1">${escapeHtml(d.name || 'Creative')}</h2>
              <p class="text-sm text-slate-400 mt-0.5">${escapeHtml(d.profession || 'Designer & Technologist')}</p>
            </div>
            <div class="md:col-span-2">
              <p class="text-xs uppercase tracking-widest text-amber-300/70 font-mono">Philosophy</p>
              <p class="text-sm sm:text-base text-slate-300 mt-1 leading-relaxed">${escapeHtml(d.summary || 'Designing meaningful digital products and brands that blend beauty and high performance.')}</p>
            </div>
          </div>
          <div class="flex flex-wrap items-center gap-6 pt-2 text-xs font-mono text-slate-400">
            ${d.location ? `<span>📍 ${escapeHtml(d.location)}</span>` : ''}
            ${d.email ? `<a href="mailto:${escapeHtml(d.email)}" class="hover:text-amber-300 transition">✉️ ${escapeHtml(d.email)}</a>` : ''}
          </div>
        </section>
        ${d.projects?.length ? `
          <section id="work" class="space-y-8">
            <h2 class="text-3xl sm:text-4xl font-bold text-white">Featured Works</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
              ${d.projects.map((proj, idx) => `
                <div class="p-8 rounded-3xl bg-white/[0.03] border border-white/[0.08] hover:border-amber-400/40 transition flex flex-col justify-between">
                  <div class="space-y-3">
                    <span class="text-xs font-mono text-amber-400/80">0${idx + 1} // Project</span>
                    <div class="flex items-start justify-between gap-2">
                      <h3 class="text-2xl font-bold text-white">${escapeHtml(proj.title)}</h3>
                      ${proj.link ? `<a href="${escapeHtml(proj.link)}" target="_blank" class="p-2 rounded-full border border-white/[0.1] hover:bg-amber-400 hover:text-black transition">↗</a>` : ''}
                    </div>
                    <p class="text-sm text-slate-300 leading-relaxed">${escapeHtml(proj.description)}</p>
                  </div>
                  ${proj.technologies?.length ? `
                    <div class="flex flex-wrap gap-2 pt-6">
                      ${proj.technologies.map(t => `<span class="text-xs px-3 py-1 rounded-full bg-white/[0.05] border border-white/[0.08] text-slate-300">${escapeHtml(t)}</span>`).join('')}
                    </div>
                  ` : ''}
                </div>
              `).join('')}
            </div>
          </section>
        ` : ''}
        ${d.skills?.length ? `
          <section class="space-y-6">
            <h2 class="text-xs font-mono uppercase tracking-widest text-amber-300/70">Creative Toolkit</h2>
            <div class="flex flex-wrap gap-2.5">
              ${d.skills.map(skill => `<span class="px-4 py-2 rounded-2xl text-xs font-medium bg-white/[0.04] border border-white/[0.08] hover:border-amber-400/50 hover:bg-amber-400/10 text-slate-200 transition">${escapeHtml(skill)}</span>`).join('')}
            </div>
          </section>
        ` : ''}
        <section id="contact" class="p-10 sm:p-14 rounded-3xl bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-purple-500/10 border border-amber-500/20 text-center space-y-6">
          <h2 class="text-3xl sm:text-5xl font-extrabold text-white">Let's create something memorable.</h2>
          <p class="text-slate-300 max-w-lg mx-auto text-sm">Always open to visionary design commissions, leadership opportunities, and thoughtful conversations.</p>
          ${d.email ? `<div class="pt-2"><a href="mailto:${escapeHtml(d.email)}" class="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-amber-400 hover:bg-amber-300 text-black font-semibold shadow-lg shadow-amber-400/20 transition">Say Hello ✉️</a></div>` : ''}
        </section>
      </main>
      <footer class="border-t border-white/[0.08] py-8 text-center text-xs text-slate-500 font-mono">
        <p>© ${new Date().getFullYear()} ${escapeHtml(d.name || 'Creative')}. Generated via Folix.</p>
      </footer>
    </div>
  `;
}

function renderProfessionalTemplate(d) {
  return `
    <div class="min-h-screen bg-[#f8fafc] text-slate-800 font-sans selection:bg-blue-100">
      <header class="bg-white border-b border-slate-200 sticky top-0 z-20">
        <div class="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 class="font-bold text-slate-900 text-lg tracking-tight">${escapeHtml(d.name || 'Executive Portfolio')}</h1>
            <p class="text-xs text-slate-500 font-medium">${escapeHtml(d.profession || 'Professional')}</p>
          </div>
          ${d.email ? `<a href="mailto:${escapeHtml(d.email)}" class="px-4 py-2 rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition text-xs font-semibold shadow-sm">Connect Directly</a>` : ''}
        </div>
      </header>
      <main class="max-w-5xl mx-auto px-6 py-12 space-y-12">
        <section class="p-8 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-6">
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
            <div class="space-y-2">
              <span class="text-xs uppercase font-semibold tracking-wider text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md">Verified Candidate Profile</span>
              <h2 class="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">${escapeHtml(d.name || 'Your Name')}</h2>
              <p class="text-lg text-slate-600 font-medium">${escapeHtml(d.profession || 'Professional')}</p>
            </div>
            <div class="flex flex-col gap-2 text-sm text-slate-600 shrink-0">
              ${d.location ? `<div>📍 <span>${escapeHtml(d.location)}</span></div>` : ''}
              ${d.email ? `<div>✉️ <span>${escapeHtml(d.email)}</span></div>` : ''}
              ${d.phone ? `<div>📞 <span>${escapeHtml(d.phone)}</span></div>` : ''}
            </div>
          </div>
          ${d.summary ? `
            <div class="space-y-2">
              <h3 class="text-xs uppercase tracking-wider font-bold text-slate-400">Executive Summary</h3>
              <p class="text-slate-700 leading-relaxed text-base">${escapeHtml(d.summary)}</p>
            </div>
          ` : ''}
        </section>
        ${d.experience?.length ? `
          <section class="space-y-6">
            <h2 class="text-slate-900 font-bold text-xl">Professional Experience</h2>
            <div class="space-y-4">
              ${d.experience.map(exp => `
                <div class="p-6 rounded-xl bg-white border border-slate-200/80 shadow-sm space-y-3">
                  <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <div>
                      <h3 class="text-lg font-bold text-slate-900">${escapeHtml(exp.role)}</h3>
                      <p class="text-sm font-semibold text-blue-700">${escapeHtml(exp.company)} ${exp.location ? `• ${escapeHtml(exp.location)}` : ''}</p>
                    </div>
                    <span class="text-xs font-semibold px-3 py-1 rounded bg-slate-100 text-slate-600 w-fit">${escapeHtml(exp.startDate)} – ${escapeHtml(exp.endDate)}</span>
                  </div>
                  ${exp.description ? `<p class="text-sm text-slate-600 leading-relaxed">${escapeHtml(exp.description)}</p>` : ''}
                </div>
              `).join('')}
            </div>
          </section>
        ` : ''}
        ${d.skills?.length ? `
          <section class="p-8 rounded-2xl bg-white border border-slate-200/80 shadow-sm space-y-4">
            <h2 class="text-lg font-bold text-slate-900">Core Competencies & Expertise</h2>
            <div class="flex flex-wrap gap-2">
              ${d.skills.map(skill => `<span class="px-3.5 py-1.5 rounded-md text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">${escapeHtml(skill)}</span>`).join('')}
            </div>
          </section>
        ` : ''}
        ${d.projects?.length ? `
          <section class="space-y-6">
            <h2 class="text-xl font-bold text-slate-900">Key Projects & Deliverables</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              ${d.projects.map(proj => `
                <div class="p-6 rounded-xl bg-white border border-slate-200/80 shadow-sm space-y-2">
                  <h3 class="font-bold text-slate-900 text-base">${escapeHtml(proj.title)}</h3>
                  <p class="text-sm text-slate-600 leading-relaxed">${escapeHtml(proj.description)}</p>
                </div>
              `).join('')}
            </div>
          </section>
        ` : ''}
      </main>
      <footer class="border-t border-slate-200 bg-white py-8 text-center text-xs text-slate-500">
        <p>© ${new Date().getFullYear()} ${escapeHtml(d.name || 'Executive')}. Confidential & verified portfolio.</p>
      </footer>
    </div>
  `;
}

function renderTemplateByChoice(templateId, data) {
  switch (templateId) {
    case 'minimal': return renderMinimalTemplate(data);
    case 'developer': return renderDeveloperTemplate(data);
    case 'creative': return renderCreativeTemplate(data);
    case 'professional': return renderProfessionalTemplate(data);
    case 'modern':
    default:
      return renderModernTemplate(data);
  }
}

// Utility: HTML Escaper
function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// ==========================================
// 7. Core Application State & Lifecycle
// ==========================================
class PortfolioApp {
  constructor() {
    this.view = 'landing'; // landing | upload | edit | templates | preview | published
    this.currentPortfolio = { ...SAMPLE_RESUMES.softwareEngineer, slug: 'rafeek', selectedTemplate: 'modern' };
    this.uploadedFilename = '';
    this.selectedTemplate = 'modern';
    this.previewDevice = 'desktop';
    this.publishedSlug = '';
    this.isPublishModalOpen = false;
    this.showMySitesModal = false;
    this.editorTab = 'profile';

    this.init();
  }

  init() {
    // Bind URL router
    window.addEventListener('popstate', () => this.handleRouting());
    this.handleRouting();
  }

  handleRouting() {
    const pathname = window.location.pathname;
    const match = pathname.match(/^\/p\/([a-zA-Z0-9_-]+)/);
    if (match && match[1]) {
      this.publishedSlug = match[1].toLowerCase();
      this.view = 'published';
    } else {
      if (this.view === 'published') {
        this.view = 'landing';
      }
    }
    this.render();
  }

  navigateTo(newView, path) {
    this.view = newView;
    if (path) {
      window.history.pushState({}, '', path);
    } else if (newView === 'landing') {
      window.history.pushState({}, '', '/');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.render();
  }

  render() {
    const root = document.getElementById('app-root');
    if (!root) return;

    if (this.view === 'published') {
      this.renderPublishedView(root);
    } else if (this.view === 'upload') {
      this.renderUploadView(root);
    } else if (this.view === 'edit') {
      this.renderEditView(root);
    } else if (this.view === 'templates') {
      this.renderTemplateGalleryView(root);
    } else if (this.view === 'preview') {
      this.renderPreviewView(root);
    } else {
      this.renderLandingView(root);
    }

    // Modal Overlays
    this.renderModals();
  }

  // View: Landing Page
  renderLandingView(root) {
    const published = getAllPortfolios();
    const count = Object.keys(published).length;

    root.innerHTML = `
      <div class="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
        <!-- Top Navigation -->
        <nav class="border-b border-white/[0.08] bg-slate-950/70 backdrop-blur-xl sticky top-0 z-40">
          <div class="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            <div class="flex items-center gap-3 cursor-pointer" onclick="app.navigateTo('landing')">
              <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 p-0.5 shadow-lg shadow-indigo-500/25">
                <div class="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center font-bold text-indigo-400">
                  ✦
                </div>
              </div>
              <div class="flex items-center gap-2">
                <span class="font-extrabold text-2xl tracking-tight text-white flex items-center">
                  Fol<span class="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">ix</span>
                </span>
                <span class="hidden sm:inline-block text-xs font-medium text-slate-400 border-l border-white/[0.1] pl-2.5">
                  instant portfolio generator
                </span>
              </div>
            </div>

            <div class="flex items-center gap-4">
              ${count > 0 ? `
                <button
                  onclick="app.openMySitesModal()"
                  class="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium text-slate-300 bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] hover:text-white transition"
                >
                  <span>🌐 My Portfolios (${count})</span>
                </button>
              ` : ''}
              <button
                onclick="app.navigateTo('upload')"
                class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs sm:text-sm font-semibold shadow-lg shadow-indigo-500/25 transition"
              >
                <span>Create My Portfolio</span>
                <span>→</span>
              </button>
            </div>
          </div>
        </nav>

        <!-- Hero Section -->
        <section class="relative overflow-hidden pt-20 pb-24 md:pt-28 md:pb-32 px-6">
          <div class="max-w-4xl mx-auto text-center space-y-8 relative z-10">
            <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.1] text-indigo-300 text-xs font-medium">
              <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Turn your resume into a website in 60 seconds • 100% Client-Side
            </div>

            <h1 class="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white leading-[1.12]">
              Turn Your Resume Into a <br/>
              <span class="bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 bg-clip-text text-transparent">
                Stunning Portfolio
              </span>
            </h1>

            <p class="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Upload your PDF or DOCX resume. Our automated extractor extracts your experience, skills, and projects into a responsive, live portfolio website ready to publish with a custom URL.
            </p>

            <div class="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <button
                onclick="app.navigateTo('upload')"
                class="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:opacity-95 text-white font-semibold text-base shadow-xl shadow-indigo-600/30 transition flex items-center justify-center gap-3"
              >
                <span>☁️ Create My Portfolio</span>
                <span>→</span>
              </button>
              <button
                onclick="app.previewSample('modern')"
                class="w-full sm:w-auto px-6 py-4 rounded-xl bg-white/[0.04] border border-white/[0.1] hover:bg-white/[0.08] text-slate-200 font-medium text-base transition flex items-center justify-center gap-2"
              >
                <span>👁️ View Sample Portfolio</span>
              </button>
            </div>

            <div class="pt-8 flex flex-wrap items-center justify-center gap-8 text-xs text-slate-400">
              <div>✓ PDF & DOCX extraction</div>
              <div>✓ 5 Distinct Templates</div>
              <div>✓ Custom /p/name Vanity URL</div>
              <div>✓ Instant LocalStorage Save</div>
            </div>
          </div>
        </section>

        <!-- How It Works Section -->
        <section class="py-20 px-6 border-y border-white/[0.06] bg-slate-900/40">
          <div class="max-w-6xl mx-auto space-y-16">
            <div class="text-center space-y-3">
              <span class="text-xs uppercase font-mono tracking-widest text-indigo-400">Streamlined Workflow</span>
              <h2 class="text-3xl sm:text-4xl font-bold text-white tracking-tight">How It Works</h2>
              <p class="text-sm text-slate-400 max-w-lg mx-auto">From raw resume to a published web portfolio in three effortless steps.</p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div class="p-8 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-4">
                <div class="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-lg font-mono">01</div>
                <h3 class="text-xl font-bold text-white">Upload Resume</h3>
                <p class="text-sm text-slate-400 leading-relaxed">Drag and drop your PDF or DOCX file. Our engine extracts your job history, education, skills, and links into structured editable fields.</p>
              </div>

              <div class="p-8 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-4">
                <div class="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-lg font-mono">02</div>
                <h3 class="text-xl font-bold text-white">Choose Template</h3>
                <p class="text-sm text-slate-400 leading-relaxed">Select from 5 distinct designs — Minimal, Modern, Developer, Creative, or Professional. Live preview your info across all templates.</p>
              </div>

              <div class="p-8 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-4">
                <div class="w-12 h-12 rounded-xl bg-pink-500/10 border border-pink-500/20 text-pink-400 flex items-center justify-center font-bold text-lg font-mono">03</div>
                <h3 class="text-xl font-bold text-white">Publish Custom URL</h3>
                <p class="text-sm text-slate-400 leading-relaxed">Choose your vanity URL like <code class="text-pink-300 font-mono text-xs bg-pink-500/10 px-1 py-0.5 rounded">/p/rafeek</code>. It saves locally to browser storage for instant access anywhere.</p>
              </div>
            </div>
          </div>
        </section>

        <!-- Template Showcase Section -->
        <section class="py-24 px-6">
          <div class="max-w-6xl mx-auto space-y-12">
            <div class="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <span class="text-xs uppercase font-mono tracking-widest text-indigo-400">Design Collection</span>
                <h2 class="text-3xl sm:text-4xl font-bold text-white tracking-tight mt-1">5 Curated Portfolio Templates</h2>
                <p class="text-sm text-slate-400 mt-1">Bespoke layouts engineered for different tech and creative careers.</p>
              </div>
              <button onclick="app.navigateTo('upload')" class="text-xs font-semibold text-indigo-400 hover:text-indigo-300">Build yours now →</button>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              ${TEMPLATES_LIST.map(tmpl => `
                <div class="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-indigo-500/40 transition flex flex-col justify-between">
                  <div class="space-y-4">
                    <div class="flex items-center justify-between">
                      <span class="text-xs font-mono px-2.5 py-1 rounded-full bg-white/[0.05] text-slate-300 border border-white/[0.08]">${tmpl.badge}</span>
                      <div class="w-3 h-3 rounded-full" style="background-color: ${tmpl.accentColor}"></div>
                    </div>
                    <div>
                      <h3 class="text-xl font-bold text-white">${tmpl.name}</h3>
                      <p class="text-xs text-slate-400 mt-2 leading-relaxed">${tmpl.description}</p>
                    </div>
                    <div class="p-3 rounded-xl bg-black/30 border border-white/[0.04] text-[11px] text-slate-400">
                      <span class="font-semibold text-slate-300">Ideal for: </span>${tmpl.idealFor}
                    </div>
                  </div>
                  <div class="pt-6">
                    <button
                      onclick="app.previewSample('${tmpl.id}')"
                      class="w-full py-2.5 rounded-xl bg-white/[0.05] hover:bg-indigo-600 text-slate-200 hover:text-white text-xs font-semibold transition"
                    >
                      Live Preview →
                    </button>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </section>

        <!-- Footer -->
        <footer class="mt-auto border-t border-white/[0.06] py-8 text-center text-xs text-slate-500">
          <p>© ${new Date().getFullYear()} Folix — Instant Portfolio Generator.</p>
        </footer>
      </div>
    `;
  }

  // View: Upload Resume
  renderUploadView(root) {
    root.innerHTML = `
      <div class="min-h-screen bg-slate-950 text-slate-100 font-sans p-6">
        <div class="max-w-3xl mx-auto py-12 space-y-8 animate-fade-in">
          <div class="text-center space-y-3">
            <button onclick="app.navigateTo('landing')" class="text-xs text-slate-400 hover:text-white transition font-medium mb-2">
              ← Back to Overview
            </button>
            <h2 class="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Upload Your Resume
            </h2>
            <p class="text-sm text-slate-400 max-w-lg mx-auto">
              Drop your PDF or DOCX file below. Our client-side parser will extract your background into structured editable portfolio sections.
            </p>
          </div>

          <!-- Drag and drop zone -->
          <div
            id="drop-zone"
            class="p-12 sm:p-16 rounded-3xl border-2 border-dashed border-white/[0.15] bg-white/[0.02] hover:border-indigo-500/60 hover:bg-white/[0.04] transition cursor-pointer text-center space-y-4 flex flex-col items-center justify-center"
            onclick="document.getElementById('resume-file-input').click()"
          >
            <input type="file" id="resume-file-input" accept=".pdf,.docx,.txt" class="hidden" onchange="app.handleFileSelect(event)" />
            <div class="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center text-2xl">
              ☁️
            </div>
            <div>
              <p class="text-base font-semibold text-white" id="upload-status-text">Drag & drop your resume file here</p>
              <p class="text-xs text-slate-400 mt-1">or <span class="text-indigo-400 underline font-medium">browse from your computer</span></p>
            </div>
            <div class="flex items-center gap-2 text-[11px] font-mono text-slate-500 pt-2">
              <span>Supported:</span>
              <span class="px-2 py-0.5 rounded bg-white/[0.05] border border-white/[0.08] text-slate-300 font-semibold">.PDF</span>
              <span class="px-2 py-0.5 rounded bg-white/[0.05] border border-white/[0.08] text-slate-300 font-semibold">.DOCX</span>
            </div>
          </div>

          <div id="upload-error-box" class="hidden p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-300"></div>

          <!-- Quick Test Demo Resumes -->
          <div class="p-6 rounded-2xl bg-slate-900/60 border border-white/[0.06] space-y-4">
            <div class="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-indigo-400">
              <span>✦ Don't have a resume file handy? Test in 1-click</span>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onclick="app.loadSampleData('softwareEngineer')"
                class="p-4 rounded-xl bg-white/[0.03] border border-white/[0.08] hover:border-indigo-500/50 hover:bg-white/[0.06] text-left transition"
              >
                <div class="flex items-center justify-between">
                  <span class="font-semibold text-white text-xs">Mohamed Rafeek</span>
                  <span class="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300">Tech / Dev</span>
                </div>
                <p class="text-[11px] text-slate-400 mt-1">Senior Full Stack & AI Engineer (TypeScript, Go, React)</p>
              </button>

              <button
                onclick="app.loadSampleData('productDesigner')"
                class="p-4 rounded-xl bg-white/[0.03] border border-white/[0.08] hover:border-purple-500/50 hover:bg-white/[0.06] text-left transition"
              >
                <div class="flex items-center justify-between">
                  <span class="font-semibold text-white text-xs">Elena Rostova</span>
                  <span class="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/10 text-purple-300">Design / UX</span>
                </div>
                <p class="text-[11px] text-slate-400 mt-1">Principal Product & UX Designer (Design Systems, Prototyping)</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    // Bind drag & drop events
    const zone = document.getElementById('drop-zone');
    if (zone) {
      zone.addEventListener('dragover', (e) => { e.preventDefault(); zone.classList.add('border-indigo-500', 'bg-indigo-500/10'); });
      zone.addEventListener('dragleave', (e) => { e.preventDefault(); zone.classList.remove('border-indigo-500', 'bg-indigo-500/10'); });
      zone.addEventListener('drop', (e) => {
        e.preventDefault();
        zone.classList.remove('border-indigo-500', 'bg-indigo-500/10');
        if (e.dataTransfer.files?.length) {
          this.processFile(e.dataTransfer.files[0]);
        }
      });
    }
  }

  async handleFileSelect(event) {
    if (event.target.files?.length) {
      this.processFile(event.target.files[0]);
    }
  }

  async processFile(file) {
    const statusText = document.getElementById('upload-status-text');
    const errBox = document.getElementById('upload-error-box');
    if (errBox) errBox.classList.add('hidden');

    try {
      if (statusText) statusText.innerText = 'Extracting resume details...';
      const text = await extractTextFromFile(file);
      const parsed = parseResumeText(text);

      this.uploadedFilename = file.name;
      const firstWord = (parsed.name || 'portfolio').trim().split(/\s+/)[0] || 'portfolio';
      this.currentPortfolio = {
        slug: sanitizeSlug(firstWord),
        name: parsed.name || '',
        profession: parsed.profession || '',
        summary: parsed.summary || '',
        email: parsed.email || '',
        phone: parsed.phone || '',
        location: parsed.location || '',
        skills: parsed.skills || [],
        experience: parsed.experience || [],
        education: parsed.education || [],
        projects: parsed.projects || [],
        certifications: parsed.certifications || [],
        socialLinks: parsed.socialLinks || {},
        selectedTemplate: this.selectedTemplate || 'modern',
        publishedAt: new Date().toISOString()
      };

      this.navigateTo('edit');
    } catch (err) {
      if (statusText) statusText.innerText = 'Drag & drop your resume file here';
      if (errBox) {
        errBox.innerText = 'Error reading document. Please ensure it is a valid PDF or DOCX file.';
        errBox.classList.remove('hidden');
      }
    }
  }

  loadSampleData(key) {
    const sample = SAMPLE_RESUMES[key];
    this.uploadedFilename = `${sample.name.replace(/\s+/g, '_')}_Resume.pdf`;
    this.currentPortfolio = {
      ...this.currentPortfolio,
      ...sample,
      slug: sanitizeSlug(sample.name.split(' ')[0])
    };
    this.navigateTo('edit');
  }

  // View: Extracted Resume Editor
  renderEditView(root) {
    const d = this.currentPortfolio;
    root.innerHTML = `
      <div class="min-h-screen bg-slate-950 text-slate-100 font-sans p-6">
        <div class="max-w-5xl mx-auto py-8 space-y-8 animate-fade-in">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-6">
            <div>
              <button onclick="app.navigateTo('upload')" class="text-xs text-slate-400 hover:text-white transition font-medium mb-1.5">
                ← Upload different resume
              </button>
              <h2 class="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
                <span>Review & Edit Extracted Data</span>
                <span class="text-xs font-mono font-normal px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Extracted
                </span>
              </h2>
              ${this.uploadedFilename ? `<p class="text-xs text-slate-400 mt-1">Extracted from <span class="text-slate-200 font-mono">${escapeHtml(this.uploadedFilename)}</span></p>` : ''}
            </div>
            <button
              onclick="app.saveEditorAndContinue()"
              class="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs sm:text-sm font-semibold shadow-lg shadow-indigo-500/25 transition"
            >
              Choose Template & Preview →
            </button>
          </div>

          <!-- Section Tabs -->
          <div class="flex overflow-x-auto gap-2 pb-2 border-b border-white/[0.06]">
            ${['profile', 'skills', 'experience', 'projects', 'education', 'links'].map(tab => `
              <button
                onclick="app.setEditorTab('${tab}')"
                class="px-4 py-2.5 rounded-xl text-xs font-medium capitalize transition ${this.editorTab === tab ? 'bg-indigo-600 text-white shadow-md' : 'bg-white/[0.03] text-slate-400 hover:text-white hover:bg-white/[0.06]'}"
              >
                ${tab}
              </button>
            `).join('')}
          </div>

          <!-- Tab Content Form -->
          <form id="editor-form" onsubmit="event.preventDefault(); app.saveEditorAndContinue();" class="space-y-6">
            ${this.renderEditorTabContent(d)}

            <div class="flex items-center justify-between pt-6 border-t border-white/[0.08]">
              <button type="button" onclick="app.navigateTo('upload')" class="px-5 py-2.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-xs font-semibold text-slate-300">
                Back
              </button>
              <button type="submit" class="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs sm:text-sm font-semibold shadow-lg">
                Proceed to Template Selection →
              </button>
            </div>
          </form>
        </div>
      </div>
    `;
  }

  setEditorTab(tab) {
    this.editorTab = tab;
    this.render();
  }

  renderEditorTabContent(d) {
    if (this.editorTab === 'skills') {
      return `
        <div class="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-6">
          <h3 class="text-lg font-bold text-white">Skills & Competencies</h3>
          <div class="flex gap-2">
            <input type="text" id="new-skill-input" placeholder="Type a skill and click Add..." class="flex-1 px-4 py-2.5 rounded-xl bg-slate-900 border border-white/[0.08] text-white text-sm focus:border-indigo-500 focus:outline-none" />
            <button type="button" onclick="app.addSkillFromInput()" class="px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-medium text-xs">Add Skill</button>
          </div>
          <div class="flex flex-wrap gap-2 pt-2" id="skills-pill-container">
            ${(d.skills || []).map((s, idx) => `
              <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white/[0.05] border border-white/[0.08] text-slate-200">
                <span>${escapeHtml(s)}</span>
                <button type="button" onclick="app.removeSkill(${idx})" class="text-slate-400 hover:text-red-400">×</button>
              </span>
            `).join('')}
          </div>
        </div>
      `;
    }

    if (this.editorTab === 'experience') {
      return `
        <div class="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-6">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-bold text-white">Work Experience (${d.experience?.length || 0})</h3>
            <button type="button" onclick="app.addEmptyExperience()" class="px-3.5 py-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-xs font-semibold text-slate-200">+ Add Position</button>
          </div>
          <div class="space-y-4">
            ${(d.experience || []).map((exp, i) => `
              <div class="p-5 rounded-xl bg-slate-900/80 border border-white/[0.08] space-y-3">
                <div class="flex items-center justify-between border-b border-white/[0.06] pb-2">
                  <span class="text-xs font-mono text-indigo-400">Position 0${i + 1}</span>
                  <button type="button" onclick="app.removeExperience(${i})" class="text-xs text-red-400 hover:underline">Remove</button>
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input type="text" placeholder="Job Title" value="${escapeHtml(exp.role)}" onchange="app.currentPortfolio.experience[${i}].role = this.value" class="px-3 py-2 rounded-lg bg-black/40 border border-white/[0.06] text-white text-xs" />
                  <input type="text" placeholder="Company Name" value="${escapeHtml(exp.company)}" onchange="app.currentPortfolio.experience[${i}].company = this.value" class="px-3 py-2 rounded-lg bg-black/40 border border-white/[0.06] text-white text-xs" />
                  <input type="text" placeholder="Start Date" value="${escapeHtml(exp.startDate)}" onchange="app.currentPortfolio.experience[${i}].startDate = this.value" class="px-3 py-2 rounded-lg bg-black/40 border border-white/[0.06] text-white text-xs" />
                  <input type="text" placeholder="End Date" value="${escapeHtml(exp.endDate)}" onchange="app.currentPortfolio.experience[${i}].endDate = this.value" class="px-3 py-2 rounded-lg bg-black/40 border border-white/[0.06] text-white text-xs" />
                  <textarea rows="2" placeholder="Description of duties and achievements" onchange="app.currentPortfolio.experience[${i}].description = this.value" class="sm:col-span-2 px-3 py-2 rounded-lg bg-black/40 border border-white/[0.06] text-white text-xs">${escapeHtml(exp.description || '')}</textarea>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }

    if (this.editorTab === 'projects') {
      return `
        <div class="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-6">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-bold text-white">Projects (${d.projects?.length || 0})</h3>
            <button type="button" onclick="app.addEmptyProject()" class="px-3.5 py-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-xs font-semibold text-slate-200">+ Add Project</button>
          </div>
          <div class="space-y-4">
            ${(d.projects || []).map((proj, i) => `
              <div class="p-5 rounded-xl bg-slate-900/80 border border-white/[0.08] space-y-3">
                <div class="flex items-center justify-between border-b border-white/[0.06] pb-2">
                  <span class="text-xs font-mono text-purple-400">Project 0${i + 1}</span>
                  <button type="button" onclick="app.removeProject(${i})" class="text-xs text-red-400 hover:underline">Remove</button>
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input type="text" placeholder="Project Name" value="${escapeHtml(proj.title)}" onchange="app.currentPortfolio.projects[${i}].title = this.value" class="px-3 py-2 rounded-lg bg-black/40 border border-white/[0.06] text-white text-xs" />
                  <input type="url" placeholder="Project Link (https://...)" value="${escapeHtml(proj.link || '')}" onchange="app.currentPortfolio.projects[${i}].link = this.value" class="px-3 py-2 rounded-lg bg-black/40 border border-white/[0.06] text-white text-xs" />
                  <textarea rows="2" placeholder="Project Description" onchange="app.currentPortfolio.projects[${i}].description = this.value" class="sm:col-span-2 px-3 py-2 rounded-lg bg-black/40 border border-white/[0.06] text-white text-xs">${escapeHtml(proj.description || '')}</textarea>
                  <input type="text" placeholder="Technologies (comma-separated)" value="${escapeHtml(proj.technologies?.join(', ') || '')}" onchange="app.currentPortfolio.projects[${i}].technologies = this.value.split(',').map(s=>s.trim()).filter(Boolean)" class="sm:col-span-2 px-3 py-2 rounded-lg bg-black/40 border border-white/[0.06] text-white text-xs" />
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }

    if (this.editorTab === 'education') {
      return `
        <div class="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-6">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-bold text-white">Education & Certifications</h3>
            <button type="button" onclick="app.addEmptyEducation()" class="px-3.5 py-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] text-xs font-semibold text-slate-200">+ Add Degree</button>
          </div>
          <div class="space-y-3">
            ${(d.education || []).map((edu, i) => `
              <div class="p-4 rounded-xl bg-slate-900/80 border border-white/[0.08] flex items-center justify-between gap-3">
                <input type="text" placeholder="Degree / Field" value="${escapeHtml(edu.degree)}" onchange="app.currentPortfolio.education[${i}].degree = this.value" class="flex-1 px-3 py-2 rounded-lg bg-black/40 border border-white/[0.06] text-white text-xs" />
                <input type="text" placeholder="Institution" value="${escapeHtml(edu.institution)}" onchange="app.currentPortfolio.education[${i}].institution = this.value" class="flex-1 px-3 py-2 rounded-lg bg-black/40 border border-white/[0.06] text-white text-xs" />
                <input type="text" placeholder="Year" value="${escapeHtml(edu.endYear)}" onchange="app.currentPortfolio.education[${i}].endYear = this.value" class="w-24 px-3 py-2 rounded-lg bg-black/40 border border-white/[0.06] text-white text-xs" />
                <button type="button" onclick="app.removeEducation(${i})" class="text-slate-400 hover:text-red-400">×</button>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }

    if (this.editorTab === 'links') {
      return `
        <div class="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-4">
          <h3 class="text-lg font-bold text-white">Social & Web Links</h3>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="text-xs text-slate-400 font-semibold">GitHub URL</label>
              <input type="url" id="link-github" value="${escapeHtml(d.socialLinks?.github || '')}" class="w-full mt-1 px-3 py-2 rounded-lg bg-slate-900 border border-white/[0.08] text-white text-xs" />
            </div>
            <div>
              <label class="text-xs text-slate-400 font-semibold">LinkedIn URL</label>
              <input type="url" id="link-linkedin" value="${escapeHtml(d.socialLinks?.linkedin || '')}" class="w-full mt-1 px-3 py-2 rounded-lg bg-slate-900 border border-white/[0.08] text-white text-xs" />
            </div>
            <div>
              <label class="text-xs text-slate-400 font-semibold">Personal Website</label>
              <input type="url" id="link-website" value="${escapeHtml(d.socialLinks?.website || '')}" class="w-full mt-1 px-3 py-2 rounded-lg bg-slate-900 border border-white/[0.08] text-white text-xs" />
            </div>
            <div>
              <label class="text-xs text-slate-400 font-semibold">Twitter / X URL</label>
              <input type="url" id="link-twitter" value="${escapeHtml(d.socialLinks?.twitter || '')}" class="w-full mt-1 px-3 py-2 rounded-lg bg-slate-900 border border-white/[0.08] text-white text-xs" />
            </div>
          </div>
        </div>
      `;
    }

    // Default Profile tab
    return `
      <div class="p-6 sm:p-8 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-6">
        <h3 class="text-lg font-bold text-white">Personal Identity & Bio</h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="space-y-1">
            <label class="text-xs font-semibold text-slate-300">Full Name *</label>
            <input type="text" id="prof-name" value="${escapeHtml(d.name)}" required class="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/[0.08] text-white text-sm focus:border-indigo-500 focus:outline-none" />
          </div>
          <div class="space-y-1">
            <label class="text-xs font-semibold text-slate-300">Professional Designation *</label>
            <input type="text" id="prof-title" value="${escapeHtml(d.profession)}" required class="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/[0.08] text-white text-sm focus:border-indigo-500 focus:outline-none" />
          </div>
          <div class="space-y-1">
            <label class="text-xs font-semibold text-slate-300">Email Address</label>
            <input type="email" id="prof-email" value="${escapeHtml(d.email || '')}" class="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/[0.08] text-white text-sm focus:border-indigo-500 focus:outline-none" />
          </div>
          <div class="space-y-1">
            <label class="text-xs font-semibold text-slate-300">Phone</label>
            <input type="text" id="prof-phone" value="${escapeHtml(d.phone || '')}" class="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/[0.08] text-white text-sm focus:border-indigo-500 focus:outline-none" />
          </div>
          <div class="space-y-1 sm:col-span-2">
            <label class="text-xs font-semibold text-slate-300">Location</label>
            <input type="text" id="prof-location" value="${escapeHtml(d.location || '')}" class="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/[0.08] text-white text-sm focus:border-indigo-500 focus:outline-none" />
          </div>
          <div class="space-y-1 sm:col-span-2">
            <label class="text-xs font-semibold text-slate-300">Professional Summary</label>
            <textarea id="prof-summary" rows="4" class="w-full px-4 py-3 rounded-xl bg-slate-900 border border-white/[0.08] text-white text-sm leading-relaxed focus:border-indigo-500 focus:outline-none">${escapeHtml(d.summary || '')}</textarea>
          </div>
        </div>
      </div>
    `;
  }

  saveEditorAndContinue() {
    // Read current tab fields if present
    const nameEl = document.getElementById('prof-name');
    if (nameEl) this.currentPortfolio.name = nameEl.value;

    const titleEl = document.getElementById('prof-title');
    if (titleEl) this.currentPortfolio.profession = titleEl.value;

    const emailEl = document.getElementById('prof-email');
    if (emailEl) this.currentPortfolio.email = emailEl.value;

    const phoneEl = document.getElementById('prof-phone');
    if (phoneEl) this.currentPortfolio.phone = phoneEl.value;

    const locEl = document.getElementById('prof-location');
    if (locEl) this.currentPortfolio.location = locEl.value;

    const sumEl = document.getElementById('prof-summary');
    if (sumEl) this.currentPortfolio.summary = sumEl.value;

    const ghEl = document.getElementById('link-github');
    if (ghEl) {
      this.currentPortfolio.socialLinks = {
        ...this.currentPortfolio.socialLinks,
        github: ghEl.value,
        linkedin: document.getElementById('link-linkedin')?.value || '',
        website: document.getElementById('link-website')?.value || '',
        twitter: document.getElementById('link-twitter')?.value || ''
      };
    }

    this.navigateTo('templates');
  }

  addSkillFromInput() {
    const input = document.getElementById('new-skill-input');
    if (!input || !input.value.trim()) return;
    const split = input.value.split(',').map(s => s.trim()).filter(Boolean);
    this.currentPortfolio.skills = Array.from(new Set([...(this.currentPortfolio.skills || []), ...split]));
    input.value = '';
    this.render();
  }

  removeSkill(index) {
    this.currentPortfolio.skills.splice(index, 1);
    this.render();
  }

  addEmptyExperience() {
    if (!this.currentPortfolio.experience) this.currentPortfolio.experience = [];
    this.currentPortfolio.experience.unshift({
      id: `exp-${Date.now()}`,
      role: 'Software Engineer',
      company: 'Tech Company',
      startDate: '2022',
      endDate: 'Present',
      description: 'Led development of core scalable web features.'
    });
    this.render();
  }

  removeExperience(index) {
    this.currentPortfolio.experience.splice(index, 1);
    this.render();
  }

  addEmptyProject() {
    if (!this.currentPortfolio.projects) this.currentPortfolio.projects = [];
    this.currentPortfolio.projects.unshift({
      id: `proj-${Date.now()}`,
      title: 'New Web Application',
      description: 'A modern web application built with responsive components.',
      technologies: ['React', 'TypeScript']
    });
    this.render();
  }

  removeProject(index) {
    this.currentPortfolio.projects.splice(index, 1);
    this.render();
  }

  addEmptyEducation() {
    if (!this.currentPortfolio.education) this.currentPortfolio.education = [];
    this.currentPortfolio.education.push({
      id: `edu-${Date.now()}`,
      degree: 'B.S. in Computer Science',
      institution: 'State University',
      endYear: '2022'
    });
    this.render();
  }

  removeEducation(index) {
    this.currentPortfolio.education.splice(index, 1);
    this.render();
  }

  // View: Template Gallery
  renderTemplateGalleryView(root) {
    root.innerHTML = `
      <div class="min-h-screen bg-slate-950 text-slate-100 font-sans p-6">
        <div class="max-w-6xl mx-auto py-8 space-y-10 animate-fade-in">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-6">
            <div>
              <button onclick="app.navigateTo('edit')" class="text-xs text-slate-400 hover:text-white transition font-medium mb-1.5">
                ← Back to edit details
              </button>
              <h2 class="text-3xl font-extrabold text-white tracking-tight">Choose Your Portfolio Template</h2>
              <p class="text-xs text-slate-400 mt-1">Select one of 5 distinct styles. All templates dynamically render your resume information.</p>
            </div>
            <button
              onclick="app.navigateTo('preview')"
              class="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs sm:text-sm font-semibold shadow-lg shadow-indigo-500/25 transition"
            >
              Preview with My Data →
            </button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            ${TEMPLATES_LIST.map(tmpl => {
              const isSelected = (this.currentPortfolio.selectedTemplate || 'modern') === tmpl.id;
              return `
                <div
                  onclick="app.selectTemplate('${tmpl.id}')"
                  class="p-6 rounded-2xl cursor-pointer transition flex flex-col justify-between ${
                    isSelected
                      ? 'bg-gradient-to-b from-indigo-950/50 to-slate-900 border-2 border-indigo-500 shadow-xl shadow-indigo-500/20 scale-[1.01]'
                      : 'bg-white/[0.02] border border-white/[0.08] hover:border-white/[0.18]'
                  }"
                >
                  <div class="space-y-4">
                    <div class="flex items-center justify-between">
                      <span class="text-xs font-mono px-2.5 py-1 rounded-full bg-white/[0.05] border border-white/[0.08] text-slate-300">${tmpl.badge}</span>
                      <div class="w-3 h-3 rounded-full" style="background-color: ${tmpl.accentColor}"></div>
                    </div>
                    <div>
                      <h3 class="text-xl font-bold text-white">${tmpl.name}</h3>
                      <p class="text-xs text-slate-400 mt-2 leading-relaxed">${tmpl.description}</p>
                    </div>
                    <div class="p-3 rounded-xl bg-black/40 border border-white/[0.04] text-[11px] text-slate-400">
                      <span class="font-semibold text-slate-300">Ideal for: </span>${tmpl.idealFor}
                    </div>
                  </div>
                  <div class="pt-6">
                    <button
                      onclick="app.selectTemplate('${tmpl.id}'); app.navigateTo('preview');"
                      class="w-full py-2.5 rounded-xl text-xs font-semibold transition ${isSelected ? 'bg-indigo-600 text-white shadow-md' : 'bg-white/[0.06] text-slate-300 hover:bg-white/[0.1]'}"
                    >
                      ${isSelected ? 'Selected • Preview →' : 'Select & Preview'}
                    </button>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      </div>
    `;
  }

  selectTemplate(tmplId) {
    this.currentPortfolio.selectedTemplate = tmplId;
    this.render();
  }

  previewSample(tmplId) {
    this.currentPortfolio.selectedTemplate = tmplId;
    this.navigateTo('preview');
  }

  // View: Live Portfolio Preview
  renderPreviewView(root) {
    const tmplId = this.currentPortfolio.selectedTemplate || 'modern';
    const renderedHtml = renderTemplateByChoice(tmplId, this.currentPortfolio);

    root.innerHTML = `
      <div class="min-h-screen bg-slate-950 flex flex-col font-sans">
        <!-- Floating Preview Top Bar -->
        <header class="sticky top-0 z-50 border-b border-white/[0.1] bg-slate-950/95 backdrop-blur-xl px-4 sm:px-6 py-3">
          <div class="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
            <div class="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
              <button onclick="app.navigateTo('edit')" class="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300 bg-white/[0.05] hover:bg-white/[0.1] transition">
                ✏️ Edit Data
              </button>
              <button onclick="app.navigateTo('templates')" class="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300 bg-white/[0.05] hover:bg-white/[0.1] transition">
                🎨 Templates
              </button>
            </div>

            <!-- Quick Switcher -->
            <div class="flex items-center gap-1 bg-white/[0.04] p-1 rounded-xl border border-white/[0.06] overflow-x-auto max-w-full">
              ${TEMPLATES_LIST.map(t => `
                <button
                  onclick="app.selectTemplate('${t.id}')"
                  class="px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition ${tmplId === t.id ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'}"
                >
                  ${t.name}
                </button>
              `).join('')}
            </div>

            <!-- Device Switchers and Publish CTA -->
            <div class="flex items-center gap-3 w-full md:w-auto justify-end">
              <div class="hidden sm:flex items-center bg-white/[0.04] p-1 rounded-xl border border-white/[0.06]">
                <button onclick="app.setDevice('desktop')" class="px-2.5 py-1 rounded text-xs ${this.previewDevice === 'desktop' ? 'bg-indigo-600 text-white' : 'text-slate-400'}" title="Desktop">🖥️</button>
                <button onclick="app.setDevice('tablet')" class="px-2.5 py-1 rounded text-xs ${this.previewDevice === 'tablet' ? 'bg-indigo-600 text-white' : 'text-slate-400'}" title="Tablet">📱 Tablet</button>
                <button onclick="app.setDevice('mobile')" class="px-2.5 py-1 rounded text-xs ${this.previewDevice === 'mobile' ? 'bg-indigo-600 text-white' : 'text-slate-400'}" title="Mobile">📱 Phone</button>
              </div>
              <button
                onclick="app.openPublishModal()"
                class="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white text-xs sm:text-sm font-bold shadow-lg shadow-emerald-500/25 transition hover:scale-105 active:scale-95"
              >
                🚀 Publish Portfolio
              </button>
            </div>
          </div>
        </header>

        <!-- Preview Canvas -->
        <div class="flex-1 overflow-auto p-4 sm:p-6 flex items-start justify-center bg-slate-900/60">
          <div class="w-full transition-all duration-300 shadow-2xl overflow-hidden ${
            this.previewDevice === 'desktop'
              ? 'max-w-7xl rounded-2xl border border-white/[0.08]'
              : this.previewDevice === 'tablet'
              ? 'max-w-[768px] rounded-3xl border-4 border-slate-800 my-4'
              : 'max-w-[390px] rounded-[36px] border-8 border-slate-800 my-4'
          }">
            ${renderedHtml}
          </div>
        </div>
      </div>
    `;
  }

  setDevice(device) {
    this.previewDevice = device;
    this.render();
  }

  openPublishModal() {
    this.isPublishModalOpen = true;
    this.renderModals();
  }

  closePublishModal() {
    this.isPublishModalOpen = false;
    this.renderModals();
  }

  openMySitesModal() {
    this.showMySitesModal = true;
    this.renderModals();
  }

  closeMySitesModal() {
    this.showMySitesModal = false;
    this.renderModals();
  }

  // Modals Overlay Renderer
  renderModals() {
    const modalContainer = document.getElementById('modal-container');
    if (!modalContainer) return;

    if (this.isPublishModalOpen) {
      const defaultSlug = sanitizeSlug(this.currentPortfolio.slug || this.currentPortfolio.name.split(' ')[0] || 'portfolio');
      const origin = window.location.origin;
      const existing = getPortfolioBySlug(defaultSlug);

      modalContainer.innerHTML = `
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in font-sans">
          <div class="bg-slate-900 border border-white/[0.1] rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl relative">
            <button onclick="app.closePublishModal()" class="absolute top-5 right-5 text-slate-400 hover:text-white text-lg">✕</button>

            <div class="space-y-2">
              <div class="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center text-xl">🌐</div>
              <h3 class="text-2xl font-bold text-white tracking-tight">Publish Your Portfolio</h3>
              <p class="text-xs text-slate-400">Choose your unique vanity name. Accessible instantly without login.</p>
            </div>

            <div class="space-y-2">
              <label class="text-xs font-semibold text-slate-300">Custom Portfolio Name / Slug *</label>
              <div class="flex items-center rounded-xl bg-slate-950 border border-white/[0.1] px-3.5 py-2.5">
                <span class="text-xs font-mono text-slate-500">/p/</span>
                <input
                  type="text"
                  id="publish-slug-input"
                  value="${defaultSlug}"
                  oninput="app.updatePublishPreview(this.value)"
                  class="w-full bg-transparent text-white text-sm font-mono focus:outline-none pl-1"
                  placeholder="e.g. rafeek"
                />
              </div>
              <div class="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-xs font-mono text-slate-300 flex items-center justify-between">
                <span id="publish-url-preview" class="truncate">${origin}/p/${defaultSlug}</span>
                <span class="text-[10px] uppercase px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Ready</span>
              </div>
            </div>

            <div id="publish-overwrite-notice" class="${existing ? '' : 'hidden'} p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200">
              <span class="font-semibold text-amber-300">Notice: Existing Portfolio</span>
              <p class="text-amber-400/90 text-[11px] mt-0.5">A portfolio with this name already exists. Publishing will overwrite it with your latest version.</p>
            </div>

            <div class="flex items-center gap-3 pt-2">
              <button onclick="app.closePublishModal()" class="w-1/3 py-3 rounded-xl bg-white/[0.05] text-xs font-semibold text-slate-300 hover:bg-white/[0.1]">Cancel</button>
              <button onclick="app.confirmPublish()" class="flex-1 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-xs sm:text-sm shadow-lg shadow-indigo-600/30">
                Confirm & Publish 🚀
              </button>
            </div>
          </div>
        </div>
      `;
      modalContainer.style.display = 'block';
      return;
    }

    if (this.showMySitesModal) {
      const all = getAllPortfolios();
      const list = Object.values(all);

      modalContainer.innerHTML = `
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in font-sans">
          <div class="bg-slate-900 border border-white/[0.1] rounded-3xl max-w-lg w-full p-6 space-y-6 shadow-2xl relative">
            <div class="flex items-center justify-between border-b border-white/[0.08] pb-4">
              <div class="flex items-center gap-2 text-white font-bold text-lg">
                <span>🌐</span>
                <h3>My Published Portfolios (${list.length})</h3>
              </div>
              <button onclick="app.closeMySitesModal()" class="text-slate-400 hover:text-white">✕</button>
            </div>

            ${list.length === 0 ? `
              <p class="text-sm text-slate-400 text-center py-6">No portfolios published yet.</p>
            ` : `
              <div class="space-y-3 max-h-72 overflow-y-auto pr-1">
                ${list.map(item => `
                  <div
                    onclick="app.closeMySitesModal(); app.navigateTo('published', '/p/${item.slug}')"
                    class="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-indigo-500/40 hover:bg-white/[0.06] transition flex items-center justify-between cursor-pointer group"
                  >
                    <div>
                      <h4 class="font-bold text-white text-sm group-hover:text-indigo-300">${escapeHtml(item.name || 'Portfolio')}</h4>
                      <p class="text-xs text-indigo-400 font-mono mt-0.5">/p/${item.slug}</p>
                      <p class="text-[11px] text-slate-500 mt-1 capitalize">Template: ${item.selectedTemplate}</p>
                    </div>
                    <div class="flex items-center gap-2">
                      <button onclick="event.stopPropagation(); app.closeMySitesModal(); app.editExisting('${item.slug}')" class="px-2.5 py-1 rounded bg-white/[0.06] hover:bg-white/[0.1] text-xs text-slate-300">Edit</button>
                      <button onclick="event.stopPropagation(); app.deletePortfolioItem('${item.slug}')" class="px-2.5 py-1 rounded bg-red-500/10 hover:bg-red-500/20 text-xs text-red-400">Delete</button>
                    </div>
                  </div>
                `).join('')}
              </div>
            `}

            <div class="pt-2 flex justify-end">
              <button onclick="app.closeMySitesModal()" class="px-4 py-2 rounded-xl bg-white/[0.08] text-xs font-semibold text-slate-300">Close</button>
            </div>
          </div>
        </div>
      `;
      modalContainer.style.display = 'block';
      return;
    }

    modalContainer.innerHTML = '';
    modalContainer.style.display = 'none';
  }

  updatePublishPreview(val) {
    const clean = sanitizeSlug(val);
    const origin = window.location.origin;
    const previewEl = document.getElementById('publish-url-preview');
    if (previewEl) previewEl.innerText = `${origin}/p/${clean}`;

    const notice = document.getElementById('publish-overwrite-notice');
    if (notice) {
      const existing = getPortfolioBySlug(clean);
      if (existing) {
        notice.classList.remove('hidden');
      } else {
        notice.classList.add('hidden');
      }
    }
  }

  confirmPublish() {
    const input = document.getElementById('publish-slug-input');
    const slug = sanitizeSlug(input?.value || 'portfolio');

    this.currentPortfolio.slug = slug;
    savePortfolio(this.currentPortfolio);

    this.isPublishModalOpen = false;
    this.renderModals();

    // Trigger celebration
    triggerConfetti();

    // Navigate to live URL
    this.publishedSlug = slug;
    this.navigateTo('published', `/p/${slug}`);
  }

  editExisting(slug) {
    const found = getPortfolioBySlug(slug);
    if (found) {
      this.currentPortfolio = found;
      this.navigateTo('edit');
    }
  }

  deletePortfolioItem(slug) {
    if (confirm(`Delete portfolio /p/${slug}?`)) {
      deletePortfolio(slug);
      this.renderModals();
      this.render();
    }
  }

  // View: Published Portfolio Page
  renderPublishedView(root) {
    const slug = this.publishedSlug;
    const data = getPortfolioBySlug(slug);

    if (!data) {
      // 404 Page
      root.innerHTML = `
        <div class="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 font-sans">
          <div class="max-w-md w-full text-center space-y-6 animate-fade-in">
            <div class="w-16 h-16 rounded-3xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto text-2xl">
              ⚠️
            </div>
            <div class="space-y-2">
              <span class="text-xs font-mono uppercase tracking-widest text-indigo-400">404 — Not Found</span>
              <h1 class="text-3xl font-extrabold text-white tracking-tight">Portfolio Not Found</h1>
              <p class="text-sm text-slate-400 leading-relaxed">
                No portfolio has been published under <code class="text-indigo-300 font-mono bg-indigo-500/10 px-1.5 py-0.5 rounded">/p/${escapeHtml(slug)}</code> in this browser session.
              </p>
            </div>
            <div class="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onclick="app.currentPortfolio.slug='${escapeHtml(slug)}'; app.navigateTo('upload')"
                class="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-indigo-500/25 transition"
              >
                Create This Portfolio →
              </button>
              <button
                onclick="app.navigateTo('landing')"
                class="w-full sm:w-auto px-5 py-3 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 font-medium text-xs sm:text-sm transition"
              >
                Home
              </button>
            </div>
          </div>
        </div>
      `;
      return;
    }

    const templateId = data.selectedTemplate || 'modern';
    const renderedHtml = renderTemplateByChoice(templateId, data);

    root.innerHTML = `
      <div class="relative">
        <!-- Floating Visitor & Owner Pill -->
        <div class="fixed bottom-5 right-5 z-50 flex items-center gap-2 p-1.5 rounded-full bg-slate-950/85 backdrop-blur-lg border border-white/[0.12] shadow-2xl text-xs font-sans animate-fade-in">
          <button
            onclick="app.navigateTo('landing')"
            class="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition shadow-sm"
          >
            <span>✦ Folix</span>
          </button>
          <button
            onclick="app.editExisting('${data.slug}')"
            class="flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/[0.08] hover:bg-white/[0.15] text-slate-200 transition"
          >
            <span>✏️ Edit</span>
          </button>
          <button
            onclick="navigator.clipboard.writeText(window.location.href); alert('Copied portfolio link to clipboard!');"
            class="p-1.5 px-2.5 rounded-full bg-white/[0.08] hover:bg-white/[0.15] text-slate-200 transition"
            title="Copy URL"
          >
            🔗 Share
          </button>
        </div>

        ${renderedHtml}
      </div>
    `;
  }
}

// Instantiate global application
let app;
window.addEventListener('DOMContentLoaded', () => {
  app = new PortfolioApp();
  window.app = app;
});

