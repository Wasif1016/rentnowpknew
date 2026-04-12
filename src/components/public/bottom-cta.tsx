"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"
import { AppleIcon, PlayStoreIcon, ArrowRight01Icon } from "@hugeicons/core-free-icons"

export function BottomCTA() {
  return (
    <section className="w-full max-w-[1300px] mx-auto px-4 py-16">
      <div className="group relative w-full rounded-[2.5rem] bg-black text-white p-12 overflow-hidden border border-black hover:border-orange-600 transition-all duration-500">
        {/* Background Accents */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-orange-600/20 to-transparent pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-primary/10 rounded-full blur-[80px] pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="max-w-xl">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              List Your Car and <span className="text-orange-500">Start Earning</span> Today
            </h2>
            <p className="text-white/70 text-lg mb-10">
              Join Pakistan's largest vehicle marketplace as a vendor. Reach thousands of customers and manage your bookings effortlessly.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Button size="lg" className="bg-orange-600 hover:bg-orange-700 text-white rounded-2xl h-14 px-8 font-bold text-lg group/btn">
                Register as Vendor
                <Icon icon={ArrowRight01Icon} className="ml-2 group-hover/btn:translate-x-1 transition-transform" />
              </Button>
              <Button size="lg" variant="outline" className="border-white/20 hover:bg-white/10 text-white rounded-2xl h-14 px-8 font-bold">
                Learn More
              </Button>
            </div>
            
            <div className="flex items-center gap-6 opacity-60">
              <div className="flex items-center gap-2">
                 <Icon icon={AppleIcon} size={20} />
                 <span className="text-xs font-medium">App Store</span>
              </div>
              <div className="flex items-center gap-2">
                 <Icon icon={PlayStoreIcon} size={20} />
                 <span className="text-xs font-medium">Google Play</span>
              </div>
            </div>
          </div>
          
          <div className="hidden lg:flex justify-end relative">
            {/* Minimalist Visual - Mocking a dashboard or car silhouette */}
            <div className="w-[400px] h-[300px] rounded-3xl bg-white/5 backdrop-blur-sm border border-white/10 p-4 absolute -rotate-6 scale-90 translate-y-10 group-hover:rotate-0 transition-all duration-700" />
            <div className="w-[400px] h-[300px] rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 p-8 shadow-2xl relative">
              <div className="flex justify-between items-start mb-8">
                 <div className="space-y-2">
                    <div className="h-4 w-24 bg-white/20 rounded-full" />
                    <div className="h-8 w-40 bg-white rounded-xl" />
                 </div>
                 <div className="w-12 h-12 rounded-full bg-orange-600 flex items-center justify-center">
                   <Icon icon={ArrowRight01Icon} />
                 </div>
              </div>
              <div className="space-y-4">
                 <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full w-2/3 bg-orange-500" />
                 </div>
                 <div className="grid grid-cols-3 gap-4">
                    <div className="h-16 rounded-2xl bg-white/5" />
                    <div className="h-16 rounded-2xl bg-white/5" />
                    <div className="h-16 rounded-2xl bg-white/5" />
                 </div>
              </div>
              <div className="mt-8 pt-8 border-t border-white/10 flex items-center justify-between">
                 <span className="text-sm font-medium text-white/40">Daily Revenue</span>
                 <span className="text-xl font-bold text-orange-500">Rs. 45,000</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
