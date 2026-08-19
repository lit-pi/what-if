import { StatKey } from "@lit-pi/what-if-contracts";

export type StatConfig = {
  key: StatKey;
  label: string;
  initialValue: number;
  min: number;
  max: number;
  playerVisible: boolean;
  description: string;
};

export const statsConfig: Record<StatKey, StatConfig> = {
  exposureRisk: {
    key: "exposureRisk",
    label: "暴露风险",
    initialValue: 25,
    min: 0,
    max: 100,
    playerVisible: true,
    description: "队伍对你伪装身份的怀疑程度，>=75 可触发硬失败",
  },
  heroTrust: {
    key: "heroTrust",
    label: "勇者信任",
    initialValue: 72,
    min: 0,
    max: 100,
    playerVisible: true,
    description: "勇者莱昂对你的兄弟情谊与正义认同",
  },
  mageEvidence: {
    key: "mageEvidence",
    label: "法师证据",
    initialValue: 34,
    min: 0,
    max: 100,
    playerVisible: true,
    description: "伊薇特收集到的魔力特征与身份证据，>=65 触发即时逮捕",
  },
  priestRedemption: {
    key: "priestRedemption",
    label: "牧师救赎",
    initialValue: 58,
    min: 0,
    max: 100,
    playerVisible: true,
    description: "米拉对你悲悯品质的感知与和平调停意愿",
  },
  thiefLeverage: {
    key: "thiefLeverage",
    label: "盗贼把柄",
    initialValue: 10,
    min: 0,
    max: 100,
    playerVisible: true,
    description: "洛克掌握的私房钱与可勒索筹码",
  },
  castleIntegrity: {
    key: "castleIntegrity",
    label: "魔王城防",
    initialValue: 85,
    min: 0,
    max: 100,
    playerVisible: true,
    description: "魔王城核心阵法与防线的完整度，<=0 城毁",
  },
  victorMisread: {
    key: "victorMisread",
    label: "维克托误解",
    initialValue: 32,
    min: 0,
    max: 100,
    playerVisible: true,
    description: "副官维克托对你“宏大深远布局”的脑补程度",
  },
  partyProgress: {
    key: "partyProgress",
    label: "推进进度",
    initialValue: 10,
    min: 0,
    max: 100,
    playerVisible: true,
    description: "勇者队伍深入魔王城腹地的进度",
  },
  butterflyDeviation: {
    key: "butterflyDeviation",
    label: "蝴蝶偏离",
    initialValue: 0,
    min: 0,
    max: 100,
    playerVisible: true,
    description: "荒诞经营与偏离严肃主线的偏离度",
  },
};
