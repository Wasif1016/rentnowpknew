"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Icon } from "@/components/ui/icon"
import { 
  AiIcon, // Using some generic icons for categories
  Car01Icon,
  DashboardSpeed02Icon,
  EnergyIcon
} from "@hugeicons/core-free-icons"

const categories = [
  {
    name: "Luxury",
    image: "/white-coupe-sport-car-standing-road-front-view.jpg",
    icon: DashboardSpeed02Icon,
    count: "12+ Cars"
  },
  {
    name: "SUVs",
    image: "/blue-jeep-photo-shooting-sunset.jpg",
    icon: Car01Icon,
    count: "25+ Cars"
  },
  {
    name: "Economy",
    image: "/mini-coupe-high-speed-drive-road-with-front-lights.jpg",
    icon: EnergyIcon,
    count: "40+ Cars"
  },
  {
    name: "Sport",
    image: "/yellow-car-gas-station.jpg",
    icon: Car01Icon,
    count: "8+ Cars"
  }
]

export function VehicleCategories() {
  return (
    <section className="w-full max-w-[1300px] mx-auto px-4 py-16">
      <div className="flex flex-col gap-2 mb-8">
        <h2 className="text-2xl font-bold tracking-tight">Browse by Category</h2>
        <p className="text-muted-foreground border-b border-border/50 pb-4 border-dashed">
          Find the perfect ride for any occasion, from luxury cruises to family road trips.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((cat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
            className="group relative h-64 rounded-2xl border border-border overflow-hidden cursor-pointer hover:border-black transition-all duration-300"
          >
            {/* Background Image */}
            <img 
              src={cat.image} 
              alt={cat.name}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

            {/* Content */}
            <div className="absolute inset-0 p-6 flex flex-col justify-end">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-orange-600 flex items-center justify-center text-white shadow-lg">
                  <Icon icon={cat.icon} size={20} />
                </div>
                <h3 className="text-xl font-bold text-white uppercase tracking-wider">{cat.name}</h3>
              </div>
              <p className="text-white/70 text-sm font-medium">{cat.count}</p>
            </div>
            
            {/* Hover Indicator */}
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
               <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                 <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
               </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
