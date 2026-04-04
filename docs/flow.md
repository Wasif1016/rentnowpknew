# RentNowPk — Mermaid Flowcharts

Paste each section into https://mermaid.live to preview.

---

## 1. Customer Journey

```mermaid
flowchart TD
    A([Landing Page / SEO Pages]) --> B[Browse or Search Listings]
    B --> C[Click Request a Booking]
    C --> D{Logged in?}
    D -- Yes --> F[Open Booking Overlay on Vehicle Page]
    D -- No --> E[Show Login / Signup Prompt]
    E --> E1[Auto Verify - No Email Step]
    E1 --> E2[Retain All Filled Details]
    E2 --> F

    F --> G[Enter Pickup Location - Google Places]
    G --> H[Enter Drop-off Location - Google Places]
    H --> I[Select Dates and Times]
    I --> J[Name Auto-fill from Profile]
    J --> K[CNIC Auto-fill or First Time Entry - Saved to Profile]
    K --> L[Choose Drive Type - With Driver or Self Drive]
    L --> M[Add Optional Note]
    M --> N[System Calculates Distance in Backend]
    N --> O[Open Chat Thread with Vendor]
    O --> P([Booking Request Sent - Status: Pending])

    P --> Q{Vendor Decision}
    Q -- Accept --> R([Confirmed - Dates Auto-Blocked])
    Q -- Reject --> S([Rejected - Customer Notified in Chat])
    Q -- No Response --> T([Expired])
    P -- Customer Cancels --> U([Cancelled Before Acceptance])

    R --> V[Booking Summary Email Sent to Both with Phone Numbers]
    V --> W[Google Maps Sharing Enabled in Chat]
    W --> X[Payment Off-Platform - Cash or Transfer]
    X --> Y([Ride Completed])
    Y --> Z[Auto Review Prompt 1 Day After via Chat]
    Z --> AA([Customer Submits Review])

    R -- Cancel within 24hrs before pickup --> AB([Cancelled After Confirmation - with Reason])
```

---

## 2. Vendor Onboarding and Verification

```mermaid
flowchart TD
    A[Vendor Signs Up - Business Name, Email, Phone] --> B[Supabase Sends Email Verification]
    B --> C[Email Verified]
    C --> D[Redirect to /vendor/vehicles/add]
    D --> E[Top Banner - Submit Docs to Go Live]

    E --> F[Submit CNIC Number]
    F --> G[Upload Front and Back CNIC Images]
    G --> H[Upload Own Photo - Selfie]
    H --> I([Pending Admin Review])

    I --> J{Admin Reviews Docs}
    J -- Approve --> K[All Vehicles Go Live]
    J -- Reject --> L[Rejection Email with Reason Note]
    L --> M[Vendor Resubmits Docs]
    M --> F

    K --> N[Vendor Notified via Email and In-App]
    N --> O([Vendor Active on Platform])
```

---

## 3. Vehicle Listing

```mermaid
flowchart TD
    A[Open Add Vehicle Form] --> B[Upload up to 5 Images - Set Cover]
    B --> C[Enter Name, Make, Model, Year]
    C --> D[Select City or Multiple Cities]
    D --> E{Drive Type Options}
    E -- With Driver --> F[Set Price Per Day and Per Month - With Driver]
    E -- Self Drive --> G[Set Price Per Day and Per Month - Self Drive]
    E -- Both --> F & G
    F --> H[Mark Unavailable Dates on Calendar]
    G --> H
    H --> I([Vehicle Saved - Hidden Until Vendor Verified])
    I --> J{Vendor Verified?}
    J -- Yes --> K([Vehicle Live on Platform])
    J -- No --> I
    K --> L{Vendor Toggles Availability}
    L -- Deactivate --> M([Hidden from Site - Existing Bookings Unaffected])
    L -- Activate --> K
```

---

## 4. Booking and Chat Flow

```mermaid
flowchart TD
    A([Booking Request Arrives]) --> B[Appears in Bookings Page and Chat Thread]
    B --> C[Vendor Chats with Customer]
    C --> D{Vendor Decision}

    D -- Accept --> E[Dates Auto-Blocked on Calendar]
    E --> F[Customer Notified in Chat and Push Notification]
    F --> G([Booking Confirmed])

    D -- Reject --> H([Rejected - Customer Notified in Chat])

    D -- Conflict - Already Accepted --> I[System Shows Conflict Warning]
    I --> J[New Booking Created for Customer to Confirm]

    G --> K[Send Offer Button Active in Thread]
    K --> L[Popup - Select Vehicle, Dates, Times, Price, Note]
    L --> M{Who Initiated?}
    M -- Vendor --> N[Vendor Selects from Own Fleet]
    M -- Customer --> O[Customer Sees Vendor Cars for Original Dates Only]
    N --> P([New Booking Request Sent - Back to Pending])
    O --> P

    G --> Q[Vendor Sends Review Link from Chat Post-Ride]
```

