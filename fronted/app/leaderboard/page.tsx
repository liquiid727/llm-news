"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import {
  Trophy,
  ChevronDown,
  ChevronUp,
  Crown,
  Star,
  Zap,
  Flame,
  Cpu,
  Target,
  Sparkles,
  Brain,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { GlitchText } from "@/components/glitch-text"
import type { LeaderboardItem, ZeroEvalJson, ZeroEvalModel, LeaderboardItemProps } from "@/lib/type"


const categories = [
  { id: "overall", name: "综合榜", icon: Brain, color: "neon-blue" },
  { id: "reasoning", name: "推理能力", icon: Cpu, color: "neon-pink" },
  { id: "popularity", name: "人气榜", icon: Flame, color: "destructive" },
  { id: "coding", name: "代码能力", icon: Target, color: "neon-green" },
  { id: "newmodels", name: "新星榜", icon: Sparkles, color: "neon-purple" },
]

const ORG_COLOR: Record<string, string> = {
  openai: "neon-green",
  anthropic: "neon-purple",
  google: "neon-blue",
  meta: "neon-blue",
  deepseek: "neon-pink",
  alibaba: "destructive",
  mistralai: "neon-blue",
  xai: "neon-purple",
}

function pickScoreOverall(m: ZeroEvalModel) {
  const v = m.scores?.chat ?? m.scores?.gpqa ?? m.scores?.aime_2025 ?? m.scores?.mmmu ?? m.scores?.code ?? m.scores?.swe_bench ?? 0
  return Math.round((v || 0) * 100000)
}

function pickScoreReasoning(m: ZeroEvalModel) {
  const v = m.scores?.gpqa ?? m.scores?.aime_2025 ?? m.scores?.mmmu ?? 0
  return Math.round((v || 0) * 100000)
}

function pickScorePopularity(m: ZeroEvalModel) {
  const v = m.scores?.chat ?? m.scores?.gpqa ?? 0
  return Math.round((v || 0) * 100000)
}

function pickScoreCodingPercent(m: ZeroEvalModel) {
  const v = m.scores?.code ?? m.scores?.swe_bench ?? 0
  return Math.round((v || 0) * 100)
}

function toItem(m: ZeroEvalModel, score: number, rank: number): LeaderboardItem {
  const orgId = (m.organization?.id || "").toLowerCase()
  const elementColor = ORG_COLOR[orgId] || "neon-blue"
  const avatar = m.organization?.icon_url || "/placeholder.svg?height=100&width=100"
  const stats = {
    reasoning: Math.round(((m.scores?.gpqa ?? 0) || 0) * 100),
    coding: Math.round(((m.scores?.code ?? 0) || 0) * 100),
    creative: Math.round(((m.scores?.mmmu ?? 0) || 0) * 100),
  }
  return {
    id: rank,
    rank,
    name: m.name || m.model_id || "Unknown",
    avatar,
    score,
    element: m.organization?.name || "Unknown",
    elementColor,
    description: `${m.name || m.model_id} · ${m.organization?.name || "Unknown"}`,
    stats,
  }
}

function buildDataMap(models: ZeroEvalModel[]): Record<string, LeaderboardItem[]> {
  const overallSorted = [...models].sort((a, b) => pickScoreOverall(b) - pickScoreOverall(a))
  const overall = overallSorted.map((m, i) => toItem(m, pickScoreOverall(m), i + 1))

  const reasoningSorted = [...models].sort((a, b) => pickScoreReasoning(b) - pickScoreReasoning(a))
  const reasoning = reasoningSorted.map((m, i) => toItem(m, pickScoreReasoning(m), i + 1))

  const popularitySorted = [...models].sort((a, b) => pickScorePopularity(b) - pickScorePopularity(a))
  const popularity = popularitySorted.map((m, i) => toItem(m, pickScorePopularity(m), i + 1))

  const codingCandidates = models.filter((m) => (m.scores?.code ?? m.scores?.swe_bench) != null)
  const codingSorted = [...codingCandidates].sort((a, b) => pickScoreCodingPercent(b) - pickScoreCodingPercent(a))
  const coding = codingSorted.map((m, i) => toItem(m, pickScoreCodingPercent(m), i + 1))

  const withDate = models
    .map((m) => ({ m, d: m.meta?.release_date ? Date.parse(m.meta.release_date) : NaN }))
    .filter((x) => !Number.isNaN(x.d))
    .sort((a, b) => b.d - a.d)
    .map((x, i) => toItem(x.m, pickScoreOverall(x.m), i + 1))
  const newmodels = withDate.length > 0 ? withDate : overall.slice(0, 10)

  return { overall, reasoning, popularity, coding, newmodels }
}

