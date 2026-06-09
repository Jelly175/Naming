export type BabyNameGender = "boy" | "girl" | "unisex";
export type PremiumFilter = "all" | "free" | "premium";

export type BabyName = {
  id: string;
  name: string;
  slug: string;
  meaning: string;
  gender: BabyNameGender;
  religion?: string;
  origin?: string;
  startingLetter?: string;
  numerologyNumber?: number;
  styleLabel?: string;
  isPremium: boolean;
  nameLength?: number;
  pronunciationScore?: number;
  usabilityScore?: number;
  rarityScore?: number;
  isLocked?: boolean;
  unlockCost?: number;
};

export type NameSearchParams = {
  meaning?: string;
  gender?: BabyNameGender;
  religion?: string;
  startingLetter?: string;
  numerologyNumber?: number;
  premium?: PremiumFilter;
  page?: number;
  pageSize?: number;
  includeTotal?: boolean;
};

export type NameSearchPagination = {
  page: number;
  pageSize: number;
  total: number | null;
  totalPages: number | null;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

export type NameSearchResult = {
  items: BabyName[];
  pagination: NameSearchPagination;
  filters: Required<Pick<NameSearchParams, "page" | "pageSize" | "premium">> &
    Omit<NameSearchParams, "page" | "pageSize" | "premium">;
};
