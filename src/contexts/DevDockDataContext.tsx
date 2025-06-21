'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import type { Project, Snippet, DevDockData } from '@/lib/types';
import { loadData, saveData } from '@/lib/file-system';

type DevDockContextType = {
  projects: Project[];
  snippets: Snippet[];
  status: 'loading' | 'ready' | 'error';
  error: string | null;
  addProject: (project: Omit<Project, 'id'>) => Promise<void>;
  updateProject: (project: Project) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  addSnippet: (snippet: Snippet) => Promise<void>;
  updateSnippet: (snippet: Snippet) => Promise<void>;
  deleteSnippet: (id: string) => Promise<void>;
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
        setData(loadedData);
        setStatus('ready');
      } else {
        // This case should ideally not be hit with IndexedDB unless there's an error.
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

  const updateData = async (newData: DevDockData) => {
    try {
        await saveData(newData);
        setData(newData);
    } catch (err) {
        console.error(err);
        setError('Failed to save data.');
        setStatus('error');
    }
  };

  const addProject = async (projectData: Omit<Project, 'id'>) => {
    const newProject: Project = { ...projectData, id: crypto.randomUUID() };
    const newData = { ...data, projects: [...data.projects, newProject] };
    await updateData(newData);
  };

  const updateProject = async (updatedProject: Project) => {
    const newData = {
      ...data,
      projects: data.projects.map((p) => (p.id === updatedProject.id ? updatedProject : p)),
    };
    await updateData(newData);
  };

  const deleteProject = async (id: string) => {
    const newData = { ...data, projects: data.projects.filter((p) => p.id !== id) };
    await updateData(newData);
  };
  
  const addSnippet = async (snippet: Snippet) => {
    const newData = { ...data, snippets: [...data.snippets, snippet] };
    await updateData(newData);
  };
  
  const updateSnippet = async (updatedSnippet: Snippet) => {
    const newData = {
      ...data,
      snippets: data.snippets.map((s) => (s.id === updatedSnippet.id ? updatedSnippet : s)),
    };
    await updateData(newData);
  };
  
  const deleteSnippet = async (id: string) => {
    const newData = { ...data, snippets: data.snippets.filter((s) => s.id !== id) };
    await updateData(newData);
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
    deleteSnippet
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
