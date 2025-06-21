'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import type { Project, Snippet, DevDockData } from '@/lib/types';
import { loadData, saveData, DevDockDataSchema } from '@/lib/file-system';

type DevDockContextType = {
  projects: Project[];
  snippets: Snippet[];
  status: 'loading' | 'ready' | 'error';
  error: string | null;
  addProject: (project: Omit<Project, 'id'>) => Promise<void>;
  updateProject: (project: Project) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  addSnippet: (snippet: Omit<Snippet, 'id' | 'isFavorite'>) => Promise<void>;
  updateSnippet: (snippet: Snippet) => Promise<void>;
  deleteSnippet: (id: string) => Promise<void>;
  toggleSnippetFavorite: (id: string) => Promise<void>;
  exportData: () => string;
  importData: (jsonString: string) => Promise<void>;
  refreshData: () => Promise<void>;
};

const DevDockContext = createContext<DevDockContextType | undefined>(undefined);

export function DevDockDataProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<DevDockData>({ projects: [], snippets: [] });
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [error, setError] = useState<string | null>(null);

  const performLoadData = useCallback(async () => {
    setStatus('loading');
    try {
      const loadedData = await loadData();
      if (loadedData) {
        // Data migration for new fields
        const migratedData = {
            projects: loadedData.projects.map(p => ({
                ...p,
                tags: p.tags || [],
                scripts: p.scripts || [],
            })),
            snippets: loadedData.snippets.map(s => ({
                ...s,
                isFavorite: s.isFavorite || false,
            })),
        };
        setData(migratedData);
        setStatus('ready');
      } else {
        setData({ projects: [], snippets: [] });
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

  const updateAndSaveData = async (newData: DevDockData) => {
    try {
        await saveData(newData);
        setData(newData);
    } catch (err) {
        console.error(err);
        setError('Failed to save data.');
        setStatus('error');
        throw err;
    }
  };

  const addProject = async (projectData: Omit<Project, 'id'>) => {
    const newProject: Project = { ...projectData, id: crypto.randomUUID() };
    const newData = { ...data, projects: [...data.projects, newProject] };
    await updateAndSaveData(newData);
  };

  const updateProject = async (updatedProject: Project) => {
    const newData = {
      ...data,
      projects: data.projects.map((p) => (p.id === updatedProject.id ? updatedProject : p)),
    };
    await updateAndSaveData(newData);
  };

  const deleteProject = async (id: string) => {
    const newData = { ...data, projects: data.projects.filter((p) => p.id !== id) };
    await updateAndSaveData(newData);
  };
  
  const addSnippet = async (snippetData: Omit<Snippet, 'id' | 'isFavorite'>) => {
    const newSnippet: Snippet = { 
        ...snippetData, 
        id: crypto.randomUUID(),
        isFavorite: false 
    };
    const newData = { ...data, snippets: [...data.snippets, newSnippet] };
    await updateAndSaveData(newData);
  };
  
  const updateSnippet = async (updatedSnippet: Snippet) => {
    const newData = {
      ...data,
      snippets: data.snippets.map((s) => (s.id === updatedSnippet.id ? updatedSnippet : s)),
    };
    await updateAndSaveData(newData);
  };

  const toggleSnippetFavorite = async (id: string) => {
      const newData = {
          ...data,
          snippets: data.snippets.map((s) => s.id === id ? {...s, isFavorite: !s.isFavorite} : s)
      }
      await updateAndSaveData(newData);
  }
  
  const deleteSnippet = async (id: string) => {
    const newData = { ...data, snippets: data.snippets.filter((s) => s.id !== id) };
    await updateAndSaveData(newData);
  };

  const exportData = (): string => {
    return JSON.stringify(data, null, 2);
  };

  const importData = async (jsonString: string) => {
      try {
          const parsedData = JSON.parse(jsonString);
          const validatedData = DevDockDataSchema.parse(parsedData);
          await updateAndSaveData(validatedData);
      } catch (error) {
          console.error("Import error:", error);
          throw new Error("Invalid file format or content.");
      }
  };


  const value = {
    projects: data.projects,
    snippets: data.snippets,
    status,
    error,
    addProject,
    updateProject,
    deleteProject,
    addSnippet,
    updateSnippet,
    deleteSnippet,
    toggleSnippetFavorite,
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
