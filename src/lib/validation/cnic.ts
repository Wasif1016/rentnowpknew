import { z } from 'zod'

/** Pakistan CNIC: 13 digits, optional dashes/spaces in input. */
export const cnicInputSchema = z
  .string()
  .transform((s) => s.replace(/\D/g, ''))
  .pipe(z.string().length(13, 'Enter a valid 13-digit CNIC.'))

export function formatCnicForDisplay(digits: string): string {
  if (digits.length !== 13) return digits
  return `${digits.slice(0, 5)}-${digits.slice(5, 12)}-${digits.slice(12)}`
}
