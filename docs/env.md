# Environment variables

Never commit real secrets. Copy values into `.env` locally and configure the same keys in Vercel (or your host).

## Required for the app

| Variable                        | Purpose                                                                                                                                                                                                                                                                                               |
| ------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `DATABASE_URL`                  | Postgres connection string. Prefer the Supabase **pooler** URL (port `6543`) for the app. The Drizzle client sets `prepare: false` in code because PgBouncer transaction mode does not support prepared statements. Use a **direct** URL (port `5432`) for `drizzle-kit` if you hit migration issues. |
| `NEXT_PUBLIC_SUPABASE_URL`      | Supabase project URL.                                                                                                                                                                                                                                                                                 |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key (browser-safe).                                                                                                                                                                                                                                                                     |

## Vendor verification (Cloudinary)

Server-side uploads only. Used when a vendor submits the verification wizard.

| Variable                | Purpose                                   |
| ----------------------- | ----------------------------------------- |
| `CLOUDINARY_CLOUD_NAME` | Cloud name from the Cloudinary dashboard. |
| `CLOUDINARY_API_KEY`    | API key.                                  |
| `CLOUDINARY_API_SECRET` | API secret (server only).                 |

Images are stored under folders like `rentnowpk/vendor-verification/{vendorProfileId}/`.
