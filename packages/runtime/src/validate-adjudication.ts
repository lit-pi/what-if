import {
  ActionCategory,
  Adjudication,
  EndingKey,
  FlagKey,
  LLMAdjudicationCandidate,
  SceneId,
  StatKey,
  StatKeySchema,
  FlagKeySchema,
  ActionCategorySchema,
  AdjudicationSchema,
} from "@lit-pi/what-if-contracts";
import { SceneConfig, ScenarioConfig } from "@lit-pi/what-if-scenarios";

export type AdjudicationValidationResult = {
  isValid: boolean;
  validatedCategory: ActionCategory;
  validatedAdjudication: Adjudication;
  validatedStateDelta: Partial<Record<StatKey, number>>;
  validatedFlagUpdates: Partial<Record<FlagKey, boolean | number>>;
  validatedNextSceneId: SceneId | null;
  validatedEndingKey: EndingKey | null;
  rejectedFields: string[];
  clampEvents: string[];
};

export function validateAdjudicationCandidate(
  candidate: LLMAdjudicationCandidate | null | undefined,
  scene: SceneConfig,
  scenario: ScenarioConfig
): AdjudicationValidationResult {
  const rejectedFields: string[] = [];
  const clampEvents: string[] = [];

  if (!candidate) {
    return {
      isValid: false,
      validatedCategory: "generic",
      validatedAdjudication: "costly_success",
      validatedStateDelta: {},
      validatedFlagUpdates: {},
      validatedNextSceneId: scene.legalNextSceneIds[0] ?? null,
      validatedEndingKey: null,
      rejectedFields: ["candidate_null"],
      clampEvents: [],
    };
  }

  // 0. Schema Version Hard Fallback
  if (candidate.schemaVersion !== "what-if-llm-adjudication/v1") {
    return {
      isValid: false,
      validatedCategory: "generic",
      validatedAdjudication: "costly_success",
      validatedStateDelta: {},
      validatedFlagUpdates: {},
      validatedNextSceneId: scene.legalNextSceneIds[0] ?? null,
      validatedEndingKey: null,
      rejectedFields: ["schemaVersion_invalid_or_missing"],
      clampEvents: [],
    };
  }

  // 1. Action Category
  let category: ActionCategory = candidate.actionCategory;
  if (!ActionCategorySchema.safeParse(category).success) {
    rejectedFields.push("actionCategory_invalid");
    category = "generic";
  } else if (
    scene.forbiddenCategories.includes(category) ||
    (!scene.allowedCategories.includes(category) && category !== "generic")
  ) {
    rejectedFields.push("actionCategory_not_allowed_in_scene");
    category = "generic";
  }

  // 2. Adjudication
  let adjudication: Adjudication = candidate.adjudication;
  if (!AdjudicationSchema.safeParse(adjudication).success) {
    rejectedFields.push("adjudication_invalid");
    adjudication = "costly_success";
  } else if (adjudication === "failure") {
    // Runtime v1 fallback
    rejectedFields.push("adjudication_failure_demoted_in_v1");
    adjudication = "costly_success";
  }

  // 3. State Delta
  const validatedStateDelta: Partial<Record<StatKey, number>> = {};
  if (candidate.suggestedStateDelta) {
    for (const [rawKey, rawVal] of Object.entries(candidate.suggestedStateDelta)) {
      const keyParsed = StatKeySchema.safeParse(rawKey);
      if (!keyParsed.success) {
        rejectedFields.push(`stateDelta_invalid_key_${rawKey}`);
        continue;
      }
      const key = keyParsed.data;
      let val = typeof rawVal === "number" && !isNaN(rawVal) ? rawVal : 0;
      if (val > 30) {
        clampEvents.push(`${key}:${val}->30`);
        val = 30;
      } else if (val < -30) {
        clampEvents.push(`${key}:${val}->-30`);
        val = -30;
      }
      if (val !== 0) {
        validatedStateDelta[key] = val;
      }
    }
  }

  // 4. Flag Updates
  const validatedFlagUpdates: Partial<Record<FlagKey, boolean | number>> = {};
  if (candidate.suggestedFlagUpdates) {
    for (const [rawKey, rawVal] of Object.entries(candidate.suggestedFlagUpdates)) {
      const keyParsed = FlagKeySchema.safeParse(rawKey);
      if (!keyParsed.success) {
        rejectedFields.push(`flagUpdates_invalid_key_${rawKey}`);
        continue;
      }
      const key = keyParsed.data;
      const flagDef = scenario.flags[key];
      if (!flagDef) {
        rejectedFields.push(`flagUpdates_unknown_flag_${key}`);
        continue;
      }
      if (flagDef.type === "boolean" && typeof rawVal === "boolean") {
        validatedFlagUpdates[key] = rawVal;
      } else if (flagDef.type === "counter" && typeof rawVal === "number") {
        validatedFlagUpdates[key] = rawVal;
      } else {
        rejectedFields.push(`flagUpdates_type_mismatch_${key}`);
      }
    }
  }

  // 5. Next Scene Transition
  let validatedNextSceneId: SceneId | null = null;
  if (candidate.suggestedNextSceneId) {
    if (scene.legalNextSceneIds.includes(candidate.suggestedNextSceneId)) {
      validatedNextSceneId = candidate.suggestedNextSceneId;
    } else {
      rejectedFields.push(
        `suggestedNextSceneId_${candidate.suggestedNextSceneId}_illegal`
      );
      validatedNextSceneId = scene.legalNextSceneIds[0] ?? null;
    }
  } else {
    validatedNextSceneId = scene.legalNextSceneIds[0] ?? null;
  }

  // 6. Ending Key
  let validatedEndingKey: EndingKey | null = null;
  if (candidate.suggestedEndingKey) {
    if (scene.allowedEndingKeys.includes(candidate.suggestedEndingKey)) {
      validatedEndingKey = candidate.suggestedEndingKey;
    } else {
      rejectedFields.push(
        `suggestedEndingKey_${candidate.suggestedEndingKey}_not_allowed_in_scene`
      );
    }
  }

  return {
    isValid: rejectedFields.length === 0,
    validatedCategory: category,
    validatedAdjudication: adjudication,
    validatedStateDelta,
    validatedFlagUpdates,
    validatedNextSceneId,
    validatedEndingKey,
    rejectedFields,
    clampEvents,
  };
}
