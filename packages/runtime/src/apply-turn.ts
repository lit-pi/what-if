import {
  ActionCategory,
  Adjudication,
  CharacterResponse,
  DecisionTrace,
  EndingKey,
  EndingResult,
  FlagKey,
  LLMAdjudicationCandidate,
  SceneId,
  SessionState,
  StatKey,
  TurnRequest,
  TurnResult,
} from "@lit-pi/what-if-contracts";
import { ScenarioConfig } from "@lit-pi/what-if-scenarios";
import { determineEnding } from "./determine-ending.js";
import { validateAdjudicationCandidate } from "./validate-adjudication.js";
import { validateEndingCandidate } from "./validate-ending-candidate.js";

export type ApplyTurnResult = {
  nextSessionState: SessionState;
  turnResult: TurnResult;
};

export function applyTurn(
  scenario: ScenarioConfig,
  sessionState: SessionState,
  request: TurnRequest,
  llmCandidate?: LLMAdjudicationCandidate | null
): ApplyTurnResult {
  if (sessionState.status === "ended") {
    throw new Error("Cannot apply turn to an ended session.");
  }

  const currentSceneId = sessionState.currentSceneId;
  const scene = scenario.scenes[currentSceneId];
  if (!scene) {
    throw new Error(`Scene '${currentSceneId}' not found in scenario.`);
  }

  const matchedRules: string[] = [];
  const rejectedCandidateFields: string[] = [];
  const stateClampEvents: string[] = [];
  let fallbackUsed = false;
  let llmUsed = false;

  let actionCategory: ActionCategory = "generic";
  let adjudication: Adjudication = "success";
  let actionSummary = "";
  let narration = "";
  let rawStateDelta: Partial<Record<StatKey, number>> = {};
  let rawFlagUpdates: Partial<Record<FlagKey, boolean | number>> = {};
  let suggestedNextSceneId: SceneId | null = null;
  let suggestedEndingKey: EndingKey | null = null;
  let characterResponses: CharacterResponse[] = [];
  let evidenceLog: string | null = null;

  // Process Request
  if (request.actionType === "preset") {
    const presetId = request.presetActionId!;
    const preset = scenario.presetActions[presetId];
    if (!preset || preset.sceneId !== currentSceneId) {
      throw new Error(
        `Preset action '${presetId}' is invalid for scene '${currentSceneId}'.`
      );
    }
    matchedRules.push(`preset.${presetId}`);
    actionCategory = preset.category;
    adjudication = "success";
    actionSummary = preset.label;
    narration = preset.description;
    rawStateDelta = preset.defaultStateDelta;
    rawFlagUpdates = preset.defaultFlagUpdates || {};
    suggestedNextSceneId = (preset.nextSceneId as SceneId) || null;
    suggestedEndingKey = (preset.endingKey as EndingKey) || null;
  } else {
    // free_text
    actionSummary = request.freeText?.trim() || "";
    const validation = llmCandidate
      ? validateAdjudicationCandidate(llmCandidate, scene, scenario)
      : null;

    if (llmCandidate && validation && validation.isValid) {
      llmUsed = true;
      rejectedCandidateFields.push(...validation.rejectedFields);
      stateClampEvents.push(...validation.clampEvents);

      actionCategory = validation.validatedCategory;
      adjudication = validation.validatedAdjudication;
      rawStateDelta = validation.validatedStateDelta;
      rawFlagUpdates = validation.validatedFlagUpdates;
      suggestedNextSceneId = validation.validatedNextSceneId;
      suggestedEndingKey = validation.validatedEndingKey;
      narration = llmCandidate.narration || `关于“${actionSummary}”的裁决。`;
      characterResponses = llmCandidate.characterResponses || [];
      evidenceLog = llmCandidate.evidenceLog || null;
      matchedRules.push(`llm.adjudication.${actionCategory}.${adjudication}`);
    } else {
      fallbackUsed = true;
      if (validation && validation.rejectedFields.length > 0) {
        rejectedCandidateFields.push(...validation.rejectedFields);
      }
      actionCategory = "generic";
      adjudication = "costly_success";
      narration = `[本地裁决] 你采取行动：“${actionSummary}”，经过周旋，局势暂时保持稳定。`;
      rawStateDelta = { exposureRisk: 2, partyProgress: 5 };
      rawFlagUpdates = {};
      suggestedNextSceneId = scene.legalNextSceneIds[0] ?? null;
      suggestedEndingKey = null;
      matchedRules.push("fallback.generic_costly_success");
    }
  }

  // Generate default character response if none supplied
  if (characterResponses.length === 0) {
    const primaryCharId = scene.focusCharacters[0] ?? "leon";
    const charDef = scenario.characters[primaryCharId];
    if (charDef) {
      characterResponses.push({
        characterId: primaryCharId,
        speakerName: charDef.displayName,
        content: `“阿斯兰，这一步非常关键，我们继续推进。”`,
      });
    }
  }

  // Apply State Deltas and Clamp [0, 100]
  const stateAfter = { ...sessionState.stats };
  const appliedDelta = {} as Record<StatKey, number>;

  for (const [statKey, config] of Object.entries(scenario.stats)) {
    const key = statKey as StatKey;
    const currentVal = sessionState.stats[key] ?? config.initialValue;
    const delta = rawStateDelta[key] ?? 0;
    let newVal = currentVal + delta;
    if (newVal > config.max) {
      stateClampEvents.push(`${key}:${newVal}->${config.max}`);
      newVal = config.max;
    } else if (newVal < config.min) {
      stateClampEvents.push(`${key}:${newVal}->${config.min}`);
      newVal = config.min;
    }
    stateAfter[key] = newVal;
    appliedDelta[key] = delta;
  }

  // Apply Flags
  const flagsAfter = { ...sessionState.flags };
  const appliedFlagUpdates = {} as Record<FlagKey, boolean | number>;
  for (const [rawKey, rawVal] of Object.entries(rawFlagUpdates)) {
    const key = rawKey as FlagKey;
    flagsAfter[key] = rawVal;
    appliedFlagUpdates[key] = rawVal;
  }

  // Determine Ending / Next Scene
  let endingResult: EndingResult | null = null;
  let finalNextSceneId: SceneId | null = suggestedNextSceneId;
  let endingSource = "none";
  let targetEndingKey: EndingKey | null = suggestedEndingKey;

  const currentExposureRisk = stateAfter.exposureRisk ?? 0;
  const currentMageEvidence = stateAfter.mageEvidence ?? 0;

  // Mid-turn hard failures
  if (!targetEndingKey) {
    if (currentExposureRisk >= 75) {
      targetEndingKey = "exposed";
      endingSource = "threshold_exposureRisk";
    } else if (currentMageEvidence >= 65) {
      targetEndingKey = "instantArrest";
      endingSource = "threshold_mageEvidence";
    }
  } else {
    endingSource = "preset_or_candidate";
  }

  // Final Act ending determination
  if (!targetEndingKey && scene.legalNextSceneIds.length === 0) {
    targetEndingKey = determineEnding(stateAfter, flagsAfter);
    endingSource = "final_act_priority";
  }

  // Red line validation on ALL target ending candidates
  if (targetEndingKey) {
    const endingValidation = validateEndingCandidate(targetEndingKey, stateAfter, flagsAfter);
    if (!endingValidation.allowed) {
      rejectedCandidateFields.push(`ending_blocked_${targetEndingKey}`);
      matchedRules.push(`ending.blocked.${targetEndingKey}->${endingValidation.effectiveEndingKey}`);
      if (endingValidation.blockedReason) {
        stateClampEvents.push(`ending_blocked:${targetEndingKey}:${endingValidation.blockedReason}`);
      }
      targetEndingKey = endingValidation.effectiveEndingKey;
    }
  }

  if (targetEndingKey) {
    const endingDef = scenario.endings[targetEndingKey];
    if (endingDef) {
      endingResult = {
        key: endingDef.key,
        title: endingDef.title,
        tone: endingDef.tone,
        summary: endingDef.summary,
        causeTemplate: endingDef.causeTemplate,
        shareCopy: endingDef.shareCopy,
      };
    }
    finalNextSceneId = null;
  }

  const isEnded = endingResult !== null;
  const now = Date.now();

  const nextSessionState: SessionState = {
    ...sessionState,
    currentSceneId: isEnded
      ? sessionState.currentSceneId
      : finalNextSceneId || sessionState.currentSceneId,
    stats: stateAfter,
    flags: flagsAfter,
    status: isEnded ? "ended" : "active",
    endingKey: endingResult ? endingResult.key : null,
    updatedAt: now,
  };

  const decisionTrace: DecisionTrace = {
    matchedRules,
    rejectedCandidateFields,
    fallbackUsed,
    llmUsed,
    endingCandidateSource: endingSource,
    stateClampEvents,
  };

  const turnResult: TurnResult = {
    turnId: `turn_${now}_${Math.random().toString(36).substring(2, 6)}`,
    turnIndex: (sessionState as any).turnCount ?? 1,
    sceneId: currentSceneId,
    actionType: request.actionType,
    actionSummary,
    actionCategory,
    adjudication,
    narration,
    stateDelta: appliedDelta,
    stateAfter,
    flagUpdates: appliedFlagUpdates,
    flagsAfter,
    focusedCharacters: scene.focusCharacters,
    characterResponses,
    evidenceLog,
    nextSceneId: finalNextSceneId,
    ending: endingResult,
    decisionTrace,
  };

  return { nextSessionState, turnResult };
}
