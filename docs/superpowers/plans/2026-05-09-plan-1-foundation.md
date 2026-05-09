# Plan 1: Foundation — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Set up the complete foundation — Supabase schema, TypeScript types, database client, auth middleware, and Next.js app structure — so all subsequent plans (Storefront, Admin, Web Apps, AI) can build on a solid, tested base.

**Architecture:** Next.js 16 App Router (`src/app/`) with Supabase for database and auth. Admin routes protected by middleware. Public routes fully open. Supabase client split into server-side and client-side helpers per Next.js 16 conventions.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind 4, Supabase JS v2, Vitest, @testing-library/react

---

## File Map

```
src/
├── app/
│   ├── layout.tsx                    # Root layout (already exists — modify)
│   ├── page.tsx                      # Homepage placeholder (already exists — replace)
│   ├── admin/
│   │   └── page.tsx                  # Admin placeholder (redirect if unauthed)
│   └── api/
│       └── health/
│           └── route.ts              # Health check endpoint (for testing)
├── lib/
│   ├── supabase/
│   │   ├── client.ts                 # Browser Supabase client (singleton)
│   │   ├── server.ts                 # Server Supabase client (per-request)
│   │   └── types.ts                  # Generated DB types (manual for now)
│   └── constants.ts                  # App-wide constants
└── middleware.ts                     # Auth guard for /admin/* routes

supabase/
└── migrations/
    └── 0001_initial_schema.sql       # All 5 tables

docs/superpowers/plans/
└── 2026-05-09-plan-1-foundation.md  # This file
```

---

## Task 1: Install Dependencies

**Files:**
- Modify: `package.json` (via npm install)

- [ ] **Step 1: Install Supabase JS client**

```bash
cd "C:/ETSY/etsy-store"
npm install @supabase/supabase-js @supabase/ssr
```

Expected output: `added N packages` with no errors.

- [ ] **Step 2: Install Vitest and testing utilities**

```bash
npm install -D vitest @vitejs/plugin-react @testing-library/react @testing-library/dom jsdom
```

Expected output: `added N packages` with no errors.

- [ ] **Step 3: Verify package.json has all dependencies**

Check `package.json` contains:
```json
{
  "dependencies": {
    "@supabase/supabase-js": "^2.x.x",
    "@supabase/ssr": "^0.x.x"
  },
  "devDependencies": {
    "vitest": "^x.x.x",
    "@vitejs/plugin-react": "^x.x.x",
    "@testing-library/react": "^x.x.x",
    "@testing-library/dom": "^x.x.x",
    "jsdom": "^x.x.x"
  }
}
```

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: install supabase and vitest dependencies"
```

---

## Task 2: Configure Vitest

**Files:**
- Create: `vitest.config.ts`
- Modify: `package.json` (add test script)

- [ ] **Step 1: Create vitest config**

Create `vitest.config.ts`:
```typescript
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: [],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

- [ ] **Step 2: Add test script to package.json**

In `package.json`, add to `"scripts"`:
```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Step 3: Verify config works**

```bash
npm test
```

Expected output: `No test files found` (no tests yet — that's correct, not an error).

- [ ] **Step 4: Commit**

```bash
git add vitest.config.ts package.json
git commit -m "chore: configure vitest for unit testing"
```

---

## Task 3: Create Supabase Migration

**Files:**
- Create: `supabase/migrations/0001_initial_schema.sql`

- [ ] **Step 1: Create migrations directory**

```bash
mkdir -p "C:/ETSY/etsy-store/supabase/migrations"
```

- [ ] **Step 2: Write the migration file**

Create `supabase/migrations/0001_initial_schema.sql`:
```sql
-- Enable UUID generation
create extension if not exists "pgcrypto";

-- ============================================================
-- products
-- ============================================================
create table if not exists products (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  slug        text not null unique,
  description text,
  price       numeric(10,2) not null default 0,
  type        text not null check (type in ('spreadsheet', 'app')),
  category    text,
  etsy_listing_id text,
  etsy_url    text,
  status      text not null default 'draft' check (status in ('draft', 'live')),
  created_at  timestamptz not null default now()
);

