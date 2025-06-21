"use client";

import { useState } from "react";
import { useLocalStorage } from "@/hooks/use-local-storage";
import type { Project } from "@/lib/types";
import { ProjectCard } from "./project-card";
import { Button } from "@/components/ui/button";
import { PlusCircle, FileWarning } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ProjectForm } from "./project-form";
import { initialProjects } from "@/lib/constants";
import { Skeleton } from "@/components/ui/skeleton";

export function ProjectList() {
  const [projects, setProjects, isInitialized] = useLocalStorage<Project[]>("devdock-projects", initialProjects);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const handleAddProject = () => {
    setEditingProject(null);
    setIsDialogOpen(true);
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setIsDialogOpen(true);
  };

  const handleDeleteProject = (id: string) => {
    setProjects(projects.filter((p) => p.id !== id));
  };

  const handleFormSubmit = (data: Omit<Project, "id">) => {
    if (editingProject) {
      setProjects(
        projects.map((p) => (p.id === editingProject.id ? { ...p, ...data } : p))
      );
    } else {
      setProjects([...projects, { id: crypto.randomUUID(), ...data }]);
    }
    setIsDialogOpen(false);
    setEditingProject(null);
  };

  if (!isInitialized) {
    return (
      <div className="space-y-8">
         <div className="flex justify-between items-center">
            <div className="space-y-2">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-4 w-64" />
            </div>
            <Skeleton className="h-10 w-36" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-48 rounded-lg" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold font-headline">Projects</h2>
          <p className="mt-1 text-sm text-muted-foreground">Manage your local development projects.</p>
        </div>
        <Button onClick={handleAddProject} className="shrink-0 bg-accent text-accent-foreground hover:bg-accent/90">
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Project
        </Button>
      </div>

      {projects.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onEdit={handleEditProject}
              onDelete={handleDeleteProject}
            />
          ))}
        </div>
      ) : (
         <div className="text-center py-16 border-2 border-dashed rounded-lg">
            <FileWarning className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-medium">No Projects Found</h3>
            <p className="mt-1 text-sm text-muted-foreground">Get started by adding your first project.</p>
            <div className="mt-6">
                <Button onClick={handleAddProject} className="bg-accent text-accent-foreground hover:bg-accent/90">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Project
                </Button>
            </div>
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
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
            onClose={() => setIsDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
