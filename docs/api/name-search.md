# Baby name search API

Endpoint:

```txt
GET /api/names
```

This API searches the `baby_names` table with mobile-friendly pagination and compact response data.

---

## File architecture

```txt
src/app/api/names/route.ts
  Receives HTTP requests, validates query params, returns JSON responses.

src/features/names/search-params.ts
  Validates and normalizes filters using Zod.

src/services/name-service.ts
  Business layer. Keeps API routes away from database details.

src/repositories/name-repository.ts
  Builds optimized MySQL queries and maps database rows to API objects.

src/lib/db/client.ts
  Reusable pooled Prisma/MySQL connection.

src/types/name.ts
  Shared TypeScript types for names and search responses.
```

Recommended flow:

```txt
Mobile UI
  -> GET /api/names
    -> route.ts
      -> search-params.ts
        -> name-service.ts
          -> name-repository.ts
            -> getDb()
              -> MySQL
```

---

## Supported filters

### Starting letter

```txt
/api/names?startingLetter=A
```

Alias:

```txt
/api/names?letter=A
```

### Gender

```txt
/api/names?gender=boy
/api/names?gender=girl
/api/names?gender=unisex
```

### Numerology

```txt
/api/names?numerology=7
```

Alias:

```txt
/api/names?numerologyNumber=7
```

Allowed values are `1` to `9`.

### Religion

```txt
/api/names?religion=Hindu
```

### Premium/free

```txt
/api/names?premium=all
/api/names?premium=free
/api/names?premium=premium
```

Default is:

```txt
premium=all
```

### Meaning keyword

```txt
/api/names?meaning=light
```

The repository uses MySQL full-text search:

```sql
MATCH(name, meaning) AGAINST (? IN NATURAL LANGUAGE MODE)
```

This uses the existing full-text index:

```sql
FULLTEXT KEY ft_baby_names_name_meaning (name, meaning)
```

---

## Pagination

Default:

```txt
page=1
pageSize=20
```

Maximum:

```txt
pageSize=30
```

Example:

```txt
/api/names?gender=girl&startingLetter=A&page=1&pageSize=20
```

The maximum page size is intentionally small because most users are on mobile devices.

---

## Example response

```json
{
  "ok": true,
  "data": {
    "items": [
      {
        "id": "1",
        "name": "Aarav",
        "slug": "aarav",
        "meaning": "Peaceful and wise",
        "gender": "boy",
        "religion": "Hindu",
        "origin": "Sanskrit",
        "startingLetter": "A",
        "numerologyNumber": 6,
        "styleLabel": "Modern",
        "isPremium": false,
        "nameLength": 5,
        "pronunciationScore": 94,
        "usabilityScore": 96,
        "rarityScore": 28
      }
    ],
    "pagination": {
      "page": 1,
      "pageSize": 20,
      "total": 100,
      "totalPages": 5,
      "hasNextPage": true,
      "hasPreviousPage": false
    },
    "filters": {
      "startingLetter": "A",
      "gender": "boy",
      "premium": "all",
      "page": 1,
      "pageSize": 20
    }
  },
  "meta": {
    "tookMs": 12
  }
}
```

---

## Error response

Invalid filters return `400`:

```json
{
  "ok": false,
  "error": {
    "code": "INVALID_SEARCH_FILTERS",
    "message": "One or more search filters are invalid.",
    "details": [
      {
        "field": "numerology",
        "message": "Too big: expected number to be <=9"
      }
    ]
  }
}
```

Database or unexpected failures return `500`.

---

## MySQL performance notes

The query uses indexes already defined in `database/schema.sql`:

```sql
KEY idx_baby_names_filters (gender, religion, starting_letter)
KEY idx_baby_names_gender_numerology (gender, numerology_number)
KEY idx_baby_names_premium_rarity (is_premium, rarity_score)
FULLTEXT KEY ft_baby_names_name_meaning (name, meaning)
```

Why this is scalable:

- Filters are applied in SQL, not in Node.js memory.
- Pagination uses `LIMIT` and `OFFSET`.
- The API selects only fields needed for mobile cards.
- `pageSize` is capped to protect database performance.
- Meaning search uses MySQL full-text search instead of slow `%keyword%` scans.
- Response caching uses:

```txt
Cache-Control: public, s-maxage=60, stale-while-revalidate=300
```

This helps repeated mobile searches load faster through platform/CDN caching.

Later, for very large catalogs, consider cursor pagination or a dedicated search service such as Typesense, Meilisearch, or OpenSearch.
