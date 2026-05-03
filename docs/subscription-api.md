# Subscription Module — API Reference

Base URL: `/subscriptions`  
All endpoints require `Authorization: Bearer <token>` and are restricted to **super-admin** role.

---

## Shared Types

### `Subscription`
```ts
{
  _id: string
  tenantId: string | Tenant   // Reference to tenant
  plan: "basic" | "standard" | "premium"
  billingCycle: "monthly" | "quarterly" | "annually"
  amount: number              // Amount in smallest currency unit (e.g., paise)
  paymentStatus: "pending" | "paid" | "failed" | "refunded"
  status: "active" | "expired" | "cancelled" | "suspended"
  billingDate: string         // ISO date string
  expiryDate: string          // ISO date string
  paymentReference?: string   // Transaction reference
  notes?: string
  createdAt: string
  updatedAt: string
}
```

### Plan Pricing (INR)
| Plan | Monthly | Quarterly (10% off) | Annually (20% off) |
|------|---------|---------------------|-------------------|
| Basic | ₹999 | ₹2,697 | ₹9,588 |
| Standard | ₹2,499 | ₹6,747 | ₹23,990 |
| Premium | ₹4,999 | ₹13,497 | ₹47,990 |

---

## Endpoints

---

### 1. Get Plan Pricing
**`GET /subscriptions/plans`**  
Roles: `super-admin`

Returns pricing configuration for all plans.

#### Response `200`
```ts
{
  basic: { monthly: 999, quarterly: 2697, annually: 9588 },
  standard: { monthly: 2499, quarterly: 6747, annually: 23990 },
  premium: { monthly: 4999, quarterly: 13497, annually: 47990 }
}
```

---

### 2. Create Subscription
**`POST /subscriptions`**  
Roles: `super-admin`

Creates a new subscription for a tenant. A tenant can only have one active subscription.

#### Request Body
```ts
{
  tenantId: string        // required — Tenant ObjectId
  plan: "basic" | "standard" | "premium"  // required
  billingCycle: "monthly" | "quarterly" | "annually"  // required
  amount?: number         // optional — auto-calculated from plan if not provided
  billingDate?: string    // optional — defaults to now
  paymentReference?: string
  notes?: string
}
```

#### Response `201`
Full `Subscription` object.

---

### 3. List Subscriptions
**`GET /subscriptions`**  
Roles: `super-admin`

#### Query Params
| Param | Type | Description |
|---|---|---|
| `page` | number | Default: `1` |
| `limit` | number | Default: `20` |
| `status` | string | Filter by subscription status |
| `paymentStatus` | string | Filter by payment status |
| `plan` | string | Filter by plan |
| `tenantId` | string | Filter by tenant |

#### Response `200`
```ts
{
  data: Subscription[]
  meta: { total, page, limit, totalPages }
}
```

---

### 4. Get Subscription by ID
**`GET /subscriptions/:id`**  
Roles: `super-admin`

#### Response `200`
Full `Subscription` object with populated tenant info.

---

### 5. Get Tenant Subscriptions
**`GET /subscriptions/tenant/:tenantId`**  
Roles: `super-admin`

Returns all subscriptions (active and historical) for a tenant.

#### Response `200`
```ts
Subscription[]
```

---

### 6. Get Active Subscription
**`GET /subscriptions/tenant/:tenantId/active`**  
Roles: `super-admin`

Returns the current active subscription for a tenant, or `null`.

#### Response `200`
```ts
Subscription | null
```

---

### 7. Update Subscription
**`PATCH /subscriptions/:id`**  
Roles: `super-admin`

#### Request Body
```ts
{
  plan?: "basic" | "standard" | "premium"
  billingCycle?: "monthly" | "quarterly" | "annually"
  amount?: number
  status?: "active" | "expired" | "cancelled" | "suspended"
  billingDate?: string
  expiryDate?: string
  paymentReference?: string
  notes?: string
}
```

#### Response `200`
Updated `Subscription` object.

---

### 8. Update Payment Status
**`PATCH /subscriptions/:id/payment-status`**  
Roles: `super-admin`

Updates the payment status of a subscription.

#### Request Body
```ts
{
  paymentStatus: "pending" | "paid" | "failed" | "refunded"  // required
  paymentReference?: string
  notes?: string
}
```

#### Response `200`
Updated `Subscription` object.

---

### 9. Cancel Subscription
**`POST /subscriptions/:id/cancel`**  
Roles: `super-admin`

Sets subscription status to `cancelled`.

#### Response `200`
Updated `Subscription` object.

---

### 10. Renew Subscription
**`POST /subscriptions/:id/renew`**  
Roles: `super-admin`

Renews a subscription with new billing and expiry dates.

#### Response `200`
Updated `Subscription` object with:
- New `billingDate` (now)
- New `expiryDate` (calculated from billing cycle)
- `status` set to `active`
- `paymentStatus` reset to `pending`

---

### 11. Check Expired Subscriptions
**`POST /subscriptions/check-expired`**  
Roles: `super-admin`

Checks all active subscriptions and marks expired ones.

#### Response `200`
```ts
{ expiredCount: number }
```

---

## Error Responses

| Code | Meaning |
|---|---|
| `400` | Validation error or tenant already has active subscription |
| `401` | Missing or invalid token |
| `403` | Insufficient role |
| `404` | Subscription not found |
