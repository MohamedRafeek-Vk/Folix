export type TemplateType = 'minimal' | 'modern' | 'developer' | 'creative' | 'professional';

export interface WorkExperience {
  id: string;
  role: string;
  company: string;
  location?: string;
  startDate: string;
  endDate: string;
  current?: boolean;
  description: string;
  highlights?: string[];
}

export interface Education {
  id: string;
  degree: string;
  institution: string;
  location?: string;
  startYear?: string;
  endYear: string;
  fieldOfStudy?: string;
  gpa?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  link?: string;
  githubUrl?: string;
  featured?: boolean;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date?: string;
  credentialUrl?: string;
}

export interface SocialLinks {
  github?: string;
  linkedin?: string;
  website?: string;
  twitter?: string;
  email?: string;
}

export interface PortfolioData {
  id?: string;
  slug: string; // url friendly name e.g. "rafeek"
  name: string;
  profession: string;
  summary: string;
  email: string;
  phone?: string;
  location?: string;
  skills: string[];
  experience: WorkExperience[];
  education: Education[];
  projects: Project[];
  certifications: Certification[];
  socialLinks: SocialLinks;
  selectedTemplate: TemplateType;
  publishedAt: string;
  updatedAt?: string;
}

export interface TemplateMeta {
  id: TemplateType;
  name: string;
  badge: string;
  description: string;
  accentColor: string;
  previewImage?: string;
  idealFor: string;
}
