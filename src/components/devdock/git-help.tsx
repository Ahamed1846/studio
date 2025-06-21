"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { gitHelpItems } from "@/lib/constants";

export function GitHelp() {
  return (
    <div className="space-y-4">
       <div className="text-center">
         <h2 className="text-2xl font-bold font-headline">Git Command Quick Reference</h2>
         <p className="text-muted-foreground">
           A quick list of common Git commands.
         </p>
      </div>
      <Accordion type="single" collapsible className="w-full">
        {gitHelpItems.map((item, index) => (
          <AccordionItem value={`item-${index}`} key={index}>
            <AccordionTrigger className="text-left font-medium hover:no-underline">
              {item.question}
            </AccordionTrigger>
            <AccordionContent>
              <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                <code className="font-code text-sm">{item.answer}</code>
              </pre>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
