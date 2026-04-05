import { Skeleton } from "@/components/ui/skeleton"

export default function AdminVendorsLoading() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-8 w-48 bg-muted" />
        <Skeleton className="mt-2 h-4 w-72 max-w-full bg-muted" />
      </div>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Skeleton className="h-9 max-w-md flex-1 bg-muted" />
        <Skeleton className="h-9 w-full max-w-xs bg-muted" />
        <Skeleton className="h-9 w-24 bg-muted" />
      </div>
      <Skeleton className="h-[320px] w-full rounded-lg bg-muted" />
    </div>
  )
}
