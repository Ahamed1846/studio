"use client";

import { useState, useMemo } from "react";
import { useDevDock } from "@/contexts/DevDockDataContext";
import type { Snippet } from "@/lib/types";
import { SnippetCard } from "./snippet-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle, Search, FileWarning } from "lucide-react";
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


export function SnippetList() {
  const { snippets, status, error, addSnippet, updateSnippet, deleteSnippet } = useDevDock();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSnippet, setEditingSnippet] = useState<Snippet | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const handleAddSnippetClick = () => {
    setEditingSnippet(null);
    setIsDialogOpen(true);
  };

  const handleEditSnippetClick = (snippet: Snippet) => {
    setEditingSnippet(snippet);
    setIsDialogOpen(true);
  };

  const handleDeleteSnippet = async (id: string) => {
    await deleteSnippet(id);
  };

  const handleFormSubmit = async (snippet: Snippet) => {
    if (editingSnippet) {
      await updateSnippet(snippet);
    } else {
      await addSnippet(snippet);
    }
    setIsDialogOpen(false);
    setEditingSnippet(null);
  };

  const filteredSnippets = useMemo(() => {
    if (status !== 'ready') return [];
    return snippets.filter(
      (snippet) =>
        snippet.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        snippet.tags.some((tag) =>
          tag.toLowerCase().includes(searchTerm.toLowerCase())
        )
    );
  }, [snippets, searchTerm, status]);

  if (status === 'loading') {
    return (
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="space-y-2">
                <Skeleton className="h-8 w-56" />
                <Skeleton className="h-4 w-72" />
            </div>
            <div className="flex items-center gap-2 w-full md:w-auto">
                <Skeleton className="h-10 flex-grow" />
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

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
            <h2 className="text-3xl font-bold font-headline">Code Snippets</h2>
            <p className="mt-1 text-muted-foreground">Your personal library of useful commands and code.</p>
        </div>
        <div className="flex w-full items-center gap-2 md:w-auto">
             <div className="relative flex-grow md:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    type="search"
                    placeholder="Search snippets..."
                    className="w-full pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <Button onClick={handleAddSnippetClick} className="shrink-0 bg-accent text-accent-foreground hover:bg-accent/90">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Snippet
            </Button>
        </div>
      </div>

      {filteredSnippets.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredSnippets.map((snippet) => (
            <SnippetCard
              key={snippet.id}
              snippet={snippet}
              onEdit={handleEditSnippetClick}
              onDelete={handleDeleteSnippet}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 border-2 border-dashed rounded-xl bg-card">
           <div className="flex justify-center items-center w-16 h-16 mx-auto bg-muted rounded-full mb-4">
              <FileWarning className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="mt-4 text-xl font-semibold">
                {searchTerm ? `No Results Found` : "No Snippets Found"}
            </h3>
            <p className="mt-2 text-base text-muted-foreground">
                {searchTerm ? `Your search for "${searchTerm}" did not return any results.` : "Get started by adding your first snippet."}
            </p>
             <div className="mt-6">
                <Button onClick={handleAddSnippetClick} className="bg-accent text-accent-foreground hover:bg-accent/90">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Snippet
                </Button>
            </div>
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {editingSnippet ? "Edit Snippet" : "Add New Snippet"}
            </DialogTitle>
            <DialogDescription>
              {editingSnippet
                ? "Update the details of your code snippet."
                : "Save a new command or code snippet for later."}
            </DialogDescription>
          </DialogHeader>
          <SnippetForm
            snippet={editingSnippet}
            onSubmit={handleFormSubmit}
            onClose={() => setIsDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
