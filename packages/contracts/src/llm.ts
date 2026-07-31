import { z } from "zod";
import { CharacterIdSchema, SceneIdSchema } from "./enums.js";
import { FlagsMapSchema, StatsMapSchema } from "./session.js";

export const PromptContextSchema = z.object({
  scenarioId: z.string(),
  sceneId: SceneIdSchema,
  sceneTitle: z.string(),
  mishapDescription: z.string(),
  focusCharacters: z.array(CharacterIdSchema),
  playerActionText: z.string(),
  stats: StatsMapSchema,
  flags: FlagsMapSchema,
  recentHistorySummary: z.array(z.string()).optional(),
});
export type PromptContext = z.infer<typeof PromptContextSchema>;
