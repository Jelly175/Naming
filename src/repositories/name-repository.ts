import type { BabyName, NameSearchParams } from "@/types/name";

export async function findNames(
  params: NameSearchParams,
): Promise<BabyName[]> {
  void params;
  // Replace this with Prisma/MySQL queries once the schema is added.
  return [];
}
