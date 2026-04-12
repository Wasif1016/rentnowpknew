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
            "flex items-center gap-3 pl-6 pr-0 h-16 rounded-2xl border transition-all duration-300",
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
                className="h-16 rounded-r-2xl rounded-l-none bg-primary hover:bg-primary/90 font-bold text-xl shadow-lg shadow-primary/20 px-14"
              >
                Search
              </Button>
            </div>
          </div>

          {/* Beautiful Custom Dropdown */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.98 }}
                className="absolute top-full left-0 right-0 mt-3 p-2 bg-background/80 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-3xl z-50 overflow-hidden"
              >
                <CommandList className="max-h-[350px] overflow-y-auto scrollbar-hide py-2">
                  <CommandEmpty className="px-5 py-8 text-center text-muted-foreground text-sm">
                    No cities found matching "{query}"
                  </CommandEmpty>
                  {filteredCities.length > 0 && (
                    <div className="grid grid-cols-2 gap-1 px-1">
                      {filteredCities.map((city) => (
                        <CommandItem
                          key={city}
                          value={city}
                          onSelect={() => handleSelectCity(city)}
                          className="flex items-center gap-3 px-4 py-3 rounded-2xl cursor-pointer transition-all text-left group data-[selected=true]:bg-primary/5 data-[selected=true]:text-primary"
                        >
                          <div className="h-2 w-2 rounded-full bg-primary/20 group-hover:bg-primary group-data-[selected=true]:bg-primary transition-colors" />
                          <span className="text-sm font-semibold">{city}</span>
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
      <div className="mt-4 flex justify-start pl-4">
        <Button
          variant="ghost"
          size="sm"
          disabled={isDetecting}
          onClick={handleUseCurrentLocation}
          className="rounded-full px-6 gap-2 text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all"
        >
          <Icon
            icon={isDetecting ? CheckmarkCircle02Icon : Navigation03Icon}
            size={18}
            className={cn(isDetecting ? "animate-pulse" : "")}
          />
          <span className="text-xs font-bold tracking-tight">
            {isDetecting ? "Detecting city..." : "Use Current Location"}
          </span>
        </Button>
      </div>
    </div>
  )
}
