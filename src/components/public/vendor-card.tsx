"use client"

import * as React from "react"
import Link from "next/link"
import { Icon } from "@/components/ui/icon"
import { 
  StarIcon, 
  Location01Icon, 
  Call02Icon, 
  WhatsappIcon,
  CheckmarkBadge01Icon
} from "@hugeicons/core-free-icons"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface VendorCardProps {
  vendor: {
    businessName: string
    businessLogoUrl: string | null
    avgRating: string
    totalReviews: number
    whatsappPhone: string
    publicSlug: string
  }
  isCompact?: boolean
  className?: string
}

export function VendorCard({ vendor, isCompact = false, className }: VendorCardProps) {
  return (
    <div className={cn("bg-white rounded-2xl border border-border overflow-hidden", className)}>
      <div className="p-5">
        <div className="flex items-center gap-4 mb-6">
          <div className="h-14 w-14 rounded-xl border border-border bg-slate-50 overflow-hidden flex items-center justify-center relative">
            {vendor.businessLogoUrl ? (
              <img src={vendor.businessLogoUrl} alt={vendor.businessName} className="object-contain w-full h-full" />
            ) : (
              <span className="text-xl font-black text-primary/20">{vendor.businessName[0]}</span>
            )}
            <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm">
                <Icon icon={CheckmarkBadge01Icon} size={16} className="text-blue-500" />
            </div>
          </div>
          <div className="flex flex-col">
            <h4 className="font-bold text-lg leading-tight mb-1">{vendor.businessName}</h4>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                <span className="flex items-center gap-0.5 text-amber-500">
                    <Icon icon={StarIcon} size={12} variant="solid" />
                    <span className="text-foreground font-bold">{Number(vendor.avgRating).toFixed(1)}</span>
                </span>
                <span>({vendor.totalReviews} Reviews)</span>
            </div>
          </div>
        </div>

        <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-6 border-b border-border pb-4 border-dashed">
            Book directly from the vendor
        </p>

        <div className="space-y-2">
            <Button className="w-full bg-slate-900 hover:bg-black text-white py-6 rounded-xl font-bold gap-2">
                <Icon icon={Call02Icon} size={18} />
                Call Now
            </Button>
            <Button className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white py-6 rounded-xl font-bold gap-2">
                <Icon icon={WhatsappIcon} size={18} />
                WhatsApp
            </Button>
        </div>

        <div className="mt-8 pt-6 border-t border-border flex flex-col gap-4 text-xs font-medium text-muted-foreground">
            <div className="flex items-center gap-2">
                <Icon icon={CheckmarkBadge01Icon} size={14} className="text-green-500" />
                <span>Verified Business Registration</span>
            </div>
            <div className="flex items-center gap-2">
                <Icon icon={CheckmarkBadge01Icon} size={14} className="text-green-500" />
                <span>Ownership Docs Verified</span>
            </div>
        </div>
      </div>
      
      <div className="bg-slate-50 px-5 py-4 flex items-center justify-between">
            <Link href={`/vendor/${vendor.publicSlug}`} className="text-[11px] font-bold text-primary hover:underline">
                View Company Profile
            </Link>
            <div className="flex items-center gap-1 text-[11px] font-bold text-muted-foreground">
                <Icon icon={Location01Icon} size={12} />
                Lahore, DHA
            </div>
      </div>
    </div>
  )
}
