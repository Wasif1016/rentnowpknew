import type { Metadata } from "next"
import { MarketingFooter } from "@/components/public/marketing-footer"
import { MarketingHeader } from "@/components/public/marketing-header"
import { MobileHeader } from "@/components/layout/mobile-header"
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav"

export const metadata: Metadata = {
  title: "RentNowPk — Car rental marketplace",
  description: "Find and book rental vehicles from verified vendors across Pakistan.",
}

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="bg-background text-foreground flex min-h-dvh flex-col">
      <MarketingHeader />
      <MobileHeader />
      <main className="flex-1 pb-20 md:pb-0 pt-14 md:pt-0">{children}</main>
      <MarketingFooter />
      <MobileBottomNav />
    </div>
  )
}
