# Numerology engine

Location:

```txt
src/lib/numerology/index.ts
```

The numerology engine is a reusable TypeScript utility module. It does not depend on React, Next.js routes, or the database, so it can be used from:

- API routes
- services
- import scripts
- admin tools
- future UI calculators

---

## Numerology system

The first implementation uses a Chaldean-style letter map, commonly used for Indian name numerology.

```txt
1: A I J Q Y
2: B K R
3: C G L S
4: D M T
5: E H N X
6: U V W
7: O Z
8: F P
```

The engine returns both:

- `compoundNumber` - total sum of letter values
- `rootNumber` - reduced single digit from 1 to 9

---

## Basic usage

```ts
import {
  calculateCompoundNumber,
  calculateNameNumerology,
  reduceToRootNumber,
} from "@/lib/numerology";

const compoundNumber = calculateCompoundNumber("Aarav");
const rootNumber = reduceToRootNumber(compoundNumber);
const fullResult = calculateNameNumerology("Aarav Sharma");
```

Example result shape:

```ts
{
  rawName: "Aarav Sharma",
  normalizedName: "AARAV SHARMA",
  system: "chaldean",
  compoundNumber: 27,
  rootNumber: 9,
  parts: [
    {
      raw: "AARAV",
      normalized: "AARAV",
      compoundNumber: 11,
      rootNumber: 2,
      letters: [
        { letter: "A", value: 1 }
      ]
    }
  ]
}
```

---

## Surname compatibility

Use this when parents want to check how a first name sounds numerologically with a family surname.

```ts
import { calculateSurnameCompatibility } from "@/lib/numerology";

const result = calculateSurnameCompatibility("Aarav", "Sharma");
```

The result includes:

```txt
givenName
surname
fullName
compatibilityScore
compatibilityLevel
guidance
```

Compatibility levels:

```txt
strong
balanced
challenging
```

This is intentionally simple. It is useful for shortlisting, not for making absolute claims.

---

## Indian name support

The engine is designed for Indian names written in English transliteration.

It handles:

- spaces between first, middle, and surname
- mixed case
- punctuation
- common diacritics through Unicode normalization

Examples:

```ts
normalizeIndianName("Aarav Sharma");
// "AARAV SHARMA"

normalizeIndianName("Ishaan-Kapoor");
// "ISHAAN KAPOOR"
```

---

## Available functions

```ts
normalizeIndianName(name)
splitNameParts(name)
getLetterValue(letter)
reduceToRootNumber(number)
calculateCompoundNumber(name)
analyzeNamePart(namePart)
calculateNameNumerology(fullName)
calculateSurnameCompatibility(givenName, surname)
isRootNumberFriendly(source, target)
```

---

## Design notes

Keep this module pure and simple:

- no database calls
- no HTTP logic
- no React components
- no environment variables

Future API routes should call this module through a service layer, for example:

```txt
src/app/api/numerology/calculate/route.ts
  -> src/services/numerology-service.ts
    -> src/lib/numerology
```
