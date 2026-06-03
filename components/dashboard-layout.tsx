"use client"

import { AppSidebar } from "@/components/app-sidebar"
import { AppNavbar } from "@/components/app-navbar"
import { cn } from "@/lib/utils"

interface DashboardLayoutProps {
  children: React.ReactNode
  simulationStatus?: "idle" | "running" | "paused" | "completed"
}

export function DashboardLayout({ children, simulationStatus = "idle" }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <AppSidebar />
      <div className="pl-64 transition-all duration-300">
        <AppNavbar simulationStatus={simulationStatus} />
        <main className="min-h-[calc(100vh-4rem)] p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
