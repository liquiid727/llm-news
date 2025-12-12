"use client"

import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { GridBackground } from "@/components/grid-background"
import Image from "next/image"
import Link from "next/link"
import { ExternalLink } from "lucide-react"

const models = [
  {
    name: "DeepSeek",
    description: "专注通用人工智能的中国科技公司，开源了DeepSeek-V2等高性能模型。",
    website: "https://www.deepseek.com",
    logo: "/logo/deepseek.webp",
    tags: ["开源", "MoE", "国产"]
  },
  {
    name: "OpenAI",
    description: "人工智能研究实验室，ChatGPT、GPT-4和Sora的创造者，引领AI革命。",
    website: "https://openai.com",
    logo: "/logo/openai.svg",
    tags: ["GPT-4", "Sora", "闭源"]
  },
  {
    name: "Anthropic",
    description: "由前OpenAI员工创立，主打安全可控的AI，开发了Claude系列模型。",
    website: "https://www.anthropic.com",
    logo: "/logo/anthropic.svg",
    tags: ["Claude", "长上下文", "安全"]
  },
   {
    name: "Google Gemini",
    description: "Google DeepMind开发的原生多模态AI模型，无缝理解文本、图像、视频。",
    website: "https://deepmind.google/technologies/gemini/",
    logo: "/logo/google.svg",
    tags: ["多模态", "Gemini", "原生"]
  },
   {
    name: "Meta Llama",
    description: "Meta AI发布的开源大语言模型系列，推动了全球开源模型生态的发展。",
    website: "https://llama.meta.com/",
    logo: "/logo/meta.svg",
    tags: ["开源", "Llama 3", "生态丰富"]
  },
   {
    name: "Mistral AI",
    description: "法国AI初创公司，致力于开发高效、强大的开源模型，如Mixtral 8x7B。",
    website: "https://mistral.ai/",
    logo: "/logo/mistral.svg",
    tags: ["欧洲", "Mixtral", "高效"]
  }
]

const casesData = [
  {
    title: "金融科技：智能风控与投研助手",
    description: "某大型银行利用 Llama 3 构建私有化智能投研系统，研报分析效率提升 80%...",
    tags: ["金融", "私有化部署", "效率提升"]
  },
  {
    title: "医疗健康：辅助诊断与病历生成",
    description: "基于 DeepSeek-V2 的医疗大模型在三甲医院落地，辅助医生撰写病历，准确率达 95%...",
    tags: ["医疗", "辅助诊断", "精准医疗"]
  },
  {
    title: "教育领域：个性化 AI 导师",
    description: "在线教育平台接入 Claude 3，为百万学生提供24小时个性化辅导，学习效果显著...",
    tags: ["教育", "个性化", "规模化"]
  },
]

export default function ModelsPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-background">
      <GridBackground />
      <Navbar />
      
      <div className="container mx-auto px-4 py-24">
        <div className="mb-16 text-center">
          <h1 className="mb-4 text-4xl font-black tracking-tight md:text-6xl lg:text-7xl">
            <span className="text-neon-blue">模型</span>
            <span className="text-neon-pink">广场</span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground md:text-xl">
            探索全球主流大模型，直达官方前沿
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {models.map((model) => (
            <Link 
              key={model.name} 
              href={model.website}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative overflow-hidden rounded-xl border border-neon-blue/20 bg-card/50 p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-neon-pink/50 hover:shadow-[0_0_30px_rgba(255,0,170,0.2)]"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-neon-blue/5 to-neon-pink/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              
              <div className="relative z-10 flex h-full flex-col">
                <div className="mb-4 flex items-center justify-between">
                  <div className="relative h-12 w-12 overflow-hidden rounded-lg bg-white/10 p-2">
                    <Image 
                      src={model.logo} 
                      alt={model.name} 
                      fill
                      className="object-contain p-1"
                    />
                  </div>
                  <ExternalLink className="h-5 w-5 text-muted-foreground transition-colors group-hover:text-neon-pink" />
                </div>
                
                <h3 className="mb-2 text-xl font-bold text-foreground group-hover:text-neon-blue">
                  {model.name}
                </h3>
                
                <p className="mb-4 flex-grow text-sm text-muted-foreground">
                  {model.description}
                </p>
                
                <div className="flex flex-wrap gap-2">
                  {model.tags.map((tag) => (
                    <span 
                      key={tag} 
                      className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground group-hover:bg-neon-blue/10 group-hover:text-neon-blue"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Typical Cases Section */}
        <div className="mt-24">
          <div className="mb-12 text-center">
             <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
               <span className="text-neon-blue">典型</span>
               <span className="text-foreground">案例</span>
             </h2>
             <p className="text-muted-foreground">
               大模型在各行业的落地应用与实践
             </p>
          </div>
          
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {casesData.map((item, i) => (
              <div 
                key={i}
                className="group relative overflow-hidden rounded-xl border border-border bg-card/50 transition-all duration-300 hover:scale-[1.01] hover:border-neon-blue/50 hover:shadow-[0_0_20px_rgba(0,240,255,0.1)]"
              >
                <div className="aspect-video relative overflow-hidden bg-muted">
                   {/* Placeholder for Case Image */}
                   <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900 text-muted-foreground">
                      <span className="font-mono text-xs">CASE STUDY IMAGE</span>
                   </div>
                   <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-60" />
                   <div className="absolute bottom-4 left-4 right-4">
                     <h3 className="text-lg font-bold text-white group-hover:text-neon-blue transition-colors">
                       {item.title}
                     </h3>
                   </div>
                </div>
                <div className="p-5">
                   <p className="mb-4 text-sm text-muted-foreground line-clamp-3">
                     {item.description}
                   </p>
                   <div className="flex flex-wrap gap-2">
                      {item.tags.map(tag => (
                        <span key={tag} className="rounded-full border border-border px-2 py-0.5 text-xs text-muted-foreground">
                          {tag}
                        </span>
                      ))}
                   </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
      
      <Footer />
    </main>
  )
}
