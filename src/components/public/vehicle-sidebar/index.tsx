"use client"

import * as React from "react"
import { SidebarVendorCard } from "./vendor-info-card"
import { RentalTermsCard } from "./rental-terms-card"
import { SidebarFooterActions } from "./sidebar-footer-actions"

interface VehicleSidebarProps {
  car: any
}

export function VehicleSidebar({ car }: VehicleSidebarProps) {
  return (
    <div className="md:sticky md:top-24">
        <div className="bg-white rounded-none md:rounded-[2rem] md:border md:border-slate-100 md:shadow-sm overflow-hidden flex flex-col">
            <SidebarVendorCard vendor={car.vendor} />
            <RentalTermsCard terms={car.rentalTerms || {}} />
            <SidebarFooterActions vehicleId={car.id} />
        </div>
    </div>
  )
}
