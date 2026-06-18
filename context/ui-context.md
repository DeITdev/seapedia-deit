# UI Context

## Theme

SEAPEDIA supports **both dark and light mode**. Light/dark is a mandatory feature with a visible theme toggle in the navigation, and the chosen theme persists across sessions. The visual language is a clean, modern marketplace UI (inspired by platforms like Tokopedia, Shopee, and Lazada, but original).

All colors are defined as CSS custom properties in `globals.css` and mapped to Tailwind via the shadcn/ui token convention. Components must use these tokens — no hardcoded hex values and no raw Tailwind color classes (e.g. `slate-*`, `zinc-*`). Every token must resolve correctly in both light and dark mode.

### Theming mechanism

- Use `next-themes` with `class`-based dark mode (`<html class="dark">`).
- The theme toggle is a client component placed in the navbar.
- Default to system preference on first load.

### Token Set (shadcn/ui convention)

Define both `:root` (light) and `.dark` (dark) values for each. Reference via Tailwind utilities (`bg-background`, `text-foreground`, `bg-card`, `text-muted-foreground`, `border-border`, `bg-primary`, `text-primary-foreground`, etc.).

| Token                    | Role                                  |
| ------------------------ | ------------------------------------- |
| `--background`           | Page background                       |
| `--foreground`           | Primary text                          |
| `--card`                 | Card / surface background             |
| `--card-foreground`      | Text on cards                         |
| `--popover`              | Popover / dropdown background         |
| `--popover-foreground`   | Text on popovers                      |
| `--primary`              | Brand / primary action                |
| `--primary-foreground`   | Text on primary                       |
| `--secondary`            | Secondary surfaces/actions            |
| `--secondary-foreground` | Text on secondary                     |
| `--muted`                | Muted surface                         |
| `--muted-foreground`     | Muted/secondary text                  |
| `--accent`               | Accent surface for hover/highlight    |
| `--accent-foreground`    | Text on accent                        |
| `--destructive`          | Errors / destructive actions          |
| `--border`               | Default border                        |
| `--input`                | Input border                          |
| `--ring`                 | Focus ring                            |

Semantic state colors (used for order status, validation, badges) should also be defined as tokens with light/dark variants:

| Token         | Role                                   |
| ------------- | -------------------------------------- |
| `--success`   | Success / completed (`Pesanan Selesai`) |
| `--warning`   | Waiting / in-progress states           |
| `--info`      | Informational                          |
| `--danger`    | Returned / failed (`Dikembalikan`)     |

The exact hex values are chosen during scaffolding (shadcn `init` generates a sensible default palette). Keep a single accent/brand hue for SEAPEDIA and reuse it consistently.

## Typography

- UI font: a clean modern sans (e.g. Geist Sans or Inter) loaded via `next/font`.
- Optional mono font for codes (voucher/promo codes, order IDs).
- Fonts applied as CSS variables on `<html>`; base `body` uses the sans with `antialiased`.

## Border Radius

Radius increases with surface depth — smaller for inner elements, larger for outer containers.

| Context           | Class         |
| ----------------- | ------------- |
| Inline / small UI | `rounded-md`  |
| Buttons / inputs  | `rounded-lg`  |
| Cards / panels    | `rounded-xl`  |
| Modal / overlay   | `rounded-2xl` |

Use shadcn's `--radius` token as the base and scale from it consistently.

## Component Library

shadcn/ui on top of Tailwind. Components live in `components/ui/` and are added via the `shadcn` CLI rather than handwritten. Do not modify `components/ui/*` (see `ai-workflow-rules.md`); build feature UI in app-level components.

Likely-needed shadcn primitives across levels: `button`, `input`, `textarea`, `label`, `card`, `badge`, `dialog`, `dropdown-menu`, `select`, `table`, `tabs`, `form`, `sonner` (toasts), `avatar`, `separator`, `sheet` (mobile nav), `skeleton`.

## Marketplace Components (app-level)

- **Navbar / Top Bar** — logo, catalog link, search; theme toggle; differs for guest vs logged-in.
  - Guest: Login / Register actions, no dashboard links.
  - Logged-in: active-role badge, role switcher, profile/dashboard entry, logout.
- **Footer / Bottom Navigation** — responsive; bottom nav on mobile, footer on desktop.
- **Product Card** — image, name, price, store name; links to product detail. Used in catalog grid.
- **Product Detail** — read-only for guests; store info block; add-to-cart only for active Buyer.
- **Role Selection** — page or modal shown after login when a non-admin user owns multiple roles.
- **Role Badge** — clearly shows the active role in the UI.
- **Dashboard Shells** — Admin, Seller, Buyer, Driver layouts with role-appropriate navigation.
- **Order Status Tracker / Timeline** — shows the five main statuses with timestamps; color-coded via state tokens.
- **Checkout Summary** — line items for subtotal, discount, delivery fee, PPN 12%, and final total.
- **Review Form + Review List/Carousel** — public application reviews; comments rendered as safe plain text.

## Layout Patterns

- Public pages: top navbar, centered max-width content, responsive product grid, footer.
- Dashboards: sidebar (or top tabs) navigation per role + content area; collapses to a `sheet`/drawer on mobile.
- Modals/dialogs: centered overlay, `rounded-2xl`, backdrop, used for role selection, confirmations, and discount entry.
- Tables (orders, products, monitoring) are responsive and degrade to stacked cards on small screens.

## Responsiveness

- Mobile-first; verify desktop and mobile layouts.
- Navigation must clearly differ between guest and logged-in states on both breakpoints.

## Icons

Lucide React. Stroke-based icons. Sizes: `h-4 w-4` inline, `h-5 w-5` in buttons, `h-8 w-8` for empty-state/feature icons.
