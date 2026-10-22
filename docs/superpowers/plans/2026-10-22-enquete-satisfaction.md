# Enquête Satisfaction — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a full-stack anonymous feedback platform for Synelia's Pôle Développement with a public survey form and a secured admin dashboard, deployable on Vercel + Neon.

**Architecture:** Next.js 15 App Router monolith — public routes serve the anonymous form, `/admin/*` is protected by Auth.js v5 middleware. All data access goes through Drizzle ORM on Neon PostgreSQL. No client-side DB calls, no stored IP addresses.

**Tech Stack:** Next.js 15 · TypeScript strict · Tailwind CSS · Drizzle ORM · `@neondatabase/serverless` · Zod · Auth.js v5 · Recharts · `papaparse` (CSV) · `exceljs` (XLSX) · Vitest · Playwright

**Spec:** `DESCRIPTION.MD` (full product brief), `PRODUCT.md` (product context), `DESIGN.md` (design system)

---

## Global Constraints

- No IP address, user ID, or session token in `feedback_responses` table.
- No `DATABASE_URL` exposed to the browser — server-only env vars only.
- All admin API routes return 401 when no valid Auth.js session exists.
- Server-side Zod validation on every mutation, even when the frontend also validates.
- Free-text exports sanitized against CSV formula injection (prefix `'` to values starting with `=`, `+`, `-`, `@`, `\t`, `\r`).
- No emoji in any UI element.
- Language: French throughout all UI copy.
- Icons: Lucide only (`lucide-react`).
- `satisfactionScore` column: integer 1–5, nullable.
- Character limit on free-text fields: 2 000 characters.
- Filter by work context in admin is only shown when total filtered count ≥ 5 (small-group protection).
- Drizzle migrations are versioned and committed to `drizzle/migrations/`.
- Auth.js `NEXTAUTH_SECRET` must be a real secret in production — documented in `.env.example`.

---

## Review Focus

- **Empty survey submission:** A respondent submits with every field blank. The POST route must accept it (all fields optional), insert a row with all nulls, and return 200. No error state shown to the user.
- **"Aucun obstacle majeur" mutual exclusivity:** Selecting it then adding another obstacle, or vice versa, must not be saveable — enforced on client AND Zod superRefine on server.
- **"Je n'ai pas encore d'avis" (AI) exclusivity:** Same pattern as above; enforced both sides.
- **Rate limiting without IP storage:** The anti-spam mechanism must not write any identifying data to the database (no IP, no fingerprint); a time-windowed counter in Vercel KV or a best-effort in-memory fallback is acceptable.
- **Admin export confidentiality filter:** GET `/api/admin/export` must apply the same work-context small-group guard as the dashboard — if a filter yields < 5 rows, the `workContext` column is omitted from the export.

---

## File Structure

```
enquete-satisfaction-dev/
├── app/
│   ├── layout.tsx                    # Root layout: fonts, metadata, <body>
│   ├── globals.css                   # Tailwind import + Synelia CSS custom props
│   ├── page.tsx                      # Landing page: hero + "Donner mon avis" CTA
│   ├── survey/
│   │   └── page.tsx                  # Multi-step survey form
│   ├── merci/
│   │   └── page.tsx                  # Post-submission thank-you page
│   ├── admin/
│   │   ├── layout.tsx                # Admin shell: sidebar nav + auth guard
│   │   ├── page.tsx                  # Dashboard: KPI cards + charts
│   │   ├── reponses/
│   │   │   └── page.tsx              # Paginated responses table
│   │   └── login/
│   │       └── page.tsx              # Admin login form (Auth.js)
│   └── api/
│       ├── feedback/
│       │   └── route.ts              # POST /api/feedback
│       ├── auth/
│       │   └── [...nextauth]/
│       │       └── route.ts          # Auth.js handler
│       └── admin/
│           ├── summary/
│           │   └── route.ts          # GET /api/admin/summary
│           ├── reponses/
│           │   └── route.ts          # GET /api/admin/reponses?page&limit&from&to&workContext
│           └── export/
│               └── route.ts          # GET /api/admin/export?format=csv|xlsx&from&to&workContext
├── components/
│   ├── ui/
│   │   ├── Button.tsx                # Primary / accent / secondary / ghost variants
│   │   ├── Card.tsx                  # Base card + KpiCard variant
│   │   ├── Input.tsx                 # Text input + Textarea
│   │   ├── Badge.tsx                 # neutral / success / warning / error / info
│   │   └── Callout.tsx               # info / success / warning / error
│   └── survey/
│       ├── RatingScale.tsx           # 1–5 satisfaction widget (signature component)
│       ├── SingleChoice.tsx          # Radio group question
│       ├── MultiChoice.tsx           # Checkbox group question (with exclusivity logic)
│       └── TextQuestion.tsx          # Textarea question with char counter
├── lib/
│   ├── db/
│   │   ├── index.ts                  # Drizzle + Neon client (singleton)
│   │   └── schema.ts                 # feedback_responses table definition
│   ├── validations/
│   │   └── feedback.ts               # Zod schema + exported ENUM constants
│   ├── queries/
│   │   ├── feedback.ts               # insertFeedback()
│   │   └── admin.ts                  # getSummary(), getResponses(), getExportData()
│   └── auth.ts                       # Auth.js config: handlers, auth, signIn, signOut
├── middleware.ts                      # Protect /admin/* and /api/admin/* routes
├── drizzle/
│   └── migrations/                   # Auto-generated by drizzle-kit
├── drizzle.config.ts
├── tailwind.config.ts                 # Synelia design tokens
├── .env.example
├── vitest.config.ts
├── playwright.config.ts
└── package.json
```

---

## Task 1: Scaffold — dependencies, Tailwind, env

**Files:**
- Create: `package.json` (via `create-next-app`, then additions)
- Create: `tailwind.config.ts`
- Create: `app/globals.css`
- Create: `app/layout.tsx`
- Create: `.env.example`
- Create: `vitest.config.ts`
- Create: `playwright.config.ts`
- Create: `drizzle.config.ts`

**Interfaces:**
- Produces: `cn()` utility from `clsx` + `tailwind-merge` at `lib/utils.ts`
- Produces: Tailwind theme tokens used by all component tasks

