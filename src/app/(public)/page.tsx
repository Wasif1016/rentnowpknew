import { HeroSearch } from '@/components/public/hero-search'
import { FeaturedListings } from '@/components/public/featured-listings'
import { HowItWorks } from '@/components/public/how-it-works'
import { BottomCTA } from '@/components/public/bottom-cta'
import { CategoryHeroGrid } from '@/components/public/category-hero-grid'
import { CityExplorer } from '@/components/public/city-explorer'
import { Footer } from '@/components/public/footer'
import { getFeaturedVehicles } from '@/lib/actions/public-vehicles'

export default async function Home() {
  // Fetch featured vehicles for the listings grid
  const featuredCars = await getFeaturedVehicles(4)

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="w-full max-w-[1300px] mx-auto px-4 pt-4 pb-8">
        <div className="group flex flex-col items-center justify-center bg-background rounded-[3rem] rounded border-2 border-black py-16 px-4 md:px-10 text-center relative overflow-hidden shadow-2xl shadow-black/5 transition-all duration-500 hover:shadow-black/10">
          {/* Subtle elegant glowing orbs */}
          <div className="absolute -top-32 -right-32 w-96 h-96 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-orange-500/5 rounded-full blur-[100px] pointer-events-none" />

          <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center">
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter mb-6 bg-clip-text text-black">
              Rent a Car Near You
            </h1>
            <p className="text-lg md:text-xl text-black max-w-2xl  font-medium border-b border-border/50 pb-8 border-dashed">
              Find a car of your dream in 60 seconds
            </p>
            
            <div className="w-full mb-2">
              <HeroSearch />
            </div>

            <CategoryHeroGrid />
          </div>
        </div>
      </section>

      {/* Featured Fleet */}
      <FeaturedListings listings={featuredCars.data || []} />

      {/* Trust & Steps */}
      <HowItWorks />

      {/* Location Explorer */}
      <CityExplorer />

      {/* Conversion */}
      <BottomCTA />

      <Footer />
    </div>
  )
}



