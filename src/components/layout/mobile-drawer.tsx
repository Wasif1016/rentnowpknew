"use client"

import * as React from "react"
import Link from "next/link"
import { 
  SheetContent, 
  SheetHeader, 
  SheetClose
} from "@/components/ui/sheet"
import { Icon } from "@/components/ui/icon"
import { 
  Cancel01Icon,
  ArrowDown01Icon,
} from "@hugeicons/core-free-icons"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { NAV_CONFIG } from "@/config/nav-config"

export function MobileDrawer() {
  return (
    <SheetContent side="right" className="w-full border-none p-0 sm:max-w-none [&>button]:hidden">
      <div className="flex h-screen flex-col bg-background overflow-hidden">
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 h-20 border-b border-border">
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-primary flex h-8 w-8 items-center justify-center rounded-lg">
              <span className="text-primary-foreground text-lg font-black">R</span>
            </div>
            <span className="text-lg font-extrabold">RentNowPk</span>
          </Link>
          <SheetClose asChild>
            <Button variant="ghost" size="icon" className="rounded-xl">
              <Icon icon={Cancel01Icon} size={24} />
            </Button>
          </SheetClose>
        </div>

        {/* Navigation Content */}
        <div className="flex-1 overflow-y-auto px-4 py-6">
          <nav className="flex flex-col gap-2">
            {NAV_CONFIG.mainNav.map((item) => (
              <MobileNavItem key={item.title} item={item} />
            ))}
          </nav>

          <div className="mt-10 mb-26 px-4 space-y-4">
            <Button variant="outline" className="w-full justify-center h-14 rounded-xl border-primary/20 text-primary font-bold transition-all active:scale-95" asChild>
              <Link href="/auth/signup">Log in as Vendor</Link>
            </Button>
            <Button className="w-full justify-center h-14 rounded-xl bg-primary hover:bg-primary/90 font-bold shadow-lg shadow-primary/20 transition-all active:scale-95" asChild>
              <Link href="/auth/signup-customer">List Your Car</Link>
            </Button>
          </div>
        </div>
      </div>
    </SheetContent>
  )
}

function MobileNavItem({ item }: { item: any }) {
  const [isOpen, setIsOpen] = React.useState(false)
  const hasSubItems = item.items && item.items.length > 0

  if (!hasSubItems) {
    return (
      <SheetClose asChild>
        <Link 
          href={item.href} 
          className="flex items-center justify-between p-4 rounded-2xl hover:bg-muted/50 transition-colors"
        >
          <span className="text-lg font-bold">{item.title}</span>
        </Link>
      </SheetClose>
    )
  }

  return (
    <div className="flex flex-col">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center justify-between p-4 rounded-2xl transition-all",
          isOpen ? "bg-primary/5 text-primary" : "hover:bg-muted/50"
        )}
      >
        <span className="text-lg font-bold">{item.title}</span>
        <Icon 
          icon={ArrowDown01Icon} 
          size={20} 
          className={cn("transition-transform duration-300", isOpen ? "rotate-180" : "")} 
        />
      </button>
      
      <div 
        className={cn(
          "overflow-hidden transition-all duration-300 ease-in-out",
          isOpen ? "max-h-[1000px] opacity-100 py-2" : "max-h-0 opacity-0"
        )}
      >
        <div className="flex flex-col gap-1 border-l-2 border-primary/10 pl-4 ml-6 my-2">
          {item.items.map((subItem: any) => (
            <SheetClose key={subItem.title} asChild>
              <Link 
                href={subItem.href}
                className="flex flex-col p-3 rounded-xl hover:bg-muted/50 transition-colors"
              >
                <span className="text-base font-bold">{subItem.title}</span>
                {subItem.description && (
                  <span className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                    {subItem.description}
                  </span>
                )}
              </Link>
            </SheetClose>
          ))}
        </div>
      </div>
    </div>
  )
}
