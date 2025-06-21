"use client";

import { useState } from "react";
import { useDevDock } from "@/contexts/DevDockDataContext";
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
import { Skeleton } from "@/components/ui/skeleton";
import { PermissionRequiredView, ErrorView } from "./shared-views";

export function ProjectList() {
  const { projects, status, error, grantPermission, addProject, updateProject, deleteProject } = useDevDock();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const handleAddProjectClick = () => {
    setEditingProject(null);
    setIsDialogOpen(true);
  };

  const handleEditProjectClick = (project: Project) => {
    setEditingProject(project);
    setIsDialogOpen(true);
  };

  const handleDeleteProject = async (id: string) => {
    await deleteProject(id);
  };

  const handleFormSubmit = async (data: Omit<Project, "id">) => {
    if (editingProject) {
      await updateProject({ ...editingProject, ...data });
    } else {
      await addProject(data);
    }
    setIsDialogOpen(false);
    setEditingProject(null);
  };

  if (status === 'loading') {
    return (
      <div className="space-y-8">
         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="space-y-2">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-4 w-64" />
            </div>
            <Skeleton className="h-10 w-36 shrink-0" />
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-52 rounded-lg" />)}
        </div>
      </div>
    );
  }

  if (status === 'permission-required') {
    return <PermissionRequiredView grantPermission={grantPermission} />;
  }

  if (status === 'error') {
    return <ErrorView error={error} />;
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold font-headline">Projects</h2>
          <p className="mt-1 text-muted-foreground">Manage your local development projects.</p>
        </div>
        <Button onClick={handleAddProjectClick} className="shrink-0 bg-accent text-accent-foreground hover:bg-accent/90">
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Project
        </Button>
      </div>

      {projects.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onEdit={handleEditProjectClick}
              onDelete={handleDeleteProject}
            />
          ))}
        </div>
      ) : (
         <div className="text-center py-20 border-2 border-dashed rounded-xl bg-card">
            <div className="flex justify-center items-center w-16 h-16 mx-auto bg-muted rounded-full mb-4">
              <FileWarning className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="mt-4 text-xl font-semibold">No Projects Found</h3>
            <p className="mt-2 text-base text-muted-foreground">Get started by adding your first project.</p>
            <div className="mt-6">
                <Button onClick={handleAddProjectClick} className="bg-accent text-accent-foreground hover:bg-accent/90">
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
