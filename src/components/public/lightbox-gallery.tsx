"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Icon } from "@/components/ui/icon"
import { 
  Cancel01Icon, 
  ArrowLeft01Icon, 
  ArrowRight01Icon,
  FavouriteIcon,
  Share01Icon
} from "@hugeicons/core-free-icons"
import { VendorCard } from "./vendor-card"
import { PricingMatrix } from "./pricing-matrix"

interface LightboxGalleryProps {
  isOpen: boolean
  onClose: () => void
  initialIndex: number
  car: any // Full vehicle object with vendor and images
}

export function LightboxGallery({ isOpen, onClose, initialIndex, car }: LightboxGalleryProps) {
  const [currentIndex, setCurrentIndex] = React.useState(initialIndex)

  React.useEffect(() => {
    setCurrentIndex(initialIndex)
  }, [initialIndex])

  if (!isOpen) return null

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % car.images.length)
  }

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + car.images.length) % car.images.length)
  }

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-white flex flex-col md:flex-row overflow-hidden"
      >
        {/* Left Section: Image Gallery */}
        <div className="flex-1 relative bg-slate-100 flex items-center justify-center p-4">
          {/* Header Actions */}
          <div className="absolute top-6 left-6 flex items-center gap-4 z-10">
            <button 
              onClick={onClose}
              className="h-12 w-12 rounded-full bg-white shadow-xl flex items-center justify-center hover:bg-slate-50 transition-colors"
            >
              <Icon icon={Cancel01Icon} size={24} />
            </button>
            <div className="flex items-center gap-2 px-6 h-12 rounded-full bg-white/80 backdrop-blur-md shadow-sm text-sm font-bold">
              <span>{currentIndex + 1} / {car.images.length}</span>
            </div>
          </div>

          <div className="absolute top-6 right-6 flex items-center gap-2 z-10">
             <button className="h-12 w-12 rounded-full bg-white shadow-xl flex items-center justify-center hover:bg-slate-50 transition-colors">
                <Icon icon={Share01Icon} size={20} />
             </button>
             <button className="h-12 w-12 rounded-full bg-white shadow-xl flex items-center justify-center hover:bg-slate-50 transition-colors text-muted-foreground hover:text-red-500">
                <Icon icon={FavouriteIcon} size={20} />
             </button>
          </div>

          {/* Main Image */}
          <motion.div 
            key={currentIndex}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full h-full max-w-4xl max-h-[80vh] flex items-center justify-center"
          >
            <img 
              src={car.images[currentIndex].url} 
              alt={`${car.make} ${car.name}`}
              className="w-full h-full object-contain drop-shadow-2xl"
            />
          </motion.div>

          {/* Navigation Arrows */}
          <button 
            onClick={handlePrev}
            className="absolute left-6 top-1/2 -translate-y-1/2 h-14 w-14 rounded-full bg-white shadow-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all"
          >
            <Icon icon={ArrowLeft01Icon} size={28} />
          </button>
          <button 
            onClick={handleNext}
            className="absolute right-6 top-1/2 -translate-y-1/2 h-14 w-14 rounded-full bg-white shadow-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all"
          >
            <Icon icon={ArrowRight01Icon} size={28} />
          </button>
        </div>

        {/* Right Section: Lead Sidebar */}
        <div className="w-full md:w-[450px] border-l border-border bg-white flex flex-col overflow-y-auto custom-scrollbar">
          <div className="p-8 space-y-8">
            <div className="space-y-2">
              <h2 className="text-3xl font-black tracking-tight">{car.make} {car.name} {car.year}</h2>
              <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
                <Icon icon={Location01Icon} size={16} />
                <span>Lahore, DHA Phase 5</span>
              </div>
            </div>

            <PricingMatrix 
              priceDay={car.priceSelfDriveDay} 
              priceMonth={car.priceSelfDriveMonth} 
              className="shadow-none bg-slate-50/50"
            />

            <VendorCard vendor={car.vendor} className="shadow-none border-border/50" />
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
