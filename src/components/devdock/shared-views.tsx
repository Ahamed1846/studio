'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { FolderCheck, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function PermissionRequiredView({ grantPermission }: { grantPermission: () => Promise<void> }) {
  const [isRequesting, setIsRequesting] = useState(false);

  const handleClick = async () => {
    setIsRequesting(true);
    await grantPermission();
    // The component will re-render with a new status from the context
  };

  return (
    <Card className="mt-10 max-w-lg mx-auto">
      <CardHeader>
        <CardTitle className="text-center">Permission Required</CardTitle>
      </CardHeader>
      <CardContent className="text-center">
        <FolderCheck className="h-12 w-12 mx-auto text-primary mb-4" />
        <p className="text-muted-foreground mb-6">
          To store your projects and snippets, this app needs access to a directory on your computer. A file named `.devdock.json` will be created there.
        </p>
        <Button onClick={handleClick} disabled={isRequesting} className="bg-accent text-accent-foreground hover:bg-accent/90">
          {isRequesting ? "Waiting for Permission..." : "Choose a Directory"}
        </Button>
      </CardContent>
    </Card>
  );
}

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
