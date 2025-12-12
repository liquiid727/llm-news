import type React from "react"
import type { Metadata, Viewport } from "next"
import { Noto_Sans_SC } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const notoSansSC = Noto_Sans_SC({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-noto-sans",
})

export const metadata: Metadata = {
  title: "LLM.NEWS | 大模型情报站",
  description: "追踪最新LLM动态、模型排行榜、前沿资讯实时更新 - 大语言模型情报中心",
  generator: "v0.app",
  icons: {
    icon: "/site.svg",
    apple: "/site.svg",
  },
}

export const viewport: Viewport = {
  themeColor: "#0a0a14",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh-CN">
      <body className={`${notoSansSC.variable} font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
