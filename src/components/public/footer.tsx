"use client"

import * as React from "react"
import Link from "next/link"
import { Icon } from "@/components/ui/icon"
import { 
  InstagramIcon, 
  FacebookIcon, 
  TwitterIcon,
  Linkedin02Icon,
  Mail01Icon,
  Call02Icon,
  Location01Icon
} from "@hugeicons/core-free-icons"

const footerLinks = [
  {
    title: "Marketplace",
    links: [
      { name: "Rent a Car", href: "/search" },
      { name: "Luxury Fleet", href: "/search?category=luxury" },
      { name: "Monthly Rentals", href: "/search?sort=monthly" },
      { name: "Verified Vendors", href: "/vendors" },
      { name: "Popular Cities", href: "/cities" },
    ]
  },
  {
    title: "Support",
    links: [
      { name: "Help Center", href: "/help" },
      { name: "Trust & Safety", href: "/trust" },
      { name: "Booking Policy", href: "/pricing-policy" },
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Terms of Service", href: "/terms" },
    ]
  },
  {
    title: "For Partners",
    links: [
      { name: "List Your Car", href: "/auth/signup" },
      { name: "Vendor Handbook", href: "/blog/vendor-guide" },
      { name: "Marketplace Rules", href: "/rules" },
      { name: "Advertising", href: "/ads" },
    ]
  }
]

export function Footer() {
  return (
    <footer className="w-full bg-slate-50 border-t border-border pt-20 pb-10">
      <div className="max-w-[1300px] mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-20">
          {/* Logo & Info */}
          <div className="lg:col-span-2 space-y-6">
            <Link href="/" className="flex items-center gap-2">
              <div className="bg-primary flex h-10 w-10 items-center justify-center rounded-xl shadow-lg shadow-primary/20">
                <span className="text-primary-foreground text-2xl font-black">R</span>
              </div>
              <span className="text-2xl font-extrabold tracking-tight">
                RentNow<span className="text-primary">Pk</span>
              </span>
            </Link>
            <p className="text-muted-foreground text-sm max-w-sm leading-relaxed">
              Pakistan's leading decentralized car rental marketplace connecting customers with verified local vendors. Experience freedom on the road with transparent pricing and real-time chat.
            </p>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-primary hover:text-white hover:border-primary transition-all cursor-pointer">
                <Icon icon={InstagramIcon} size={18} />
              </div>
              <div className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-primary hover:text-white hover:border-primary transition-all cursor-pointer">
                <Icon icon={FacebookIcon} size={18} />
              </div>
              <div className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-primary hover:text-white hover:border-primary transition-all cursor-pointer">
                <Icon icon={TwitterIcon} size={18} />
              </div>
            </div>
          </div>

          {/* Link Groups */}
          {footerLinks.map((group) => (
            <div key={group.title} className="space-y-6">
              <h4 className="font-bold text-sm uppercase tracking-widest">{group.title}</h4>
              <ul className="space-y-4">
                {group.links.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="text-muted-foreground text-[13px] hover:text-primary transition-colors">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-6 text-muted-foreground text-xs">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-1.5">
               <Icon icon={Call02Icon} size={14} />
               <span>+92 300 1234567</span>
            </div>
            <div className="flex items-center gap-1.5">
               <Icon icon={Mail01Icon} size={14} />
               <span>help@rentnowpk.com</span>
            </div>
          </div>
          <p>© {new Date().getFullYear()} RentNowPk (Pvt) Ltd. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  )
}
