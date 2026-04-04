import { NextResponse } from 'next/server'
import { fetchMakesForCar } from '@/lib/nhtsa-vpic/server'

export async function GET() {
  try {
    const makes = await fetchMakesForCar()
    return NextResponse.json({ makes })
  } catch {
    return NextResponse.json(
      { error: 'Failed to load makes from NHTSA vPIC.' },
      { status: 502 }
    )
  }
}
