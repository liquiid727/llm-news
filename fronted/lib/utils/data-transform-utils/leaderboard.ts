import type { LeaderboardItem, ZeroEvalModel } from "@/lib/type"

/**
 * 组织标识对应的主题色映射
 */
export const ORG_COLOR: Record<string, string> = {
  openai: "neon-green",
  anthropic: "neon-purple",
  google: "neon-blue",
  meta: "neon-blue",
  deepseek: "neon-pink",
  alibaba: "destructive",
  mistralai: "neon-blue",
  xai: "neon-purple",
}

/**
 * 根据组织 ID 解析在 `public/logo` 中的组织图标路径
 * @param id 组织 ID（如 `openai`、`anthropic`）
 * @returns 静态资源路径，如 `/logo/openai.svg`
 */
export function resolveOrgLogo(id: string | null): string {
  const raw = (id || "").toLowerCase()
  if (!raw) return ""
  const alias: Record<string, string> = { mistralai: "mistral", zai: "zai-org" }
  const normalized = alias[raw] || raw
  const extMap: Record<string, "svg" | "webp"> = {
    anthropic: "svg",
    google: "svg",
    meta: "svg",
    ibm: "svg",
    mistral: "svg",
    moonshotai: "svg",
    nvidia: "svg",
    xai: "svg",
    openai: "svg",
    cohere: "webp",
    deepseek: "webp",
    ai21: "webp",
    minimax: "webp",
    qwen: "webp",
    "zai-org": "svg",
  }
  const ext = extMap[normalized] || "svg"
  return `/logo/${normalized}.${ext}`
}

/**
 * 计算综合得分（整数加权）
 * @param m 模型数据
 * @returns 综合得分（整数）
 */
export function pickScoreOverall(m: ZeroEvalModel): number {
  const v =
    m.scores?.chat ?? m.scores?.gpqa ?? m.scores?.aime_2025 ?? m.scores?.mmmu ?? m.scores?.code ?? m.scores?.swe_bench ?? 0
  return Math.round((v || 0) * 100000)
}

/**
 * 计算推理能力得分（整数加权）
 * @param m 模型数据
 * @returns 推理得分（整数）
 */
export function pickScoreReasoning(m: ZeroEvalModel): number {
  const v = m.scores?.gpqa ?? m.scores?.aime_2025 ?? m.scores?.mmmu ?? 0
  return Math.round((v || 0) * 100000)
}

/**
 * 计算人气榜得分（整数加权）
 * @param m 模型数据
 * @returns 人气得分（整数）
 */
export function pickScorePopularity(m: ZeroEvalModel): number {
  const v = m.scores?.chat ?? m.scores?.gpqa ?? 0
  return Math.round((v || 0) * 100000)
}

/**
 * 计算代码能力百分比（0-100）
 * @param m 模型数据
 * @returns 代码能力百分比（整数）
 */
export function pickScoreCodingPercent(m: ZeroEvalModel): number {
  const v = m.scores?.code ?? m.scores?.swe_bench ?? 0
  return Math.round((v || 0) * 100)
}

/**
 * 将 `ZeroEvalModel` 转换为排行榜条目
 * @param m 模型数据
 * @param score 预计算分数
 * @param rank 排名
 * @returns `LeaderboardItem`
 */
export function toItem(m: ZeroEvalModel, score: number, rank: number): LeaderboardItem {
  const orgId = (m.organization?.id || "").toLowerCase()
  const elementColor = ORG_COLOR[orgId] || "neon-blue"
  const avatar =
    resolveOrgLogo(m.organization?.id ?? null) || m.organization?.icon_url || "/placeholder.svg?height=100&width=100"
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

/**
 * 从模型列表构建各类榜单数据映射
 * @param models 模型列表
 * @returns 榜单分类到条目列表的映射
 */
export function buildDataMap(models: ZeroEvalModel[]): Record<string, LeaderboardItem[]> {
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

