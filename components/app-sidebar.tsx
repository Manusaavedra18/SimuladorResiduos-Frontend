"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  Settings,
  BarChart3,
  Recycle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

const navigation = [
  {
    name: "Configuración",
    href: "/",
    icon: Settings,
    description: "Parámetros de simulación"
  },
  {
    name: "Resultados",
    href: "/resultados",
    icon: BarChart3,
    description: "Análisis y métricas"
  },
]

export function AppSidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-sidebar-border bg-sidebar transition-all duration-300",
          collapsed ? "w-16" : "w-64"
        )}
      >
        <div className="flex h-16 items-center border-b border-sidebar-border px-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10 text-accent">
              <Recycle className="h-5 w-5" />
            </div>
            {!collapsed && (
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-sidebar-foreground">Flux-Stena</span>
              </div>
            )}
          </div>
        </div>

        <nav className="flex-1 space-y-1 px-2 py-4">
          <div className={cn("mb-2 px-3", collapsed && "px-0 text-center")}>
            {!collapsed && (
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Navegación
              </span>
            )}
          </div>
          {navigation.map((item) => {
            const isActive = pathname === item.href
            const LinkContent = (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-primary"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                )}
              >
                <item.icon
                  className={cn(
                    "h-5 w-5 shrink-0 transition-colors",
                    isActive ? "text-accent" : "text-muted-foreground group-hover:text-sidebar-foreground"
                  )}
                />
                {!collapsed && <span>{item.name}</span>}
                {isActive && !collapsed && (
                  <div className="ml-auto h-1.5 w-1.5 rounded-full bg-accent" />
                )}
              </Link>
            )

            if (collapsed) {
              return (
                <Tooltip key={item.name}>
                  <TooltipTrigger asChild>{LinkContent}</TooltipTrigger>
                  <TooltipContent side="right" className="flex flex-col">
                    <span className="font-medium">{item.name}</span>
                    <span className="text-xs text-muted-foreground">{item.description}</span>
                  </TooltipContent>
                </Tooltip>
              )
            }

            return LinkContent
          })}
        </nav>

        <div className="border-t border-sidebar-border p-2">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-center"
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <>
                <ChevronLeft className="h-4 w-4 mr-2" />
                <span className="text-xs">Colapsar</span>
              </>
            )}
          </Button>
        </div>
      </aside>
    </TooltipProvider>
  )
}
