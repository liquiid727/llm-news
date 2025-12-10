"use client"

import { useState } from "react"
import Image from "next/image"
import { Trophy, TrendingUp, TrendingDown, Minus, ChevronDown, ChevronUp, Crown, Star, Zap } from "lucide-react"
import { cn } from "@/lib/utils"

const leaderboardData = [
  {
    id: 1,
    rank: 1,
    name: "青衣",
    avatar: "/cyberpunk-character-blue-hair-anime-portrait.jpg",
    score: 98520,
    trend: "up",
    trendValue: 3,
    element: "以太",
    elementColor: "neon-purple",
    description: "物理属性防御型代理人，擅长格挡与反击",
  },
  {
    id: 2,
    rank: 2,
    name: "艾莲",
    avatar: "/cyberpunk-character-silver-hair-anime-portrait.jpg",
    score: 94180,
    trend: "up",
    trendValue: 1,
    element: "冰",
    elementColor: "neon-blue",
    description: "冰属性异常型代理人，冻结敌人并造成持续伤害",
  },
  {
    id: 3,
    rank: 3,
    name: "莱卡恩",
    avatar: "/cyberpunk-wolf-character-anime-portrait.jpg",
    score: 91750,
    trend: "same",
    trendValue: 0,
    element: "物理",
    elementColor: "neon-pink",
    description: "物理属性强击型代理人，狼形态下拥有超强爆发",
  },
  {
    id: 4,
    rank: 4,
    name: "11号",
    avatar: "/cyberpunk-red-hair-warrior-anime-portrait.jpg",
    score: 88340,
    trend: "down",
    trendValue: 2,
    element: "火",
    elementColor: "destructive",
    description: "火属性强击型代理人，拥有极高的单体爆发能力",
  },
  {
    id: 5,
    rank: 5,
    name: "猫又",
    avatar: "/cyberpunk-cat-girl-anime-portrait.jpg",
    score: 85920,
    trend: "up",
    trendValue: 2,
    element: "物理",
    elementColor: "neon-green",
    description: "物理属性强击型代理人，灵活的近战刺客",
  },
  {
    id: 6,
    rank: 6,
    name: "珂蕾妲",
    avatar: "/cyberpunk-cute-girl-hammer-anime-portrait.jpg",
    score: 82650,
    trend: "up",
    trendValue: 4,
    element: "火",
    elementColor: "destructive",
    description: "火属性支援型代理人，强力的辅助与增益",
  },
]

