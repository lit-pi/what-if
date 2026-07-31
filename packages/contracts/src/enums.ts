import { z } from "zod";

export const StatKeySchema = z.enum([
  "exposureRisk",
  "heroTrust",
  "mageEvidence",
  "priestRedemption",
  "thiefLeverage",
  "castleIntegrity",
  "victorMisread",
  "partyProgress",
  "butterflyDeviation",
]);
export type StatKey = z.infer<typeof StatKeySchema>;

export const FlagKeySchema = z.enum([
  "savedDemonSoldier",
  "betrayedVictor",
  "bribedLocke",
  "acceptedPurification",
  "confessedIdentity",
  "proposedPeace",
  "peacePivoted",
  "commandVictorSuccess",
  "raidedArmory",
  "foundForbiddenScroll",
  "subduedBloodArray",
  "freedDungeonCaptive",
  "protectedInnocentsCount",
  "sacrificedInnocentsCount",
  "contradictionCount",
  "majorLieCount",
  "resolvedMajorCrisisCount",
  "miraBufferedCrisis",
]);
export type FlagKey = z.infer<typeof FlagKeySchema>;

export const CharacterIdSchema = z.enum([
  "narrator",
  "aslan",
  "leon",
  "ivette",
  "mira",
  "locke",
  "victor",
]);
export type CharacterId = z.infer<typeof CharacterIdSchema>;

export const SceneIdSchema = z.enum([
  "gate",
  "act2_ruins",
  "act2_dungeon",
  "act3_library",
  "act3_treasury",
  "act4_corridor",
  "act5_throne",
]);
export type SceneId = z.infer<typeof SceneIdSchema>;

export const EndingKeySchema = z.enum([
  "gate_exposure_ending",
  "ruins_arrest_ending",
  "dungeon_rupture_ending",
  "library_seal_ending",
  "treasury_confess_ending",
  "corridor_betrayal_ending",
  "instantExecution",
  "instantArrest",
  "exposed",
  "castleLost",
  "dualRuler",
  "redeemed",
  "perfectSpy",
  "victorBlamed",
  "actorKing",
  "absurdAscension",
  "stalemate",
]);
export type EndingKey = z.infer<typeof EndingKeySchema>;

export const ActionCategorySchema = z.enum([
  "deceive",
  "protect",
  "sacrifice",
  "bribe",
  "confess",
  "peace",
  "commandVictor",
  "absurd",
  "generic",
]);
export type ActionCategory = z.infer<typeof ActionCategorySchema>;

export const AdjudicationSchema = z.enum([
  "success",
  "costly_success",
  "failure",
  "disaster_failure",
]);
export type Adjudication = z.infer<typeof AdjudicationSchema>;

export const ActionTypeSchema = z.enum(["preset", "free_text"]);
export type ActionType = z.infer<typeof ActionTypeSchema>;

export const SessionStatusSchema = z.enum(["active", "ended"]);
export type SessionStatus = z.infer<typeof SessionStatusSchema>;
