"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, X, Radio } from "lucide-react"
import { GlitchText } from "./glitch-text"

const navLinks = [
  { name: "首页", href: "/" },
  { name: "新闻", href: "/news" },
  { name: "排行榜", href: "/leaderboard" },
  { name: "模型广场", href: "/models" },
  { name: "Hot", href: "/hot" },
  { name: "测评", href: "/review" },
]

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="glass-effect fixed left-0 right-0 top-0 z-50 border-b border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="relative h-10 w-10 overflow-hidden rounded-lg border border-border">
              <Image src="/site-dark.svg" alt="LLM.NEWS" fill className="object-cover" />
            </div>
            <GlitchText text="LLM.NEWS" className="font-mono text-xl font-bold tracking-wider text-foreground" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="group relative px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                <span className="relative z-10">{link.name}</span>
                <span className="absolute inset-0 scale-95 rounded-lg bg-neon-blue/0 opacity-0 transition-all duration-300 group-hover:scale-100 group-hover:bg-neon-blue/10 group-hover:opacity-100" />
                <span className="absolute bottom-1 left-4 right-4 h-[2px] scale-x-0 bg-gradient-to-r from-neon-blue to-neon-pink transition-transform duration-300 group-hover:scale-x-100" />
              </Link>
            ))}
          </div>

          {/* Signal Indicator */}
          <div className="hidden items-center gap-3 md:flex">
            <div className="flex items-center gap-2 rounded-full border border-neon-green/30 bg-neon-green/10 px-3 py-1">
              <Radio className="h-3 w-3 animate-pulse text-neon-green" />
              <span className="font-mono text-xs text-neon-green">LIVE</span>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="relative rounded-lg p-2 text-foreground md:hidden"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="border-t border-border/50 py-4 md:hidden">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="block px-4 py-3 text-muted-foreground transition-colors hover:bg-neon-blue/10 hover:text-neon-blue"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  )
}
