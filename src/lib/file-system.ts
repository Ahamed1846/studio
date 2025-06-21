'use client';

import type { DevDockData } from './types';

const DB_NAME = 'devdock-data-db';
const STORE_NAME = 'data-store';
const DATA_KEY = 'devdock-data';

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
    return data;
  } catch (error) {
    console.error('Failed to load data from IndexedDB, returning default data.', error);
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
