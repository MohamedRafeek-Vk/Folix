import { PortfolioData, WorkExperience, Education, Project, Certification, SocialLinks } from '../types/portfolio';

export interface ParseResult {
  text: string;
  data: Partial<PortfolioData>;
  confidence: number;
}

export interface ExtractedDocument {
  text: string;
  profileImage?: string;
}

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') return reject(new Error('Window not available'));
    const existing = document.querySelector(`script[src="${src}"]`) as HTMLScriptElement;
    if (existing) {
      if ((window as any).pdfjsLib || (window as any).mammoth) {
        return resolve();
      }
      existing.addEventListener('load', () => resolve());
      existing.addEventListener('error', () => reject(new Error(`Failed to load ${src}`)));
      return;
    }
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.head.appendChild(script);
  });
}

async function ensurePdfJs(): Promise<any> {
  if (typeof window === 'undefined') return null;
  if ((window as any).pdfjsLib) {
    const pdfjs = (window as any).pdfjsLib;
    if (pdfjs.GlobalWorkerOptions && !pdfjs.GlobalWorkerOptions.workerSrc) {
      pdfjs.GlobalWorkerOptions.workerSrc = '/vendor/pdf.worker.min.js';
    }
    return pdfjs;
  }

  try {
    await loadScript('/vendor/pdf.min.js');
  } catch {
    try {
      await loadScript('https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js');
    } catch {
      // Ignore
    }
  }

  const pdfjs = (window as any).pdfjsLib;
  if (pdfjs && pdfjs.GlobalWorkerOptions) {
    pdfjs.GlobalWorkerOptions.workerSrc = '/vendor/pdf.worker.min.js';
  }
  return pdfjs;
}

async function ensureMammoth(): Promise<any> {
  if (typeof window === 'undefined') return null;
  if ((window as any).mammoth) {
    return (window as any).mammoth;
  }

  try {
    await loadScript('/vendor/mammoth.browser.min.js');
  } catch {
    try {
      await loadScript('https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.6.0/mammoth.browser.min.js');
    } catch {
      // Ignore
    }
  }

  return (window as any).mammoth;
}

