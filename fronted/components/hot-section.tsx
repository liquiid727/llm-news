"use client"

import Link from "next/link"
import Image from "next/image"
import { useEffect, useMemo, useRef, useState } from "react"
import useEmblaCarousel from "embla-carousel-react"
import { Cpu, FileText, Handshake, Rocket, Clock, ChevronLeft, ChevronRight, Sparkles } from "lucide-react"
import { GlitchText } from "@/components/glitch-text"
import { cn } from "@/lib/utils"

type HotCategory = "模型更新" | "技术论文" | "合作并购" | "开源发布"

interface HotItem {
  id: string
  title: string
  description: string
  category: HotCategory
  date: string
  source: string
  href?: string
  image?: string
}

const CATEGORY_META: Record<
  HotCategory,
  {
    icon: any
    color: string
    border: string
    badge: string
  }
> = {
  模型更新: { icon: Cpu, color: "text-neon-blue", border: "border-neon-blue/50", badge: "bg-neon-blue/20" },
  技术论文: { icon: FileText, color: "text-neon-pink", border: "border-neon-pink/50", badge: "bg-neon-pink/20" },
  合作并购: { icon: Handshake, color: "text-neon-purple", border: "border-neon-purple/50", badge: "bg-neon-purple/20" },
  开源发布: { icon: Rocket, color: "text-neon-green", border: "border-neon-green/50", badge: "bg-neon-green/20" },
}

const SAMPLE_ITEMS: HotItem[] = [
  {
    id: "1",
    title: "GPT‑5 预告：更强推理与多模态融合",
    description: "OpenAI 确认下一代模型将显著提升长上下文与工具使用能力",
    category: "模型更新",
    date: "2 小时前",
    source: "OpenAI",
    href: "https://openai.com",
    image: "/futuristic-ai-brain-neural-network-neon.jpg",
  },
  {
    id: "2",
    title: "Claude 4.1 技术白皮书",
    description: "多维度对齐与可控性突破，强化链式思维与外部知识整合",
    category: "技术论文",
    date: "5 小时前",
    source: "Anthropic",
    href: "https://www.anthropic.com",
    image: "/ai-benchmark-chart-holographic-display.jpg",
  },
  {
    id: "3",
    title: "Meta 推出 Llama 4",
    description: "开源生态再升级，提供更高效的推理与训练管线",
    category: "开源发布",
    date: "8 小时前",
    source: "Meta AI",
    href: "https://ai.facebook.com",
    image: "/code-architecture-diagram-cyberpunk.jpg",
  },
  {
    id: "4",
    title: "xAI 与多家云厂商达成深度合作",
    description: "联合优化推理加速与数据安全方案，扩展企业级部署能力",
    category: "合作并购",
    date: "12 小时前",
    source: "xAI",
    href: "https://x.ai",
    image: "/media-news-broadcast-hologram.jpg",
  },
  {
    id: "5",
    title: "DeepSeek‑R1 强化推理框架",
    description: "自监督强化训练带来数学与代码能力显著提升",
    category: "技术论文",
    date: "1 天前",
    source: "DeepSeek",
    href: "https://deepseek.com",
    image: "/developer-coding-ai-assistant-neon.jpg",
  },
  {
    id: "6",
    title: "Mistral 大模型版本更新",
    description: "上下文扩展至 200K，工具调用与函数合成更稳定",
    category: "模型更新",
    date: "2 天前",
    source: "Mistral AI",
    href: "https://mistral.ai",
    image: "/chip-technology-neon.jpg",
  },
]