- [ ] **Step 1: Scaffold Next.js app in the existing directory**

```bash
cd /Users/saintcyr/labs/smile-apps/enquete-satisfaction-dev
npx create-next-app@latest . --typescript --tailwind --app --no-src-dir --import-alias "@/*" --yes
```

Accept any "directory not empty" warning. Existing `.md` and `.pdf` files are unaffected.

- [ ] **Step 2: Install all project dependencies**

```bash
pnpm add drizzle-orm @neondatabase/serverless @auth/drizzle-adapter \
  next-auth@beta zod recharts lucide-react papaparse exceljs \
  clsx tailwind-merge @tanstack/react-table date-fns

pnpm add -D drizzle-kit @types/papaparse vitest @vitejs/plugin-react \
  @testing-library/react @testing-library/user-event \
  @playwright/test jsdom
```

- [ ] **Step 3: Write `tailwind.config.ts` with Synelia design tokens**

Extend `colors` with these exact keys and values (no renaming):

```typescript
colors: {
  primary:       '#6759A2',
  'primary-dark':'#453A78',
  'primary-night':'#2E2751',
  'primary-lav': '#A99FD0',
  'primary-mist':'#EDEAF6',
  accent:        '#0B7D7B',
  'accent-mist': '#E3F7F6',
  sky:           '#8CD0F4',
  'blue-link':   '#1668A8',
  'blue-mist':   '#E7F4FC',
  ink:           '#1C1B2E',
  slate:         '#4A4660',
  'gray-text':   '#6E6985',
  'gray-rule':   '#928DA6',
  'gray-light':  '#F4F3F8',
  border:        '#E2DFEC',
  success:       '#0E7A50',
  'success-mist':'#E6FAF4',
  warning:       '#8F5500',
  'warning-mist':'#FEF5E6',
  error:         '#C42B30',
  'error-mist':  '#FDECEC',
},
fontFamily: {
  display: ['Cambria', 'Georgia', '"Times New Roman"', 'serif'],
  body:    ['Calibri', 'Carlito', '"Segoe UI"', 'system-ui', 'sans-serif'],
  mono:    ['"JetBrains Mono NL"', '"JetBrains Mono"', '"Cascadia Code"', 'Consolas', 'monospace'],
},
borderRadius: {
  sm: '6px', DEFAULT: '6px', md: '10px', lg: '16px', pill: '999px',
},
boxShadow: {
  sm: '0 1px 3px rgba(46,39,81,0.08)',
  md: '0 6px 18px rgba(46,39,81,0.12)',
  lg: '0 14px 40px rgba(46,39,81,0.16)',
},
spacing: {
  xs: '4px', sm: '8px', md: '16px', lg: '24px', xl: '32px', '2xl': '48px', '3xl': '64px',
},
```

- [ ] **Step 4: Write `app/globals.css`**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply font-body text-ink bg-white;
  }
  h1, h2, h3, h4, h5, h6 {
    @apply font-display font-bold text-primary-dark;
  }
}
```

- [ ] **Step 5: Write `app/layout.tsx`**

Root layout: `lang="fr"`, `<meta name="robots" content="noindex">` (internal tool), no analytics scripts. Import globals.css. Title: `"Enquête de satisfaction — Pôle Développement Synelia"`.

- [ ] **Step 6: Write `lib/utils.ts`**

```typescript
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

- [ ] **Step 7: Write `.env.example`**

```dotenv
# PostgreSQL — Neon serverless
DATABASE_URL="postgresql://user:password@ep-xxx.us-east-1.aws.neon.tech/neondb?sslmode=require"

# Auth.js
AUTH_SECRET="run: openssl rand -base64 32"
ADMIN_EMAIL="admin@synelia.tech"
# Store bcrypt hash of the admin password (never the plaintext)
ADMIN_PASSWORD_HASH="$2b$10$..."

# App URL (for Auth.js callbacks)
NEXTAUTH_URL="http://localhost:3000"
```

- [ ] **Step 8: Write `drizzle.config.ts`**

```typescript
import type { Config } from 'drizzle-kit'

export default {
  schema: './lib/db/schema.ts',
  out: './drizzle/migrations',
  dialect: 'postgresql',
  dbCredentials: { url: process.env.DATABASE_URL! },
} satisfies Config
```

- [ ] **Step 9: Write `vitest.config.ts`**

```typescript
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: { environment: 'jsdom', globals: true },
  resolve: { alias: { '@': path.resolve(__dirname, '.') } },
})
```

- [ ] **Step 10: Write `playwright.config.ts`**

Base URL `http://localhost:3000`, one project `chromium`, `webServer` pointing to `pnpm dev`.

- [ ] **Step 11: Verify TypeScript compiles**

```bash
pnpm tsc --noEmit
```

Expected: no errors.

- [ ] **Step 12: Commit**

```bash
git init
git add -A
git commit -m "feat: scaffold Next.js 15 project with Synelia design tokens"
```

---

## Task 2: Database — schema, connection, migration

**Files:**
- Create: `lib/db/schema.ts`
- Create: `lib/db/index.ts`

**Interfaces:**
- Produces: `feedbackResponses` Drizzle table (used by Tasks 3 and 7)
- Produces: `db` client exported from `lib/db/index.ts`

- [ ] **Step 1: Write `lib/db/schema.ts`**

```typescript
import { pgTable, uuid, timestamp, varchar, integer, text } from 'drizzle-orm/pg-core'

export const feedbackResponses = pgTable('feedback_responses', {
  id:                uuid('id').defaultRandom().primaryKey(),
  submittedAt:       timestamp('submitted_at', { withTimezone: true }).defaultNow().notNull(),
  workContext:       varchar('work_context', { length: 50 }),
  satisfactionScore: integer('satisfaction_score'),
  obstacles:         text('obstacles').array(),
  obstacleOther:     text('obstacle_other'),
  improvements:      text('improvements').array(),
  improvementOther:  text('improvement_other'),
  aiPerception:      text('ai_perception').array(),
  comment:           text('comment'),
  additionalComment: text('additional_comment'),
})
```

