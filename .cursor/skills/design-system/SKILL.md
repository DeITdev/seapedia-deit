---
name: design-system-seapedia
description: SEAPEDIA marketplace design system — Funroad-inspired tokens, light/dark mode, component rules. Use when styling UI, updating globals.css, building marketplace components, or writing design docs.
---

# SEAPEDIA Design System Skill

Apply this skill whenever creating or updating UI in SEAPEDIA. Read [`design/design.md`](../../design/design.md) and [`app/globals.css`](../../app/globals.css) before making visual changes.

## Mission

Deliver a consistent, accessible, Funroad-inspired marketplace UI with **mandatory light and dark mode**, token-only colors, and COMPFEST-compatible semantics (order statuses, role clarity, responsive layouts).

## Quick reference

| Need | Use |
| ---- | --- |
| Page background | `bg-background text-foreground` |
| Card / panel | `border bg-card text-card-foreground` |
| Primary CTA | `bg-primary text-primary-foreground` (black light / white dark) |
| Price badge | `border bg-price text-price-foreground px-2 py-1 text-sm font-medium` |
| Card hover | `hover-shadow-hard` utility |
| Active nav pill | `pill-active` utility |
| Inactive nav pill | `pill-inactive` utility |
| Muted helper text | `text-muted-foreground` |
| Order success | `bg-success text-success-foreground` |
| Order returned | `bg-danger text-danger-foreground` |
| Delete action | `variant="destructive"` on Button |

## Rules: Do

- Use semantic tokens from `globals.css` — never raw hex or Tailwind palette classes (`slate-*`, `pink-*`, etc.) in app components.
- Define and test **both** light and dark mode for every new screen.
- Use Geist Sans; mono for codes/IDs.
- Product cards: bordered, flat default, hard shadow on hover, pink price badge.
- Primary actions: solid `primary` fill; secondary: `outline` or `ghost`.
- Keep focus rings visible (`ring-ring`).
- Format money with `formatIDR()` from `lib/money.ts`.

## Rules: Don't

- Don't use `--price` for non-price UI (buttons, nav, badges unrelated to money).
- Don't remove theme toggle or dark-mode token pairs.
- Don't introduce one-off colors outside `globals.css`.
- Don't hide focus indicators or rely on color alone for status.
- Don't modify `components/ui/*` shadcn primitives unless fixing a token wiring bug — build in `components/` feature folders.

## Component checklist

When adding a component, specify:

1. **Anatomy** — slots and hierarchy
2. **Tokens** — which CSS variables / Tailwind classes
3. **States** — default, hover, focus-visible, active, disabled, loading, error
4. **Responsive** — mobile-first breakpoints
5. **Dark mode** — confirm borders and contrast
6. **A11y** — keyboard path, aria labels, contrast

## Key component specs

### Product card

```
border bg-card overflow-hidden flex flex-col h-full hover-shadow-hard transition-shadow
→ thumb area (aspect-square bg-muted)
→ body p-4 border-t space-y-2
→ title text-lg font-medium line-clamp-2
→ store text-sm underline font-medium text-muted-foreground
→ footer p-4: price badge (bg-price)
```

### Navbar

```
sticky top-0 z-40 border-b bg-background/95 backdrop-blur
→ logo left
→ nav pills center (hidden md:flex)
→ theme toggle + auth right
```

### Dashboard shell

```
max-w-6xl mx-auto px-4 py-8
→ title text-2xl font-semibold
→ content on bg-background with card panels border bg-card rounded-xl
```

## Authoring workflow

1. Restate UI goal in one sentence.
2. Pick tokens from `globals.css` (add new tokens there first if needed).
3. Implement in app-level `components/` — not raw shadcn overrides.
4. Verify light + dark + mobile + keyboard focus.
5. Run lint; no forbidden color classes.

## Quality gates

- Non-negotiable rules use **must**.
- Every new token needs `:root` and `.dark` values.
- Accessibility rules must be testable (contrast, focus, labels).
- Prefer system consistency over local visual exceptions.

## Files

| File | Purpose |
| ---- | ------- |
| [`app/globals.css`](../../app/globals.css) | Token definitions + utilities |
| [`design/design.md`](../../design/design.md) | Full design system documentation |
| [`context/ui-context.md`](../../context/ui-context.md) | Project UI constraints (dark mode, shadcn, components) |

## COMPFEST alignment

Visual creativity is allowed (guidebook: "Be creative"). Functional rules unchanged:

- Light **and** dark mode required.
- Responsive desktop + mobile.
- Guest vs logged-in navigation must differ.
- Role visibility and marketplace multi-seller identity preserved.
