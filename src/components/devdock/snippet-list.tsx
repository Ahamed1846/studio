"use client";

import { useState, useMemo } from "react";
import { useDevDock } from "@/contexts/DevDockDataContext";
import { useUIState } from "@/contexts/UIStateContext";
import type { Snippet } from "@/lib/types";
import { SnippetCard } from "./snippet-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle, Search, FileWarning, Pin, Code } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { SnippetForm } from "./snippet-form";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorView } from "./shared-views";
import { Separator } from "@/components/ui/separator";


export function SnippetList() {
  const { snippets, status, error, addSnippet, updateSnippet, deleteSnippet, toggleSnippetPin } = useDevDock();
  const { openDialog, editingSnippet, openSnippetForm, closeDialog } = useUIState();
  const [searchTerm, setSearchTerm] = useState("");

  const handleFormSubmit = async (data: Omit<Snippet, "id" | "isPinned">) => {
    if (editingSnippet) {
      await updateSnippet({ ...editingSnippet, ...data });
    } else {
      await addSnippet(data);
    }
    closeDialog();
  };

  const { pinnedSnippets, otherSnippets } = useMemo(() => {
    if (status !== 'ready') return { pinnedSnippets: [], otherSnippets: [] };
    
    const filtered = snippets.filter(
      (snippet) =>
        snippet.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        snippet.tags.some((tag) =>
          tag.toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    const pinned = filtered.filter(s => s.isPinned).sort((a, b) => a.title.localeCompare(b.title));
    const others = filtered.filter(s => !s.isPinned).sort((a, b) => a.title.localeCompare(b.title));
    
    return { pinnedSnippets: pinned, otherSnippets: others };
  }, [snippets, searchTerm, status]);

  if (status === 'loading') {
    return (
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="space-y-2 w-full md:w-auto">
                <Skeleton className="h-10 w-56" />
                <Skeleton className="h-5 w-72" />
            </div>
            <div className="flex items-center gap-2 w-full md:w-auto">
                <Skeleton className="h-10 flex-grow md:w-72" />
                <Skeleton className="h-10 w-36" />
            </div>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-[278px] rounded-lg" />)}
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return <ErrorView error={error} />;
  }

  const renderSnippetList = (list: Snippet[]) => (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {list.map((snippet) => (
        <SnippetCard
            key={snippet.id}
            snippet={snippet}
            onEdit={() => openSnippetForm(snippet)}
            onDelete={deleteSnippet}
            onPin={toggleSnippetPin}
        />
        ))}
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
            <h2 className="text-3xl font-bold tracking-tight">Code Snippets</h2>
            <p className="mt-1 text-lg text-muted-foreground">Your personal library of useful commands and code.</p>
        </div>
        <div className="flex w-full items-center gap-2 md:w-auto">
             <div className="relative flex-grow md:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    type="search"
                    placeholder="Search by title or tag..."
                    className="w-full pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <Button onClick={() => openSnippetForm()} className="shrink-0 bg-primary text-primary-foreground hover:bg-primary/90">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Snippet
            </Button>
        </div>
      </div>

      {pinnedSnippets.length === 0 && otherSnippets.length === 0 ? (
         <div className="text-center py-16 px-4 border-2 border-dashed rounded-xl bg-card">
           <div className="flex justify-center items-center w-16 h-16 mx-auto bg-muted rounded-full mb-6 text-muted-foreground">
              {searchTerm ? <Search className="h-8 w-8" /> : <Code className="h-8 w-8" />}
            </div>
            <h3 className="mt-4 text-2xl font-semibold">
                {searchTerm ? `No Results Found` : "No Snippets Yet"}
            </h3>
            <p className="mt-2 text-base text-muted-foreground max-w-md mx-auto">
                {searchTerm ? `Your search for "${searchTerm}" did not return any results. Try a different query.` : "Get started by adding your first code snippet. It's great for saving common commands."}
            </p>
             <div className="mt-6">
                <Button onClick={() => openSnippetForm()} className="bg-primary text-primary-foreground hover:bg-primary/90">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Your First Snippet
                </Button>
            </div>
        </div>
      ) : (
        <div className="space-y-10">
            {pinnedSnippets.length > 0 && (
                <section className="space-y-4">
                    <div className="flex items-center gap-3">
                        <Pin className="h-6 w-6 text-primary" />
                        <h3 className="text-2xl font-bold tracking-tight">Pinned</h3>
                    </div>
                    {renderSnippetList(pinnedSnippets)}
                </section>
            )}
            
            {pinnedSnippets.length > 0 && otherSnippets.length > 0 && <Separator />}

            {otherSnippets.length > 0 && (
                <section className="space-y-4">
                   {pinnedSnippets.length > 0 && (
                     <h3 className="text-2xl font-bold tracking-tight">All Snippets</h3>
                   )}
                   {renderSnippetList(otherSnippets)}
                </section>
            )}
        </div>
      )}

      <Dialog 
        open={openDialog === 'addSnippet' || openDialog === 'editSnippet'} 
        onOpenChange={(isOpen) => !isOpen && closeDialog()}
      >
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle className="text-2xl">
              {editingSnippet ? "Edit Snippet" : "Add New Snippet"}
            </DialogTitle>
            <DialogDescription>
              {editingSnippet
                ? "Update the details of your code snippet."
                : "Save a new command or piece of code for easy access later."}
            </DialogDescription>
          </DialogHeader>
          <SnippetForm
            snippet={editingSnippet}
            onSubmit={handleFormSubmit}
            onClose={closeDialog}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
