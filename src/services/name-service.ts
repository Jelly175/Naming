import { findNames, type NameSearchContext } from "@/repositories/name-repository";
import type { NameSearchParams, NameSearchResult } from "@/types/name";

export async function searchNames(
  params: NameSearchParams,
  context?: NameSearchContext,
): Promise<NameSearchResult> {
  return findNames(params, context);
}