interface PdfTextItem {
  str: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

function processPdfPageItems(items: any[]): string {
  const textItems: PdfTextItem[] = [];

  for (const item of items) {
    if (!item || typeof item.str !== 'string') continue;
    const str = item.str;
    if (!str) continue;

    const transform = item.transform || [1, 0, 0, 1, 0, 0];
    const x = transform[4] || 0;
    const y = transform[5] || 0;
    const width = item.width || 0;
    const height = item.height || 0;

    textItems.push({ str, x, y, width, height });
  }

  if (textItems.length === 0) return '';

  const minX = Math.min(...textItems.map(i => i.x));
  const maxX = Math.max(...textItems.map(i => i.x + i.width));
  const pageWidth = maxX - minX;

  const midX = minX + pageWidth * 0.38;
  const leftColItems = textItems.filter(i => i.x + i.width <= midX + 15);
  const rightColItems = textItems.filter(i => i.x >= midX - 15);

  const isTwoColumn = (
    pageWidth > 350 &&
    leftColItems.length > 8 &&
    rightColItems.length > 8 &&
    (leftColItems.length + rightColItems.length) >= textItems.length * 0.8
  );

  if (isTwoColumn) {
    const leftText = assembleColumnText(leftColItems);
    const rightText = assembleColumnText(rightColItems);
    return `${leftText}\n\n${rightText}`;
  }

  return assembleColumnText(textItems);
}

function assembleColumnText(items: PdfTextItem[]): string {
  if (items.length === 0) return '';

  const lineGroups: { y: number; items: PdfTextItem[] }[] = [];

  for (const item of items) {
    let placed = false;
    for (const group of lineGroups) {
      if (Math.abs(group.y - item.y) <= 3.5) {
        group.items.push(item);
        group.y = (group.y * (group.items.length - 1) + item.y) / group.items.length;
        placed = true;
        break;
      }
    }
    if (!placed) {
      lineGroups.push({ y: item.y, items: [item] });
    }
  }

  lineGroups.sort((a, b) => b.y - a.y);

  const lines: string[] = [];

  for (const group of lineGroups) {
    group.items.sort((a, b) => a.x - b.x);

    let lineStr = '';
    for (let i = 0; i < group.items.length; i++) {
      const cur = group.items[i];
      if (i === 0) {
        lineStr += cur.str;
      } else {
        const prev = group.items[i - 1];
        const gap = cur.x - (prev.x + prev.width);
        if (gap > 2 && !lineStr.endsWith(' ') && !cur.str.startsWith(' ')) {
          lineStr += ' ' + cur.str;
        } else {
          lineStr += cur.str;
        }
      }
    }

    const trimmed = lineStr.trim();
    if (trimmed) {
      lines.push(trimmed);
    }
  }

  return lines.join('\n');
}

export async function extractDocumentFromFile(file: File): Promise<ExtractedDocument> {
  const extension = file.name.split('.').pop()?.toLowerCase();
  let profileImage: string | undefined = undefined;

  if (extension === 'docx') {
    const mammoth = await ensureMammoth();
    if (mammoth) {
      try {
        const arrayBuffer = await file.arrayBuffer();

        let htmlResult: any = null;
        try {
          htmlResult = await mammoth.convertToHtml(
            { arrayBuffer },
            {
              convertImage: mammoth.images.imgElement((image: any) => {
                return image.read('base64').then((imageBuffer: string) => {
                  const dataUri = `data:${image.contentType};base64,${imageBuffer}`;
                  if (!profileImage && imageBuffer.length > 1000) {
                    profileImage = dataUri;
                  }
                  return { src: dataUri };
                });
              })
            }
          );
        } catch {
          // Ignore
        }

        if (htmlResult && htmlResult.value && htmlResult.value.length > 20) {
          const formatted = htmlResult.value
            .replace(/<\/h[1-6]>/gi, '\n\n')
            .replace(/<h[1-6][^>]*>/gi, '\n\n')
            .replace(/<\/li>/gi, '\n')
            .replace(/<li[^>]*>/gi, '• ')
            .replace(/<\/p>/gi, '\n')
            .replace(/<p[^>]*>/gi, '')
            .replace(/<br\s*\/?>/gi, '\n')
            .replace(/<\/tr>/gi, '\n')
            .replace(/<td[^>]*>/gi, ' ')
            .replace(/<[^>]+>/g, ' ')
            .replace(/&nbsp;/g, ' ')
            .replace(/&amp;/g, '&')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/[ \t]+/g, ' ')
            .replace(/\n\s*\n\s*\n/g, '\n\n')
            .trim();

          if (formatted.length >= 10) {
            return { text: formatted, profileImage };
          }
        }

        if (typeof mammoth.extractRawText === 'function') {
          const rawResult = await mammoth.extractRawText({ arrayBuffer });
          if (rawResult && rawResult.value && rawResult.value.trim().length >= 10) {
            return { text: rawResult.value.trim(), profileImage };
          }
        }
      } catch (err) {
        console.warn('Mammoth in-browser extraction error:', err);
      }
    }
  }

  if (extension === 'pdf') {
    const pdfjs = await ensurePdfJs();
    if (pdfjs && typeof pdfjs.getDocument === 'function') {
      try {
        const arrayBuffer = await file.arrayBuffer();
        const loadingTask = pdfjs.getDocument({
          data: new Uint8Array(arrayBuffer),
          useSystemFonts: true,
          disableFontFace: true
        });
        const pdfDoc = await loadingTask.promise;

        let fullText = '';
        for (let i = 1; i <= pdfDoc.numPages; i++) {
          const page = await pdfDoc.getPage(i);
          const textContent = await page.getTextContent();
          const pageLines = processPdfPageItems(textContent.items || []);
          fullText += pageLines + '\n\n';
        }

        if (fullText.trim().length >= 10) {
          return { text: fullText.trim(), profileImage };
        }
      } catch (err) {
        console.warn('PDF.js line-based extraction error:', err);
      }
    }
  }

  const plain = await file.text();
  return { text: plain, profileImage };
}

export async function extractTextFromFile(file: File): Promise<string> {
  const doc = await extractDocumentFromFile(file);
  return doc.text;
}

const SOFT_SKILLS_SET = new Set([
  'leadership', 'team leadership', 'communication', 'verbal communication', 'written communication',
  'collaboration', 'teamwork', 'team player', 'cross-functional collaboration', 'problem solving',
  'critical thinking', 'decision making', 'time management', 'organization', 'adaptability',
  'flexibility', 'mentorship', 'coaching', 'conflict resolution', 'negotiation', 'public speaking',
  'presentation skills', 'empathy', 'active listening', 'strategic thinking', 'strategic planning',
  'creativity', 'agile', 'scrum', 'project management', 'stakeholder management', 'work ethic',
  'emotional intelligence', 'team collaboration'
]);

