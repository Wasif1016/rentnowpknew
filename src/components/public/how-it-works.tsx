"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Icon } from "@/components/ui/icon"
import { 
  Search01Icon,
  Calendar03Icon,
  WhatsappIcon,
  Key01Icon
} from "@hugeicons/core-free-icons"

const steps = [
  {
    step: "Step 1",
    title: "Search for a Car",
    description: "Tell us where and when you need the car. Browse hundreds of verified vehicles in your city. Filter by price, car type, self-drive, or with driver.",
    icon: Search01Icon,
    color: "text-blue-600",
    bgColor: "bg-blue-50"
  },
  {
    step: "Step 2",
    title: "Request to Book",
    description: "Found a car you like? Click Request to Book. Fill in your trip details. It takes less than one minute. No payment is required at this stage.",
    icon: Calendar03Icon,
    color: "text-purple-600",
    bgColor: "bg-purple-50"
  },
  {
    step: "Step 3",
    title: "Chat with the Owner",
    description: "Talk directly with the vendor in our built-in chat. Ask questions. Negotiate the price. Confirm pickup and return timings. Everything stays in one place.",
    icon: WhatsappIcon,
    color: "text-green-600",
    bgColor: "bg-green-50"
  },
  {
    step: "Step 4",
    title: "Confirm and Drive",
    description: "Once both sides agree, the vendor confirms the booking. Pick up the car at the agreed time. Enjoy your journey. After the trip, leave a review to help others.",
    icon: Key01Icon,
    color: "text-orange-600",
    bgColor: "bg-orange-50"
  }
]

export function HowItWorks() {
  return (
    <section className="w-full max-w-[1300px] mx-auto px-4 pb-20">
      <div className="flex flex-col gap-2 mb-10 text-center items-center">
        <h2 className="text-3xl font-bold tracking-tight">How to Rent a Car</h2>
        <p className="text-muted-foreground max-w-2xl">
          Renting a vehicle has never been easier. Follow these 4 simple steps to get on the road quickly and securely.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
        {/* Optional connecting line block for desktop */}
        <div className="hidden lg:block absolute top-[50px] left-10 right-10 h-[1px] border-t border-dashed border-border/60 -z-10" />

        {steps.map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delay: idx * 0.15, duration: 0.5 }}
            className="group flex flex-col bg-background rounded-2xl border border-border hover:border-black shadow-sm hover:shadow-lg transition-all duration-300 p-6 relative overflow-hidden"
          >
            {/* Soft decorative background glow on hover */}
            <div className={`absolute -top-10 -right-10 w-32 h-32 rounded-full blur-3xl opacity-0 group-hover:opacity-40 transition-opacity duration-700 ${item.bgColor}`} />

            <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 relative z-10 ${item.bgColor} ${item.color} group-hover:scale-110 transition-transform duration-300`}>
              <Icon icon={item.icon} size={28} />
            </div>
            
            <div className="mb-2 relative z-10">
              <span className="text-xs font-bold tracking-wider uppercase text-muted-foreground mb-1 block">
                {item.step}
              </span>
              <h3 className="text-xl font-semibold text-secondary-foreground leading-tight">
                {item.title}
              </h3>
            </div>
            
            <p className="text-sm text-muted-foreground leading-relaxed relative z-10">
              {item.description}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
