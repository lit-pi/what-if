import { statsConfig } from "./stats.js";
import { flagsConfig } from "./flags.js";
import { charactersConfig } from "./characters.js";
import { scenesConfig } from "./scenes.js";
import { endingsConfig } from "./endings.js";
import { presetActionsConfig } from "./preset-actions.js";

export const undercoverDemonKingScenario = {
  id: "undercover-demon-king",
  version: "1.0.0",
  title: "假如我是勇者队伍里的卧底魔王",
  initialSceneId: "gate" as const,
  stats: statsConfig,
  flags: flagsConfig,
  characters: charactersConfig,
  scenes: scenesConfig,
  endings: endingsConfig,
  presetActions: presetActionsConfig,
};

export type ScenarioConfig = typeof undercoverDemonKingScenario;
