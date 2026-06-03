"use client"

interface AppNavbarProps {
  simulationStatus?: "idle" | "running" | "paused" | "completed"
}

export function AppNavbar({ simulationStatus = "idle" }: AppNavbarProps) {
  const statusConfig = {
    idle: { label: "Inactivo", color: "bg-muted-foreground" },
    running: { label: "En Ejecución", color: "bg-success" },
    paused: { label: "Pausado", color: "bg-warning" },
    completed: { label: "Completado", color: "bg-accent" },
  }

  const status = statusConfig[simulationStatus]

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/95 px-6 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 rounded-full bg-secondary/50 px-4 py-1.5">
          <div className={`h-2 w-2 rounded-full ${status.color} ${simulationStatus === "running" ? "animate-pulse" : ""}`} />
          <span className="text-sm font-medium">{status.label}</span>
        </div>
      </div>
    </header>
  )
}
