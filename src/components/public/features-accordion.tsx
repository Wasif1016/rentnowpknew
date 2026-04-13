"use client"

import * as React from "react"
import { Icon } from "@/components/ui/icon"
import { 
  CheckmarkCircle02Icon, 
  ArrowDown01Icon, 
  Shield01Icon, 
  DashboardCircleIcon, 
  Car01Icon 
} from "@hugeicons/core-free-icons"
import { cn } from "@/lib/utils"

interface FeaturesAccordionProps {
  car: {
    make: string
    name: string
    year: number
  }
  features: {
    interior?: string[]
    exterior?: string[]
    safety?: string[]
  } | null
}

export function FeaturesAccordion({ car, features }: FeaturesAccordionProps) {
  const [expanded, setExpanded] = React.useState<string | null>("interior")

  if (!features) return null

  const sections = [
    { id: "interior", label: "Interior features", items: features.interior || [] },
    { id: "exterior", label: "Exterior features", items: features.exterior || [] },
    { id: "safety", label: "Safety features", items: features.safety || [] },
    { id: "comfort", label: "Comfort & Convenience features", items: features.safety || [] },
    { id: "infotainment", label: "Infotainment features", items: features.interior || [] },
  ]

  const seoTitle = `What features are included in the ${car.make} ${car.name} ${car.year}?`

  return (
    <div className="bg-white rounded-none md:rounded-3xl md:border md:border-slate-100 md:shadow-sm overflow-hidden p-5 md:p-8">
      <h4 className="text-[17px] font-bold text-slate-900 mb-6 leading-tight">
        {seoTitle}
      </h4>

      <div className="divide-y divide-slate-100">
        {sections.map((section) => (
          <div key={section.id} className="overflow-hidden bg-white">
            <button 
              onClick={() => setExpanded(expanded === section.id ? null : section.id)}
              className="w-full flex items-center justify-between py-6 md:py-8 transition-all group outline-none"
            >
              <span className="font-bold text-[15px] md:text-[16px] text-slate-800 group-hover:text-primary transition-colors">
                {section.label}
              </span>
              <Icon 
                icon={ArrowDown01Icon} 
                size={22} 
                className={cn("text-slate-400 transition-transform duration-300", expanded === section.id && "rotate-180")} 
              />
            </button>
            
            {expanded === section.id && (
              <div className="pb-8 flex flex-wrap gap-x-6 gap-y-4">
                {section.items.map((item, i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    <Icon icon={CheckmarkCircle02Icon} size={18} className="text-emerald-500 shrink-0" variant="solid" />
                    <span className="text-[14px] md:text-[15px] font-medium text-slate-700 whitespace-nowrap">{item}</span>
                  </div>
                ))}
                {section.items.length === 0 && (
                  <span className="text-xs text-slate-400 font-light italic">No specific features listed.</span>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
