---
name: Synelia Feedback — Enquête Satisfaction
description: Plateforme d'écoute anonyme pour le Pôle Développement de Groupe Synelia
colors:
  primary: "#6759A2"
  primary-dark: "#453A78"
  primary-night: "#2E2751"
  primary-lav: "#A99FD0"
  primary-mist: "#EDEAF6"
  accent: "#0B7D7B"
  accent-mist: "#E3F7F6"
  sky: "#8CD0F4"
  blue-link: "#1668A8"
  blue-mist: "#E7F4FC"
  ink: "#1C1B2E"
  slate: "#4A4660"
  gray-text: "#6E6985"
  gray-rule: "#928DA6"
  gray-light: "#F4F3F8"
  border: "#E2DFEC"
  white: "#FFFFFF"
  success: "#0E7A50"
  success-graph: "#1FB980"
  warning: "#8F5500"
  warning-graph: "#F5A623"
  error: "#C42B30"
  error-graph: "#E5484D"
  success-mist: "#E6FAF4"
  warning-mist: "#FEF5E6"
  error-mist: "#FDECEC"
typography:
  display:
    fontFamily: "Cambria, Georgia, 'Times New Roman', serif"
    fontSize: "clamp(1.75rem, 4vw, 2.25rem)"
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: "normal"
  headline:
    fontFamily: "Cambria, Georgia, 'Times New Roman', serif"
    fontSize: "clamp(1.25rem, 2.5vw, 1.5rem)"
    fontWeight: 700
    lineHeight: 1.2
  title:
    fontFamily: "Cambria, Georgia, 'Times New Roman', serif"
    fontSize: "1.125rem"
    fontWeight: 700
    lineHeight: 1.25
  body:
    fontFamily: "Calibri, Carlito, 'Segoe UI', system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "normal"
  label:
    fontFamily: "Calibri, Carlito, 'Segoe UI', system-ui, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 600
    lineHeight: 1.4
  micro:
    fontFamily: "Calibri, Carlito, 'Segoe UI', system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 400
    lineHeight: 1.4
  mono:
    fontFamily: "'JetBrains Mono NL', 'JetBrains Mono', 'Cascadia Code', Consolas, 'SF Mono', Menlo, 'Courier New', monospace"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.6
rounded:
  sm: "6px"
  md: "10px"
  lg: "16px"
  pill: "999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  2xl: "48px"
  3xl: "64px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.white}"
    rounded: "{rounded.md}"
    padding: "12px 24px"
    typography: "Cambria, Georgia, serif"
  button-primary-hover:
    backgroundColor: "{colors.primary-dark}"
    textColor: "{colors.white}"
    rounded: "{rounded.md}"
    padding: "12px 24px"
  button-accent:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.white}"
    rounded: "{rounded.md}"
    padding: "12px 24px"
    typography: "Cambria, Georgia, serif"
  button-accent-hover:
    backgroundColor: "#096463"
    textColor: "{colors.white}"
    rounded: "{rounded.md}"
    padding: "12px 24px"
  button-secondary:
    backgroundColor: "{colors.white}"
    textColor: "{colors.primary-dark}"
    rounded: "{rounded.md}"
    padding: "12px 24px"
  card:
    backgroundColor: "{colors.white}"
    rounded: "{rounded.lg}"
    padding: "{spacing.lg}"
  badge-neutral:
    backgroundColor: "{colors.primary-mist}"
    textColor: "{colors.primary-dark}"
    rounded: "{rounded.pill}"
    padding: "4px 10px"
  badge-success:
    backgroundColor: "{colors.success-mist}"
    textColor: "{colors.success}"
    rounded: "{rounded.pill}"
    padding: "4px 10px"
  badge-error:
    backgroundColor: "{colors.error-mist}"
    textColor: "{colors.error}"
    rounded: "{rounded.pill}"
    padding: "4px 10px"
  badge-info:
    backgroundColor: "{colors.blue-mist}"
    textColor: "{colors.blue-link}"
    rounded: "{rounded.pill}"
    padding: "4px 10px"
---

<!-- SPEC-SOURCED: tokens extracted from Synelia Design System v6.3 (authoritative brand documentation). Re-run /impeccable document once application code exists to verify implementation alignment. -->

# Design System: Synelia Feedback — Enquête Satisfaction

## Overview

**Creative North Star: "The Confidential Clearinghouse"**

