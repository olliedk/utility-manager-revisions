# CLAUDE.md — Bulk Upload Flow Prototype

## Purpose
Prototypes the full bulk bill upload flow for FMX Utility Manager (GA Revisions initiative).
See `docs/utility-manager-design-brief.md` for full product context and requirements.

## Running the prototype
Requires an HTTP server (fragments are loaded via `fetch()` — `file://` won't work).

```bash
npx serve .          # or: python3 -m http.server 8080
```

Then open `http://localhost:3000` (or whatever port is shown).

## File structure

```
index.html                          # Shell: loads CSS, injects fragments, boots JS
src/
  css/
    tokens.css                      # :root CSS custom properties (design tokens)
    base.css                        # Reset, body, .main, .screen, #overlay
    sidebar.css                     # .sidebar and all child elements
    content-header.css              # .content-header, breadcrumbs, avatar, dropdowns
    toolbar.css                     # .toolbar, search, filter button, view-toggle
    components.css                  # Shared UI: buttons, badges, pagination, slideout shell, dropdown-menu
    screen-utilities.css            # Provider cards, bills table, empty state, data popover
    screen-upload.css               # Upload zone, file list, progress
    screen-review.css               # All review-flow styles (steps 1–4)
  js/
    data.js                         # PROVIDER_POOL, BILLS_DATA (static seed data)
    state.js                        # protoState, _retireProviders
    nav.js                          # Screen-switching functions (goTo*, goBack*, exit*)
    render.js                       # renderProviders(), renderBillsTable(), renderUtilities()
    interactions.js                 # Overlay helpers, dropdowns, slideouts, pagination, sidebar nav, ESC key
    upload.js                       # simulateUpload(), removeFile(), submitBills(), etc.
    review.js                       # Review-flow interactions (modals, slideouts, field-select, row menus)
    proto-data-selector.js          # toggleDataPopover() / closeDataPopover()
  screens/
    utilities.html                  # Screen 1 — Utilities (provider grid + bills table)
    bulk-upload.html                # Screen 2 — Bulk Upload
    review-buildings.html           # Screen 3 — Review Buildings (step 1 of 4)
    review-providers.html           # Screen 4 — Review Providers (step 2 of 4)
    review-fields.html              # Screen 5 — Review Fields (step 3 of 4)
  overlays/
    slideout-export.html            # Customize bill export slideout
    slideout-retire.html            # Retire provider slideout
    slideout-review-buildings.html  # Review building slideout (existing + new)
    slideout-review-providers.html  # Review provider slideout (pending + missing data)
    slideout-add-custom-field.html  # Add custom field slideout + shared #fieldSelectDropdown
    modal-map-address.html          # Map address to existing building modal
    modal-ignore-address.html       # Ignore address modal
    modal-map-name.html             # Map name to existing provider modal
    modal-ignore-provider.html      # Ignore provider name modal
```

## Design system
- **Tokens**: all in `src/css/tokens.css` as CSS custom properties (`--color-*`, `--space-*`, etc.)
- **Font**: Figtree via Google Fonts CDN
- **Icons**: Font Awesome 6.5.0 free (`fa-solid` / `fa-regular`)
  - The project loads the **free** FA6 CDN. Designs use FA6 Pro. Audit every icon and replace
    Pro-only `fa-regular` icons with their `fa-solid` free equivalents. For icons with no solid
    free equivalent substitute the closest free icon (e.g. `fa-regular fa-arrow-up-arrow-down`
    → `fa-solid fa-sort`).
  - Safe `fa-regular` icons in the free set: `bell`, `pen-to-square`, `building`,
    `calendar-days`, `bookmark`, `circle-question`.

## Conventions

### Screen switching
Screens live inside `#main`. Visibility is controlled by toggling `.active` on `.screen` divs.
All navigation is handled in `src/js/nav.js`.

### Overlays & slideouts
Overlays (modals, slideouts) live in `#overlays`. Each overlay file is a self-contained HTML
fragment. Slideout panels slide in from the right (480 px wide, `z-index: 700`).

The global `#overlay` div (click-outside handler, `z-index: 500`) lives directly in `index.html`
and is toggled by `showOverlay()` / `hideOverlay()` in `interactions.js`.

### DOM access rule
**All `document.getElementById()` / `document.querySelector()` calls must be inside functions**
(never top-level). Fragments are injected asynchronously — top-level DOM lookups will fail
because the target element does not exist when the script first executes.

### JS load order
Scripts are loaded in dependency order via `<script src="...">` tags in `index.html`:
`data` → `state` → `nav` → `render` → `interactions` → `upload` → `review` → `proto-data-selector`

### Adding a new screen
1. Create `src/screens/my-screen.html` with a root `<div class="screen" id="screenMyScreen">`.
2. Add the URL to the `SCREENS` array in `index.html`.
3. Add navigation functions in `src/js/nav.js`.
4. Add any screen-specific CSS to the appropriate file in `src/css/`.

### Adding a new overlay
1. Create `src/overlays/my-overlay.html`.
2. Add the URL to the `OVERLAYS` array in `index.html`.
3. Add open/close functions in the appropriate JS file (`interactions.js` or `review.js`).

## Rules
- No external CSS frameworks (no Tailwind CDN, no Bootstrap).
- No build steps — keep it runnable directly in a browser via HTTP server.
- Use realistic placeholder data (see design brief §8). No Lorem Ipsum.
- Make interactions functional where they affect the flow — stub secondary screens if needed.
- Spec lives in `SPEC.md` — read it before building any new screen.
