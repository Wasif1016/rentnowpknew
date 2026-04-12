"use client"

import * as React from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { NAV_CONFIG } from "@/config/nav-config"

export function CategoryHeroGrid() {
  // Extract and reorder categories from NAV_CONFIG
  const rawCategories = NAV_CONFIG.mainNav[2].items || [];
  
  // Desired order by title
  const order = [
    "Economy Cars",
    "Luxury Cars",
    "Sports Cars",
    "Convertible",
    "SUVs / 4x4",
    "Vans & Buses"
  ];

  const categories = [...rawCategories].sort((a, b) => 
    order.indexOf(a.title) - order.indexOf(b.title)
  );

  if (categories.length === 0) return null;

  return (
    <div className="w-full mt-2 px-0 max-w-5xl mx-auto">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        {categories.map((cat, idx) => (
          <motion.div
            key={cat.title}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
          >
            <Link 
              href={cat.href}
              className="relative flex flex-col items-center gap-2 p-2 rounded-2xl border border-transparent"
            >
              {/* Icon Container - Fully Static */}
              <div className="relative flex aspect-[16/10] w-full items-center justify-center rounded-xl bg-slate-950 p-1 ring-1 ring-white/10 shadow-lg">
                <img 
                  src={cat.icon} 
                  alt={cat.title} 
                  className="h-14 w-auto object-contain" 
                />
              </div>

              {/* Text - Static */}
              <div className="flex flex-col items-center text-center">
                <span className="text-[11px] font-black tracking-tight uppercase">
                  {cat.title}
                </span>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
