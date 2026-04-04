import 'server-only'

const VPIC_BASE = 'https://vpic.nhtsa.dot.gov/api/vehicles' as const
const REVALIDATE_SEC = 86_400

export type VpicMake = { id: number; name: string }
export type VpicModel = { id: number; name: string }

function parseResults(data: unknown): Record<string, unknown>[] {
  if (!data || typeof data !== 'object') return []
  const r = (data as { Results?: unknown }).Results
  if (!Array.isArray(r)) return []
  return r.filter(
    (x): x is Record<string, unknown> =>
      x !== null && typeof x === 'object' && !Array.isArray(x)
  )
}

function rowString(row: Record<string, unknown>, ...keys: string[]): string {
  for (const k of keys) {
    const v = row[k]
    if (v != null && String(v).trim()) return String(v).trim()
  }
  return ''
}

function rowNumber(row: Record<string, unknown>, ...keys: string[]): number {
  for (const k of keys) {
    const v = row[k]
    const n = typeof v === 'number' ? v : Number(v)
    if (Number.isFinite(n)) return n
  }
  return NaN
}

export async function fetchMakesForCar(): Promise<VpicMake[]> {
  const url = `${VPIC_BASE}/GetMakesForVehicleType/car?format=json`
  const res = await fetch(url, { next: { revalidate: REVALIDATE_SEC } })
  if (!res.ok) throw new Error(`vPIC makes: ${res.status}`)
  const data = (await res.json()) as unknown
  const rows = parseResults(data)
  const makes: VpicMake[] = []
  for (const row of rows) {
    const id = rowNumber(row, 'Make_ID', 'MakeId', 'make_id')
    const name = rowString(row, 'Make_Name', 'MakeName', 'make_name')
    if (Number.isFinite(id) && name) makes.push({ id, name })
  }
  return makes.sort((a, b) => a.name.localeCompare(b.name))
}

export async function fetchModelsForMakeId(makeId: number): Promise<VpicModel[]> {
  if (!Number.isFinite(makeId) || makeId <= 0) return []
  const url = `${VPIC_BASE}/GetModelsForMakeId/${makeId}?format=json`
  const res = await fetch(url, { next: { revalidate: REVALIDATE_SEC } })
  if (!res.ok) throw new Error(`vPIC models: ${res.status}`)
  const data = (await res.json()) as unknown
  const rows = parseResults(data)
  const models: VpicModel[] = []
  for (const row of rows) {
    const id = rowNumber(row, 'Model_ID', 'ModelId', 'model_id')
    const name = rowString(row, 'Model_Name', 'ModelName', 'model_name')
    if (Number.isFinite(id) && name) models.push({ id, name })
  }
  return models.sort((a, b) => a.name.localeCompare(b.name))
}
