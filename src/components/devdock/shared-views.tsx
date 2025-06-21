'use client';

import { AlertTriangle } from "lucide-react";
import { Button } from "../ui/button";

export function ErrorView({ error }: { error: string | null }) {
    const handleReload = () => {
        window.location.reload();
    }

    return (
        <div className="text-center py-16 px-4 border-2 border-dashed rounded-xl bg-card border-destructive/50 text-destructive">
            <div className="flex justify-center items-center w-16 h-16 mx-auto bg-destructive/10 rounded-full mb-6">
              <AlertTriangle className="h-8 w-8" />
            </div>
            <h3 className="mt-4 text-2xl font-semibold">An Error Occurred</h3>
            <p className="mt-2 text-base text-destructive/80 max-w-md mx-auto">{error || "Something went wrong while loading your data."}</p>
            <div className="mt-6">
                <Button variant="destructive" onClick={handleReload}>
                    Reload Application
                </Button>
            </div>
        </div>
    );
}
