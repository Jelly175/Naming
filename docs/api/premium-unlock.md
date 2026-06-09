# Premium unlock API

Premium names are protected on the backend and can be unlocked with user credits.

Current starter authentication:

```txt
x-user-id: 1
```

This is a temporary starter pattern. Replace it with real session/JWT auth before production.

---

## File architecture

```txt
src/app/api/premium/status/route.ts
  Checks user credits and unlock status.

src/app/api/premium/unlock/route.ts
  Unlocks one premium name using credits.

src/services/premium-service.ts
  Business layer for premium actions.

src/repositories/premium-repository.ts
  Database queries, transaction-safe credit deduction, and unlock records.

src/config/premium.ts
  Server-owned unlock cost constants.

src/lib/http/auth.ts
  Starter request user-id validation helper.
```

---

## Credit model

Users have:

```txt
users.credits_balance
```

Every deduction is recorded in:

```txt
credit_transactions
```

Unlocks are recorded in:

```txt
premium_unlocks
```

This creates an audit trail:

```txt
user credits -> premium unlock -> credit transaction
```

---

## Check premium status

```txt
GET /api/premium/status?babyNameId=2
```

Headers:

```txt
x-user-id: 1
```

Example response:

```json
{
  "ok": true,
  "data": {
    "userId": "1",
    "creditsBalance": 5,
    "unlockCost": 1,
    "babyName": {
      "id": "2",
      "name": "Kashvi",
      "isPremium": true
    },
    "isUnlocked": false,
    "canUnlock": true
  }
}
```

---

## Unlock premium name

```txt
POST /api/premium/unlock
```

Headers:

```txt
Content-Type: application/json
x-user-id: 1
```

Body:

```json
{
  "babyNameId": "2"
}
```

The backend:

1. validates the user
2. validates the baby name
3. checks if the name is premium
4. checks if it is already unlocked
5. locks the user row with `FOR UPDATE`
6. verifies credits balance
7. deducts credits
8. creates a `premium_unlocks` row
9. creates a `credit_transactions` row

The client never sends the unlock cost. The server owns the cost.

---

## Locked premium names in search

`GET /api/names` supports optional user context:

```txt
x-user-id: 1
```

If the user has not unlocked a premium name, the search API masks protected content:

```json
{
  "name": "Premium name",
  "meaning": "Unlock with credits to view this meaning.",
  "isPremium": true,
  "isLocked": true,
  "unlockCost": 1
}
```

This is important: premium content is not merely blurred in the browser. The backend does not send the protected name/meaning unless the user has access.

---

## Frontend components

```txt
src/components/names/swipeable-name-cards.tsx
```

This component:

- blurs locked premium cards
- shows credit cost
- supports save action
- supports unlock action
- links to WhatsApp consultation

To enable API unlocks from the component, pass:

```tsx
<SwipeableNameCards names={names} viewerUserId="1" />
```

Without `viewerUserId`, the unlock button falls back to the premium page.

---

## Production security recommendations

Before production:

- replace `x-user-id` with real auth
- add CSRF protection for cookie-based sessions
- rate-limit unlock endpoints
- monitor credit transaction anomalies
- keep unlock cost server-side only
- never expose raw premium content for locked names
