import { Prisma } from "@/generated/prisma/client";
import { PREMIUM_NAME_UNLOCK_COST } from "@/config/premium";
import { getDb } from "@/lib/db/client";

type UserCreditRow = {
  id: string;
  creditsBalance: number;
};

type BabyNameAccessRow = {
  id: string;
  name: string;
  isPremium: boolean | number;
};

type PremiumUnlockRow = {
  id: string;
};

type LastInsertIdRow = {
  id: bigint | number | string;
};

export class PremiumUnlockError extends Error {
  constructor(
    public readonly code:
      | "USER_NOT_FOUND"
      | "NAME_NOT_FOUND"
      | "NAME_IS_FREE"
      | "INSUFFICIENT_CREDITS",
    message: string,
  ) {
    super(message);
    this.name = "PremiumUnlockError";
  }
}

export type PremiumStatus = {
  userId: string;
  creditsBalance: number;
  unlockCost: number;
  babyName?: {
    id: string;
    name: string;
    isPremium: boolean;
  };
  isUnlocked: boolean;
  canUnlock: boolean;
};

export type PremiumUnlockResult = PremiumStatus & {
  unlockCreated: boolean;
  creditsDeducted: number;
};

export async function getPremiumStatus(
  userId: bigint,
  babyNameId?: bigint,
): Promise<PremiumStatus> {
  const user = await findUserCredits(userId);

  if (!user) {
    throw new PremiumUnlockError("USER_NOT_FOUND", "User was not found.");
  }

  const babyName = babyNameId
    ? await findBabyNameForAccess(babyNameId)
    : undefined;

  if (babyNameId && !babyName) {
    throw new PremiumUnlockError("NAME_NOT_FOUND", "Baby name was not found.");
  }

  const isUnlocked = babyNameId
    ? await hasActivePremiumUnlock(userId, babyNameId)
    : false;

  return {
    userId: user.id,
    creditsBalance: user.creditsBalance,
    unlockCost: PREMIUM_NAME_UNLOCK_COST,
    babyName: babyName
      ? {
          id: babyName.id,
          name: babyName.name,
          isPremium: Boolean(babyName.isPremium),
        }
      : undefined,
    isUnlocked,
    canUnlock:
      Boolean(babyName?.isPremium) &&
      !isUnlocked &&
      user.creditsBalance >= PREMIUM_NAME_UNLOCK_COST,
  };
}

export async function unlockPremiumName(
  userId: bigint,
  babyNameId: bigint,
): Promise<PremiumUnlockResult> {
  const db = getDb();

  return db.$transaction(async (tx) => {
    const users = await tx.$queryRaw<UserCreditRow[]>`
      SELECT
        CAST(id AS CHAR) AS id,
        credits_balance AS creditsBalance
      FROM users
      WHERE id = ${userId}
      FOR UPDATE
    `;
    const user = users[0];

    if (!user) {
      throw new PremiumUnlockError("USER_NOT_FOUND", "User was not found.");
    }

    const babyNames = await tx.$queryRaw<BabyNameAccessRow[]>`
      SELECT
        CAST(id AS CHAR) AS id,
        name,
        is_premium AS isPremium
      FROM baby_names
      WHERE id = ${babyNameId}
    `;
    const babyName = babyNames[0];

    if (!babyName) {
      throw new PremiumUnlockError("NAME_NOT_FOUND", "Baby name was not found.");
    }

    if (!Boolean(babyName.isPremium)) {
      throw new PremiumUnlockError(
        "NAME_IS_FREE",
        "This name is already free to view.",
      );
    }

    const existingUnlocks = await tx.$queryRaw<PremiumUnlockRow[]>`
      SELECT CAST(id AS CHAR) AS id
      FROM premium_unlocks
      WHERE user_id = ${userId}
        AND baby_name_id = ${babyNameId}
        AND is_active = TRUE
        AND (expires_at IS NULL OR expires_at > CURRENT_TIMESTAMP)
      LIMIT 1
      FOR UPDATE
    `;

    if (existingUnlocks[0]) {
      return {
        userId: user.id,
        creditsBalance: user.creditsBalance,
        unlockCost: PREMIUM_NAME_UNLOCK_COST,
        babyName: {
          id: babyName.id,
          name: babyName.name,
          isPremium: true,
        },
        isUnlocked: true,
        canUnlock: false,
        unlockCreated: false,
        creditsDeducted: 0,
      };
    }

    if (user.creditsBalance < PREMIUM_NAME_UNLOCK_COST) {
      throw new PremiumUnlockError(
        "INSUFFICIENT_CREDITS",
        "Not enough credits to unlock this premium name.",
      );
    }

    const nextBalance = user.creditsBalance - PREMIUM_NAME_UNLOCK_COST;

    await tx.$executeRaw`
      UPDATE users
      SET credits_balance = ${nextBalance}
      WHERE id = ${userId}
    `;

    await tx.$executeRaw`
      INSERT INTO premium_unlocks (
        user_id,
        baby_name_id,
        unlock_type,
        is_active
      ) VALUES (
        ${userId},
        ${babyNameId},
        'SINGLE_NAME',
        TRUE
      )
    `;

    const unlockIds = await tx.$queryRaw<LastInsertIdRow[]>`
      SELECT LAST_INSERT_ID() AS id
    `;
    const premiumUnlockId = BigInt(unlockIds[0]?.id ?? 0);

    await tx.$executeRaw`
      INSERT INTO credit_transactions (
        user_id,
        premium_unlock_id,
        transaction_type,
        credits_delta,
        balance_after,
        reason
      ) VALUES (
        ${userId},
        ${premiumUnlockId},
        'UNLOCK',
        ${-PREMIUM_NAME_UNLOCK_COST},
        ${nextBalance},
        ${`Unlocked premium name: ${babyName.name}`}
      )
    `;

    return {
      userId: user.id,
      creditsBalance: nextBalance,
      unlockCost: PREMIUM_NAME_UNLOCK_COST,
      babyName: {
        id: babyName.id,
        name: babyName.name,
        isPremium: true,
      },
      isUnlocked: true,
      canUnlock: false,
      unlockCreated: true,
      creditsDeducted: PREMIUM_NAME_UNLOCK_COST,
    };
  });
}