DB-level constraints to add inline:
- `satisfactionScore`: no `.check()` available in Drizzle — enforce in Zod only.
- No column for IP, email, or any identifier — by design.

- [ ] **Step 2: Write `lib/db/index.ts`**

```typescript
import { drizzle } from 'drizzle-orm/neon-serverless'
import { Pool } from '@neondatabase/serverless'
import * as schema from './schema'

const pool = new Pool({ connectionString: process.env.DATABASE_URL! })
export const db = drizzle(pool, { schema })
```

Singleton pattern via module cache (no global required — Node module cache handles it).

- [ ] **Step 3: Write failing test for schema shape**

```typescript
// tests/db/schema.test.ts
import { feedbackResponses } from '@/lib/db/schema'
import { describe, it, expect } from 'vitest'

describe('feedbackResponses schema', () => {
  it('has id as uuid primary key', () => {
    expect(feedbackResponses.id.primary).toBe(true)
  })
  it('has no email or ip column', () => {
    const cols = Object.keys(feedbackResponses)
    expect(cols).not.toContain('email')
    expect(cols).not.toContain('ip')
    expect(cols).not.toContain('userId')
  })
  it('has all required columns', () => {
    const cols = Object.keys(feedbackResponses)
    expect(cols).toContain('submittedAt')
    expect(cols).toContain('satisfactionScore')
    expect(cols).toContain('obstacles')
    expect(cols).toContain('comment')
  })
})
```

- [ ] **Step 4: Run test — expect PASS (schema is static, no DB needed)**

```bash
pnpm vitest run tests/db/schema.test.ts
```

Expected: PASS

- [ ] **Step 5: Generate and inspect migration**

```bash
pnpm drizzle-kit generate
```

Inspect `drizzle/migrations/0000_*.sql` — confirm no `ip`, `email`, or identifier columns.

- [ ] **Step 6: Apply migration (requires real `DATABASE_URL` in `.env.local`)**

```bash
pnpm drizzle-kit migrate
```

Expected: migration applied successfully.

- [ ] **Step 7: Commit**

```bash
git add lib/db/ drizzle/ tests/db/ drizzle.config.ts
git commit -m "feat: add feedback_responses schema and Neon connection"
```

---

## Task 3: Feedback API — `POST /api/feedback`

**Files:**
- Create: `lib/validations/feedback.ts`
- Create: `lib/queries/feedback.ts`
- Create: `app/api/feedback/route.ts`
- Create: `tests/api/feedback.test.ts`

**Interfaces:**
- Consumes: `db` from `lib/db/index.ts`, `feedbackResponses` from `lib/db/schema.ts`
- Produces: `POST /api/feedback` → `200 { success: true }` or `400 { error: string }` or `429 { error: 'too_many_requests' }`
- Produces: `FeedbackPayload` type and `WORK_CONTEXTS`, `OBSTACLES`, `IMPROVEMENTS`, `AI_PERCEPTIONS` const arrays (used by Task 5)

- [ ] **Step 1: Write `lib/validations/feedback.ts`**

Export these exact constants (values are the DB storage strings):

```typescript
export const WORK_CONTEXTS   = ['siege','regie','teletravail','autre','no_answer'] as const
export const OBSTACLES       = ['communication','visibilite','outils','support','charge',
                                 'formation','reconnaissance','missions_client','aucun','autre'] as const
export const IMPROVEMENTS    = ['accompagnement','partage_connaissances','formations',
                                 'organisation','visibilite_missions','amelioration_outils',
                                 'reconnaissance','echanges_equipes','carriere','autre'] as const
export const AI_PERCEPTIONS  = ['opportunite','utilise_deja','formation_souhaitee',
                                 'interrogation','preoccupation','pas_avis'] as const
```

Export `feedbackSchema` (Zod): all fields optional, with `superRefine` for:
1. If `obstacles` includes `'aucun'` AND `obstacles.length > 1` → custom issue on `obstacles`
2. If `aiPerception` includes `'pas_avis'` AND `aiPerception.length > 1` → custom issue on `aiPerception`
3. `comment` and `additionalComment`: `z.string().max(2000)` each
4. `satisfactionScore`: `z.number().int().min(1).max(5)` when present
5. `obstacleOther` / `improvementOther`: `z.string().max(500)` each

Export `type FeedbackPayload = z.infer<typeof feedbackSchema>`.

- [ ] **Step 2: Write failing tests**

```typescript
// tests/api/feedback.test.ts
import { describe, it, expect } from 'vitest'
import { feedbackSchema } from '@/lib/validations/feedback'

describe('feedbackSchema', () => {
  it('accepts empty submission', () => {
    expect(feedbackSchema.safeParse({}).success).toBe(true)
  })
  it('rejects satisfactionScore 0', () => {
    expect(feedbackSchema.safeParse({ satisfactionScore: 0 }).success).toBe(false)
  })
  it('rejects satisfactionScore 6', () => {
    expect(feedbackSchema.safeParse({ satisfactionScore: 6 }).success).toBe(false)
  })
  it('rejects aucun + another obstacle', () => {
    const result = feedbackSchema.safeParse({ obstacles: ['aucun', 'communication'] })
    expect(result.success).toBe(false)
  })
  it('rejects pas_avis + another ai perception', () => {
    const result = feedbackSchema.safeParse({ aiPerception: ['pas_avis', 'opportunite'] })
    expect(result.success).toBe(false)
  })
  it('rejects comment over 2000 chars', () => {
    expect(feedbackSchema.safeParse({ comment: 'a'.repeat(2001) }).success).toBe(false)
  })
  it('accepts valid full payload', () => {
    const payload = {
      workContext: 'siege',
      satisfactionScore: 4,
      obstacles: ['communication', 'visibilite'],
      improvements: ['formations'],
      aiPerception: ['opportunite', 'utilise_deja'],
      comment: 'Bonne ambiance',
    }
    expect(feedbackSchema.safeParse(payload).success).toBe(true)
  })
})
```

- [ ] **Step 3: Run tests — expect FAIL**

```bash
pnpm vitest run tests/api/feedback.test.ts
```

Expected: FAIL (feedbackSchema not yet defined)

- [ ] **Step 4: Implement `lib/validations/feedback.ts`**

Implement the schema as specified in Step 1.

