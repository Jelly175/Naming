import { findNames } from "@/repositories/name-repository";
import type { BabyName, NameSearchParams } from "@/types/name";

export async function searchNames(
  params: NameSearchParams,
): Promise<BabyName[]> {
  return findNames(params);
}
