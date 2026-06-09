import { Prisma } from "@/generated/prisma/client";
import { PREMIUM_NAME_UNLOCK_COST } from "@/config/premium";
import { getDb } from "@/lib/db/client";
import { findUnlockedBabyNameIdsForNames } from "@/repositories/premium-repository";
import type {
  BabyName,
  BabyNameGender,
  NameSearchParams,
  NameSearchResult,
} from "@/types/name";

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 20;

export type NameSearchContext = {
  viewerUserId?: bigint;
};

const dbGenderByApiGender: Record<BabyNameGender, string> = {
  boy: "BOY",
  girl: "GIRL",
  unisex: "UNISEX",
};

type BabyNameSearchRow = {
  id: string;
  name: string;
  slug: string;
  meaning: string;
  gender: "BOY" | "GIRL" | "UNISEX";
  religion: string | null;
  origin: string | null;
  startingLetter: string;
  numerologyNumber: number | null;
  styleLabel: string | null;
  isPremium: boolean | number;
  nameLength: number;
  pronunciationScore: string | number | null;
  usabilityScore: string | number | null;
  rarityScore: string | number | null;
};

type CountRow = {
  total: bigint | number | string;
};

function toApiGender(gender: BabyNameSearchRow["gender"]): BabyNameGender {
  return gender.toLowerCase() as BabyNameGender;
}

function optionalNumber(value: string | number | null) {
  return value === null ? undefined : Number(value);
}

function mapRowToBabyName(
  row: BabyNameSearchRow,
  unlockedBabyNameIds: Set<string>,
): BabyName {
  const isPremium = Boolean(row.isPremium);
  const isLocked = isPremium && !unlockedBabyNameIds.has(row.id);

  return {
    id: row.id,
    name: isLocked ? "Premium name" : row.name,
    slug: row.slug,
    meaning: isLocked ? "Unlock with credits to view this meaning." : row.meaning,
    gender: toApiGender(row.gender),
    religion: row.religion ?? undefined,
    origin: row.origin ?? undefined,
    startingLetter: row.startingLetter,
    numerologyNumber: row.numerologyNumber ?? undefined,
    styleLabel: row.styleLabel ?? undefined,
    isPremium,
    nameLength: row.nameLength,
    pronunciationScore: optionalNumber(row.pronunciationScore),
    usabilityScore: optionalNumber(row.usabilityScore),
    rarityScore: optionalNumber(row.rarityScore),
    isLocked,
    unlockCost: isLocked ? PREMIUM_NAME_UNLOCK_COST : undefined,
  };
}

function buildWhereConditions(params: NameSearchParams) {
  const conditions: Prisma.Sql[] = [];

  if (params.startingLetter) {
    conditions.push(Prisma.sql`starting_letter = ${params.startingLetter}`);
  }

  if (params.gender) {
    conditions.push(Prisma.sql`gender = ${dbGenderByApiGender[params.gender]}`);
  }

  if (params.numerologyNumber) {
    conditions.push(
      Prisma.sql`numerology_number = ${params.numerologyNumber}`,
    );
  }

  if (params.religion) {
    conditions.push(Prisma.sql`religion = ${params.religion}`);
  }

  if (params.premium === "free") {
    conditions.push(Prisma.sql`is_premium = FALSE`);
  }

  if (params.premium === "premium") {
    conditions.push(Prisma.sql`is_premium = TRUE`);
  }

  if (params.meaning) {
    conditions.push(
      Prisma.sql`MATCH(name, meaning) AGAINST (${params.meaning} IN NATURAL LANGUAGE MODE)`,
    );
  }

  return conditions.length > 0
    ? Prisma.sql`WHERE ${Prisma.join(conditions, " AND ")}`
    : Prisma.empty;
}

function buildOrderBy(params: NameSearchParams) {
  if (params.meaning) {
    return Prisma.sql`
      ORDER BY
        MATCH(name, meaning) AGAINST (${params.meaning} IN NATURAL LANGUAGE MODE) DESC,
        usability_score DESC,
        rarity_score DESC,
        name ASC
    `;
  }

  return Prisma.sql`
    ORDER BY
      search_count DESC,
      usability_score DESC,
      rarity_score DESC,
      name ASC
  `;
}

export async function findNames(
  params: NameSearchParams,
  context?: NameSearchContext,
): Promise<NameSearchResult> {
  const page = params.page ?? DEFAULT_PAGE;
  const pageSize = params.pageSize ?? DEFAULT_PAGE_SIZE;
  const limit = pageSize + 1;
  const offset = (page - 1) * pageSize;
  const whereSql = buildWhereConditions(params);
  const orderBySql = buildOrderBy(params);
  const db = getDb();

  const [rawRows, countRows] = await Promise.all([
    db.$queryRaw<BabyNameSearchRow[]>`
      SELECT
        CAST(id AS CHAR) AS id,
        name,
        slug,
        meaning,
        gender,
        religion,
        origin,
        starting_letter AS startingLetter,
        numerology_number AS numerologyNumber,
        style_label AS styleLabel,
        is_premium AS isPremium,
        name_length AS nameLength,
        pronunciation_score AS pronunciationScore,
        usability_score AS usabilityScore,
        rarity_score AS rarityScore
      FROM baby_names
      ${whereSql}
      ${orderBySql}
      LIMIT ${limit}
      OFFSET ${offset}
    `,
    params.includeTotal
      ? db.$queryRaw<CountRow[]>`
          SELECT COUNT(*) AS total
          FROM baby_names
          ${whereSql}
        `
      : Promise.resolve([]),
  ]);

  const hasNextPage = rawRows.length > pageSize;
  const rows = rawRows.slice(0, pageSize);
  const unlockedBabyNameIds = context?.viewerUserId
    ? await findUnlockedBabyNameIdsForNames(
        context.viewerUserId,
        rows.filter((row) => Boolean(row.isPremium)).map((row) => row.id),
      )
    : new Set<string>();
  const total = params.includeTotal ? Number(countRows[0]?.total ?? 0) : null;
  const totalPages =
    total === null ? null : total === 0 ? 0 : Math.ceil(total / pageSize);

  return {
    items: rows.map((row) => mapRowToBabyName(row, unlockedBabyNameIds)),
    pagination: {
      page,
      pageSize,
      total,
      totalPages,
      hasNextPage,
      hasPreviousPage: page > 1,
    },
    filters: {
      startingLetter: params.startingLetter,
      gender: params.gender,
      numerologyNumber: params.numerologyNumber,
      religion: params.religion,
      premium: params.premium ?? "all",
      meaning: params.meaning,
      includeTotal: params.includeTotal,
      page,
      pageSize,
    },
  };
}
