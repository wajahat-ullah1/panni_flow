# Driver Module — API Reference

Base URL: `/drivers`  
All endpoints require `Authorization: Bearer <token>`.  
Tenant is resolved from the auth token.

---

## Shared Types

### `Driver`
```ts
{
  _id: string
  tenantId: string
  userId: string                  // linked User account _id
  name: string
  phone: string
  vehicleNumber?: string
  vehicleType?: "bike" | "auto" | "van" | "truck"
  assignedAreas?: string[]
  licenseNumber?: string
  status: "available" | "on-delivery" | "off-duty"
  isActive: boolean
  currentLocation?: { lat: number; lng: number }
  isDeleted: boolean
  createdAt: string
  updatedAt: string
}
```

---

## Endpoints

---

### 1. Create Driver
**`POST /drivers`**  
Roles: `admin`

#### Request Body
```ts
{
  userId: string                   // required — existing User _id to link
  name: string                     // required
  phone: string                    // required
  vehicleNumber?: string
  vehicleType?: "bike" | "auto" | "van" | "truck"
  assignedAreas?: string[]
  licenseNumber?: string
}
```

#### Response `201`
Full `Driver` object.

---

### 2. List Drivers
**`GET /drivers`**  
Roles: `admin`

#### Query Params
| Param | Type | Description |
|---|---|---|
| `page` | number | Default: `1` |
| `limit` | number | Default: `20`, max `100` |
| `sort` | string | e.g. `-createdAt` |
| `search` | string | Search by name, phone |
| `all` | boolean | Return all without pagination |

#### Response `200`
```ts
{
  data: Driver[]
  meta: { total, page, limit, totalPages }
}
```

---

### 3. Get Available Drivers
**`GET /drivers/available`**  
Roles: `admin`  
Returns only drivers with `status: "available"` and `isActive: true`.

#### Response `200`
```ts
Driver[]
```

---

### 4. Get Driver by ID
**`GET /drivers/:id`**  
Roles: `admin`, `driver`

#### Response `200`
Full `Driver` object.

---

### 5. Update Driver
**`PATCH /drivers/:id`**  
Roles: `admin`, `driver`

#### Request Body
```ts
{
  name?: string
  phone?: string
  vehicleNumber?: string
  vehicleType?: "bike" | "auto" | "van" | "truck"
  assignedAreas?: string[]
  licenseNumber?: string
  isActive?: boolean
}
```

#### Response `200`
Updated `Driver` object.

---

### 6. Delete Driver
**`DELETE /drivers/:id`**  
Roles: `admin`

#### Response `204` — No Content

---

### 7. Assign Order to Driver
**`POST /drivers/:id/assign-order`**  
Roles: `admin`  
Assigns an order to the driver and transitions the order status to `assigned`.

#### Request Body
```ts
{
  orderId: string   // required — Order ObjectId
}
```

#### Response `200`
Updated `Order` object.

---

### 8. Update Driver Status
**`PATCH /drivers/:id/status`**  
Roles: `admin`, `driver`

#### Request Body
```ts
{
  status: "available" | "on-delivery" | "off-duty"
}
```

#### Response `200`
Updated `Driver` object.

---

### 9. Update Driver Location
**`PATCH /drivers/:id/location`**  
Roles: `driver`  
Called by the driver app to broadcast real-time GPS position.

#### Request Body
```ts
{
  lat: number
  lng: number
}
```

#### Response `200`
Updated `Driver` object.

---

### 10. Driver Delivery History
**`GET /drivers/:id/deliveries`**  
Roles: `admin`, `driver`

#### Query Params
Same as [Order list query params](./order-api.md#2-list-orders) — `page`, `limit`, `sort`, `search`, `status`, `fromDate`, `toDate`.

#### Response `200`
```ts
{
  data: Order[]
  meta: { total, page, limit, totalPages }
}
```

---

## Error Responses

| Code | Meaning |
|---|---|
| `400` | Validation error or invalid assignment |
| `401` | Missing or invalid token |
| `403` | Insufficient role |
| `404` | Driver or order not found |
