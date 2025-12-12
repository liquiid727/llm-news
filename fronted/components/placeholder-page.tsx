"use client"

import { Loader2 } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { GridBackground } from "@/components/grid-background"

export function PlaceholderPage() {
  return (
    <div className="relative min-h-screen bg-background font-sans">
      <GridBackground />
      <Navbar />

      <main className="flex min-h-[calc(100vh-64px)] flex-col items-center justify-center p-4 text-center">
        {/* Gradient Background Effect */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-neon-blue/20 to-neon-pink/20 blur-[100px]" />
        </div>

        <div className="relative z-10 space-y-8">
          {/* Loading Animation (3s loop) */}
          <div className="relative mx-auto flex h-24 w-24 items-center justify-center">
             <div className="absolute inset-0 animate-[spin_3s_linear_infinite] rounded-full border-4 border-transparent border-t-neon-blue border-r-neon-blue/50" />
             <div className="absolute inset-4 animate-[spin_3s_linear_infinite_reverse] rounded-full border-4 border-transparent border-b-neon-pink border-l-neon-pink/50" />
             <Loader2 className="h-8 w-8 animate-pulse text-foreground" />
          </div>

          <div className="space-y-4">
            <h1 className="text-3xl font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-pink sm:text-5xl animate-pulse">
              美味值得等待
            </h1>
            <p className="text-xl text-muted-foreground font-mono tracking-widest">
              数据正在加工赶来
            </p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}
