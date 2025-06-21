"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import type { Snippet } from "@/lib/types";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const snippetSchema = z.object({
  title: z.string().min(1, "Title is required."),
  tags: z.string().optional(),
  content: z.string().min(1, "Snippet content cannot be empty."),
});

type SnippetFormValues = z.infer<typeof snippetSchema>;

type SnippetFormProps = {
  snippet?: Snippet | null;
  onSubmit: (data: Omit<Snippet, "id" | "isPinned">) => void;
  onClose: () => void;
};

export function SnippetForm({ snippet, onSubmit, onClose }: SnippetFormProps) {
  const form = useForm<SnippetFormValues>({
    resolver: zodResolver(snippetSchema),
    defaultValues: {
      title: snippet?.title || "",
      tags: snippet?.tags.join(", ") || "",
      content: snippet?.content || "",
    },
  });

  const handleSubmit = (data: SnippetFormValues) => {
    const tagsArray = data.tags ? data.tags.split(",").map(tag => tag.trim()).filter(Boolean) : [];
    onSubmit({
      title: data.title,
      tags: tagsArray,
      content: data.content,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Git Commit All" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tags (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="e.g. git, cli, productivity" {...field} />
              </FormControl>
               <FormDescription>
                Enter tags separated by commas.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Snippet</FormLabel>
              <FormControl>
                <Textarea
                  placeholder='git add . && git commit -m "feat: new feature"'
                  className="font-mono min-h-[150px] text-sm"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90">
            {snippet ? "Save Changes" : "Add Snippet"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
