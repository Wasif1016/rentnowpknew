import type { EmailTemplateKey } from "./registry"

/** Placeholder names must match what you configure in each Brevo template. */

export function paramsVendorVerificationApproved(input: {
  businessName: string
  dashboardUrl: string
}): Record<string, string> {
  return {
    BUSINESS_NAME: input.businessName,
    DASHBOARD_URL: input.dashboardUrl,
  }
}

export function paramsVendorVerificationRejected(input: {
  businessName: string
  rejectionReason: string
  dashboardUrl: string
}): Record<string, string> {
  return {
    BUSINESS_NAME: input.businessName,
    REJECTION_REASON: input.rejectionReason,
    DASHBOARD_URL: input.dashboardUrl,
  }
}

export function emailParamsForTemplate(
  key: EmailTemplateKey,
  params: Record<string, string>
): Record<string, string> {
  return params
}