-- ============================================================
-- product_files
-- ============================================================
create table if not exists product_files (
  id          uuid primary key default gen_random_uuid(),
  product_id  uuid not null references products(id) on delete cascade,
  format      text not null check (format in ('sheets', 'excel', 'pdf')),
  tier        text not null check (tier in ('essentials', 'pro', 'ai')),
  label       text not null,
  url         text not null,
  version     text not null default 'v1.0',
  created_at  timestamptz not null default now()
);

-- ============================================================
-- etsy_stats
-- ============================================================
create table if not exists etsy_stats (
  id             uuid primary key default gen_random_uuid(),
  product_id     uuid not null references products(id) on delete cascade,
  views          integer not null default 0,
  favorites      integer not null default 0,
  sales_count    integer not null default 0,
  revenue        numeric(10,2) not null default 0,
  reviews_count  integer not null default 0,
  avg_rating     numeric(3,2) not null default 0,
  synced_at      timestamptz not null default now()
);

-- ============================================================
-- sales
-- ============================================================
create table if not exists sales (
  id             uuid primary key default gen_random_uuid(),
  product_id     uuid not null references products(id) on delete cascade,
  etsy_order_id  text,
  amount         numeric(10,2) not null,
  buyer_country  text,
  sold_at        timestamptz not null default now()
);

-- ============================================================
-- bundle_products
-- ============================================================
create table if not exists bundle_products (
  id          uuid primary key default gen_random_uuid(),
  bundle_id   uuid not null references products(id) on delete cascade,
  product_id  uuid not null references products(id) on delete cascade,
  unique(bundle_id, product_id)
);

-- ============================================================
-- Row Level Security
-- ============================================================
alter table products        enable row level security;
alter table product_files   enable row level security;
alter table etsy_stats      enable row level security;
alter table sales            enable row level security;
alter table bundle_products enable row level security;

-- Public read access for products (storefront needs this)
create policy "Public can read live products"
  on products for select
  using (status = 'live');

create policy "Public can read product files"
  on product_files for select
  using (
    exists (
      select 1 from products p
      where p.id = product_id and p.status = 'live'
    )
  );

-- Authenticated (admin) full access
create policy "Authenticated users full access to products"
  on products for all
  using (auth.role() = 'authenticated');

create policy "Authenticated users full access to product_files"
  on product_files for all
  using (auth.role() = 'authenticated');

create policy "Authenticated users full access to etsy_stats"
  on etsy_stats for all
  using (auth.role() = 'authenticated');

create policy "Authenticated users full access to sales"
  on sales for all
  using (auth.role() = 'authenticated');

create policy "Authenticated users full access to bundle_products"
  on bundle_products for all
  using (auth.role() = 'authenticated');
```

- [ ] **Step 3: Apply migration to Supabase**

Go to: https://supabase.com/dashboard/project/ronfbjpqyhxipnitxrif/sql/new

Paste the entire SQL above and click **Run**.

Expected: All statements execute without error. Verify in Table Editor that 5 tables appear: `products`, `product_files`, `etsy_stats`, `sales`, `bundle_products`.

- [ ] **Step 4: Commit**

```bash
git add supabase/migrations/0001_initial_schema.sql
git commit -m "feat: add initial database schema with RLS policies"
```

---

## Task 4: TypeScript Database Types

**Files:**
- Create: `src/lib/supabase/types.ts`

- [ ] **Step 1: Write the types file**

Create `src/lib/supabase/types.ts`:
```typescript
export type ProductType = 'spreadsheet' | 'app'
export type ProductStatus = 'draft' | 'live'
export type ProductFormat = 'sheets' | 'excel' | 'pdf'
export type ProductTier = 'essentials' | 'pro' | 'ai'

