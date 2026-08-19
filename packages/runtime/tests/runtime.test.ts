import { describe, expect, it } from "vitest";
import { undercoverDemonKingScenario } from "@lit-pi/what-if-scenarios";
import {
  createInitialSessionState,
  applyTurn,
  validateAdjudicationCandidate,
  determineEnding,
} from "../src/index.js";

describe("Runtime Engine Tests", () => {
  it("initializes session state correctly from scenario config", () => {
    const state = createInitialSessionState(
      undercoverDemonKingScenario,
      "test-ses-1"
    );
    expect(state.sessionId).toBe("test-ses-1");
    expect(state.currentSceneId).toBe("gate");
    expect(state.stats.exposureRisk).toBe(25);
    expect(state.stats.heroTrust).toBe(72);
    expect(state.flags.savedDemonSoldier).toBe(false);
    expect(state.status).toBe("active");
  });

  it("applies preset turn 'gate_deceive' successfully", () => {
    const initialState = createInitialSessionState(
      undercoverDemonKingScenario,
      "test-ses-2"
    );
    const { nextSessionState, turnResult } = applyTurn(
      undercoverDemonKingScenario,
      initialState,
      {
        clientTurnId: "ct-1",
        actionType: "preset",
        presetActionId: "gate_deceive",
      }
    );

    expect(turnResult.sceneId).toBe("gate");
    expect(turnResult.nextSceneId).toBe("act2_ruins");
    expect(nextSessionState.currentSceneId).toBe("act2_ruins");
    expect(nextSessionState.stats.exposureRisk).toBe(22); // 25 - 3
    expect(nextSessionState.stats.heroTrust).toBe(78); // 72 + 6
  });

  it("handles free-text turn with local fallback when no LLM candidate is provided", () => {
    const initialState = createInitialSessionState(
      undercoverDemonKingScenario,
      "test-ses-3"
    );
    const { nextSessionState, turnResult } = applyTurn(
      undercoverDemonKingScenario,
      initialState,
      {
        clientTurnId: "ct-2",
        actionType: "free_text",
        freeText: "我向莱昂解释门禁老化",
      }
    );

    expect(turnResult.decisionTrace.fallbackUsed).toBe(true);
    expect(turnResult.adjudication).toBe("costly_success");
    expect(nextSessionState.stats.exposureRisk).toBe(27); // 25 + 2
  });

  it("clamps stat values strictly to [0, 100]", () => {
    const initialState = createInitialSessionState(
      undercoverDemonKingScenario,
      "test-ses-4"
    );
    initialState.stats.exposureRisk = 90;

    const { nextSessionState } = applyTurn(
      undercoverDemonKingScenario,
      initialState,
      {
        clientTurnId: "ct-3",
        actionType: "free_text",
        freeText: "引起怀疑的危险举动",
      },
      {
        schemaVersion: "what-if-llm-adjudication/v1",
        actionCategory: "deceive",
        adjudication: "costly_success",
        suggestedStateDelta: { exposureRisk: 25 },
      }
    );

    expect(nextSessionState.stats.exposureRisk).toBe(100);
  });

  it("triggers instant exposure ending when exposureRisk >= 75", () => {
    const initialState = createInitialSessionState(
      undercoverDemonKingScenario,
      "test-ses-5"
    );
    initialState.stats.exposureRisk = 70;

    const { nextSessionState, turnResult } = applyTurn(
      undercoverDemonKingScenario,
      initialState,
      {
        clientTurnId: "ct-4",
        actionType: "free_text",
        freeText: "失手暴露魔王魔力",
      },
      {
        schemaVersion: "what-if-llm-adjudication/v1",
        actionCategory: "deceive",
        adjudication: "costly_success",
        suggestedStateDelta: { exposureRisk: 10 },
      }
    );

    expect(nextSessionState.status).toBe("ended");
    expect(nextSessionState.endingKey).toBe("exposed");
    expect(turnResult.ending?.title).toBe("暴露惨败");
  });

  it("rejects illegal schemaVersion in validator and forces local fallback in applyTurn", () => {
    const scene = undercoverDemonKingScenario.scenes.gate;
    const validation = validateAdjudicationCandidate(
      {
        schemaVersion: "invalid-version" as any,
        actionCategory: "deceive",
        adjudication: "success",
      },
      scene,
      undercoverDemonKingScenario
    );

    expect(validation.isValid).toBe(false);
    expect(validation.rejectedFields).toContain("schemaVersion_invalid_or_missing");

    const initialState = createInitialSessionState(
      undercoverDemonKingScenario,
      "test-ses-invalid-schema"
    );
    const { nextSessionState, turnResult } = applyTurn(
      undercoverDemonKingScenario,
      initialState,
      {
        clientTurnId: "ct-invalid-schema",
        actionType: "free_text",
        freeText: "尝试越权打乱局势",
      },
      {
        schemaVersion: "invalid-version" as any,
        actionCategory: "deceive",
        adjudication: "success",
        suggestedStateDelta: { exposureRisk: -20 },
        suggestedNextSceneId: "act5_throne" as any,
        suggestedEndingKey: "dualRuler" as any,
      }
    );

    expect(turnResult.decisionTrace.fallbackUsed).toBe(true);
    expect(turnResult.decisionTrace.rejectedCandidateFields).toContain(
      "schemaVersion_invalid_or_missing"
    );
    expect(nextSessionState.currentSceneId).toBe("act2_ruins"); // Standard fallback transition, not illegal act5_throne
    expect(nextSessionState.stats.exposureRisk).toBe(27); // Standard fallback delta (+2), not candidate (-20)
    expect(nextSessionState.status).toBe("active"); // Not ended by candidate dualRuler
  });

  it("intercepts candidate endings that violate character red lines", () => {
    const throneState = createInitialSessionState(
      undercoverDemonKingScenario,
      "test-ses-throne"
    );
    throneState.currentSceneId = "act5_throne";
    throneState.stats.heroTrust = 20; // Very low hero trust (<40 after +10 delta) violates Leon red line

    const { nextSessionState, turnResult } = applyTurn(
      undercoverDemonKingScenario,
      throneState,
      {
        clientTurnId: "ct-throne-peace",
        actionType: "preset",
        presetActionId: "throne_peace", // Preset targets dualRuler
      }
    );

    expect(nextSessionState.status).toBe("ended");
    expect(nextSessionState.endingKey).toBe("stalemate"); // Intercepted and blocked to stalemate
    expect(turnResult.decisionTrace.rejectedCandidateFields).toContain(
      "ending_blocked_dualRuler"
    );
  });

  it("determines endings deterministically by priority and requires protected innocents for dualRuler", () => {
    const stats = {
      ...createInitialSessionState(undercoverDemonKingScenario).stats,
    };
    const flags = {
      ...createInitialSessionState(undercoverDemonKingScenario).flags,
    };

    // Dual ruler setup
    stats.priestRedemption = 80;
    stats.heroTrust = 75;
    stats.mageEvidence = 30;
    flags.proposedPeace = true;
    flags.savedDemonSoldier = true; // protected innocents

    const endingKey = determineEnding(stats, flags);
    expect(endingKey).toBe("dualRuler");
  });
});
