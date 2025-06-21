
"use client";

import { useState, useMemo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useDevDock } from "@/contexts/DevDockDataContext";
import { useUIState } from "@/contexts/UIStateContext";
import type { Project } from "@/lib/types";
import { ProjectCard } from "./project-card";
import { Button } from "@/components/ui/button";
import { PlusCircle, FileWarning, Search, LayoutGrid, Tag, FileText, Calendar, Terminal } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ProjectForm } from "./project-form";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorView } from "./shared-views";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";
import { Badge } from "../ui/badge";

function ProjectDetailsDialog() {
    const { editingProject, openDialog, closeDialog } = useUIState();
    if (!editingProject) return null;

    const StatItem = ({ icon, label, value }: { icon: React.ElementType, label: string, value: string | React.ReactNode }) => (
        <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted text-muted-foreground">
              <icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{label}</p>
              <div className="text-base font-semibold">{value}</div>
            </div>
        </div>
    );

    return (
        <Dialog open={openDialog === 'projectDetails'} onOpenChange={(isOpen) => !isOpen && closeDialog()}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle className="text-2xl">{editingProject.name}</DialogTitle>
                    <DialogDescription>{editingProject.path}</DialogDescription>
                </DialogHeader>
                <Tabs defaultValue="overview" className="w-full pt-2">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="notes">Notes</TabsTrigger>
                    </TabsList>
                    <TabsContent value="overview">
                        <div className="grid gap-6 py-4 md:grid-cols-2">
                             <StatItem icon={Tag} label="Tags" value={
                                editingProject.tags.length > 0 ? (
                                    <div className="flex flex-wrap gap-1">
                                        {editingProject.tags.map(tag => <Badge key={tag} variant="secondary">{tag}</Badge>)}
                                    </div>
                                ) : "None"
                            } />
                            <StatItem icon={Terminal} label="Saved Scripts" value={editingProject.scripts.length} />
                            <StatItem icon={Calendar} label="Last Modified" value={format(new Date(editingProject.lastModified), "PPpp")} />
                        </div>
                    </TabsContent>
                    <TabsContent value="notes">
                        <ScrollArea className="h-80 w-full rounded-md border p-4">
                            {editingProject.notes ? (
                                <ReactMarkdown
                                    className="prose prose-sm dark:prose-invert max-w-none"
                                    remarkPlugins={[remarkGfm]}
                                >
                                    {editingProject.notes}
                                </ReactMarkdown>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full text-center">
                                    <FileText className="h-12 w-12 text-muted-foreground" />
                                    <p className="mt-4 text-lg font-semibold">No Notes Yet</p>
                                    <p className="text-sm text-muted-foreground">You can add notes by editing this project.</p>
                                </div>
                            )}
                        </ScrollArea>
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
}

export function ProjectList() {
  const { projects, snippets, status, error, addProject, updateProject, deleteProject, toggleProjectPin } = useDevDock();
  const { openDialog, editingProject, openProjectForm, openProjectDetails, closeDialog } = useUIState();
  const [searchTerm, setSearchTerm] = useState("");

  const handleFormSubmit = async (data: Omit<Project, "id" | 'lastModified'>) => {
    if (editingProject) {
      await updateProject({ ...editingProject, ...data });
    } else {
      await addProject(data);
    }
    closeDialog();
  };

  const { pinnedProjects, otherProjects } = useMemo(() => {
    if (status !== 'ready') return { pinnedProjects: [], otherProjects: [] };
    
    const filtered = projects.filter(
      (project) =>
        project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.path.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.tags.some((tag) =>
          tag.toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    const pinned = filtered.filter(p => p.isPinned).sort((a, b) => a.name.localeCompare(b.name));
    const others = filtered.filter(p => !p.isPinned).sort((a, b) => a.name.localeCompare(b.name));
    
    return { pinnedProjects: pinned, otherProjects: others };
  }, [projects, searchTerm, status]);

  if (status === 'loading') {
    return (
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="space-y-2 w-full sm:w-auto">
            <Skeleton className="h-10 w-48" />
            <Skeleton className="h-5 w-64" />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Skeleton className="h-10 flex-grow sm:w-72" />
            <Skeleton className="h-10 w-36" />
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-64 rounded-lg" />)}
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return <ErrorView error={error} />;
  }

  const renderProjectList = (list: Project[]) => (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {list.map((project) => (
        <ProjectCard
            key={project.id}
            project={project}
            allSnippets={snippets}
            onEdit={() => openProjectForm(project)}
            onDelete={deleteProject}
            onPin={toggleProjectPin}
            onViewDetails={openProjectDetails}
        />
        ))}
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Projects</h2>
          <p className="mt-1 text-lg text-muted-foreground">Manage your local development projects.</p>
        </div>
        <div className="flex w-full items-center gap-2 md:w-auto">
          <div className="relative flex-grow md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by name, path, or tag..."
              className="w-full pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button onClick={() => openProjectForm()} className="shrink-0 bg-primary text-primary-foreground hover:bg-primary/90">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Project
          </Button>
        </div>
      </div>

      {projects.length === 0 ? (
         <div className="text-center py-16 px-4 border-2 border-dashed rounded-xl bg-card">
            <div className="flex justify-center items-center w-16 h-16 mx-auto bg-muted rounded-full mb-6 text-muted-foreground">
                <LayoutGrid className="h-8 w-8" />
            </div>
            <h3 className="mt-4 text-2xl font-semibold">No Projects Yet</h3>
            <p className="mt-2 text-base text-muted-foreground max-w-md mx-auto">Get started by adding your first project to have quick access to its path, scripts, and more.</p>
            <div className="mt-6">
                <Button onClick={() => openProjectForm()} className="bg-primary text-primary-foreground hover:bg-primary/90">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Your First Project
                </Button>
            </div>
        </div>
      ) : pinnedProjects.length === 0 && otherProjects.length === 0 ? (
        <div className="text-center py-16 px-4 border-2 border-dashed rounded-xl bg-card">
            <div className="flex justify-center items-center w-16 h-16 mx-auto bg-muted rounded-full mb-6 text-muted-foreground">
                <Search className="h-8 w-8" />
            </div>
            <h3 className="mt-4 text-2xl font-semibold">No Projects Found</h3>
            <p className="mt-2 text-base text-muted-foreground max-w-md mx-auto">Your search for "{searchTerm}" did not return any results. Try a different query.</p>
        </div>
      ) : (
        <div className="space-y-10">
            {pinnedProjects.length > 0 && (
                <section className="space-y-4">
                    <h3 className="text-2xl font-bold tracking-tight">Pinned</h3>
                    {renderProjectList(pinnedProjects)}
                </section>
            )}

            {pinnedProjects.length > 0 && otherProjects.length > 0 && <Separator />}

            {otherProjects.length > 0 && (
                <section className="space-y-4">
                   {pinnedProjects.length > 0 && (
                     <h3 className="text-2xl font-bold tracking-tight">All Projects</h3>
                   )}
                   {renderProjectList(otherProjects)}
                </section>
            )}
        </div>
      )}

      <Dialog 
        open={openDialog === 'addProject' || openDialog === 'editProject'} 
        onOpenChange={(isOpen) => !isOpen && closeDialog()}
      >
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              {editingProject ? "Edit Project" : "Add New Project"}
            </DialogTitle>
            <DialogDescription>
              {editingProject
                ? "Update the details of your project."
                : "Enter the details for your new project to get started."}
            </DialogDescription>
          </DialogHeader>
          <ProjectForm
            project={editingProject}
            onSubmit={handleFormSubmit}
            onClose={closeDialog}
          />
        </DialogContent>
      </Dialog>
      <ProjectDetailsDialog />
    </div>
  );
}
