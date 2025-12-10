"use client"

import { useState } from "react"
import Image from "next/image"
import { Clock, MessageSquare, Eye, ChevronRight, Flame, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

const newsData = [
  {
    id: 1,
    title: "GPT-5 即将发布：OpenAI 确认下一代模型",
    excerpt: "OpenAI 官方透露 GPT-5 将于今年发布，性能提升巨大，支持更长上下文窗口...",
    image: "/futuristic-ai-brain-neural-network-neon.jpg",
    category: "模型发布",
    date: "2小时前",
    views: 12580,
    comments: 342,
    isHot: true,
  },
  {
    id: 2,
    title: "Claude 4 基准测试全面领先，多项能力超越竞品",
    excerpt: "Anthropic 发布 Claude 4 详细评测报告，在推理、编程、数学等多个维度表现优异...",
    image: "/ai-benchmark-chart-holographic-display.jpg",
    category: "评测分析",
    date: "5小时前",
    views: 8920,
    comments: 186,
    isHot: false,
  },
  {
    id: 3,
    title: "开源模型 Llama 4 技术解析：架构与训练细节",
    excerpt: "深度剖析 Meta 最新开源模型的技术架构，MoE 设计与训练策略全解读...",
    image: "/code-architecture-diagram-cyberpunk.jpg",
    category: "技术解读",
    date: "8小时前",
    views: 15340,
    comments: 528,
    isHot: true,
  },
  {
    id: 4,
    title: "社区热议：哪款 LLM 最适合代码生成？",
    excerpt: "开发者社区票选最佳编程助手，GPT-4、Claude、Gemini 谁更胜一筹...",
    image: "/developer-coding-ai-assistant-neon.jpg",
    category: "社区热议",
    date: "12小时前",
    views: 6780,
    comments: 892,
    isHot: false,
  },
]

const categories = ["全部", "模型发布", "评测分析", "技术解读", "社区热议"]

export function NewsSection() {
  const [activeCategory, setActiveCategory] = useState("全部")

  const filteredNews =
    activeCategory === "全部" ? newsData : newsData.filter((news) => news.category === activeCategory)

  return (
    <section id="news" className="relative">
      {/* Section Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="h-8 w-1 rounded-full bg-gradient-to-b from-neon-blue to-neon-pink" />
          <h2 className="text-2xl font-bold tracking-tight md:text-3xl">最新情报</h2>
          <Sparkles className="h-5 w-5 animate-pulse text-neon-blue" />
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={cn(
                "rounded-full px-4 py-1.5 font-mono text-xs transition-all duration-300",
                activeCategory === category
                  ? "bg-neon-blue text-background shadow-[0_0_15px_rgba(0,240,255,0.5)]"
                  : "border border-border bg-card text-muted-foreground hover:border-neon-blue/50 hover:text-neon-blue",
              )}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* News Grid */}
      <div className="grid gap-6">
        {filteredNews.map((news, index) => (
          <NewsCard key={news.id} news={news} featured={index === 0} />
        ))}
      </div>

      {/* Load More */}
      <button className="group mt-8 flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-card/50 py-4 text-muted-foreground transition-all duration-300 hover:border-neon-blue/50 hover:bg-neon-blue/10 hover:text-neon-blue">
        <span>加载更多</span>
        <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </button>
    </section>
  )
}

interface NewsCardProps {
  news: (typeof newsData)[0]
  featured?: boolean
}

function NewsCard({ news, featured }: NewsCardProps) {
  return (
    <article
      className={cn(
        "group relative overflow-hidden rounded-xl border border-border bg-card transition-all duration-300 hover:border-neon-blue/50 hover:shadow-[0_0_30px_rgba(0,240,255,0.15)]",
        featured && "md:flex",
      )}
    >
      {/* Glow Border Effect */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-neon-blue/20 via-neon-pink/20 to-neon-purple/20 opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100" />

      {/* Image */}
      <div className={cn("relative overflow-hidden", featured ? "md:w-2/5" : "h-48")}>
        <Image
          src={news.image || "/placeholder.svg"}
          alt={news.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {/* Scanline Effect */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-neon-blue/5 to-transparent" />

        {/* Category Badge */}
        <div className="absolute left-3 top-3">
          <span className="rounded-full border border-neon-pink/50 bg-background/80 px-3 py-1 font-mono text-xs text-neon-pink backdrop-blur-sm">
            {news.category}
          </span>
        </div>

        {/* Hot Badge */}
        {news.isHot && (
          <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-destructive/90 px-2 py-1 backdrop-blur-sm">
            <Flame className="h-3 w-3 text-destructive-foreground" />
            <span className="font-mono text-xs text-destructive-foreground">HOT</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className={cn("relative p-5", featured && "md:flex-1")}>
        <h3 className="mb-2 text-lg font-bold leading-tight transition-colors duration-300 group-hover:text-neon-blue md:text-xl">
          {news.title}
        </h3>
        <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">{news.excerpt}</p>

        {/* Meta Info */}
        <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>{news.date}</span>
          </div>
          <div className="flex items-center gap-1">
            <Eye className="h-3 w-3" />
            <span>{news.views.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1">
            <MessageSquare className="h-3 w-3" />
            <span>{news.comments}</span>
          </div>
        </div>

        {/* Read More Arrow */}
        <div className="absolute bottom-5 right-5 flex h-8 w-8 items-center justify-center rounded-full border border-border bg-card transition-all duration-300 group-hover:border-neon-blue group-hover:bg-neon-blue/20">
          <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:text-neon-blue" />
        </div>
      </div>
    </article>
  )
}