export interface Product {
  id: string
  name: string
  slug: string
  description: string | null
  price: number
  type: ProductType
  category: string | null
  etsy_listing_id: string | null
  etsy_url: string | null
  status: ProductStatus
  created_at: string
}

export interface ProductFile {
  id: string
  product_id: string
  format: ProductFormat
  tier: ProductTier
  label: string
  url: string
  version: string
  created_at: string
}

export interface EtsyStats {
  id: string
  product_id: string
  views: number
  favorites: number
  sales_count: number
  revenue: number
  reviews_count: number
  avg_rating: number
  synced_at: string
}

export interface Sale {
  id: string
  product_id: string
  etsy_order_id: string | null
  amount: number
  buyer_country: string | null
  sold_at: string
}

export interface BundleProduct {
  id: string
  bundle_id: string
  product_id: string
}

// Join types for common queries
export interface ProductWithFiles extends Product {
  product_files: ProductFile[]
}

export interface ProductWithStats extends Product {
  etsy_stats: EtsyStats[]
}
```

- [ ] **Step 2: Write a unit test for the types**

Create `src/lib/supabase/__tests__/types.test.ts`:
```typescript
import { describe, it, expect } from 'vitest'
import type { Product, ProductFile, EtsyStats, Sale, BundleProduct } from '../types'

describe('Database types', () => {
  it('Product type has required fields', () => {
    const product: Product = {
      id: '123e4567-e89b-12d3-a456-426614174000',
      name: 'Budget Tracker',
      slug: 'budget-tracker',
      description: null,
      price: 24.00,
      type: 'spreadsheet',
      category: 'finance',
      etsy_listing_id: null,
      etsy_url: null,
      status: 'draft',
      created_at: new Date().toISOString(),
    }
    expect(product.slug).toBe('budget-tracker')
    expect(product.type).toBe('spreadsheet')
    expect(product.status).toBe('draft')
  })

  it('ProductFile type has tier field', () => {
    const file: ProductFile = {
      id: '123e4567-e89b-12d3-a456-426614174001',
      product_id: '123e4567-e89b-12d3-a456-426614174000',
      format: 'sheets',
      tier: 'pro',
      label: 'Google Sheets — Pro',
      url: 'https://docs.google.com/spreadsheets/d/example',
      version: 'v1.0',
      created_at: new Date().toISOString(),
    }
    expect(file.tier).toBe('pro')
    expect(file.format).toBe('sheets')
  })
})
```

- [ ] **Step 3: Run the test**

```bash
npm test
```

Expected output:
```
✓ src/lib/supabase/__tests__/types.test.ts (2 tests)
Test Files: 1 passed
Tests:      2 passed
```

- [ ] **Step 4: Commit**

```bash
git add src/lib/supabase/types.ts src/lib/supabase/__tests__/types.test.ts
git commit -m "feat: add TypeScript database types with tests"
```

---

## Task 5: Supabase Client Helpers

**Files:**
- Create: `src/lib/supabase/client.ts`
- Create: `src/lib/supabase/server.ts`
- Create: `src/lib/constants.ts`

- [ ] **Step 1: Create constants file**

Create `src/lib/constants.ts`:
```typescript
export const APP_NAME = 'Finance Tools'
export const APP_DESCRIPTION = 'Professional finance spreadsheets & tools'
export const ADMIN_ROUTE_PREFIX = '/admin'
```

- [ ] **Step 2: Create browser Supabase client**

Create `src/lib/supabase/client.ts`:
```typescript
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

- [ ] **Step 3: Create server Supabase client**

Create `src/lib/supabase/server.ts`:
```typescript
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // setAll called from a Server Component — safe to ignore
          }
        },
      },
    }
  )
}
```

- [ ] **Step 4: Write a unit test for the browser client**

