
"use client";

import { useState, useMemo, useEffect } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { gitHelpItemsByCategory } from "@/lib/constants";
import { ClipboardCopy, GitCommit, Search, Star } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useToast } from "@/hooks/use-toast";
import { type GitHelpItem } from "@/lib/types";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "../ui/badge";
import Fuse from "fuse.js";

const FAVORITES_KEY = 'devdock-git-favorites';

function GitCommandCard({
  item,
  isFavorite,
  onToggleFavorite,
  onCopy,
}: {
  item: GitHelpItem;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onCopy: (command: string) => void;
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="bg-card p-4 rounded-lg border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
    >
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-2">
            <GitCommit className="h-4 w-4 text-muted-foreground" />
            <pre className="font-mono text-base font-semibold text-primary bg-primary/10 px-2 py-1 rounded-md">
                <code>{item.command}</code>
            </pre>
        </div>
        <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
        {item.useCase && (
            <p className="text-xs text-muted-foreground/80 mt-2 italic">
               <span className="font-semibold">Example:</span> {item.useCase}
            </p>
        )}
      </div>
      <div className="flex items-center gap-1 shrink-0 self-start sm:self-center">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => onToggleFavorite(item.id)}
        >
          <Star className={`h-4 w-4 transition-colors ${isFavorite ? 'text-amber-500 fill-amber-400' : 'text-muted-foreground hover:text-amber-500'}`} />
          <span className="sr-only">Favorite</span>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => onCopy(item.command)}
        >
          <ClipboardCopy className="h-4 w-4 text-muted-foreground" />
          <span className="sr-only">Copy</span>
        </Button>
      </div>
    </motion.div>
  );
}

export function GitHelp() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  
  useEffect(() => {
    try {
      const storedFavorites = window.localStorage.getItem(FAVORITES_KEY);
      if (storedFavorites) {
        setFavoriteIds(JSON.parse(storedFavorites));
      }
    } catch (error) {
      console.error("Failed to parse favorites from localStorage", error);
    }
  }, []);

  useEffect(() => {
     try {
        window.localStorage.setItem(FAVORITES_KEY, JSON.stringify(favoriteIds));
     } catch (error) {
        console.error("Failed to save favorites to localStorage", error);
     }
  }, [favoriteIds]);

  const allCommands = useMemo(() => Object.values(gitHelpItemsByCategory).flat(), []);

  const filteredCommands = useMemo(() => {
    const fuse = new Fuse(allCommands, {
        keys: ['command', 'description', 'useCase'],
        threshold: 0.3,
    });
    return searchTerm ? fuse.search(searchTerm).map(result => result.item) : allCommands;
  }, [searchTerm, allCommands]);

  const { favoriteItems, categorizedItems } = useMemo(() => {
    const favorites = filteredCommands.filter(item => favoriteIds.includes(item.id));
    const others = filteredCommands.filter(item => !favoriteIds.includes(item.id));

    const categorized = Object.entries(gitHelpItemsByCategory).reduce((acc, [category, items]) => {
      const matchingItems = items.filter(item => others.some(other => other.id === item.id));
      if (matchingItems.length > 0) {
        acc[category] = matchingItems;
      }
      return acc;
    }, {} as Record<string, GitHelpItem[]>);

    return { favoriteItems: favorites, categorizedItems: categorized };
  }, [filteredCommands, favoriteIds]);

  const handleCopy = (command: string) => {
    navigator.clipboard.writeText(command);
    toast({
      title: "Command Copied!",
      description: "The Git command has been copied to your clipboard.",
    });
  };

  const toggleFavorite = (id: string) => {
    setFavoriteIds((prev) =>
      prev.includes(id) ? prev.filter((favId) => favId !== id) : [...prev, id]
    );
  };
  
  const hasResults = favoriteItems.length > 0 || Object.keys(categorizedItems).length > 0;

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tight">Git Command Quick Reference</h2>
        <p className="mt-2 text-lg text-muted-foreground">
          A searchable, interactive list of common Git commands.
        </p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search commands, descriptions, or use cases..."
          className="w-full pl-10 h-11"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

       <AnimatePresence>
        {favoriteItems.length > 0 && (
            <motion.section 
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
            >
                <h3 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                    <Star className="h-6 w-6 text-amber-500" />
                    Favorites
                </h3>
                <div className="space-y-3">
                    {favoriteItems.map((item) => (
                    <GitCommandCard 
                        key={item.id} 
                        item={item} 
                        isFavorite={true}
                        onToggleFavorite={toggleFavorite}
                        onCopy={handleCopy}
                    />
                    ))}
                </div>
            </motion.section>
        )}
       </AnimatePresence>

      {hasResults ? (
        <Accordion type="multiple" className="w-full space-y-3" defaultValue={Object.keys(categorizedItems)}>
          {Object.entries(categorizedItems).map(([category, items]) => (
            <AccordionItem value={category} key={category} className="border-b-0">
                <AccordionTrigger className="text-xl font-bold hover:no-underline border-b pb-3 mb-3">
                   {category}
                </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3">
                    <AnimatePresence>
                      {items.map((item) => (
                          <GitCommandCard 
                              key={item.id} 
                              item={item} 
                              isFavorite={favoriteIds.includes(item.id)}
                              onToggleFavorite={toggleFavorite}
                              onCopy={handleCopy}
                          />
                      ))}
                    </AnimatePresence>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      ) : (
        <div className="text-center py-16 px-4 border-2 border-dashed rounded-lg bg-card">
            <div className="flex justify-center items-center w-16 h-16 mx-auto bg-muted rounded-full mb-6 text-muted-foreground">
              <Search className="h-8 w-8" />
            </div>
            <h3 className="mt-4 text-2xl font-semibold">No Commands Found</h3>
            <p className="mt-2 text-base text-muted-foreground max-w-md mx-auto">
              Your search for "{searchTerm}" did not return any results. Try a different query.
            </p>
        </div>
      )}
    </div>
  );
}