const JOB_TITLE_WORDS = [
  'engineer', 'architect', 'developer', 'designer', 'manager', 'lead', 'consultant',
  'director', 'analyst', 'specialist', 'administrator', 'officer', 'scientist', 'researcher',
  'programmer', 'technician', 'coordinator', 'strategist', 'founder', 'vp', 'head of'
];

export function parseResumeText(rawText: string, profileImage?: string): Partial<PortfolioData> {
  const cleanRaw = rawText
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/[\u2013\u2014]/g, '—')
    .replace(/\t/g, ' ');

  const rawLines = cleanRaw
    .split('\n')
    .map(l => l.trim())
    .filter(l => l.length > 0);

  // 1. Extract Email Address
  const emailRegex = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/i;
  const emailMatch = cleanRaw.match(emailRegex);
  const email = emailMatch ? emailMatch[1].trim() : '';

  // 2. Extract Phone Number
  const phoneRegex = /(?:(?:\+?1\s*(?:[.-]\s*)?)?(?:\(\s*([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9])\s*\)|([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9]))\s*(?:[.-]\s*)?)?([2-9]1[02-9]|[2-9][02-9]1|[2-9][02-9]{2})\s*(?:[.-]\s*)?([0-9]{4})(?:\s*(?:#|x\.?|ext\.?|extension)\s*(\d+))?/i;
  const intlPhoneRegex = /(\+?\d{1,3}[-.\s]?)?(\(?\d{2,4}\)?[-.\s]?)?\d{3,5}[-.\s]?\d{4,5}/;
  const phoneMatch = cleanRaw.match(phoneRegex) || cleanRaw.match(intlPhoneRegex);
  const phone = phoneMatch && phoneMatch[0].length >= 10 ? phoneMatch[0].trim() : '';

  // 3. Extract Social Links
  const socialLinks: SocialLinks = {};
  if (email) socialLinks.email = email;

  const githubMatch = cleanRaw.match(/(?:https?:\/\/)?(?:www\.)?github\.com\/([a-zA-Z0-9_-]+)/i);
  if (githubMatch) {
    socialLinks.github = githubMatch[0].startsWith('http') ? githubMatch[0] : `https://${githubMatch[0]}`;
  }

  const linkedinMatch = cleanRaw.match(/(?:https?:\/\/)?(?:www\.)?linkedin\.com\/(?:in|pub)\/([a-zA-Z0-9_%\-]+)/i);
  if (linkedinMatch) {
    socialLinks.linkedin = linkedinMatch[0].startsWith('http') ? linkedinMatch[0] : `https://${linkedinMatch[0]}`;
  }

  const twitterMatch = cleanRaw.match(/(?:https?:\/\/)?(?:www\.)?(?:twitter\.com|x\.com)\/([a-zA-Z0-9_]+)/i);
  if (twitterMatch) {
    socialLinks.twitter = twitterMatch[0].startsWith('http') ? twitterMatch[0] : `https://${twitterMatch[0]}`;
  }

  // Extract personal portfolio / website (avoiding matching email domain like cloudtech.io or google.com)
  const emailDomain = email.split('@')[1]?.toLowerCase() || '';
  const websiteRegex = /(?:https?:\/\/)?(?:www\.)?([a-zA-Z0-9-]+\.(?:com|org|net|io|tech|dev|me|design|ai|cloud|site|app|uk))(?:\/[^\s,)|]*)?/gi;
  let wMatch: RegExpExecArray | null;
  while ((wMatch = websiteRegex.exec(cleanRaw)) !== null) {
    const fullMatch = wMatch[0];
    const domain = wMatch[1].toLowerCase();
    if (
      !domain.includes('github.com') &&
      !domain.includes('linkedin.com') &&
      !domain.includes('twitter.com') &&
      !domain.includes('x.com') &&
      domain !== emailDomain &&
      !domain.endsWith('gmail.com') &&
      !domain.endsWith('yahoo.com') &&
      !domain.endsWith('outlook.com') &&
      !domain.endsWith('hotmail.com')
    ) {
      socialLinks.website = fullMatch.startsWith('http') ? fullMatch : `https://${fullMatch}`;
      break;
    }
  }

  // 4. Extract Candidate Full Name
  let name = '';
  const headerDisqualifiers = [
    'curriculum vitae', 'resume', 'cv', 'contact', 'email', 'phone', 'portfolio', 'page 1', 'page 2',
    'summary', 'about', 'experience', 'education', 'skills', 'projects', 'certifications', 'history'
  ];

  for (let i = 0; i < Math.min(rawLines.length, 8); i++) {
    let line = rawLines[i].trim();
    line = line.replace(/^(?:Name|Full Name|Candidate)[:\-]\s*/i, '').trim();

    if (line.includes('|') || line.includes('•') || line.includes('—')) {
      const parts = line.split(/[|•—]/).map(s => s.trim());
      const candidate = cleanNameString(parts[0]);
      if (looksLikePersonName(candidate)) {
        name = candidate;
        break;
      }
    }

    const candidate = cleanNameString(line);
    if (looksLikePersonName(candidate)) {
      name = candidate;
      break;
    }
  }

  function cleanNameString(str: string): string {
    return str
      .replace(/,\s*(?:Ph\.?D|PMP|MBA|M\.S|B\.S|CPA|AWS|CISSP|M\.D).*$/i, '')
      .replace(/\s*\([^)]*\)/g, '')
      .replace(/^[|•—,\s]+|[|•—,\s]+$/g, '')
      .trim();
  }

  function looksLikePersonName(str: string): boolean {
    const lower = str.toLowerCase();
    if (headerDisqualifiers.some(h => lower === h || lower.startsWith(h + ':'))) return false;
    if (str.includes('@') || str.includes('http') || /\d{3}/.test(str)) return false;
    if (str.length < 3 || str.length > 40) return false;

    // Check if line is actually a job title rather than a name
    const hasJobTitle = JOB_TITLE_WORDS.some(w => lower.includes(w));
    if (hasJobTitle && !lower.startsWith('dr.') && !lower.startsWith('prof.')) return false;

    const words = str.split(/\s+/);
    if (words.length < 2 || words.length > 4) return false;
    return /^[a-zA-Z\s.'-]+$/.test(str);
  }

  // 5. Extract Location
  let location = '';
  const usStates = 'WA|CA|NY|TX|FL|IL|PA|OH|GA|NC|MI|NJ|VA|AZ|MA|TN|IN|MO|MD|WI|CO|MN|SC|AL|LA|KY|OR|OK|CT|UT|IA|NV|AR|MS|KS|NM|NE|WV|ID|HI|NH|ME|MT|RI|DE|SD|ND|AK|DC';
  const locRegex = new RegExp(`(?:[A-Za-z\\s]+,\\s*(?:${usStates})\\b(?:\\s+\\d{5})?|[A-Za-z\\s]+,\\s*(?:United States|USA|United Kingdom|UK|Canada|Germany|India|Australia|France|Remote|Hybrid))`, 'i');

  for (let i = 0; i < Math.min(rawLines.length, 12); i++) {
    const line = rawLines[i];
    // Exclude candidate name or credentials
    if (name && line.includes(name) && !line.includes('|') && !line.includes('•')) continue;
    if (line.includes('Ph.D') || line.includes('M.S.') || line.includes('University') || line.includes('College')) continue;

    const locMatch = line.match(locRegex);
    if (locMatch) {
      location = locMatch[0].trim().replace(/^[|•—,\s]+|[|•—,\s]+$/g, '');
      break;
    }
  }

  // 6. Identify Structured Sections
  const sections = identifySections(rawLines);

  // 7. Extract Profession / Job Role
  let profession = '';

  if (name && rawLines.length > 1) {
    const nameIndex = rawLines.findIndex(l => l.includes(name));
    if (nameIndex !== -1 && rawLines[nameIndex + 1]) {
      const candidateLine = rawLines[nameIndex + 1].trim();
      const lower = candidateLine.toLowerCase();
      if (
        !candidateLine.includes('@') &&
        !candidateLine.includes('http') &&
        !/\d{3}/.test(candidateLine) &&
        !headerDisqualifiers.some(h => lower === h || lower.startsWith(h + ':')) &&
        candidateLine.length >= 3 &&
        candidateLine.length <= 70
      ) {
        profession = candidateLine.split(/[|•]/)[0].trim();
      }
    }
  }

  if (!profession) {
    const roleRegex = /(?:Senior|Lead|Principal|Staff|Chief|Associate|Junior|Executive)?\s*(?:Software Engineer|Cloud Architect|Solutions Architect|Full Stack (?:Developer|Engineer)|Frontend (?:Developer|Engineer)|Backend (?:Developer|Engineer)|DevOps Engineer|Data Scientist|Data Engineer|AI (?:Research Scientist|Engineer)|Machine Learning Engineer|Product Designer|UX Designer|UI\/UX Designer|Product Manager|System Administrator|Mobile Developer|iOS Developer|Android Developer)/i;
    const match = cleanRaw.slice(0, 1000).match(roleRegex);
    if (match) {
      profession = match[0].trim();
    }
  }

  // 8. Extract Summary / About Me
  let summary = '';
  if (sections.summary && sections.summary.length > 0) {
    summary = sections.summary
      .filter(l => !/^(about|about me|summary|professional summary|executive summary|objective)[:\-]?$/i.test(l.trim()))
      .join(' ')
      .replace(/\s+/g, ' ')
      .trim();
  } else {
    for (let i = 2; i < Math.min(rawLines.length, 12); i++) {
      const line = rawLines[i];
      if (line.length > 80 && !line.includes('@') && !line.includes('http') && !line.includes('|')) {
        summary = line.replace(/\s+/g, ' ').trim();
        break;
      }
    }
  }

  // 9. Extract Skills (Technical & Soft)
  const technicalSkills: string[] = [];
  const softSkills: string[] = [];
  const allSkills: string[] = [];

  const rawSkillLines = [
    ...(sections.skills || []),
    ...(sections.techSkills || []),
    ...(sections.softSkills || [])
  ];

  for (const line of rawSkillLines) {
    const cleanLine = line.replace(/^(?:languages|frameworks|technologies|tools|databases|cloud|libraries|platforms|skills|core competencies)[:\-]\s*/i, '');
    const tokens = cleanLine.split(/[,•|·\/\t;]/).map(t => t.trim()).filter(Boolean);

    for (const token of tokens) {
      const cleaned = token
        .replace(/^[-*•·]\s*/, '')
        .replace(/[()]/g, '')
        .trim();

      if (cleaned.length > 1 && cleaned.length < 40 && !/^(skills|technical skills|technologies|tools)$/i.test(cleaned)) {
        if (!allSkills.some(s => s.toLowerCase() === cleaned.toLowerCase())) {
          allSkills.push(cleaned);

          if (SOFT_SKILLS_SET.has(cleaned.toLowerCase())) {
            softSkills.push(cleaned);
          } else {
            technicalSkills.push(cleaned);
          }
        }
      }
    }
  }

  // 10. Extract Work Experience
  const experience: WorkExperience[] = parseExperienceSection(sections.experience || []);

  if (!profession && experience.length > 0 && experience[0].role) {
    profession = experience[0].role;
  }

  // 11. Extract Education
  const education: Education[] = parseEducationSection(sections.education || []);

  // 12. Extract Projects
  const projects: Project[] = parseProjectsSection(sections.projects || []);

  // 13. Extract Certifications
  const certifications: Certification[] = parseCertificationsSection(sections.certifications || []);

  // 14. Extract Achievements / Awards
  const achievements: string[] = parseAchievementsSection(sections.achievements || []);

  // Ensure chronological ordering: most recent first
  sortExperienceDescending(experience);
  sortEducationDescending(education);

  return {
    name: name || '',
    profession: profession || 'Professional',
    summary,
    email,
    phone,
    location,
    profileImage: profileImage || undefined,
    skills: allSkills.slice(0, 30),
    technicalSkills: technicalSkills.slice(0, 24),
    softSkills: softSkills.slice(0, 12),
    socialLinks,
    experience,
    education,
    projects,
    certifications,
    achievements
  };
}

