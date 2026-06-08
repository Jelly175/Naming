import type { BabyName, NameSearchParams } from "@/types/name";

export async function searchNames(
  _params: NameSearchParams,
): Promise<BabyName[]> {
  // Database-backed search will be implemented through repositories later.
  return [];
}
