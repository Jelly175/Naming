import {
  getPremiumStatus,
  unlockPremiumName,
  type PremiumStatus,
  type PremiumUnlockResult,
} from "@/repositories/premium-repository";

export async function getUserPremiumStatus(
  userId: bigint,
  babyNameId?: bigint,
): Promise<PremiumStatus> {
  return getPremiumStatus(userId, babyNameId);
}

export async function unlockPremiumNameWithCredits(
  userId: bigint,
  babyNameId: bigint,
): Promise<PremiumUnlockResult> {
  return unlockPremiumName(userId, babyNameId);
}
