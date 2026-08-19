import { CharacterId } from "@lit-pi/what-if-contracts";

export type CharacterConfig = {
  id: CharacterId;
  displayName: string;
  role: string;
  values: string[];
  fears: string[];
  persuasionLevers: string[];
  pressureThresholds: Record<string, number>;
  redLineDescription: string;
};

export const charactersConfig: Record<CharacterId, CharacterConfig> = {
  narrator: {
    id: "narrator",
    displayName: "旁白",
    role: "世界地下城 GM 视角",
    values: ["客观叙事", "因果呈现"],
    fears: [],
    persuasionLevers: [],
    pressureThresholds: {},
    redLineDescription: "无",
  },
  aslan: {
    id: "aslan",
    displayName: "阿斯兰",
    role: "卧底魔王 / 伪装圣骑士 (玩家)",
    values: ["保住身份", "保住魔王城", "保护同伴关系"],
    fears: ["身份彻底暴露", "魔王城毁于一旦"],
    persuasionLevers: [],
    pressureThresholds: {},
    redLineDescription: "无",
  },
  leon: {
    id: "leon",
    displayName: "莱昂",
    role: "勇者队队长 / 圣骑士",
    values: ["同伴信任", "正义", "保护无辜"],
    fears: ["最信任的大哥一直欺骗自己"],
    persuasionLevers: ["勇敢保护队友", "公开承担风险", "明确承诺不伤害无辜"],
    pressureThresholds: { heroTrustLow: 45, heroTrustCritical: 30 },
    redLineDescription: "当众杀害无辜者或俘虏；低信任下主动承认欺骗；让队伍承担不必要的伤亡",
  },
  ivette: {
    id: "ivette",
    displayName: "伊薇特",
    role: "大魔法师 / 逻辑侦探",
    values: ["可验证证据", "逻辑一致", "魔法规则"],
    fears: ["被漂亮话误导导致队伍被魔王欺骗"],
    persuasionLevers: ["可验证解释", "主动接受测试", "透明承担代价"],
    pressureThresholds: { mageEvidenceHigh: 50, mageEvidenceCritical: 65 },
    redLineDescription: "编造违反魔法史的谎言；连续三次前后矛盾；直接破坏证据",
  },
  mira: {
    id: "mira",
    displayName: "米拉",
    role: "圣职者 / 悲悯良心",
    values: ["生命", "悲悯", "救赎可能"],
    fears: ["队友互相残杀", "玩家彻底滑向残酷"],
    persuasionLevers: ["救人", "治疗", "承担罪责", "提出真正和平方案"],
    pressureThresholds: { priestRedemptionHigh: 75 },
    redLineDescription: "残害无辜者；把和平当作欺骗工具；连续牺牲他人保自己",
  },
  locke: {
    id: "locke",
    displayName: "洛克",
    role: "游侠 / 利益情报商",
    values: ["活着", "赚钱", "掌握筹码"],
    fears: ["跟错边", "秘密不值钱", "被灭口"],
    persuasionLevers: ["金币", "交易", "明确收益", "让他看见生路"],
    pressureThresholds: { thiefLeverageHigh: 40, thiefLeverageCritical: 70 },
    redLineDescription: "威胁灭口但没有压倒性优势；拿走收益又不给替代补偿；极高风险强求无条件保密",
  },
  victor: {
    id: "victor",
    displayName: "维克托",
    role: "魔王城副官 / 忠诚脑补怪",
    values: ["魔王权威", "绝对忠诚", "魔王城存续"],
    fears: ["自己没有领会陛下的大棋"],
    persuasionLevers: ["明确暗号", "戒章", "直接命令", "保全部下"],
    pressureThresholds: { victorMisreadHigh: 55, victorMisreadCritical: 70, victorMisreadExtreme: 80 },
    redLineDescription: "当众强杀维克托；把魔族全部牺牲；否认魔族部下生命价值",
  },
};
