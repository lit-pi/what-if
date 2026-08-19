import { LLMAdjudicationCandidate, PromptContext } from "@lit-pi/what-if-contracts";

export interface LLMAdjudicationProvider {
  requestCandidate(context: PromptContext): Promise<LLMAdjudicationCandidate | null>;
}

export class NullLLMProvider implements LLMAdjudicationProvider {
  async requestCandidate(_context: PromptContext): Promise<LLMAdjudicationCandidate | null> {
    return null;
  }
}
