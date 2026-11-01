import { PortfolioData } from '../types/portfolio';
import { SAMPLE_RESUMES } from '../data/sampleResumes';

const PRIMARY_STORAGE_KEY = 'folix_portfolios';
const LEGACY_STORAGE_KEY = 'portfolioai_portfolios';

export function getAllPortfolios(): Record<string, PortfolioData> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(PRIMARY_STORAGE_KEY) || localStorage.getItem(LEGACY_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (err) {
    console.error('Failed to read portfolios from localStorage:', err);
    return {};
  }
}

export function sanitizeSlug(input: string): string {
  if (!input) return 'portfolio';
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '') || 'portfolio';
}

export function getPublicPortfolioUrl(slug: string): string {
  const clean = sanitizeSlug(slug);

  if (typeof window !== 'undefined') {
    // If deployed and not on localhost, use actual browser origin
    if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
      return `${window.location.origin}/p/${clean}`;
    }

    // Check if an explicit production environment variable is defined
    if (process.env.NEXT_PUBLIC_SITE_URL) {
      return `${process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, '')}/p/${clean}`;
    }
    if (process.env.NEXT_PUBLIC_VERCEL_URL) {
      return `https://${process.env.NEXT_PUBLIC_VERCEL_URL.replace(/\/$/, '')}/p/${clean}`;
    }

    return `${window.location.origin}/p/${clean}`;
  }

  const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://folix.vercel.app';
  return `${base.replace(/\/$/, '')}/p/${clean}`;
}

export function getPortfolioBySlug(slug: string): PortfolioData | null {
  if (!slug) return null;
  const cleanSlug = sanitizeSlug(slug);

  // 1. Built-in sample routes
  if (cleanSlug === 'rafeek') {
    const s = SAMPLE_RESUMES.softwareEngineer;
    return {
      id: 'sample-rafeek',
      slug: 'rafeek',
      name: s.name || 'Mohamed Rafeek',
      profession: s.profession || 'Senior Full Stack & AI Engineer',
      summary: s.summary || '',
      email: s.email || '',
      phone: s.phone || '',
      location: s.location || '',
      skills: s.skills || [],
      technicalSkills: s.skills || [],
      softSkills: [],
      experience: s.experience || [],
      education: s.education || [],
      projects: s.projects || [],
      certifications: s.certifications || [],
      socialLinks: s.socialLinks || {},
      selectedTemplate: 'modern',
      publishedAt: '2024-01-01T00:00:00.000Z'
    };
  }

  if (cleanSlug === 'elena') {
    const s = SAMPLE_RESUMES.productDesigner;
    return {
      id: 'sample-elena',
      slug: 'elena',
      name: s.name || 'Elena Rostova',
      profession: s.profession || 'Principal Product & UX Designer',
      summary: s.summary || '',
      email: s.email || '',
      phone: s.phone || '',
      location: s.location || '',
      skills: s.skills || [],
      technicalSkills: s.skills || [],
      softSkills: [],
      experience: s.experience || [],
      education: s.education || [],
      projects: s.projects || [],
      certifications: s.certifications || [],
      socialLinks: s.socialLinks || {},
      selectedTemplate: 'creative',
      publishedAt: '2024-01-01T00:00:00.000Z'
    };
  }

  // 2. Check localStorage cache
  const all = getAllPortfolios();
  if (all[cleanSlug]) return all[cleanSlug];

  return null;
}

export async function fetchPublishedPortfolio(slug: string, idParam?: string): Promise<PortfolioData | null> {
  if (!slug) return null;
  const cleanSlug = sanitizeSlug(slug);

  // 1. First attempt to fetch from server / persistent cloud API
  try {
    const query = idParam ? `?id=${encodeURIComponent(idParam)}` : '';
    const res = await fetch(`/api/portfolios/${encodeURIComponent(cleanSlug)}${query}`, {
      cache: 'no-store'
    });

    if (res.ok) {
      const data = (await res.json()) as PortfolioData;
      if (data && data.slug) {
        // Cache in localStorage for offline resiliency
        if (typeof window !== 'undefined') {
          try {
            const all = getAllPortfolios();
            all[cleanSlug] = data;
            localStorage.setItem(PRIMARY_STORAGE_KEY, JSON.stringify(all));
          } catch {
            // Ignore cache write error
          }
        }
        return data;
      }
    }
  } catch (err) {
    console.warn(`Failed to fetch /api/portfolios/${cleanSlug}:`, err);
  }

  // 2. Fallback to local storage or sample data
  return getPortfolioBySlug(cleanSlug);
}

export async function savePortfolio(data: PortfolioData): Promise<{ success: boolean; overwritten: boolean }> {
  const cleanSlug = sanitizeSlug(data.slug);
  const all = getAllPortfolios();
  const alreadyExists = !!all[cleanSlug];

  const toStore: PortfolioData = {
    ...data,
    slug: cleanSlug,
    publishedAt: alreadyExists ? (all[cleanSlug].publishedAt || new Date().toISOString()) : new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  // 1. Save to local storage for instant creator access
  if (typeof window !== 'undefined') {
    try {
      all[cleanSlug] = toStore;
      localStorage.setItem(PRIMARY_STORAGE_KEY, JSON.stringify(all));
    } catch (err) {
      console.warn('LocalStorage save failed:', err);
    }
  }

  // 2. Save to persistent server & cloud storage via API
  let serverSuccess = false;
  try {
    const res = await fetch('/api/portfolios', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(toStore)
    });

    if (res.ok) {
      serverSuccess = true;
      const json = await res.json();
      if (json && json.id) {
        toStore.id = json.id;
        if (typeof window !== 'undefined') {
          try {
            all[cleanSlug] = toStore;
            localStorage.setItem(PRIMARY_STORAGE_KEY, JSON.stringify(all));
          } catch {
            // Ignore
          }
        }
      }
    }
  } catch (err) {
    console.warn('Server API save failed, saved in local cache:', err);
  }

  return { success: true, overwritten: alreadyExists };
}

export async function deletePortfolio(slug: string): Promise<boolean> {
  const cleanSlug = sanitizeSlug(slug);

  // 1. Remove from local storage
  if (typeof window !== 'undefined') {
    try {
      const all = getAllPortfolios();
      if (all[cleanSlug]) {
        delete all[cleanSlug];
        localStorage.setItem(PRIMARY_STORAGE_KEY, JSON.stringify(all));
      }
    } catch (err) {
      console.error('Failed to delete portfolio from localStorage:', err);
    }
  }

  // 2. Remove from server
  try {
    await fetch(`/api/portfolios/${encodeURIComponent(cleanSlug)}`, {
      method: 'DELETE'
    });
  } catch (err) {
    console.warn('Failed to delete portfolio on server:', err);
  }

  return true;
}