let cachedLoad: Promise<{ map: Record<string, LeaderboardItem[]>; lastUpdated: string }> | null = null
async function loadData(): Promise<{ map: Record<string, LeaderboardItem[]>; lastUpdated: string }> {
  if (cachedLoad) return cachedLoad
  cachedLoad = (async () => {
    const res = await fetch("/data/zeroeval_merged_leaderboard.json", { cache: "force-cache" })
    if (!res.ok) throw new Error(`load failed: ${res.status}`)
    const json = (await res.json()) as ZeroEvalJson
    const models = json?.data_structure?.models || []
    const map = buildDataMap(models)
    const lastUpdated = json?.last_updated || ""
    return { map, lastUpdated }
  })()
  return cachedLoad
}

export default function LeaderboardPage() {
  const [activeCategory, setActiveCategory] = useState("overall")
  const [expandedId, setExpandedId] = useState<number | null>(null)
  const [dataMap, setDataMap] = useState<Record<string, LeaderboardItem[]>>({
    overall: [],
    reasoning: [],
    popularity: [],
    coding: [],
    newmodels: [],
  })
  const [lastUpdated, setLastUpdated] = useState<string>("")
  const [loadError, setLoadError] = useState<string>("")

  useEffect(() => {
    loadData()
      .then(({ map, lastUpdated }) => {
        setDataMap(map)
        setLastUpdated(lastUpdated)
      })
      .catch((e) => {
        setLoadError(String(e))
      })
  }, [])

  const currentData = dataMap[activeCategory] || []
  const maxScore = Math.max(...(currentData.map((item) => item.score).concat([0])))
  const activeTab = categories.find((c) => c.id === activeCategory)

  return (
    <div className="relative min-h-screen bg-background">
      {/* Background Effects */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        {/* Grid Pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(var(--neon-blue) 1px, transparent 1px),
                             linear-gradient(90deg, var(--neon-blue) 1px, transparent 1px)`,
            backgroundSize: "50px 50px",
          }}
        />
        {/* Gradient Orbs */}
        <div className="absolute -left-40 top-20 h-80 w-80 rounded-full bg-neon-blue/20 blur-[100px]" />
        <div className="absolute -right-40 bottom-40 h-96 w-96 rounded-full bg-neon-pink/20 blur-[120px]" />
        <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-neon-purple/15 blur-[80px]" />
      </div>

      <Navbar />

      <main className="relative pt-20 pb-12">
        <div className="container mx-auto px-4">
          {/* Page Header */}
          <div className="mb-8 text-center">
            <div className="mb-4 inline-flex items-center gap-3 rounded-full border border-neon-blue/30 bg-neon-blue/10 px-4 py-2">
              <Trophy className="h-5 w-5 text-neon-blue" />
              <span className="font-mono text-sm text-neon-blue">LLM LEADERBOARD</span>
            </div>
            <GlitchText text="模型排行榜" as="h1" className="text-4xl font-bold tracking-widest md:text-5xl" />
            <p className="mt-3 text-muted-foreground">实时更新 · 数据来源于权威基准测试</p>
          </div>

          {/* Main Content: Category Tabs + Leaderboard */}
          <div className="flex flex-col gap-6 lg:flex-row">
            {/* Left Side: Category Tabs */}
            <div className="w-full shrink-0 lg:w-56">
              <div className="sticky top-24 space-y-2">
                <p className="mb-4 px-2 font-mono text-xs uppercase tracking-wider text-muted-foreground">
                  选择榜单类型
                </p>
                {categories.map((category) => {
                  const Icon = category.icon
                  const isActive = activeCategory === category.id
                  return (
                    <button
                      key={category.id}
                      onClick={() => {
                        setActiveCategory(category.id)
                        setExpandedId(null)
                      }}
                      className={cn(
                        "group relative flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left transition-all duration-300",
                        isActive
                          ? "border-neon-blue/50 bg-neon-blue/10 text-neon-blue shadow-[0_0_20px_rgba(0,200,255,0.15)]"
                          : "border-border bg-card/50 text-muted-foreground hover:border-border hover:bg-card hover:text-foreground",
                      )}
                    >
                      {/* Glow Effect for Active */}
                      {isActive && (
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-neon-blue/10 to-neon-purple/10" />
                      )}
                      <div
                        className={cn(
                          "relative flex h-9 w-9 items-center justify-center rounded-lg transition-all",
                          isActive ? "bg-neon-blue/20" : "bg-muted group-hover:bg-muted/80",
                        )}
                      >
                        <Icon className={cn("h-4 w-4", isActive ? "text-neon-blue" : "text-muted-foreground")} />
                      </div>
                      <span className="relative font-medium">{category.name}</span>
                      {/* Active Indicator */}
                      {isActive && (
                        <div className="absolute right-3 top-1/2 h-2 w-2 -translate-y-1/2 animate-pulse rounded-full bg-neon-blue" />
                      )}
                    </button>
                  )
                })}

                {/* Decorative Element */}
                <div className="mt-6 rounded-xl border border-border/50 bg-card/30 p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <div className="h-2 w-2 animate-pulse rounded-full bg-neon-green" />
                    <span className="font-mono text-xs text-neon-green">数据刷新中</span>
                  </div>
                  <p className="text-xs text-muted-foreground">每 5 分钟自动更新一次排行榜数据</p>
                </div>
              </div>
            </div>

            {/* Right Side: Leaderboard Card */}
            <div className="flex-1">
              <div className="relative min-h-[80vh] overflow-hidden rounded-2xl border border-border bg-card">
                {/* Card Header Pattern - TV Static Effect */}
                <div className="absolute inset-0 opacity-[0.02]">
                  <div
                    className="absolute inset-0"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%' height='100%' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                    }}
                  />
                </div>

                {/* Neon Border Glow */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-neon-blue/20 via-transparent to-neon-pink/20 opacity-50" />
                <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-br from-neon-blue/30 via-transparent to-neon-pink/30 blur-sm" />

                {/* Scanline Effect */}
                <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-2xl">
                  <div className="scanline absolute h-[2px] w-full bg-gradient-to-r from-transparent via-neon-blue/30 to-transparent" />
                </div>

                {/* Corner Decorations */}
                <div className="absolute left-4 top-4 h-8 w-8 border-l-2 border-t-2 border-neon-blue/50" />
                <div className="absolute right-4 top-4 h-8 w-8 border-r-2 border-t-2 border-neon-pink/50" />
                <div className="absolute bottom-4 left-4 h-8 w-8 border-b-2 border-l-2 border-neon-purple/50" />
                <div className="absolute bottom-4 right-4 h-8 w-8 border-b-2 border-r-2 border-neon-green/50" />

                {/* Card Content */}
                <div className="relative p-6 md:p-8">
                  {/* Card Header */}
                  <div className="mb-6 flex flex-col gap-4 border-b border-border/50 pb-6 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                      {activeTab && (
                        <>
                          <div
                            className={cn(
                              "flex h-12 w-12 items-center justify-center rounded-xl",
                              activeTab.color === "neon-blue" && "bg-neon-blue/20",
                              activeTab.color === "neon-pink" && "bg-neon-pink/20",
                              activeTab.color === "neon-purple" && "bg-neon-purple/20",
                              activeTab.color === "neon-green" && "bg-neon-green/20",
                              activeTab.color === "destructive" && "bg-destructive/20",
                            )}
                          >
                            <activeTab.icon
                              className={cn(
                                "h-6 w-6",
                                activeTab.color === "neon-blue" && "text-neon-blue",
                                activeTab.color === "neon-pink" && "text-neon-pink",
                                activeTab.color === "neon-purple" && "text-neon-purple",
                                activeTab.color === "neon-green" && "text-neon-green",
                                activeTab.color === "destructive" && "text-destructive",
                              )}
                            />
                          </div>
                          <div>
                            <h2 className="text-2xl font-bold tracking-tight">{activeTab.name}</h2>
                            <p className="font-mono text-xs text-muted-foreground">
                              TOP {currentData.length} · 本周数据
                            </p>
                          </div>
                        </>
                      )}
                    </div>
                    <div className="flex items-center gap-2 rounded-full border border-border bg-muted/50 px-3 py-1.5">
                      <div className="h-2 w-2 animate-pulse rounded-full bg-neon-green" />
                      <span className="font-mono text-xs text-muted-foreground">LIVE</span>
                    </div>
                  </div>

                  {/* Leaderboard List */}
                  <div className="space-y-3">
                    {loadError && (
                      <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-3 font-mono text-xs text-destructive">
                        {loadError}
                      </div>
                    )}
                    {currentData.map((item, index) => (
                      <LeaderboardItem
                        key={item.id}
                        item={item}
                        maxScore={maxScore}
                        isExpanded={expandedId === item.id}
                        onToggle={() => setExpandedId(expandedId === item.id ? null : item.id)}
                        isPercentage={activeCategory === "coding"}
                        delay={index * 50}
                      />
                    ))}
                  </div>

                  {/* Footer */}
                  <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-border/50 pt-6 sm:flex-row">
                    <p className="text-sm text-muted-foreground">数据更新时间: {lastUpdated || "N/A"}</p>
                    <button className="flex items-center gap-2 rounded-lg border border-neon-blue/50 bg-neon-blue/10 px-4 py-2 font-mono text-sm text-neon-blue transition-all hover:bg-neon-blue/20">
                      <Zap className="h-4 w-4" />
                      刷新数据
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

// Leaderboard Item Component
function LeaderboardItem({ item, maxScore, isExpanded, onToggle, isPercentage, delay = 0 }: LeaderboardItemProps) {
  const progressPercentage = isPercentage ? item.score : (item.score / maxScore) * 100

  const getRankStyle = (rank: number) => {
    switch (rank) {
      case 1:
        return {
          bg: "bg-gradient-to-r from-yellow-500/20 to-amber-500/20",
          border: "border-yellow-500/50",
          icon: <Crown className="h-5 w-5 text-yellow-500" />,
          glow: "shadow-[0_0_20px_rgba(234,179,8,0.3)]",
        }
      case 2:
        return {
          bg: "bg-gradient-to-r from-slate-300/20 to-slate-400/20",
          border: "border-slate-400/50",
          icon: <Star className="h-5 w-5 text-slate-300" />,
          glow: "shadow-[0_0_15px_rgba(148,163,184,0.3)]",
        }
      case 3:
        return {
          bg: "bg-gradient-to-r from-amber-600/20 to-orange-600/20",
          border: "border-amber-600/50",
          icon: <Star className="h-5 w-5 text-amber-600" />,
          glow: "shadow-[0_0_15px_rgba(217,119,6,0.3)]",
        }
      default:
        return {
          bg: "bg-card/50",
          border: "border-border",
          icon: null,
          glow: "",
        }
    }
  }

  const rankStyle = getRankStyle(item.rank)

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-xl border transition-all duration-300",
        rankStyle.bg,
        rankStyle.border,
        rankStyle.glow,
        "hover:scale-[1.01]",
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Main Row */}
      <div className="relative flex cursor-pointer items-center gap-4 p-4" onClick={onToggle}>
        {/* Rank */}
        <div className="flex h-12 w-12 shrink-0 items-center justify-center">
          {rankStyle.icon || <span className="font-mono text-xl font-bold text-muted-foreground">#{item.rank}</span>}
        </div>

        {/* Avatar */}
        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-border">
          <Image src={item.avatar || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
        </div>

        {/* Info */}
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex items-center gap-2">
            <h3 className="truncate font-bold">{item.name}</h3>
            <span
              className={cn(
                "rounded-full px-2 py-0.5 font-mono text-xs",
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
          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-500",
                item.rank === 1 && "bg-gradient-to-r from-yellow-500 to-amber-500",
                item.rank === 2 && "bg-gradient-to-r from-slate-300 to-slate-400",
                item.rank === 3 && "bg-gradient-to-r from-amber-600 to-orange-600",
                item.rank > 3 && "bg-gradient-to-r from-neon-blue to-neon-purple",
              )}
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Score */}
        <div className="flex shrink-0 items-center gap-4">
          <div className="text-right">
            <p className="font-mono text-lg font-bold">
              {isPercentage ? `${item.score}%` : item.score.toLocaleString()}
            </p>
          </div>

          {/* Expand Button */}
          <button className="rounded-lg p-1 transition-colors hover:bg-muted">
            {isExpanded ? (
              <ChevronUp className="h-5 w-5 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-5 w-5 text-muted-foreground" />
            )}
          </button>
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="border-t border-border/50 bg-background/50 p-4">
          <p className="mb-4 text-sm text-muted-foreground">{item.description}</p>

          {/* Stats - 更新属性名称 */}
          <div className="grid grid-cols-3 gap-4">
            {Object.entries(item.stats).map(([key, value]) => (
              <div key={key} className="rounded-lg bg-muted/50 p-3 text-center">
                <p className="mb-1 font-mono text-xs uppercase text-muted-foreground">
                  {key === "reasoning" ? "推理" : key === "coding" ? "代码" : "创意"}
                </p>
                <p className="text-lg font-bold text-neon-blue">{value}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
