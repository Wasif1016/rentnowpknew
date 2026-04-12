"use client"

import * as React from "react"
import { Icon } from "@/components/ui/icon"
import { 
  Location01Icon, 
  Notification01Icon, 
  Menu01Icon 
} from "@hugeicons/core-free-icons"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MobileDrawer } from "./mobile-drawer"
import { Sheet, SheetTrigger } from "@/components/ui/sheet"

export function MobileHeader() {
  const [currentCity, setCurrentCity] = React.useState("Lahore")

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-14 border-b border-border bg-background/95 backdrop-blur-md md:hidden">
      <div className="flex h-full items-center justify-between px-4">
        {/* Profile/Hamburger Area */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Icon icon={Menu01Icon} size={22} className="text-foreground" />
            </Button>
          </SheetTrigger>
          <MobileDrawer />
        </Sheet>

        {/* Location Selector */}
        <Button 
          variant="ghost" 
          className="flex items-center gap-1.5 px-2 hover:bg-muted/50 transition-colors"
          onClick={() => {/* Open city modal */}}
        >
          <Icon icon={Location01Icon} size={18} className="text-primary" variant="solid" />
          <span className="text-sm font-semibold">{currentCity}</span>
          <span className="text-[10px] text-muted-foreground ml-0.5">▼</span>
        </Button>

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative h-9 w-9 rounded-full">
          <Icon icon={Notification01Icon} size={22} />
          <Badge 
            className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500 p-0 border-2 border-background" 
          />
        </Button>
      </div>
    </header>
  )
}
