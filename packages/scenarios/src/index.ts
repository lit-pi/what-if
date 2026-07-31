import {
  undercoverDemonKingScenario,
  ScenarioConfig,
} from "./undercover-demon-king/scenario.js";

export * from "./undercover-demon-king/stats.js";
export * from "./undercover-demon-king/flags.js";
export * from "./undercover-demon-king/characters.js";
export * from "./undercover-demon-king/scenes.js";
export * from "./undercover-demon-king/endings.js";
export * from "./undercover-demon-king/preset-actions.js";
export * from "./undercover-demon-king/scenario.js";

export const scenariosRegistry: Record<string, ScenarioConfig> = {
  "undercover-demon-king": undercoverDemonKingScenario,
};

export function getScenarioConfig(scenarioId: string): ScenarioConfig {
  const scenario = scenariosRegistry[scenarioId];
  if (!scenario) {
    throw new Error(`Scenario '${scenarioId}' not found in registry.`);
  }
  return scenario;
}
