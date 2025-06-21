import { DevDockIcon } from "./icons";
import { Button } from "@/components/ui/button";
import { Upload, Download } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

type HeaderProps = {
  onImport: () => void;
  onExport: () => void;
}

export function Header({ onImport, onExport }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-auto flex items-center">
          <DevDockIcon className="h-6 w-6 mr-2" />
          <span className="font-bold font-headline">DevDock</span>
        </div>
        <div className="flex items-center gap-2">
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
