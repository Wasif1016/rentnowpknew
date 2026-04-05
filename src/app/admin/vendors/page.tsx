import Link from "next/link"
import { Suspense } from "react"
import { AdminVendorDetailSheet } from "@/components/admin/admin-vendor-detail-sheet"
import {
  parseAdminVendorsSearchParams,
  buildAdminVendorsHref,
} from "@/lib/admin/admin-vendors-url"
import {
  ADMIN_VENDORS_PAGE_SIZE,
  getAdminVendorDetail,
  listAdminVendorsWithTotal,
} from "@/lib/db/admin-vendors"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { cn } from "@/lib/utils"
import { format } from "date-fns"

function statusBadgeClass(status: string) {
  switch (status) {
    case "APPROVED":
      return "border-primary/30 bg-accent text-accent-foreground"
    case "REJECTED":
      return "border-destructive/40 bg-destructive/10 text-foreground"
    case "SUSPENDED":
      return "border-border bg-muted text-muted-foreground"
    default:
      return "border-border bg-muted/80 text-foreground"
  }
}

async function VendorsMain({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const raw = await searchParams
  const listState = parseAdminVendorsSearchParams(raw)

  const [{ rows, total }, detail] = await Promise.all([
    listAdminVendorsWithTotal({
      q: listState.q,
      status: listState.status,
      page: listState.page,
      sort: listState.sort,
    }),
    listState.detail
      ? getAdminVendorDetail(listState.detail)
      : Promise.resolve(null),
  ])

  const detailNotFound = listState.detail !== null && detail === null
  const totalPages = Math.max(1, Math.ceil(total / ADMIN_VENDORS_PAGE_SIZE))

  return (
    <>
      <div className="space-y-6">
        <div>
          <h1 className="text-foreground text-2xl font-semibold tracking-tight">Vendors</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Review businesses, verification status, and documents.
          </p>
        </div>

        <form
          className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end"
          method="get"
          action="/admin/vendors"
        >
          <input type="hidden" name="sort" value={listState.sort} />
          <div className="grid w-full max-w-md gap-2">
            <label htmlFor="q" className="text-foreground text-sm font-medium">
              Search
            </label>
            <Input
              id="q"
              name="q"
              defaultValue={listState.q}
              placeholder="Business name or email"
              className="border-input bg-background text-foreground"
              autoComplete="off"
            />
          </div>
          <div className="grid w-full max-w-xs gap-2">
            <label htmlFor="status" className="text-foreground text-sm font-medium">
              Status
            </label>
            <select
              id="status"
              name="status"
              defaultValue={listState.status}
              className="border-input bg-background text-foreground h-9 w-full rounded-md border px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
            >
              <option value="all">All</option>
              <option value="PENDING_VERIFICATION">Pending verification</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
              <option value="SUSPENDED">Suspended</option>
            </select>
          </div>
          <Button type="submit" variant="secondary">
            Apply
          </Button>
        </form>

        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span className="text-muted-foreground">Sort:</span>
          <Button variant="ghost" size="sm" asChild className="h-8 px-2">
            <Link
              href={buildAdminVendorsHref(listState, {
                sort: "created_desc",
                page: 1,
                detail: null,
              })}
            >
              Newest
            </Link>
          </Button>
          <Button variant="ghost" size="sm" asChild className="h-8 px-2">
            <Link
              href={buildAdminVendorsHref(listState, {
                sort: "created_asc",
                page: 1,
                detail: null,
              })}
            >
              Oldest
            </Link>
          </Button>
        </div>

        <div className="rounded-lg border border-border bg-card">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Business</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead className="text-right">Vehicles</TableHead>
                <TableHead className="w-[100px] text-right"> </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-muted-foreground py-10 text-center">
                    No vendors match your filters.
                  </TableCell>
                </TableRow>
              ) : (
                rows.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell className="text-foreground font-medium">{row.businessName}</TableCell>
                    <TableCell className="text-muted-foreground max-w-[200px] truncate">
                      {row.userEmail}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={cn(
                          "font-normal",
                          statusBadgeClass(row.verificationStatus)
                        )}
                      >
                        {row.verificationStatus.replace(/_/g, " ")}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {row.verificationSubmittedAt
                        ? format(row.verificationSubmittedAt, "MMM d, yyyy")
                        : "—"}
                    </TableCell>
                    <TableCell className="text-right tabular-nums">{row.vehicleCount}</TableCell>
                    <TableCell className="text-right">
                      <Link
                        href={buildAdminVendorsHref(listState, { detail: row.id })}
                        className="text-primary text-sm font-medium underline-offset-4 hover:underline"
                        scroll={false}
                      >
                        View
                      </Link>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {totalPages > 1 && (
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                {listState.page <= 1 ? (
                  <span className="inline-flex h-9 items-center gap-1 rounded-md px-3 text-sm opacity-50">
                    Previous
                  </span>
                ) : (
                  <PaginationPrevious
                    href={buildAdminVendorsHref(listState, { page: listState.page - 1 })}
                  />
                )}
              </PaginationItem>
              <PaginationItem>
                <span className="text-muted-foreground px-2 text-sm">
                  Page {listState.page} of {totalPages}
                </span>
              </PaginationItem>
              <PaginationItem>
                {listState.page >= totalPages ? (
                  <span className="inline-flex h-9 items-center gap-1 rounded-md px-3 text-sm opacity-50">
                    Next
                  </span>
                ) : (
                  <PaginationNext
                    href={buildAdminVendorsHref(listState, { page: listState.page + 1 })}
                  />
                )}
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}

        <p className="text-muted-foreground text-xs">
          {total} vendor{total === 1 ? "" : "s"} total
        </p>
      </div>

      <AdminVendorDetailSheet
        key={listState.detail ?? "closed"}
        open={listState.detail !== null}
        listState={listState}
        detail={detail}
        detailNotFound={detailNotFound}
      />
    </>
  )
}

export default function AdminVendorsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  return (
    <Suspense fallback={<div className="text-muted-foreground text-sm">Loading vendors…</div>}>
      <VendorsMain searchParams={searchParams} />
    </Suspense>
  )
}
