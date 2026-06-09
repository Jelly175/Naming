import { findNames } from "@/repositories/name-repository";
import type { NameSearchParams, NameSearchResult } from "@/types/name";

export async function searchNames(
  params: NameSearchParams,
): Promise<NameSearchResult> {
  return findNames(params);
}
