"use client"

import * as React from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Icon } from "@/components/ui/icon"
import { Location01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons"

const topCities = [
  {
    name: "Lahore",
    image: "https://images.unsplash.com/photo-1622546755489-0222a7f5a8ec?q=80&w=800&auto=format&fit=crop",
    vehicles: "450+ Cars"
  },
  {
    name: "Karachi",
    image: "https://images.unsplash.com/photo-1623941425624-a747970977ba?q=80&w=800&auto=format&fit=crop",
    vehicles: "320+ Cars"
  },
  {
    name: "Islamabad",
    image: "https://images.unsplash.com/photo-1595908129746-57ca1a63dd4d?q=80&w=800&auto=format&fit=crop",
    vehicles: "280+ Cars"
  },
  {
    name: "Faisalabad",
    image: "https://images.unsplash.com/photo-1627885016024-5d9c57173e4a?q=80&w=800&auto=format&fit=crop",
    vehicles: "120+ Cars"
  }
]

export function CityExplorer() {
  return (
    <section className="w-full max-w-[1300px] mx-auto px-4 py-16">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 border-b border-border/50 pb-4 border-dashed">
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-bold tracking-tight">Explore by City</h2>
          <p className="text-muted-foreground">
            Find the perfect vehicle in your city. Verified vendors across major hubs in Pakistan.
          </p>
        </div>
        <Link 
          href="/cities"
          className="flex items-center gap-2 text-primary font-bold hover:underline"
        >
          View All Cities
          <Icon icon={ArrowRight01Icon} size={18} />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {topCities.map((city, idx) => (
          <motion.div
            key={city.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
          >
            <Link 
              href={`/search?city=${city.name}`}
              className="group relative h-48 rounded-[2rem] border border-border overflow-hidden hover:border-black transition-all duration-500 shadow-sm hover:shadow-xl block"
            >
              {/* Background Image */}
              <img 
                src={city.image} 
                alt={city.name}
                className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110"
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent group-hover:from-black/70 transition-colors" />

              {/* Content */}
              <div className="absolute inset-0 p-6 flex flex-col justify-end">
                <div className="flex items-center gap-2 text-white mb-1">
                  <Icon icon={Location01Icon} size={16} />
                  <h3 className="text-xl font-bold tracking-tight">{city.name}</h3>
                </div>
                <p className="text-white/60 text-xs font-semibold uppercase tracking-wider">
                  {city.vehicles}
                </p>
              </div>
              
              {/* Arrow */}
              <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0">
                <Icon icon={ArrowRight01Icon} size={20} />
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
