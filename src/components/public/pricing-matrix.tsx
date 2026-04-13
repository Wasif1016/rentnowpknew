"use client"

import * as React from "react"
import { Icon } from "@/components/ui/icon"
import { CheckmarkCircle02Icon, RoadIcon } from "@hugeicons/core-free-icons"
import { cn } from "@/lib/utils"

interface PricingMatrixProps {
  priceDay: string | null
  priceMonth: string | null
  description?: string | null
  carDetails: {
    make: string
    name: string
    year: number
    location?: string | null
  }
  className?: string
}

export function PricingMatrix({ priceDay, priceMonth, description, carDetails, className }: PricingMatrixProps) {
  const dayPrice = priceDay ? Number(priceDay) : 0
  const monthPrice = priceMonth ? Number(priceMonth) : 0
  
  const pricingOptions = [
    { label: "1 Day", price: dayPrice, limit: "250 km", active: true },
    { label: "1 Week", price: dayPrice * 7 * 0.9, limit: "1,750 km", active: false },
    { label: "1 Month", price: monthPrice || dayPrice * 30 * 0.7, limit: "4,500 km", active: false }
  ]

  const seoTitle = `How much to Rent ${carDetails.make} ${carDetails.name} ${carDetails.year} in ${carDetails.location || 'Pakistan'}`

  return (
    <div className={cn("bg-white rounded-none md:rounded-3xl md:border md:border-slate-100 md:shadow-sm overflow-hidden", className)}>
      <div className="p-5 md:p-8 space-y-6 md:space-y-8">
        {/* RATES GRID */}
        <div>
            <h4 className="text-[17px] font-bold text-slate-900 mb-6 leading-tight hidden lg:block">
                {seoTitle}
            </h4>
            <div className="flex flex-col gap-6">
                {/* Horizontal row of cards - Responsive shrink */}
                <div className="flex gap-2 w-full">
                    {pricingOptions.map((opt) => (
                        <div key={opt.label} className={cn(
                            "flex-1 flex flex-col items-center justify-center p-2 rounded-[1rem] border transition-all h-20 md:h-24 md:p-4",
                            opt.active ? "bg-white border-slate-200 shadow-sm ring-1 ring-slate-100" : "bg-slate-50/50 border-transparent"
                        )}>
                            <span className={cn("text-[9px] md:text-[10px] font-bold uppercase tracking-wider mb-1", opt.active ? "text-slate-400" : "text-slate-400")}>
                                {opt.label}
                            </span>
                            <span className={cn("text-[13px] md:text-base font-black truncate w-full text-center tracking-tight", opt.active ? "text-slate-900" : "text-slate-400")}>
                                {opt.price > 0 ? `AED ${opt.price.toLocaleString(undefined, { maximumFractionDigits: 0 })}` : "N/A"}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      </div>
    </div>
  )
}
