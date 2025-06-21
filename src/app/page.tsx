"use client";

import { useRef } from "react";
import { useDevDock } from "@/contexts/DevDockDataContext";
import { Header } from "@/components/devdock/header";
import { ProjectList } from "@/components/devdock/project-list";
import { SnippetList } from "@/components/devdock/snippet-list";
import { GitHelp } from "@/components/devdock/git-help";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { saveAs } from "file-saver";


export default function Home() {
  const { exportData, importData, refreshData } = useDevDock();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    try {
      const jsonData = exportData();
      const blob = new Blob([jsonData], { type: "application/json;charset=utf-8" });
      saveAs(blob, "devdock.json");
      toast({
        title: "Export Successful",
        description: "Your DevDock data has been exported.",
      });
    } catch (error) {
      console.error("Export failed:", error);
      toast({
        variant: "destructive",
        title: "Export Failed",
        description: "Could not export your data. See console for details.",
      });
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const content = e.target?.result;
        if (typeof content !== 'string') {
            throw new Error("File content is not valid.");
        }
        await importData(content);
        await refreshData();
        toast({
          title: "Import Successful",
          description: "Your DevDock data has been imported and restored.",
        });
      } catch (error: any) {
        console.error("Import failed:", error);
        toast({
          variant: "destructive",
          title: "Import Failed",
          description: error.message || "Could not import data. Check file format.",
        });
      } finally {
        // Reset file input
        if(fileInputRef.current) {
            fileInputRef.current.value = "";
        }
      }
    };
    reader.readAsText(file);
  };


  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header onExport={handleExport} onImport={handleImportClick} />
       <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept=".json,application/json"
      />
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
