"use client"

import * as React from "react"
import { Breadcrumbs } from "@/components/public/breadcrumbs"
import { VehicleGallery } from "@/components/public/vehicle-gallery"
import { LightboxGallery } from "@/components/public/lightbox-gallery"
import { PricingMatrix } from "@/components/public/pricing-matrix"
import { VehicleSidebar } from "@/components/public/vehicle-sidebar"
import { TechnicalSpecsGrid } from "@/components/public/technical-specs-grid"
import { FeaturesAccordion } from "@/components/public/features-accordion"
import { FeaturedListings } from "@/components/public/featured-listings"
import { Footer } from "@/components/public/footer"
import { ShareListingDialog } from "@/components/public/share-listing-dialog"
import { Icon } from "@/components/ui/icon"
import { MobileCtaFooter } from "@/components/public/mobile-cta-footer"
import { 
  StarIcon, 
  Location01Icon, 
  Clock01Icon,
  CheckmarkCircle02Icon,
  Calendar01Icon,
  Settings01Icon,
  Car01Icon,
  FavouriteIcon
} from "@hugeicons/core-free-icons"

export function VehicleDetailClient({ car }: { car: any }) {
  const [lightboxIndex, setLightboxIndex] = React.useState<number | null>(null)

  const breadcrumbItems = [
    { label: car.pickupFormattedAddress?.split(',')[0] || "Lahore", href: "/search" },
    { label: car.bodyType || "Car Rental", href: `/search?category=${car.bodyType?.toLowerCase()}` },
    { label: car.make, href: `/search?make=${car.make.toLowerCase()}` },
    { label: car.model }
  ]

  return (
    <div className="min-h-screen bg-[#F8F9FB]">
      <div className="max-w-[1300px] mx-auto px-0 md:px-4 py-0 md:py-8">
        <div className="hidden md:block mb-6">
            <Breadcrumbs items={breadcrumbItems} />
        </div>

        <div className="flex flex-col">
            {/* 1. Header Section - Desktop order 1, Mobile order 2 */}
            <div className="order-2 md:order-1 px-5 md:px-0">
                <div className="flex flex-col gap-4 mt-6 md:mt-0 md:mb-10">
                    <div className="flex justify-between items-start gap-4">
                        <div className="space-y-4 flex-1">
                            <h1 className="text-[22px] md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
                                Rent {car.make} {car.name} {car.year}
                            </h1>
                            
                            <div className="flex flex-col md:flex-row md:items-center gap-y-3 gap-x-6">
                                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[13px] md:text-sm font-medium">
                                    <div className="flex items-center gap-1.5 text-orange-600">
                                        <Icon icon={Location01Icon} size={16} />
                                        <span>{car.pickupFormattedAddress}</span>
                                    </div>
                                    
                                    <div className="flex items-center gap-2 font-bold">
                                        <div className="flex items-center gap-0.5">
                                            {[...Array(5)].map((_, i) => (
                                                <Icon 
                                                    key={i} 
                                                    icon={StarIcon} 
                                                    size={14} 
                                                    variant={i < Math.floor(Number(car.vendor.avgRating)) ? "solid" : "stroke"} 
                                                    className={i < Math.floor(Number(car.vendor.avgRating)) ? "text-amber-400 fill-amber-400" : "text-slate-300"} 
                                                />
                                            ))}
                                        </div>
                                        <span className="text-slate-900 whitespace-nowrap">{Number(car.vendor.avgRating).toFixed(1)} ({car.vendor.totalReviews} reviews)</span>
                                    </div>

                                    <div className="flex items-center gap-1.5 text-slate-400">
                                        <Icon icon={Clock01Icon} size={16} />
                                        <span>Last updated on 30 Mar, 2026</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0 pt-1">
                            <ShareListingDialog car={{
                                id: car.id,
                                name: car.name,
                                make: car.make,
                                model: car.model,
                                year: car.year,
                                priceDay: car.priceSelfDriveDay,
                                images: car.images,
                                vendorSlug: car.vendorSlug,
                                slug: car.slug
                            }} />
                            <button className="h-10 w-10 md:h-12 md:w-12 rounded-full bg-white border border-border flex items-center justify-center hover:bg-slate-50 shadow-sm transition-all group">
                                <Icon icon={FavouriteIcon} size={18} className="text-slate-500 group-hover:text-red-500" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. Gallery Section - Desktop order 2, Mobile order 1 */}
            <div className="order-1 md:order-2">
                <VehicleGallery 
                    images={car.images} 
                    onOpenLightbox={(index) => setLightboxIndex(index)} 
                />
            </div>
        </div>

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-10 mt-8 md:mt-12 pb-24">
          <div className="lg:col-span-8 space-y-0 md:space-y-12">
              <div className="mb-0 md:mb-12">
                <PricingMatrix 
                    priceDay={car.priceSelfDriveDay} 
                    priceMonth={car.priceSelfDriveMonth} 
                    description={car.description}
                    carDetails={{
                      make: car.make,
                      name: car.name,
                      year: car.year,
                      location: car.pickupFormattedAddress
                    }}
                />
              </div>

              <div className="mb-0 md:mb-12 border-t border-slate-50 md:border-t-0">
                <TechnicalSpecsGrid car={car} />
              </div>

              <div className="mb-0 md:mb-12 border-t border-slate-50 md:border-t-0">
                <FeaturesAccordion 
                  car={{
                      make: car.make,
                      name: car.name,
                      year: car.year
                  }}
                  features={car.features} 
                />
              </div>

                {/* REVIEWS SECTION */}
                <section className="bg-white p-0 md:p-8 rounded-none md:rounded-[2rem] md:border md:border-slate-100 md:shadow-sm space-y-0 md:space-y-8 border-t border-slate-50 md:border-t-0">
                <div className="hidden md:flex items-center justify-between border-b border-slate-50 pb-6">
                    <h3 className="text-[17px] font-bold text-slate-900 leading-tight">
                    Is the {car.make} {car.name} {car.year} worth renting? Read user reviews
                    </h3>
                    <div className="flex items-center gap-2 px-3 py-1 bg-amber-50 rounded-full border border-amber-100">
                    <Icon icon={StarIcon} size={16} className="text-amber-500 fill-amber-500" />
                    <span className="text-sm font-bold text-amber-700">{Number(car.vendor.avgRating).toFixed(1)}</span>
                    </div>
                </div>

                <div className="space-y-0 md:space-y-4 divide-y divide-slate-100 md:divide-y-0">
                    {car.reviews && car.reviews.length > 0 ? (
                    car.reviews.slice(0, 5).map((review: any) => (
                        <div key={review.id} className="bg-white md:bg-slate-50/40 p-5 md:rounded-2xl md:border md:border-slate-50">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-white border border-slate-100 flex items-center justify-center overflow-hidden">
                                <img 
                                    src="https://api.dicebear.com/7.x/notionists/svg?seed=neutral" 
                                    alt="Universal Avatar" 
                                    className="w-full h-full object-cover grayscale opacity-60" 
                                    loading="lazy"
                                />
                            </div>
                            <div>
                                <h4 className="font-bold text-[15px] text-slate-900">{review.userName || 'Anonymous'}</h4>
                                <p className="text-[12px] font-light text-slate-400">
                                {new Date(review.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                </p>
                            </div>
                            </div>
                            <div className="flex items-center gap-0.5">
                            {[...Array(5)].map((_, i) => (
                                <Icon 
                                key={i} 
                                icon={StarIcon} 
                                size={12} 
                                variant={i < review.rating ? "solid" : "stroke"} 
                                className={i < review.rating ? "text-amber-400 fill-amber-400" : "text-slate-200"}
                                />
                            ))}
                            </div>
                        </div>
                        <p className="text-[14px] font-light text-[#4d4d4d] leading-relaxed">
                            {review.comment}
                        </p>
                        </div>
                    ))
                    ) : (
                    <div className="text-center py-10 bg-slate-50 md:rounded-2xl border border-dashed border-slate-200">
                        <p className="text-[14px] font-light text-slate-400">No specific reviews found for this vehicle.</p>
                    </div>
                    )}
                </div>
                </section>
          </div>

          <aside className="lg:col-span-4 lg:sticky lg:top-[100px] h-fit">
              <VehicleSidebar car={car} />
          </aside>
        </div>

        {car.related && car.related.length > 0 && (
            <div className="mt-0 border-t border-slate-100 px-5 md:px-0">
                <FeaturedListings 
                    listings={car.related} 
                    title={`Where can I find similar car rentals in ${car.pickupFormattedAddress?.split(',')[0] || 'Lahore'}?`}
                    description="More high-performance vehicles available in this category."
                    hideSeeMore={true}
                />
            </div>
        )}
      </div>


      <Footer />

      <MobileCtaFooter 
        price={car.priceSelfDriveDay || 0}
        vendorPhone={car.vendor.phoneNumber || ""}
        vendorWhatsapp={car.vendor.whatsappNumber || ""}
      />

      <LightboxGallery 
        isOpen={lightboxIndex !== null} 
        onClose={() => setLightboxIndex(null)}
        initialIndex={lightboxIndex || 0}
        car={car}
      />

      <style jsx global>{`
        #marketing-footer {
          display: none !important;
        }
      `}</style>
    </div>
  )
}
