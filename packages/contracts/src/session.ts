import { z } from "zod";
import {
  SceneIdSchema,
  SessionStatusSchema,
  StatKeySchema,
  FlagKeySchema,
} from "./enums.js";

export const StatsMapSchema = z.record(StatKeySchema, z.number());
export type StatsMap = z.infer<typeof StatsMapSchema>;

export const FlagsMapSchema = z.record(
  FlagKeySchema,
  z.union([z.boolean(), z.number()])
);
export type FlagsMap = z.infer<typeof FlagsMapSchema>;

export const SessionStateSchema = z.object({
  sessionId: z.string(),
  scenarioId: z.string(),
  scenarioVersion: z.string(),
  currentSceneId: SceneIdSchema,
  stats: StatsMapSchema,
  flags: FlagsMapSchema,
  status: SessionStatusSchema,
  endingKey: z.string().nullable().optional(),
  createdAt: z.number(),
  updatedAt: z.number(),
});
export type SessionState = z.infer<typeof SessionStateSchema>;

export const CreateSessionRequestSchema = z.object({
  scenarioId: z.string().default("undercover-demon-king"),
});
export type CreateSessionRequest = z.infer<typeof CreateSessionRequestSchema>;

export const SessionSnapshotSchema = z.object({
  sessionId: z.string(),
  scenarioId: z.string(),
  scenarioVersion: z.string(),
  currentSceneId: SceneIdSchema,
  stats: StatsMapSchema,
  flags: FlagsMapSchema,
  status: SessionStatusSchema,
  turnCount: z.number(),
  endingKey: z.string().nullable().optional(),
});
export type SessionSnapshot = z.infer<typeof SessionSnapshotSchema>;
