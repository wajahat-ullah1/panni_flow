# Super Admin Module — API Reference

Base URL: `/super-admin`

> The Super Admin is a **tenant-agnostic** role that can manage all tenants in the system.
> Super admin login **does not** require the `X-Tenant-ID` header.
> All super-admin endpoints (except login) require `Authorization: Bearer <token>`.

---

## Authentication

### Super Admin Login
**`POST /auth/super-admin/login`**  
Public — no auth required.  
**No `X-Tenant-ID` header required.**

#### Request Body
```ts
{
  email: string       // required
  password: string    // required
}
```

#### Response `201`
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

---

## Profile Management

---

### Get Super Admin Profile
**`GET /super-admin/profile`**  
Roles: `super_admin`

#### Response `200`
```ts
{
  _id: string
  fullName: string
  email: string
  phone: string
  role: "super_admin"
  isActive: boolean
  lastLoginAt: Date
  createdAt: Date
  updatedAt: Date
}
```

---

### Update Super Admin Profile
**`PATCH /super-admin/profile`**  
Roles: `super_admin`

#### Request Body
```ts
{
  fullName?: string
  phone?: string
}
```

#### Response `200`
Returns the updated super admin profile.

---

## Super Admin Management

> Only existing super admins can create or manage other super admins.

---

### Create New Super Admin
**`POST /super-admin`**  
Roles: `super_admin`

#### Request Body
```ts
{
  fullName: string    // required
  email: string       // required
  phone: string       // required
  password: string    // required, min 8 chars
}
```

#### Response `201`
```ts
{
  _id: string
  fullName: string
  email: string
  phone: string
  role: "super_admin"
  isActive: true
  createdAt: Date
}
```

---

### List All Super Admins
**`GET /super-admin`**  
Roles: `super_admin`

#### Response `200`
```ts
[
  {
    _id: string
    fullName: string
    email: string
    phone: string
    role: "super_admin"
    isActive: boolean
    lastLoginAt: Date
    createdAt: Date
  }
]
```

---

### Get Super Admin by ID
**`GET /super-admin/:id`**  
Roles: `super_admin`

#### Response `200`
Returns the super admin object.

---

### Update Super Admin by ID
**`PATCH /super-admin/:id`**  
Roles: `super_admin`

#### Request Body
```ts
{
  fullName?: string
  phone?: string
  isActive?: boolean
}
```

#### Response `200`
Returns the updated super admin object.

---

### Delete Super Admin
**`DELETE /super-admin/:id`**  
Roles: `super_admin`  
Performs a soft delete.

#### Response `204 No Content`

---

## Tenant Management

Super admins can manage all tenants via the `/tenants` endpoints.  
See [tenant-api.md](./tenant-api.md) for full tenant API documentation.

**Endpoints available to Super Admin:**
- `GET /tenants` — List all tenants
- `GET /tenants/:id` — Get tenant by ID
- `PATCH /tenants/:id` — Update tenant details
- `PATCH /tenants/:id/status` — Update tenant status (active/suspended/trial)
- `DELETE /tenants/:id` — Soft delete tenant

---

## Notes

1. **First Super Admin**: The initial super admin must be created via the database seed script or directly in the database.

2. **No Tenant Context**: Super admin operations do not require or use tenant context. The JWT token for super admin does not contain a `tenantId`.

3. **Security**: Super admin credentials should be stored securely and access should be restricted to system administrators only.

---

## Default Super Admin (Seeded)

After running the seed script:
```
Email: superadmin@panniflow.com
Password: superadmin123
```

Login using:
```bash
curl -X POST http://localhost:3000/auth/super-admin/login \
  -H "Content-Type: application/json" \
  -d '{"email": "superadmin@panniflow.com", "password": "superadmin123"}'
```
