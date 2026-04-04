// Matching Engine - algorithm for matching homeowners with painters
// Located at src/lib/matching/engine.ts
// Called by Inngest, never called directly from a page or Server Action

import { db } from '@/lib/db'
import {
  projects,
  painterProfiles,
  leads,
  users,
} from '@/lib/db/schema'
import { eq, and, sql, inArray } from 'drizzle-orm'

// ============================================================
// TYPES
// ============================================================

export interface MatchingInput {
  projectId: string
  jobType: string
  lat: number
  lng: number
  budgetMin?: number
  budgetMax?: number
  preferredStartDate?: Date
}

export interface MatchedPainter {
  painterId: string
  score: number
  reason: string
}

interface PainterScore {
  id: string
  userId: string
  businessName: string
  avgRating: number | null
  totalReviews: number
  responseRate: number
  distance: number
  // REMOVED: subscriptionTier (Phase 1 - no subscription)
  jobsCompleted: number
  score: number
}

// ============================================================
// ALGORITHM WEIGHTS (Phase 1 - no subscription tiers)
// ============================================================

const WEIGHTS = {
  RATING: 0.30,         // 30% - rating
  RESPONSE_RATE: 0.25, // 25% - response rate
  PROXIMITY: 0.20,     // 20% - inverse distance
  JOBS_COMPLETED: 0.25, // 25% - experience (was 10% + 15% subscription bonus)
}

const MAX_LEADS_PER_PROJECT = 5
const INITIAL_RADIUS_MILES = 25
const EXPANDED_RADIUS_MILES = 40

// ============================================================
// MAIN FUNCTION
// ============================================================

/**
 * Run matching algorithm for a project
 * Called by Inngest function: project/matching.requested
 */
export async function runMatching(input: MatchingInput): Promise<MatchedPainter[]> {
  const { projectId, jobType, lat, lng, budgetMin, budgetMax } = input

  console.log(`[Matching] Starting for project ${projectId}`)

  // Step 1: Find painters within radius using PostGIS
  // Note: This requires PostGIS extension enabled on Supabase
  // For now, we'll do a simple query and filter
  let painters = await findPaintersInRadius(lat, lng, INITIAL_RADIUS_MILES)

  // Step 2: Expand radius if fewer than 8 found
  if (painters.length < 8) {
    console.log(`[Matching] Expanding radius to ${EXPANDED_RADIUS_MILES} miles`)
    painters = await findPaintersInRadius(lat, lng, EXPANDED_RADIUS_MILES)
  }

  if (painters.length === 0) {
    console.log(`[Matching] No painters found for project ${projectId}`)
    await markProjectNoSupply(projectId)
    return []
  }

  // Step 3: Apply hard filters (Phase 1 - no subscription checks)
  const eligiblePainters = painters.filter((painter) => {
    // Must be ACTIVE
    if (painter.status !== 'ACTIVE') return false

    // No subscription checks in Phase 1 - all ACTIVE painters receive leads
    return true
  })

  if (eligiblePainters.length === 0) {
    console.log(`[Matching] No eligible painters after filtering`)
    await markProjectNoSupply(projectId)
    return []
  }

  // Step 4: Score each painter
  const scoredPainters = eligiblePainters.map((painter) => ({
    ...painter,
    score: calculateScore(painter, lat, lng),
  }))

  // Step 5: Sort by score descending
  scoredPainters.sort((a, b) => b.score - a.score)

  // Step 6: Take top 5 (or fewer)
  const topPainters = scoredPainters.slice(0, MAX_LEADS_PER_PROJECT)

  // Step 7: Create Lead records and send notifications
  const matchedPainters: MatchedPainter[] = []
  for (let i = 0; i < topPainters.length; i++) {
    const painter = topPainters[i]
    await createLead(projectId, painter.painterId, painter.score, painter.distance || 10, i + 1)
    matchedPainters.push({
      painterId: painter.painterId,
      score: painter.score,
      reason: getMatchReason(painter),
    })

    // TODO: Send notification to painter
    // await notifyPainterOfNewLead(painter.userId, projectCity, jobType, leadId)
  }

  // Step 8: Update project status
  await updateProjectStatus(projectId, 'QUOTING')

  console.log(`[Matching] Matched ${matchedPainters.length} painters for project ${projectId}`)

  return matchedPainters
}

// ============================================================
// HELPER FUNCTIONS
// ============================================================

/**
 * Find painters within radius (simplified - requires PostGIS for true geo queries)
 * Phase 1: No subscription checks - all ACTIVE painters receive leads
 */