function identifySections(lines: string[]): Record<string, string[]> {
  const sections: Record<string, string[]> = {};
  let currentSection = '';

  const headerPatterns: Record<string, RegExp> = {
    summary: /^(about|about me|summary|professional summary|executive summary|profile|personal profile|objective|career objective|overview)$/i,
    techSkills: /^(technical skills|technologies|programming languages|tech stack|tools & technologies|technical proficiencies|hard skills)$/i,
    softSkills: /^(soft skills|interpersonal skills)$/i,
    skills: /^(skills|key skills|competencies|areas of expertise|proficiencies|skills & expertise|core competencies)$/i,
    experience: /^(experience|work experience|employment history|professional experience|work history|career history|relevant experience|professional background)$/i,
    education: /^(education|academic background|academics|qualifications|academic qualifications|educational background|degrees)$/i,
    projects: /^(projects|personal projects|key projects|selected projects|featured projects|technical projects|portfolio projects)$/i,
    certifications: /^(?:credentials|certifications|licenses|certificates|accreditations)(?:\s*(?:&|and)\s*(?:credentials|certifications|licenses|certificates|accreditations))?$/i,
    achievements: /^(achievements|awards|honors|awards & achievements|key achievements|honors & awards|accomplishments|recognitions)$/i
  };

  for (const line of lines) {
    const cleaned = line
      .replace(/^[\s#*•–—=_|:\[\]()\-0-9.]+/g, '')
      .replace(/[\s#*•–—=_|:\[\]()\-]+$/g, '')
      .trim();

    let foundHeader = false;

    if (cleaned.length >= 3 && cleaned.length <= 45) {
      for (const [key, pattern] of Object.entries(headerPatterns)) {
        if (pattern.test(cleaned)) {
          currentSection = key;
          if (!sections[currentSection]) {
            sections[currentSection] = [];
          }
          foundHeader = true;
          break;
        }
      }
    }

    if (!foundHeader && currentSection) {
      sections[currentSection].push(line);
    }
  }

  return sections;
}

const DATE_RANGE_REGEX = /(?:(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s*)?(?:19|20)\d{2}\s*(?:[-–—to\s]+)\s*(?:(?:(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s*)?(?:19|20)\d{2}|Present|Current|Ongoing)/i;

function parseExperienceSection(lines: string[]): WorkExperience[] {
  const experiences: WorkExperience[] = [];
  let current: Partial<WorkExperience> | null = null;

  const saveCurrent = () => {
    if (current && (current.role || current.company)) {
      const role = (current.role || 'Role').replace(/^[—–|-]\s*/, '').trim();
      const company = (current.company || '').replace(/^[—–|-]\s*/, '').trim();

      const isEducation = /(?:University|College|School of|Academy|Polytechnic)/i.test(company) && /(?:B\.S|M\.S|Bachelor|Master|Degree|Ph\.?D)/i.test(role);
      if (!isEducation) {
        experiences.push({
          id: `exp-${experiences.length + 1}`,
          role: role || 'Professional',
          company: company || 'Organization',
          location: current.location || '',
          startDate: current.startDate || '2021',
          endDate: current.endDate || 'Present',
          current: current.current ?? true,
          description: current.description ? current.description.trim() : '',
          highlights: current.highlights && current.highlights.length > 0 ? current.highlights : []
        });
      }
      current = null;
    }
  };

  const isBullet = (l: string) => /^[-•*·✦]\s*/.test(l);

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const dateMatch = line.match(DATE_RANGE_REGEX);
    const hasJobTitleWord = /(?:Architect|Engineer|Developer|Designer|Manager|Lead|Consultant|Director|Analyst|Specialist|Officer|Administrator|Intern|Programmer|Scientist|Researcher|Coordinator|Founder|Strategist|Writer)/i.test(line);

    if (dateMatch && !hasJobTitleWord && line.length < 35) {
      if (current) {
        const parsedDates = extractDates(dateMatch[0]);
        current.startDate = parsedDates.startDate;
        current.endDate = parsedDates.endDate;
        current.current = parsedDates.isCurrent;
      }
      continue;
    }

    const nextLineHasDate = (i + 1 < lines.length) && DATE_RANGE_REGEX.test(lines[i + 1]);

    if ((hasJobTitleWord && !isBullet(line)) || nextLineHasDate) {
      saveCurrent();

      let role = line;
      let company = '';
      let loc = '';
      let sDate = '2021';
      let eDate = 'Present';
      let isCurr = true;

      if (dateMatch) {
        const parsed = extractDates(dateMatch[0]);
        sDate = parsed.startDate;
        eDate = parsed.endDate;
        isCurr = parsed.isCurrent;
        role = role.replace(dateMatch[0], '').replace(/[(),]/g, ' ').trim();
      }

      const sepMatch = role.match(/^(.*?)\s*(?:[—–|]|\bat\b|@)\s*(.*?)$/i);
      if (sepMatch) {
        role = sepMatch[1].trim();
        company = sepMatch[2].trim();
      }

      const locMatch = company.match(/\(([^)]+)\)/) || role.match(/\(([^)]+)\)/);
      if (locMatch) {
        loc = locMatch[1].trim();
        company = company.replace(/\([^)]+\)/, '').trim();
        role = role.replace(/\([^)]+\)/, '').trim();
      }

      current = {
        role: role.replace(/^[—–|-]\s*/, '').trim(),
        company: company.replace(/^[—–|-]\s*/, '').trim(),
        location: loc,
        startDate: sDate,
        endDate: eDate,
        current: isCurr,
        description: '',
        highlights: []
      };

      if (i + 1 < lines.length && !company && !isBullet(lines[i + 1])) {
        const next = lines[i + 1].trim();
        if (!DATE_RANGE_REGEX.test(next) && next.length < 60) {
          current.company = next;
          i++;
        }
      }
      continue;
    }

    if (current) {
      if (isBullet(line)) {
        const cleanBullet = line.replace(/^[-•*·✦]\s*/, '').trim();
        if (cleanBullet) {
          current.highlights = current.highlights || [];
          current.highlights.push(cleanBullet);
        }
      } else {
        current.description = current.description ? `${current.description} ${line}` : line;
      }
    }
  }

  saveCurrent();
  return experiences;
}

function extractDates(dateStr: string): { startDate: string; endDate: string; isCurrent: boolean } {
  const parts = dateStr.split(/[-–—]|\bto\b/i).map(s => s.trim());
  const isCurrent = /present|current|ongoing/i.test(dateStr);
  const startDate = parts[0] || '2021';
  const endDate = isCurrent ? 'Present' : (parts[1] || '2023');
  return { startDate, endDate, isCurrent };
}

function parseEducationSection(lines: string[]): Education[] {
  const educations: Education[] = [];
  let current: Partial<Education> | null = null;

  const saveCurrent = () => {
    if (current && (current.degree || current.institution)) {
      educations.push({
        id: `edu-${educations.length + 1}`,
        degree: current.degree || 'Degree',
        institution: current.institution || 'University',
        location: current.location || '',
        endYear: current.endYear || '2020',
        fieldOfStudy: current.fieldOfStudy || ''
      });
      current = null;
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const hasDegree = /(?:Bachelor|Master|B\.S|B\.A|M\.S|M\.A|PhD|Ph\.D|Doctorate|Associate|Degree|Diploma|B\.E|B\.Tech|M\.Tech|High School)/i.test(line);
    const hasInst = /(?:University|College|Institute|School|Academy|Polytechnic)/i.test(line);
    const yearMatches = line.match(/(?:19|20)\d{2}/g);

    if (hasDegree || hasInst) {
      saveCurrent();

      let degree = '';
      let institution = '';
      let loc = '';
      let endYear = yearMatches ? yearMatches[yearMatches.length - 1] : '';

      const sepMatch = line.match(/^(.*?)\s*(?:[—–|]|\bat\b|\bfrom\b)\s*(.*?)$/i);
      if (sepMatch) {
        if (hasDegree && hasInst) {
          if (/(?:Bachelor|Master|B\.S|B\.A|M\.S|PhD|Ph\.D|Doctorate|Degree|Diploma|B\.E|B\.Tech)/i.test(sepMatch[1])) {
            degree = sepMatch[1].trim();
            institution = sepMatch[2].trim();
          } else {
            institution = sepMatch[1].trim();
            degree = sepMatch[2].trim();
          }
        } else if (hasDegree) {
          degree = sepMatch[1].trim();
          institution = sepMatch[2].trim();
        } else {
          institution = sepMatch[1].trim();
          degree = sepMatch[2].trim();
        }
      } else {
        if (hasDegree) degree = line;
        else institution = line;
      }

      const locMatch = (institution || degree).match(/\(([^)]+)\)/);
      if (locMatch) {
        loc = locMatch[1].trim();
        institution = institution.replace(/\([^)]+\)/, '').trim();
        degree = degree.replace(/\([^)]+\)/, '').trim();
      }

      degree = degree.replace(/(?:Graduated\s*)?(?:19|20)\d{2}/gi, '').trim();

      current = {
        degree: degree || 'Degree',
        institution: institution || 'University',
        location: loc,
        endYear: endYear || '2020'
      };
      continue;
    }

    if (current) {
      const yearInLine = line.match(/(?:19|20)\d{2}/);
      if (yearInLine && (!current.endYear || current.endYear === '2020')) {
        current.endYear = yearInLine[0];
      }
      if (hasInst && (!current.institution || current.institution === 'University')) {
        current.institution = line;
      }
    }
  }

  saveCurrent();
  return educations;
}

