# Database schema

This folder contains the MySQL schema for the baby naming platform.

- Raw SQL: `database/schema.sql`
- Sample baby names: `database/seed-baby-names.sql`
- Prisma models: `prisma/schema.prisma`

The schema is simple enough for the first product version and structured enough to scale.

To load sample baby names after creating the schema:

```bash
mysql -u USER -p DATABASE_NAME < database/seed-baby-names.sql
```

---

## Tables

### `baby_names`

Stores the searchable baby name catalog.

Important fields:

- `name` - display name
- `slug` - URL-safe unique value for detail pages
- `gender` - `BOY`, `GIRL`, or `UNISEX`
- `origin`, `religion`, `school`, `style_label` - filterable metadata
- `meaning` - long meaning text
- `starting_letter` - quick alphabet filter
- `numerology_number` - 1 to 9
- `is_premium` - whether the name requires unlock
- `name_length` - precomputed length for faster filtering
- `pronunciation_score`, `usability_score`, `rarity_score` - 0 to 100 ranking scores
- `search_count`, `favorite_count` - popularity counters

Main indexes:

```sql
UNIQUE KEY uq_baby_names_slug (slug)
KEY idx_baby_names_filters (gender, religion, starting_letter)
KEY idx_baby_names_gender_numerology (gender, numerology_number)
KEY idx_baby_names_premium_rarity (is_premium, rarity_score)
KEY idx_baby_names_style (style_label)
KEY idx_baby_names_popularity (search_count)
FULLTEXT KEY ft_baby_names_name_meaning (name, meaning)
```

Why:

- Most mobile users will search by gender, religion, first letter, and numerology.
- Full-text search helps with name and meaning search.
- Popularity and rarity indexes support ranking screens.

---

### `users`

Stores lightweight user identity.

Important fields:

- `full_name`
- `phone`
- `email`
- `credits_balance`

Main indexes:

```sql
UNIQUE KEY uq_users_phone (phone)
UNIQUE KEY uq_users_email (email)
```

Why:

- Phone is useful for WhatsApp funnels.
- Email is optional but useful for receipts and future login.
- Credits let users unlock premium names without trusting client-side payment state.

---

### `credit_transactions`

Stores credit purchases, unlock deductions, refunds, and manual adjustments.

Important fields:

- `user_id`
- `premium_unlock_id`
- `transaction_type`
- `credits_delta`
- `balance_after`
- `reason`

Main indexes:

```sql
KEY idx_credit_transactions_user_created (user_id, created_at)
KEY idx_credit_transactions_unlock (premium_unlock_id)
```

Why:

- Provides an audit trail for every credit change.
- Makes premium unlock support and reconciliation easier.

---

### `searches`

Stores search analytics.

Important fields:

- `user_id`
- `query`
- `gender`
- `religion`
- `starting_letter`
- `numerology_number`
- `result_count`
- `filters`

Main indexes:

```sql
KEY idx_searches_created (created_at)
KEY idx_searches_user_created (user_id, created_at)
KEY idx_searches_query (query)
KEY idx_searches_filters (gender, religion, starting_letter)
```

Why:

- Helps understand what parents search for most.
- Helps improve ranking and premium name packs.
- Supports per-user recent search history.

---

### `payments`

Stores Razorpay payment records.

Important fields:

- `user_id`
- `razorpay_order_id`
- `razorpay_payment_id`
- `amount_paise`
- `currency`
- `status`
- `paid_at`

Main indexes:

```sql
UNIQUE KEY uq_payments_razorpay_order_id (razorpay_order_id)
UNIQUE KEY uq_payments_razorpay_payment_id (razorpay_payment_id)
KEY idx_payments_user_status (user_id, status)
KEY idx_payments_status_created (status, created_at)
```

Why:

- Razorpay IDs must be unique.
- User/status indexes make payment history and reconciliation faster.

---

### `premium_unlocks`

Stores premium access after successful payment.

Important fields:

- `user_id`
- `payment_id`
- `baby_name_id`
- `unlock_type`
- `starts_at`
- `expires_at`
- `is_active`

Main indexes:

```sql
KEY idx_premium_unlocks_user_access (user_id, is_active, expires_at)
KEY idx_premium_unlocks_payment (payment_id)
KEY idx_premium_unlocks_baby_name (baby_name_id)
```

Why:

- The app often needs to quickly ask: "Can this user view premium content?"
- The `expires_at` field supports lifetime, monthly, or limited-time unlocks.

---

### `consultations`

Stores WhatsApp consultation leads.

Important fields:

- `user_id`
- `phone`
- `parent_name`
- `baby_gender`
- `preferred_language`
- `requirements`
- `status`
- `whatsapp_conversation_id`
- `source`

Main indexes:

```sql
KEY idx_consultations_phone (phone)
KEY idx_consultations_status_created (status, created_at)
KEY idx_consultations_user_created (user_id, created_at)
```

Why:

- Consultation teams need to filter new leads quickly.
- Phone lookup is important for WhatsApp follow-up.

---

## Relationships

```txt
users 1 -> many searches
users 1 -> many payments
users 1 -> many premium_unlocks
users 1 -> many consultations
users 1 -> many credit_transactions

baby_names 1 -> many premium_unlocks
payments 1 -> many premium_unlocks
premium_unlocks 1 -> many credit_transactions
```

Deletion behavior:

- Deleting a user deletes their `premium_unlocks`.
- Deleting a user keeps old `searches` and `consultations`, but sets `user_id` to `NULL`.
- Payments are protected with `ON DELETE RESTRICT`.
- If a baby name is removed, related unlocks keep the record but set `baby_name_id` to `NULL`.

---

## Scalability recommendations

### 1. Start with MySQL indexes before adding search infrastructure

For the first version, MySQL full-text search is enough.

Later, if search becomes advanced, add:

- Meilisearch
- Typesense
- Elasticsearch/OpenSearch

Keep MySQL as the source of truth.

### 2. Keep counters async when traffic grows

Fields such as:

- `search_count`
- `favorite_count`

can become hot rows at scale. Start simple, then move counter updates to a background job or batch process.

### 3. Store money in paise

Use:

```txt
amount_paise INT UNSIGNED
```

Avoid floating-point money values.

### 4. Avoid indexing every column

Indexes speed up reads but slow down writes. The current schema indexes common product queries only:

- name filters
- numerology filters
- premium access checks
- payment lookup
- consultation queues

### 5. Partition analytics later if needed

The `searches` table can grow quickly.

If it becomes very large, partition by month using `created_at`, or move old rows to an analytics warehouse.

### 6. Use read replicas later

When traffic grows:

- primary database for writes
- read replica for search-heavy reads

### 7. Keep secrets out of the database schema

Do not store:

- Razorpay secret keys
- WhatsApp API tokens
- admin passwords in plain text

Use environment variables and a secret manager in production.
