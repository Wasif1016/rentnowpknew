"use client"

import * as React from "react"
import { 
    Dialog, 
    DialogContent, 
    DialogHeader, 
    DialogTitle, 
    DialogTrigger 
} from "@/components/ui/dialog"
import { Icon } from "@/components/ui/icon"
import { 
    Share01Icon, 
    Link01Icon,
    WhatsappIcon,
    Facebook02Icon,
    NewTwitterIcon,
    TelegramIcon,
    Mail01Icon,
    CheckmarkCircle02Icon
} from "@hugeicons/core-free-icons"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface ShareListingDialogProps {
    car: {
        id: string
        name: string
        make: string
        model: string
        year: number
        priceDay: string | number
        images: { url: string }[]
        vendorSlug: string
        slug: string
    }
}

export function ShareListingDialog({ car }: ShareListingDialogProps) {
    const [copied, setCopied] = React.useState(false);
    
    // Use the absolute URL for sharing
    const shareUrl = typeof window !== 'undefined' 
        ? `${window.location.origin}/car/${car.vendorSlug}/${car.slug}`
        : "";

    const handleCopy = () => {
        if (!shareUrl) return;
        navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        toast.success("Link copied to clipboard");
        setTimeout(() => setCopied(false), 2000);
    };

    const formattedPrice = typeof car.priceDay === 'string' 
        ? parseInt(car.priceDay).toLocaleString() 
        : parseInt(car.priceDay?.toString() || "0").toLocaleString();

    const socialPlatforms = [
        { 
            name: "WhatsApp", 
            icon: WhatsappIcon, 
            color: "text-[#25D366]", 
            bg: "bg-[#25D366]/10",
            href: `https://wa.me/?text=${encodeURIComponent(`Check out this ${car.name} on RentNowPk: ${shareUrl}`)}`
        },
        { 
            name: "Facebook", 
            icon: Facebook02Icon, 
            color: "text-[#1877F2]", 
            bg: "bg-[#1877F2]/10",
            href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`
        },
        { 
            name: "X", 
            icon: NewTwitterIcon, 
            color: "text-slate-900", 
            bg: "bg-slate-100",
            href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(`Rent ${car.name} ${car.year} at best rates on RentNowPk`)}`
        },
        { 
            name: "Telegram", 
            icon: TelegramIcon, 
            color: "text-[#0088CC]", 
            bg: "bg-[#0088CC]/10",
            href: `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(`Rent ${car.name} on RentNowPk`)}`
        },
        { 
            name: "Email", 
            icon: Mail01Icon, 
            color: "text-slate-500", 
            bg: "bg-slate-100",
            href: `mailto:?subject=${encodeURIComponent(`Rent ${car.name}`)}&body=${encodeURIComponent(`Hi, I found this ${car.name} on RentNowPk and thought you might be interested: ${shareUrl}`)}`
        },
    ];

    const coverImage = car.images?.[0]?.url || "";

    return (
        <Dialog>
            <DialogTrigger asChild>
                <button className="h-12 w-12 rounded-full bg-white border border-border flex items-center justify-center hover:bg-slate-50 shadow-sm transition-all group">
                    <Icon icon={Share01Icon} size={20} className="text-slate-500 group-hover:text-primary transition-colors" />
                </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md p-0 overflow-hidden border-none shadow-2xl rounded-[2.5rem]">
                {/* PREVIEW CARD */}
                <div className="bg-[#1A1A1A] p-6 text-white relative overflow-hidden">
                    <div className="relative z-10 flex gap-5 items-center">
                        <div className="h-24 w-32 rounded-[1.5rem] overflow-hidden border-2 border-white/10 bg-slate-800 shrink-0">
                            {coverImage ? (
                                <img 
                                    src={coverImage} 
                                    alt={car.name} 
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-500">
                                    <Share01Icon size={24} />
                                </div>
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-xl truncate leading-tight">{car.name}</h3>
                            <p className="text-white/50 text-[13px] font-medium mt-1">
                                {car.make} {car.model} • {car.year}
                            </p>
                            <div className="flex items-baseline gap-1 mt-2">
                                <span className="text-primary font-black text-2xl">AED {formattedPrice}</span>
                                <span className="text-white/30 text-[12px] font-medium">/ day</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-10 bg-white space-y-10">
                    <div className="space-y-6">
                        <h4 className="text-[15px] font-bold text-slate-900">Share via</h4>
                        <div className="flex items-center justify-between">
                            {socialPlatforms.map((platform) => (
                                <a 
                                    key={platform.name}
                                    href={platform.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex flex-col items-center gap-3 transition-transform hover:scale-105 active:scale-95"
                                >
                                    <div className={cn(
                                        "h-16 w-16 rounded-[1.25rem] flex items-center justify-center transition-all",
                                        platform.bg,
                                        platform.color
                                    )}>
                                        <Icon icon={platform.icon} size={32} />
                                    </div>
                                    <span className="text-[12px] font-medium text-slate-500">
                                        {platform.name}
                                    </span>
                                </a>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h4 className="text-[15px] font-bold text-slate-900">Direct Link</h4>
                        <div className="flex items-center gap-3 p-1.5 pl-5 bg-slate-50 border border-slate-200 rounded-[1.25rem] focus-within:border-primary/50 focus-within:bg-white transition-all">
                            <Icon icon={Link01Icon} className="text-slate-400" size={20} />
                            <input 
                                type="text" 
                                readOnly 
                                value={shareUrl}
                                className="flex-1 bg-transparent border-none text-[13px] font-medium text-slate-600 focus:ring-0 truncate"
                            />
                            <Button 
                                onClick={handleCopy}
                                className={cn(
                                    "h-12 px-7 rounded-[1rem] font-bold text-sm transition-all",
                                    copied ? "bg-green-500 text-white" : "bg-slate-900 hover:bg-black text-white"
                                )}
                            >
                                {copied ? "Copied" : "Copy"}
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="pb-8 pt-2 bg-white flex items-center justify-center">
                    <p className="text-[12px] font-medium text-slate-400 flex items-center gap-2">
                        Secure sharing by RentNowPk
                    </p>
                </div>
            </DialogContent>
        </Dialog>
    )
}
