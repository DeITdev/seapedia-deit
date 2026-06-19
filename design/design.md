# SEAPEDIA Design System

Implementation-ready, token-driven UI guidance for the SEAPEDIA multi-role marketplace. Visual language is inspired by the **Funroad** reference (clean monochrome surfaces, crisp borders, pink price badges, hard offset shadows) while meeting COMPFEST requirements: **mandatory light + dark mode**, responsive layouts, and semantic tokens only.

**Source of truth for colors:** [`app/globals.css`](../app/globals.css)

---

## Design intent

A breathable, editorial marketplace that feels premium and scannable: neutral canvas, black-and-white actions, one vivid accent for prices, and generous whitespace. Works equally in light and dark mode without redesigning components.

---

## Brand

| Item | Value |
| ---- | ----- |
| Product | SEAPEDIA |
| Surface | Full-stack marketplace (public catalog + role dashboards) |
| Audience | Buyers, Sellers, Drivers, Admins, guests |
| Reference | Funroad / `repo/next15-multitenant-ecommerce` (visual only) |

---

## Foundations

### Theming

- **Mechanism:** `next-themes`, class-based (`html.dark`).
- **Toggle:** Visible in navbar; persists across sessions.
- **Default:** System preference on first load.
- **Rule:** Every token must define both `:root` and `.dark` values. Components must not hardcode colors.

### Typography

| Token / usage | Value |
| ------------- | ----- |
| Primary font | Geist Sans (`--font-geist-sans`) |
| Mono font | Geist Mono (`--font-geist-mono`) — order IDs, voucher codes |
| Body | `text-sm` / `font-medium` base; `antialiased` on `body` |
| Page title | `text-2xl font-semibold tracking-tight` |
| Hero | `text-4xl font-bold tracking-tight sm:text-5xl` |
| Product title (card) | `text-lg font-medium` |
| Muted copy | `text-muted-foreground text-sm` |

### Color tokens

Use Tailwind utilities mapped in `globals.css`. **Never** use raw hex, `slate-*`, `zinc-*`, or `pink-*` in app components.

| Token | Role | Light | Dark |
| ----- | ---- | ----- | ---- |
| `background` | Page canvas | Off-white | Near-black |
| `foreground` | Primary text | Near-black | Near-white |
| `card` | Raised surfaces (cards, panels) | White | Charcoal |
| `primary` | Main CTA fill (Sign up, Start selling) | Black | White |
| `primary-foreground` | Text on primary | White | Black |
| `border` / `input` | Outlines, inputs, dividers | Crisp black | White ~14% |
| `muted` / `muted-foreground` | Secondary surfaces & helper text | Light grey | Dark grey |
| `accent` | Hover fills, subtle highlights | Light grey | Dark grey |
| **`price`** | **Price badge background only** | Pink | Pink (adjusted) |
| **`price-foreground`** | **Price badge text** | Black | White |
| `success` / `warning` / `info` / `danger` | Order status, validation | Semantic set | Semantic set |
| `destructive` | Delete, irreversible actions | Red | Red |

**Price accent rule:** `--price` is reserved for product price badges and checkout money highlights. Do not use it for generic buttons or nav.

### Spacing scale

| Step | px | Typical use |
| ---- | -- | ----------- |
| 1 | 4 | Icon gaps |
| 2 | 8 | Tight inline spacing |
| 3 | 12 | Form field gaps |
| 4 | 16 | Card padding (compact) |
| 5 | 24 | Section gaps |
| 6 | 32 | Page section spacing |
| 7 | 48 | Hero / major sections |

Page content max width: `max-w-6xl` (public), `max-w-6xl` (dashboards).

### Radius

| Context | Class | Notes |
| ------- | ----- | ----- |
| Inputs, small controls | `rounded-md` | `--radius-sm` |
| Buttons | `rounded-lg` | default shadcn |
| Cards, panels | `rounded-md` to `rounded-xl` | reference cards use `rounded-md` |
| Modals | `rounded-2xl` | |
| Nav / filter pills | `rounded-full` | `.pill-active` / `.pill-inactive` |

Base token: `--radius: 0.625rem`.

### Elevation & motion

| Pattern | Implementation |
| ------- | -------------- |
| Default card | `border bg-card` — flat, bordered |
| Card hover | `.hover-shadow-hard` — 4px offset hard shadow (`--shadow-hard`) |
| Transitions | `transition-shadow`, `transition-colors` — 150–200ms |
| Focus | `focus-visible:ring-ring/50 focus-visible:ring-[3px]` |