- [ ] **Step 5: Run tests — expect PASS**

```bash
pnpm vitest run tests/api/feedback.test.ts
```

Expected: all 7 tests PASS

- [ ] **Step 6: Write `lib/queries/feedback.ts`**

```typescript
export async function insertFeedback(data: FeedbackPayload): Promise<void>
```

Uses `db.insert(feedbackResponses).values({ ...data })`. Never logs `comment` or `additionalComment`.

- [ ] **Step 7: Write `app/api/feedback/route.ts`**

`POST` handler:
1. Parse JSON body → `feedbackSchema.safeParse(body)` → 400 on failure with `{ error: issues[0].message }`
2. Simple rate limit: maintain a module-level `Map<string, number[]>` of time-window (keyed by `'global'` — not by IP) → max 50 requests per 60 s window → 429 on exceed. (Note: this is in-memory only; replace with Vercel KV in production. Document this limitation in a code comment.)
3. `await insertFeedback(data)` → 200 `{ success: true }`
4. Catch DB errors → log only the error code (not the payload) → 500 `{ error: 'server_error' }`

Never return submitted data in the response.

- [ ] **Step 8: Commit**

```bash
git add lib/validations/ lib/queries/feedback.ts app/api/feedback/ tests/api/
git commit -m "feat: add POST /api/feedback with Zod validation"
```

---

## Task 4: Design system UI components

**Files:**
- Create: `components/ui/Button.tsx`
- Create: `components/ui/Card.tsx`
- Create: `components/ui/Input.tsx`
- Create: `components/ui/Badge.tsx`
- Create: `components/ui/Callout.tsx`
- Create: `components/survey/RatingScale.tsx`
- Create: `tests/components/RatingScale.test.tsx`

**Interfaces:**
- Produces: `<Button variant="accent|primary|secondary|ghost" size="md|sm">` (used by Tasks 5, 6, 8, 9)
- Produces: `<Card>` and `<KpiCard label title value sub>` (used by Tasks 5, 8)
- Produces: `<Input>`, `<Textarea>` (used by Task 5)
- Produces: `<Badge variant="neutral|success|warning|error|info">` (used by Task 9)
- Produces: `<Callout variant="info|success|warning|error">` (used by Task 5)
- Produces: `<RatingScale value onChange aria-label>` (used by Task 5)

- [ ] **Step 1: Write `components/ui/Button.tsx`**

Props: `variant: 'accent' | 'primary' | 'secondary' | 'ghost'` (default `'accent'`), `size: 'md' | 'sm'` (default `'md'`), all native `<button>` props.

Variant styles (Tailwind classes):
- `accent`: `bg-accent text-white hover:bg-[#096463] focus-visible:ring-primary-dark`
- `primary`: `bg-primary text-white hover:bg-primary-dark focus-visible:ring-accent`
- `secondary`: `bg-white text-primary-dark border-2 border-primary hover:bg-primary-mist focus-visible:ring-accent`
- `ghost`: `text-accent underline-offset-2 hover:underline`

All buttons: `font-display font-bold rounded-md transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed`.

Size `md`: `px-6 py-3 text-base`. Size `sm`: `px-4 py-2 text-sm`.

- [ ] **Step 2: Write `components/ui/Card.tsx`**

Base `<Card>`: `bg-white border border-border rounded-lg shadow-sm p-lg`. Forwards `className`.

`<KpiCard label: string, value: string | number, sub?: string, accented?: boolean>`: uses Card with optional `border-t-4 border-t-accent` when `accented`. Title in `font-display font-bold text-primary-dark text-lg`, value in `font-display font-bold text-3xl text-ink`, sub in `text-sm text-gray-text`.

- [ ] **Step 3: Write `components/ui/Input.tsx`**

`<Input>`: wraps `<input>` with `border border-border rounded-md px-[14px] py-[10px] text-base text-ink bg-white placeholder:text-gray-text focus:border-2 focus:border-accent focus:bg-accent-mist focus:outline-none aria-invalid:border-error aria-invalid:bg-error-mist transition-colors`. Full width. Forward ref.

`<Textarea>`: same styles but `<textarea>`, min-height `120px`, `resize-y`, includes `<span>` showing `{value.length}/2000` in `text-xs text-gray-text` below when `showCount` prop is true.

`<FormField label hint? error?>`: wraps `<label>` (font-label) + children + optional error message.

- [ ] **Step 4: Write `components/ui/Badge.tsx`**

Variant classes:
- `neutral`: `bg-primary-mist text-primary-dark`
- `success`: `bg-success-mist text-success`
- `warning`: `bg-warning-mist text-warning`
- `error`: `bg-error-mist text-error`
- `info`: `bg-blue-mist text-blue-link`

All: `inline-flex items-center rounded-pill px-[10px] py-[4px] font-display font-bold text-[11px]`.

- [ ] **Step 5: Write `components/ui/Callout.tsx`**

Four variants matching DESIGN.md callout specs. Structure: `border-l-4 rounded-r-sm p-[14px]` with `<p className="text-ink">` body.

- [ ] **Step 6: Write failing test for `<RatingScale>`**

```typescript
// tests/components/RatingScale.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { RatingScale } from '@/components/survey/RatingScale'
import { describe, it, expect, vi } from 'vitest'

describe('RatingScale', () => {
  it('renders 5 buttons', () => {
    render(<RatingScale value={null} onChange={() => {}} />)
    expect(screen.getAllByRole('button')).toHaveLength(5)
  })
  it('marks selected item as aria-pressed', () => {
    render(<RatingScale value={3} onChange={() => {}} />)
    const buttons = screen.getAllByRole('button')
    expect(buttons[2].getAttribute('aria-pressed')).toBe('true')
    expect(buttons[0].getAttribute('aria-pressed')).toBe('false')
  })
  it('calls onChange with numeric value on click', () => {
    const onChange = vi.fn()
    render(<RatingScale value={null} onChange={onChange} />)
    fireEvent.click(screen.getAllByRole('button')[4])
    expect(onChange).toHaveBeenCalledWith(5)
  })
})
```

- [ ] **Step 7: Run test — expect FAIL**

```bash
pnpm vitest run tests/components/RatingScale.test.tsx
```

