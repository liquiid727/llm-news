"use client"

import { Trophy, ChevronDown } from "lucide-react"

/**
 * 热度排行榜
 * 展示主流大模型的人气综合指数、趋势与基础信息
 * UI 保持不变，数据结构兼容原组件；与 /leaderboard/page 使用同一数据源
 */
export function HotLeaderboard() {
  return (
    <section id="leaderboard" className="relative">
      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-yellow-500 to-orange-500">
          <Trophy className="h-5 w-5 text-background" />
        </div>
        <div>
          <h2 className="text-xl font-bold tracking-tight">热度排行榜</h2>
          <p className="font-mono text-xs text-muted-foreground">还在打造 · 静等花开</p>
        </div>
      </div>

      {/* Leaderboard Container */}
      <div className="relative overflow-hidden rounded-xl border border-border bg-card">
        {/* Decorative Corner */}
        <div className="absolute right-0 top-0 h-20 w-20 bg-gradient-to-bl from-neon-blue/20 to-transparent" />
        <div className="absolute bottom-0 left-0 h-20 w-20 bg-gradient-to-tr from-neon-pink/20 to-transparent" />

      {/* Leaderboard Items */}
      <div className="relative divide-y divide-border">
        "正在加油载入中，敬请期待"
      </div>

      {/* View All Button */}
      <div className="border-t border-border p-4">
          <button className="flex w-full items-center justify-center gap-2 rounded-lg border border-neon-purple/50 bg-neon-purple/10 py-2.5 font-medium text-neon-purple transition-all duration-300 hover:bg-neon-purple/20 hover:shadow-[0_0_15px_rgba(168,85,247,0.3)]">
            <span>查看完整榜单</span>
            <ChevronDown className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  )
}
