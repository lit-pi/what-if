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

export type ScenarioCatalogItem = {
  id: string;
  title: string;
  subtitle: string;
  coverImage?: string;
  difficulty: string;
  tags: string[];
  focusCharacters: string[];
  description: string;
  isAvailable: boolean;
};

export const scenariosCatalog: ScenarioCatalogItem[] = [
  {
    id: "undercover-demon-king",
    title: "假如我是勇者队伍里的卧底魔王",
    subtitle: "双重身份下的硬核生存与推演",
    coverImage: "/assets/scenes/gate.jpg",
    difficulty: "★★★★☆",
    tags: ["JRPG暗黑", "卧底生存", "高反演", "多结局"],
    focusCharacters: ["莱昂 (勇者)", "伊薇特 (魔法师)", "米拉 (圣职者)", "洛克 (游侠)"],
    description:
      "你隐匿魔王尊容，化名阿斯兰混入讨伐你自己的勇者队伍。面对大门阵灵暴露、废墟求救小兵、地牢绝密档案等突发危机，你能否隐瞒身份，抑或重塑天下大局？",
    isAvailable: true,
  },
  {
    id: "cultivation-traitor-elder",
    title: "假如我是修仙宗门里的叛徒长老",
    subtitle: "仙道长生与宗门绝密大决选",
    coverImage: "/assets/scenes/act3_library.jpg",
    difficulty: "★★★★★",
    tags: ["国风修仙", "卧底谋略", "宗门风云"],
    focusCharacters: ["宗主", "掌门大弟子", "执法人"],
    description:
      "受暗黑魔阁之命渗透正道第一宗门，渡劫关键时刻，你将如何抉择？(剧本即将上线)",
    isAvailable: false,
  },
];

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
