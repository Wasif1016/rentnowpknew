"use client"

import * as React from "react"
import Link from "next/link"
import { 
  SheetContent, 
  SheetHeader, 
  SheetTitle,
  SheetDescription 
} from "@/components/ui/sheet"
import { Icon } from "@/components/ui/icon"
import { 
  UserAccountIcon, 
  Message01Icon, 
  Settings02Icon, 
  Logout01Icon,
  Search01Icon,
  Task01Icon,
  HelpCircleIcon,
  InformationCircleIcon,
  Building01Icon,
  Navigation03Icon,
  Briefcase02Icon,
  FavouriteIcon
} from "@hugeicons/core-free-icons"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { NAV_CONFIG } from "@/config/nav-config"

export function MobileDrawer() {
  const isLoggedIn = true // This should come from your auth state
  
  return (
    <SheetContent side="left" className="w-[85%] p-0 sm:max-w-sm">
      <div className="flex flex-col h-full bg-background overflow-y-auto">
        {/* Header / Profile section */}
        <SheetHeader className="p-6 bg-muted/30 border-b border-border text-left">
          <div className="flex items-center gap-4">
            <Avatar className="h-14 w-14 border-2 border-primary/20">
              <AvatarImage src="" />
              <AvatarFallback className="bg-primary/10 text-primary font-bold text-lg">W</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <SheetTitle className="text-lg font-bold">Wasif Rehan</SheetTitle>
              <SheetDescription className="text-primary text-xs font-medium uppercase tracking-wider">
                Customer Account
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <div className="flex-1 py-4">
          {/* Account Section */}
          <section className="px-2">
            <div className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70">
              Your Account
            </div>
            <div className="space-y-1">
              <DrawerItem icon={<Icon icon={Task01Icon} size={20} />} label="My Bookings" href="/customer/bookings" />
              <DrawerItem icon={<Icon icon={Message01Icon} size={20} />} label="My Conversations" href="/customer/messages" />
              <DrawerItem icon={<Icon icon={FavouriteIcon} size={20} />} label="My Favorites" href="/customer/favorites" />
              <DrawerItem icon={<Icon icon={Settings02Icon} size={20} />} label="Settings" href="/customer/settings" />
              <DrawerItem icon={<Icon icon={Logout01Icon} size={20} />} label="Logout" href="/api/auth/logout" className="text-red-500" />
            </div>
          </section>

          <Separator className="my-4 mx-6 opacity-30" />

          {/* Browse Section */}
          <section className="px-2">
            <div className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70">
              Browse & Discover
            </div>
            <div className="space-y-1">
              <DrawerItem icon={<Icon icon={Search01Icon} size={20} />} label="Rent a Car (Browse All)" href="/search" />
              <DrawerItem icon={<Icon icon={Briefcase02Icon} size={20} />} label="Cars with Driver" href="/search?mode=chauffeur" />
              <DrawerItem icon={<Icon icon={Navigation03Icon} size={20} />} label="Self Drive Cars" href="/search?mode=self-drive" />
              <DrawerItem icon={<Icon icon={Building01Icon} size={20} />} label="Rent by City" href="/cities" />
            </div>
          </section>

          <Separator className="my-4 mx-6 opacity-30" />

          {/* Vendor Section */}
          <section className="px-4 py-4">
            <div className="bg-primary/5 rounded-2xl p-4 border border-primary/10">
              <div className="text-sm font-bold mb-1">Make money with your car</div>
              <p className="text-xs text-muted-foreground mb-4 leading-relaxed">List your vehicle and start earning in Pakistan's top marketplace.</p>
              <Button size="sm" className="w-full font-bold shadow-lg shadow-primary/20" asChild>
                <Link href="/auth/signup">List Your Car</Link>
              </Button>
            </div>
          </section>

          {/* Support Section */}
          <section className="px-2 pb-10">
            <div className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70">
              Support
            </div>
            <div className="space-y-1">
              <DrawerItem icon={<Icon icon={HelpCircleIcon} size={20} />} label="Help Center" href="/help" />
              <DrawerItem icon={<Icon icon={InformationCircleIcon} size={20} />} label="About Us" href="/about" />
            </div>
          </section>
        </div>
      </div>
    </SheetContent>
  )
}

function DrawerItem({ 
  icon, 
  label, 
  href, 
  className 
}: { 
  icon: React.ReactNode, 
  label: string, 
  href: string,
  className?: string
}) {
  return (
    <Link 
      href={href} 
      className="flex items-center gap-3 px-4 py-3.5 rounded-xl hover:bg-muted/60 transition-colors group"
    >
      <span className="text-muted-foreground group-hover:text-primary transition-colors">
        {icon}
      </span>
      <span className={cn("text-sm font-semibold", className)}>
        {label}
      </span>
    </Link>
  )
}
