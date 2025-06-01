
"use server";
import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter'; // For potential markdown processing if ever needed
import {remark} from 'remark';
import html from 'remark-html';
import { BlogPost, Project, Service, HomepageContent, ContactInfo, ContactSubmission } from '@/lib/types';
import yaml from 'js-yaml';

// Base directory for data files
const dataDir = path.join(process.cwd(), 'src', 'data');

async function ensureDirExists(dirPath: string) {
  try {
    await fs.access(dirPath);
  } catch (error) {
    await fs.mkdir(dirPath, { recursive: true });
  }
}

// --- Generic File Operations ---
async function readFileContent<T>(filePath: string): Promise<T | null> {
  try {
    const fileContent = await fs.readFile(filePath, 'utf-8');
    if (filePath.endsWith('.json')) {
      return JSON.parse(fileContent) as T;
    } else if (filePath.endsWith('.yml') || filePath.endsWith('.yaml')) {
      return yaml.load(fileContent) as T;
    }
    // Add markdown/gray-matter parsing if needed later
    return null;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return null; // File not found
    }
    console.error(`Error reading file ${filePath}:`, error);
    throw new Error(`Could not read file ${filePath}.`);
  }
}

async function writeFileContent<T>(filePath: string, data: T): Promise<void> {
  try {
    let fileContent: string;
    if (filePath.endsWith('.json')) {
      fileContent = JSON.stringify(data, null, 2);
    } else if (filePath.endsWith('.yml') || filePath.endsWith('.yaml')) {
      fileContent = yaml.dump(data);
    } else {
      throw new Error('Unsupported file type for writing.');
    }
    await fs.writeFile(filePath, fileContent, 'utf-8');
  } catch (error) {
    console.error(`Error writing file ${filePath}:`, error);
    throw new Error(`Could not write file ${filePath}.`);
  }
}

// --- Collection Item Operations (Blog, Projects, Services) ---
// Assumes each item is a separate JSON file in its respective directory
// The filename (without .json) is used as the slug/ID.

export async function getAllCollectionItems<T extends { id: string; slug?: string }>(collectionName: 'blogPosts' | 'projects' | 'services'): Promise<T[]> {
  const collectionDir = path.join(dataDir, collectionName);
  await ensureDirExists(collectionDir);
  try {
    const fileNames = await fs.readdir(collectionDir);
    const items: T[] = [];
    for (const fileName of fileNames) {
      if (fileName.endsWith('.json')) {
        const filePath = path.join(collectionDir, fileName);
        const item = await readFileContent<Omit<T, 'id' | 'slug'>>(filePath); // Read raw data
        if (item) {
          const slugOrId = fileName.replace(/\.json$/, '');
          items.push({ 
            ...item, 
            id: (item as any).id || slugOrId, // Prioritize ID from content, else use filename
            slug: (item as any).slug || slugOrId // Prioritize slug from content, else use filename
          } as T);
        }
      }
    }
    // Sort blog posts by date, projects/services as needed
    if (collectionName === 'blogPosts') {
      return items.sort((a, b) => new Date((b as any).date).getTime() - new Date((a as any).date).getTime());
    }
    if (collectionName === 'projects') {
         return items.sort((a, b) => {
            const dateA = (a as any).dateCompleted ? new Date((a as any).dateCompleted).getTime() : 0;
            const dateB = (b as any).dateCompleted ? new Date((b as any).dateCompleted).getTime() : 0;
            return dateB - dateA;
        });
    }
    return items;
  } catch (error) {
    console.error(`Error reading collection ${collectionName}:`, error);
    return [];
  }
}

export async function getCollectionItemBySlugOrId<T extends { id: string; slug?: string }>(
  collectionName: 'blogPosts' | 'projects' | 'services',
  slugOrId: string
): Promise<T | null> {
  const filePath = path.join(dataDir, collectionName, `${slugOrId}.json`);
  const itemData = await readFileContent<Omit<T, 'id' | 'slug'>>(filePath);
  if (!itemData) return null;
  
  // Ensure id and slug are present, using filename as fallback
  return { 
    ...itemData, 
    id: (itemData as any).id || slugOrId,
    slug: (itemData as any).slug || slugOrId 
  } as T;
}


// Note: addItem, updateItem, deleteItem will be primarily handled by DecapCMS committing to Git.
// These server actions might still be useful for programmatic changes or if Decap is not used.
// For DecapCMS, the "source of truth" becomes Git, and these functions would reflect that.
// For now, these will operate on the local file system.

// Helper to create a slug from a title
function createSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w-]+/g, '') // Remove all non-word chars
    .replace(/--+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, ''); // Trim - from end of text
}

