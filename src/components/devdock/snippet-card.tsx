"use client";

import type { Snippet } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Copy, Pencil, Trash2 } from "lucide-react";
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
import { useState } from "react";

type SnippetCardProps = {
  snippet: Snippet;
  onEdit: (snippet: Snippet) => void;
  onDelete: (id: string) => void;
};

export function SnippetCard({ snippet, onEdit, onDelete }: SnippetCardProps) {
  const { toast } = useToast();
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(snippet.content);
    toast({
      title: "Snippet Copied!",
      description: "The snippet has been copied to your clipboard.",
    });
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <Card className="flex flex-col h-full hover:shadow-md transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="flex items-start justify-between">
          <span className="font-headline">{snippet.title}</span>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" onClick={() => onEdit(snippet)}>
              <Pencil className="h-4 w-4" />
              <span className="sr-only">Edit Snippet</span>
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                 <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                  <Trash2 className="h-4 w-4" />
                   <span className="sr-only">Delete Snippet</span>
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete the snippet "{snippet.title}".
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                   <AlertDialogAction onClick={() => onDelete(snippet.id)} className="bg-destructive hover:bg-destructive/90">
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardTitle>
        <div className="flex flex-wrap gap-1 pt-2">
          {snippet.tags.map((tag, index) => (
            <Badge key={index} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <pre className="bg-muted p-4 rounded-md overflow-x-auto text-sm">
          <code className="font-code">{snippet.content}</code>
        </pre>
      </CardContent>
      <CardFooter>
        <Button onClick={handleCopy} size="sm" className="w-full" style={{ backgroundColor: 'hsl(var(--accent))', color: 'hsl(var(--accent-foreground))' }}>
          <Copy className="mr-2 h-4 w-4" />
          {isCopied ? "Copied!" : "Copy Snippet"}
        </Button>
      </CardFooter>
    </Card>
  );
}
