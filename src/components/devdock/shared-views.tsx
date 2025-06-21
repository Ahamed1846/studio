'use client';

import { AlertTriangle } from "lucide-react";

export function ErrorView({ error }: { error: string | null }) {
    return (
        <div className="text-center py-20 border-2 border-dashed rounded-xl bg-card text-destructive">
            <div className="flex justify-center items-center w-16 h-16 mx-auto bg-destructive/10 rounded-full mb-4">
              <AlertTriangle className="h-8 w-8" />
            </div>
            <h3 className="mt-4 text-xl font-semibold">An Error Occurred</h3>
            <p className="mt-2 text-base text-muted-foreground">{error || "Something went wrong."}</p>
        </div>
    );
}
