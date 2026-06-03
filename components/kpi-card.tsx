import { cn } from "@/lib/utils"
import { LucideIcon } from "lucide-react"

interface KPICardProps {
  title: string
  value: string | number
  subtitle?: string
  change?: {
    value: number
    trend: "up" | "down" | "neutral"
  }
  icon?: LucideIcon
  variant?: "default" | "accent" | "success" | "warning" | "destructive"
  className?: string
}

export function KPICard({
  title,
  value,
  subtitle,
  change,
  icon: Icon,
  variant = "default",
  className,
}: KPICardProps) {
  const variantStyles = {
    default: "border-border",
    accent: "border-accent/30 bg-accent/5",
    success: "border-success/30 bg-success/5",
    warning: "border-warning/30 bg-warning/5",
    destructive: "border-destructive/30 bg-destructive/5",
  }

  const iconStyles = {
    default: "bg-secondary text-foreground",
    accent: "bg-accent/10 text-accent",
    success: "bg-success/10 text-success",
    warning: "bg-warning/10 text-warning",
    destructive: "bg-destructive/10 text-destructive",
  }

  const changeColors = {
    up: "text-success",
    down: "text-destructive",
    neutral: "text-muted-foreground",
  }

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-xl border bg-card p-5 transition-all hover:border-accent/50 hover:shadow-lg hover:shadow-accent/5",
        variantStyles[variant],
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold tracking-tight">{value}</p>
          {subtitle && (
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          )}
        </div>
        {Icon && (
          <div
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-lg transition-transform group-hover:scale-110",
              iconStyles[variant]
            )}
          >
            <Icon className="h-5 w-5" />
          </div>
        )}
      </div>
      {change && (
        <div className="mt-3 flex items-center gap-1">
          <span className={cn("text-sm font-medium", changeColors[change.trend])}>
            {change.trend === "up" ? "↑" : change.trend === "down" ? "↓" : "→"}{" "}
            {Math.abs(change.value)}%
          </span>
          <span className="text-xs text-muted-foreground">vs. período anterior</span>
        </div>
      )}
      
      {/* Decorative gradient */}
      <div className="pointer-events-none absolute -right-4 -top-4 h-24 w-24 rounded-full bg-gradient-to-br from-accent/10 to-transparent opacity-0 blur-2xl transition-opacity group-hover:opacity-100" />
    </div>
  )
}
