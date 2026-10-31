import { PortfolioData, WorkExperience, Education, Project, Certification, SocialLinks } from '../types/portfolio';
import * as mammoth from 'mammoth';
import * as pdfjsLib from 'pdfjs-dist';

// Configure pdfjs worker
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
}

export interface ParseResult {
  text: string;
  data: Partial<PortfolioData>;
  confidence: number;
}

export async function extractTextFromFile(file: File): Promise<string> {
  const extension = file.name.split('.').pop()?.toLowerCase();

  if (extension === 'docx') {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value;
  } else if (extension === 'pdf') {
    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;
    let fullText = '';

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(' ');
      fullText += pageText + '\n\n';
    }
    return fullText;
  } else {
    // Fallback for txt or other raw text files
    return await file.text();
  }
}

export function parseResumeText(rawText: string): Partial<PortfolioData> {
  const lines = rawText
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(line => line.length > 0);

  // 1. Extract Email
  const emailRegex = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/i;
  const emailMatch = rawText.match(emailRegex);
  const email = emailMatch ? emailMatch[1].trim() : '';

  // 2. Extract Phone
  const phoneRegex = /(?:(?:\+?1\s*(?:[.-]\s*)?)?(?:\(\s*([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9])\s*\)|([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9]))\s*(?:[.-]\s*)?)?([2-9]1[02-9]|[2-9][02-9]1|[2-9][02-9]{2})\s*(?:[.-]\s*)?([0-9]{4})(?:\s*(?:#|x\.?|ext\.?|extension)\s*(\d+))?/i;
  const genericPhoneRegex = /(\+?\d{1,3}[-.\s]?)?(\(?\d{3}\)?[-.\s]?)?\d{3}[-.\s]?\d{4}/;
  const phoneMatch = rawText.match(phoneRegex) || rawText.match(genericPhoneRegex);
  const phone = phoneMatch && phoneMatch[0].length >= 10 ? phoneMatch[0].trim() : '';

  // 3. Extract Links
  const socialLinks: SocialLinks = {};
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

  // 4. Extract Full Name
  let name = '';
  // Top lines usually contain name; filter out common resume headers
  const blacklistHeaders = ['curriculum vitae', 'resume', 'cv', 'contact', 'email', 'phone', 'portfolio', 'page 1'];
  for (let i = 0; i < Math.min(lines.length, 6); i++) {
    const line = lines[i];
    const lower = line.toLowerCase();
    if (
      !blacklistHeaders.some(h => lower.includes(h)) &&
      !line.includes('@') &&
      !line.includes('http') &&
      !/\d{3}/.test(line) &&
      line.length >= 3 &&
      line.length <= 45 &&
      /^[a-zA-Z\s.'-]+$/.test(line)
    ) {
      name = line;
      break;
    }
  }

  // 5. Extract Profession / Title
  let profession = '';
  const titleKeywords = [
    'Software Engineer', 'Full Stack Developer', 'Frontend Developer', 'Backend Developer',
    'Product Designer', 'UX Designer', 'UI/UX Designer', 'Data Scientist', 'Machine Learning Engineer',
    'DevOps Engineer', 'Cloud Architect', 'Product Manager', 'Solutions Architect', 'Web Developer',
    'Mobile Developer', 'iOS Developer', 'Android Developer', 'Systems Engineer'
  ];

  for (const kw of titleKeywords) {
    if (rawText.toLowerCase().includes(kw.toLowerCase())) {
      profession = kw;
      break;
    }
  }

  if (!profession && lines.length > 1) {
    // Try the line right after name
    for (let i = 0; i < Math.min(lines.length, 5); i++) {
      if (lines[i] === name && lines[i + 1]) {
        const next = lines[i + 1];
        if (!next.includes('@') && !next.includes('http') && next.length < 50) {
          profession = next;
        }
        break;
      }
    }
  }

  // 6. Extract Location
  let location = '';
  const locationMatch = rawText.match(/([A-Z][a-zA-Z\s.-]+,\s*[A-Z]{2}(?:\s+\d{5})?|[A-Z][a-zA-Z\s.-]+,\s*(?:United States|Canada|United Kingdom|Germany|India|Australia|France|Remote))/);
  if (locationMatch) {
    location = locationMatch[0].trim();
  }

  // 7. Extract Sections
  const sections = identifySections(lines);

  // Parse Summary
  let summary = '';
  if (sections.summary) {
    summary = sections.summary.join(' ').replace(/\s+/g, ' ').trim();
  } else {
    // If no explicit summary header, look for a descriptive paragraph near the top
    for (let i = 0; i < Math.min(lines.length, 10); i++) {
      const line = lines[i];
      if (line.length > 80 && !line.includes('@') && !line.includes('http')) {
        summary = line;
        break;
      }
    }
  }

  // Parse Skills
  const skills: string[] = [];
  if (sections.skills) {
    const skillText = sections.skills.join(', ');
    const tokens = skillText.split(/[,•|·\/\n\t;]/).map(s => s.trim()).filter(s => s.length > 1 && s.length < 35);
    for (const token of tokens) {
      const cleaned = token.replace(/^[-*•]\s*/, '').trim();
      if (cleaned && !skills.includes(cleaned) && !/^(skills|technologies|tools|competencies)$/i.test(cleaned)) {
        skills.push(cleaned);
      }
    }
  }

  // Parse Experience
  const experience: WorkExperience[] = parseExperienceSection(sections.experience || []);

  // Parse Education
  const education: Education[] = parseEducationSection(sections.education || []);

  // Parse Projects
  const projects: Project[] = parseProjectsSection(sections.projects || []);

  // Parse Certifications
  const certifications: Certification[] = parseCertificationsSection(sections.certifications || []);

  return {
    name,
    profession,
    summary,
    email,
    phone,
    location,
    skills: skills.slice(0, 24),
    socialLinks,
    experience,
    education,
    projects,
    certifications
  };
}

function identifySections(lines: string[]): Record<string, string[]> {
  const sections: Record<string, string[]> = {};
  let currentSection = '';

  const headerPatterns: Record<string, RegExp> = {
    summary: /^(about|summary|professional summary|profile|objective|overview)$/i,
    experience: /^(experience|work experience|employment history|professional experience|work history)$/i,
    education: /^(education|academic background|academics|qualifications)$/i,
    skills: /^(skills|technical skills|technologies|competencies|tools & technologies)$/i,
    projects: /^(projects|personal projects|key projects|selected projects)$/i,
    certifications: /^(certifications|licenses|certifications & licenses|credentials)$/i
  };

  for (const line of lines) {
    const cleaned = line.replace(/[:\-#_]/g, '').trim();
    let foundHeader = false;

    for (const [key, pattern] of Object.entries(headerPatterns)) {
      if (pattern.test(cleaned)) {
        currentSection = key;
        sections[currentSection] = [];
        foundHeader = true;
        break;
      }
    }

    if (!foundHeader && currentSection) {
      sections[currentSection].push(line);
    }
  }

  return sections;
}

function parseExperienceSection(lines: string[]): WorkExperience[] {
  const experiences: WorkExperience[] = [];
  let current: Partial<WorkExperience> | null = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    // Check if line looks like dates (e.g. 2020 - 2023 or Jan 2021 – Present)
    const dateMatch = line.match(/(?:(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s*)?(?:19|20)\d{2}\s*[-–—to]+\s*(?:(?:(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s*)?(?:19|20)\d{2}|Present|Current)/i);

    if (dateMatch || (line.length < 50 && (line.includes('Senior') || line.includes('Lead') || line.includes('Engineer') || line.includes('Developer') || line.includes('Manager') || line.includes('Designer')))) {
      if (current && (current.role || current.company)) {
        experiences.push({
          id: `exp-${experiences.length + 1}`,
          role: current.role || 'Role',
          company: current.company || 'Organization',
          startDate: current.startDate || '2021',
          endDate: current.endDate || 'Present',
          current: current.current ?? true,
          description: current.description || '',
          highlights: current.highlights || []
        });
      }

      const isCurrent = /present|current/i.test(line);
      const dates = dateMatch ? dateMatch[0].split(/[-–—to]+/) : ['2021', 'Present'];

      current = {
        role: line.replace(dateMatch ? dateMatch[0] : '', '').trim() || 'Software Professional',
        company: '',
        startDate: dates[0]?.trim() || '2021',
        endDate: dates[1]?.trim() || (isCurrent ? 'Present' : '2023'),
        current: isCurrent,
        description: '',
        highlights: []
      };

      // If next line has company name
      if (lines[i + 1] && lines[i + 1].length < 45 && !lines[i + 1].startsWith('-') && !lines[i + 1].startsWith('•')) {
        current.company = lines[i + 1];
        i++;
      }
    } else if (current) {
      if (line.startsWith('•') || line.startsWith('-') || line.startsWith('*')) {
        current.highlights = current.highlights || [];
        current.highlights.push(line.replace(/^[-•*]\s*/, '').trim());
      } else {
        current.description = current.description ? `${current.description} ${line}` : line;
      }
    }
  }

  if (current && (current.role || current.company)) {
    experiences.push({
      id: `exp-${experiences.length + 1}`,
      role: current.role || 'Role',
      company: current.company || 'Organization',
      startDate: current.startDate || '2021',
      endDate: current.endDate || 'Present',
      current: current.current ?? true,
      description: current.description || '',
      highlights: current.highlights || []
    });
  }

  return experiences;
}

function parseEducationSection(lines: string[]): Education[] {
  const educations: Education[] = [];
  let current: Partial<Education> | null = null;

  for (const line of lines) {
    if (/(?:Bachelor|Master|B\.S|B\.A|M\.S|PhD|Doctorate|Associate|Degree|Diploma)/i.test(line) || /(?:University|College|Institute|School|Academy)/i.test(line)) {
      if (current && (current.degree || current.institution)) {
        educations.push({
          id: `edu-${educations.length + 1}`,
          degree: current.degree || 'Degree',
          institution: current.institution || 'University',
          endYear: current.endYear || '2020'
        });
      }

      const yearMatch = line.match(/(?:19|20)\d{2}/);
      current = {
        degree: /(?:Bachelor|Master|B\.S|B\.A|M\.S|PhD|Doctorate)/i.test(line) ? line : 'Degree in Computer Science',
        institution: /(?:University|College|Institute)/i.test(line) ? line : 'University',
        endYear: yearMatch ? yearMatch[0] : '2020'
      };
    } else if (current) {
      if (/(?:University|College|Institute)/i.test(line) && !current.institution) {
        current.institution = line;
      }
    }
  }

  if (current && (current.degree || current.institution)) {
    educations.push({
      id: `edu-${educations.length + 1}`,
      degree: current.degree || 'Bachelor of Science',
      institution: current.institution || 'University',
      endYear: current.endYear || '2020'
    });
  }

  return educations;
}

function parseProjectsSection(lines: string[]): Project[] {
  const projects: Project[] = [];
  let current: Partial<Project> | null = null;

  for (const line of lines) {
    if (line.length < 50 && !line.startsWith('•') && !line.startsWith('-') && !line.startsWith('*')) {
      if (current && current.title) {
        projects.push({
          id: `proj-${projects.length + 1}`,
          title: current.title,
          description: current.description || '',
          technologies: current.technologies || [],
          featured: true
        });
      }
      current = {
        title: line,
        description: '',
        technologies: []
      };
    } else if (current) {
      if (line.toLowerCase().includes('technologies:') || line.toLowerCase().includes('stack:')) {
        const techStr = line.split(/[:\-]/)[1] || '';
        current.technologies = techStr.split(/[,•|]/).map(t => t.trim()).filter(Boolean);
      } else {
        current.description = current.description ? `${current.description} ${line}` : line;
      }
    }
  }

  if (current && current.title) {
    projects.push({
      id: `proj-${projects.length + 1}`,
      title: current.title,
      description: current.description || '',
      technologies: current.technologies || [],
      featured: true
    });
  }

  return projects;
}

function parseCertificationsSection(lines: string[]): Certification[] {
  const certs: Certification[] = [];
  for (const line of lines) {
    const cleaned = line.replace(/^[-•*]\s*/, '').trim();
    if (cleaned.length > 3) {
      const parts = cleaned.split(/[-–—|by]/);
      certs.push({
        id: `cert-${certs.length + 1}`,
        name: parts[0]?.trim() || cleaned,
        issuer: parts[1]?.trim() || 'Verified Organization',
        date: cleaned.match(/(?:19|20)\d{2}/)?.[0] || '2023'
      });
    }
  }
  return certs;
}
