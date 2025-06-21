
'use client';

import type { DevDockData } from './types';
import { z } from 'zod';

const DB_NAME = 'devdock-v2-db';
const STORE_NAME = 'data-store';
const DATA_KEY = 'devdock-data';

// --- Zod Schemas for Validation ---
const ScriptSchema = z.object({
  id: z.string(),
  name: z.string(),
  command: z.string(),
  isPinned: z.boolean().default(false).optional(),
});

const ProjectSchema = z.object({
  id: z.string(),
  name: z.string(),
  path: z.string(),
  githubUrl: z.string().url().optional().or(z.literal('')),
  tags: z.array(z.string()).default([]),
  scripts: z.array(ScriptSchema).default([]),
  notes: z.string().default('').optional(),
  isPinned: z.boolean().default(false).optional(),
  lastModified: z.string(),
});

const SnippetSchema = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string(),
  tags: z.array(z.string()).default([]),
  isFavorite: z.boolean().optional(), // For migrating old data
  isPinned: z.boolean().optional(),
}).transform((data) => {
    // If isFavorite exists and isPinned doesn't, migrate it.
    if (data.isFavorite !== undefined && data.isPinned === undefined) {
        data.isPinned = data.isFavorite;
    }
    delete data.isFavorite;
    return { ...data, isPinned: data.isPinned ?? false };
});

const ActivityLogItemSchema = z.object({
    id: z.string(),
    timestamp: z.string(),
    message: z.string(),
});

export const DevDockDataSchema = z.object({
  projects: z.array(ProjectSchema).default([]),
  snippets: z.array(SnippetSchema).default([]),
  activityLog: z.array(ActivityLogItemSchema).default([]).optional(),
});


// --- IndexedDB Helpers ---

function getDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
  });
}

async function saveDataToDb(key: string, value: any) {
  const db = await getDb();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  tx.objectStore(STORE_NAME).put(value, key);
  return new Promise<void>((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

async function loadDataFromDb<T>(key: string): Promise<T | undefined> {
  const db = await getDb();
  const tx = db.transaction(STORE_NAME, 'readonly');
  const store = tx.objectStore(STORE_NAME);
  const request = store.get(key);
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// --- Data Management Functions ---

const defaultData: DevDockData = {
  projects: [],
  snippets: [],
  activityLog: [],
};

export async function loadData(): Promise<DevDockData> {
  if (typeof window === 'undefined') {
    return defaultData;
  }
  try {
    const data = await loadDataFromDb<DevDockData>(DATA_KEY);
    // If no data is found, initialize with default data
    if (!data) {
      await saveData(defaultData);
      return defaultData;
    }
    // Validate and parse data to ensure it conforms to the latest schema
    return DevDockDataSchema.parse(data);
  } catch (error) {
    console.error('Failed to load or parse data from IndexedDB, returning default data.', error);
    // In case of parsing error, might be good to backup old data before resetting
    return defaultData;
  }
}

export async function saveData(data: DevDockData): Promise<void> {
   if (typeof window === 'undefined') {
    return;
  }
  try {
    await saveDataToDb(DATA_KEY, data);
  } catch (error) {
    console.error('Failed to save data to IndexedDB.', error);
    throw error;
  }
}
