'use client'

import { DevDockDataProvider } from "@/contexts/DevDockDataContext"
import { UIStateProvider } from "@/contexts/UIStateContext"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <UIStateProvider>
      <DevDockDataProvider>
        {children}
      </DevDockDataProvider>
    </UIStateProvider>
  )
}
