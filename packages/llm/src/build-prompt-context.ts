import { PromptContext, SessionState } from "@lit-pi/what-if-contracts";
import { ScenarioConfig } from "@lit-pi/what-if-scenarios";

export function buildPromptContext(
  scenario: ScenarioConfig,
  sessionState: SessionState,
  playerActionText: string
): PromptContext {
  const scene = scenario.scenes[sessionState.currentSceneId];
  if (!scene) {
    throw new Error(`Scene '${sessionState.currentSceneId}' not found.`);
  }

  return {
    scenarioId: scenario.id,
    sceneId: scene.id,
    sceneTitle: scene.title,
    mishapDescription: scene.mishap,
    focusCharacters: scene.focusCharacters,
    playerActionText,
    stats: sessionState.stats,
    flags: sessionState.flags,
  };
}
