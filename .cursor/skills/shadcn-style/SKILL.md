---
name: shadcn-style
description: >-
  Build and restyle Vue admin UI with this repo's shadcn-vue New York system.
  Use when adding or editing views, layouts, forms, tables, sidebar, dialogs,
  buttons, cards, or any visual page; when the user mentions shadcn, New York,
  UI kit, макет, or admin chrome; and before introducing a new UI primitive.
---

# shadcn-vue style (go-store-admin)

This app is **shadcn-vue New York**, TypeScript, Lucide, CSS variables, `baseColor: neutral`. See `components.json`.

Read this skill before writing Vue UI. Match existing pages — do not paste shadcn-admin demo chrome.

## Stack

- Primitives live in `src/components/ui/<name>/` and export from `index.ts`.
- Import as `@/components/ui/<name>` (alias `ui`).
- Merge classes with `cn()` from `@/lib/utils`.
- Icons: `lucide-vue-next` only.
- Toasts: `useToast` from `@/components/ui/toast`.
- Tables: `@/components/data-table/*` (`DataTable`, `DataTableColumnHeader`, `DataTableRowActions`).
- Layout: `DefaultLayout` (sidebar + breadcrumbs) or `AuthLayout`. New authenticated pages use `APP_LAYOUT.DEFAULT`.
- Script setup, Prettier import order: `^vue`, `^@/`, `^[./]`.

## Reuse first

1. Search `src/components/ui/` for an existing primitive.
2. Search `src/components/` and `src/views/` for the same screen type (list, edit, filters).
3. Only add a shadcn-vue component if it is missing. Keep New York + Lucide. Do not mix other kits (MUI, Naive, Element, raw HTML controls).

Do not invent parallel buttons, inputs, selects, dialogs, or tables.

## Visual language

Use semantic tokens, not hex / rgb / arbitrary palette colors:

`bg-background`, `text-foreground`, `text-muted-foreground`, `bg-muted`, `bg-card`, `border-border`, `bg-primary`, `text-primary-foreground`, `bg-destructive`, `bg-accent`, `ring-ring`.

Exceptions: a single status accent already used in-app (e.g. `text-amber-500` for warnings).

Typical density:

- Page shell: `main` with `grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8`
- Toolbar / header actions: `Button size="sm" class="h-7 gap-1"` and icons `h-3.5 w-3.5`
- Compact filters: `SelectTrigger` with `h-8`
- Icon+label that collapses on mobile: `sr-only sm:not-sr-only sm:whitespace-nowrap`
- Navigation: `as-child` + `router-link`, never `href="#"`

## Screen recipes

**List:** one `Card` — `CardHeader` (title + description + real actions) → `CardContent` (`DataTable` or domain table). Footer only if the number is real (pagination total). No dummy All/Active/Draft tabs. No Filter/Export unless wired to the API.

**Create/Edit:** top bar (back `variant="outline"` + title + Save) then `main` `grid grid-cols-1 lg:grid-cols-3 gap-6`. Primary form in `col-span-2`, side cards for media / meta.

**Filters:** `Label` + `Select`/`Input` in the card header. Every control must change query or local filter state.

**Sidebar:** only real routes. Flatten a group that has a single child. Collapsible only when there are 2+ destinations. User menu: identity + logout. No Projects / Settings / Upgrade / Billing placeholders.

Copy for new admin surfaces: **Russian**. Do not ship English shadcn demo strings (`Upgrade to Pro`, `Select a fruit`, `m@example.com`, `Get Started`, “sales performance”).

## Forbidden leftovers

- Sample `data` objects, dummy users, `#` links, unused `Tabs` wrappers
- Dead buttons (Export, Filter, More) without handlers
- Second auth column / decorative empty `bg-muted` panels
- New CSS files or one-off color systems beside `src/assets/index.css` tokens
- Rewriting primitives in `src/components/ui/` unless fixing a bug in that file

## Checklist

- [ ] Primitive already exists in `src/components/ui/`
- [ ] Page follows an existing list or form recipe
- [ ] Tokens + Lucide + `cn()`
- [ ] Every control and nav item does something
- [ ] No shadcn-admin sample chrome
- [ ] New copy in Russian

For markup templates see [pages.md](pages.md).
