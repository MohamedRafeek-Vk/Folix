import { TemplateMeta } from '../types/portfolio';

export const TEMPLATES_LIST: TemplateMeta[] = [
  {
    id: 'minimal',
    name: 'Minimal',
    badge: 'Clean & Editorial',
    description: 'A clean, uncluttered layout emphasizing elegant typography, thoughtful whitespace, and distraction-free presentation.',
    accentColor: '#18181b',
    idealFor: 'Software developers, writers, product managers, and consultants who appreciate simplicity.'
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
