"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { LucideIcon } from "lucide-react"

interface SectionCardProps {
  title: string
  description?: string
  icon?: LucideIcon
  action?: React.ReactNode
  children: React.ReactNode
  className?: string
  contentClassName?: string
  noPadding?: boolean
}

export function SectionCard({
  title,
  description,
  icon: Icon,
  action,
  children,
  className,
  contentClassName,
  noPadding = false,
}: SectionCardProps) {
  return (
    <Card className={cn("border-border/50 bg-card/50", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div className="flex items-center gap-3">
          {Icon && (
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10 text-accent">
              <Icon className="h-4 w-4" />
            </div>
          )}
          <div>
            <CardTitle className="text-base font-semibold">{title}</CardTitle>
            {description && (
              <p className="text-sm text-muted-foreground">{description}</p>
            )}
          </div>
        </div>
        {action}
      </CardHeader>
      <CardContent className={cn(noPadding && "p-0", contentClassName)}>
        {children}
      </CardContent>
    </Card>
  )
}
