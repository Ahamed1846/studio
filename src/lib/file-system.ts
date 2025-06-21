'use client';

import type { DevDockData } from './types';

const DB_NAME = 'devdock-db-v2';
const STORE_NAME = 'file-handles';
const FILE_NAME = '.devdock.json';

// --- IndexedDB Helpers ---

function getDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = () => {
      request.result.createObjectStore(STORE_NAME);
    };
  });
}

async function setHandle(key: string, value: any) {
  const db = await getDb();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  tx.objectStore(STORE_NAME).put(value, key);
  return new Promise<void>((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

async function getHandle(key: string): Promise<any | undefined> {
  const db = await getDb();
  const tx = db.transaction(STORE_NAME, 'readonly');
  const store = tx.objectStore(STORE_NAME);
  const request = store.get(key);
  return new Promise((resolve) => {
    request.onsuccess = () => resolve(request.result);
  });
}

// --- File System Access API Helpers ---

const defaultData: DevDockData = {
  projects: [],
  snippets: [],
};

async function verifyPermission(fileHandle: FileSystemHandle, readWrite = false) {
    const options: FileSystemHandlePermissionDescriptor = {};
    if (readWrite) {
        options.mode = 'readwrite';
    }
    if ((await fileHandle.queryPermission(options)) === 'granted') {
        return true;
    }
    if ((await fileHandle.requestPermission(options)) === 'granted') {
        return true;
    }
    return false;
}

export async function getDirectoryHandle(prompt = false): Promise<FileSystemDirectoryHandle | null> {
    if (typeof window === 'undefined' || !window.showDirectoryPicker) {
        return null;
    }

    let dirHandle = await getHandle('directory');

    if (dirHandle && !prompt) {
        if (await verifyPermission(dirHandle, true)) {
            return dirHandle;
        }
    }
    
    if (prompt) {
        try {
            dirHandle = await window.showDirectoryPicker({
                mode: 'readwrite',
            });
            await setHandle('directory', dirHandle);
            return dirHandle;
        } catch (error) {
            if ((error as DOMException).name === 'AbortError') {
                return null;
            }
            throw error;
        }
    }
    
    return null;
}

export async function loadDataFromFile(): Promise<DevDockData | null> {
    const dirHandle = await getDirectoryHandle();
    if (!dirHandle) {
        return null;
    }

    try {
        const fileHandle = await dirHandle.getFileHandle(FILE_NAME, { create: false });
        const file = await fileHandle.getFile();
        const content = await file.text();
        return JSON.parse(content);
    } catch (error) {
        if ((error as DOMException).name === 'NotFoundError') {
            await saveDataToFile(defaultData);
            return defaultData;
        }
        console.error('Error reading file:', error);
        throw error;
    }
}

export async function saveDataToFile(data: DevDockData): Promise<void> {
    const dirHandle = await getDirectoryHandle(true);
    if (!dirHandle) {
        throw new Error("Directory handle not available. User may have denied permission.");
    }
    
    const fileHandle = await dirHandle.getFileHandle(FILE_NAME, { create: true });
    const writable = await fileHandle.createWritable();
    await writable.write(JSON.stringify(data, null, 2));
    await writable.close();
}
