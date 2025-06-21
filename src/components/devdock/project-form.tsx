
"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import type { Project } from "@/lib/types";

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
import { PlusCircle, Trash2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const scriptSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Script name is required."),
  command: z.string().min(1, "Command is required."),
});

const projectSchema = z.object({
  name: z.string().min(1, "Project name is required."),
  path: z.string().min(1, "Folder path is required."),
  githubUrl: z.string().url("Please enter a valid URL.").optional().or(z.literal('')),
  tags: z.string().optional(),
  scripts: z.array(scriptSchema).optional(),
  notes: z.string().optional(),
});

type ProjectFormValues = z.infer<typeof projectSchema>;

type ProjectFormProps = {
  project?: Project | null;
  onSubmit: (data: Omit<Project, 'id' | 'lastModified'>) => void;
  onClose: () => void;
};

export function ProjectForm({ project, onSubmit, onClose }: ProjectFormProps) {
  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: project?.name || "",
      path: project?.path || "",
      githubUrl: project?.githubUrl || "",
      tags: project?.tags?.join(", ") || "",
      scripts: project?.scripts || [],
      notes: project?.notes || "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "scripts",
  });

  const handleSubmit = (data: ProjectFormValues) => {
    const tagsArray = data.tags ? data.tags.split(",").map(tag => tag.trim()).filter(Boolean) : [];
    const finalData = {
      ...data,
      tags: tagsArray,
      scripts: data.scripts || [],
      notes: data.notes || "",
    };
    onSubmit(finalData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 max-h-[70vh] overflow-y-auto pr-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Project Name</FormLabel>
              <FormControl>
                <Input placeholder="My Awesome Project" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="path"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Folder Path</FormLabel>
              <FormControl>
                <Input placeholder="/Users/me/dev/my-awesome-project" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="githubUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>GitHub URL (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="https://github.com/user/repo" {...field} />
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
                <Input placeholder="frontend, react, work" {...field} />
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
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Add any project-specific notes here. Markdown is supported."
                  className="min-h-[120px]"
                  {...field}
                />
              </FormControl>
               <FormDescription>
                Useful for setup instructions, TODOs, or config details.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Separator />

        <div>
            <FormLabel>Custom Scripts</FormLabel>
             <FormDescription className="mb-4">Add commands you frequently run for this project.</FormDescription>
            <div className="space-y-4">
                 {fields.map((field, index) => (
                    <div key={field.id} className="flex items-end gap-2 p-3 border rounded-lg">
                        <FormField
                            control={form.control}
                            name={`scripts.${index}.name`}
                            render={({ field }) => (
                                <FormItem className="flex-grow">
                                    <FormLabel className="text-xs">Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Run Dev Server" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name={`scripts.${index}.command`}
                            render={({ field }) => (
                                <FormItem className="flex-grow">
                                     <FormLabel className="text-xs">Command</FormLabel>
                                    <FormControl>
                                        <Input placeholder="npm run dev" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="button" variant="destructive" size="icon" onClick={() => remove(index)}>
                            <Trash2 className="h-4 w-4"/>
                        </Button>
                    </div>
                ))}

                <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={() => append({ id: crypto.randomUUID(), name: "", command: "" })}
                >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Script
                </Button>
            </div>
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">
            {project ? "Save Changes" : "Add Project"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
