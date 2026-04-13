import * as React from "react"
import { notFound } from "next/navigation"
import { getVehicleDetails } from "@/lib/actions/public-vehicles"
import { Metadata } from "next"
import { VehicleDetailClient } from "./vehicle-detail-client"

interface PageProps {
  params: Promise<{
    vendorSlug: string
    vehicleSlug: string
  }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { vendorSlug, vehicleSlug } = await params
  const result = await getVehicleDetails(vendorSlug, vehicleSlug)
  
  if (!result.success || !result.data) {
    return { title: "Vehicle Not Found" }
  }

  const car = result.data
  const title = `Rent ${car.make} ${car.name} ${car.year} in ${car.pickupFormattedAddress || 'Pakistan'}`
  const description = car.description?.slice(0, 160) || `Book a ${car.make} ${car.name} directly from verified vendors on RentNowPk.`
  const imageUrl = car.images?.[0]?.url || ""

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: imageUrl ? [{ url: imageUrl }] : [],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: imageUrl ? [imageUrl] : [],
    }
  }
}

export default async function VehicleDetailPage({ params }: PageProps) {
  const { vendorSlug, vehicleSlug } = await params
  
  console.log(`[VehicleDetail] Loading: /car/${vendorSlug}/${vehicleSlug}`)
  
  const result = await getVehicleDetails(vendorSlug, vehicleSlug)

  if (!result.success || !result.data) {
    console.warn(`[VehicleDetail] 404 result for: /car/${vendorSlug}/${vehicleSlug}`, result.error)
    return notFound()
  }

  return <VehicleDetailClient car={result.data} />
}