This is a calm, purposeful instrument — not a consumer app, not an HR evaluation portal. The interface serves one consequential purpose: providing Synelia's developers a trusted channel to deposit honest truths about their work experience, knowing those truths will be read collectively and never traced back to any individual. The design's restraint is its message. When nothing competes for attention, the act of responding feels significant rather than routine.

The visual world is built on Synelia's authoritative brand system (v6.3), using the **technical accent — Lagon Profond** — in place of the standard blue. This is the correct signal for a tool used by and built for a developer team: precise, unobtrusive, professional. Violet grounds the institutional identity. Lagon marks what is actionable. Generous white space communicates that this is a listening environment, not a data-extraction exercise. The admin dashboard is the other face of the same world: data-forward and efficient, built for scanning rather than browsing.

The anti-reference is clear: this must never feel like a bureaucratic HR form. No formal assessment language, no role fields, no compliance tone. The anonymity guarantee is not stated — it is demonstrated structurally: no login, no email field, no name field. Trust is built through absence, not reassurance.

**Key Characteristics:**
- Violet authority anchors institutional identity; lagon precision marks every interactive element
- Generous spacing signals respect — the survey is unhurried, not a timed test
- Cambria headings do the hierarchy work; decoration is absent by design
- Anonymity is architecturally demonstrated, not advertised
- Two faces: the public form (reassuring, spacious) and the admin dashboard (dense, precise)

## Colors

A violet-dominant palette with a single technical accent. The proportions follow the 60/30/10 rule: violet and white occupy the dominant surface, lagon carries the 20–30% accent role, neutrals and functional colors fill the remaining 10%.

### Primary