function parseProjectsSection(lines: string[]): Project[] {
  const projects: Project[] = [];
  let current: Partial<Project> | null = null;

  const saveCurrent = () => {
    if (current && current.title) {
      projects.push({
        id: `proj-${projects.length + 1}`,
        title: current.title.replace(/^[-•*·]\s*/, '').trim(),
        description: current.description ? current.description.trim() : '',
        technologies: current.technologies && current.technologies.length > 0 ? current.technologies : [],
        link: current.link,
        githubUrl: current.githubUrl,
        featured: true
      });
      current = null;
    }
  };

  const isBullet = (l: string) => /^[-•*·]\s*/.test(l);

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    if (/^(?:stack|technologies|built with|tools|tech stack)[:\-]/i.test(line)) {
      if (current) {
        const techStr = line.replace(/^(?:stack|technologies|built with|tools|tech stack)[:\-]\s*/i, '');
        const techs = techStr.split(/[,•|·/]/).map(t => t.trim()).filter(Boolean);
        current.technologies = Array.from(new Set([...(current.technologies || []), ...techs]));
      }
      continue;
    }

    const linkMatch = line.match(/(?:https?:\/\/[^\s]+)/i);
    if (linkMatch && current) {
      if (linkMatch[0].includes('github.com')) {
        current.githubUrl = linkMatch[0];
      } else {
        current.link = linkMatch[0];
      }
    }

    const looksLikeTitle = !isBullet(line) && line.length < 55 && !line.endsWith('.') && !/^(built with|technologies|stack|live demo|github|link)/i.test(line);

    if (looksLikeTitle && (!current || current.description || (current.technologies && current.technologies.length > 0))) {
      saveCurrent();
      current = {
        title: line,
        description: '',
        technologies: []
      };
      continue;
    }

    if (current) {
      if (isBullet(line)) {
        const cleanBullet = line.replace(/^[-•*·]\s*/, '').trim();
        current.description = current.description ? `${current.description}\n• ${cleanBullet}` : `• ${cleanBullet}`;
      } else {
        current.description = current.description ? `${current.description} ${line}` : line;
      }
    } else {
      current = {
        title: line,
        description: '',
        technologies: []
      };
    }
  }

  saveCurrent();
  return projects;
}

