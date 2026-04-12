"use client"

import * as React from "react"
import { motion } from "framer-motion"

interface CarMake {
  name: string
  logoUrl: string
}

export function CarCarousel({ makes, variant = "default" }: { makes: CarMake[], variant?: "default" | "embedded" }) {
  // We duplicate the array to create an infinite seamless loop
  const duplicatedMakes = [...makes, ...makes, ...makes]

  const containerClasses = variant === "embedded" 
    ? "w-full overflow-hidden py-4 opacity-70"
    : "w-full overflow-hidden bg-background/50 border-y py-8 backdrop-blur-sm"

  return (
    <div className={containerClasses}>
      <div className="max-w-[1500px] mx-auto relative px-4">
        <div className="absolute left-0 top-0 w-32 h-full bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 w-32 h-full bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
        
        <motion.div
          className="flex flex-nowrap items-center min-w-max gap-16 md:gap-24"
          initial={{ x: 0 }}
          animate={{ x: "-50%" }}
          transition={{
            repeat: Infinity,
            ease: "linear",
            duration: 60, // Slower, elegant speed
          }}
        >
          {duplicatedMakes.map((make, index) => (
            <div 
              key={`${make.name}-${index}`} 
              className="flex items-center justify-center opacity-60 hover:opacity-100 transition-opacity grayscale hover:grayscale-0 duration-300"
            >
              <img 
                src={make.logoUrl} 
                alt={make.name} 
                title={make.name}
                className="h-10 md:h-12 w-auto object-contain"
                onError={(e) => {
                  // Hide broken images gracefully
                  ;(e.target as HTMLImageElement).style.display = 'none'
                }}
              />
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}