export function HotSection() {
  const [items, setItems] = useState<HotItem[]>(SAMPLE_ITEMS)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start", skipSnaps: false })
  const timerRef = useRef<number | null>(null)

  useEffect(() => {
    if (!emblaApi) return
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap())
    emblaApi.on("select", onSelect)
    onSelect()
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi || isPaused) return
    timerRef.current = window.setInterval(() => {
      emblaApi.scrollNext()
    }, 4000)
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current)
      timerRef.current = null
    }
  }, [emblaApi, isPaused])

  const scrollTo = (index: number) => emblaApi?.scrollTo(index)
  const scrollPrev = () => emblaApi?.scrollPrev()
  const scrollNext = () => emblaApi?.scrollNext()

  const decorated = useMemo(
    () =>
      items.map((it) => {
        const meta = CATEGORY_META[it.category]
        return { ...it, meta }
      }),
    [items],
  )

  return (
    <section id="hot" className="relative mt-16 overflow-hidden py-16 md:py-24">
      <div className="absolute left-10 top-24 h-64 w-64 animate-pulse rounded-full bg-neon-blue/10 blur-3xl" />
      <div className="absolute bottom-10 right-10 h-96 w-96 animate-pulse rounded-full bg-neon-pink/10 blur-3xl" />

      <div className="container relative z-10 mx-auto px-4">
        <div className="mb-8 flex items-center gap-3">
          <div className="h-8 w-1 rounded-full bg-gradient-to-b from-neon-blue to-neon-pink" />
          <GlitchText text="LLM 热点速览" as="h1" className="text-3xl font-black tracking-tight md:text-5xl" />
          <Sparkles className="h-5 w-5 text-neon-blue" />
        </div>
        <p className="mb-8 max-w-2xl text-muted-foreground">
          主流大模型版本更新、突破性技术论文、行业合作并购、重要开源发布
        </p>

        <div
          className="relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div ref={emblaRef} className="overflow-hidden">
            <div className="flex">
              {decorated.map((item) => (
                <div key={item.id} className="min-w-0 flex-[0_0_100%] px-1 sm:flex-[0_0_100%] md:flex-[0_0_50%] lg:flex-[0_0_33.333%]">
                  <HotCard item={item} />
                </div>
              ))}
            </div>
          </div>

          <button
            aria-label="Prev"
            onClick={scrollPrev}
            className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full border border-border bg-card/80 p-2 backdrop-blur-sm transition-all hover:bg-muted"
          >
            <ChevronLeft className="h-5 w-5 text-muted-foreground" />
          </button>
          <button
            aria-label="Next"
            onClick={scrollNext}
            className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full border border-border bg-card/80 p-2 backdrop-blur-sm transition-all hover:bg-muted"
          >
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </button>

          <div className="mt-6 flex justify-center gap-2">
            {decorated.map((_, i) => (
              <button
                key={i}
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => scrollTo(i)}
                className={cn(
                  "h-2 w-2 rounded-full transition-all",
                  selectedIndex === i ? "bg-neon-blue shadow-[0_0_10px_rgba(0,240,255,0.6)] w-6" : "bg-muted",
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

interface HotCardProps {
  item: HotItem & {
    meta: {
      icon: any
      color: string
      border: string
      badge: string
    }
  }
}

function HotCard({ item }: HotCardProps) {
  const Icon = item.meta.icon
  const isExternal = item.href?.startsWith("http")

  const Wrapper = ({ children }: { children: React.ReactNode }) =>
    item.href ? (
      isExternal ? (
        <a href={item.href} target="_blank" rel="noopener noreferrer" className="block">
          {children}
        </a>
      ) : (
        <Link href={item.href} className="block">
          {children}
        </Link>
      )
    ) : (
      <div className="block">{children}</div>
    )

  return (
    <Wrapper>
      <article className={cn("group relative h-full overflow-hidden rounded-xl border bg-card transition-all hover:shadow-[0_0_30px_rgba(0,240,255,0.15)]", item.meta.border)}>
        {item.image && (
          <div className="relative h-40 w-full overflow-hidden">
            <Image
              src={item.image || "/placeholder.svg"}
              alt={item.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority={false}
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-background/80" />
          </div>
        )}

        <div className="p-4">
          <div className="mb-3 flex items-center gap-2">
            <div className={cn("flex h-8 w-8 items-center justify-center rounded-lg", item.meta.badge)}>
              <Icon className={cn("h-4 w-4", item.meta.color)} />
            </div>
            <span className={cn("font-mono text-xs", item.meta.color)}>{item.category}</span>
            <div className="ml-auto flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>{item.date}</span>
            </div>
          </div>

          <h3 className="mb-2 line-clamp-2 text-lg font-bold transition-colors group-hover:text-neon-blue">
            {item.title}
          </h3>
          <p className="mb-4 line-clamp-3 text-sm text-muted-foreground">{item.description}</p>

          <div className="flex items-center justify-between">
            <span className="font-mono text-xs text-muted-foreground">{item.source}</span>
            {item.href && (
              <span className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground transition-all group-hover:border-neon-blue/50 group-hover:text-neon-blue">
                查看详情
              </span>
            )}
          </div>
        </div>
      </article>
    </Wrapper>
  )
}

