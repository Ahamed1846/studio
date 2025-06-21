"use client";

import type { Project, Script } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardFooter, CardContent } from "@/components/ui/card";
import { CodeXml, Copy, Github, Pencil, Trash2, Folder, Terminal } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";

type ProjectCardProps = {
  project: Project;
  onEdit: (project: Project) => void;
  onDelete: (id: string) => void;
};

export function ProjectCard({ project, onEdit, onDelete }: ProjectCardProps) {
  const { toast } = useToast();

  const handleCopy = (textToCopy: string, successMessage: string) => {
    navigator.clipboard.writeText(textToCopy);
    toast({
      title: "Copied!",
      description: successMessage,
    });
  };

  const handleOpenVSCode = () => {
    const newTab = window.open("", "_blank");
    if (newTab) {
      newTab.location.href = `vscode://file/${project.path}`;
      setTimeout(() => {
        newTab.close();
      }, 500);
    } else {
      toast({
        variant: "destructive",
        title: "Popup Blocked",
        description: "Please allow pop-ups for this site to open projects in VS Code.",
      });
    }
  };

  return (
    <Card className="flex flex-col h-full hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-start justify-between">
          <span className="font-bold">{project.name}</span>
          <div className="flex items-center space-x-1">
            <Button variant="ghost" size="icon" onClick={() => onEdit(project)}>
              <Pencil className="h-4 w-4" />
              <span className="sr-only">Edit Project</span>
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Delete Project</span>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the project
                    "{project.name}" from your list.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => onDelete(project.id)} className="bg-destructive hover:bg-destructive/90">
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardTitle>
        <CardDescription className="flex items-center pt-2 text-sm text-muted-foreground">
          <Folder className="h-4 w-4 mr-2 shrink-0" />
          <span className="truncate">{project.path}</span>
        </CardDescription>
         {project.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 pt-2">
            {project.tags.map((tag, index) => (
              <Badge key={index} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardHeader>
      {project.scripts && project.scripts.length > 0 && (
        <CardContent className="py-2 px-6 flex-grow">
          <h4 className="text-sm font-semibold mb-2">Scripts</h4>
          <div className="space-y-2">
            {project.scripts.map(script => (
              <div key={script.id} className="flex items-center justify-between bg-muted p-2 rounded-md">
                <div className="flex items-center gap-2">
                  <Terminal className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm font-mono truncate" title={script.command}>{script.name}</p>
                </div>
                <Button size="sm" variant="ghost" onClick={() => handleCopy(script.command, `Command "${script.name}" copied.`)}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      )}
      <CardFooter className="flex-wrap gap-2 justify-start border-t pt-4 mt-auto">
        <Button variant="outline" size="sm" onClick={handleOpenVSCode}>
          <CodeXml />
          VS Code
        </Button>
        <Button variant="outline" size="sm" onClick={() => handleCopy(project.path, `Project path copied.`)}>
          <Copy />
          Copy Path
        </Button>
        {project.githubUrl && (
          <Button variant="outline" size="sm" asChild>
            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
              <Github />
              GitHub
            </a>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