- **Corporate Amethyst** (#6759A2): The Synelia signature color — primary buttons, table headers, navigation backgrounds, primary aplats. The brand's visual anchor.
- **Deep Amethyst** (#453A78): Every heading at every level, hover states for primary interactive elements, Cambria title text. The authority color.
- **Midnight Amethyst** (#2E2751): Full-bleed section backgrounds, footer, dark covers. Used when the page needs to breathe in depth.
- **Pale Amethyst** (#A99FD0): Soft borders on decorative elements, disabled state fills, illustration accents. Never for text.
- **Ghost Amethyst** (#EDEAF6): Section fill backgrounds, neutral callout surfaces, subtle hover tints on secondary buttons.

### Secondary (Technical Accent — this product's active accent)

- **Technical Teal** (#0B7D7B): The sole interactive accent for this product. Primary CTAs, focus rings, selected form states, active navigation indicators, chart series 1. Replaces standard blue in this technical context everywhere.
- **Teal Wash** (#E3F7F6): Data zone backgrounds, focused input tint, technical callout fills, subtle chart area fills.

### Tertiary (Semantic information — distinct from the interactive accent)

- **Information Blue** (#1668A8): Semantic information callouts and badges only — not used as a second interactive accent. Shares the role of "neutral information signal" distinct from lagon's active/selected role.
- **Sky Synelia** (#8CD0F4): Decorative detail only — underlines, graphical highlights, accent splotches on dark violet backgrounds. Contrast ratio 1.69 on white: never used for text or interactive elements on light backgrounds.
- **Sky Mist** (#E7F4FC): Background fill for information callouts.

### Neutral

- **Ink** (#1C1B2E): All primary body text, the darkest readable value. Contrast 16.86 on white.
- **Slate** (#4A4660): Secondary text, form helper copy, citations, chapô within components. Contrast 8.99.
- **Note Grey** (#6E6985): Legends, placeholder text, footnotes, timestamps, helper text, character counts. Minimum text size: 12px. Contrast 5.22.
- **Rule Grey** (#928DA6): Borders, dividers, separators — never used for text (contrast 3.19, passes for UI elements only).
- **Surface Grey** (#F4F3F8): Alternating table row background, subtle surface differentiation.
- **Component Border** (#E2DFEC): Default card and input borders. The standard boundary color.
- **White** (#FFFFFF): Primary page background, card surfaces, form fields.

### Functional

- **Success Text** (#0E7A50) / **Success Signal** (#1FB980): Validation states, positive indicators — text uses the AA-passing deep value only.
- **Warning Text** (#8F5500) / **Warning Signal** (#F5A623): Cautionary states — text uses the deep value only. The graphic value fails AA on white and must not carry text.
- **Error Text** (#C42B30) / **Error Signal** (#E5484D): Error states — the graphic value may be used as a field border contour (contrast 3.91 for UI elements), never as text.

### Named Rules

**The One Accent Rule.** Lagon Profond (#0B7D7B) is the sole interactive accent on every surface of this product. It replaces Bleu Lien (#1668A8) for all buttons, focus rings, selected states, and active indicators. Never use both at the same weight in the same surface. Information Blue (#1668A8) appears only where semantic "information" meaning is needed (info callouts, info badges) — never as a second interactive accent.

**The No-Gold Rule.** Gold (#C2A24C) and its variants are reserved for VIP/institutional documents approved by the Secrétariat Général. They have no role in this internal developer tool.

**The Graphic-Only Rule.** Colors with a contrast ratio below 4.5:1 on white (#8CD0F4, #F5A623, #1FB980, #E5484D, #928DA6, #A99FD0, #F26D50, #17BEBB, #C2A24C) must never carry text on light backgrounds. They are reserved for aplats, borders, chart fills, and pictograms.

## Typography

**Display Font:** Cambria (with Georgia, 'Times New Roman', serif)
**Body Font:** Calibri (with Carlito, 'Segoe UI', system-ui, sans-serif)
**Code Font:** JetBrains Mono NL (with JetBrains Mono, 'Cascadia Code', Consolas)

**Character:** Cambria brings serene institutional authority to headings — legible at screen distances without the formality of Times New Roman. Calibri's deliberate neutrality in body copy keeps reading efficient without feeling cold. The pair avoids the startup-template monotony of Roboto/Inter while remaining accessible on any device (both ship with Microsoft Office on Mac and Windows). JetBrains Mono NL, used for any code snippets in the admin view, distinguishes itself with clear 0/O and 1/l/I differentiation — correct defaults for developer audiences.

### Hierarchy

- **Display** (Cambria Bold, clamp(1.75rem, 4vw, 2.25rem) / 1.15 lh): Page-level titles. The survey landing headline ("Votre avis compte"). One per major section. Color: Deep Amethyst (#453A78).
- **Headline** (Cambria Bold, clamp(1.25rem, 2.5vw, 1.5rem) / 1.2 lh): Section titles in the admin dashboard, question group headings. Color: Deep Amethyst.
- **Title** (Cambria Bold, 1.125rem / 1.25 lh): Individual question labels, card titles, table section headers. Color: Deep Amethyst.
- **Body** (Calibri Regular, 1rem / 1.5 lh, max-width ~65ch): All prose, question option labels, form help copy, description paragraphs. Color: Ink (#1C1B2E).
- **Label** (Calibri Semibold 600, 0.9375rem / 1.4 lh): Form field labels, navigation items, table column headers (Cambria Bold on table header rows). Color: Ink or Deep Amethyst per context.
- **Micro** (Calibri Regular, 0.75rem / 1.4 lh): Character counts, timestamps, footnotes, legend captions. Color: Note Grey (#6E6985) only.

### Named Rules

**The Cambria Titles Rule.** Every heading — H1 through H6 — uses Cambria Bold in Deep Amethyst (#453A78), regardless of visual size. Calibri headings, Georgia headings, and color deviations are off-brand.

**The 1rem Floor Rule.** Calibri body text is set at minimum 1rem (16px). Calibri's x-height (0.478em) makes it appear smaller than equivalent fonts — it reads thin and dense at 14px. The 0.9375rem label scale is the floor for interface labels only; never for prose or question option text.

## Layout

Base grid: 8px. All spacing, padding, margin, and gap values are multiples of 8px. The 4px half-step is reserved for tight intra-component spacing (internal icon gaps, checkbox-to-label alignment). The 12px value (a deliberate half-step used in button and cell padding) appears in component specs only.

**Survey container:** max-width 720px, centered, with form content capped at 600px for comfortable line lengths on desktop. Padding: 3xl (64px) vertical, md–lg (16–24px) horizontal.

**Admin container:** max-width 1200px. Fixed sidebar navigation on desktop (240px wide), collapsing to bottom tab bar on mobile. Main content area uses a 2–3 column responsive card grid for KPIs, single column for tables and charts.

**Breakpoints:** mobile < 640px · tablet 640–1024px · desktop > 1024px. The public survey must be fully usable at 320px with 44×44px minimum touch targets.

**Density:** Medium-low on the public form — generous question spacing (2xl: 48px between questions) signals unhurried attention. Medium-high on the admin dashboard — tighter card grid (lg: 24px gap) for efficient information scanning.

**Spacing rhythm:** Inside cards use md (16px) for tight clusters, lg (24px) for section padding. Between cards: lg (24px) to xl (32px). Section separations: 2xl (48px) to 3xl (64px).

## Elevation & Depth

The system is structurally flat with three deliberate shadow levels. Shadows communicate hierarchy — a surface floating above the page — not decoration or polish. There are no gradients, inner glows, or ambient bloom effects.

### Shadow Vocabulary

- **shadow-sm** (`0 1px 3px rgba(46,39,81,0.08)`): Cards at rest, form panels, table wrappers. The default container shadow — barely visible, structurally useful.
- **shadow-md** (`0 6px 18px rgba(46,39,81,0.12)`): Modals, dropdown menus, floating panels, date pickers. One level above the resting surface.
- **shadow-lg** (`0 14px 40px rgba(46,39,81,0.16)`): Full dialogs and drawers. Used sparingly — one per viewport at most.

The shadow tint is derived from Midnight Amethyst (#2E2751), which keeps depth in the violet family rather than introducing generic grey haze.

### Named Rules

**The Flat-by-Default Rule.** Surfaces are flat at rest. Shadow appears only to communicate structural elevation (a card above the page, a modal above content). It is never applied decoratively. Hover effects use background color transitions, not shadow amplification.

## Shapes

The form language is gently geometric: meaningful curvature that signals modern, interactive surfaces without the soft-bubble feel of consumer apps.

- **radius-sm** (6px): Badges, status chips, small tags, pagination dots, inner elements within compound components.
- **radius-md** (10px): Buttons, input fields, checkboxes, dropdown menus, tooltip containers. The default interactive radius — tactile without being playful.
- **radius-lg** (16px): Cards, modal containers, panel wrappers, floating drawers. The container radius.
- **radius-pill** (999px): Status indicators, progress dots, loading spinners. Full-circle rounding — only where the semantic meaning calls for it (never for standard buttons).

**Borders:** `1px solid #E2DFEC` (Component Border) on cards and inputs at rest. Focus state: `2px solid #0B7D7B` (Technical Teal). Error state: `2px solid #E5484D`. The 1→2px transition on focus is intentional: the extra pixel communicates active state without relying on color alone.

**Form language:** The 10px radius on inputs is clinical but not cold. The visible border at rest (not just on focus) ensures keyboard users always see the field boundary. The lagon focus ring adds color-layer confirmation for pointer users.

## Components

### Buttons

Cambria Bold labels on all button variants — this keeps the button typographically consistent with the heading family and prevents it from disappearing into Calibri body copy. The accent button (lagon) is the preferred CTA on the public survey.

- **Shape:** radius-md (10px), padding 12px 24px
- **Primary (violet):** Background #6759A2, text white / Hover: #453A78, translateY(-1px) / Focus: 3px offset #0B7D7B ring / Active: translateY(0)
- **Accent (lagon — preferred survey CTA):** Background #0B7D7B, text white / Hover: #096463, translateY(-1px) / Focus: 3px offset #453A78 ring
- **Secondary:** White background, #453A78 text, 2px border #6759A2 / Hover: #EDEAF6 background
- **Ghost:** No background, #0B7D7B or #453A78 text, underline on hover — used for tertiary actions
- **Disabled:** #928DA6 background, #6E6985 text, cursor not-allowed, no transform

### Survey Rating Scale (1–5)

The signature component — the satisfaction score widget — conveys five distinct choices without emoji, color semantics, or gamified fills. The selection is communicated by the lagon border and teal wash background. Labels sit below the numeral.

- 5 items in horizontal flex row, gap sm (8px). Wraps to 3+2 on mobile, never single column.
- Each item: radius-md, padding lg (24px) vertical, xl (32px) horizontal, min touch target 44×44px
- Numeral: Cambria Bold, ~1.75rem, Slate (#4A4660) unselected
- **Unselected:** white background, 1px border #E2DFEC, Slate numeral
- **Hover:** Ghost Amethyst (#EDEAF6) background
- **Selected:** Teal Wash (#E3F7F6) background, 2px border #0B7D7B, Deep Amethyst numeral
- Label text: Micro (0.6875rem), Note Grey (#6E6985), centered below numeral

### Cards

Clean containers floating off the white page with minimal visual weight.

- **Corner Style:** radius-lg (16px)
- **Background:** White (#FFFFFF)
- **Shadow:** shadow-sm
- **Border:** 1px solid #E2DFEC
- **Internal Padding:** lg (24px) all sides
- **Title:** Cambria Bold, Deep Amethyst (#453A78)
- **KPI card accent bar (admin):** Optional 3px top border in Technical Teal (#0B7D7B)

### Inputs / Form Fields

- **Style:** radius-md (10px), 1px border #E2DFEC at rest, white background
- **Placeholder:** Note Grey (#6E6985)
- **Focus:** 2px border #0B7D7B, Teal Wash (#E3F7F6) background tint. The 1→2px border shift communicates state change independent of color.
- **Error:** 2px border #E5484D, Error Mist (#FDECEC) background tint, Error Text (#C42B30) helper message below field
- **Textarea:** Same rules; min-height 120px; resize-y; character counter in micro text (Note Grey) at bottom-right
- **Radio / Checkbox:** Custom styled — lagon fill on selection (#0B7D7B), radius-sm for checkbox square, full circle for radio. Labels in body typography.

### Tables (Admin)

- **Header:** Background #6759A2, white text, Cambria Bold
- **Even rows:** Surface Grey (#F4F3F8)
- **Odd rows:** White (#FFFFFF)
- **Cell borders:** 1px #E2DFEC
- **Cell padding:** 8px 12px
- **Row hover:** Ghost Amethyst (#EDEAF6) tint, 3px left accent border in Technical Teal
- **Clickable rows:** cursor pointer; row expand on click reveals free-text detail panel

### Callouts

Left-bordered notification panels. Used in the survey for the anonymity notice and in the admin for export warnings, filter caveats, and data retention notices.

- **Structure:** 4px solid left border, background fill, text in Ink (#1C1B2E), body typography
- **Information:** border #2C7FC0, background #E7F4FC
- **Success:** border #0E7A50, background #E6FAF4
- **Warning:** border #8F5500, background #FEF5E6
- **Error / Critical:** border #C42B30, background #FDECEC

### Badges

Pill-shaped status indicators used in the admin response table and filter tags.

- **Shape:** radius-pill, padding 4px 10px, Cambria Bold 11px minimum
- **Neutral:** #EDEAF6 background, #453A78 text (contrast 8.31)
- **Success:** #E6FAF4 background, #0E7A50 text (contrast 4.94)
- **Warning:** #FEF5E6 background, #8F5500 text (contrast 5.60)
- **Error:** #FDECEC background, #C42B30 text (contrast 4.92)
- **Info:** #E7F4FC background, #1668A8 text (contrast 5.24)

### Navigation (Admin)

- **Desktop:** Fixed sidebar, 240px, Midnight Amethyst (#2E2751) background, white text. Active item: Technical Teal left border (3px) + Ghost Amethyst tint. Hover: slight white opacity overlay.
- **Mobile:** Bottom tab bar, 5 items maximum, Corporate Amethyst (#6759A2) background, white icons + labels. Active tab: Technical Teal top border (3px).
- **Typography:** Calibri Regular label, 0.875rem, icon-above-label layout on mobile.

## Do's and Don'ts

### Do:

- **Do** use Lagon Profond (#0B7D7B) as the single interactive accent everywhere — CTAs, focus rings, selected states, chart series 1.
- **Do** use Cambria Bold in Deep Amethyst (#453A78) for every heading at every level.
- **Do** set Calibri body at minimum 1rem (16px) — Calibri at 14px feels thin on screen due to its low x-height.
- **Do** give survey questions 48px (2xl) of vertical breathing room between them.
- **Do** demonstrate anonymity structurally — no email field, no name field, no login prompt — rather than announcing it in copy.
- **Do** use only the WCAG AA–verified color combinations from the Synelia design system for any text-on-background pairing.
- **Do** use `1px solid #E2DFEC` as the default card and input border at rest.
- **Do** shift from 1px to 2px border on focus — the extra pixel communicates state change independent of color.

### Don't:

- **Don't** make the public survey feel like a corporate HR evaluation form — no formal assessment language, no role/department fields, no employee-number context.
- **Don't** use Gold (#C2A24C) or any of its variants anywhere in this product.
- **Don't** add emoji to any interface element.
- **Don't** use Bleu Lien (#1668A8) as a second interactive accent — it appears only in semantic "information" callouts and info badges.
- **Don't** use Sky Synelia (#8CD0F4) for text, buttons, or interactive elements on white backgrounds — its contrast ratio is 1.69, far below the minimum.
- **Don't** apply the warning graphic (#F5A623) or success graphic (#1FB980) as callout border colors — they fall below 3:1 on their respective mist backgrounds.
- **Don't** use rounded-pill (999px) for standard buttons — button radius is radius-md (10px).
- **Don't** apply shadow-md or shadow-lg to cards at rest — shadow-sm is the resting elevation; higher shadows are reserved for overlaid layers.
- **Don't** filter the admin response table to groups smaller than ~5 respondents — small groups risk re-identification from free-text content.
