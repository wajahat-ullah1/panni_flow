# Tenant Module — API Reference

Base URL: `/tenants`  
All admin-facing endpoints require `Authorization: Bearer <token>`.

> These endpoints are intended for **super-admin** use (platform-level management of tenants).  
> Regular tenant admins should use `GET /auth/me` and `PATCH /auth/profile` instead.

---

## Shared Types

### `Tenant`
```ts
{
  _id: string
  name: string
  slug: string              // unique tenant identifier used as tenantId in X-Tenant-ID header
  email: string
  phone?: string
  address?: {
    street?: string
    city?: string
    state?: string
    postalCode?: string
    country?: string
  }
  status: "active" | "suspended" | "trial"
  settings?: {
    currency?: string       // e.g. "INR", "USD"
    timezone?: string       // e.g. "Asia/Kolkata"
    orderPrefix?: string    // e.g. "ORD"
  }
  isDeleted: boolean
  createdAt: string
  updatedAt: string
}
```

---

## Endpoints

---

### 1. Register Tenant
**`POST /tenants/register`**  
Public — no auth required.

> This is also called internally via `POST /auth/register`. Prefer using the auth endpoint.

#### Request Body
```ts
{
  name: string        // required — business name
  slug: string        // required — unique, lowercase, no spaces e.g. "acme-water"
  email: string       // required
  phone?: string
  address?: {
    street?: string
    city?: string
    state?: string
    postalCode?: string
    country?: string
  }
  adminUser: {
    fullName: string  // required
    email: string     // required
    password: string  // required, min 8 chars
  }
}
```

#### Response `201`
```ts
{ tenant: Tenant; user: User; accessToken: string }
```

---

### 2. List Tenants
**`GET /tenants`**  
Roles: `admin` (super-admin)

#### Query Params
| Param | Type | Description |
|---|---|---|
| `page` | number | Default: `1` |
| `limit` | number | Default: `20`, max `100` |
| `sort` | string | e.g. `-createdAt` |
| `search` | string | Search by name, slug, email |
| `all` | boolean | Return all without pagination |

#### Response `200`
```ts
{
  data: Tenant[]
  meta: { total, page, limit, totalPages }
}
```

---

### 3. Get Tenant by ID
**`GET /tenants/:id`**  
Roles: `admin`

#### Response `200`
Full `Tenant` object.

---

### 4. Update Tenant
**`PATCH /tenants/:id`**  
Roles: `admin`

#### Request Body
```ts
{
  name?: string
  email?: string
  phone?: string
  address?: {
    street?: string
    city?: string
    state?: string
    postalCode?: string
    country?: string
  }
  settings?: {
    currency?: string
    timezone?: string
    orderPrefix?: string
  }
}
```

#### Response `200`
Updated `Tenant` object.

---

### 5. Update Tenant Status
**`PATCH /tenants/:id/status`**  
Roles: `admin` (super-admin)

#### Request Body
```ts
{
  status: "active" | "suspended" | "trial"
}
```

#### Response `200`
Updated `Tenant` object.

---

### 6. Delete Tenant
**`DELETE /tenants/:id`**  
Roles: `admin` (super-admin)  
Soft deletes the tenant.

#### Response `204` — No Content

---

## Error Responses

| Code | Meaning |
|---|---|
| `400` | Validation error |
| `401` | Missing or invalid token |
| `403` | Insufficient role |
| `404` | Tenant not found |
| `409` | Slug or email already exists |
