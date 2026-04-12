"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Icon } from "@/components/ui/icon"
import { NAV_CONFIG } from "@/config/nav-config"
import { Badge } from "@/components/ui/badge"

export function MobileBottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 h-16 border-t border-border bg-background/95 backdrop-blur-md safe-area-pb md:hidden">
      <div className="grid h-full grid-cols-4 items-center">
        {NAV_CONFIG.mobileBottomNav.map((item) => {
          const isActive = pathname === item.href
          const iconData = item.icon

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 transition-colors duration-200",
                isActive ? "text-primary" : "text-muted-foreground"
              )}
            >
              <div className="relative">
                <Icon
                  icon={iconData}
                  size={24}
                  variant={isActive ? "solid" : "stroke"}
                  className={isActive ? "scale-110" : ""}
                />
                {item.badge && item.badge > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full p-0 text-[10px] font-bold"
                  >
                    {item.badge}
                  </Badge>
                )}
              </div>
              <span className="text-[10px] font-medium leading-none">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