function parseCertificationsSection(lines: string[]): Certification[] {
  const certs: Certification[] = [];
  for (const line of lines) {
    const cleaned = line.replace(/^[-•*·✦]\s*/, '').trim();
    if (cleaned.length > 3) {
      const yearMatch = cleaned.match(/(?:19|20)\d{2}/);
      const year = yearMatch ? yearMatch[0] : '';

      let name = cleaned;
      let issuer = 'Certified Authority';

      const parenMatch = cleaned.match(/\(([^)]+)\)/);
      if (parenMatch) {
        const inside = parenMatch[1];
        name = cleaned.replace(/\([^)]+\)/, '').trim();
        const nonYear = inside.split(/[,•|]/).map(s => s.trim()).filter(s => !/(?:19|20)\d{2}/.test(s));
        if (nonYear.length > 0) {
          issuer = nonYear.join(', ');
        }
      } else {
        const parts = cleaned.split(/[-–—|]|\bby\b/i);
        if (parts.length > 1) {
          name = parts[0].trim();
          issuer = parts[1].trim();
        }
      }

      certs.push({
        id: `cert-${certs.length + 1}`,
        name: name.replace(/[-–—]+$/, '').trim(),
        issuer: issuer.replace(/(?:19|20)\d{2}/g, '').replace(/[,]/g, '').trim() || 'Certified Authority',
        date: year || '2023'
      });
    }
  }
  return certs;
}

