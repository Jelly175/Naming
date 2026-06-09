import { z } from "zod";

import type { NameSearchParams } from "@/types/name";

const MAX_PAGE_SIZE = 30;
const DEFAULT_PAGE_SIZE = 20;

function emptyToUndefined(value: unknown) {
  return typeof value === "string" && value.trim() === ""
    ? undefined
    : value;
}

const optionalTrimmedString = z.preprocess(
  emptyToUndefined,
  z.string().trim().min(1).max(120).optional(),
);

const optionalInteger = (min: number, max: number) =>
  z.preprocess(
    emptyToUndefined,
    z.coerce.number().int().min(min).max(max).optional(),
  );

const optionalBoolean = z.preprocess(
  emptyToUndefined,
  z
    .enum(["true", "false"])
    .transform((value) => value === "true")
    .default(false),
);

export const nameSearchQuerySchema = z.object({
  startingLetter: z.preprocess(
    emptyToUndefined,
    z
      .string()
      .trim()
      .length(1)
      .transform((value) => value.toUpperCase())
      .optional(),
  ),
  letter: z.preprocess(
    emptyToUndefined,
    z
      .string()
      .trim()
      .length(1)
      .transform((value) => value.toUpperCase())
      .optional(),
  ),
  gender: z.preprocess(
    emptyToUndefined,
    z.enum(["boy", "girl", "unisex"]).optional(),
  ),
  numerology: optionalInteger(1, 9),
  numerologyNumber: optionalInteger(1, 9),
  religion: optionalTrimmedString,
  premium: z.preprocess(
    emptyToUndefined,
    z.enum(["all", "free", "premium"]).default("all"),
  ),
  meaning: optionalTrimmedString,
  page: z.preprocess(
    emptyToUndefined,
    z.coerce.number().int().min(1).default(1),
  ),
  pageSize: z.preprocess(
    emptyToUndefined,
    z.coerce.number().int().min(1).max(MAX_PAGE_SIZE).default(DEFAULT_PAGE_SIZE),
  ),
  includeTotal: optionalBoolean,
});

export function parseNameSearchParams(
  searchParams: URLSearchParams,
): NameSearchParams {
  const parsed = nameSearchQuerySchema.parse(
    Object.fromEntries(searchParams.entries()),
  );

  return {
    startingLetter: parsed.startingLetter ?? parsed.letter,
    gender: parsed.gender,
    numerologyNumber: parsed.numerologyNumber ?? parsed.numerology,
    religion: parsed.religion,
    premium: parsed.premium,
    meaning: parsed.meaning,
    page: parsed.page,
    pageSize: parsed.pageSize,
    includeTotal: parsed.includeTotal,
  };
}
