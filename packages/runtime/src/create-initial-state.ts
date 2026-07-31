import { SessionState, StatKey, FlagKey } from "@lit-pi/what-if-contracts";
import { ScenarioConfig } from "@lit-pi/what-if-scenarios";

export function createInitialSessionState(
  scenario: ScenarioConfig,
  sessionId: string = `ses_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`
): SessionState {
  const stats = {} as Record<StatKey, number>;
  for (const [key, config] of Object.entries(scenario.stats)) {
    stats[key as StatKey] = config.initialValue;
  }

  const flags = {} as Record<FlagKey, boolean | number>;
  for (const [key, config] of Object.entries(scenario.flags)) {
    flags[key as FlagKey] = config.defaultValue;
  }

  const now = Date.now();

  return {
    sessionId,
    scenarioId: scenario.id,
    scenarioVersion: scenario.version,
    currentSceneId: scenario.initialSceneId,
    stats,
    flags,
    status: "active",
    createdAt: now,
    updatedAt: now,
  };
}
