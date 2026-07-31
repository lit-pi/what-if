import { EndingKey, FlagsMap, StatsMap } from "@lit-pi/what-if-contracts";
import { validateEndingCandidate } from "./validate-ending-candidate.js";

export function determineEnding(
  stats: StatsMap,
  flags: FlagsMap,
  forcedEndingKey?: EndingKey | null
): EndingKey | null {
  if (forcedEndingKey) {
    const validated = validateEndingCandidate(forcedEndingKey, stats, flags);
    return validated.effectiveEndingKey;
  }

  const exposureRisk = stats.exposureRisk ?? 0;
  const heroTrust = stats.heroTrust ?? 0;
  const mageEvidence = stats.mageEvidence ?? 0;
  const priestRedemption = stats.priestRedemption ?? 0;
  const thiefLeverage = stats.thiefLeverage ?? 0;
  const castleIntegrity = stats.castleIntegrity ?? 0;
  const butterflyDeviation = stats.butterflyDeviation ?? 0;
  const sacrificedInnocentsCount = (flags.sacrificedInnocentsCount as number) || 0;
  const resolvedMajorCrisisCount = (flags.resolvedMajorCrisisCount as number) || 0;
  const protectedInnocentsCount = (flags.protectedInnocentsCount as number) || 0;
  const protectedInnocents =
    protectedInnocentsCount >= 1 ||
    Boolean(flags.savedDemonSoldier) ||
    Boolean(flags.freedDungeonCaptive);

  let candidate: EndingKey | null = null;

  // 1. Exposure failure
  if (exposureRisk >= 75 && !flags.proposedPeace) {
    candidate = "exposed";
  }
  // 2. Castle destruction
  else if (castleIntegrity <= 0 && !flags.proposedPeace) {
    candidate = "castleLost";
  }
  // 3. Dual Ruler
  else if (
    (flags.proposedPeace || flags.peacePivoted) &&
    priestRedemption >= 75 &&
    heroTrust >= 55 &&
    mageEvidence < 65 &&
    sacrificedInnocentsCount === 0 &&
    protectedInnocents
  ) {
    candidate = "dualRuler";
  }
  // 4. Redeemed Paladin
  else if (
    (flags.confessedIdentity || flags.proposedPeace) &&
    priestRedemption >= 80 &&
    heroTrust >= 70 &&
    sacrificedInnocentsCount === 0
  ) {
    candidate = "redeemed";
  }
  // 5. Perfect Spy
  else if (
    exposureRisk < 45 &&
    heroTrust >= 65 &&
    mageEvidence < 50 &&
    thiefLeverage < 70 &&
    castleIntegrity >= 60
  ) {
    candidate = "perfectSpy";
  }
  // 6. Victor Blamed
  else if (
    flags.betrayedVictor &&
    exposureRisk < 60 &&
    thiefLeverage < 70 &&
    heroTrust >= 40
  ) {
    candidate = "victorBlamed";
  }
  // 7. Actor King
  else if (resolvedMajorCrisisCount >= 1 && exposureRisk < 65 && heroTrust >= 50) {
    candidate = "actorKing";
  }
  // 8. Absurd Ascension
  else if (butterflyDeviation >= 100) {
    candidate = "absurdAscension";
  }
  // 9. Fallback
  else {
    candidate = "stalemate";
  }

  const validated = validateEndingCandidate(candidate, stats, flags);
  return validated.effectiveEndingKey;
}
