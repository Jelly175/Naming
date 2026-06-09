# Naamly - Mobile-first Indian baby naming platform

This project is initialized with:

- Next.js latest template
- TypeScript
- Tailwind CSS
- ESLint
- MySQL-ready Prisma setup
- Starter folders for Razorpay and WhatsApp integrations

The codebase is intentionally small. It sets up the foundation without building every feature.

---

## 1. Terminal commands used

For a brand-new empty folder, run:

```bash
npx create-next-app@latest . --ts --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm --yes
```

Because this repository already had a README, the app was scaffolded in a child folder first and then moved into the repo root:

```bash
npx create-next-app@latest baby-name-platform --ts --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm --yes
cp -a baby-name-platform/. .
rm -rf baby-name-platform
```

Recommended packages were installed with:

```bash
npm install zod clsx tailwind-merge class-variance-authority lucide-react framer-motion react-hook-form @hookform/resolvers @prisma/client @prisma/adapter-mariadb razorpay dotenv server-only
npm install -D prisma
npx prisma init --datasource-provider mysql
```

Useful scripts were added:

```bash
npm run dev
npm run lint
npm run typecheck
npm run build
npm run db:generate
npm run db:migrate
npm run db:studio
```

---

## 2. Installation steps

Install dependencies:

```bash
npm install
```

Copy the environment example:

```bash
cp .env.example .env
```

Fill in values inside `.env` when you have them:

- `DATABASE_URL`
- `DB_POOL_CONNECTION_LIMIT`
- `DB_SSL`
- `RAZORPAY_KEY_ID`
- `RAZORPAY_KEY_SECRET`
- `WHATSAPP_API_URL`
- `WHATSAPP_API_TOKEN`

Start the development server:

```bash
npm run dev
```

Open:

```txt
http://localhost:3000
```

Check the health API:

```txt
http://localhost:3000/api/health
```

After configuring `DATABASE_URL`, check the database health API:

```txt
http://localhost:3000/api/health/db
```

---

## 3. Folder setup

```txt
src/
  app/                  Next.js pages and API routes
    api/health/         Simple health check endpoint
    names/              Name search route placeholder
    numerology/         Numerology route placeholder
    premium/            Premium unlock route placeholder
    consultation/       WhatsApp consultation route placeholder

  components/           Reusable React components
    layout/             Mobile shell, bottom nav, page containers
      sticky-bottom-cta.tsx Sticky mobile CTA for premium/payment flows
    ui/                 Generic UI such as Button
      badge.tsx         Compact status and metadata labels
      button.tsx        Large thumb-friendly buttons
      card.tsx          Premium mobile card surfaces
      input.tsx         Mobile form input
      swipeable-rail.tsx Native swipeable scroll rail
      text.tsx          Typography system
    names/              Future name cards, filters, swipe cards
      name-preview-card.tsx Modern baby name card
      swipeable-name-cards.tsx Animated swipe deck with save/unlock/WhatsApp actions
    payment/            Future premium and payment components

  config/               App-level config such as site name
  features/             Larger feature modules as the app grows
  lib/                  Database and third-party integration helpers
    db/client.ts        Secure pooled MySQL/Prisma client
    db/health.ts        Database health-check helper
  repositories/         Database queries live here
  services/             Business logic lives here
  types/                Shared TypeScript types
  utils/                Small reusable helpers

prisma/
  schema.prisma         MySQL schema definition

database/
  schema.sql            Raw MySQL schema with indexes and relationships
  seed-baby-names.sql   100 sample baby names for database testing
  README.md             Table explanations and scaling notes

docs/
  api/name-search.md    Baby name search API filters, response, and performance notes
  design/mobile-design-system.md Premium mobile UI design system

prisma.config.ts        Prisma 7 config
```

Simple rule:

- React UI goes in `components` or `app`
- Business logic goes in `services`
- Database queries go in `repositories`
- External SDK wrappers go in `lib/integrations`
- Shared types go in `types`

---

## 4. Frontend/backend separation

This is one Next.js app, but the code is separated by responsibility.

Frontend:

```txt
src/app
src/components
src/features
```

Backend:

```txt
src/app/api
src/services
src/repositories
src/lib
prisma
```

Important:

- The browser should call your API routes.
- API routes should call services.
- Services should call repositories or integrations.
- Secrets should stay on the server only.

---

## 5. Tailwind setup

Tailwind CSS is already enabled through:

```txt
src/app/globals.css
postcss.config.mjs
```

This project uses Tailwind CSS v4, so design tokens can live directly in `globals.css` with `@theme`.

Mobile-first notes:

- Tailwind breakpoints are mobile-first by default.
- Base classes target mobile screens.
- Use `sm:`, `md:`, and larger prefixes only when adding larger-screen behavior.
- Main pages use a max mobile width through `MobileShell`.
- Bottom navigation includes safe-area padding for phones with gesture bars.

Example:

```tsx
<div className="px-4 text-base sm:px-6 md:text-lg" />
```

This means:

- mobile: `px-4 text-base`
- small screens and above: `sm:px-6`
- medium screens and above: `md:text-lg`

---

## 6. Recommended package purpose

Installed packages:

```txt
zod                         Validating API input and forms
react-hook-form             Building forms
@hookform/resolvers         Connecting Zod to forms
clsx                        Conditional class names
tailwind-merge              Merging Tailwind classes safely
class-variance-authority    Reusable component variants
lucide-react                Icons
framer-motion               Swipe and animation support
@prisma/client              MySQL database client
@prisma/adapter-mariadb     MySQL-compatible Prisma driver adapter with pooling
prisma                      Database schema and migrations
razorpay                    Razorpay server SDK
dotenv                      Loads local env vars for Prisma config
server-only                 Prevents server-only utilities from being imported by browser code
```

Add later only when needed:

```txt
next-auth or auth.js        User authentication
inngest or qstash           Background jobs and follow-ups
redis or upstash            Caching, rate limits, queues
analytics package           Product analytics
```

---

## 7. Development order

Recommended next steps:

1. Review the MySQL schema in `database/schema.sql` and `prisma/schema.prisma`
2. Build `/names` search UI
3. Add name search API
4. Add numerology calculation service
5. Add premium lock UI
6. Add Razorpay create-order and verify APIs
7. Add WhatsApp consultation form and API
8. Add admin/import workflow for names

Keep every step small and testable.

---

## 8. Deployment

Simple production setup:

```txt
Vercel
  Next.js frontend
  Next.js API routes

Managed MySQL
  PlanetScale, AWS RDS, Railway, DigitalOcean, or Aiven

External services
  Razorpay
  WhatsApp provider
```

Before deploying:

```bash
npm run lint
npm run typecheck
npm run build
```
