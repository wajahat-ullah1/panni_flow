# Auth Module — API Reference

Base URL: `/auth`

> **Public endpoints** (`register`, `customer-register`, `login`, `forgot-password`, `reset-password`) do **not** require a Bearer token.  
> All other endpoints require `Authorization: Bearer <token>`.  
> Endpoints scoped to a specific tenant also require the `X-Tenant-ID` header (tenant slug).

---

## Endpoints

---

### 1. Register Tenant
**`POST /auth/register`**  
Public — no auth required.  
Creates a new tenant, subscription, and admin user in one call.

#### Request Body
```ts
{
  // Tenant fields
  name: string          // required — company/business name
  slug: string          // required — unique tenant ID (lowercase, no spaces)
  email: string         // required — tenant contact email
  phone?: string
  address?: {
    street?: string
    city?: string
    state?: string
    postalCode?: string
    country?: string
  }
  logo?: string         // optional — URL or path to tenant logo
  // Subscription fields
  plan: "basic" | "standard" | "premium"  // required — subscription plan
  billingCycle: "monthly" | "quarterly" | "annually"  // required — billing cycle
  // Admin user
  adminUser: {
    fullName: string    // required
    email: string       // required
    password: string    // required, min 8 chars
  }
}
```

#### Response `201`
```ts
{
  tenant: { id, name, slug }
  subscription: {
    _id, tenantId, plan, billingCycle, amount,
    paymentStatus, status, billingDate, expiryDate
  }
  user: { id, fullName, email, role: "admin" }
  accessToken: string
}
```

---

### 2. Customer Self-Registration
**`POST /auth/customer-register`**  
Public — no auth required.  
Header: `X-Tenant-ID: <tenant-slug>`

#### Request Body
```ts
{
  fullName: string    // required
  email: string       // required
  phone: string       // required
  password: string    // required, min 6 chars
}
```

#### Response `201`
```ts
{
  user: { _id, fullName, email, role: "customer" }
  customer: { _id, name, phone }
  accessToken: string
}
```

---

### 3. Admin: Create Driver (one-step)
**`POST /auth/driver-register`**  
Roles: `admin` — requires `Authorization: Bearer <token>`  
Creates the driver's User account and Driver profile in a single request.

#### Request Body
```ts
{
  fullName: string                               // required
  email: string                                  // required
  phone: string                                  // required
  password: string                               // required, min 6 chars
  licenseNumber?: string
  vehicleType?: "bike" | "auto" | "van" | "truck"
  vehicleNumber?: string
  assignedAreas?: string[]
}
```

#### Response `201`
```ts
{
  driver: {
    id: string
    name: string
    phone: string
    licenseNumber?: string
    vehicleType?: string
    vehicleNumber?: string
    assignedAreas?: string[]
    status: "available"
    tenantId: string
  }
  user: {
    id: string
    fullName: string
    email: string
    role: "driver"
    tenantId: string
  }
}
```

#### Error `409`
Email already registered in this tenant.

---

### 4. Login (old #3 — renumbered)
**`POST /auth/login`**  
Public — no auth required.  
Header: `X-Tenant-ID: <tenant-slug>`

#### Request Body
```ts
{
  email: string      // required
  password: string   // required
}
```

#### Response `200`
```ts
{
  accessToken: string
  user: {
    _id: string
    fullName: string
    email: string
    role: "admin" | "customer" | "driver"
    tenantId: string
  }
}
```

#### Errors
- `401` — invalid credentials

---

### 4a. Super Admin Login
**`POST /auth/super-admin/login`**  
Public — no auth required.  
**No `X-Tenant-ID` header required.**

#### Request Body
```ts
{
  email: string      // required
  password: string   // required
}
```

#### Response `200`
```ts
{
  accessToken: string
  user: {
    id: string
    fullName: string
    email: string
    role: "super_admin"
  }
}
```

#### Errors
- `401` — invalid credentials

> See [super-admin-api.md](./super-admin-api.md) for complete super admin documentation.

---

### 5. Logout
**`POST /auth/logout`**  
Requires Bearer token.

#### Response `200`
```ts
{ message: "Logged out successfully" }
```

---

### 6. Forgot Password
**`POST /auth/forgot-password`**  
Public — no auth required.  
Header: `X-Tenant-ID: <tenant-slug>`

#### Request Body
```ts
{
  email: string   // required
}
```

#### Response `200`
```ts
{ message: string }   // always succeeds (no user enumeration)
```

---

### 7. Reset Password
**`POST /auth/reset-password`**  
Public — no auth required.

#### Request Body
```ts
{
  token: string        // required — from the reset email link
  newPassword: string  // required, min 8 chars
}
```

#### Response `200`
```ts
{ message: string }
```

#### Errors
- `400` — invalid or expired token

---

### 8. Get My Profile
**`GET /auth/me`**  
Requires Bearer token.

#### Response `200`
```ts
{
  _id: string
  fullName: string
  email: string
  phone?: string
  role: string
  tenantId: string
  isActive: boolean
  createdAt: string
}
```

---

### 9. Update My Profile
**`PATCH /auth/profile`**  
Requires Bearer token.

#### Request Body
```ts
{
  fullName?: string
  email?: string
  phone?: string
}
```

#### Response `200`
Updated user object (same shape as `GET /auth/me`).

---

### 10. Change Password
**`PATCH /auth/change-password`**  
Requires Bearer token.

#### Request Body
```ts
{
  currentPassword: string   // required
  newPassword: string       // required, min 8 chars
}
```

#### Response `200`
```ts
{ message: string }
```

#### Errors
- `400` — current password incorrect

---

## Error Responses

```ts
{
  statusCode: number
  message: string | string[]
  error: string
}
```

| Code | Meaning |
|---|---|
| `400` | Validation error |
| `401` | Invalid credentials / missing token |
| `403` | Insufficient role |
| `409` | Email or slug already exists |