export async function addCollectionItem<T extends { id: string; title?: string; name?: string; slug?: string }>(
  collectionName: 'blogPosts' | 'projects' | 'services',
  itemData: Omit<T, 'id' | 'slug'>
): Promise<T> {
  const collectionDir = path.join(dataDir, collectionName);
  await ensureDirExists(collectionDir);
  
  const id = crypto.randomUUID();
  let slug = (itemData as any).slug || createSlug((itemData as any).title || (itemData as any).name || id);
  
  // Ensure slug is unique (simple check, might need more robust for high concurrency)
  let counter = 0;
  let uniqueSlug = slug;
  while (true) {
    try {
      await fs.access(path.join(collectionDir, `${uniqueSlug}.json`));
      counter++;
      uniqueSlug = `${slug}-${counter}`;
    } catch {
      slug = uniqueSlug;
      break;
    }
  }

  const newItem: T = { ...itemData, id, slug } as T;
  const filePath = path.join(collectionDir, `${slug}.json`);
  await writeFileContent(filePath, newItem);
  return newItem;
}

export async function updateCollectionItem<T extends { id: string; slug?: string }>(
  collectionName: 'blogPosts' | 'projects' | 'services',
  slugOrId: string, // Filename is slug/id
  itemData: Partial<T>
): Promise<T | null> {
  const collectionDir = path.join(dataDir, collectionName);
  const filePath = path.join(collectionDir, `${slugOrId}.json`);
  const existingItem = await readFileContent<T>(filePath);
  if (!existingItem) return null;

  // Ensure ID and slug are preserved or correctly updated if part of itemData
  const updatedItem = { 
    ...existingItem, 
    ...itemData,
    id: existingItem.id, // Keep original ID
    slug: existingItem.slug || slugOrId // Keep original slug or use filename
  };
  
  await writeFileContent(filePath, updatedItem);
  return updatedItem;
}

export async function deleteCollectionItem(
  collectionName: 'blogPosts' | 'projects' | 'services',
  slugOrId: string
): Promise<boolean> {
  const filePath = path.join(dataDir, collectionName, `${slugOrId}.json`);
  try {
    await fs.unlink(filePath);
    return true;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return false; // File not found
    }
    console.error(`Error deleting item ${slugOrId} from ${collectionName}:`, error);
    return false;
  }
}

// --- Single Object File Operations (Homepage, ContactInfo) ---
const SITE_CONFIG_DIR = 'siteConfig';

export async function getHomepageContent(): Promise<HomepageContent> {
  const filePath = path.join(dataDir, SITE_CONFIG_DIR, 'homepage.json');
  await ensureDirExists(path.join(dataDir, SITE_CONFIG_DIR));
  const defaultData: HomepageContent = { bio: "Default bio", professionalPhotoUrl: "", imageDataUri: "" };
  const data = await readFileContent<HomepageContent>(filePath);
  if (data) return data;
  await writeFileContent(filePath, defaultData); // Create with default if not exists
  return defaultData;
}

export async function updateHomepageContent(content: HomepageContent): Promise<HomepageContent> {
  const filePath = path.join(dataDir, SITE_CONFIG_DIR, 'homepage.json');
  await ensureDirExists(path.join(dataDir, SITE_CONFIG_DIR));
  await writeFileContent(filePath, content);
  return content;
}

export async function getContactInfo(): Promise<ContactInfo> {
  const filePath = path.join(dataDir, SITE_CONFIG_DIR, 'contactInfo.json');
  await ensureDirExists(path.join(dataDir, SITE_CONFIG_DIR));
  const defaultData: ContactInfo = { email: "default@example.com", phone: "", address: "", businessHours: "Mon-Fri: 9am-5pm" };
  const data = await readFileContent<ContactInfo>(filePath);
  if (data) return data;
  await writeFileContent(filePath, defaultData);
  return defaultData;
}

export async function updateContactInfo(info: ContactInfo): Promise<ContactInfo> {
  const filePath = path.join(dataDir, SITE_CONFIG_DIR, 'contactInfo.json');
  await ensureDirExists(path.join(dataDir, SITE_CONFIG_DIR));
  await writeFileContent(filePath, info);
  return info;
}


// --- Contact Submissions (still an array, as it's a log) ---
const CONTACT_SUBMISSIONS_FILE = 'contactSubmissions.json';

export async function getAllContactSubmissions(): Promise<ContactSubmission[]> {
  const filePath = path.join(dataDir, CONTACT_SUBMISSIONS_FILE);
  await ensureDirExists(dataDir); // ensure data dir itself exists
  const data = await readFileContent<ContactSubmission[]>(filePath);
  if (data) return data;
  await writeFileContent(filePath, []); // Create empty array if not exists
  return [];
}

export async function addContactSubmission(submission: Omit<ContactSubmission, 'id' | 'submittedAt'>): Promise<ContactSubmission> {
  const submissions = await getAllContactSubmissions();
  const newSubmission: ContactSubmission = {
    ...submission,
    id: crypto.randomUUID(),
    submittedAt: new Date().toISOString(),
  };
  submissions.push(newSubmission);
  const filePath = path.join(dataDir, CONTACT_SUBMISSIONS_FILE);
  await writeFileContent(filePath, submissions);
  return newSubmission;
}

// Helper for blog post content rendering (Markdown to HTML)
export async function processMarkdown(markdownContent: string): Promise<string> {
  const processedContent = await remark().use(html).process(markdownContent);
  return processedContent.toString();
}
