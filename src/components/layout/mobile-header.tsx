"use client"

import * as React from "react"
import Link from "next/link"
import { Icon } from "@/components/ui/icon"
import { Menu01Icon } from "@hugeicons/core-free-icons"
import { Button } from "@/components/ui/button"
import { MobileDrawer } from "./mobile-drawer"
import { Sheet, SheetTrigger } from "@/components/ui/sheet"

export function MobileHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 border-b border-border bg-background/95 backdrop-blur-md md:hidden">
      <div className="flex h-full items-center justify-between px-4">
        {/* Logo Left */}
        <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-90">
          <div className="bg-primary flex h-8 w-8 items-center justify-center rounded-lg shadow-lg shadow-primary/20">
            <span className="text-primary-foreground text-lg font-black">R</span>
          </div>
          <span className="text-lg font-extrabold tracking-tight">
            RentNow<span className="text-primary">Pk</span>
          </span>
        </Link>

        {/* Hamburger Right */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-xl hover:bg-muted transition-colors">
              <Icon icon={Menu01Icon} size={24} className="text-foreground" />
            </Button>
          </SheetTrigger>
          <MobileDrawer />
        </Sheet>
      </div>
    </header>
  )
}
