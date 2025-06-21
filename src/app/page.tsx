"use client";

import { Header } from "@/components/devdock/header";
import { ProjectList } from "@/components/devdock/project-list";
import { SnippetList } from "@/components/devdock/snippet-list";
import { GitHelp } from "@/components/devdock/git-help";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-grow py-8 md:py-12">
        <div className="container max-w-7xl">
          <Tabs defaultValue="projects" className="w-full">
            <div className="flex justify-center mb-8">
              <TabsList>
                <TabsTrigger value="projects">Projects</TabsTrigger>
                <TabsTrigger value="snippets">Snippets</TabsTrigger>
                <TabsTrigger value="git-help">Git Help</TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="projects">
              <ProjectList />
            </TabsContent>
            <TabsContent value="snippets">
              <SnippetList />
            </TabsContent>
            <TabsContent value="git-help">
              <GitHelp />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