Create `src/lib/supabase/__tests__/client.test.ts`:
```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock env vars
vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL', 'https://test.supabase.co')
vi.stubEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY', 'test-anon-key')

// Mock @supabase/ssr
vi.mock('@supabase/ssr', () => ({
  createBrowserClient: vi.fn(() => ({ from: vi.fn() })),
}))

describe('Supabase browser client', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('creates a client without throwing', async () => {
    const { createClient } = await import('../client')
    expect(() => createClient()).not.toThrow()
  })

  it('returns an object with a from method', async () => {
    const { createClient } = await import('../client')
    const client = createClient()
    expect(typeof client.from).toBe('function')
  })
})
```

- [ ] **Step 5: Run tests**

```bash
npm test
```

Expected output:
```
✓ src/lib/supabase/__tests__/types.test.ts (2 tests)
✓ src/lib/supabase/__tests__/client.test.ts (2 tests)
Test Files: 2 passed
Tests:      4 passed
```

- [ ] **Step 6: Commit**

```bash
git add src/lib/constants.ts src/lib/supabase/client.ts src/lib/supabase/server.ts src/lib/supabase/__tests__/client.test.ts
git commit -m "feat: add supabase client helpers (browser + server)"
```

---

## Task 6: Auth Middleware

**Files:**
- Create: `src/middleware.ts`

- [ ] **Step 1: Write the middleware**

Create `src/middleware.ts`:
```typescript
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  // Protect all /admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (!user) {
      const loginUrl = new URL('/admin/login', request.url)
      loginUrl.searchParams.set('redirected', 'true')
      return NextResponse.redirect(loginUrl)
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
```

- [ ] **Step 2: Write middleware unit test**

Create `src/__tests__/middleware.test.ts`:
```typescript
import { describe, it, expect, vi } from 'vitest'
import { NextRequest } from 'next/server'

vi.mock('@supabase/ssr', () => ({
  createServerClient: vi.fn(() => ({
    auth: {
      getUser: vi.fn().mockResolvedValue({ data: { user: null } }),
    },
    cookies: {},
  })),
}))

describe('Auth middleware', () => {
  it('redirects unauthenticated users from /admin to /admin/login', async () => {
    const { middleware } = await import('../middleware')
    const request = new NextRequest('http://localhost:3000/admin')
    const response = await middleware(request)
    expect(response.status).toBe(307)
    expect(response.headers.get('location')).toContain('/admin/login')
  })

  it('allows unauthenticated access to public routes', async () => {
    const { middleware } = await import('../middleware')
    const request = new NextRequest('http://localhost:3000/')
    const response = await middleware(request)
    expect(response.status).toBe(200)
  })
})
```

- [ ] **Step 3: Run tests**

```bash
npm test
```

Expected output:
```
✓ src/__tests__/middleware.test.ts (2 tests)
Test Files: 3 passed
Tests:      6 passed
```

- [ ] **Step 4: Commit**

```bash
git add src/middleware.ts src/__tests__/middleware.test.ts
git commit -m "feat: add auth middleware protecting /admin routes"
```

---

## Task 7: App Structure & Health Check

**Files:**
- Modify: `src/app/layout.tsx`
- Modify: `src/app/page.tsx`
- Create: `src/app/admin/page.tsx`
- Create: `src/app/admin/login/page.tsx`
- Create: `src/app/api/health/route.ts`

- [ ] **Step 1: Update root layout**

Replace `src/app/layout.tsx`:
```typescript
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { APP_NAME, APP_DESCRIPTION } from '@/lib/constants'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: APP_NAME,
  description: APP_DESCRIPTION,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  )
}
```

- [ ] **Step 2: Replace homepage with placeholder**

Replace `src/app/page.tsx`:
```typescript
export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">Finance Tools</h1>
      <p className="mt-4 text-lg text-gray-500">
        Professional finance spreadsheets — coming soon
      </p>
    </main>
  )
}
```

- [ ] **Step 3: Create admin placeholder**

Create `src/app/admin/page.tsx`:
```typescript
export default function AdminPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      <p className="mt-2 text-gray-500">Coming in Plan 3</p>
    </main>
  )
}
```

