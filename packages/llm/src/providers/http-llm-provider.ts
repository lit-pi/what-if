import {
  LLMAdjudicationCandidate,
  PromptContext,
} from "@lit-pi/what-if-contracts";
import { LLMAdjudicationProvider } from "./provider.types.js";
import { parseLLMJson } from "../parse-llm-json.js";

export type HttpLLMProviderConfig = {
  apiKey: string;
  baseUrl?: string | undefined;
  model?: string | undefined;
  timeoutMs?: number | undefined;
};

export class HttpLLMProvider implements LLMAdjudicationProvider {
  private apiKey: string;
  private baseUrl: string;
  private model: string;
  private timeoutMs: number;

  constructor(config: HttpLLMProviderConfig) {
    this.apiKey = config.apiKey;
    this.baseUrl = (config.baseUrl || "https://ark.cn-beijing.volces.com/api/v3").replace(/\/$/, "");
    this.model = config.model || "doubao-pro-32k";
    this.timeoutMs = config.timeoutMs || 4000;
  }

  async requestCandidate(
    context: PromptContext
  ): Promise<LLMAdjudicationCandidate | null> {
    if (!this.apiKey) {
      return null;
    }

    const systemPrompt = `你是一个跑团GM与对话演绎引擎，正负责主持即兴叙事游戏《假如我是勇者队伍里的卧底魔王》。
玩家扮演隐匿身份混入勇者队伍的卧底魔王“阿斯兰”。

【输出规范】
你必须且只能输出严格符合 JSON 格式的文本，并被 \`\`\`json\`\`\` 包含。必须严格遵循以下 JSON 结构：
{
  "schemaVersion": "what-if-llm-adjudication/v1",
  "actionCategory": "deceive", // 可选: "deceive" | "protect" | "sacrifice" | "bribe" | "confess" | "peace" | "commandVictor" | "absurd" | "generic"
  "adjudication": "costly_success", // 可选: "success" | "costly_success" | "disaster_failure"
  "suggestedStateDelta": {
    "exposureRisk": 2, // 状态变化值, 整数范围 [-30, 30]
    "heroTrust": 5
  },
  "suggestedFlagUpdates": {},
  "narration": "GM 旁白，生动生动地解释玩家行动带来的局面演化",
  "characterResponses": [
    {
      "characterId": "leon", // 角色ID, 可选: "leon" | "ivette" | "mira" | "locke" | "victor" | "aslan" | "narrator"
      "speakerName": "勇者 莱昂",
      "content": "角色对白文本",
      "emotion": "suspicious"
    }
  ]
}

【裁决原则】
1. 自由文本行动可以有合理表达空间，但不能瞬间终结全局或无视场景限制。
2. 数值增减单项不得超过 +-30。
3. 如果玩家行动过于离谱或暴露风险高，应当赋予 costly_success 并增加 exposureRisk。`;

    const userPrompt = `【当前场景】: ${context.sceneTitle} (SceneID: ${context.sceneId})
【突发危机】: ${context.mishapDescription}
【焦点角色】: ${context.focusCharacters.join(", ")}
【当前状态】: ${JSON.stringify(context.stats)}
【当前旗标】: ${JSON.stringify(context.flags)}
【玩家自由行动输入】: "${context.playerActionText}"

请根据玩家的自由行动输入，给出符合规范的 JSON 裁决与角色对白。`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeoutMs);

    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: this.model,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
          temperature: 0.7,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        return null;
      }

      const data = (await response.json()) as any;
      const rawContent = data.choices?.[0]?.message?.content;
      if (!rawContent || typeof rawContent !== "string") {
        return null;
      }

      return parseLLMJson(rawContent);
    } catch {
      clearTimeout(timeoutId);
      return null;
    }
  }
}
