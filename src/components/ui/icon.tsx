"use client"

import * as React from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { cn } from "@/lib/utils"

/**
 * Custom Icon component for the RentNowPk platform.
 * Wraps @hugeicons/react to provide a consistent API and design token integration.
 */

export interface IconProps {
  /** The icon data object from @hugeicons/core-free-icons */
  icon: any
  /** Size in pixels (default: 24) */
  size?: number | string
  /** Icon variant: "stroke" | "solid" | "duotone" etc. (default: "stroke") */
  variant?: "stroke" | "solid" | "bulk" | "duotone" | "twotone"
  /** Custom Tailwind classes for coloring and positioning */
  className?: string
  /** Optional stroke width if supported by the icon */
  strokeWidth?: number
}

export function Icon({ 
  icon, 
  size = 24, 
  variant = "stroke", 
  className,
  ...props 
}: IconProps) {
  if (!icon) return null

  return (
    <HugeiconsIcon
      icon={icon}
      size={size}
      variant={variant}
      className={cn(
        "shrink-0 transition-all duration-200",
        // Default color if not provided via className
        !className?.includes("text-") && "text-current",
        className
      )}
      {...props}
    />
  )
}

/**
 * Simple icon wrapper for themed variations
 */
export const BrandIcon = ({ className, ...props }: IconProps) => (
  <Icon 
    className={cn("text-primary shadow-sm shadow-primary/10", className)} 
    variant="solid" 
    {...props} 
  />
)

export const MutedIcon = ({ className, ...props }: IconProps) => (
  <Icon 
    className={cn("text-muted-foreground/60", className)} 
    {...props} 
  />
)