- [ ] **Step 4: Create admin login page**

Create `src/app/admin/login/page.tsx`:
```typescript
export default function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirected?: string }>
}) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="text-2xl font-bold">Admin Login</h1>
      <p className="mt-2 text-gray-500">Authentication UI coming in Plan 3</p>
    </main>
  )
}
```

- [ ] **Step 5: Create health check API route**

Create `src/app/api/health/route.ts`:
```typescript
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createClient()
    const { error } = await supabase.from('products').select('id').limit(1)

    if (error) {
      return NextResponse.json(
        { status: 'error', message: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      status: 'ok',
      database: 'connected',
      timestamp: new Date().toISOString(),
    })
  } catch (err) {
    return NextResponse.json(
      { status: 'error', message: 'Unexpected error' },
      { status: 500 }
    )
  }
}
```

- [ ] **Step 6: Write health route test**

Create `src/app/api/health/__tests__/route.test.ts`:
```typescript
import { describe, it, expect, vi } from 'vitest'

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn().mockResolvedValue({
    from: vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        limit: vi.fn().mockResolvedValue({ data: [], error: null }),
      }),
    }),
  }),
}))

describe('GET /api/health', () => {
  it('returns 200 with status ok when database is connected', async () => {
    const { GET } = await import('../route')
    const response = await GET()
    const body = await response.json()
    expect(response.status).toBe(200)
    expect(body.status).toBe('ok')
    expect(body.database).toBe('connected')
  })

  it('returns 500 when database errors', async () => {
    vi.mocked(
      (await import('@/lib/supabase/server')).createClient
    ).mockResolvedValueOnce({
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          limit: vi.fn().mockResolvedValue({
            data: null,
            error: { message: 'Connection failed' },
          }),
        }),
      }),
    } as any)

    const { GET } = await import('../route')
    const response = await GET()
    const body = await response.json()
    expect(response.status).toBe(500)
    expect(body.status).toBe('error')
  })
})
```

- [ ] **Step 7: Run all tests**

```bash
npm test
```

Expected output:
```
✓ src/lib/supabase/__tests__/types.test.ts (2 tests)
✓ src/lib/supabase/__tests__/client.test.ts (2 tests)
✓ src/__tests__/middleware.test.ts (2 tests)
✓ src/app/api/health/__tests__/route.test.ts (2 tests)
Test Files: 4 passed
Tests:      8 passed
```

- [ ] **Step 8: Start dev server and verify manually**

```bash
npm run dev
```

Then verify:
- Visit `http://localhost:3000` — should show "Finance Tools" placeholder
- Visit `http://localhost:3000/admin` — should redirect to `http://localhost:3000/admin/login`
- Visit `http://localhost:3000/api/health` — should return `{"status":"ok","database":"connected",...}`

- [ ] **Step 9: Commit**

```bash
git add src/app/layout.tsx src/app/page.tsx src/app/admin/page.tsx src/app/admin/login/page.tsx src/app/api/health/route.ts src/app/api/health/__tests__/route.test.ts
git commit -m "feat: scaffold app structure with health check endpoint"
```

---

## Task 8: Seed Data

**Files:**
- Create: `supabase/seed.sql`

- [ ] **Step 1: Write seed data for all 8 products**