---

## Layout patterns

### Public marketplace

```
┌ Header: logo · nav pills · theme · auth ─────────────┐
├ Search bar (full width, thin border) ──────────────────┤
├ Optional category / filter pills (horizontal scroll) ──┤
├ Sidebar filters │ Product grid (2–4 cols responsive) ─┤
└ Footer ────────────────────────────────────────────────┘
```

- Navbar: sticky, `border-b`, `bg-background/95 backdrop-blur`.
- Active nav link: `pill-active` or `bg-primary text-primary-foreground rounded-full`.
- Catalog grid: `grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4`.

### Dashboards

- Same token set; tables and forms use `border`, `card`, `muted`.
- Role badge always visible; destructive actions use `destructive` variant.

---

## Components

### Product card (marketplace)

**Anatomy:** image/thumb → title → store link (underlined) → price badge.

```
┌──────────────────┐
│     image        │
├──────────────────┤
│ Product name     │
│ store name ↗     │
├──────────────────┤
│ [ Rp85.000 ]     │  ← bg-price text-price-foreground border px-2 py-1
└──────────────────┘
```

| State | Behavior |
| ----- | -------- |
| Default | `border bg-card overflow-hidden flex flex-col h-full` |
| Hover | `.hover-shadow-hard` |
| Focus | Visible ring on link focus |

**Do:** use `formatIDR()` for prices; show store name with underline on seller link.  
**Don't:** gradient thumbs as permanent design — placeholder OK until product images exist.

### Primary button

- Filled: `bg-primary text-primary-foreground` (black light / white dark).
- Outline: `variant="outline"` with `border-border`.
- Ghost: nav secondary actions (Login).

### Price badge

```html
<div class="border bg-price text-price-foreground w-fit px-2 py-1 text-sm font-medium">
  Rp85.000
</div>
```

### Nav pill (active segment)

```html
<a class="pill-active px-4 py-1.5 text-sm font-medium">Home</a>
<a class="pill-inactive px-4 py-1.5 text-sm font-medium">Catalog</a>
```

### Search input

- Full width, `border border-input bg-background`, search icon left.
- Placeholder: `text-muted-foreground`.

### Filter accordion (sidebar)

- Sections: Filters, Price, Tags — `border rounded-md`, chevron right.
- Expandable; use shadcn Accordion when implemented.

---

## Dark mode checklist

- [ ] Page background is `--background`, not pure `#000` text on `#000` cards.
- [ ] Borders remain visible (`--border` at ~14% white).
- [ ] Primary CTA inverts (white button, dark text).
- [ ] Price badge stays vivid with readable `--price-foreground`.
- [ ] Hard shadow uses `--shadow-hard` (white offset in dark mode).
- [ ] Muted text meets contrast on `background` and `card`.

---

## Accessibility (WCAG 2.2 AA target)

- Keyboard-first: all interactive elements focusable; visible focus rings.
- Price badges: contrast ratio ≥ 4.5:1 for badge text.
- Do not rely on color alone for order status — pair with label text.
- Touch targets ≥ 44×44px on mobile nav and primary actions.

---

## Content tone

Concise, marketplace-neutral English. Currency always `Rp` + Indonesian grouping (`Rp1.250.000`). Role names capitalized: Buyer, Seller, Driver, Admin.

---

## Anti-patterns

- Raw `bg-pink-400`, `text-black`, `border-black` in components.
- Teal or other off-palette primaries (superseded by monochrome + pink price).
- Soft drop shadows only — prefer hard offset shadow on catalog cards.
- Hiding focus outlines.
- Light-mode-only borders that disappear in dark mode.

---

## QA checklist (before shipping UI)

1. Toggle light/dark on: landing, catalog, product detail, sign-in, seller dashboard.
2. Product cards show price badge with `bg-price`.
3. Primary buttons readable in both themes.
4. Borders visible on cards, inputs, tables in both themes.
5. No `slate-*`, `zinc-*`, or hex literals in `components/` (except `components/ui` shadcn internals).
6. Responsive: mobile 2-col grid, desktop 4-col; navbar collapses to sheet.

---

## Migration notes

- Previous teal `--primary` replaced by neutral black/white CTA per Funroad reference.
- Semantic status tokens unchanged for order lifecycle.
- Update legacy `from-primary/15` gradient placeholders toward neutral `bg-muted` when touching those components.