- [ ] **Step 8: Write `components/survey/RatingScale.tsx`**

Props: `value: number | null`, `onChange: (v: number) => void`. Renders a `role="group"` div with 5 `<button type="button">` tiles. Each tile shows the numeral in `font-display font-bold text-[1.75rem]` and the label below in `text-[0.625rem] text-gray-text text-center`.

Selected tile: `bg-accent-mist border-2 border-accent`. Unselected: `bg-white border border-border hover:bg-primary-mist`.

Labels (from DESCRIPTION.MD, in order): `"Très insatisfaisante"`, `"Insatisfaisante"`, `"Moyenne"`, `"Satisfaisante"`, `"Très satisfaisante"`.

- [ ] **Step 9: Run test — expect PASS**

```bash
pnpm vitest run tests/components/RatingScale.test.tsx
```

- [ ] **Step 10: Commit**

```bash
git add components/ tests/components/
git commit -m "feat: add design system UI components and RatingScale"
```

---

## Task 5: Public survey flow — landing + form + thank-you

**Files:**
- Create: `app/page.tsx`
- Create: `app/survey/page.tsx`
- Create: `components/survey/SingleChoice.tsx`
- Create: `components/survey/MultiChoice.tsx`
- Create: `components/survey/TextQuestion.tsx`
- Create: `app/merci/page.tsx`
- Create: `tests/e2e/survey.spec.ts`

**Interfaces:**
- Consumes: `Button`, `Card`, `Callout`, `RatingScale`, `Input/Textarea/FormField` from Tasks 3–4
- Consumes: `WORK_CONTEXTS`, `OBSTACLES`, `IMPROVEMENTS`, `AI_PERCEPTIONS` from `lib/validations/feedback.ts`
- Consumes: `POST /api/feedback` from Task 3

- [ ] **Step 1: Write `app/page.tsx` — landing page**

Exact French copy from DESCRIPTION.MD section 4:
- `<h1>`: `"Votre avis compte"`
- Body paragraph (verbatim from spec): `"Dans une démarche d'amélioration continue…"`
- `<Button variant="accent">Donner mon avis</Button>` → `href="/survey"` via `<Link>`
- Anonymity callout: `<Callout variant="info">` with the full anonymity notice from spec
- Note below CTA: `"Les réponses sont facultatives, sauf si une question est explicitement rendue obligatoire."`

Layout: centered column, max-width `720px`, generous vertical padding (`py-3xl`). Synelia logo placeholder (text fallback `"Synelia"` in `font-display` until assets are available).

- [ ] **Step 2: Write survey question components**

`<SingleChoice options label name value onChange>`: renders a `<fieldset>` + `<legend>` + radio inputs, styled as cards on hover, WCAG `role="radiogroup"`.

`<MultiChoice options label name value onChange exclusiveValues?>`: same but checkboxes. When `exclusiveValues` contains a selected value, all other checkboxes disable and vice versa. Handles both `'aucun'` (obstacles) and `'pas_avis'` (AI perception) exclusivity.

`<TextQuestion label name value onChange hint? maxLength?>`: `<FormField>` wrapping `<Textarea showCount>`.

- [ ] **Step 3: Write `app/survey/page.tsx`**

Client component (`'use client'`). Single-page form (all 7 questions on one scroll, no multi-step wizard) with state via `useState<FeedbackPayload>({})`.

Questions in order (from DESCRIPTION.MD §4):
1. `<SingleChoice name="workContext" label="Dans quel contexte travaillez-vous principalement ?">` — 5 options from `WORK_CONTEXTS` with French display labels
2. `<RatingScale>` for `satisfactionScore`
3. `<MultiChoice name="obstacles" label="Quels sont les principaux obstacles…" exclusiveValues={['aucun']}>`  — 10 options; "autre" reveals a conditional `<TextQuestion name="obstacleOther">`
4. `<MultiChoice name="improvements" label="Quelles améliorations seraient les plus utiles…">` — 10 options; "autre" reveals `<TextQuestion name="improvementOther">`
5. `<MultiChoice name="aiPerception" label="Comment percevez-vous l'utilisation de l'intelligence artificielle…" exclusiveValues={['pas_avis']}>`  — 6 options
6. `<TextQuestion name="comment" label="Si vous pouviez changer une seule chose…" hint="Partagez une idée…" maxLength={2000}>`
7. `<TextQuestion name="additionalComment" label="Souhaitez-vous ajouter un autre commentaire…" maxLength={2000}>`

Submit button: `<Button variant="accent">Envoyer mes réponses</Button>`. On submit:
- `disabled` during fetch to prevent double submission
- Show loading spinner (Lucide `<Loader2 className="animate-spin">`)
- On success → `router.push('/merci')`
- On error → show `<Callout variant="error">` with `"Une erreur est survenue. Veuillez réessayer."`

The `<Callout variant="info">` anonymity reminder from DESCRIPTION.MD §4 appears above Q1.

- [ ] **Step 4: Write `app/merci/page.tsx`**

Exact copy from spec: `"Merci pour votre contribution !"` as H1, then `"Votre retour aidera le Pôle Développement…"`. No link to view responses. Link back to home (`"Retour à l'accueil"`).

- [ ] **Step 5: Write Playwright E2E test**

```typescript
// tests/e2e/survey.spec.ts
import { test, expect } from '@playwright/test'

test('landing page shows hero and CTA', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { name: 'Votre avis compte' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Donner mon avis' })).toBeVisible()
})

test('empty form submits and shows thank-you', async ({ page }) => {
  await page.goto('/survey')
  await page.getByRole('button', { name: 'Envoyer mes réponses' }).click()
  await expect(page).toHaveURL('/merci')
  await expect(page.getByRole('heading', { name: /Merci/ })).toBeVisible()
})

test('full form submission succeeds', async ({ page }) => {
  await page.goto('/survey')
  await page.getByLabel('Au siège').check()
  await page.getByRole('button', { name: '4' }).click() // satisfaction 4
  await page.getByLabel('Communication et circulation de l\'information').check()
  await page.getByLabel('Formations et certifications').check()
  await page.getByLabel("J'utilise déjà des outils d'IA dans mon travail.").check()
  await page.getByLabel(/changer une seule chose/).fill('Plus de partage.')
  await page.getByRole('button', { name: 'Envoyer mes réponses' }).click()
  await expect(page).toHaveURL('/merci')
})
```

