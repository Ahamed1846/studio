'use client'

import { DevDockDataProvider } from "@/contexts/DevDockDataContext"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <DevDockDataProvider>
      {children}
    </DevDockDataProvider>
  )
}
