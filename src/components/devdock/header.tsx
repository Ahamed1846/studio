import { DevDockIcon } from "./icons";
import { Button } from "@/components/ui/button";
import { Upload, Download, Search } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useUIState } from "@/contexts/UIStateContext";

type HeaderProps = {
  onImport: () => void;
  onExport: () => void;
}

export function Header({ onImport, onExport }: HeaderProps) {
  const { setShowCommandPalette } = useUIState();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-auto flex items-center">
          <DevDockIcon className="h-6 w-6 mr-2" />
          <span className="font-bold font-headline">DevDock</span>
        </div>
        <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className="relative h-9 w-full justify-start rounded-[0.5rem] bg-background text-sm font-normal text-muted-foreground shadow-none sm:w-64"
              onClick={() => setShowCommandPalette(true)}
            >
              <Search className="h-4 w-4 mr-2" />
              <span className="hidden lg:inline-flex">Search actions...</span>
              <span className="inline-flex lg:hidden">Search...</span>
              <kbd className="pointer-events-none absolute right-[0.3rem] top-[0.3rem] hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
                <span className="text-xs">⌘</span>K
              </kbd>
            </Button>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={onImport}>
                    <Upload className="h-4 w-4" />
                    <span className="sr-only">Import Data</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Import from .devdock.json</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
             <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={onExport}>
                    <Download className="h-4 w-4" />
                    <span className="sr-only">Export Data</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Export to .devdock.json</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
        </div>
      </div>
    </header>
  );
}
