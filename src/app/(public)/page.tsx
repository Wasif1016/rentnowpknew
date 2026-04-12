import { HeroSearch } from '@/components/public/hero-search'
import { CarCarousel } from '@/components/public/car-carousel'
import { FeaturedListings } from '@/components/public/featured-listings'
import { HowItWorks } from '@/components/public/how-it-works'
import { db } from '@/lib/db'
import { getFeaturedVehicles } from '@/lib/actions/public-vehicles'

export default async function Home() {
  // Fetch active car makes for the carousel
  const activeMakes = await db.query.carMakes.findMany({
    where: (makes, { eq }) => eq(makes.isActive, true),
  });

  // Fetch featured vehicles for the listings grid
  const featuredCars = await getFeaturedVehicles(4)

  return (
    <div className="flex flex-col">
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px-120px)] text-center px-4 max-w-5xl mx-auto py-20">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70">
          Rent a Car Near You
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground/80 max-w-2xl mb-12 font-medium">
          Find a car of your dream in 60 seconds
        </p>
        
        <HeroSearch />
      </div>

 
      
      <FeaturedListings listings={featuredCars.data || []} />

      <HowItWorks />
    </div>
  )
}


