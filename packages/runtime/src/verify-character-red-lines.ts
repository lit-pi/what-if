import {
  EndingKey,
  FlagsMap,
  RedLineViolation,
  StatsMap,
} from "@lit-pi/what-if-contracts";

export function verifyCharacterRedLines(
  stats: StatsMap,
  flags: FlagsMap
): RedLineViolation[] {
  const violations: RedLineViolation[] = [];

  // Leon Red Line / Ending Blocks
  const heroTrust = stats.heroTrust ?? 0;
  if (heroTrust < 40) {
    violations.push({
      characterId: "leon",
      ruleId: "leon_trust_bottom_line",
      severity: "blocking",
      message: "勇者信任过低 (<40)，莱昂绝不会在此时接受你的谎言、同盟或圣骑士转正。",
      blocksEndings: ["dualRuler", "redeemed", "perfectSpy"],
    });
  }

  // Ivette Red Line / Ending Blocks
  const mageEvidence = stats.mageEvidence ?? 0;
  if (mageEvidence >= 65) {
    violations.push({
      characterId: "ivette",
      ruleId: "ivette_evidence_arrest",
      severity: "blocking",
      message: "法师证据已形成完整铁证 (>=65)，伊薇特当场联合全员发起逮捕。",
      blocksEndings: ["dualRuler", "redeemed", "perfectSpy", "victorBlamed", "actorKing"],
    });
  } else if (mageEvidence >= 60) {
    violations.push({
      characterId: "ivette",
      ruleId: "ivette_evidence_high",
      severity: "warning",
      message: "法师证据过多，伊薇特怀疑重重，阻断完美卧底路线。",
      blocksEndings: ["perfectSpy"],
    });
  }

  // Mira Red Line / Ending Blocks
  const sacrificedCount = (flags.sacrificedInnocentsCount as number) || 0;
  if (sacrificedCount > 0) {
    violations.push({
      characterId: "mira",
      ruleId: "mira_innocent_blood",
      severity: "blocking",
      message: "曾牺牲无辜者或残害俘虏，米拉无法给予纯净救赎。",
      blocksEndings: ["redeemed"],
    });
  }

  // Locke Red Line / Ending Blocks
  const thiefLeverage = stats.thiefLeverage ?? 0;
  if (thiefLeverage >= 70 && !flags.bribedLocke) {
    violations.push({
      characterId: "locke",
      ruleId: "locke_leverage_uncontrolled",
      severity: "blocking",
      message: "盗贼把柄过高 (>=70) 且未被收买，洛克会将秘密二次勒索或公开出售。",
      blocksEndings: ["perfectSpy", "victorBlamed"],
    });
  }

  return violations;
}