export function Leaderboard() {
  const [expandedId, setExpandedId] = useState<number | null>(null)

  const maxScore = Math.max(...leaderboardData.map((item) => item.score))

  return (
    <section id="leaderboard" className="relative">
      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-yellow-500 to-orange-500">
          <Trophy className="h-5 w-5 text-background" />
        </div>
        <div>
          <h2 className="text-xl font-bold tracking-tight">代理人热度榜</h2>
          <p className="font-mono text-xs text-muted-foreground">实时更新 · 本周数据</p>
        </div>
      </div>

      {/* Leaderboard Container */}
      <div className="relative overflow-hidden rounded-xl border border-border bg-card">
        {/* Decorative Corner */}
        <div className="absolute right-0 top-0 h-20 w-20 bg-gradient-to-bl from-neon-blue/20 to-transparent" />
        <div className="absolute bottom-0 left-0 h-20 w-20 bg-gradient-to-tr from-neon-pink/20 to-transparent" />

        {/* Leaderboard Items */}
        <div className="relative divide-y divide-border">
          {leaderboardData.map((item, index) => (
            <LeaderboardItem
              key={item.id}
              item={item}
              maxScore={maxScore}
              isExpanded={expandedId === item.id}
              onToggle={() => setExpandedId(expandedId === item.id ? null : item.id)}
              delay={index * 100}
            />
          ))}
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

interface LeaderboardItemProps {
  item: (typeof leaderboardData)[0]
  maxScore: number
  isExpanded: boolean
  onToggle: () => void
  delay: number
}

function LeaderboardItem({ item, maxScore, isExpanded, onToggle }: LeaderboardItemProps) {
  const progressWidth = (item.score / maxScore) * 100

  const getRankIcon = () => {
    if (item.rank === 1) return <Crown className="h-5 w-5 text-yellow-400" />
    if (item.rank === 2) return <Star className="h-5 w-5 text-gray-300" />
    if (item.rank === 3) return <Zap className="h-5 w-5 text-amber-600" />
    return <span className="font-mono text-sm text-muted-foreground">{item.rank}</span>
  }

  const getTrendIcon = () => {
    if (item.trend === "up")
      return (
        <div className="flex animate-[trend-bounce_1s_ease-in-out_infinite] items-center gap-0.5 text-neon-green">
          <TrendingUp className="h-3 w-3" />
          <span className="font-mono text-xs">+{item.trendValue}</span>
        </div>
      )
    if (item.trend === "down")
      return (
        <div className="flex items-center gap-0.5 text-destructive">
          <TrendingDown className="h-3 w-3" />
          <span className="font-mono text-xs">-{item.trendValue}</span>
        </div>
      )
    return <Minus className="h-3 w-3 text-muted-foreground" />
  }

  return (
    <div
      className={cn(
        "group cursor-pointer transition-all duration-300 hover:bg-muted/30",
        item.rank <= 3 && "bg-gradient-to-r from-muted/20 to-transparent",
      )}
      onClick={onToggle}
    >
      <div className="flex items-center gap-3 p-4">
        {/* Rank */}
        <div
          className={cn(
            "flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg",
            item.rank === 1 && "bg-yellow-500/20",
            item.rank === 2 && "bg-gray-400/20",
            item.rank === 3 && "bg-amber-600/20",
            item.rank > 3 && "bg-muted",
          )}
        >
          {getRankIcon()}
        </div>

        {/* Avatar */}
        <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-lg border border-border">
          <Image src={item.avatar || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
          {/* Holographic overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
        </div>

        {/* Info */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="truncate font-medium">{item.name}</span>
            <span
              className={cn(
                "rounded-full px-1.5 py-0.5 font-mono text-[10px]",
                item.elementColor === "neon-blue" && "bg-neon-blue/20 text-neon-blue",
                item.elementColor === "neon-pink" && "bg-neon-pink/20 text-neon-pink",
                item.elementColor === "neon-purple" && "bg-neon-purple/20 text-neon-purple",
                item.elementColor === "neon-green" && "bg-neon-green/20 text-neon-green",
                item.elementColor === "destructive" && "bg-destructive/20 text-destructive",
              )}
            >
              {item.element}
            </span>
          </div>

          {/* Progress Bar */}
          <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-muted">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-1000",
                item.rank === 1 && "bg-gradient-to-r from-yellow-500 to-orange-500",
                item.rank === 2 && "bg-gradient-to-r from-gray-300 to-gray-400",
                item.rank === 3 && "bg-gradient-to-r from-amber-500 to-amber-600",
                item.rank > 3 && "bg-gradient-to-r from-neon-blue to-neon-purple",
              )}
              style={{ width: `${progressWidth}%` }}
            />
          </div>
        </div>

        {/* Score & Trend */}
        <div className="flex flex-col items-end gap-1">
          <span className="font-mono text-sm font-medium text-neon-blue">{item.score.toLocaleString()}</span>
          {getTrendIcon()}
        </div>

        {/* Expand Icon */}
        <div className="ml-1">
          {isExpanded ? (
            <ChevronUp className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          )}
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="border-t border-border/50 bg-muted/20 px-4 py-3">
          <p className="text-sm text-muted-foreground">{item.description}</p>
          <div className="mt-3 flex gap-2">
            <button className="rounded-lg bg-neon-blue/20 px-3 py-1.5 text-xs font-medium text-neon-blue transition-colors hover:bg-neon-blue/30">
              查看详情
            </button>
            <button className="rounded-lg bg-neon-pink/20 px-3 py-1.5 text-xs font-medium text-neon-pink transition-colors hover:bg-neon-pink/30">
              攻略推荐
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
