# Customer Module — API Reference

Base URL: `/customers`  
All endpoints require `Authorization: Bearer <token>`.  
Tenant is resolved from the auth token.

---

## Shared Types

### `CustomerAddress`
```ts
{
  _id: string
  label: string           // e.g. "Home", "Office"
  address: string         // street address
  landmark?: string
  city: string
  state?: string
  postalCode?: string
  phone?: string
  coordinates?: { lat: number; lng: number }
  isDefault: boolean
}
```

### `Customer`
```ts
{
  _id: string
  tenantId: string
  userId: string          // linked User _id
  name: string
  phone: string
  email?: string
  addresses: CustomerAddress[]
  preferences?: {
    preferredDeliveryTime?: string
    defaultProductId?: string
    defaultQuantity?: number
  }
  totalOrders: number
  totalSpent: number
  isActive: boolean
  isDeleted: boolean
  createdAt: string
  updatedAt: string
}
```

---

## Customer Self-Service Endpoints

### 1. Get My Profile
**`GET /customers/me`**  
Roles: `customer`

#### Response `200`
Full `Customer` object for the logged-in customer.

---

### 2. Get My Dashboard Stats
**`GET /customers/me/stats`**  
Roles: `customer`

#### Response `200`
```ts
{
  totalOrders: number
  totalSpent: number
  deliveredOrders: number
  pendingOrders: number
  cancelledOrders: number
  bottlesOwned?: number
}
```

---

### 3. Update My Profile
**`PATCH /customers/me`**  
Roles: `customer`

#### Request Body
```ts
{
  name?: string
  phone?: string
  email?: string
}
```

#### Response `200`
Updated `Customer` object.

---

### 4. Add Address
**`POST /customers/me/addresses`**  
Roles: `customer`

#### Request Body
```ts
{
  label: string           // required
  address: string         // required — street address
  landmark?: string
  city: string            // required
  state?: string
  postalCode?: string
  phone?: string
  coordinates?: { lat: number; lng: number }
  isDefault?: boolean
}
```

#### Response `200`
Updated `Customer` object with the new address included.

---

### 5. Update Address
**`PATCH /customers/me/addresses/:addrId`**  
Roles: `customer`

#### Path Params
| Param | Type | Description |
|---|---|---|
| `addrId` | string | Address subdocument `_id` |

#### Request Body
Same fields as [Add Address](#4-add-address) — all optional.

#### Response `200`
Updated `Customer` object.

---

### 6. Remove Address
**`DELETE /customers/me/addresses/:addrId`**  
Roles: `customer`

#### Response `204` — No Content

---

### 7. Set Default Address
**`PATCH /customers/me/addresses/:addrId/default`**  
Roles: `customer`

#### Response `200`
Updated `Customer` object with `isDefault: true` on the specified address.

---

## Admin Endpoints

### 8. Create Customer
**`POST /customers`**  
Roles: `admin`

#### Request Body
```ts
{
  name: string            // required
  phone: string           // required
  email?: string
  addresses?: {
    label: string
    street: string
    landmark?: string
    city: string
    state: string
    postalCode: string
    coordinates?: { lat: number; lng: number }
    isDefault?: boolean
  }[]
  preferences?: {
    preferredDeliveryTime?: string
    defaultProductId?: string
    defaultQuantity?: number
  }
}
```

#### Response `201`
Full `Customer` object.

---

### 9. List Customers
**`GET /customers`**  
Roles: `admin`, `driver`

#### Query Params
| Param | Type | Description |
|---|---|---|
| `page` | number | Default: `1` |
| `limit` | number | Default: `20`, max `100` |
| `sort` | string | e.g. `-createdAt` |
| `search` | string | Search by name, phone, email |
| `all` | boolean | Return all without pagination |

#### Response `200`
```ts
{
  data: Customer[]
  meta: { total, page, limit, totalPages }
}
```

---

### 10. Get Customer by ID
**`GET /customers/:id`**  
Roles: `admin`, `driver`, `customer`

#### Response `200`
Full `Customer` object.

---

### 11. Update Customer
**`PATCH /customers/:id`**  
Roles: `admin`

#### Request Body
```ts
{
  name?: string
  phone?: string
  email?: string
}
```

#### Response `200`
Updated `Customer` object.

---

### 12. Delete Customer
**`DELETE /customers/:id`**  
Roles: `admin`

#### Response `204` — No Content

---

## Error Responses

| Code | Meaning |
|---|---|
| `400` | Validation error |
| `401` | Missing or invalid token |
| `403` | Insufficient role |
| `404` | Customer not found |
