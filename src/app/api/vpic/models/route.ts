import { NextResponse } from 'next/server'
import { fetchModelsForMakeId } from '@/lib/nhtsa-vpic/server'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const raw = searchParams.get('makeId')
  const makeId = raw === null ? NaN : Number(raw)
  if (!Number.isFinite(makeId) || makeId <= 0) {
    return NextResponse.json({ error: 'Invalid makeId.' }, { status: 400 })
  }

  try {
    const models = await fetchModelsForMakeId(makeId)
    return NextResponse.json({ models })
  } catch {
    return NextResponse.json(
      { error: 'Failed to load models from NHTSA vPIC.' },
      { status: 502 }
    )
  }
}
