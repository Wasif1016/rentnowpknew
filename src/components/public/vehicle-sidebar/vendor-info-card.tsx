"use client"

import * as React from "react"
import Link from "next/link"
import { Icon } from "@/components/ui/icon"
import {
    Call02Icon,
    WhatsappIcon,
    CheckmarkBadge01Icon,
    Location01Icon,
    ArrowRight01Icon
} from "@hugeicons/core-free-icons"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from "@/components/ui/sheet"

interface SidebarVendorCardProps {
    vendor: {
        businessName: string
        businessLogoUrl: string | null
        businessBannerUrl?: string | null
        whatsappPhone: string
        publicSlug: string
        DealerNote: string | null
        locationAddress: string | null
        city?: string | null
        deliveryLocations?: any
    }
}

export function SidebarVendorCard({ vendor }: SidebarVendorCardProps) {
    const [isNoteOpen, setIsNoteOpen] = React.useState(false);

    return (
        <div className="flex flex-col">
            {/* HEADER BANNER */}
            <div className="relative h-24 bg-gradient-to-r from-[#FFD6AD] to-[#FFB38A] p-4 flex justify-end items-start">
                <div className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1.5 border border-white/20">
                    <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[10px] font-bold text-slate-900">Open Now</span>
                    <Icon icon={ArrowRight01Icon} size={10} className="rotate-90" />
                </div>

                {/* CIRCULAR LOGO (OVERLAPPING) */}
                <div className="absolute -bottom-10 left-1/2 -translate-x-1/2">
                    <div className="h-20 w-20 rounded-full border-4 border-white bg-slate-50 shadow-md overflow-hidden flex items-center justify-center">
                        {vendor.businessLogoUrl ? (
                            <img src={vendor.businessLogoUrl} alt={vendor.businessName} className="object-contain w-full h-full p-2" />
                        ) : (
                            <span className="text-2xl font-black text-slate-200">{vendor.businessName[0]}</span>
                        )}
                    </div>
                </div>
            </div>

            <div className="pt-12 pb-6 px-6 text-center border-b border-slate-100">
                <h4 className="font-bold text-[16px] text-black mb-6">{vendor.businessName}</h4>

                <div className="mb-6">
                    <p className="text-[14px] font-light text-black mb-4">Book Directly from the Dealer</p>
                    <div className="hidden md:grid grid-cols-2 gap-3">
                        <Button variant="outline" className="border-purple-200 text-purple-600 font-bold bg-purple-50 h-11 transition-all hover:bg-purple-100 hover:border-purple-300">
                            <Icon icon={Call02Icon} size={18} />
                            Call
                        </Button>
                        <Button variant="outline" className="border-green-200 text-green-600 font-bold bg-green-50 h-11 transition-all hover:bg-green-100 hover:border-green-300">
                            <Icon icon={WhatsappIcon} size={18} />
                            WhatsApp
                        </Button>
                    </div>
                </div>

                {/* Dealer NOTE BOX */}
                <div className="bg-slate-50 rounded-2xl p-4 text-left border border-slate-100 mb-6">
                    <p className="text-[14px] leading-[1.6]">
                        <span className="font-bold text-black">Dealer Note:</span>{" "}
                        {vendor.DealerNote ? (
                           <span className="font-light text-slate-500">
                                {vendor.DealerNote.slice(0, 80)}...{" "}
                                <Sheet>
                                    <SheetTrigger asChild>
                                        <button className="text-orange-600 font-light hover:no-underline cursor-pointer">read more</button>
                                    </SheetTrigger>
                                    <SheetContent side="right" className="w-full sm:max-w-md p-0 flex flex-col bg-white">
                                        <NotePanel vendor={vendor} />
                                    </SheetContent>
                                </Sheet>
                            </span>
                        ) : (
                            <span className="font-light text-slate-500">
                                + 5% VAT applicable. Zero Deposit for all cars...{" "}
                                <Sheet>
                                    <SheetTrigger asChild>
                                        <button className="text-orange-600 font-light hover:no-underline cursor-pointer">read more</button>
                                    </SheetTrigger>
                                    <SheetContent side="right" className="w-full sm:max-w-md p-0 flex flex-col bg-white">
                                        <NotePanel vendor={vendor} />
                                    </SheetContent>
                                </Sheet>
                            </span>
                        )}
                    </p>
                </div>

                <div className="flex items-center justify-between">
                    <Link href={`/vendor/${vendor.publicSlug}`} className="text-[14px] font-light text-[#373736] flex items-center gap-1 hover:text-slate-900 transition-colors">
                        More Ads by the Dealer <Icon icon={ArrowRight01Icon} size={12} />
                    </Link>

                    <Sheet>
                        <SheetTrigger asChild>
                            <button className="text-[14px] font-light text-[#373736] flex items-center gap-1.5 hover:text-slate-900 transition-colors cursor-pointer">
                                <Icon icon={Location01Icon} size={14} className="text-orange-600" />
                                Dealer's Info & Location
                            </button>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-full sm:max-w-md p-0 flex flex-col">
                            <NotePanel vendor={vendor} />
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </div>
    )
}

