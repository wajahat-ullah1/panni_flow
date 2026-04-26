# User Module — API Reference

Base URL: `/users`  
All endpoints require `Authorization: Bearer <token>`.  
Roles: `admin` only.  
Tenant is resolved from the auth token.

---

## Shared Types

### `User`
```ts
{
  _id: string
  tenantId: string
  fullName: string
  email: string
  phone: string
  role: "admin" | "driver" | "customer"
  isActive: boolean
  isDeleted: boolean
  createdAt: string
  updatedAt: string
}
```

---

## Endpoints

---

### 1. Create User
**`POST /users`**  
Roles: `admin`  
Creates a user account within the tenant. Use this to invite drivers or additional admin users.

#### Request Body
```ts
{
  fullName: string                          // required
  email: string                             // required — unique per tenant
  phone: string                             // required
  password: string                          // required, min 8 chars
  role: "admin" | "driver" | "customer"    // required
}
```

#### Response `201`
Full `User` object (password excluded).

---

### 2. List Users
**`GET /users`**  
Roles: `admin`

#### Query Params
| Param | Type | Description |
|---|---|---|
| `page` | number | Default: `1` |
| `limit` | number | Default: `20`, max `100` |
| `sort` | string | e.g. `-createdAt` |
| `search` | string | Search by fullName, email, phone |
| `all` | boolean | Return all without pagination |

#### Response `200`
```ts
{
  data: User[]
  meta: { total, page, limit, totalPages }
}
```

---

### 3. Get User by ID
**`GET /users/:id`**  
Roles: `admin`

#### Response `200`
Full `User` object.

---

### 4. Update User
**`PATCH /users/:id`**  
Roles: `admin`

#### Request Body
```ts
{
  fullName?: string
  email?: string
  phone?: string
  role?: "admin" | "driver" | "customer"
}
```

#### Response `200`
Updated `User` object.

---

### 5. Activate / Deactivate User
**`PATCH /users/:id/status`**  
Roles: `admin`

#### Request Body
```ts
{
  isActive: boolean
}
```

#### Response `200`
Updated `User` object.

---

### 6. Delete User
**`DELETE /users/:id`**  
Roles: `admin`  
Soft deletes the user.

#### Response `204` — No Content

---

## Error Responses

| Code | Meaning |
|---|---|
| `400` | Validation error |
| `401` | Missing or invalid token |
| `403` | Insufficient role |
| `404` | User not found |
| `409` | Email already in use |
