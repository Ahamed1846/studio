"use client";

import * as React from "react";
import {
  CodeXml,
  Copy,
  FilePlus2,
  Github,
  Home,
  FileText,
  GitBranch,
  PlusCircle,
  Terminal,
} from "lucide-react";

import { useDevDock } from "@/contexts/DevDockDataContext";
import { useUIState } from "@/contexts/UIStateContext";
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from "@/components/ui/command";
import { useToast } from "@/hooks/use-toast";
import { Button } from "../ui/button";

type CommandPaletteProps = {
  setActiveTab: (tab: string) => void;
};

export function CommandPalette({ setActiveTab }: CommandPaletteProps) {
  const { showCommandPalette, setShowCommandPalette, openProjectForm, openSnippetForm } = useUIState();
  const { projects, snippets } = useDevDock();
  const { toast } = useToast();

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setShowCommandPalette(true);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [setShowCommandPalette]);

  const runCommand = (command: () => unknown) => {
    setShowCommandPalette(false);
    command();
  };

  const handleCopy = (textToCopy: string, successMessage: string) => {
    navigator.clipboard.writeText(textToCopy);
    toast({
      title: "Copied!",
      description: successMessage,
    });
  };

  const handleOpenVSCode = (path: string) => {
    const newTab = window.open("", "_blank");
    if (newTab) {
      newTab.location.href = `vscode://file/${path}`;
      setTimeout(() => newTab.close(), 500);
    } else {
       toast({
        variant: "destructive",
        title: "Popup Blocked",
        description: "Please allow pop-ups for this site.",
      });
    }
  };

  return (
    <CommandDialog open={showCommandPalette} onOpenChange={setShowCommandPalette}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        
        <CommandGroup heading="Actions">
          <CommandItem onSelect={() => runCommand(() => openProjectForm())}>
            <FilePlus2 className="mr-2" />
            <span>Add New Project</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => openSnippetForm())}>
            <PlusCircle className="mr-2" />
            <span>Add New Snippet</span>
          </CommandItem>
        </CommandGroup>
        
        <CommandSeparator />
        
        <CommandGroup heading="Navigation">
          <CommandItem onSelect={() => runCommand(() => setActiveTab("projects"))}>
            <Home className="mr-2" />
            <span>Go to Projects</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => setActiveTab("snippets"))}>
            <FileText className="mr-2" />
            <span>Go to Snippets</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => setActiveTab("git-help"))}>
            <GitBranch className="mr-2" />
            <span>Go to Git Help</span>
          </CommandItem>
        </CommandGroup>
        
        <CommandSeparator />

        <CommandGroup heading="Projects">
          {projects.map((project) => (
            <CommandGroup key={project.id} heading={project.name} value={`Project: ${project.name}`}>
              <CommandItem onSelect={() => runCommand(() => handleOpenVSCode(project.path))}>
                <CodeXml className="mr-2" />
                <span>Open in VS Code</span>
              </CommandItem>
              <CommandItem onSelect={() => runCommand(() => handleCopy(project.path, 'Project path copied.'))}>
                <Copy className="mr-2" />
                <span>Copy Path</span>
              </CommandItem>
              {project.githubUrl && (
                <CommandItem onSelect={() => runCommand(() => window.open(project.githubUrl, '_blank'))}>
                  <Github className="mr-2" />
                  <span>Open on GitHub</span>
                </CommandItem>
              )}
               {project.scripts.map(script => (
                <CommandItem key={script.id} onSelect={() => runCommand(() => handleCopy(script.command, `Script "${script.name}" copied.`))}>
                    <Terminal className="mr-2"/>
                    <span>Copy script: {script.name}</span>
                </CommandItem>
            ))}
            </CommandGroup>
          ))}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Snippets">
            {snippets.map(snippet => (
                 <CommandItem key={snippet.id} value={`Snippet: ${snippet.title}`} onSelect={() => runCommand(() => handleCopy(snippet.content, `Snippet "${snippet.title}" copied.`))}>
                    <Copy className="mr-2"/>
                    <span>Copy: {snippet.title}</span>
                </CommandItem>
            ))}
        </CommandGroup>

      </CommandList>
    </CommandDialog>
  );
}
