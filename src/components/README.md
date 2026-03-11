# Component Patterns

Documented from `index.html` (bulk-upload-bills prototype). All new screens should be built as React components following these patterns and using tokens from `../tokens.js`.

---

## Sidebar

**Structure:** fixed 245px left column, full viewport height, `overflow: hidden`.
**Parts:** topbar (collapse button), logo area (160px tall), scrollable nav list, footer.
**Nav items:** `<a>` with FA icon + label. Active state: `--sidenav-active-bg` fill, pill-rounded right edge (`border-radius: 0 100px 100px 0`).
**Collapse:** toggle class on sidebar to shrink to icon-only mode.

```jsx
<Sidebar>
  <SidebarNav>
    <NavItem icon="fa-solid fa-bolt" active>Utilities</NavItem>
    <NavItem icon="fa-regular fa-calendar-days">Calendar</NavItem>
  </SidebarNav>
</Sidebar>
```

---

## ContentHeader

**Structure:** white bar, 64px tall, flex row with `space-between`. Taller (`100px`) variant for pages with breadcrumbs.
**Left:** page title (`font-xl`, `700`) + optional breadcrumbs row below.
**Right:** `HeaderActions` group — icon buttons (notification bell with count, avatar) + primary CTA button.

```jsx
<ContentHeader>
  <PageTitle>Bulk Upload Bills</PageTitle>
  <HeaderActions>
    <NotificationButton count={3} />
    <Avatar src="..." />
    <Button variant="primary">Upload Bills ▾</Button>
  </HeaderActions>
</ContentHeader>
```

---

## Button

Three variants used in this prototype:

| Variant | Token | Notes |
|---|---|---|
| `primary` | `cta.primaryBg` teal, white text, `radius.s` | Main CTA. Use for the single primary action per page. |
| `tertiary` | White bg, `cta.tertiaryBorder` outline | Secondary / ghost. Cancel, back, settings. |
| `toolbar` | Transparent bg, hover `rgba(0,0,0,0.06)` | Text+icon buttons inside toolbar strip. |

All share: `font-m` (16px), `600` weight, `8px 16px` padding, `shadow.cta`, `0.12s` hover transition.
Dropdown variant: append a `fa-solid fa-caret-down` caret element.

---

## Toolbar

**Structure:** `56px` strip, `toolbar.bg` (`#f5f5f5`), full width below content header.
**Contents (left to right):** search input → `ToolbarDivider` → `ToolbarBtn` items → `ToolbarSpacer` → right-side action buttons.
**Search input:** white, `input.border`, `radius.s`, 260px wide, magnifying-glass icon on right.
**Divider:** `1px` solid `toolbar.divider`, `24px` tall, `0 8px` margin.

---

## Dropdown / Popover

Two flavours:

- **Simple dropdown** (e.g. "Upload Bills" menu): absolute, `radius.s`, `shadow.dropdown`, items 32px tall, `font-body`, hover `#f5f5f5`. Show/hide via `.open` class toggle.
- **Filter popover**: 340px wide, `radius.m`, header with title + close button, sectioned with labelled groups (uppercase 12px labels), footer with "Apply" CTA. Triggered from toolbar filter button.
- **Export dropdown**: 218px wide, sections separated by thin divider, icon+label items.

All popovers are `position: absolute` relative to their trigger wrapper, `z-index: 600`.

---

## SlideoutPanel

**Structure:** full-height panel slides in from right, `480px` wide, overlay backdrop.
**Parts:** `SlideoutHeader` (title, optional subtitle), `SlideoutBody` (scrollable, `gap: 20px` flex column of fields), `SlideoutFooter` (primary + cancel buttons).
**Animation:** `right: -480px` → `right: 0`, `transition: right 0.24s ease`. Overlay: `rgba(0,0,0,0.25)`.
**Fields:** label (uppercase `font-xs`, `font-weight: 600`) + input/select. Use `slideout-field` pattern.

---

## ProviderCard

**Structure:** white card, `radius.m`, `shadow.card`, `border: 1px solid divider`, `16px` padding.
**Layout:** top row (utility type icon + label, status badge, kebab menu) → provider name (large, `font-l 500`) → footer row (period tag + amount).
**Status badges:** pill shape (`radius.pill`), `height: 20px`, two variants: `status-missing` (orange tint) and `status-ok` (green tint).
**Period tag:** pill outline tag, `font-s`, `height: 28px`.
**Kebab menu:** `32px` square transparent button → context menu with View / Edit / Edit custom fields / Retire / Delete (Delete in destructive red).
**Grid:** `repeat(3, 1fr)`, `16px` gap.

```jsx
<ProviderCard
  type="Electric"
  typeIcon="fa-solid fa-bolt"
  name="Summit Ridge Energy"
  status="missing"
  period="Monthly"
  amount="$1,240.88"
/>
```

---

## AlertBanner

**Structure:** info banner, `border-left: 4px solid`, flex row with icon + text + dismiss button.
**Info variant:** `#eef2ff` bg, `#4f46e5` accent. Shown/hidden via `.visible` class.
**Pattern:** used to surface contextual prompts above the toolbar (e.g. "You can now bulk-upload bills via CSV").

---

## UploadZone

**Structure:** dashed border dropzone, `upload.bg` tint, centered icon + instructions.
**Icon:** large cloud-upload FA icon (`font-size: 36px`).
**File display:** after file selected, show file pill with FA `fa-regular fa-file` icon, filename, and `×` remove button.
**States:** idle (dashed, tinted), drag-over (highlight border), file-selected (file pills replace drop prompt).

---

## FormField / Select

**Standard select-style trigger button:** `height: 36px`, `input.border`, `radius.s`, caret icon on right.
**Date range pair:** two text inputs inside a shared border container, separated by an em-dash.
**Quick links:** small teal hyperlinks for preset ranges (e.g. "Last 30 days", "This year").
**Filter selects:** native `<select>` elements at `height: 34px` with matching border/radius tokens.

---

## Pagination

**Structure:** centered flex row — prev button, page indicators (dots or numbers), next button.
**Buttons:** `32px` square, `radius.s`, `border: 1px solid divider`, transparent bg, chevron icons.

---

## StatusBadge

Reusable pill for inline status display.

| Variant | bg | text |
|---|---|---|
| `missing` | `#fde8d8` | `#ce4b12` |
| `ok` | `#d6f0da` | `#0a7b20` |

Height `20px`, `radius.pill`, `padding: 0 8px`, `font-size: 11px / 600`.
