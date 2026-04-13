"use client"

import * as React from "react"
import { Icon } from "@/components/ui/icon"
import { 
  Car01Icon, 
  UserGroupIcon, 
  Settings01Icon, 
  Fuel01Icon, 
  DashboardCircleIcon,
  Door01Icon,
  Luggage01Icon,
  PaintBoardIcon,
  Calendar01Icon
} from "@hugeicons/core-free-icons"

interface TechnicalSpecsGridProps {
  car: {
    make: string
    name: string
    year: number
    model: string
    bodyType: string | null
    seatingCapacity: number | null
    transmission: string | null
    fuelType: string | null
    engineCapacity: string | null
    doors: number | null
    luggageCapacity: number | null
    exteriorColor: string | null
    interiorColor: string | null
    pickupFormattedAddress: string | null
  }
}

export function TechnicalSpecsGrid({ car }: TechnicalSpecsGridProps) {
  const specs = [
    { label: "Body Type", value: car.bodyType || "Car", icon: Car01Icon },
    { label: "Seating Capacity", value: `${car.seatingCapacity || 5} Passengers`, icon: UserGroupIcon },
    { label: "Transmission", value: car.transmission || "Auto", icon: Settings01Icon },
    { label: "Fuel Type", value: car.fuelType || "Petrol", icon: Fuel01Icon },
    { label: "Engine Capacity", value: car.engineCapacity || "N/A", icon: DashboardCircleIcon },
    { label: "No. of Doors", value: car.doors || 4, icon: Door01Icon },
    { label: "Luggage Capacity", value: car.luggageCapacity ? `${car.luggageCapacity} Liters` : "N/A", icon: Luggage01Icon },
    { label: "Exterior Color", value: car.exteriorColor || "N/A", icon: PaintBoardIcon },
    { label: "Interior Color", value: car.interiorColor || "N/A", icon: PaintBoardIcon },
    { label: "Model Year", value: car.year, icon: Calendar01Icon },
  ]

  const seoTitle = `What are the technical specs of ${car.make} ${car.name} ${car.year}?`

  return (
    <div className="bg-white p-5 md:p-8 rounded-none md:rounded-3xl md:border md:border-slate-100 md:shadow-sm overflow-hidden">
        <h4 className="text-[17px] font-bold text-slate-900 mb-8 leading-tight">
            {seoTitle}
        </h4>
        
        <div className="flex flex-col md:grid md:grid-cols-2 md:gap-x-12 md:gap-y-8">
            {specs.map((spec, idx) => (
                <div key={idx} className="flex items-center justify-between group py-3 border-b border-slate-50 md:border-b-0 md:py-0">
                    <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-slate-100 group-hover:text-slate-900 transition-all shrink-0">
                            <Icon icon={spec.icon} size={18} />
                        </div>
                        <span className="text-[14px] font-light text-slate-500 whitespace-nowrap">{spec.label}</span>
                    </div>
                    <span className="text-[14px] font-bold text-slate-900 text-right underline underline-offset-4 decoration-slate-200">
                        {spec.value}
                    </span>
                </div>
            ))}
        </div>
    </div>
  )
}