function NotePanel({ vendor }: { vendor: any }) {
    return (
        <div className="flex flex-col h-full bg-white">
            <SheetHeader className="p-8 border-b border-slate-50 relative flex flex-row items-center justify-between">
                <SheetTitle className="text-[18px] font-bold text-slate-900">Note</SheetTitle>
            </SheetHeader>

            <div className="flex-1 p-8 space-y-6 overflow-y-auto text-[14px] leading-relaxed text-[#4d4d4d]">
                <p>
                    <span className="font-bold text-black border-b border-orange-200">Dealer Note:</span>{" "}
                    <span className="font-light">We update our stock daily with the latest Sedan, Luxury, SUV and more. Contact us for the newest arrivals and current availability.</span>
                </p>

                <ul className="space-y-4 pl-2 font-light">
                    <li className="flex items-center gap-3">
                        <div className="h-1.5 w-1.5 rounded-full bg-orange-400" />
                        <span>Minimum 1 days rental</span>
                    </li>
                    <li className="flex items-center gap-3">
                        <div className="h-1.5 w-1.5 rounded-full bg-orange-400" />
                        <span>Prices are subject to + 5% VAT applicable</span>
                    </li>
                    <li className="flex items-center gap-3">
                        <div className="h-1.5 w-1.5 rounded-full bg-orange-400" />
                        <span>Extra mileage? Just USD 2.18 / km</span>
                    </li>
                </ul>

                <p className="font-light bg-slate-50 p-4 rounded-xl border border-slate-100">
                    To lock in your future booking, advance payment may be needed. Reach out via WhatsApp or call anytime!
                </p>

                <div className="h-px bg-slate-100 w-full" />

                <div className="space-y-6 font-light leading-relaxed">
                    <p className="text-[14px]">
                        <span className="text-orange-600 font-bold">RentNowPk Note:</span> This listing (including pricing and details) has been added by <span className="font-bold text-slate-900">{vendor.businessName}</span>. For bookings or more info, please contact the supplier directly via the phone number or WhatsApp button provided.
                    </p>
                    <p className="bg-orange-50/50 p-4 rounded-xl border border-orange-100/50 text-[#4d4d4d] text-[14px]">
                        If you notice any issue or mismatch, <button className="text-orange-600 font-bold hover:underline cursor-pointer">please report this listing</button> so we can take care of it. Enjoy your ride!
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

function DealerProfilePanel({ vendor }: { vendor: any }) {
    return (
        <div className="flex flex-col h-full bg-white">
            <SheetHeader className="p-6 border-b border-slate-100">
                <SheetTitle className="text-xl font-bold">Dealer's Profile</SheetTitle>
            </SheetHeader>

            <div className="pb-10">
                {/* PANEL HEADER WITH OVERLAP */}
                <div className="relative h-32 bg-slate-900 overflow-hidden">
                    <img
                        src="/blue-jeep-photo-shooting-sunset.jpg"
                        className="w-full h-full object-cover opacity-50 select-none grayscale"
                        alt="Banner"
                    />
                    <div className="absolute -bottom-12 left-1/2 -translate-x-1/2">
                        <div className="h-24 w-24 rounded-full border-4 border-white bg-white shadow-xl overflow-hidden flex items-center justify-center p-2">
                            {vendor.businessLogoUrl ? (
                                <img src={vendor.businessLogoUrl} alt={vendor.businessName} className="object-contain w-full h-full" />
                            ) : (
                                <span className="text-3xl font-black text-slate-200">{vendor.businessName[0]}</span>
                            )}
                        </div>
                    </div>
                </div>

                <div className="pt-16 px-6 space-y-8">
                    {/* LOCATION BOX */}
                    <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-4">
                        <div className="flex gap-3">
                            <Icon icon={Location01Icon} className="text-orange-600 mt-1" size={20} />
                            <p className="text-sm font-medium text-slate-700 leading-relaxed">
                                {vendor.locationAddress || "Location not specified"}
                            </p>
                        </div>
                        <div className="relative h-48 rounded-xl bg-slate-100 overflow-hidden flex items-center justify-center group cursor-pointer">
                            <img
                                src="https://maps.googleapis.com/maps/api/staticmap?center=25.1859,55.2721&zoom=15&size=400x400&key=DUMMY"
                                className="w-full h-full object-cover blur-[1px] group-hover:blur-0 transition-all"
                                alt="Map"
                            />
                            <div className="absolute inset-0 bg-black/10 transition-colors group-hover:bg-transparent" />
                            <Button className="absolute font-bold rounded-lg px-6 h-10 bg-slate-900 hover:bg-black text-white shadow-lg">
                                Load Map
                            </Button>
                        </div>
                        <Button variant="outline" className="w-full font-bold border-slate-200 py-6" asChild>
                            <Link href={`/vendor/${vendor.publicSlug}`}>View All Cars by this Dealer &rarr;</Link>
                        </Button>
                    </div>

                    {/* DESCRIPTION */}
                    <div className="space-y-4">
                        <h5 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Description</h5>
                        <p className="text-sm text-slate-600 leading-[1.8]">
                            {vendor.DealerNote || "No vendor description provided."}
                        </p>
                    </div>

                    {/* DELIVERY LOCATIONS */}
                    {vendor.deliveryLocations && (
                        <div className="space-y-4">
                            <h5 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Fast Delivery Locations</h5>
                            <div className="flex flex-wrap gap-2">
                                {(vendor.deliveryLocations as string[]).map((loc, i) => (
                                    <div key={i} className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-full text-xs font-bold text-slate-600">
                                        {loc}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
