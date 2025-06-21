
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
      <div className="container flex h-16 items-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mr-auto flex items-center">
          <DevDockIcon className="h-7 w-7 mr-3 text-primary" />
          <span className="text-xl font-bold tracking-tight">DevDock</span>
        </div>
        <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className="relative h-10 w-full justify-start rounded-md bg-background text-sm font-normal text-muted-foreground shadow-none sm:pr-12 md:w-40 lg:w-64"
              onClick={() => setShowCommandPalette(true)}
            >
              <Search className="h-4 w-4 mr-2" />
              <span className="hidden lg:inline-flex">Search actions...</span>
              <span className="inline-flex lg:hidden">Search...</span>
              <kbd className="pointer-events-none absolute right-1.5 top-1/2 -translate-y-1/2 hidden h-6 select-none items-center gap-1 rounded border bg-muted px-2 font-mono text-[10px] font-medium opacity-100 sm:flex">
                <span className="text-base">⌘</span>K
              </kbd>
            </Button>
            <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={onImport}>
                    <Upload className="h-4 w-4" />
                    <span className="sr-only">Import Data</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  Import from .devdock.json
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
             <TooltipProvider delayDuration={0}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={onExport}>
                    <Download className="h-4 w-4" />
                    <span className="sr-only">Export Data</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  Export to .devdock.json
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
        </div>
      </div>
    </header>
  );
}
