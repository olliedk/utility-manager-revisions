/**
 * Design tokens extracted from the FMX Utility Manager design system.
 * Source: index.html (bulk-upload-bills prototype, Figma token set).
 *
 * Use these in React components via inline styles, CSS-in-JS, or inject
 * into a <style> block as :root { } custom properties.
 */

// ── Sidebar ────────────────────────────────────────────────────────────────
export const sidenav = {
  bg:           '#f9f9fa',
  headerBg:     '#f9f9fa',
  footerBg:     '#f9f9fa',
  linkText:     '#38383d',
  linkIcon:     '#616161',
  activeBg:     '#87c8d9',
  activeText:   '#38383d',
  activeIcon:   '#38383d',
  collapseBtnBg:    '#dddddd',
  collapseBtnIcon:  '#616161',
};

// ── Content header ─────────────────────────────────────────────────────────
export const header = {
  bg:     '#ffffff',
  border: '#ededed',
};

// ── CTA buttons ────────────────────────────────────────────────────────────
export const cta = {
  primaryBg:       '#0d7f9b',
  primaryBgHover:  '#0a6a82',
  primaryText:     '#ffffff',
  tertiaryBg:      '#ffffff',
  tertiaryText:    '#616161',
  tertiaryBorder:  '#616161',
};

// ── Toolbar ────────────────────────────────────────────────────────────────
export const toolbar = {
  bg:      '#f5f5f5',
  divider: '#dddddd',
};

// ── Text ───────────────────────────────────────────────────────────────────
export const text = {
  primary:   '#38383d',
  secondary: '#767676',
  icon:      '#616161',
  hyperlink:         '#0a5f76',
  hyperlinkInactive: '#616161',
};

// ── Inputs ─────────────────────────────────────────────────────────────────
export const input = {
  bg:              '#ffffff',
  border:          '#8d9496',
  inactiveBg:      '#dddddd',
  inactiveBorder:  '#616161',
  addonBg:         '#dddddd',
};

// ── Upload zone ────────────────────────────────────────────────────────────
export const upload = {
  bg:     '#e7f4f7',
  border: '#87c8d9',
};

// ── Tag / multi-select badge ───────────────────────────────────────────────
export const tag = {
  bg:     '#f9f9fa',
  text:   '#38383d',
  border: '#767676',
};

// ── Status badges ──────────────────────────────────────────────────────────
export const status = {
  missingBg:   '#fde8d8',
  missingText: '#ce4b12',
  okBg:        '#d6f0da',
  okText:      '#0a7b20',
};

// ── Alert banner ───────────────────────────────────────────────────────────
export const alert = {
  infoBg:           '#eef2ff',
  infoBorder:       '#4f46e5',
  infoIconColor:    '#4f46e5',
};

// ── Shadows ────────────────────────────────────────────────────────────────
export const shadow = {
  cta:      '2px 5px 5px rgba(97,97,97,0.15)',
  dropdown: '1px 2px 5px rgba(97,97,97,0.35)',
  card:     '0 1px 3px rgba(0,0,0,0.08)',
};

// ── Border radius ──────────────────────────────────────────────────────────
export const radius = {
  s:    '4px',
  m:    '8px',
  pill: '100px',
};

// ── Dividers / borders ─────────────────────────────────────────────────────
export const border = {
  divider: '#ededed',
  light:   '#e2e8f0',
};

// ── Typography ─────────────────────────────────────────────────────────────
export const font = {
  family: "'Figtree', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  xs:   '12px',  // table headers, field labels
  s:    '14px',  // small / meta
  body: '15px',  // default body
  m:    '16px',  // nav items, buttons
  l:    '20px',  // card titles
  xl:   '24px',  // page titles, panel headers
};

// ── Page ───────────────────────────────────────────────────────────────────
export const page = {
  bg: '#f5f5f5',
};

// ── Spacing / layout ───────────────────────────────────────────────────────
export const spacing = {
  pagePaddingX: '32px',
  pagePaddingY: '16px',
  cardPadding:  '16px',
  gridGap:      '16px',
  sidebarWidth: '245px',
  headerHeight: '64px',
  toolbarHeight: '56px',
};

// ── Convenience: flat token map (for generating :root {} CSS vars) ─────────
export const cssVars = {
  '--sidenav-bg':               sidenav.bg,
  '--sidenav-header-bg':        sidenav.headerBg,
  '--sidenav-footer-bg':        sidenav.footerBg,
  '--sidenav-link-text':        sidenav.linkText,
  '--sidenav-link-icon':        sidenav.linkIcon,
  '--sidenav-active-bg':        sidenav.activeBg,
  '--sidenav-active-text':      sidenav.activeText,
  '--sidenav-active-icon':      sidenav.activeIcon,
  '--collapse-btn-bg':          sidenav.collapseBtnBg,
  '--collapse-btn-icon':        sidenav.collapseBtnIcon,
  '--header-bg':                header.bg,
  '--header-border':            header.border,
  '--cta-primary-bg':           cta.primaryBg,
  '--cta-primary-text':         cta.primaryText,
  '--cta-tertiary-bg':          cta.tertiaryBg,
  '--cta-tertiary-text':        cta.tertiaryText,
  '--cta-tertiary-border':      cta.tertiaryBorder,
  '--toolbar-bg':               toolbar.bg,
  '--toolbar-divider':          toolbar.divider,
  '--text-color':               text.primary,
  '--text-secondary':           text.secondary,
  '--text-icon':                text.icon,
  '--hyperlink':                text.hyperlink,
  '--hyperlink-inactive':       text.hyperlinkInactive,
  '--input-bg':                 input.bg,
  '--input-border':             input.border,
  '--input-inactive-bg':        input.inactiveBg,
  '--input-inactive-border':    input.inactiveBorder,
  '--input-addon-bg':           input.addonBg,
  '--upload-bg':                upload.bg,
  '--upload-border':            upload.border,
  '--tag-bg':                   tag.bg,
  '--tag-text':                 tag.text,
  '--tag-border':               tag.border,
  '--shadow-cta':               shadow.cta,
  '--shadow-dropdown':          shadow.dropdown,
  '--shadow-card':              shadow.card,
  '--radius-s':                 radius.s,
  '--radius-m':                 radius.m,
  '--radius-pill':              radius.pill,
  '--divider':                  border.divider,
  '--border-light':             border.light,
  '--font-xs':                  font.xs,
  '--font-s':                   font.s,
  '--font-body':                font.body,
  '--font-m':                   font.m,
  '--font-l':                   font.l,
  '--font-xl':                  font.xl,
  '--page-bg':                  page.bg,
};
