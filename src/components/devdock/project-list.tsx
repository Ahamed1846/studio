"use client";

import { useState, useMemo } from "react";
import { useDevDock } from "@/contexts/DevDockDataContext";
import { useUIState } from "@/contexts/UIStateContext";
import type { Project } from "@/lib/types";
import { ProjectCard } from "./project-card";
import { Button } from "@/components/ui/button";
import { PlusCircle, FileWarning, Search } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ProjectForm } from "./project-form";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorView } from "./shared-views";
import { Input } from "@/components/ui/input";

export function ProjectList() {
  const { projects, snippets, status, error, addProject, updateProject, deleteProject } = useDevDock();
  const { openDialog, editingProject, openProjectForm, closeDialog } = useUIState();
  const [searchTerm, setSearchTerm] = useState("");

  const handleFormSubmit = async (data: Omit<Project, "id">) => {
    if (editingProject) {
      await updateProject({ ...editingProject, ...data });
    } else {
      await addProject(data);
    }
    closeDialog();
  };

  const filteredProjects = useMemo(() => {
    if (status !== 'ready') return [];
    return projects.filter(
      (project) =>
        project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.tags.some((tag) =>
          tag.toLowerCase().includes(searchTerm.toLowerCase())
        )
    );
  }, [projects, searchTerm, status]);

  if (status === 'loading') {
    return (
      <div className="space-y-8">
         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="space-y-2">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-4 w-64" />
            </div>
            <div className="flex items-center gap-2 w-full md:w-auto">
                <Skeleton className="h-10 flex-grow" />
                <Skeleton className="h-10 w-36" />
            </div>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-52 rounded-lg" />)}
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return <ErrorView error={error} />;
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold font-headline">Projects</h2>
          <p className="mt-1 text-muted-foreground">Manage your local development projects.</p>
        </div>
        <div className="flex w-full items-center gap-2 md:w-auto">
             <div className="relative flex-grow md:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    type="search"
                    placeholder="Search projects by name or tag..."
                    className="w-full pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <Button onClick={() => openProjectForm()} className="shrink-0 bg-accent text-accent-foreground hover:bg-accent/90">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Project
            </Button>
        </div>
      </div>

      {projects.length > 0 && filteredProjects.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              allSnippets={snippets}
              onEdit={() => openProjectForm(project)}
              onDelete={deleteProject}
            />
          ))}
        </div>
      ) : (
         <div className="text-center py-20 border-2 border-dashed rounded-xl bg-card">
            <div className="flex justify-center items-center w-16 h-16 mx-auto bg-muted rounded-full mb-4">
              <FileWarning className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="mt-4 text-xl font-semibold">
              {searchTerm ? 'No Projects Found' : 'No Projects Yet'}
            </h3>
            <p className="mt-2 text-base text-muted-foreground">
              {searchTerm ? `Your search for "${searchTerm}" did not return any results.` : 'Get started by adding your first project.'}
            </p>
            <div className="mt-6">
                <Button onClick={() => openProjectForm()} className="bg-accent text-accent-foreground hover:bg-accent/90">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Project
                </Button>
            </div>
        </div>
      )}

      <Dialog 
        open={openDialog === 'addProject' || openDialog === 'editProject'} 
        onOpenChange={(isOpen) => !isOpen && closeDialog()}
      >
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>
              {editingProject ? "Edit Project" : "Add New Project"}
            </DialogTitle>
            <DialogDescription>
              {editingProject
                ? "Update the details of your project."
                : "Enter the details for your new project."}
            </DialogDescription>
          </DialogHeader>
          <ProjectForm
            project={editingProject}
            onSubmit={handleFormSubmit}
            onClose={closeDialog}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
