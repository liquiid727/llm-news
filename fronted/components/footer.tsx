"use client"

import { useEffect, useState } from "react"
import { Radio, Wifi, Signal } from "lucide-react"

export function Footer() {
  const [signalStrength, setSignalStrength] = useState(4)

  useEffect(() => {
    const interval = setInterval(() => {
      setSignalStrength(Math.floor(Math.random() * 3) + 3)
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  return (
    <footer className="relative mt-16 border-t border-border bg-card/50">
      {/* Gradient Line */}
      <div className="absolute left-0 right-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-neon-blue to-transparent" />

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          {/* Logo & Copyright - 更新版权文字 */}
          <div className="flex items-center gap-3">
            <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-neon-blue to-neon-pink">
              <Radio className="h-4 w-4 text-background" />
            </div>
            <div>
              <p className="font-mono text-sm text-muted-foreground">© 2025 LLM.NEWS | 大模型情报站</p>
              <p className="font-mono text-xs text-muted-foreground/60">专注于大语言模型资讯与排行榜</p>
            </div>
          </div>

          {/* Signal Indicators */}
          <div className="flex items-center gap-6">
            {/* Frequency */}
            <div className="flex items-center gap-2">
              <div className="relative h-8 w-24 overflow-hidden rounded-lg border border-border bg-background/50">
                <div className="absolute inset-0 flex items-center justify-center font-mono text-xs text-neon-blue">
                  <span className="animate-pulse">FM 88.8</span>
                </div>
                {/* Scanning line effect */}
                <div
                  className="absolute inset-y-0 left-0 w-[2px] bg-neon-blue/50"
                  style={{
                    animation: "scanline 2s linear infinite",
                  }}
                />
              </div>
            </div>

            {/* Connection Status */}
            <div className="flex items-center gap-2 rounded-lg border border-border bg-background/50 px-3 py-1.5">
              <Wifi className="h-4 w-4 text-neon-green" />
              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((bar) => (
                  <div
                    key={bar}
                    className={`h-3 w-1 rounded-sm transition-all duration-300 ${
                      bar <= signalStrength ? "bg-neon-green" : "bg-muted-foreground/30"
                    }`}
                    style={{ height: `${bar * 3 + 3}px` }}
                  />
                ))}
              </div>
            </div>

            {/* Status */}
            <div className="flex items-center gap-2">
              <Signal className="h-4 w-4 animate-pulse text-neon-blue" />
              <span className="font-mono text-xs text-muted-foreground">信号稳定</span>
            </div>
          </div>
        </div>

        {/* Bottom Links */}
        <div className="mt-6 flex flex-wrap justify-center gap-4 border-t border-border/50 pt-6">
          {["关于我们", "使用条款", "隐私政策", "联系方式", "反馈建议"].map((link) => (
            <a
              key={link}
              href="#"
              className="font-mono text-xs text-muted-foreground transition-colors hover:text-neon-blue"
            >
              {link}
            </a>
          ))}
        </div>
      </div>
    </footer>
  )
}
