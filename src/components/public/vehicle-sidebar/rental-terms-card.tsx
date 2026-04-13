"use client"

import * as React from "react"
import { Icon } from "@/components/ui/icon"
import { 
  DashboardCircleIcon,
  Fuel01Icon,
  Luggage01Icon,
  Calendar01Icon,
  InformationCircleIcon,
  Settings01Icon,
  ArrowDown01Icon
} from "@hugeicons/core-free-icons"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface RentalTermsCardProps {
  terms: {
    mileage_policy?: string
    fuel_policy?: string
    deposit_policy?: string
    rental_policy?: string
  }
}

export function RentalTermsCard({ terms }: RentalTermsCardProps) {
  const [isExpanded, setIsExpanded] = React.useState(false);

  const policies = [
    { 
        title: "Mileage Policy", 
        icon: DashboardCircleIcon, 
        content: terms.mileage_policy || "Standard mileage limit is 250 km per day. Excess mileage is charged at a pre-defined rate. Documentation of your starting mileage is recommended before departure."
    },
    { 
        title: "Fuel Policy", 
        icon: Fuel01Icon, 
        content: terms.fuel_policy || "Full-to-Full: The vehicle is delivered with a full tank and should be returned full. Alternatively, fuel charges may apply if the vehicle is returned with less fuel."
    },
    { 
        title: "Deposit Policy", 
        icon: Settings01Icon, 
        content: terms.deposit_policy || "Security deposit is processed via credit card or cash and is fully refundable after 15-30 days, following a check for traffic fines or damage."
    },
    { 
        title: "Rental Policy", 
        icon: Calendar01Icon, 
        content: terms.rental_policy || "Car rentals operate on a 12shr-hour cycle. Returning late may result in a full-day charge. Please ensure you have a valid driving license and ID ready."
    },
  ];

  return (
    <div className="flex flex-col border-b border-slate-100 bg-white">
      {/* MOBILE ACCORDION HEADER / DESKTOP STATIC HEADER */}
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-6 md:p-6 md:pb-2 md:cursor-default"
      >
        <h4 className="font-bold text-[15px] md:text-[16px] text-slate-800">Rental Terms</h4>
        <Icon 
            icon={ArrowDown01Icon} 
            size={20} 
            className={cn("text-slate-400 transition-transform duration-300 md:hidden", isExpanded && "rotate-180")} 
        />
      </button>
      
      <div className={cn(
        "overflow-hidden transition-all duration-300",
        "md:block md:max-h-none",
        isExpanded ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0 md:opacity-100"
      )}>
        <div className="p-6 pt-0 md:pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-1.5 md:gap-y-0 gap-x-4">
                {policies.map((policy, i) => (
                    <Sheet key={i}>
                        <SheetTrigger asChild>
                            <button className="flex items-center justify-between text-left group transition-all cursor-pointer py-1.5 md:py-2">
                                <div className="flex items-center gap-3">
                                    <Icon icon={policy.icon} size={18} className="text-slate-400 group-hover:text-slate-900 transition-all" />
                                    <span className="text-[14px] font-medium text-slate-600 group-hover:text-slate-900 transition-colors">
                                        {policy.title}
                                    </span>
                                </div>
                                <div className="pointer-events-auto">
                                    <Icon icon={InformationCircleIcon} size={16} className="text-slate-400 group-hover:text-slate-900 transition-all opacity-40" />
                                </div>
                            </button>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-full sm:max-w-md p-0 flex flex-col bg-white">
                            <PolicyDetailPanel title={policy.title} content={policy.content} />
                        </SheetContent>
                    </Sheet>
                ))}
            </div>
        </div>
      </div>
    </div>
  )
}

function PolicyDetailPanel({ title, content }: { title: string, content?: string }) {
    return (
        <div className="flex flex-col h-full bg-white">
            <SheetHeader className="p-8 border-b border-slate-50 relative">
                <SheetTitle className="text-[18px] font-bold text-slate-900">{title}</SheetTitle>
            </SheetHeader>
            <div className="flex-1 p-8 overflow-y-auto space-y-8">
                <div className="prose prose-slate prose-sm max-w-none">
                    {content?.split('\n').map((line, i) => {
                        const isTip = line.trim().startsWith("Tip:") || line.trim().startsWith("Important:");
                        return (
                            <p 
                                key={i} 
                                className={cn(
                                    "text-[14px] font-light text-[#4d4d4d] leading-relaxed",
                                    isTip && "p-4 bg-orange-50 border-l-4 border-orange-400 font-medium text-orange-900 rounded-r-lg"
                                )}
                            >
                                {line}
                            </p>
                        )
                    })}
                </div>

                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-4">
                    <h6 className="font-bold text-[14px] text-slate-900">Pro Tip for Renters</h6>
                    <p className="text-[14px] font-light text-[#4d4d4d] leading-relaxed">
                        Keep Records – Always document all communications with the car rental provider in text format, such as WhatsApp chats or emails. This helps avoid misunderstandings and provides proof in case of disputes.
                    </p>
                </div>
            </div>

            <div className="p-8 border-t border-slate-50 bg-white">
                <SheetClose asChild>
                    <Button variant="default" className="w-full h-14 rounded-full bg-slate-900 hover:bg-black text-white font-bold transition-all text-base shadow-lg cursor-pointer">
                        Continue
                    </Button>
                </SheetClose>
            </div>
        </div>
    )
}
