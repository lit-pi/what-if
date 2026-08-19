import { FlagKey } from "@lit-pi/what-if-contracts";

export type FlagConfig = {
  key: FlagKey;
  type: "boolean" | "counter";
  defaultValue: boolean | number;
  description: string;
};

export const flagsConfig: Record<FlagKey, FlagConfig> = {
  savedDemonSoldier: {
    key: "savedDemonSoldier",
    type: "boolean",
    defaultValue: false,
    description: "暗中解救了废墟中的魔族伤兵",
  },
  betrayedVictor: {
    key: "betrayedVictor",
    type: "boolean",
    defaultValue: false,
    description: "将危机甩锅给副官维克托",
  },
  bribedLocke: {
    key: "bribedLocke",
    type: "boolean",
    defaultValue: false,
    description: "用金币或私房钱收买了盗贼洛克",
  },
  acceptedPurification: {
    key: "acceptedPurification",
    type: "boolean",
    defaultValue: false,
    description: "接受了米拉的圣光洗礼",
  },
  confessedIdentity: {
    key: "confessedIdentity",
    type: "boolean",
    defaultValue: false,
    description: "主动坦白了卧底魔王身份",
  },
  proposedPeace: {
    key: "proposedPeace",
    type: "boolean",
    defaultValue: false,
    description: "提出了两族和平共处方案",
  },
  peacePivoted: {
    key: "peacePivoted",
    type: "boolean",
    defaultValue: false,
    description: "成功将冲突转向和平谈判",
  },
  commandVictorSuccess: {
    key: "commandVictorSuccess",
    type: "boolean",
    defaultValue: false,
    description: "使用魔王密语成功传令维克托",
  },
  raidedArmory: {
    key: "raidedArmory",
    type: "boolean",
    defaultValue: false,
    description: "洗劫了近卫军武器库",
  },
  foundForbiddenScroll: {
    key: "foundForbiddenScroll",
    type: "boolean",
    defaultValue: false,
    description: "获得了禁忌图书馆的封印卷轴",
  },
  subduedBloodArray: {
    key: "subduedBloodArray",
    type: "boolean",
    defaultValue: false,
    description: "平息了决死长廊的自爆大阵",
  },
  freedDungeonCaptive: {
    key: "freedDungeonCaptive",
    type: "boolean",
    defaultValue: false,
    description: "释放了地牢中的被囚军官",
  },
  protectedInnocentsCount: {
    key: "protectedInnocentsCount",
    type: "counter",
    defaultValue: 0,
    description: "保护弱者/伤员的次数",
  },
  sacrificedInnocentsCount: {
    key: "sacrificedInnocentsCount",
    type: "counter",
    defaultValue: 0,
    description: "牺牲无辜者/灭口的次数",
  },
  contradictionCount: {
    key: "contradictionCount",
    type: "counter",
    defaultValue: 0,
    description: "编造谎言中的逻辑矛盾次数",
  },
  majorLieCount: {
    key: "majorLieCount",
    type: "counter",
    defaultValue: 0,
    description: "重大欺骗的次数",
  },
  resolvedMajorCrisisCount: {
    key: "resolvedMajorCrisisCount",
    type: "counter",
    defaultValue: 0,
    description: "成功化解重大危机的次数",
  },
  miraBufferedCrisis: {
    key: "miraBufferedCrisis",
    type: "boolean",
    defaultValue: false,
    description: "米拉为你缓冲了一次致命危机",
  },
};
