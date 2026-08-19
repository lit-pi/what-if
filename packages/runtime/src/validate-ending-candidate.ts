import { EndingKey, FlagsMap, StatsMap } from "@lit-pi/what-if-contracts";
import { verifyCharacterRedLines } from "./verify-character-red-lines.js";

export function validateEndingCandidate(
  candidateEndingKey: EndingKey,
  stats: StatsMap,
  flags: FlagsMap
): { allowed: boolean; effectiveEndingKey: EndingKey; blockedReason?: string } {
  const violations = verifyCharacterRedLines(stats, flags);
  const blockingViolations = violations.filter(
    (v) =>
      v.severity === "blocking" &&
      v.blocksEndings.includes(candidateEndingKey)
  );

  if (blockingViolations.length > 0) {
    const reason = blockingViolations.map((v) => v.message).join(" ");
    if ((stats.exposureRisk ?? 0) >= 75) {
      return {
        allowed: false,
        effectiveEndingKey: "exposed",
        blockedReason: reason,
      };
    }
    if ((stats.mageEvidence ?? 0) >= 65) {
      return {
        allowed: false,
        effectiveEndingKey: "instantArrest",
        blockedReason: reason,
      };
    }
    return {
      allowed: false,
      effectiveEndingKey: "stalemate",
      blockedReason: reason,
    };
  }

  return { allowed: true, effectiveEndingKey: candidateEndingKey };
}
