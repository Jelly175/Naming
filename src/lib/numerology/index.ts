export type NumerologySystem = "chaldean";

export type NumerologyLetter = {
  letter: string;
  value: number;
};

export type NumerologyNamePart = {
  raw: string;
  normalized: string;
  compoundNumber: number;
  rootNumber: number;
  letters: NumerologyLetter[];
};

export type NameNumerologyResult = {
  rawName: string;
  normalizedName: string;
  system: NumerologySystem;
  compoundNumber: number;
  rootNumber: number;
  parts: NumerologyNamePart[];
};

export type SurnameCompatibilityResult = {
  givenName: NameNumerologyResult;
  surname: NameNumerologyResult;
  fullName: NameNumerologyResult;
  compatibilityScore: number;
  compatibilityLevel: "strong" | "balanced" | "challenging";
  guidance: string;
};

export const CHALDEAN_LETTER_VALUES: Record<string, number> = {
  A: 1,
  I: 1,
  J: 1,
  Q: 1,
  Y: 1,
  B: 2,
  K: 2,
  R: 2,
  C: 3,
  G: 3,
  L: 3,
  S: 3,
  D: 4,
  M: 4,
  T: 4,
  E: 5,
  H: 5,
  N: 5,
  X: 5,
  U: 6,
  V: 6,
  W: 6,
  O: 7,
  Z: 7,
  F: 8,
  P: 8,
};

const FRIENDLY_ROOT_NUMBERS: Record<number, number[]> = {
  1: [1, 2, 3, 5, 9],
  2: [1, 2, 4, 6],
  3: [1, 3, 5, 6, 9],
  4: [2, 4, 7, 8],
  5: [1, 3, 5, 6],
  6: [2, 3, 5, 6, 9],
  7: [4, 7, 9],
  8: [4, 8],
  9: [1, 3, 6, 7, 9],
};

export function normalizeIndianName(name: string) {
  return name
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toUpperCase();
}

export function splitNameParts(name: string) {
  return normalizeIndianName(name)
    .split(" ")
    .filter(Boolean);
}

export function getLetterValue(letter: string) {
  return CHALDEAN_LETTER_VALUES[letter.toUpperCase()] ?? 0;
}

export function reduceToRootNumber(value: number) {
  if (!Number.isFinite(value) || value <= 0) {
    return 0;
  }

  let total = Math.trunc(value);

  while (total > 9) {
    total = String(total)
      .split("")
      .reduce((sum, digit) => sum + Number(digit), 0);
  }

  return total;
}

export function calculateCompoundNumber(name: string) {
  return splitNameParts(name)
    .join("")
    .split("")
    .reduce((sum, letter) => sum + getLetterValue(letter), 0);
}

export function analyzeNamePart(namePart: string): NumerologyNamePart {
  const normalized = normalizeIndianName(namePart).replace(/\s/g, "");
  const letters = normalized.split("").map((letter) => ({
    letter,
    value: getLetterValue(letter),
  }));
  const compoundNumber = letters.reduce((sum, letter) => sum + letter.value, 0);

  return {
    raw: namePart,
    normalized,
    compoundNumber,
    rootNumber: reduceToRootNumber(compoundNumber),
    letters,
  };
}

export function calculateNameNumerology(
  fullName: string,
): NameNumerologyResult {
  const normalizedName = normalizeIndianName(fullName);
  const parts = normalizedName.split(" ").filter(Boolean).map(analyzeNamePart);
  const compoundNumber = parts.reduce(
    (sum, part) => sum + part.compoundNumber,
    0,
  );

  return {
    rawName: fullName,
    normalizedName,
    system: "chaldean",
    compoundNumber,
    rootNumber: reduceToRootNumber(compoundNumber),
    parts,
  };
}

export function calculateSurnameCompatibility(
  givenName: string,
  surname: string,
): SurnameCompatibilityResult {
  const givenNameResult = calculateNameNumerology(givenName);
  const surnameResult = calculateNameNumerology(surname);
  const fullNameResult = calculateNameNumerology(`${givenName} ${surname}`);
  const compatibilityScore = calculateCompatibilityScore(
    givenNameResult.rootNumber,
    surnameResult.rootNumber,
    fullNameResult.rootNumber,
  );
  const compatibilityLevel = getCompatibilityLevel(compatibilityScore);

  return {
    givenName: givenNameResult,
    surname: surnameResult,
    fullName: fullNameResult,
    compatibilityScore,
    compatibilityLevel,
    guidance: getCompatibilityGuidance(compatibilityLevel),
  };
}

export function isRootNumberFriendly(source: number, target: number) {
  return FRIENDLY_ROOT_NUMBERS[source]?.includes(target) ?? false;
}

function calculateCompatibilityScore(
  givenRootNumber: number,
  surnameRootNumber: number,
  fullNameRootNumber: number,
) {
  if (!givenRootNumber || !surnameRootNumber || !fullNameRootNumber) {
    return 0;
  }

  let score = 55;

  if (givenRootNumber === surnameRootNumber) {
    score += 25;
  } else if (isRootNumberFriendly(givenRootNumber, surnameRootNumber)) {
    score += 18;
  } else {
    score -= 8;
  }

  if (isRootNumberFriendly(fullNameRootNumber, givenRootNumber)) {
    score += 12;
  }

  if (isRootNumberFriendly(fullNameRootNumber, surnameRootNumber)) {
    score += 10;
  }

  return Math.max(0, Math.min(100, score));
}

function getCompatibilityLevel(
  score: number,
): SurnameCompatibilityResult["compatibilityLevel"] {
  if (score >= 80) {
    return "strong";
  }

  if (score >= 60) {
    return "balanced";
  }

  return "challenging";
}

function getCompatibilityGuidance(
  level: SurnameCompatibilityResult["compatibilityLevel"],
) {
  if (level === "strong") {
    return "The given name and surname have a strong numerology match.";
  }

  if (level === "balanced") {
    return "The given name and surname are balanced, with no major mismatch.";
  }

  return "The given name and surname may need review with alternate spellings.";
}
