import { AddVehicleForm } from '@/components/vendor/add-vehicle-form'

export default function VendorAddVehiclePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-foreground text-2xl font-semibold tracking-tight">Add vehicle</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Add photos, pricing, and cities. You can change details later when editing is available.
        </p>
      </div>
      <AddVehicleForm />
    </div>
  )
}