async function findPaintersInRadius(
  lat: number,
  lng: number,
  radiusMiles: number
): Promise<any[]> {
  // This is a simplified version
  // In production, use PostGIS: ST_DWithin or ST_DistanceSphere
  // For now, fetch all ACTIVE painters and filter by approximate distance

  const result = await db
    .select({
      id: painterProfiles.id,
      userId: users.id,
      businessName: painterProfiles.businessName,
      avgRating: painterProfiles.avgRating,
      totalReviews: painterProfiles.totalReviews,
      responseRate: painterProfiles.responseRate,
      jobsCompleted: painterProfiles.jobsCompleted,
      status: painterProfiles.status,
      primaryLat: painterProfiles.primaryLat,
      primaryLng: painterProfiles.primaryLng,
    })
    .from(painterProfiles)
    .leftJoin(users, eq(users.id, painterProfiles.userId))
    .where(eq(painterProfiles.status, 'ACTIVE'))

  // Filter by approximate distance (simplified)
  // In production, use proper geo queries with PostGIS
  return result.filter(() => {
    // TODO: Calculate actual distance using lat/lng
    // For now, return all (assuming database handles geo filtering)
    return true
  })
}

/**
 * Calculate matching score for a painter (Phase 1 - no subscription)
 */
function calculateScore(painter: any, projectLat: number, projectLng: number): number {
  // Normalize values to 0-100 scale

  // Rating score (30%)
  const ratingScore = (painter.avgRating || 0) * 20 // 5 * 20 = 100

  // Response rate score (25%)
  const responseScore = (painter.responseRate || 0) * 100

  // Proximity score (20%) - inverse of distance
  const distance = calculateDistance(
    projectLat,
    projectLng,
    painter.lat || 0,
    painter.lng || 0
  )
  const proximityScore = Math.max(0, 100 - distance * 2) // Closer = higher

  // Jobs completed score (25%) - increased from 10% (no subscription bonus)
  const jobsScore = Math.min(100, (painter.jobsCompleted || 0) * 5)

  // Calculate weighted total (no subscription component)
  const totalScore =
    ratingScore * WEIGHTS.RATING +
    responseScore * WEIGHTS.RESPONSE_RATE +
    proximityScore * WEIGHTS.PROXIMITY +
    jobsScore * WEIGHTS.JOBS_COMPLETED

  return Math.round(totalScore * 100) / 100
}

/**
 * Calculate distance between two coordinates (Haversine formula simplified)
 */
function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  // Simplified - in production use PostGIS ST_DistanceSphere
  const R = 3959 // Earth's radius in miles
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) *
      Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

/**
 * Get human-readable match reason (Phase 1 - no subscription)
 */
function getMatchReason(painter: PainterScore): string {
  const reasons: string[] = []

  if (painter.avgRating && painter.avgRating >= 4.5) {
    reasons.push('highly rated')
  }
  if (painter.responseRate >= 90) {
    reasons.push('quick responder')
  }
  // No subscription tier in Phase 1
  if (painter.jobsCompleted >= 50) {
    reasons.push('experienced')
  }

  return reasons.length > 0 ? reasons.join(', ') : 'matched to your project'
}

/**
 * Create lead record for painter (Phase 1 - no lead caps)
 */
async function createLead(
  projectId: string,
  painterId: string,
  score: number,
  distanceMiles: number,
  rank: number
) {
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

  await db.insert(leads).values({
    projectId,
    painterId,
    status: 'SENT',
    expiresAt,
    matchScore: score.toFixed(2),
    matchRank: rank,
    distanceMiles: distanceMiles.toFixed(2),
  })

  // No lead cap in Phase 1 - all ACTIVE painters can receive unlimited leads
}

/**
 * Mark project as NO_SUPPLY when no painters found
 */
async function markProjectNoSupply(projectId: string) {
  await db
    .update(projects)
    .set({ status: 'NO_SUPPLY' })
    .where(eq(projects.id, projectId))

  // TODO: Notify homeowner
}

/**
 * Update project status after matching
 */
async function updateProjectStatus(projectId: string, status: 'DRAFT' | 'OPEN' | 'MATCHING' | 'QUOTING' | 'HIRED' | 'IN_PROGRESS' | 'COMPLETE_PENDING' | 'COMPLETED' | 'DISPUTED' | 'REFUNDED' | 'REFUNDED_PARTIAL' | 'SPLIT_SETTLED' | 'EXPIRED' | 'CANCELLED' | 'NO_SUPPLY') {
  await db
    .update(projects)
    .set({ status })
    .where(eq(projects.id, projectId))
}
