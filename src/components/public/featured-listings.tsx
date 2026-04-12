"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Icon } from "@/components/ui/icon"
import { 
  FavouriteIcon,
  Location01Icon,
  Call02Icon,
  WhatsappIcon,
  StarIcon,
  RoadIcon 
} from "@hugeicons/core-free-icons"
import { Button } from "@/components/ui/button"

interface VehicleData {
  id: string
  name: string
  make: string
  model: string
  year: number
  slug: string
  priceDay: string | null
  priceMonth: string | null
  pickupAddress: string | null
  vendorLogo: string | null
  vendorPhone: string | null
  vendorWhatsapp: string | null
  coverImage: string | null
  vendorAvgRating: string | null
  vendorTotalReviews: number | null
}

export function FeaturedListings({ listings }: { listings: VehicleData[] }) {
  if (!listings || listings.length === 0) return null;

  return (
    <section className="w-full max-w-[1300px] mx-auto px-4 py-16">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 border-b border-border/50 pb-4 border-dashed">
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-bold tracking-tight">Featured Vehicles</h2>
          <p className="text-muted-foreground">
            Enjoy budget-friendly car rentals with seasonal discounts from some of the best car rental companies.
          </p>
        </div>
        <Button 
          className="bg-orange-600 hover:bg-orange-700 text-white shrink-0 font-semibold shadow-md shadow-orange-600/20 px-6 rounded-xl h-10 w-full md:w-auto"
        >
          See More Cars
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {listings.map((car, idx) => (
          <motion.div
            key={car.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="group flex flex-col bg-background rounded-2xl border border-border hover:border-black transition-all duration-300 overflow-hidden"
          >
            {/* Image Container */}
            <div className="relative aspect-[308/210] overflow-hidden bg-muted">
              {car.coverImage ? (
                <img 
                  src={car.coverImage} 
                  alt={`${car.make} ${car.name}`} 
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                  No Image
                </div>
              )}
              
              <button className="absolute top-3 right-3 bg-background/90 backdrop-blur pb-px w-8 h-8 rounded-full flex items-center justify-center hover:bg-white text-muted-foreground hover:text-red-500 shadow-sm transition-colors z-10">
                <Icon icon={FavouriteIcon} size={16} />
              </button>
            </div>

            {/* Content */}
            <div className="p-4 flex flex-col flex-1">
              {/* Title, Rating & Location */}
              <div className="mb-4">
                <h3 className="text-[18px] font-semibold text-secondary-foreground leading-tight line-clamp-1 mb-1">
                  {car.make} {car.name} {car.year}
                </h3>
                <div className="flex flex-col gap-1.5 mt-2">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <div className="flex items-center text-amber-500">
                      <Icon icon={StarIcon} size={12} variant="solid" />
                      <Icon icon={StarIcon} size={12} variant="solid" />
                      <Icon icon={StarIcon} size={12} variant="solid" />
                      <Icon icon={StarIcon} size={12} variant="solid" />
                      <Icon icon={StarIcon} size={12} variant="solid" />
                    </div>
                    <span className="font-medium text-foreground/80">
                      {Number(car.vendorAvgRating || "5.0").toFixed(1)}/5
                    </span>
                    <span>({car.vendorTotalReviews || 0}+)</span>
                  </div>
                  
                  <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                    <Icon icon={Location01Icon} size={12} />
                    <span className="truncate">{car.pickupAddress || "Location not specified"}</span>
                  </div>
                </div>
              </div>

              {/* Pricing Grid */}
              <div className="mb-4 mt-auto">
                {/* Per Day Only */}
                <div className="flex flex-col">
                  <div className="flex items-baseline gap-1">
                    <span className="text-lg font-bold text-orange-600">
                      Rs. {car.priceDay ? Number(car.priceDay).toLocaleString() : "N/A"}
                    </span>
                    <span className="text-xs text-muted-foreground">/ day</span>
                  </div>
                  <span className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                    <Icon icon={RoadIcon} size={12} /> 250 km
                  </span>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="grid grid-cols-2 gap-2 mt-2 pt-4 border-t border-border/50">
                <Button 
                  variant="outline" 
                  className="w-full border border-purple-500/50 hover:border-purple-600 hover:bg-purple-600 text-purple-600 hover:text-white h-10 px-0 shadow-none transition-all"
                >
                  <Icon icon={Call02Icon} size={18} />
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full border border-green-500/50 hover:border-green-600 hover:bg-green-600 text-green-600 hover:text-white h-10 px-0 shadow-none transition-all"
                >
                  <Icon icon={WhatsappIcon} size={18} />
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
