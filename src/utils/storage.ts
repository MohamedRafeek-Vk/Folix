import { PortfolioData } from '../types/portfolio';

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

export function getPortfolioBySlug(slug: string): PortfolioData | null {
  if (!slug) return null;
  const cleanSlug = slug.toLowerCase().trim();
  const all = getAllPortfolios();
  return all[cleanSlug] || null;
}

export function savePortfolio(data: PortfolioData): { success: boolean; overwritten: boolean } {
  try {
    const cleanSlug = data.slug.toLowerCase().trim();
    const all = getAllPortfolios();
    const alreadyExists = !!all[cleanSlug];

    const toStore: PortfolioData = {
      ...data,
      slug: cleanSlug,
      publishedAt: alreadyExists ? (all[cleanSlug].publishedAt || new Date().toISOString()) : new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    all[cleanSlug] = toStore;
    localStorage.setItem(PRIMARY_STORAGE_KEY, JSON.stringify(all));
    return { success: true, overwritten: alreadyExists };
  } catch (err) {
    console.error('Failed to save portfolio to localStorage:', err);
    return { success: false, overwritten: false };
  }
}

export function deletePortfolio(slug: string): boolean {
  try {
    const cleanSlug = slug.toLowerCase().trim();
    const all = getAllPortfolios();
    if (all[cleanSlug]) {
      delete all[cleanSlug];
      localStorage.setItem(PRIMARY_STORAGE_KEY, JSON.stringify(all));
      return true;
    }
    return false;
  } catch (err) {
    console.error('Failed to delete portfolio:', err);
    return false;
  }
}

export function sanitizeSlug(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9-]/g, '-') // Replace non-alphanumeric with hyphen
    .replace(/-+/g, '-')         // Collapse repeated hyphens
    .replace(/^-|-$/g, '');       // Trim leading/trailing hyphens
}
