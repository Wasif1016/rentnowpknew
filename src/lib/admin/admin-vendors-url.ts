import type { VendorVerificationFilter } from "@/lib/db/admin-vendors"

export type AdminVendorsSearchState = {
  q: string
  status: VendorVerificationFilter
  page: number
  sort: "created_desc" | "created_asc"
  detail: string | null
}

const STATUS_SET = new Set<string>([
  "all",
  "PENDING_VERIFICATION",
  "APPROVED",
  "REJECTED",
  "SUSPENDED",
])

export function parseAdminVendorsSearchParams(
  raw: Record<string, string | string[] | undefined>
): AdminVendorsSearchState {
  const q = typeof raw.q === "string" ? raw.q : ""
  const statusRaw = typeof raw.status === "string" ? raw.status : "all"
  const status: VendorVerificationFilter = STATUS_SET.has(statusRaw)
    ? (statusRaw as VendorVerificationFilter)
    : "all"

  const pageRaw = typeof raw.page === "string" ? Number.parseInt(raw.page, 10) : 1
  const page = Number.isFinite(pageRaw) && pageRaw > 0 ? pageRaw : 1

  const sort =
    typeof raw.sort === "string" && raw.sort === "created_asc"
      ? "created_asc"
      : "created_desc"

  const detailRaw = typeof raw.detail === "string" ? raw.detail.trim() : null
  const detail = detailRaw && /^[0-9a-f-]{36}$/i.test(detailRaw) ? detailRaw : null

  return { q, status, page, sort, detail }
}

export function buildAdminVendorsHref(
  state: AdminVendorsSearchState,
  patch: Partial<AdminVendorsSearchState>
): string {
  const next = { ...state, ...patch }
  const p = new URLSearchParams()
  if (next.q.trim()) p.set("q", next.q.trim())
  if (next.status !== "all") p.set("status", next.status)
  if (next.page > 1) p.set("page", String(next.page))
  if (next.sort !== "created_desc") p.set("sort", next.sort)
  if (next.detail) p.set("detail", next.detail)
  const qs = p.toString()
  return qs ? `/admin/vendors?${qs}` : "/admin/vendors"
}
