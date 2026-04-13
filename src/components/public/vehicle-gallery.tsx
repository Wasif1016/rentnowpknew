"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Icon } from "@/components/ui/icon"
import { 
  Image01Icon, 
  Megaphone01Icon, 
  Diamond01Icon 
} from "@hugeicons/core-free-icons"
import { cn } from "@/lib/utils"
import useEmblaCarousel from "embla-carousel-react"

interface VehicleGalleryProps {
  images: { id: string; url: string; isCover: boolean }[]
  onOpenLightbox: (index: number) => void
}

export function VehicleGallery({ images, onOpenLightbox }: VehicleGalleryProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, draggable: true, skipSnaps: false })
  const [selectedIndex, setSelectedIndex] = React.useState(0)

  const onSelect = React.useCallback(() => {
    if (!emblaApi) return
    setSelectedIndex(emblaApi.selectedScrollSnap())
  }, [emblaApi])

  React.useEffect(() => {
    if (!emblaApi) return
    onSelect()
    emblaApi.on("select", onSelect)
  }, [emblaApi, onSelect])

  if (!images || images.length === 0) return null

  const displayImages = images.slice(0, 5)

  return (
    <>
      {/* MOBILE CAROUSEL - Swipable with indicators */}
      <div className="md:hidden relative group select-none touch-pan-y">
        <div className="overflow-hidden rounded-none md:rounded-2xl aspect-[4/3] bg-muted shadow-sm" ref={emblaRef}>
          <div className="flex h-full">
            {images.map((img, i) => (
              <div 
                key={img.id} 
                className="flex-[0_0_100%] min-w-0 relative h-full cursor-pointer"
                onClick={() => onOpenLightbox(i)}
              >
                <img 
                  src={img.url} 
                  alt={`Vehicle ${i + 1}`} 
                  className="w-full h-full object-cover"
                />
                {/* Badges on first slide only for cleanliness */}
                {i === 0 && (
                  <div className="absolute top-4 left-4 flex flex-col gap-1.5 z-10">
                    <div className="bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-lg flex items-center gap-1.5 shadow-sm border border-black/5">
                      <Icon icon={Megaphone01Icon} size={14} className="text-orange-600" variant="solid" />
                      <span className="text-[10px] font-extrabold uppercase tracking-tight text-orange-700">Special Offer</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Indicators */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
          {images.map((_, i) => (
            <button 
              key={i} 
              onClick={() => emblaApi?.scrollTo(i)}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                selectedIndex === i ? "w-6 bg-white" : "w-1.5 bg-white/50"
              )}
            />
          ))}
        </div>

        {/* Swipe Hint / Counter */}
        <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-sm text-white px-3 py-1 rounded-full text-[11px] font-bold border border-white/10">
          {selectedIndex + 1} / {images.length}
        </div>
      </div>

      {/* DESKTOP GRID */}
      <div className="hidden md:grid grid-cols-[2fr_2fr_1fr_2fr] gap-[10px] h-auto md:h-[330px] w-full rounded-2xl md:rounded-3xl overflow-hidden group/gallery">
        {/* Main Image */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="relative h-[330px] md:h-full cursor-pointer overflow-hidden bg-muted"
          onClick={() => onOpenLightbox(0)}
        >
          <img 
            src={displayImages[0].url} 
            alt="Vehicle detail 1"
            className="w-full h-full object-cover transition-transform duration-700 group-hover/gallery:scale-[1.03]"
          />
          <div className="absolute top-4 left-4 flex flex-col gap-1.5">
            <div className="bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-lg flex items-center gap-1.5 shadow-sm border border-black/5">
              <Icon icon={Megaphone01Icon} size={14} className="text-orange-600" variant="solid" />
              <span className="text-[10px] font-extrabold uppercase tracking-tight text-orange-700">Special Offer</span>
            </div>
            <div className="bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-lg flex items-center gap-1.5 shadow-sm border border-black/5">
              <Icon icon={Diamond01Icon} size={14} className="text-purple-600" variant="solid" />
              <span className="text-[10px] font-extrabold uppercase tracking-tight text-purple-700">Premium</span>
            </div>
          </div>
        </motion.div>

        {/* Second Image */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="relative h-full cursor-pointer overflow-hidden bg-muted"
          onClick={() => onOpenLightbox(1)}
        >
          {displayImages[1] ? (
            <img 
              src={displayImages[1].url} 
              alt="Vehicle detail 2"
              className="w-full h-full object-cover group-hover/gallery:scale-[1.03] transition-transform duration-700"
            />
          ) : (
            <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-300">
               <Icon icon={Image01Icon} size={40} />
            </div>
          )}
        </motion.div>

        {/* Third & Fourth Column */}
        <div className="flex flex-col gap-[10px] h-full">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="h-[160px] relative cursor-pointer overflow-hidden bg-muted"
            onClick={() => onOpenLightbox(2)}
          >
            {displayImages[2] ? (
              <img 
                src={displayImages[2].url} 
                alt="Vehicle detail 3"
                className="w-full h-full object-cover group-hover/gallery:scale-[1.03] transition-transform duration-700"
              />
            ) : (
              <div className="w-full h-full bg-slate-200" />
            )}
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="h-[160px] relative cursor-pointer overflow-hidden bg-muted"
            onClick={() => onOpenLightbox(3)}
          >
            {displayImages[3] ? (
              <img 
                src={displayImages[3].url} 
                alt="Vehicle detail 4"
                className="w-full h-full object-cover group-hover/gallery:scale-[1.03] transition-transform duration-700"
              />
            ) : (
              <div className="w-full h-full bg-slate-300" />
            )}
          </motion.div>
        </div>

        {/* Fifth Image */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="relative h-full cursor-pointer overflow-hidden bg-muted"
          onClick={() => onOpenLightbox(displayImages.length - 1)}
        >
          {displayImages[4] || displayImages[0] ? (
            <img 
              src={(displayImages[4] || displayImages[0]).url} 
              alt="Vehicle detail 5"
              className="w-full h-full object-cover group-hover/gallery:scale-[1.03] transition-transform duration-700"
            />
          ) : (
            <div className="w-full h-full bg-slate-400" />
          )}
          <div className="absolute bottom-3 right-3 group-hover:scale-105 transition-transform duration-300">
            <button className="bg-white text-slate-800 px-3 py-1.5 rounded-lg flex items-center gap-2 shadow-lg border border-white/50 text-[11px] font-bold">
              <Icon icon={Image01Icon} size={14} />
              Show all photos
            </button>
          </div>
        </motion.div>
      </div>
    </>
  )
}
