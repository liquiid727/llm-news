"use client"

import { useState } from "react"
import Image from "next/image"
import { Clock, MessageSquare, Eye, ChevronRight, Flame, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

const newsData = [
  {
    id: 1,
    // 开发阶段占位数据 - 待正式上线后替换
    title: "正在加油载入中",
    excerpt: "站主正在火急火燎完善中，请稍安勿躁，精彩内容马上就来...",
    image: "/default_news_bg.jpg",
    category: "模型发布",
    date: "刚刚",
    views: 9999,
    comments: 0,
    isHot: true,
  },
  {
    id: 2,
    // 开发阶段占位数据
    title: "施工队正在挖掘数据",
    excerpt: "我们的AI矿工正在努力挖掘最新的大模型情报，预计很快就能挖出宝藏...",
    image: "/default_news_bg.jpg",
    category: "评测分析",
    date: "1分钟前",
    views: 8888,
    comments: 0,
    isHot: false,
  },
  {
    id: 3,
    // 开发阶段占位数据
    title: "服务器正在做俯卧撑",
    excerpt: "为了给您提供更快的访问速度，我们的服务器正在进行高强度体能训练...",
    image: "/default_news_bg.jpg",
    category: "技术解读",
    date: "3分钟前",
    views: 7777,
    comments: 0,
    isHot: true,
  },
  {
    id: 4,
    // 开发阶段占位数据
    title: "神秘内容即将揭晓",
    excerpt: "这里有一个惊天大秘密，但是由于墨水还没干，所以暂时看不清...",
    image: "/default_news_bg.jpg",
    category: "社区热议",
    date: "5分钟前",
    views: 6666,
    comments: 0,
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
