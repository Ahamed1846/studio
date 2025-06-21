"use client";

import { Header } from "@/components/devdock/header";
import { ProjectList } from "@/components/devdock/project-list";
import { SnippetList } from "@/components/devdock/snippet-list";
import { GitHelp } from "@/components/devdock/git-help";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="container flex-grow py-8">
        <Tabs defaultValue="projects" className="w-full">
          <div className="flex justify-center mb-8">
            <TabsList>
              <TabsTrigger value="projects">Projects</TabsTrigger>
              <TabsTrigger value="snippets">Snippets</TabsTrigger>
              <TabsTrigger value="git-help">Git Help</TabsTrigger>
            </TabsList>
          </div>
          <TabsContent value="projects">
            <Card>
              <CardContent className="p-6">
                <ProjectList />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="snippets">
             <Card>
              <CardContent className="p-6">
                <SnippetList />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="git-help">
             <Card>
              <CardContent className="p-6">
                <GitHelp />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