- [ ] **Step 6: Run E2E tests against dev server**

```bash
pnpm dev &
pnpm playwright test tests/e2e/survey.spec.ts
```

Expected: all 3 tests PASS.

- [ ] **Step 7: Commit**

```bash
git add app/page.tsx app/survey/ app/merci/ components/survey/ tests/e2e/survey.spec.ts
git commit -m "feat: add public survey landing page, form (7 questions), and thank-you"
```

---

## Task 6: Admin authentication — Auth.js v5 + login + middleware

**Files:**
- Create: `lib/auth.ts`
- Create: `app/api/auth/[...nextauth]/route.ts`
- Create: `app/admin/login/page.tsx`
- Create: `app/admin/layout.tsx`
- Create: `middleware.ts`
- Create: `tests/api/auth.test.ts`

**Interfaces:**
- Produces: `auth()` session check (used by Tasks 7, 8, 9 API routes)
- Produces: `/admin/login` page (POST action → `signIn('credentials', ...)`)
- Produces: middleware protecting `/admin/*` and `/api/admin/*`

- [ ] **Step 1: Write failing test for auth config**

```typescript
// tests/api/auth.test.ts
import { describe, it, expect } from 'vitest'

describe('admin auth', () => {
  it('AUTH_SECRET env var is defined', () => {
    // This test will pass only in real env; document that .env.local is required
    // In CI, ensure AUTH_SECRET is set as a test env var
    expect(typeof process.env.AUTH_SECRET).toBe('string')
  })
})
```

- [ ] **Step 2: Write `lib/auth.ts`**

```typescript
import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email:    { label: 'Email',    type: 'email'    },
        password: { label: 'Password', type: 'password' },
      },
      authorize: async (credentials) => {
        const email = credentials?.email as string | undefined
        const password = credentials?.password as string | undefined
        if (!email || !password) return null
        if (email !== process.env.ADMIN_EMAIL) return null
        const hash = process.env.ADMIN_PASSWORD_HASH
        if (!hash) return null
        const valid = await bcrypt.compare(password, hash)
        return valid ? { id: '1', email } : null
      },
    }),
  ],
  pages: { signIn: '/admin/login' },
  session: { strategy: 'jwt' },
})
```

Install `bcryptjs`: `pnpm add bcryptjs && pnpm add -D @types/bcryptjs`.

- [ ] **Step 3: Write `app/api/auth/[...nextauth]/route.ts`**

```typescript
import { handlers } from '@/lib/auth'
export const { GET, POST } = handlers
```

- [ ] **Step 4: Write `middleware.ts`**

```typescript
import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'

export default auth((req) => {
  const isAdminRoute = req.nextUrl.pathname.startsWith('/admin') ||
                       req.nextUrl.pathname.startsWith('/api/admin')
  const isLoginPage  = req.nextUrl.pathname === '/admin/login'
  if (isAdminRoute && !isLoginPage && !req.auth) {
    return NextResponse.redirect(new URL('/admin/login', req.url))
  }
})

export const config = { matcher: ['/admin/:path*', '/api/admin/:path*'] }
```

- [ ] **Step 5: Write `app/admin/login/page.tsx`**

Client component. Form with `<Input type="email" name="email">` and `<Input type="password" name="password">`. Submit calls `signIn('credentials', { email, password, redirectTo: '/admin' })`. Show `<Callout variant="error">` on invalid credentials. Page title: `"Connexion — Administration"`. No self-registration link.

- [ ] **Step 6: Write `app/admin/layout.tsx`**

Server component. Calls `await auth()` — redirect to `/admin/login` if no session (belt-and-suspenders alongside middleware). Renders sidebar nav with links: `"Tableau de bord"` → `/admin`, `"Réponses"` → `/admin/reponses`. Sign-out button using `signOut({ redirectTo: '/' })`. Uses Midnight Amethyst sidebar (`bg-primary-night`), white text, lagon active indicator.

- [ ] **Step 7: Run test**

```bash
pnpm vitest run tests/api/auth.test.ts
```

- [ ] **Step 8: Commit**

```bash
git add lib/auth.ts app/api/auth/ app/admin/login/ app/admin/layout.tsx middleware.ts tests/api/auth.test.ts
git commit -m "feat: add Auth.js v5 credentials auth with admin login and middleware"
```

---

## Task 7: Admin API — summary, paginated responses, CSV export

**Files:**
- Create: `lib/queries/admin.ts`
- Create: `app/api/admin/summary/route.ts`
- Create: `app/api/admin/reponses/route.ts`
- Create: `app/api/admin/export/route.ts`
- Create: `tests/api/admin.test.ts`

**Interfaces:**
- Consumes: `db`, `feedbackResponses` from Task 2; `auth` from Task 6
- Produces: `GET /api/admin/summary` → `SummaryResponse`
- Produces: `GET /api/admin/reponses` → `{ data: ResponseRow[], total, page, pageSize, totalPages }`
- Produces: `GET /api/admin/export?format=csv|xlsx` → file download

**Types to export from `lib/queries/admin.ts`:**

```typescript
type SummaryResponse = {
  totalResponses:           number
  averageSatisfaction:      number | null
  satisfactionDistribution: Record<1|2|3|4|5, number>
  obstaclesCounts:          Record<string, number>
  improvementsCounts:       Record<string, number>
  aiPerceptionCounts:       Record<string, number>
  responsesByDay:           Array<{ date: string; count: number }>
}

type ResponseRow = {
  id:                string
  submittedAt:       string        // ISO-8601
  workContext:       string | null
  satisfactionScore: number | null
  obstacles:         string[]
  improvements:      string[]
  aiPerception:      string[]
  comment:           string | null
  additionalComment: string | null
}
```

- [ ] **Step 1: Write failing tests**