function parseAchievementsSection(lines: string[]): string[] {
  const achievements: string[] = [];
  for (const line of lines) {
    const clean = line.replace(/^[-•*·✦]\s*/, '').trim();
    if (clean.length > 4) {
      achievements.push(clean);
    }
  }
  return achievements;
}

function sortExperienceDescending(list: WorkExperience[]): void {
  list.sort((a, b) => {
    const dateA = getExperienceDateWeight(a);
    const dateB = getExperienceDateWeight(b);
    return dateB - dateA;
  });
}

function getExperienceDateWeight(exp: WorkExperience): number {
  if (exp.current || /present|current|ongoing/i.test(exp.endDate || '')) {
    return 999999;
  }
  const yearMatch = (exp.endDate || exp.startDate || '').match(/(?:19|20)\d{2}/);
  return yearMatch ? parseInt(yearMatch[0], 10) * 100 : 0;
}

function sortEducationDescending(list: Education[]): void {
  list.sort((a, b) => {
    const yearA = (a.endYear || a.startYear || '').match(/(?:19|20)\d{2}/);
    const yearB = (b.endYear || b.startYear || '').match(/(?:19|20)\d{2}/);
    const valA = yearA ? parseInt(yearA[0], 10) : 0;
    const valB = yearB ? parseInt(yearB[0], 10) : 0;
    return valB - valA;
  });
}
