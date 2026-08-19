import { describe, expect, it, vi, afterEach } from "vitest";
import { undercoverDemonKingScenario } from "@lit-pi/what-if-scenarios";
import { createInitialSessionState } from "@lit-pi/what-if-runtime";
import {
  buildPromptContext,
  parseLLMJson,
  NullLLMProvider,
  HttpLLMProvider,
} from "../src/index.js";

describe("LLM Package Utilities", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

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

  it("HttpLLMProvider successfully calls HTTP API and parses JSON candidate", async () => {
    const mockResponseBody = {
      choices: [
        {
          message: {
            content: `\`\`\`json
            {
              "schemaVersion": "what-if-llm-adjudication/v1",
              "actionCategory": "deceive",
              "adjudication": "costly_success",
              "suggestedStateDelta": { "exposureRisk": 2, "heroTrust": 4 },
              "narration": "成功用失控借口混过关",
              "characterResponses": [
                {
                  "characterId": "leon",
                  "speakerName": "勇者 莱昂",
                  "content": "原来是符文阵反噬，险些误伤圣骑士大人。"
                }
              ]
            }
            \`\`\``,
          },
        },
      ],
    };

    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockResponseBody,
    });
    vi.stubGlobal("fetch", mockFetch);

    const provider = new HttpLLMProvider({
      apiKey: "test-key-123",
      baseUrl: "https://test-api.example.com",
      model: "test-model",
      timeoutMs: 3000,
    });

    const sessionState = createInitialSessionState(undercoverDemonKingScenario);
    const ctx = buildPromptContext(
      undercoverDemonKingScenario,
      sessionState,
      "尝试用失控借口对付勇者"
    );

    const result = await provider.requestCandidate(ctx);

    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(result).not.toBeNull();
    expect(result?.schemaVersion).toBe("what-if-llm-adjudication/v1");
    expect(result?.actionCategory).toBe("deceive");
    expect(result?.adjudication).toBe("costly_success");
    expect(result?.suggestedStateDelta?.exposureRisk).toBe(2);
    expect(result?.characterResponses?.[0].characterId).toBe("leon");
  });

  it("HttpLLMProvider returns null on HTTP error or network timeout (triggering server fallback)", async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
    });
    vi.stubGlobal("fetch", mockFetch);

    const provider = new HttpLLMProvider({
      apiKey: "test-key-123",
      timeoutMs: 1000,
    });

    const sessionState = createInitialSessionState(undercoverDemonKingScenario);
    const ctx = buildPromptContext(
      undercoverDemonKingScenario,
      sessionState,
      "超时测试"
    );

    const result = await provider.requestCandidate(ctx);
    expect(result).toBeNull();
  });
});
