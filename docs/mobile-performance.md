# Mobile performance optimizations

This app is optimized for mobile-first usage, including low-end Android devices.

---

## 1. Lazy loading heavy interactions

Files:

```txt
src/components/names/lazy-swipeable-name-cards.tsx
src/app/page.tsx
```

The animated swipe deck uses Framer Motion, which is heavier than static UI.
Instead of importing it directly on the landing page, the app now imports a tiny lazy wrapper:

```tsx
const SwipeableNameCards = dynamic(() => import("./swipeable-name-cards"), {
  ssr: false,
  loading: () => <SwipeableNameCardsSkeleton />,
});
```

Why this helps:

- faster first paint
- less JavaScript on initial page load
- animation code loads only when needed
- low-end phones spend less CPU during startup

---

## 2. Fast first paint

Files:

```txt
src/app/page.tsx
src/app/globals.css
```

The landing page is mostly server-rendered static content. The first visible sections use:

- text
- gradients
- Tailwind classes
- no blocking images
- no client-only data fetching

Why this helps:

- HTML can stream/render quickly
- browser paints content before interactive widgets hydrate
- fewer layout shifts

---

## 3. Image optimization defaults

File:

```txt
next.config.ts
```

Configured:

```ts
images: {
  formats: ["image/avif", "image/webp"],
  minimumCacheTTL: 60 * 60 * 24 * 30,
}
```

Why this helps:

- AVIF/WebP are smaller than JPEG/PNG
- long cache TTL helps repeat visits
- future image assets get optimized by default

Current landing page intentionally avoids images for maximum speed.

---

## 4. Bundle size reduction

File:

```txt
next.config.ts
```

Configured:

```ts
experimental: {
  optimizePackageImports: ["lucide-react", "framer-motion"],
}
```

Why this helps:

- reduces unnecessary library code in bundles
- improves icon import optimization
- keeps animation code better isolated with lazy loading

---

## 5. API optimization

Files:

```txt
src/features/names/search-params.ts
src/repositories/name-repository.ts
src/app/api/names/route.ts
```

Changes:

- `pageSize` remains capped at 30
- default API no longer runs `COUNT(*)`
- API fetches `pageSize + 1` rows to calculate `hasNextPage`
- exact totals are optional with `includeTotal=true`
- premium unlock checks only query names on the current page
- anonymous responses are CDN-cacheable
- user-specific premium responses are private and not shared-cacheable

Why this helps:

- less database CPU
- lower latency on mobile networks
- safer caching for premium content
- smoother infinite-scroll or load-more UX

---

## 6. Smooth scrolling and reduced motion

File:

```txt
src/app/globals.css
```

Configured:

```css
html {
  scroll-behavior: smooth;
  scroll-padding-bottom: 12rem;
}

@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.001ms !important;
    transition-duration: 0.001ms !important;
  }
}
```

Why this helps:

- sticky bottom CTA does not cover anchored sections
- users who prefer reduced motion get lighter animations
- lower-end devices avoid unnecessary animation work

---

## 7. Off-screen rendering optimization

File:

```txt
src/app/page.tsx
```

Below-the-fold sections use Tailwind arbitrary properties:

```txt
[content-visibility:auto]
[contain-intrinsic-size:760px]
```

Why this helps:

- browser can skip rendering off-screen sections initially
- improves startup work on long mobile pages
- keeps scrolling smooth on lower-end Android phones

---

## 8. Low-end Android considerations

Design choices:

- no autoplay video
- no large hero images
- minimal JavaScript before interaction
- capped API page size
- native scrolling and CSS snap where possible
- lazy client animation bundle
- reduced motion support
- server-side premium masking

Recommended future checks:

```bash
npm run build
```

Then test on:

- Chrome Android throttled CPU
- slow 4G network
- Lighthouse mobile mode
- real Android device if available
