import { z } from "zod";
import {
  ActionCategorySchema,
  ActionTypeSchema,
  AdjudicationSchema,
  CharacterIdSchema,
  EndingKeySchema,
  FlagKeySchema,
  SceneIdSchema,
  StatKeySchema,
} from "./enums.js";
import { FlagsMapSchema, StatsMapSchema } from "./session.js";

export const TurnRequestSchema = z
  .object({
    clientTurnId: z.string().min(1),
    actionType: ActionTypeSchema,
    presetActionId: z.string().nullable().optional(),
    freeText: z.string().max(200).nullable().optional(),
  })
  .refine(
    (data) => {
      if (data.actionType === "preset") {
        return (
          typeof data.presetActionId === "string" &&
          data.presetActionId.length > 0
        );
      }
      if (data.actionType === "free_text") {
        return (
          typeof data.freeText === "string" && data.freeText.trim().length > 0
        );
      }
      return false;
    },
    {
      message:
        "actionType='preset' requires presetActionId; actionType='free_text' requires freeText (1..200 chars)",
    }
  );
export type TurnRequest = z.infer<typeof TurnRequestSchema>;

export const CharacterResponseSchema = z.object({
  characterId: CharacterIdSchema,
  speakerName: z.string(),
  content: z.string(),
  emotion: z.string().optional(),
});
export type CharacterResponse = z.infer<typeof CharacterResponseSchema>;

export const EndingResultSchema = z.object({
  key: EndingKeySchema,
  title: z.string(),
  tone: z.string(),
  summary: z.string(),
  causeTemplate: z.string(),
  shareCopy: z.string(),
});
export type EndingResult = z.infer<typeof EndingResultSchema>;

export const DecisionTraceSchema = z.object({
  matchedRules: z.array(z.string()),
  rejectedCandidateFields: z.array(z.string()),
  fallbackUsed: z.boolean(),
  llmUsed: z.boolean(),
  endingCandidateSource: z.string(),
  stateClampEvents: z.array(z.string()),
});
export type DecisionTrace = z.infer<typeof DecisionTraceSchema>;

export const RedLineViolationSchema = z.object({
  characterId: CharacterIdSchema,
  ruleId: z.string(),
  severity: z.enum(["warning", "blocking"]),
  message: z.string(),
  blocksEndings: z.array(EndingKeySchema),
});
export type RedLineViolation = z.infer<typeof RedLineViolationSchema>;

export const LLMAdjudicationCandidateSchema = z.object({
  schemaVersion: z.literal("what-if-llm-adjudication/v1"),
  actionCategory: ActionCategorySchema,
  adjudication: AdjudicationSchema,
  suggestedStateDelta: z.record(StatKeySchema, z.number()).optional(),
  suggestedFlagUpdates: z
    .record(FlagKeySchema, z.union([z.boolean(), z.number()]))
    .optional(),
  suggestedNextSceneId: SceneIdSchema.nullable().optional(),
  suggestedEndingKey: EndingKeySchema.nullable().optional(),
  narration: z.string().optional(),
  characterResponses: z.array(CharacterResponseSchema).optional(),
  evidenceLog: z.string().optional(),
});
export type LLMAdjudicationCandidate = z.infer<
  typeof LLMAdjudicationCandidateSchema
>;

export const TurnResultSchema = z.object({
  turnId: z.string(),
  turnIndex: z.number(),
  sceneId: SceneIdSchema,
  actionType: ActionTypeSchema,
  actionSummary: z.string(),
  actionCategory: ActionCategorySchema,
  adjudication: AdjudicationSchema,
  narration: z.string(),
  stateDelta: z.record(StatKeySchema, z.number()),
  stateAfter: StatsMapSchema,
  flagUpdates: z.record(FlagKeySchema, z.union([z.boolean(), z.number()])),
  flagsAfter: FlagsMapSchema,
  focusedCharacters: z.array(CharacterIdSchema),
  characterResponses: z.array(CharacterResponseSchema),
  evidenceLog: z.string().nullable().optional(),
  nextSceneId: SceneIdSchema.nullable().optional(),
  ending: EndingResultSchema.nullable().optional(),
  decisionTrace: DecisionTraceSchema,
});
export type TurnResult = z.infer<typeof TurnResultSchema>;
