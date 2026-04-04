This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

The home page is `src/app/(public)/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


## RentNowPk

Stack: Next.js 16, Supabase Auth, Drizzle ORM, Tailwind, shadcn/ui. Product flows live in `docs/architecture.md` and `docs/flow.md`. **Route map:** `docs/routes.md`.

Copy `.env.example` to `.env.local` and set `DATABASE_URL` (and `DIRECT_URL` for migrations), Supabase keys, and email sender.

### Database (Drizzle + Supabase Postgres)

From the project root, with `DATABASE_URL` set (Supabase **Session pooler** URI is fine for app code; use **direct** `5432` for `drizzle-kit migrate` if the pooler rejects DDL):

```bash
# Apply existing SQL migrations in ./drizzle → database (recommended for production)
pnpm exec drizzle-kit migrate

# Or push schema.ts to DB without new migration files (handy in dev only)
pnpm exec drizzle-kit push

# After editing schema.ts — generate a new migration SQL file
pnpm exec drizzle-kit generate
```

Scripts: `pnpm run db:migrate`, `pnpm run db:push`, `pnpm run db:generate` (see `package.json`).

### Inngest (local dev, optional)

```bash
pnpm dlx inngest-cli@latest dev -u http://localhost:3000/api/inngest
```