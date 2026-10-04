# Asgari Tour & Travels - Kashmir & Ladakh Travel Website

A futuristic, full-featured travel agency website for Asgari Tour & Travels, covering all major destinations in Kashmir & Ladakh.

## Tech Stack
- **Framework**: Next.js 16 (App Router) with TypeScript
- **Styling**: Tailwind CSS 4 + shadcn/ui (New York style)
- **Database**: Prisma ORM (SQLite for dev, PostgreSQL/Turso for production)
- **Animations**: Framer Motion
- **Icons**: Lucide React

## Features
- 36 destinations (Kashmir + Ladakh) with SEO pages, images, weather widgets
- 16 tour packages (honeymoon, family, group, adventure, photography)
- 15 activities with detail pages
- 10 blog posts with related posts
- 14 testimonials with carousel
- Complete admin CMS (dashboard, CRM kanban, all CRUDs, coupons, gallery, settings)
- Global search (Ctrl+K), comparison tool, trip planner wizard
- Payment integration, booking modal, departure calendar
- Instagram feed, newsletter popup, scroll progress
- Real-time weather widget (Open-Meteo API)
- SEO: sitemap, robots, JSON-LD, /guide page with famous Kashmir goods

## Local Development

```bash
# Install dependencies
bun install

# Create .env file
cp .env.example .env
# Edit .env to set DATABASE_URL

# Push database schema
bun run db:push

# Seed the database with content
bun run seed:all

# Start dev server
bun run dev
```

## Deployment on Vercel

### 1. Database Setup
SQLite with a local file path won't work on Vercel (no persistent filesystem). Use a cloud database:

**Option A: PostgreSQL (recommended)**
1. Create a free PostgreSQL database on [Neon](https://neon.tech), [Supabase](https://supabase.com), or [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres)
2. Get the connection string (e.g., `postgresql://user:pass@host:5432/dbname`)
3. Change `provider` to `"postgresql"` in `prisma/schema.prisma`

**Option B: Turso (SQLite-compatible cloud database)**
1. Create a free database on [Turso](https://turso.tech)
2. Get the connection URL (e.g., `libsql://your-db.turso.io`)

### 2. Set Environment Variables in Vercel
Go to your Vercel project settings > Environment Variables and add:
```
DATABASE_URL=your-cloud-database-url
ADMIN_TOKEN=asgari-admin-2024
```

### 3. Deploy
Push to GitHub and Vercel will automatically build and deploy.

### 4. Initialize Database
After the first deploy, run the database migration and seed scripts locally (with your cloud DATABASE_URL in .env):
```bash
# Set DATABASE_URL in .env to your cloud database URL
bun run db:push
bun run seed:all
```

## Admin Access
- URL: `/admin`
- Token: `asgari-admin-2024` (change via `ADMIN_TOKEN` env var)

## Contact
- Phone: +91 70063 35618
- Email: Asgaritourandtravel@gmail.com
- WhatsApp: https://wa.me/917006335618
