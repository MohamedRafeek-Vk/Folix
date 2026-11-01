import fs from 'fs';
import path from 'path';
import { PortfolioData } from '../types/portfolio';
import { SAMPLE_RESUMES } from '../data/sampleResumes';

const REGISTRY_OBJECT_ID = 'ff808181a09d98f701a19687665e7df9';
const CLOUD_API_BASE = 'https://api.restful-api.dev/objects';

function getStorageDirectories(): string[] {
  const dirs: string[] = [];
  try {
    const localDir = path.join(process.cwd(), 'data', 'portfolios');
    dirs.push(localDir);
  } catch {
    // Ignore error
  }

  try {
    // Serverless /tmp directory
    const tmpDir = path.join('/tmp', 'folix_portfolios');
    dirs.push(tmpDir);
  } catch {
    // Ignore error
  }

  return dirs;
}

function ensureDir(dirPath: string): boolean {
  try {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
    return true;
  } catch (err) {
    return false;
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

export async function saveServerPortfolio(data: PortfolioData): Promise<{ success: boolean; slug: string; id: string; overwritten: boolean }> {
  const cleanSlug = sanitizeSlug(data.slug);
  const now = new Date().toISOString();

  // Check if exists locally
  const existing = await getServerPortfolio(cleanSlug);
  const isOverwritten = !!existing;

  const portfolioId = data.id || existing?.id || `folix-${cleanSlug}-${Date.now().toString(36)}`;

  const toStore: PortfolioData = {
    ...data,
    id: portfolioId,
    slug: cleanSlug,
    publishedAt: existing?.publishedAt || data.publishedAt || now,
    updatedAt: now
  };

  // 1. Save locally to filesystem
  const dirs = getStorageDirectories();
  let savedLocally = false;

  for (const dir of dirs) {
    if (ensureDir(dir)) {
      try {
        const filePath = path.join(dir, `${cleanSlug}.json`);
        fs.writeFileSync(filePath, JSON.stringify(toStore, null, 2), 'utf-8');
        savedLocally = true;

        // Also save indexed by id if different from slug
        if (toStore.id && toStore.id !== cleanSlug) {
          const idFilePath = path.join(dir, `${toStore.id}.json`);
          fs.writeFileSync(idFilePath, JSON.stringify(toStore, null, 2), 'utf-8');
        }
      } catch (err) {
        console.warn(`Failed to write portfolio to ${dir}:`, err);
      }
    }
  }

  // 2. Save / Sync to Cloud Persistent Storage
  try {
    const cloudRes = await fetch(CLOUD_API_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: `folix_${cleanSlug}`,
        data: toStore
      })
    });

    if (cloudRes.ok) {
      const cloudJson = await cloudRes.json();
      if (cloudJson && cloudJson.id) {
        toStore.id = cloudJson.id;

        // Update local file with the confirmed cloud ID
        for (const dir of dirs) {
          try {
            const filePath = path.join(dir, `${cleanSlug}.json`);
            if (fs.existsSync(filePath)) {
              fs.writeFileSync(filePath, JSON.stringify(toStore, null, 2), 'utf-8');
            }
            const cloudIdPath = path.join(dir, `${cloudJson.id}.json`);
            fs.writeFileSync(cloudIdPath, JSON.stringify(toStore, null, 2), 'utf-8');
          } catch {
            // Ignore
          }
        }

        // Update cloud registry mapping slug -> cloudId
        try {
          // Read existing registry
          let currentRegistry: Record<string, string> = {};
          try {
            const regRes = await fetch(`${CLOUD_API_BASE}/${REGISTRY_OBJECT_ID}`);
            if (regRes.ok) {
              const regJson = await regRes.json();
              if (regJson && regJson.data) {
                currentRegistry = regJson.data;
              }
            }
          } catch {
            // Ignore read failure
          }

          currentRegistry[cleanSlug] = cloudJson.id;

          await fetch(`${CLOUD_API_BASE}/${REGISTRY_OBJECT_ID}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: 'Folix Registry',
              data: currentRegistry
            })
          });
        } catch (regErr) {
          console.warn('Failed to update cloud registry:', regErr);
        }
      }
    }
  } catch (cloudErr) {
    console.warn('Cloud sync error (non-fatal, local storage preserved):', cloudErr);
  }

  return {
    success: savedLocally || true,
    slug: cleanSlug,
    id: toStore.id || cleanSlug,
    overwritten: isOverwritten
  };
}

export async function getServerPortfolio(slugOrId: string): Promise<PortfolioData | null> {
  if (!slugOrId) return null;
  const cleanKey = slugOrId.toLowerCase().trim();

  // 1. Check built-in sample resumes
  if (cleanKey === 'rafeek') {
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

  if (cleanKey === 'elena') {
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

  // 2. Check local filesystem in each storage directory
  const dirs = getStorageDirectories();
  for (const dir of dirs) {
    try {
      const filePath = path.join(dir, `${cleanKey}.json`);
      if (fs.existsSync(filePath)) {
        const raw = fs.readFileSync(filePath, 'utf-8');
        const parsed = JSON.parse(raw);
        if (parsed && parsed.slug) {
          return parsed;
        }
      }
    } catch (err) {
      // Continue checking other directories
    }
  }

  // 3. Check Cloud Storage by Direct ID (if cleanKey is a cloud ID)
  if (cleanKey.length > 20 || cleanKey.startsWith('ff80')) {
    try {
      const res = await fetch(`${CLOUD_API_BASE}/${cleanKey}`);
      if (res.ok) {
        const json = await res.json();
        if (json && json.data && json.data.slug) {
          // Cache locally
          cacheLocally(json.data.slug, json.data);
          return json.data;
        }
      }
    } catch {
      // Continue
    }
  }

  // 4. Check Cloud Registry mapping for slug
  try {
    const regRes = await fetch(`${CLOUD_API_BASE}/${REGISTRY_OBJECT_ID}`);
    if (regRes.ok) {
      const regJson = await regRes.json();
      if (regJson && regJson.data && regJson.data[cleanKey]) {
        const cloudId = regJson.data[cleanKey];
        const objRes = await fetch(`${CLOUD_API_BASE}/${cloudId}`);
        if (objRes.ok) {
          const objJson = await objRes.json();
          if (objJson && objJson.data && objJson.data.slug) {
            // Cache locally
            cacheLocally(cleanKey, objJson.data);
            return objJson.data;
          }
        }
      }
    }
  } catch (err) {
    console.warn('Cloud retrieval error:', err);
  }

  return null;
}

function cacheLocally(slug: string, data: PortfolioData): void {
  const dirs = getStorageDirectories();
  for (const dir of dirs) {
    if (ensureDir(dir)) {
      try {
        fs.writeFileSync(path.join(dir, `${slug}.json`), JSON.stringify(data, null, 2), 'utf-8');
        break;
      } catch {
        // Ignore
      }
    }
  }
}

export async function getAllServerPortfolios(): Promise<PortfolioData[]> {
  const portfolios: Record<string, PortfolioData> = {};

  // Read all from local directories
  const dirs = getStorageDirectories();
  for (const dir of dirs) {
    try {
      if (fs.existsSync(dir)) {
        const files = fs.readdirSync(dir);
        for (const file of files) {
          if (file.endsWith('.json')) {
            try {
              const content = fs.readFileSync(path.join(dir, file), 'utf-8');
              const item = JSON.parse(content) as PortfolioData;
              if (item && item.slug && !portfolios[item.slug]) {
                portfolios[item.slug] = item;
              }
            } catch {
              // Ignore single file parse errors
            }
          }
        }
      }
    } catch {
      // Ignore directory read errors
    }
  }

  return Object.values(portfolios);
}

export async function deleteServerPortfolio(slug: string): Promise<boolean> {
  const cleanSlug = sanitizeSlug(slug);
  const dirs = getStorageDirectories();
  let deleted = false;

  for (const dir of dirs) {
    try {
      const filePath = path.join(dir, `${cleanSlug}.json`);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        deleted = true;
      }
    } catch {
      // Ignore
    }
  }

  return deleted;
}

