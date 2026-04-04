import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import { users } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

type Role = 'CUSTOMER' | 'VENDOR' | 'ADMIN'

const ROLE_HOMES: Record<Role, string> = {
  CUSTOMER: '/customer',
  VENDOR: '/vendor',
  ADMIN: '/admin',
}

// Use in layouts and pages. Redirects on failure — never returns null.
export async function getRequiredUser(requiredRole?: Role) {
  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) redirect('/login')

  const [dbUser] = await db.select().from(users).where(eq(users.id, user.id)).limit(1)

  if (!dbUser) redirect('/login')

  if (requiredRole && dbUser.role !== requiredRole) {
    redirect(ROLE_HOMES[dbUser.role as Role])
  }

  return dbUser
}

// For public pages that show different UI for logged-in users
export async function getOptionalUser() {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return null
    const [dbUser] = await db.select().from(users).where(eq(users.id, user.id)).limit(1)
    return dbUser ?? null
  } catch {
    return null
  }
}
