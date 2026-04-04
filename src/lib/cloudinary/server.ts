import { v2 as cloudinary } from 'cloudinary'

const MAX_BYTES = 8 * 1024 * 1024 // 8 MB
const ALLOWED_MIME = new Set(['image/jpeg', 'image/png', 'image/webp'])

function ensureConfigured() {
  const cloud_name = process.env.CLOUDINARY_CLOUD_NAME
  const api_key = process.env.CLOUDINARY_API_KEY
  const api_secret = process.env.CLOUDINARY_API_SECRET
  if (!cloud_name || !api_key || !api_secret) {
    throw new Error('Cloudinary is not configured (CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET)')
  }
  cloudinary.config({ cloud_name, api_key, api_secret })
}

export type UploadVerificationImageOptions = {
  /** e.g. rentnowpk/vendor-verification/{vendorProfileId} */
  folder: string
  /** Filename segment (sanitized) */
  publicId: string
  mimeType: string
  buffer: Buffer
}

/**
 * Server-only upload to Cloudinary. Validates size and MIME before upload.
 * Returns secure HTTPS URL.
 */
export async function uploadVerificationImage(
  options: UploadVerificationImageOptions
): Promise<string> {
  const { folder, publicId, mimeType, buffer } = options

  if (buffer.length > MAX_BYTES) {
    throw new Error(`Image exceeds maximum size of ${MAX_BYTES / 1024 / 1024} MB`)
  }
  if (!ALLOWED_MIME.has(mimeType)) {
    throw new Error('Only JPEG, PNG, and WebP images are allowed')
  }

  ensureConfigured()

  const dataUri = `data:${mimeType};base64,${buffer.toString('base64')}`

  const result = await cloudinary.uploader.upload(dataUri, {
    folder,
    public_id: publicId,
    resource_type: 'image',
    overwrite: false,
    unique_filename: false,
  })

  const url = result.secure_url
  if (!url || typeof url !== 'string') {
    throw new Error('Cloudinary upload did not return a URL')
  }
  return url
}
