# CLAUDE.md — Bulk Upload Flow Prototype

## Purpose
This project prototypes the full bulk bill upload flow for FMX Utility Manager (GA Revisions initiative). See `docs/utility-manager-design-brief.md` for full product context and requirements.

## Entry Point
`index.html` is the starting file — a vanilla HTML prototype of the bulk-upload-bills screen. All new screens beyond this baseline must be built as **React components**.

## Design System
- Tokens (colors, spacing, typography, radius, shadows): `src/tokens.js`
- Component patterns and usage notes: `src/components/README.md`
- Font: Figtree via Google Fonts. Icons: Font Awesome 6.5.0 free (`fa-solid` / `fa-regular`).

## Rules
- React for all new components — no new vanilla HTML files.
- No external CSS frameworks (no Tailwind CDN, no Bootstrap).
- No build steps unless explicitly introduced. Keep it runnable in a browser.
- Use realistic placeholder data (see design brief §8). No Lorem Ipsum.
- Make interactions functional where they affect the flow — stub secondary screens if needed.
- Spec lives in `SPEC.md` — read it before building any new screen.
