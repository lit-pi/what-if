import { describe, expect, it } from "vitest";
import {
  undercoverDemonKingScenario,
  getScenarioConfig,
} from "../src/index.js";

describe("Scenario Configuration Integrity", () => {
  it("loads undercover-demon-king scenario config", () => {
    const scenario = getScenarioConfig("undercover-demon-king");
    expect(scenario.title).toBe("假如我是勇者队伍里的卧底魔王");
    expect(scenario.initialSceneId).toBe("gate");
  });

  it("verifies all preset action nextSceneIds exist in scenesConfig or are empty/ending", () => {
    const { presetActions, scenes } = undercoverDemonKingScenario;
    for (const [id, action] of Object.entries(presetActions)) {
      if (action.nextSceneId) {
        expect(scenes[action.nextSceneId]).toBeDefined();
      }
    }
  });

  it("verifies all preset action endingKeys exist in endingsConfig", () => {
    const { presetActions, endings } = undercoverDemonKingScenario;
    for (const [id, action] of Object.entries(presetActions)) {
      if (action.endingKey) {
        expect(endings[action.endingKey]).toBeDefined();
      }
    }
  });

  it("verifies scene graph legalNextSceneIds exist", () => {
    const { scenes } = undercoverDemonKingScenario;
    for (const [sceneId, scene] of Object.entries(scenes)) {
      for (const nextId of scene.legalNextSceneIds) {
        expect(scenes[nextId]).toBeDefined();
      }
    }
  });
});
