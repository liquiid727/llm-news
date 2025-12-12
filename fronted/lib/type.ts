// 类型定义：排行榜页面与 ZeroEval 数据结构
// 用于集中管理类型，保证类型安全与可维护性

export type LeaderboardItem = {
  id: number
  rank: number
  name: string
  avatar: string
  score: number
  element: string
  elementColor: string
  description: string
  stats: { reasoning: number; coding: number; creative: number }
}

export type ZeroEvalJson = {
  version: string
  last_updated: string
  data_structure: {
    models: ZeroEvalModel[]
    last_fetched: string
  }
}

export type ZeroEvalModel = {
  model_id: string | null
  name: string | null
  organization?: {
    id: string | null
    name: string | null
    icon_url: string | null
  }
  scores?: {
    aime_2025: number | null
    gpqa: number | null
    mmmu: number | null
    chat: number | null
    swe_bench: number | null
    code: number | null
  }
  meta?: {
    release_date: string | null
    license: string | null
    context_length: number | null
    input_price: number | null
    output_price: number | null
  }
  rank?: {
    overall: number | null
    last_change: number | null
  }
}

export interface LeaderboardItemProps {
  item: LeaderboardItem
  maxScore: number
  isExpanded: boolean
  onToggle: () => void
  isPercentage?: boolean
  delay?: number
}
