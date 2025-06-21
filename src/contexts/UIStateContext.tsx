'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import type { Project, Snippet } from '@/lib/types';

type Dialogs = 'addProject' | 'editProject' | 'addSnippet' | 'editSnippet' | 'projectDetails' | 'activityLog' | null;

interface UIStateContextType {
  openDialog: Dialogs;
  editingProject: Project | null;
  editingSnippet: Snippet | null;
  showCommandPalette: boolean;
  
  openProjectForm: (project?: Project | null) => void;
  openSnippetForm: (snippet?: Snippet | null) => void;
  openProjectDetails: (project: Project) => void;
  openActivityLog: () => void;
  closeDialog: () => void;
  setShowCommandPalette: (show: boolean) => void;
}

const UIStateContext = createContext<UIStateContextType | undefined>(undefined);

export function UIStateProvider({ children }: { children: ReactNode }) {
  const [openDialog, setOpenDialog] = useState<Dialogs>(null);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [editingSnippet, setEditingSnippet] = useState<Snippet | null>(null);
  const [showCommandPalette, setShowCommandPalette] = useState(false);

  const openProjectForm = (project: Project | null = null) => {
    setEditingProject(project);
    setOpenDialog(project ? 'editProject' : 'addProject');
  };
  
  const openSnippetForm = (snippet: Snippet | null = null) => {
    setEditingSnippet(snippet);
    setOpenDialog(snippet ? 'editSnippet' : 'addSnippet');
  };
  
  const openProjectDetails = (project: Project) => {
    setEditingProject(project);
    setOpenDialog('projectDetails');
  };

  const openActivityLog = () => {
    setOpenDialog('activityLog');
  };

  const closeDialog = () => {
    setOpenDialog(null);
    setEditingProject(null);
    setEditingSnippet(null);
  };
  
  const value = {
    openDialog,
    editingProject,
    editingSnippet,
    showCommandPalette,
    openProjectForm,
    openSnippetForm,
    openProjectDetails,
    openActivityLog,
    closeDialog,
    setShowCommandPalette,
  };

  return <UIStateContext.Provider value={value}>{children}</UIStateContext.Provider>;
}

export function useUIState() {
  const context = useContext(UIStateContext);
  if (!context) {
    throw new Error('useUIState must be used within a UIStateProvider');
  }
  return context;
}
