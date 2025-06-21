
'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import type { Project, Snippet, DevDockData, ActivityLogItem } from '@/lib/types';
import { loadData, saveData, DevDockDataSchema } from '@/lib/file-system';

type DevDockContextType = {
  projects: Project[];
  snippets: Snippet[];
  activityLog: ActivityLogItem[];
  status: 'loading' | 'ready' | 'error';
  error: string | null;
  addProject: (project: Omit<Project, 'id' | 'lastModified'>) => Promise<void>;
  updateProject: (project: Project) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  toggleProjectPin: (id: string) => Promise<void>;
  addSnippet: (snippet: Omit<Snippet, 'id'>) => Promise<void>;
  updateSnippet: (snippet: Snippet) => Promise<void>;
  deleteSnippet: (id: string) => Promise<void>;
  toggleSnippetPin: (id: string) => Promise<void>;
  exportData: () => string;
  importData: (jsonString: string) => Promise<void>;
  refreshData: () => Promise<void>;
};

const DevDockContext = createContext<DevDockContextType | undefined>(undefined);

const MAX_LOG_ENTRIES = 50;

export function DevDockDataProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<DevDockData>({ projects: [], snippets: [], activityLog: [] });
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [error, setError] = useState<string | null>(null);

  const performLoadData = useCallback(async () => {
    setStatus('loading');
    try {
      const loadedData = await loadData();
      if (loadedData) {
        // Data migration for new fields
        const now = new Date().toISOString();
        const migratedData = {
            projects: loadedData.projects.map(p => ({
                ...p,
                tags: p.tags || [],
                scripts: p.scripts || [],
                isPinned: p.isPinned || false,
                notes: p.notes || '',
                lastModified: p.lastModified || now,
            })),
            snippets: loadedData.snippets.map(s => ({
                ...s,
                isPinned: s.isPinned || false,
            })),
            activityLog: loadedData.activityLog || [],
        };
        setData(migratedData);
        setStatus('ready');
      } else {
        setData({ projects: [], snippets: [], activityLog: [] });
        setStatus('ready');
      }
    } catch (err) {
      console.error(err);
      setError('Failed to load data. See console for details.');
      setStatus('error');
    }
  }, []);

  useEffect(() => {
    performLoadData();
  }, [performLoadData]);

  const updateAndSaveData = async (newData: DevDockData, logMessage?: string) => {
    try {
        let finalData = { ...newData };
        if (logMessage) {
            const newLogEntry: ActivityLogItem = {
                id: crypto.randomUUID(),
                timestamp: new Date().toISOString(),
                message: logMessage,
            };
            const updatedLog = [newLogEntry, ...(finalData.activityLog || [])].slice(0, MAX_LOG_ENTRIES);
            finalData = { ...finalData, activityLog: updatedLog };
        }
        await saveData(finalData);
        setData(finalData);
    } catch (err) {
        console.error(err);
        setError('Failed to save data.');
        setStatus('error');
        throw err;
    }
  };

  const addProject = async (projectData: Omit<Project, 'id' | 'lastModified'>) => {
    const newProject: Project = { 
        ...projectData, 
        id: crypto.randomUUID(),
        lastModified: new Date().toISOString(),
    };
    const newData = { ...data, projects: [...data.projects, newProject] };
    await updateAndSaveData(newData, `Added project: "${newProject.name}"`);
  };

  const updateProject = async (updatedProject: Project) => {
    const projectWithTimestamp = { ...updatedProject, lastModified: new Date().toISOString() };
    const newData = {
      ...data,
      projects: data.projects.map((p) => (p.id === projectWithTimestamp.id ? projectWithTimestamp : p)),
    };
    await updateAndSaveData(newData, `Updated project: "${updatedProject.name}"`);
  };

  const deleteProject = async (id: string) => {
    const projectName = data.projects.find(p => p.id === id)?.name || 'Unknown';
    const newData = { ...data, projects: data.projects.filter((p) => p.id !== id) };
    await updateAndSaveData(newData, `Deleted project: "${projectName}"`);
  };

  const toggleProjectPin = async (id: string) => {
      const newData = {
          ...data,
          projects: data.projects.map((p) => p.id === id ? {...p, isPinned: !p.isPinned} : p)
      };
      await updateAndSaveData(newData);
  }
  
  const addSnippet = async (snippetData: Omit<Snippet, 'id' | 'isPinned'>) => {
    const newSnippet: Snippet = { 
        ...snippetData, 
        id: crypto.randomUUID(),
        isPinned: false 
    };
    const newData = { ...data, snippets: [...data.snippets, newSnippet] };
    await updateAndSaveData(newData, `Added snippet: "${newSnippet.title}"`);
  };
  
  const updateSnippet = async (updatedSnippet: Snippet) => {
    const newData = {
      ...data,
      snippets: data.snippets.map((s) => (s.id === updatedSnippet.id ? updatedSnippet : s)),
    };
    await updateAndSaveData(newData, `Updated snippet: "${updatedSnippet.title}"`);
  };

  const toggleSnippetPin = async (id: string) => {
      const newData = {
          ...data,
          snippets: data.snippets.map((s) => s.id === id ? {...s, isPinned: !s.isPinned} : s)
      }
      await updateAndSaveData(newData);
  }
  
  const deleteSnippet = async (id: string) => {
    const snippetTitle = data.snippets.find(s => s.id === id)?.title || 'Unknown';
    const newData = { ...data, snippets: data.snippets.filter((s) => s.id !== id) };
    await updateAndSaveData(newData, `Deleted snippet: "${snippetTitle}"`);
  };

  const exportData = (): string => {
    return JSON.stringify(data, null, 2);
  };

  const importData = async (jsonString: string) => {
      try {
          const parsedData = JSON.parse(jsonString);
          const validatedData = DevDockDataSchema.parse(parsedData);
          await updateAndSaveData(validatedData, "Imported data from file.");
      } catch (error) {
          console.error("Import error:", error);
          throw new Error("Invalid file format or content.");
      }
  };

  const value = {
    projects: data.projects,
    snippets: data.snippets,
    activityLog: data.activityLog || [],
    status,
    error,
    addProject,
    updateProject,
    deleteProject,
    toggleProjectPin,
    addSnippet,
    updateSnippet,
    deleteSnippet,
    toggleSnippetPin,
    exportData,
    importData,
    refreshData: performLoadData,
  };

  return <DevDockContext.Provider value={value}>{children}</DevDockContext.Provider>;
}

export function useDevDock() {
  const context = useContext(DevDockContext);
  if (context === undefined) {
    throw new Error('useDevDock must be used within a DevDockDataProvider');
  }
  return context;
}
