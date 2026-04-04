import { NextResponse } from 'next/server'
import { buildLogoDevMakeImageUrl } from '@/lib/logo-dev/server'

/**
 * Returns a Logo.dev image URL for the given make (for form preview).
 * The publishable key stays server-side.
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const make = searchParams.get('make')?.trim() ?? ''
  if (!make) {
    return NextResponse.json({ url: null as string | null }, { status: 200 })
  }

  const url = buildLogoDevMakeImageUrl(make)
  return NextResponse.json({ url })
}