Create `supabase/seed.sql`:
```sql
-- Seed the 8 core products (Essentials tier prices)
insert into products (name, slug, description, price, type, category, status) values
  ('Budget Tracker', 'budget-tracker', 'Monthly budget tracker with 50/30/20 scorecard, what-if simulator, and credit score module', 12.00, 'spreadsheet', 'budgeting', 'draft'),
  ('Debt Payoff Planner', 'debt-payoff-planner', 'All 3 payoff methods side-by-side, balance transfer analyzer, and student loan calculator', 14.00, 'spreadsheet', 'debt', 'draft'),
  ('Life Sinking Funds Planner', 'sinking-funds-planner', '10 pre-built templates: medical, travel, school fees, car, college, home, gifts, wedding, tech, dental', 12.00, 'spreadsheet', 'savings', 'draft'),
  ('Net Worth Tracker', 'net-worth-tracker', 'Full asset class breakdown with FIRE number, passive income potential, and age benchmark', 14.00, 'spreadsheet', 'net-worth', 'draft'),
  ('Small Business Finance Kit', 'small-business-kit', 'P&L, assets/depreciation, supplier PO workflow, inventory, general journal, and payroll framework', 29.00, 'spreadsheet', 'business', 'draft'),
  ('Family & Education Planner', 'family-education-planner', '529 vs whole life comparison, K-12 cost map, scholarship tracker, life insurance needs calculator', 17.00, 'spreadsheet', 'family', 'draft'),
  ('Investment Portfolio Tracker', 'investment-portfolio-tracker', 'Stocks, ETFs, precious metals, fixed/variable funds with spot price history and live GOOGLEFINANCE dashboard', 19.00, 'spreadsheet', 'investment', 'draft'),
  ('Zakat Calculator', 'zakat-calculator', 'Nisab threshold, Hawl tracker, Hijri calendar, multi-currency (AED/SAR/EGP/MYR/GBP/USD)', 12.00, 'spreadsheet', 'islamic-finance', 'draft');

-- Bundle product
insert into products (name, slug, description, price, type, category, status) values
  ('All-in-One Finance Bundle', 'finance-bundle', 'Pro tier of Budget Tracker, Debt Planner, Sinking Funds, Net Worth Tracker, and Small Business Kit', 47.00, 'spreadsheet', 'bundle', 'draft');

-- Link bundle to its 5 products
insert into bundle_products (bundle_id, product_id)
select
  (select id from products where slug = 'finance-bundle'),
  id
from products
where slug in (
  'budget-tracker',
  'debt-payoff-planner',
  'sinking-funds-planner',
  'net-worth-tracker',
  'small-business-kit'
);
```

- [ ] **Step 2: Apply seed to Supabase**

Go to: https://supabase.com/dashboard/project/ronfbjpqyhxipnitxrif/sql/new

Paste the seed SQL and click **Run**.

Expected: 9 rows inserted into `products`, 5 rows into `bundle_products`. Verify in Table Editor.

- [ ] **Step 3: Commit**

```bash
git add supabase/seed.sql
git commit -m "feat: add seed data for all 8 products and bundle"
```

---

## Task 9: Push and Verify Deployment

- [ ] **Step 1: Run full test suite**

```bash
npm test
```

Expected: All 8 tests passing across 4 test files.

- [ ] **Step 2: Build check**

```bash
npm run build
```

Expected: Build completes with no TypeScript errors. Any warnings are acceptable.

- [ ] **Step 3: Push to GitHub (triggers Vercel deploy)**

```bash
git push origin main
```

- [ ] **Step 4: Verify Vercel deployment**

Visit https://etsy-store-gamma.vercel.app/api/health

Expected response:
```json
{"status":"ok","database":"connected","timestamp":"..."}
```

If `database` shows `error`, check that Supabase RLS allows the anon key to read from `products`.

---

## Self-Review Checklist

- [x] **Spec coverage:** Migration covers all 5 tables ✓ | RLS policies ✓ | TypeScript types for all tables ✓ | Browser + server clients ✓ | Auth middleware for `/admin` ✓ | Health endpoint ✓ | Seed data for all 8 products ✓
- [x] **Placeholder scan:** No TBDs. All code is complete and runnable.
- [x] **Type consistency:** `ProductType`, `ProductStatus`, `ProductFormat`, `ProductTier` used consistently in types.ts and client tests. `createClient()` signature matches in both client.ts and server.ts (server version is `async`).
- [x] **RLS note:** Anon key can read `products` where `status = 'live'`. Seed data inserts all products as `draft` — health check uses authenticated client which bypasses RLS. For production testing, set at least one product to `live`.
