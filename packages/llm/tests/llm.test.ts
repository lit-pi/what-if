import { describe, expect, it } from "vitest";
import { undercoverDemonKingScenario } from "@lit-pi/what-if-scenarios";
import { createInitialSessionState } from "@lit-pi/what-if-runtime";
import {
  buildPromptContext,
  parseLLMJson,
  NullLLMProvider,
} from "../src/index.js";

describe("LLM Package Utilities", () => {
  it("builds prompt context correctly", () => {
    const sessionState = createInitialSessionState(undercoverDemonKingScenario);
    const ctx = buildPromptContext(
      undercoverDemonKingScenario,
      sessionState,
      "我向莱昂坦白"
    );

    expect(ctx.scenarioId).toBe("undercover-demon-king");
    expect(ctx.sceneId).toBe("gate");
    expect(ctx.playerActionText).toBe("我向莱昂坦白");
    expect(ctx.focusCharacters).toContain("ivette");
  });

  it("parses valid JSON response from markdown blocks", () => {
    const rawJson = `\`\`\`json
    {
      "schemaVersion": "what-if-llm-adjudication/v1",
      "actionCategory": "deceive",
      "adjudication": "success",
      "suggestedStateDelta": { "exposureRisk": -5 }
    }
    \`\`\``;

    const parsed = parseLLMJson(rawJson);
    expect(parsed).not.toBeNull();
    expect(parsed?.schemaVersion).toBe("what-if-llm-adjudication/v1");
    expect(parsed?.actionCategory).toBe("deceive");
    expect(parsed?.suggestedStateDelta?.exposureRisk).toBe(-5);
  });

  it("returns null for malformed JSON or missing schemaVersion", () => {
    expect(parseLLMJson("invalid json")).toBeNull();

    const missingSchemaJson = `\`\`\`json
    {
      "actionCategory": "deceive",
      "adjudication": "success"
    }
    \`\`\``;
    expect(parseLLMJson(missingSchemaJson)).toBeNull();
  });

  it("NullLLMProvider returns null candidate", async () => {
    const provider = new NullLLMProvider();
    const sessionState = createInitialSessionState(undercoverDemonKingScenario);
    const ctx = buildPromptContext(
      undercoverDemonKingScenario,
      sessionState,
      "test"
    );
    const result = await provider.requestCandidate(ctx);
    expect(result).toBeNull();
  });
});
