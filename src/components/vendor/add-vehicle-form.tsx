'use client'

import { useActionState, useEffect, useMemo, useState } from 'react'
import {
  createVehicle,
  type CreateVehicleFieldKey,
  type CreateVehicleResult,
} from '@/lib/actions/vehicles'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { showToast } from '@/components/ui/toast'
import { VehiclePickupMap } from '@/components/vendor/vehicle-pickup-map'

const MAX_BYTES = 8 * 1024 * 1024
const ACCEPT = 'image/jpeg,image/png,image/webp'

function validateFile(f: File): string | null {
  if (f.size > MAX_BYTES) return 'Each image must be 8 MB or smaller.'
  if (!ACCEPT.split(',').includes(f.type)) return 'Use JPEG, PNG, or WebP.'
  return null
}

async function createVehicleFormAction(
  prev: CreateVehicleResult | null,
  formData: FormData
): Promise<CreateVehicleResult | null> {
  return (await createVehicle(prev, formData)) ?? null
}

function fieldError(
  fe: Partial<Record<CreateVehicleFieldKey, string>> | undefined,
  key: CreateVehicleFieldKey
): string | undefined {
  return fe?.[key]
}

export function AddVehicleForm() {
  const [state, formAction, pending] = useActionState(createVehicleFormAction, null)

  const [withDriver, setWithDriver] = useState(true)
  const [selfDrive, setSelfDrive] = useState(true)

  const [cities, setCities] = useState<string[]>([])
  const [cityDraft, setCityDraft] = useState('')

  const [fileList, setFileList] = useState<File[]>([])
  const [coverIndex, setCoverIndex] = useState(0)

  const previewUrls = useMemo(
    () => fileList.map((f) => URL.createObjectURL(f)),
    [fileList]
  )

  const citiesJson = useMemo(() => JSON.stringify(cities), [cities])

  useEffect(() => {
    return () => {
      for (const u of previewUrls) {
        URL.revokeObjectURL(u)
      }
    }
  }, [previewUrls])

  const effectiveCoverIndex =
    fileList.length === 0 ? 0 : Math.min(coverIndex, fileList.length - 1)

  const addCity = () => {
    const t = cityDraft.trim()
    if (!t) return
    const lower = t.toLowerCase()
    if (cities.some((c) => c.toLowerCase() === lower)) {
      setCityDraft('')
      return
    }
    setCities((c) => [...c, t])
    setCityDraft('')
  }

  const removeCity = (idx: number) => {
    setCities((c) => c.filter((_, i) => i !== idx))
  }

  const onFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const list = e.target.files
    if (!list?.length) {
      setFileList([])
      return
    }
    const next: File[] = []
    for (let i = 0; i < list.length && next.length < 5; i++) {
      const f = list.item(i)
      if (!f) continue
      const err = validateFile(f)
      if (err) {
        showToast(err, { type: 'error' })
        continue
      }
      next.push(f)
    }
    setFileList(next)
    setCoverIndex((i) => Math.min(i, Math.max(0, next.length - 1)))
  }

  const fe = state?.ok === false ? state.fieldErrors : undefined
  const bannerError = state?.ok === false ? state.message : null

  return (
    <form
      action={formAction}
      className="mx-auto flex max-w-2xl flex-col gap-8"
      encType="multipart/form-data"
    >
      <input type="hidden" name="cities" value={citiesJson} />
      <input type="hidden" name="coverIndex" value={String(effectiveCoverIndex)} />

      {withDriver ? <input type="hidden" name="withDriverEnabled" value="on" /> : null}
      {selfDrive ? <input type="hidden" name="selfDriveEnabled" value="on" /> : null}

      {bannerError && !state?.fieldErrors ? (
        <p className="text-destructive text-sm" role="alert">
          {bannerError}
        </p>
      ) : null}

      <FieldGroup className="gap-6">
        <Field data-invalid={!!fieldError(fe, 'name')}>
          <FieldLabel htmlFor="vehicle-name">Vehicle name</FieldLabel>
          <Input
            id="vehicle-name"
            name="name"
            required
            autoComplete="off"
            placeholder="e.g. Toyota Corolla"
            className="bg-card border-border"
            aria-invalid={!!fieldError(fe, 'name')}
          />
          {fieldError(fe, 'name') ? (
            <FieldError>{fieldError(fe, 'name')}</FieldError>
          ) : null}
        </Field>

        <div className="grid gap-6 sm:grid-cols-2">
          <Field data-invalid={!!fieldError(fe, 'make')}>
            <FieldLabel htmlFor="vehicle-make">Make</FieldLabel>
            <Input
              id="vehicle-make"
              name="make"
              required
              autoComplete="off"
              className="bg-card border-border"
              aria-invalid={!!fieldError(fe, 'make')}
            />
            {fieldError(fe, 'make') ? (
              <FieldError>{fieldError(fe, 'make')}</FieldError>
            ) : null}
          </Field>
          <Field data-invalid={!!fieldError(fe, 'model')}>
            <FieldLabel htmlFor="vehicle-model">Model</FieldLabel>
            <Input
              id="vehicle-model"
              name="model"
              required
              autoComplete="off"
              className="bg-card border-border"
              aria-invalid={!!fieldError(fe, 'model')}
            />
            {fieldError(fe, 'model') ? (
              <FieldError>{fieldError(fe, 'model')}</FieldError>
            ) : null}
          </Field>
        </div>

        <Field data-invalid={!!fieldError(fe, 'year')}>
          <FieldLabel htmlFor="vehicle-year">Year</FieldLabel>
          <Input
            id="vehicle-year"
            name="year"
            type="number"
            required
            min={1990}
            max={new Date().getFullYear() + 1}
            step={1}
            className="bg-card border-border sm:max-w-48"
            aria-invalid={!!fieldError(fe, 'year')}
          />
          {fieldError(fe, 'year') ? (
            <FieldError>{fieldError(fe, 'year')}</FieldError>
          ) : null}
        </Field>
      </FieldGroup>

      <VehiclePickupMap
        fieldError={
          fieldError(fe, 'pickup') ??
          fieldError(fe, 'pickupLatitude') ??
          fieldError(fe, 'pickupLongitude')
        }
      />

      <div className="border-border space-y-4 rounded-lg border bg-card p-4">
        <p className="text-foreground text-sm font-medium">Drive types & pricing</p>
        <FieldDescription>
          Enable at least one option and enter day and month prices (PKR) for each enabled type.
        </FieldDescription>

        {(fieldError(fe, 'withDriverEnabled') || fieldError(fe, 'selfDriveEnabled')) && (
          <p className="text-destructive text-sm">
            {fieldError(fe, 'withDriverEnabled') ?? fieldError(fe, 'selfDriveEnabled')}
          </p>
        )}

        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <Checkbox
              id="with-driver"
              checked={withDriver}
              onCheckedChange={(v) => setWithDriver(v === true)}
            />
            <div className="grid flex-1 gap-3">
              <Label htmlFor="with-driver" className="text-foreground font-normal">
                With driver
              </Label>
              {withDriver ? (
                <div className="grid gap-3 sm:grid-cols-2">
                  <Field data-invalid={!!fieldError(fe, 'priceWithDriverDay')}>
                    <FieldLabel htmlFor="pwd-day">Price / day</FieldLabel>
                    <Input
                      id="pwd-day"
                      name="priceWithDriverDay"
                      type="number"
                      inputMode="decimal"
                      step="0.01"
                      min={0}
                      placeholder="0.00"
                      className="bg-background border-border"
                      aria-invalid={!!fieldError(fe, 'priceWithDriverDay')}
                    />
                    {fieldError(fe, 'priceWithDriverDay') ? (
                      <FieldError>{fieldError(fe, 'priceWithDriverDay')}</FieldError>
                    ) : null}
                  </Field>
                  <Field data-invalid={!!fieldError(fe, 'priceWithDriverMonth')}>
                    <FieldLabel htmlFor="pwd-month">Price / month</FieldLabel>
                    <Input
                      id="pwd-month"
                      name="priceWithDriverMonth"
                      type="number"
                      inputMode="decimal"
                      step="0.01"
                      min={0}
                      placeholder="0.00"
                      className="bg-background border-border"
                      aria-invalid={!!fieldError(fe, 'priceWithDriverMonth')}
                    />
                    {fieldError(fe, 'priceWithDriverMonth') ? (
                      <FieldError>{fieldError(fe, 'priceWithDriverMonth')}</FieldError>
                    ) : null}
                  </Field>
                </div>
              ) : null}
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Checkbox
              id="self-drive"
              checked={selfDrive}
              onCheckedChange={(v) => setSelfDrive(v === true)}
            />
            <div className="grid flex-1 gap-3">
              <Label htmlFor="self-drive" className="text-foreground font-normal">
                Self drive
              </Label>
              {selfDrive ? (
                <div className="grid gap-3 sm:grid-cols-2">
                  <Field data-invalid={!!fieldError(fe, 'priceSelfDriveDay')}>
                    <FieldLabel htmlFor="psd-day">Price / day</FieldLabel>
                    <Input
                      id="psd-day"
                      name="priceSelfDriveDay"
                      type="number"
                      inputMode="decimal"
                      step="0.01"
                      min={0}
                      placeholder="0.00"
                      className="bg-background border-border"
                      aria-invalid={!!fieldError(fe, 'priceSelfDriveDay')}
                    />
                    {fieldError(fe, 'priceSelfDriveDay') ? (
                      <FieldError>{fieldError(fe, 'priceSelfDriveDay')}</FieldError>
                    ) : null}
                  </Field>
                  <Field data-invalid={!!fieldError(fe, 'priceSelfDriveMonth')}>
                    <FieldLabel htmlFor="psd-month">Price / month</FieldLabel>
                    <Input
                      id="psd-month"
                      name="priceSelfDriveMonth"
                      type="number"
                      inputMode="decimal"
                      step="0.01"
                      min={0}
                      placeholder="0.00"
                      className="bg-background border-border"
                      aria-invalid={!!fieldError(fe, 'priceSelfDriveMonth')}
                    />
                    {fieldError(fe, 'priceSelfDriveMonth') ? (
                      <FieldError>{fieldError(fe, 'priceSelfDriveMonth')}</FieldError>
                    ) : null}
                  </Field>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <Field data-invalid={!!fieldError(fe, 'cities')}>
          <FieldLabel>Cities (pickup)</FieldLabel>
          <FieldDescription>Add one or more cities where this vehicle is available.</FieldDescription>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Input
              value={cityDraft}
              onChange={(e) => setCityDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  addCity()
                }
              }}
              placeholder="City name"
              className="bg-card border-border sm:flex-1"
              aria-invalid={!!fieldError(fe, 'cities')}
            />
            <Button type="button" variant="secondary" onClick={addCity}>
              Add city
            </Button>
          </div>
          {cities.length > 0 ? (
            <ul className="flex flex-wrap gap-2 pt-2">
              {cities.map((c, idx) => (
                <li
                  key={`${c}-${idx}`}
                  className="bg-muted text-muted-foreground inline-flex items-center gap-1 rounded-md px-2 py-1 text-sm"
                >
                  {c}
                  <button
                    type="button"
                    className="text-foreground hover:text-destructive underline-offset-2 hover:underline"
                    onClick={() => removeCity(idx)}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
          {fieldError(fe, 'cities') ? (
            <FieldError>{fieldError(fe, 'cities')}</FieldError>
          ) : null}
        </Field>
      </div>

      <div className="space-y-3">
        <Field data-invalid={!!fieldError(fe, 'images')}>
          <FieldLabel htmlFor="vehicle-images">Photos (1–5)</FieldLabel>
          <FieldDescription>First photo is the cover until you pick another below.</FieldDescription>
          <Input
            id="vehicle-images"
            name="images"
            type="file"
            accept={ACCEPT}
            multiple
            required
            className="bg-card border-border cursor-pointer file:mr-3 file:rounded-md file:border-0 file:bg-muted file:px-3 file:py-1.5 file:text-sm file:text-foreground"
            onChange={onFilesChange}
            aria-invalid={!!fieldError(fe, 'images')}
          />
          {fieldError(fe, 'images') ? (
            <FieldError>{fieldError(fe, 'images')}</FieldError>
          ) : null}
        </Field>

        {fileList.length > 0 ? (
          <div className="space-y-2">
            <p className="text-muted-foreground text-sm">Cover photo</p>
            <div className="flex flex-wrap gap-3">
              {fileList.map((_, i) => (
                <button
                  key={`${previewUrls[i] ?? 'p'}-${i}`}
                  type="button"
                  onClick={() => setCoverIndex(i)}
                  className={cn(
                    'relative size-20 overflow-hidden rounded-md border border-border bg-muted transition-shadow',
                    effectiveCoverIndex === i && 'ring-ring ring-2 ring-offset-2 ring-offset-background'
                  )}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element -- blob previews */}
                  <img
                    src={previewUrls[i]}
                    alt=""
                    className="size-full object-cover"
                  />
                  {effectiveCoverIndex === i ? (
                    <span className="bg-primary/90 text-primary-foreground absolute bottom-1 left-1 rounded px-1 text-[10px] font-medium">
                      Cover
                    </span>
                  ) : null}
                </button>
              ))}
            </div>
            {fieldError(fe, 'coverIndex') ? (
              <FieldError>{fieldError(fe, 'coverIndex')}</FieldError>
            ) : null}
          </div>
        ) : null}
      </div>

      <Button type="submit" disabled={pending} className="w-full sm:w-auto">
        {pending ? 'Saving…' : 'Save vehicle'}
      </Button>
    </form>
  )
}
