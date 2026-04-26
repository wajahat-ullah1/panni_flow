# Product Module — API Reference

Base URL: `/products`  
All endpoints require `Authorization: Bearer <token>`.  
Tenant is resolved from the auth token.

> `GET /products` and `GET /products/:id` are accessible to all authenticated roles (customers can browse products).

---

## Shared Types

### `Product`
```ts
{
  _id: string
  tenantId: string
  name: string
  description?: string
  sku: string
  category: "jar" | "bottle" | "pouch" | "can" | "other"
  unitPrice: number
  volume?: number
  volumeUnit?: string       // e.g. "liters", "ml"
  imageUrl?: string
  isActive: boolean
  isDeleted: boolean
  createdAt: string
  updatedAt: string
}
```

---

## Endpoints

---

### 1. Create Product
**`POST /products`**  
Roles: `admin`

#### Request Body
```ts
{
  name: string                                          // required
  sku: string                                           // required — unique per tenant
  category: "jar" | "bottle" | "pouch" | "can" | "other"  // required
  unitPrice: number                                     // required, min 0
  description?: string
  volume?: number
  volumeUnit?: string
  imageUrl?: string
}
```

#### Response `201`
Full `Product` object.

---

### 2. List Products
**`GET /products`**  
Roles: all authenticated

#### Query Params
| Param | Type | Description |
|---|---|---|
| `page` | number | Default: `1` |
| `limit` | number | Default: `20`, max `100` |
| `sort` | string | e.g. `-createdAt`, `unitPrice` |
| `search` | string | Search by name, SKU |
| `all` | boolean | Return all without pagination |

#### Response `200`
```ts
{
  data: Product[]
  meta: { total, page, limit, totalPages }
}
```

---

### 3. Get Product by ID
**`GET /products/:id`**  
Roles: all authenticated

#### Response `200`
Full `Product` object.

---

### 4. Update Product
**`PATCH /products/:id`**  
Roles: `admin`

#### Request Body
```ts
{
  name?: string
  description?: string
  category?: "jar" | "bottle" | "pouch" | "can" | "other"
  unitPrice?: number
  volume?: number
  volumeUnit?: string
  imageUrl?: string
  isActive?: boolean
}
```

#### Response `200`
Updated `Product` object.

---

### 5. Delete Product
**`DELETE /products/:id`**  
Roles: `admin`  
Soft deletes the product.

#### Response `204` — No Content

---

## Error Responses

| Code | Meaning |
|---|---|
| `400` | Validation error |
| `401` | Missing or invalid token |
| `403` | Insufficient role |
| `404` | Product not found |
| `409` | SKU already exists for this tenant |
