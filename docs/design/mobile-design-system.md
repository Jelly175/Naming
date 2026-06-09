# Mobile-first UI design system

This design system is built with Tailwind CSS classes and Tailwind v4 theme tokens.

Main goals:

- premium, Apple-level clean layout
- large thumb-friendly tap targets
- calm Indian baby naming color palette
- reusable mobile components
- swipeable interactions without heavy UI code

---

## File locations

```txt
src/app/globals.css
  Tailwind theme tokens for colors, typography, spacing, radius, and shadows.

src/components/ui/button.tsx
  Large reusable action buttons.

src/components/ui/card.tsx
  Premium card surfaces.

src/components/ui/badge.tsx
  Labels for premium, numerology, style, and state.

src/components/ui/input.tsx
  Large mobile-friendly input fields.

src/components/ui/text.tsx
  Typography component for display, title, body, and caption text.

src/components/ui/swipeable-rail.tsx
  Native horizontal swipe rail using overflow scroll and snap points.

src/components/layout/sticky-bottom-cta.tsx
  Fixed bottom CTA for premium unlock and lead funnels.

src/components/names/name-preview-card.tsx
  Modern baby name card for search, swipe, and premium screens.
```

---

## Color palette

Defined in:

```txt
src/app/globals.css
```

Core colors:

```txt
background      #fffaf7
foreground      #111827
surface         #ffffff
surface-soft    #fff7ed
surface-muted   #f8fafc
border-soft     #fed7aa
brand           #ea580c
brand-strong    #c2410c
brand-ink       #7c2d12
accent          #b45309
success         #15803d
danger          #dc2626
```

Usage:

```tsx
<div className="bg-background text-foreground" />
<div className="bg-surface-soft text-brand-ink" />
<button className="bg-brand text-white" />
```

---

## Spacing system

Important mobile tokens:

```txt
touch           2.75rem / 44px minimum tap target
mobile-gutter   1rem
card            1.25rem
```

Usage:

```tsx
<button className="min-h-touch px-5" />
<section className="p-card" />
```

Guidelines:

- Keep primary buttons at least `44px` tall.
- Use `gap-3` or `gap-4` for dense mobile lists.
- Use `gap-6` or `gap-7` between major sections.
- Keep bottom actions sticky for checkout and consultation flows.

---

## Typography system

Tokens:

```txt
display  2.75rem, tight hero heading
title    1.75rem, card/page title
body     1rem, readable paragraph
caption  0.75rem, labels and metadata
```

Use the `Text` component:

```tsx
<Text as="h1" variant="display">
  Find meaningful Indian baby names.
</Text>

<Text variant="body">
  Short readable copy for mobile screens.
</Text>
```

Guidelines:

- Use one `display` heading per screen.
- Use `title` for important cards.
- Keep body copy short on mobile.
- Use captions for filters, metadata, and eyebrow labels.

---

## Components

### Button

```tsx
<Button fullWidth size="xl">
  Start search
</Button>

<Button fullWidth size="xl" variant="premium">
  Unlock premium names
</Button>
```

Variants:

```txt
primary
premium
secondary
outline
ghost
```

Sizes:

```txt
sm
md
lg
xl
```

---

### Card

```tsx
<Card variant="elevated" padding="lg">
  Premium content
</Card>
```

Variants:

```txt
default
elevated
premium
soft
```

---

### Sticky bottom CTA

Use this for payment, premium unlock, and WhatsApp consultation flows.

```tsx
<StickyBottomCta
  helperText="Premium pack includes 50 curated names"
  primaryLabel="Unlock for ₹99"
  secondaryLabel="Ask on WhatsApp"
/>
```

Design rule:

- Use one strong primary action.
- Keep secondary action visually quiet.
- Avoid more than two actions in the sticky area.

---

### Swipeable rail

Use this for name cards on mobile.

```tsx
<SwipeableRail
  items={names}
  getKey={(name) => name.slug}
  renderItem={(name) => <NamePreviewCard {...name} />}
/>
```

It uses native browser scrolling:

```txt
overflow-x-auto
snap-x
snap-mandatory
snap-center
```

This keeps the interaction fast and lightweight.

---

## Mobile UX rules

1. Primary actions should be near the thumb zone.
2. Use sticky bottom CTAs for payment and consultation.
3. Avoid tiny text links for important actions.
4. Keep cards rounded and spacious.
5. Prefer one-column layouts.
6. Use swipe rails for discovery, not required navigation.
7. Cap dense lists and paginate from the API.
8. Use skeletons/loading states before adding complex animations.

---

## Tailwind-only rule

Components should use:

```txt
className="..."
```

Avoid:

- CSS modules
- styled-components
- inline dynamic styles
- large animation libraries for basic interactions

The current swipe interaction is native CSS scroll snapping through Tailwind classes.