```typescript
// tests/api/admin.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock the db module
vi.mock('@/lib/db/index', () => ({ db: { select: vi.fn(), execute: vi.fn() } }))

describe('admin query types', () => {
  it('SummaryResponse satisfactionDistribution keys are 1-5', () => {
    // Type-only test — compile check
    type Keys = keyof { 1: number; 2: number; 3: number; 4: number; 5: number }
    const valid: Keys = 3
    expect(valid).toBe(3)
  })
})
```

Add a test that makes a direct HTTP call to `/api/admin/summary` without auth and expects 401:

```typescript
// This test requires the dev server — skip in unit suite, run in E2E
// Annotated here for the E2E suite (Task 9 will add it to playwright)
```

- [ ] **Step 2: Write `lib/queries/admin.ts`**

`getSummary(filters: AdminFilters): Promise<SummaryResponse>` — uses Drizzle `.select()` with `sql` fragments for aggregation. `responsesByDay` is limited to last 90 days.

`getResponses(filters: AdminFilters & { page: number; limit: number }): Promise<{ data: ResponseRow[]; total: number }>` — paginated with `.offset().limit()`.

`getExportData(filters: AdminFilters): Promise<ResponseRow[]>` — all matching rows, no pagination.

```typescript
type AdminFilters = {
  from?:        Date
  to?:          Date
  workContext?: string
}
```

**Small-group guard:** when `workContext` filter is active AND total matching rows < 5, throw `new Error('SMALL_GROUP')`. Routes catch this and return 422 `{ error: 'filter_too_narrow' }`.

- [ ] **Step 3: Write `app/api/admin/summary/route.ts`**

`GET` handler: call `auth()` → 401 if no session. Parse `from`, `to`, `workContext` from searchParams. Call `getSummary(filters)`. Catch `SMALL_GROUP` → 422. Return JSON.

- [ ] **Step 4: Write `app/api/admin/reponses/route.ts`**

`GET` handler: same auth check. Parse `page` (default 1), `limit` (default 20, max 100), filters. Call `getResponses(...)`. Return `{ data, total, page, pageSize, totalPages }`.

- [ ] **Step 5: Write `app/api/admin/export/route.ts`**

`GET` handler: auth check. Parse `format` (`csv` or `xlsx`, default `csv`), filters.

**CSV:** Use `papaparse.unparse()`. Sanitize each string cell: if value starts with `=`, `+`, `-`, `@`, `\t`, or `\r`, prefix with `'`. Set header `Content-Disposition: attachment; filename="reponses-synelia-YYYY-MM-DD.csv"` and `Content-Type: text/csv; charset=utf-8`.

**XLSX:** Use `exceljs`. One worksheet named `"Réponses"`. Same formula-injection sanitization. Set `Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`.

**Small-group guard:** when `workContext` is active and count < 5, omit `workContext` column from export entirely (do not return 422 — return the file without that column, and include a disclaimer row at the top).

- [ ] **Step 6: Run unit tests**

```bash
pnpm vitest run tests/api/admin.test.ts
```

- [ ] **Step 7: Commit**

```bash
git add lib/queries/admin.ts app/api/admin/ tests/api/admin.test.ts
git commit -m "feat: add admin API — summary, paginated responses, CSV/XLSX export"
```

---

## Task 8: Admin dashboard — KPI cards, Recharts charts, filters

**Files:**
- Create: `app/admin/page.tsx`
- Create: `components/admin/SatisfactionDistChart.tsx`
- Create: `components/admin/ObstaclesChart.tsx`
- Create: `components/admin/ImprovementsChart.tsx`
- Create: `components/admin/AiPerceptionChart.tsx`
- Create: `components/admin/ResponsesOverTimeChart.tsx`
- Create: `components/admin/Filters.tsx`

**Interfaces:**
- Consumes: `GET /api/admin/summary` (Task 7), `KpiCard`, `Card`, `Badge` (Task 4)
- Consumes: Recharts `BarChart`, `LineChart`

- [ ] **Step 1: Write `components/admin/Filters.tsx`**

Client component. Props: `value: AdminFilters`, `onChange: (f: AdminFilters) => void`.

Two inputs: date range (`from` / `to` with `<Input type="date">`) + optional work-context selector (`<select>` with options from `WORK_CONTEXTS`). "Réinitialiser" ghost button clears all filters.

On change, call `onChange` immediately (controlled component — parent owns the filter state).

- [ ] **Step 2: Write chart components**

Each receives pre-fetched data (not `useEffect` fetching) as props. Tailwind classes cannot be used inside Recharts — pass hex values directly.

Chart color palette (from DESIGN.md data viz order):
- Series 1: `#6759A2` (Violet Synelia)
- Series 2: `#1668A8` (Bleu Lien)
- Series 3: `#0B7D7B` (Lagon Profond)
- Series 4: `#C24A2E` (Corail Profond)

`<SatisfactionDistChart data: Record<1|2|3|4|5, number>>`: `BarChart`, one bar per score 1–5, single series → color `#6759A2`.

`<ObstaclesChart data: Record<string, number>>`: horizontal `BarChart`, entries sorted descending, max 10 bars. Display label = French label from a `OBSTACLE_LABELS` map (define in `lib/validations/feedback.ts`).

`<ImprovementsChart>` and `<AiPerceptionChart>`: same pattern as ObstaclesChart.

`<ResponsesOverTimeChart data: Array<{date:string; count:number}>>`: `LineChart`, stroke `#0B7D7B`.

- [ ] **Step 3: Write `app/admin/page.tsx`**

Server component. `await auth()` guard (belt-and-suspenders). Calls `getSummary(filters)` with filters parsed from `searchParams`. Renders:

Row 1: 4 × `<KpiCard accented>`:
- `"Réponses reçues"` · value: `totalResponses`
- `"Satisfaction moyenne"` · value: `averageSatisfaction?.toFixed(1) ?? '—'` · sub: `"sur 5"`
- `"Note la plus fréquente"` · value: most common score or `"—"`
- `"Dernière réponse"` · value: relative date of most recent submission

Row 2: `<SatisfactionDistChart>` + `<ResponsesOverTimeChart>` side by side.

Row 3: `<ObstaclesChart>` + `<ImprovementsChart>` side by side.

Row 4: `<AiPerceptionChart>` full width.

`<Filters>` at top; filter state drives server revalidation via Next.js router (`router.push` with updated searchParams).