---

## 5. Contact Detection - Pre-Booking Only

```mermaid
flowchart TD
    A[Message Sent Before Booking Confirmed] --> B[Regex Scanner Runs]
    B --> C{Contact Info Detected?}
    C -- No --> D([Message Delivered Normally])
    C -- Yes --> E[Message Silently Blocked - Never Delivered]
    E --> F[Warning Shown in Sender Chat UI]
    E --> G[Warning Email Sent to Sender]
    E --> H[Admin Notified - Thread Marked Red]
    H --> I{Admin Manual Decision}
    I -- Accidental --> J([Cleared - No Action])
    I -- Deliberate --> K([Account Warning or Disabled])

    L([Booking Confirmed]) --> M([Contact Detection OFF for This Thread])
```

---

## 6. Review System

```mermaid
flowchart TD
    A([Ride Completed]) --> B[Auto Prompt Sent 1 Day After via Chat and Notification]
    A --> C[Vendor Can Send Review Link from Chat Anytime Post-Ride]
    B --> D[Review Link Opens on Dedicated Page - New Tab]
    C --> D
    D --> E{Customer Eligible?}
    E -- No Confirmed Booking --> F([Review Blocked])
    E -- Eligible --> G[Customer Submits Rating and Comment]
    G --> H{Already Reviewed This Booking?}
    H -- Yes --> I([Blocked - One Review Per Booking])
    H -- No --> J{30 Day Limit on Same Vehicle?}
    J -- Yes --> K([Blocked - Too Soon])
    J -- No --> L([Review Published on Vendor Profile and All Vehicles])
    L --> M[Vendor Can Reply - 50 Word Limit]
    L --> N[Avg Rating Recalculated]
```

---

## 7. Admin Panel

```mermaid
flowchart TD
    A[Admin Dashboard] --> B[Verification Queue]
    A --> C[Flagged Chat Queue]
    A --> D[All Bookings View]
    A --> E[Stats Dashboard]
    A --> F[SEO Management]

    B --> G[Review CNIC and Selfie]
    G --> H{Decision}
    H -- Approve --> I[All Vendor Vehicles Go Live]
    H -- Reject --> J[Send Rejection Email with Reason]
    J --> K[Vendor Resubmits]
    K --> B
    I --> L[Vendor Notified]

    C --> M{Manual Decision on Flagged Thread}
    M -- Clear --> N([No Action])
    M -- Action --> O([Warn or Disable Account])

    D --> P[Read-Only View of All Chats]
    P --> Q[Admin Can Message Vendor or Customer]

    E --> R[Total Vendors - Active / Pending / Suspended]
    E --> S[Total Customers]
    E --> T[Total Bookings - Confirmed / Cancelled / Pending]
    E --> U[New Signups Today]
    E --> V[Leakage Flags Today]
```

---

## 8. SEO Auto-Generation

```mermaid
flowchart TD
    A[Admin Adds Keyword + City + Town] --> B[Auto-Generate /keyword Page]
    A --> C[Auto-Generate /keyword/city Page]
    A --> D[Auto-Generate /keyword/city/town Page]
    A --> E[Auto-Generate /keyword/city/vehicle-name Page]

    B --> F[Content Auto-Adjusts from URL Params]
    C --> F
    D --> F
    E --> F

    F --> G[Page Immediately Indexable in Google]
    G --> H{URL Slug Changes?}
    H -- Yes --> I[301 Redirect to New Slug]
    H -- No --> J([Page Stays Live])

    K[Vehicle or Vendor No Longer Exists] --> L([Smart 404 Page with Search - No Dead Ends])
```

---

## 9. Notification System

```mermaid
flowchart TD
    A[Trigger Event] --> B{Event Type}
    B -- New Booking Request --> C[Push + In-App to Vendor]
    B -- Booking Accepted --> D[Push + In-App to Customer]
    B -- Booking Rejected --> E[Push + In-App to Customer]
    B -- Booking Cancelled --> F[Push + In-App to Both]
    B -- New Chat Message --> G[Push + In-App + Sound Tone to Recipient]
    B -- Verification Approved or Rejected --> H[Push + In-App + Email to Vendor]
    B -- Contact Info Flagged --> I[In-App Notification to Admin - Thread Marked Red]
    B -- Review Prompt --> J[Push + In-App + Chat Message to Customer]

    K[User First Visit] --> L{Push Permission Granted?}
    L -- Yes --> M([Notifications Active])
    L -- No --> N[Re-request Every 2 Days]
    N --> L
```