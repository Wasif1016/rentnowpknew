"use client"

import * as React from "react"
import { Icon } from "@/components/ui/icon"
import { Call02Icon, WhatsappIcon } from "@hugeicons/core-free-icons"
import { Button } from "@/components/ui/button"

interface MobileCtaFooterProps {
  price: string | number
  vendorPhone: string
  vendorWhatsapp: string
}

export function MobileCtaFooter({ price, vendorPhone, vendorWhatsapp }: MobileCtaFooterProps) {
  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 p-3 z-[60] flex items-center gap-3">
        {/* Action Buttons - Equal Width */}
        <div className="flex-1 flex gap-3">
            <Button 
                variant="outline" 
                className="flex-1 h-12 rounded-xl border-slate-200 text-slate-800 hover:bg-slate-50 transition-all font-bold text-sm gap-2"
                onClick={() => window.open(`tel:${vendorPhone}`, '_self')}
            >
                <Icon icon={Call02Icon} size={18} />
                Call
            </Button>
            
            <Button 
                className="flex-1 h-12 rounded-xl bg-[#25D366] hover:bg-[#128C7E] text-white font-bold text-sm transition-all gap-2 border-none"
                onClick={() => window.open(`https://wa.me/${vendorWhatsapp.replace(/\+/g, '')}`, '_blank')}
            >
                <Icon icon={WhatsappIcon} size={18} variant="solid" />
                WhatsApp
            </Button>
        </div>
    </div>
  )
}
