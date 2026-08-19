import {
  ActionCategory,
  CharacterId,
  EndingKey,
  SceneId,
} from "@lit-pi/what-if-contracts";

export type SceneConfig = {
  id: SceneId;
  act: number;
  title: string;
  mishap: string;
  focusCharacters: CharacterId[];
  allowedCategories: ActionCategory[];
  forbiddenCategories: ActionCategory[];
  legalNextSceneIds: SceneId[];
  allowedEndingKeys: EndingKey[];
};

export const scenesConfig: Record<SceneId, SceneConfig> = {
  gate: {
    id: "gate",
    act: 1,
    title: "第一幕：魔王城正面大门",
    mishap: "阵灵识别阿斯兰身份并高喊魔王陛下。",
    focusCharacters: ["ivette", "leon", "victor"],
    allowedCategories: ["deceive", "sacrifice", "commandVictor", "absurd", "generic"],
    forbiddenCategories: ["confess"],
    legalNextSceneIds: ["act2_ruins", "act2_dungeon"],
    allowedEndingKeys: ["gate_exposure_ending", "instantExecution", "instantArrest", "exposed"],
  },
  act2_ruins: {
    id: "act2_ruins",
    act: 2,
    title: "第二幕A：前庭坍塌废墟",
    mishap: "重伤魔族小兵认出阿斯兰并求救。",
    focusCharacters: ["mira", "leon", "victor"],
    allowedCategories: ["protect", "deceive", "commandVictor", "sacrifice", "generic"],
    forbiddenCategories: ["confess"],
    legalNextSceneIds: ["act3_library"],
    allowedEndingKeys: ["ruins_arrest_ending", "instantExecution", "instantArrest", "exposed"],
  },
  act2_dungeon: {
    id: "act2_dungeon",
    act: 2,
    title: "第二幕B：地下暗黑地牢",
    mishap: "伊薇特发现修道院名册没有阿斯兰记录。",
    focusCharacters: ["ivette", "mira", "locke"],
    allowedCategories: ["protect", "bribe", "deceive", "sacrifice", "generic"],
    forbiddenCategories: ["confess"],
    legalNextSceneIds: ["act3_treasury"],
    allowedEndingKeys: ["dungeon_rupture_ending", "instantExecution", "instantArrest", "exposed"],
  },
  act3_library: {
    id: "act3_library",
    act: 3,
    title: "第三幕A：禁忌图书馆/符文密室",
    mishap: "魔王真名符文与阿斯兰剑痕一致。",
    focusCharacters: ["ivette", "locke", "leon"],
    allowedCategories: ["deceive", "sacrifice", "protect", "generic"],
    forbiddenCategories: ["confess"],
    legalNextSceneIds: ["act4_corridor"],
    allowedEndingKeys: ["library_seal_ending", "instantExecution", "instantArrest", "exposed"],
  },
  act3_treasury: {
    id: "act3_treasury",
    act: 3,
    title: "第三幕B：偏殿深处地下宝库",
    mishap: "洛克撬开魔王私房钱宝库。",
    focusCharacters: ["locke", "leon"],
    allowedCategories: ["bribe", "protect", "deceive", "absurd", "generic"],
    forbiddenCategories: ["confess"],
    legalNextSceneIds: ["act4_corridor"],
    allowedEndingKeys: ["treasury_confess_ending", "instantExecution", "instantArrest", "exposed"],
  },
  act4_corridor: {
    id: "act4_corridor",
    act: 4,
    title: "第四幕：近卫军决死长廊",
    mishap: "维克托带近卫军启动自爆阵。",
    focusCharacters: ["victor", "leon", "mira"],
    allowedCategories: ["commandVictor", "protect", "deceive", "sacrifice", "peace", "generic"],
    forbiddenCategories: [],
    legalNextSceneIds: ["act5_throne"],
    allowedEndingKeys: ["corridor_betrayal_ending", "instantExecution", "instantArrest", "exposed"],
  },
  act5_throne: {
    id: "act5_throne",
    act: 5,
    title: "第五幕：魔王空王座厅",
    mishap: "王座厅雕像与阿斯兰真容一致。",
    focusCharacters: ["leon", "ivette", "mira", "locke", "victor"],
    allowedCategories: ["peace", "confess", "deceive", "bribe", "absurd", "generic"],
    forbiddenCategories: [],
    legalNextSceneIds: [],
    allowedEndingKeys: [
      "dualRuler",
      "redeemed",
      "perfectSpy",
      "victorBlamed",
      "actorKing",
      "absurdAscension",
      "stalemate",
      "exposed",
      "castleLost",
      "instantExecution",
      "instantArrest",
    ],
  },
};