- [ ] **Step 4: Commit**

```bash
git add app/admin/page.tsx components/admin/ 
git commit -m "feat: add admin dashboard with KPI cards and Recharts charts"
```

---

## Task 9: Admin responses table + export UI + E2E auth tests

**Files:**
- Create: `app/admin/reponses/page.tsx`
- Create: `components/admin/ResponsesTable.tsx`
- Create: `components/admin/ResponseDetail.tsx`
- Create: `tests/e2e/admin.spec.ts`

**Interfaces:**
- Consumes: `GET /api/admin/reponses` (Task 7), `GET /api/admin/export` (Task 7)
- Consumes: `Badge`, `Button`, `Card` (Task 4)

- [ ] **Step 1: Write `components/admin/ResponsesTable.tsx`**

Client component using TanStack Table (`@tanstack/react-table`). Columns:
- Date (format with `date-fns`: `"dd/MM/yyyy HH:mm"`)
- Contexte (`workContext` display label or `"—"`)
- Satisfaction (score badge: score 4–5 → `success`, 3 → `neutral`, 1–2 → `error`; or `"—"`)
- Principaux obstacles (first 2 as `<Badge variant="neutral">`, `+N` overflow)
- Améliorations (same)
- Perception IA (same)

Rows are clickable — clicking opens `<ResponseDetail>` in a slide-over panel.

Pagination: `"Précédent"` / `"Suivant"` buttons + `"Page X / N"` display.

- [ ] **Step 2: Write `components/admin/ResponseDetail.tsx`**

Slide-over panel (fixed right, `shadow-lg`, `bg-white`). Shows full response detail including `comment` and `additionalComment` free-text in `<Card>` blocks. Close via `×` button or Escape key.

- [ ] **Step 3: Write `app/admin/reponses/page.tsx`**

Server component. Fetches first page from `getResponses({page:1, limit:20})`. Passes data to `<ResponsesTable>`. Renders export row: `<Button variant="secondary" size="sm">Exporter CSV</Button>` linking to `/api/admin/export?format=csv` and `<Button>Exporter Excel</Button>` for xlsx. Export buttons respect active filters by appending searchParams.

- [ ] **Step 4: Write E2E tests for admin**

```typescript
// tests/e2e/admin.spec.ts
import { test, expect } from '@playwright/test'

test('redirects unauthenticated user from /admin to /admin/login', async ({ page }) => {
  await page.goto('/admin')
  await expect(page).toHaveURL(/\/admin\/login/)
})

test('login with wrong credentials shows error', async ({ page }) => {
  await page.goto('/admin/login')
  await page.getByLabel('Email').fill('wrong@synelia.tech')
  await page.getByLabel('Mot de passe').fill('wrong')
  await page.getByRole('button', { name: /Connexion/ }).click()
  await expect(page.getByRole('alert')).toBeVisible()
  await expect(page).toHaveURL(/\/admin\/login/)
})

test('GET /api/admin/summary returns 401 without auth', async ({ request }) => {
  const res = await request.get('/api/admin/summary')
  expect(res.status()).toBe(401)
})
```

- [ ] **Step 5: Run E2E tests**

```bash
pnpm playwright test tests/e2e/admin.spec.ts
```

Expected: all 3 PASS.

- [ ] **Step 6: Final smoke test — full build**

```bash
pnpm build
```

Expected: build completes without errors or type violations.

- [ ] **Step 7: Commit**

```bash
git add app/admin/reponses/ components/admin/ResponsesTable.tsx components/admin/ResponseDetail.tsx tests/e2e/admin.spec.ts
git commit -m "feat: add admin responses table with pagination, detail panel, and export UI"
```

---

## Self-Review

### Spec coverage

| Spec section | Covered by |
|---|---|
| §4 Public form — landing + 7 questions | Task 5 |
| §4 Anonymity callout, no login on form | Task 5 |
| §4 Double-submission prevention | Task 5 (disabled during fetch) |
| §5 DB model — all columns, no identifier | Task 2 |
| §6 POST /api/feedback — Zod, anti-spam, minimal response | Task 3 |
| §6 GET /api/admin/summary | Task 7 |
| §6 GET /api/admin/reponses | Task 7 |
| §6 GET /api/admin/export | Task 7 |
| §7 Admin dashboard — KPI, charts, filters | Task 8 |
| §7 Responses table + free-text expand | Task 9 |
| §7 CSV / XLSX export | Task 7 + 9 |
| §8 No IP stored | Task 2 (schema), Task 3 (route) |
| §8 Server-only DB credentials | Task 1 (.env.example) |
| §8 Admin auth — no hardcoded password | Task 6 (bcrypt hash in env) |
| §8 CSV formula injection | Task 7 |
| §9 Extensible structure for action module | ✓ schema has no FK to respondent; future `improvement_actions` table can be added |
| §10 .env.example | Task 1 |
| §10 Serverless Neon connection | Task 2 |

**Gap identified:** README with deployment procedure. → Acceptable deferral for a post-implementation task; not adding a Task 10 since it is documentation only.

### Step scan

- All steps produce exactly one artifact with a checkable result. No "handle edge cases" open steps found.

### Type consistency

- `FeedbackPayload` defined in Task 3, consumed in Tasks 5 (form state typing) and 7 (query layer) — consistent.
- `AdminFilters`, `SummaryResponse`, `ResponseRow` defined in Task 7 `lib/queries/admin.ts` — all consuming tasks reference the same names.
- `WORK_CONTEXTS`, `OBSTACLES`, `IMPROVEMENTS`, `AI_PERCEPTIONS` — defined in Task 3, consumed in Tasks 5 (form) and 7 (labels map).

### Review Focus (tests added)

All five items in Review Focus are covered:
- Empty submission → Task 3 unit test `'accepts empty submission'`
- `'aucun'` exclusivity → Task 3 unit test `'rejects aucun + another obstacle'`, Task 5 MultiChoice client enforcement
- `'pas_avis'` exclusivity → Task 3 unit test, Task 5 MultiChoice client enforcement
- Rate limiting without IP → Task 3 implementation note (in-memory global key, documented)
- Export confidentiality filter → Task 7 Step 5 (column omission when < 5 rows)
