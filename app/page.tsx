import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/hero-section"
import { NewsSection } from "@/components/news-section"
import { Leaderboard } from "@/components/leaderboard"
import { Footer } from "@/components/footer"
import { GridBackground } from "@/components/grid-background"

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-background">
      <GridBackground />
      <Navbar />
      <HeroSection />
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <NewsSection />
          </div>
          <div className="lg:col-span-1">
            <Leaderboard />
          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}
