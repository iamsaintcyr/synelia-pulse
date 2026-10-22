# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Next.js (App Router) + TypeScript · Tailwind CSS · PostgreSQL on Neon · Drizzle ORM · Zod · Recharts · Vercel · Auth.js (standalone credentials for admin) · Vitest + Playwright · CSV/XLSX export

## Users

**Primary — anonymous respondents:** Developers of Synelia's Pôle Développement. They may work at headquarters, on client sites (régie), or remotely. They complete the survey once, anonymously, with no login.

**Secondary — administrator:** The Pôle Développement manager (and any explicitly authorized delegates). They access the secured `/admin` space to consult aggregated results, read individual responses, filter by period, and export data.

## Product Purpose

An internal anonymous feedback platform that lets Synelia's Pôle Développement developers share their work experience, recurring obstacles, and improvement wishes — without fear of identification. The manager uses the resulting data to define concrete collective improvement actions. This is a listening and improvement tool, not an individual HR evaluation system.

## Positioning

A lightweight, trustworthy internal feedback channel purpose-built for a developer team that already manages complex client engagements. Its key differentiator is the unconditional anonymity guarantee: no name, no email, no IP, no session ID in the response table — paired with a professional admin dashboard that surfaces actionable collective insights.

## Operating Context

- Survey is always open (no fixed campaign period defined yet).
- Respondents access it from any device; mobile support is a first-class requirement.
- The public form must not look like a back-office tool — it should feel reassuring and neutral.
- The admin uses the dashboard to prepare improvement plans; direct access to free-text comments is intentional but governed by confidentiality precautions (small-team re-identification risk).
- Language: French throughout.

## Capabilities and Constraints

**Public survey — 7 questions (all optional unless marked):**
1. Work context (single choice)
2. Global satisfaction score 1–5
3. Main obstacles encountered (multiple choice, "No major obstacle" is exclusive)
4. Desired improvements (multiple choice)
5. AI perception (multiple choice, "No opinion yet" is exclusive)
6. Free-text suggestion (≤ 2 000 characters)
7. Additional comment (optional, may be removed if redundant)

**Admin space (`/admin`):**
- Secured by Auth.js with standalone credentials (email + password); no corporate SSO.
- KPI cards: total responses, average satisfaction, satisfaction distribution.
- Charts: obstacles, improvements, AI perception, responses over time.
- Filters: submission period, work context (with small-group confidentiality guard).
- Paginated response table with detail view for free-text fields.
- CSV and XLSX export (respecting active filters, sanitized against formula injection).

**Technical constraints:**
- Monolithic Next.js app — no microservices, no message queue.
- PostgreSQL via Neon (serverless-compatible connection pooling required for Vercel).
- Drizzle ORM with versioned migrations.
- No IP address, user ID, or session token stored in `feedback_responses`.
- No public route exposing all responses.
- Anti-spam / rate-limiting proportionate to use (no heavyweight identity tracking).
- HTTPS mandatory in production.
- Data retention policy: **open decision** — proposed 12 months, to be confirmed before launch.
- Export sanitization against CSV formula injection in free-text fields.

**Greenfield build:** No existing application code. Build starts from scratch in this directory.

## Brand Commitments

Synelia Design System v6.3 (September 2026) is the single visual authority. This is a technical internal tool (Pôle Développement + DIE) → **accent: Lagon Profond `#0B7D7B`** (technical context, replaces the default blue accent).

Core tokens:
- Primary: Violet Synelia `#6759A2`
- Titles: Violet Profond `#453A78`
- Body text: Encre `#1C1B2E`
- Accent (technical context): Lagon Profond `#0B7D7B`
- Sky blue decorative: `#8CD0F4`
- Fonts: Cambria (headings) / Calibri (body) / JetBrains Mono NL (code)
- No emojis in the interface.
- Icons: outline style, 1.5–2 px stroke — Lucide preferred.
- Cards: white background, `1px #E2DFEC` border, `radius-lg` (16 px), `shadow-sm`.

## Evidence on Hand

- `DESCRIPTION.MD` — complete product brief with all 7 survey questions, data model, API routes, admin spec, security requirements, and Vercel/Neon deployment procedure.
- `design/Synelia-Design-System(1).md` — Synelia brand and design system v6.3 (full specification).
- `design/Synelia-Design-System-autonome.html` — self-contained HTML reference for the design system.
- `design/Synelia-Charte-Graphique-v6.3.pdf` — official brand charter PDF.
- No real user data, testimonials, or screenshots exist yet.

## Product Principles

1. **Anonymity is non-negotiable.** Every technical and UX decision must reinforce the respondents' trust that they cannot be identified. When in doubt, collect less.
2. **Collective signal over individual detail.** The product's value is patterns and trends, not raw transcripts. Design the admin view to surface aggregates before individual responses.
3. **Simplicity earns completion.** A short, easy form on any device gets more honest responses than a thorough one that feels burdensome. Prefer fewer, clearer questions.
4. **Brand consistency signals professionalism.** The Synelia design system is the authority; pixel-level adherence signals that this internal tool is as serious as the company's client-facing work.
5. **Security without theatre.** Proportionate controls (rate-limiting, server-side validation, Auth.js for admin) applied correctly — not security-as-decoration.

## Accessibility & Inclusion

- WCAG 2.1 AA minimum, consistent with the Synelia design system's verified contrast ratios.
- All form inputs must be keyboard-navigable and labelled for screen readers.
- Survey must be usable on mobile (small screens, touch targets).
- No reliance on color alone to convey meaning (especially for the 1–5 satisfaction scale).
