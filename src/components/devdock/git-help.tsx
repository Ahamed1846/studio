"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { gitHelpItems } from "@/lib/constants";
import { Terminal } from "lucide-react";

export function GitHelp() {
  return (
    <div className="space-y-8 max-w-4xl mx-auto">
       <div className="text-center">
         <h2 className="text-3xl font-bold tracking-tight">Git Command Quick Reference</h2>
         <p className="mt-2 text-lg text-muted-foreground">
           A curated list of common Git commands for your daily workflow.
         </p>
      </div>
      <Accordion type="single" collapsible className="w-full">
        {gitHelpItems.map((item, index) => (
          <AccordionItem value={`item-${index}`} key={index} className="border-b">
            <AccordionTrigger className="text-left text-base font-medium hover:no-underline">
              {item.question}
            </AccordionTrigger>
            <AccordionContent>
              <div className="bg-muted p-4 rounded-md overflow-x-auto group">
                <div className="flex items-center text-sm text-muted-foreground mb-2">
                  <Terminal className="h-4 w-4 mr-2" />
                  <span>Terminal Command</span>
                </div>
                <pre>
                  <code className="font-mono text-sm">{item.answer}</code>
                </pre>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
