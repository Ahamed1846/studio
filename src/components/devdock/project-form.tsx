"use client";

import { useForm } from "react-hook-form";
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
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const projectSchema = z.object({
  name: z.string().min(1, "Project name is required."),
  path: z.string().min(1, "Folder path is required."),
  githubUrl: z.string().url("Please enter a valid URL.").optional().or(z.literal('')),
});

type ProjectFormValues = z.infer<typeof projectSchema>;

type ProjectFormProps = {
  project?: Project | null;
  onSubmit: (data: ProjectFormValues) => void;
  onClose: () => void;
};

export function ProjectForm({ project, onSubmit, onClose }: ProjectFormProps) {
  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: project?.name || "",
      path: project?.path || "",
      githubUrl: project?.githubUrl || "",
    },
  });

  const handleSubmit = (data: ProjectFormValues) => {
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
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
        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" className="bg-accent text-accent-foreground hover:bg-accent/90">
            {project ? "Save Changes" : "Add Project"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
