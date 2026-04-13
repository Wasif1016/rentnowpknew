"use client"

import * as React from "react"
import Link from "next/link"
import { Icon } from "@/components/ui/icon"
import { ArrowRight01Icon, Home01Icon } from "@hugeicons/core-free-icons"

interface BreadcrumbsProps {
  items: {
    label: string
    href?: string
  }[]
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav className="flex items-center gap-2 text-xs font-medium text-muted-foreground mb-6 overflow-x-auto whitespace-nowrap pb-2 md:pb-0 scrollbar-hide">
      <Link href="/" className="hover:text-primary transition-colors flex items-center gap-1">
        <Icon icon={Home01Icon} size={14} />
        <span>Home</span>
      </Link>
      
      {items.map((item, idx) => (
        <React.Fragment key={idx}>
          <Icon icon={ArrowRight01Icon} size={12} className="text-muted-foreground/40" />
          {item.href ? (
            <Link href={item.href} className="hover:text-primary transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className="text-foreground font-semibold">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  )
}
