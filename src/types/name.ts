export type BabyNameGender = "boy" | "girl" | "unisex";

export type BabyName = {
  id: string;
  name: string;
  meaning: string;
  gender: BabyNameGender;
  religion?: string;
  origin?: string;
  language?: string;
  startingLetter?: string;
  rashi?: string;
  nakshatra?: string;
  numerologyNumber?: number;
  isPremium: boolean;
};

export type NameSearchParams = {
  query?: string;
  gender?: BabyNameGender;
  religion?: string;
  startingLetter?: string;
  page?: number;
};