export async function findUnlockedBabyNameIds(userId: bigint) {
  const db = getDb();
  const rows = await db.$queryRaw<Array<{ babyNameId: string }>>`
    SELECT CAST(baby_name_id AS CHAR) AS babyNameId
    FROM premium_unlocks
    WHERE user_id = ${userId}
      AND baby_name_id IS NOT NULL
      AND is_active = TRUE
      AND (expires_at IS NULL OR expires_at > CURRENT_TIMESTAMP)
  `;

  return new Set(rows.map((row) => row.babyNameId));
}

export async function findUnlockedBabyNameIdsForNames(
  userId: bigint,
  babyNameIds: string[],
) {
  if (babyNameIds.length === 0) {
    return new Set<string>();
  }

  const db = getDb();
  const rows = await db.$queryRaw<Array<{ babyNameId: string }>>`
    SELECT CAST(baby_name_id AS CHAR) AS babyNameId
    FROM premium_unlocks
    WHERE user_id = ${userId}
      AND baby_name_id IN (${Prisma.join(
        babyNameIds.map((babyNameId) => BigInt(babyNameId)),
      )})
      AND is_active = TRUE
      AND (expires_at IS NULL OR expires_at > CURRENT_TIMESTAMP)
  `;

  return new Set(rows.map((row) => row.babyNameId));
}

async function findUserCredits(userId: bigint) {
  const db = getDb();
  const rows = await db.$queryRaw<UserCreditRow[]>`
    SELECT
      CAST(id AS CHAR) AS id,
      credits_balance AS creditsBalance
    FROM users
    WHERE id = ${userId}
    LIMIT 1
  `;

  return rows[0];
}

async function findBabyNameForAccess(babyNameId: bigint) {
  const db = getDb();
  const rows = await db.$queryRaw<BabyNameAccessRow[]>`
    SELECT
      CAST(id AS CHAR) AS id,
      name,
      is_premium AS isPremium
    FROM baby_names
    WHERE id = ${babyNameId}
    LIMIT 1
  `;

  return rows[0];
}

async function hasActivePremiumUnlock(userId: bigint, babyNameId: bigint) {
  const db = getDb();
  const rows = await db.$queryRaw<PremiumUnlockRow[]>`
    SELECT CAST(id AS CHAR) AS id
    FROM premium_unlocks
    WHERE user_id = ${userId}
      AND baby_name_id = ${babyNameId}
      AND is_active = TRUE
      AND (expires_at IS NULL OR expires_at > CURRENT_TIMESTAMP)
    LIMIT 1
  `;

  return Boolean(rows[0]);
}
