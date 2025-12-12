import { describe, it } from "node:test"
import assert from "node:assert/strict"
import type { ZeroEvalModel } from "@/lib/type"
import {
  pickScoreOverall,
  pickScoreReasoning,
  pickScorePopularity,
  pickScoreCodingPercent,
  resolveOrgLogo,
  toItem,
  buildDataMap,
} from "@/lib/utils/data-transform-utils/leaderboard"

describe("data-transform-utils/leaderboard", () => {
  const baseModel: ZeroEvalModel = {
    model_id: "test-model",
    name: "Test Model",
    organization: { id: "openai", name: "OpenAI", icon_url: null },
    scores: { aime_2025: 0.5, gpqa: 0.6, mmmu: 0.7, chat: 0.8, swe_bench: 0.2, code: 0.3 },
    meta: { release_date: "2025-01-01", license: null, context_length: null, input_price: null, output_price: null },
    rank: { overall: null, last_change: null },
  }

  it("resolveOrgLogo should map organization id to logo path", () => {
    assert.equal(resolveOrgLogo("openai"), "/logo/openai.svg")
    assert.equal(resolveOrgLogo("deepseek"), "/logo/deepseek.webp")
    assert.equal(resolveOrgLogo("mistralai"), "/logo/mistral.svg")
    assert.equal(resolveOrgLogo(null), "")
  })

  it("score pickers should return expected values", () => {
    assert.equal(pickScoreOverall(baseModel), Math.round(0.8 * 100000))
    assert.equal(pickScoreReasoning(baseModel), Math.round(0.6 * 100000))
    assert.equal(pickScorePopularity(baseModel), Math.round(0.8 * 100000))
    assert.equal(pickScoreCodingPercent(baseModel), Math.round(0.3 * 100))
  })

  it("toItem should produce a valid LeaderboardItem", () => {
    const item = toItem(baseModel, 123456, 1)
    assert.equal(item.rank, 1)
    assert.equal(item.name, "Test Model")
    assert.ok(item.avatar.includes("/logo/openai.svg"))
    assert.equal(item.element, "OpenAI")
    assert.equal(item.score, 123456)
    assert.equal(typeof item.stats.reasoning, "number")
  })

  it("buildDataMap should build categories properly", () => {
    const models: ZeroEvalModel[] = [
      baseModel,
      {
        ...baseModel,
        model_id: "another",
        name: "Another Model",
        organization: { id: "anthropic", name: "Anthropic", icon_url: null },
        meta: { ...baseModel.meta, release_date: "2025-02-01" },
        scores: { ...baseModel.scores, gpqa: 0.9, code: 0.85 },
      },
    ]
    const map = buildDataMap(models)
    assert.ok(map.overall.length >= 2)
    assert.ok(map.reasoning.length >= 2)
    assert.ok(map.popularity.length >= 2)
    assert.ok(map.coding.length >= 1)
    assert.ok(map.newmodels.length >= 2)
    assert.equal(map.overall[0].rank, 1)
  })
})

