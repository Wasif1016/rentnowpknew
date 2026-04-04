// Cache tags — single source of truth for all cache keys
// Used with "use cache" directive and updateTag() for cache invalidation

// ============================================================
// CACHE TAG FACTORIES
// ============================================================

export function painterProfileTag(painterId: string) {
  return `painter-profile-${painterId}`
}

export function paintersCityTag(city: string, state: string) {
  return `painters-city-${city}-${state}`
}

export function painterLayoutTag(painterId: string) {
  return `painter-layout-${painterId}`
}

export function painterReviewsTag(painterId: string) {
  return `painter-reviews-${painterId}`
}

export function painterLeadsTag(painterId: string) {
  return `painter-leads-${painterId}`
}

export function projectQuotesTag(projectId: string) {
  return `project-quotes-${projectId}`
}

export function projectTag(projectId: string) {
  return `project-${projectId}`
}

export function howItWorksTag() {
  return 'how-it-works'
}

export function staticContentTag(key: string) {
  return `static-${key}`
}

// ============================================================
// CACHE INVALIDATION MAP
// Maps mutations to the cache tags they should invalidate
// ============================================================

export const CACHE_INVALIDATION_MAP = {
  // Painter mutations
  updatePainterProfile: [
    (painterId: string, data?: { primaryCity?: string; primaryState?: string }) => [
      painterProfileTag(painterId),
      painterLayoutTag(painterId),
      data?.primaryCity && data?.primaryState
        ? paintersCityTag(data.primaryCity, data.primaryState)
        : null,
    ].filter(Boolean),
  ],
  updatePortfolio: [
    (painterId: string) => [painterProfileTag(painterId)],
  ],

  // Quote mutations
  submitQuote: [
    (_quoteId: string, data: { projectId: string; painterId: string }) => [
      projectQuotesTag(data.projectId),
      painterLeadsTag(data.painterId),
    ],
  ],
  acceptQuote: [
    (_quoteId: string, data: { projectId: string; painterId: string }) => [
      projectQuotesTag(data.projectId),
      painterLeadsTag(data.painterId),
    ],
  ],

  // Payment mutations
  releasePayment: [
    (_jobId: string, data: { painterId: string }) => [
      painterLayoutTag(data.painterId),
    ],
  ],

  // Review mutations
  submitReview: [
    (_reviewId: string, data: { painterId: string }) => [
      painterReviewsTag(data.painterId),
      painterProfileTag(data.painterId),
    ],
  ],

  // Admin mutations
  approvePainter: [
    (_painterId: string, data: { primaryCity?: string; primaryState?: string }) => [
      data?.primaryCity && data?.primaryState
        ? paintersCityTag(data.primaryCity, data.primaryState)
        : null,
    ].filter(Boolean),
  ],
} as const

// ============================================================
// TYPE HELPERS
// ============================================================

export type CacheTag =
  | ReturnType<typeof painterProfileTag>
  | ReturnType<typeof paintersCityTag>
  | ReturnType<typeof painterLayoutTag>
  | ReturnType<typeof painterReviewsTag>
  | ReturnType<typeof painterLeadsTag>
  | ReturnType<typeof projectQuotesTag>
  | ReturnType<typeof projectTag>
  | ReturnType<typeof howItWorksTag>
  | ReturnType<typeof staticContentTag>
