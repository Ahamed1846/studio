"use client";

import { useRef, useState } from "react";
import { useDevDock } from "@/contexts/DevDockDataContext";
import { useUIState } from "@/contexts/UIStateContext";
import { Header } from "@/components/devdock/header";
import { ProjectList } from "@/components/devdock/project-list";
import { SnippetList } from "@/components/devdock/snippet-list";
import { GitHelp } from "@/components/devdock/git-help";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { saveAs } from "file-saver";
import { CommandPalette } from "@/components/devdock/command-palette";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ActivityLogItem } from "@/lib/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDistanceToNow } from "date-fns";
import { Clock } from "lucide-react";


function ActivityLogDialog() {
  const { activityLog } = useDevDock();
  const { openDialog, closeDialog } = useUIState();

  return (
    <Dialog open={openDialog === 'activityLog'} onOpenChange={(isOpen) => !isOpen && closeDialog()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Recent Activity</DialogTitle>
          <DialogDescription>
            A log of the most recent actions performed in DevDock.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-96 pr-4">
          <div className="space-y-4">
            {activityLog.length > 0 ? (
              activityLog.map((log: ActivityLogItem) => (
                <div key={log.id} className="flex items-start gap-3 text-sm">
                  <Clock className="h-4 w-4 mt-0.5 text-muted-foreground" />
                  <div>
                    <p className="text-foreground">{log.message}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(log.timestamp), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">No recent activity.</p>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

export default function Home() {
  const { exportData, importData, refreshData } = useDevDock();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState("projects");
  const { openActivityLog } = useUIState();

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
        if(fileInputRef.current) {
            fileInputRef.current.value = "";
        }
      }
    };
    reader.readAsText(file);
  };


  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header onExport={handleExport} onImport={handleImportClick} onShowActivity={openActivityLog} />
      <CommandPalette setActiveTab={setActiveTab} />
       <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept=".json,application/json"
      />
      <main className="flex-grow container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex justify-center mb-8">
            <TabsList className="grid w-full max-w-md grid-cols-3">
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
      </main>
      <ActivityLogDialog />
    </div>
  );
}
