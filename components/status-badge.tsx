import { cn } from "@/lib/utils"

interface StatusBadgeProps {
  status: "active" | "inactive" | "warning" | "error" | "pending" | "completed" | "idle" | "maintenance"
  label?: string
  pulse?: boolean
  size?: "sm" | "md" | "lg"
  className?: string
}

const statusConfig = {
  active: {
    bg: "bg-success/10",
    text: "text-success",
    dot: "bg-success",
    defaultLabel: "Activo",
  },
  inactive: {
    bg: "bg-muted",
    text: "text-muted-foreground",
    dot: "bg-muted-foreground",
    defaultLabel: "Inactivo",
  },
  warning: {
    bg: "bg-warning/10",
    text: "text-warning",
    dot: "bg-warning",
    defaultLabel: "Advertencia",
  },
  error: {
    bg: "bg-destructive/10",
    text: "text-destructive",
    dot: "bg-destructive",
    defaultLabel: "Error",
  },
  pending: {
    bg: "bg-accent/10",
    text: "text-accent",
    dot: "bg-accent",
    defaultLabel: "Pendiente",
  },
  completed: {
    bg: "bg-primary/10",
    text: "text-primary",
    dot: "bg-primary",
    defaultLabel: "Completado",
  },
  idle: {
    bg: "bg-muted/50",
    text: "text-muted-foreground",
    dot: "bg-muted-foreground/50",
    defaultLabel: "Libre",
  },
  maintenance: {
    bg: "bg-orange-500/10",
    text: "text-orange-500",
    dot: "bg-orange-500",
    defaultLabel: "Mantenimiento",
  },
}

const sizeStyles = {
  sm: "px-2 py-0.5 text-xs",
  md: "px-2.5 py-1 text-sm",
  lg: "px-3 py-1.5 text-sm",
}

const dotSizes = {
  sm: "h-1.5 w-1.5",
  md: "h-2 w-2",
  lg: "h-2.5 w-2.5",
}

export function StatusBadge({
  status,
  label,
  pulse = false,
  size = "md",
  className,
}: StatusBadgeProps) {
  const config = statusConfig[status]

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-medium",
        config.bg,
        config.text,
        sizeStyles[size],
        className
      )}
    >
      <span
        className={cn(
          "rounded-full",
          config.dot,
          dotSizes[size],
          pulse && "animate-pulse"
        )}
      />
      {label || config.defaultLabel}
    </span>
  )
}
