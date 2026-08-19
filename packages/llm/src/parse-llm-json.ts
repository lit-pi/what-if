import {
  LLMAdjudicationCandidate,
  LLMAdjudicationCandidateSchema,
} from "@lit-pi/what-if-contracts";

export function parseLLMJson(
  jsonString: string
): LLMAdjudicationCandidate | null {
  try {
    let cleanText = jsonString.trim();
    if (cleanText.startsWith("```json")) {
      cleanText = cleanText.slice(7);
    } else if (cleanText.startsWith("```")) {
      cleanText = cleanText.slice(3);
    }
    if (cleanText.endsWith("```")) {
      cleanText = cleanText.slice(0, -3);
    }
    const raw = JSON.parse(cleanText.trim());
    const parsed = LLMAdjudicationCandidateSchema.safeParse(raw);
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}
