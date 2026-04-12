"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Command as CommandPrimitive } from "cmdk"
import { Command, CommandList, CommandItem, CommandEmpty } from "@/components/ui/command"
import { Icon } from "@/components/ui/icon"
import {
  Search01Icon,
  Location01Icon,
  Navigation03Icon,
  CheckmarkCircle02Icon,
  Cancel01Icon
} from "@hugeicons/core-free-icons"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { getPopularCities } from "@/lib/actions/cities"

export function HeroSearch() {
  const router = useRouter()
  const [query, setQuery] = React.useState("")
  const [isOpen, setIsOpen] = React.useState(false)
  const [cities, setCities] = React.useState<string[]>([])
  const [isLoading, setIsLoading] = React.useState(false)
  const [isDetecting, setIsDetecting] = React.useState(false)
  const containerRef = React.useRef<HTMLDivElement>(null)

  // Fetch cities on mount
  React.useEffect(() => {
    const fetchCities = async () => {
      const result = await getPopularCities()
      if (result.data) setCities(result.data)
    }
    fetchCities()
  }, [])

  // Close dropdown on click outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const filteredCities = query === ""
    ? cities
    : cities.filter(city => city.toLowerCase().includes(query.toLowerCase()))

  const handleSelectCity = (city: string) => {
    setQuery(city)
    setIsOpen(false)
    router.push(`/search?city=${encodeURIComponent(city)}`)
  }

  const handleUseCurrentLocation = async () => {
    setIsDetecting(true)
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser")
      setIsDetecting(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords
          // Using OSM Nominatim for free reverse geocoding
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10`
          )
          const data = await response.json()
          const city = data.address.city || data.address.town || data.address.village || data.address.state

          if (city) {
            handleSelectCity(city)
          } else {
            alert("Could not determine your city")
          }
        } catch (error) {
          console.error("Error geocoding:", error)
          alert("Error detecting location")
        } finally {
          setIsDetecting(false)
        }
      },
      (error) => {
        console.error("Geolocation error:", error)
        alert("Location access denied")
        setIsDetecting(false)
      }
    )
  }

  return (
    <div ref={containerRef} className="relative w-full max-w-2xl mx-auto z-50">
      <Command shouldFilter={false} className="overflow-visible bg-transparent relative">
        <div className="relative group">
          {/* Transparent Glassmorphism Search Bar */}
          <div className={cn(
            "flex items-center gap-3 pl-6 pr-0 h-14 rounded-2xl border transition-all duration-300",
            "bg-background/20 backdrop-blur-xl shadow-2xl shadow-primary/10",
            "border-primary/40 hover:border-primary/60",
            isOpen ? "ring-2 ring-primary/50" : ""
          )}>
            <Icon icon={Search01Icon} size={22} className="text-muted-foreground group-hover:text-primary transition-colors" />
            <CommandPrimitive.Input
              placeholder="Type your city ..."
              value={query}
              onValueChange={(val) => {
                setQuery(val)
                if (val.length > 0) {
                  setIsOpen(true)
                } else {
                  setIsOpen(false)
                }
              }}
              onFocus={() => {
                if (query.length > 0) {
                  setIsOpen(true)
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && query.trim().length > 0) {
                  handleSelectCity(query.trim())
                }
              }}
              className="flex-1 bg-transparent border-none outline-none text-lg font-medium placeholder:text-muted-foreground/60 focus:ring-0"
            />
            <div className="flex items-center">
              <Button
                onClick={() => {
                  if (query.trim().length > 0) {
                    handleSelectCity(query.trim())
                  }
                }}
                className="h-14 rounded-r-2xl rounded-l-none bg-primary hover:bg-primary/90 font-bold text-xl shadow-lg shadow-primary/20 px-14"
              >
                Search
              </Button>
            </div>
          </div>

          {/* Beautiful Custom Dropdown - Matching Screenshot Style */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.98 }}
                className="absolute top-full left-0 right-0 mt-3 p-1 bg-white border border-neutral-200 rounded-2xl shadow-2xl z-50 overflow-hidden"
              >
                <CommandList className="max-h-[350px] overflow-y-auto pt-1 pb-2">
                  <CommandEmpty className="px-6 py-10 text-center text-muted-foreground text-sm">
                    No cities found matching "{query}"
                  </CommandEmpty>
                  {filteredCities.length > 0 && (
                    <div className="flex flex-col gap-0.5">
                      {filteredCities.map((city) => (
                        <CommandItem
                          key={city}
                          value={city}
                          onSelect={() => handleSelectCity(city)}
                          className="flex items-center gap-4 px-5 py-3.5 cursor-pointer transition-all text-left group data-[selected=true]:bg-neutral-100"
                        >
                          <Icon 
                            icon={Search01Icon} 
                            size={18} 
                            className="text-neutral-400 transition-colors group-hover:text-black group-data-[selected=true]:text-black" 
                          />
                          <span className="text-[15px] font-medium text-neutral-800 group-data-[selected=true]:text-black">
                            {city}
                          </span>
                        </CommandItem>
                      ))}
                    </div>
                  )}
                </CommandList>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Command>

      {/* Geolocation Hook Under Search */}
      <div className="mt-2 flex justify-start pl-4">
        <Button
          variant="ghost"
          size="sm"
          disabled={isDetecting}
          onClick={handleUseCurrentLocation}
          className="rounded-full px-8 gap-2 text-muted-foreground"
        >
          <Icon
            icon={isDetecting ? CheckmarkCircle02Icon : Navigation03Icon}
            size={18}
            className={cn(isDetecting ? "animate-pulse" : "")}
          />
          <span className="text-md  font-bold tracking-tight">
            {isDetecting ? "Detecting city..." : "Use Current Location"}
          </span>
        </Button>
      </div>
    </div>
  )
}
