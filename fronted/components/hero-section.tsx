"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { Zap, Signal, Activity } from "lucide-react"
import { GlitchText } from "./glitch-text"

export function HeroSection() {
  const [currentTime, setCurrentTime] = useState("")

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setCurrentTime(
        now.toLocaleTimeString("zh-CN", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
      )
    }
    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="relative mt-16 overflow-hidden py-20 md:py-32">
      {/* Animated Background Elements */}
      <div className="absolute left-10 top-20 h-64 w-64 animate-pulse rounded-full bg-neon-blue/10 blur-3xl" />
      <div className="absolute bottom-10 right-10 h-96 w-96 animate-pulse rounded-full bg-neon-pink/10 blur-3xl" />

      <div className="container relative z-10 mx-auto px-4">
        <div className="flex flex-col items-center text-center">
          {/* Status Bar - 更新状态栏文字 */}
          <div className="mb-8 flex flex-wrap items-center justify-center gap-4">
            <div className="flex items-center gap-2 rounded-full border border-neon-blue/30 bg-neon-blue/10 px-4 py-2">
              <Signal className="h-4 w-4 text-neon-blue" />
              <span className="font-mono text-xs text-neon-blue">模型接入中</span>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-neon-pink/30 bg-neon-pink/10 px-4 py-2">
              <Activity className="h-4 w-4 text-neon-pink" />
              <span className="font-mono text-xs text-neon-pink">{currentTime}</span>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-neon-purple/30 bg-neon-purple/10 px-4 py-2">
              <Zap className="h-4 w-4 text-neon-purple" />
              <span className="font-mono text-xs text-neon-purple">AI研究院</span>
            </div>
          </div>

          {/* Main Title - 绝区零情报站 改为 大模型情报站 */}
          <GlitchText
            text="大模型情报站"
            as="h1"
            className="mb-4 text-4xl font-black tracking-tight md:text-6xl lg:text-7xl"
          />

          <p className="mb-8 max-w-2xl text-lg text-muted-foreground md:text-xl">
            <span className="text-neon-blue">{">"}</span> 追踪最新LLM动态 <span className="text-neon-pink">|</span>{" "}
            模型排行榜 <span className="text-neon-purple">|</span> 前沿资讯实时更新{" "}
            <span className="text-neon-blue">{"<"}</span>
          </p>

          {/* CTA Buttons - 更新按钮文字 */}
          <div className="flex flex-wrap justify-center gap-4">
            <button className="group relative overflow-hidden rounded-lg bg-gradient-to-r from-neon-blue to-neon-purple px-8 py-3 font-bold text-background transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_rgba(0,240,255,0.5)]">
              <span className="relative z-10">进入情报室</span>
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-neon-pink to-neon-blue transition-transform duration-300 group-hover:translate-x-0" />
            </button>
            <Link href="/models">
              <button className="rounded-lg border border-neon-pink/50 bg-neon-pink/10 px-8 py-3 font-bold text-neon-pink transition-all duration-300 hover:bg-neon-pink/20 hover:shadow-[0_0_20px_rgba(255,0,170,0.3)]">
                模型档案
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
