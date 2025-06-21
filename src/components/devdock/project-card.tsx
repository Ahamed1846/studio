"use client";

import type { Project, Script, Snippet } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardFooter, CardContent } from "@/components/ui/card";
import { Code, Copy, Github, Pencil, Trash2, Folder, Terminal, Sparkles } from "lucide-react";
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useMemo } from "react";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";

type ProjectCardProps = {
  project: Project;
  allSnippets: Snippet[];
  onEdit: (project: Project) => void;
  onDelete: (id: string) => void;
};

export function ProjectCard({ project, onEdit, onDelete, allSnippets }: ProjectCardProps) {
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

  const suggestedSnippets = useMemo(() => {
    if (!project.tags || project.tags.length === 0 || !allSnippets) {
        return [];
    }
    const projectTags = new Set(project.tags.map(t => t.toLowerCase()));
    return allSnippets.filter(snippet => 
        snippet.tags.some(tag => projectTags.has(tag.toLowerCase()))
    );
  }, [project.tags, allSnippets]);

  return (
    <Card className="flex flex-col h-full shadow-sm hover:shadow-md transition-shadow duration-300">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-xl font-bold flex-1">{project.name}</CardTitle>
            <div className="flex items-center -mt-1 -mr-2">
                {suggestedSnippets.length > 0 && (
                <Popover>
                    <PopoverTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Sparkles className="h-4 w-4 text-amber-500" />
                    </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80">
                    <div className="grid gap-4">
                        <div className="space-y-1">
                        <h4 className="font-medium leading-none">Suggested Snippets</h4>
                        <p className="text-sm text-muted-foreground">
                            Based on project tags.
                        </p>
                        </div>
                        <ScrollArea className="h-48">
                        <div className="grid gap-2 pr-2">
                            {suggestedSnippets.map(snippet => (
                            <div key={snippet.id} className="flex items-center justify-between text-sm p-2 bg-muted rounded-md">
                                <span className="truncate" title={snippet.title}>{snippet.title}</span>
                                <Button size="sm" variant="ghost" className="h-7 w-7" onClick={() => handleCopy(snippet.content, `Snippet "${snippet.title}" copied.`)}>
                                <Copy className="h-4 w-4" />
                                </Button>
                            </div>
                            ))}
                        </div>
                        </ScrollArea>
                    </div>
                    </PopoverContent>
                </Popover>
                )}
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onEdit(project)}>
                <Pencil className="h-4 w-4" />
                <span className="sr-only">Edit Project</span>
                </Button>
                <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive h-8 w-8">
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
        </div>
        <CardDescription className="flex items-center pt-2 text-sm text-muted-foreground">
          <Folder className="h-4 w-4 mr-2 shrink-0" />
          <span className="truncate" title={project.path}>{project.path}</span>
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-grow flex flex-col gap-4 px-6 pt-0 pb-4">
        {project.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {project.tags.map((tag, index) => (
              <Badge key={index} variant="secondary" className="font-normal">
                {tag}
              </Badge>
            ))}
          </div>
        )}
        {project.scripts && project.scripts.length > 0 && (
            <div className="space-y-2">
                <h4 className="text-sm font-semibold text-foreground">Scripts</h4>
                <div className="space-y-2">
                    {project.scripts.map(script => (
                    <div key={script.id} className="flex items-center justify-between bg-muted/70 p-2 rounded-md">
                        <div className="flex items-center gap-2">
                        <Terminal className="h-4 w-4 text-muted-foreground" />
                        <p className="text-sm font-mono truncate" title={script.command}>{script.name}</p>
                        </div>
                        <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => handleCopy(script.command, `Command "${script.name}" copied.`)}>
                        <Copy className="h-4 w-4" />
                        </Button>
                    </div>
                    ))}
                </div>
            </div>
        )}
      </CardContent>

      <CardFooter className="flex-wrap gap-2 justify-start border-t px-6 pt-4 mt-auto">
        <Button variant="outline" size="sm" onClick={handleOpenVSCode}>
          <Code />
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
