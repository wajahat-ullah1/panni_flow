# Order Module — API Reference

Base URL: `/orders`  
All endpoints require a Bearer token (`Authorization: Bearer <token>`).  
Tenant is resolved automatically from the auth token — do **not** send `tenantId` in request bodies.

---

## Status Flow

```
pending → confirmed → assigned → accepted → out-for-delivery → delivered
                               ↘ rejected → assigned (retry)
any non-terminal → cancelled
```

Valid statuses: `pending` | `confirmed` | `assigned` | `accepted` | `rejected` | `out-for-delivery` | `delivered` | `cancelled`

---

## Shared Types

### `OrderItem`
```ts
{
  productId: string        // MongoDB ObjectId
  productName: string
  quantity: number         // min 1
  unitPrice: number        // min 0
  totalPrice: number       // computed: quantity * unitPrice
}
```

### `DeliveryAddress`
```ts
{
  label?: string           // e.g. "Home", "Office"
  street: string           // required
  landmark?: string
  city: string             // required
  state?: string
  postalCode?: string
  coordinates?: { lat: number; lng: number }
}
```

### `StatusHistoryEntry`
```ts
{
  status: string
  changedAt: string        // ISO date
  changedBy: string        // userId
  note?: string
}
```

### `Order` (full object)
```ts
{
  _id: string
  orderNumber: string      // auto-generated, e.g. "ORD-20260426-0001"
  customerId: string
  customerName: string
  customerPhone: string
  deliveryAddress: DeliveryAddress
  items: OrderItem[]
  totalAmount: number
  status: string           // see status flow above
  paymentMethod: "cod" | "prepaid" | "credit"
  paymentStatus: "unpaid" | "paid" | "partial"
  assignedDriverId?: string
  scheduledDate?: string   // ISO date
  scheduledTimeSlot?: string
  deliveredAt?: string     // ISO date
  isRecurring: boolean
  recurringFrequency?: "daily" | "alternate-day" | "weekly" | "custom"
  recurringDays?: number[] // 0=Sunday … 6=Saturday
  recurringStartDate?: string
  recurringEndDate?: string
  parentOrderId?: string
  statusHistory: StatusHistoryEntry[]
  notes?: string
  proofOfDeliveryImageUrl?: string
  proofOfDeliverySignatureUrl?: string
  proofOfDeliveryNote?: string
  isDeleted: boolean
  createdAt: string
  updatedAt: string
}
```

### `PaginatedResponse<T>`
```ts
{
  data: T[]
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}
```

---

## Endpoints

---

### 1. Create Order
**`POST /orders`**  
Roles: `admin`, `customer`

#### Request Body
```ts
{
  customerId: string            // required — MongoDB ObjectId
  customerName: string          // required
  customerPhone: string         // required
  deliveryAddress: DeliveryAddress  // required
  items: {
    productId: string           // required
    productName: string         // required
    quantity: number            // required, min 1
    unitPrice: number           // required, min 0
  }[]                           // required, min 1 item
  paymentMethod?: "cod" | "prepaid" | "credit"   // default: "cod"
  scheduledDate?: string        // ISO date e.g. "2026-05-01"
  scheduledTimeSlot?: string    // e.g. "09:00–12:00"
  notes?: string
  isRecurring?: boolean         // default: false
  recurringFrequency?: "daily" | "alternate-day" | "weekly" | "custom"
  recurringDays?: number[]      // 0=Sun … 6=Sat
  recurringStartDate?: string
  recurringEndDate?: string
}
```

#### Response `201`
Full `Order` object. A payment record is automatically created alongside.

#### Notes
- Stock is reserved from inventory on creation.
- `totalAmount` and `totalPrice` per item are computed server-side.

---

### 2. List Orders
**`GET /orders`**  
Roles: all authenticated  
Customers automatically see only their own orders.

#### Query Params
| Param | Type | Description |
|---|---|---|
| `page` | number | Default: `1` |
| `limit` | number | Default: `20`, max `100` |
| `sort` | string | Field name, prefix `-` for descending e.g. `-createdAt` |
| `search` | string | Searches `orderNumber`, `customerName`, `customerPhone` |
| `all` | boolean | Return all records (no pagination) |
| `status` | string | Filter by status enum |
| `customerId` | string | Filter by customer ObjectId |
| `driverId` | string | Filter by assigned driver ObjectId |
| `fromDate` | string | ISO date — filter `createdAt >= fromDate` |
| `toDate` | string | ISO date — filter `createdAt <= toDate` |

#### Response `200`
```ts
PaginatedResponse<Order>
// Order objects include populated:
//   customerId → { name, phone, email }
//   assignedDriverId → { name, phone }
```

---

### 3. Get Order by ID
**`GET /orders/:id`**  
Roles: all authenticated

#### Response `200`
Full `Order` object with populated `customerId` and `assignedDriverId`.

#### Errors
- `404` — order not found

---

### 4. Order Statistics Summary
**`GET /orders/stats/summary`**  
Roles: `admin`

#### Response `200`
```ts
{
  todayOrders: number          // orders created today
  statusBreakdown: {
    pending?: number
    confirmed?: number
    assigned?: number
    accepted?: number
    "out-for-delivery"?: number
    delivered?: number
    cancelled?: number
    rejected?: number
  }
  todayRevenue: number         // sum of delivered orders' totalAmount for today
}
```

---

### 5. Live Delivery Monitoring
**`GET /orders/monitoring/live`**  
Roles: `admin`

#### Response `200`
```ts
{
  activeDeliveries: {
    orderId: string
    orderNumber: string
    status: string
    customerName: string
    deliveryAddress: DeliveryAddress
    scheduledDate?: string
    scheduledTimeSlot?: string
    driver: {
      id: string
      name: string
      phone: string
      vehicleNumber: string
      status: string
      currentLocation: { lat: number; lng: number } | null
    } | null
  }[]
  summary: {
    totalActive: number
    assigned: number
    accepted: number
    outForDelivery: number
  }
  driverSummary: {
    total: number
    available: number
    onDelivery: number
    offDuty: number
  }
}
```

---

### 6. Recurring Orders
**`GET /orders/recurring`**  
Roles: `admin`  
Returns paginated list of orders where `isRecurring = true`.  
Accepts same query params as [List Orders](#2-list-orders).

#### Response `200`
```ts
PaginatedResponse<Order>
```

---

### 7. Orders by Customer
**`GET /orders/customer/:customerId`**  
Roles: `admin`, `customer`

#### Path Params
| Param | Type | Description |
|---|---|---|
| `customerId` | string | MongoDB ObjectId |

Accepts same query params as [List Orders](#2-list-orders).

#### Response `200`
```ts
PaginatedResponse<Order>
```

---

### 8. Orders by Driver
**`GET /orders/driver/:driverId`**  
Roles: `admin`, `driver`

#### Path Params
| Param | Type | Description |
|---|---|---|
| `driverId` | string | MongoDB ObjectId |

Accepts same query params as [List Orders](#2-list-orders).

#### Response `200`
```ts
PaginatedResponse<Order>
```

---

### 9. Track Delivery
**`GET /orders/:id/tracking`**  
Roles: `admin`, `customer`, `driver`

#### Response `200`
```ts
{
  orderId: string
  orderNumber: string
  status: string
  statusHistory: StatusHistoryEntry[]
  deliveryAddress: DeliveryAddress
  scheduledDate?: string
  scheduledTimeSlot?: string
  deliveredAt?: string
  driver: {
    driverId: string
    name: string
    phone: string
    vehicleNumber: string
    vehicleType: string
    currentLocation: { lat: number; lng: number } | null
  } | null
}
```

---

### 10. Navigation Info
**`GET /orders/:id/navigation`**  
Roles: `admin`, `driver`

#### Response `200`
```ts
{
  orderId: string
  orderNumber: string
  customer: {
    name: string
    phone: string
  }
  destination: DeliveryAddress
  driverCurrentLocation: { lat: number; lng: number } | null
  navigationUrl: string | null   // Google Maps deep link if coordinates exist
}
```

---

### 11. Update Order Status
**`PATCH /orders/:id/status`**  
Roles: `admin`, `driver`

#### Request Body
```ts
{
  status: string   // must be a valid transition from current status
  note?: string
}
```

#### Response `200`
Updated full `Order` object.

#### Errors
- `400` — invalid status transition
- `404` — order not found

---

### 12. Driver Accept Order
**`PATCH /orders/:id/accept`**  
Roles: `driver`  
Transitions status: `assigned → accepted`

#### Response `200`
Updated full `Order` object.

---

### 13. Driver Reject Order
**`PATCH /orders/:id/reject`**  
Roles: `driver`  
Transitions status: `assigned → rejected`. Driver is set back to `available` and assignment is cleared.

#### Request Body
```ts
{
  reason?: string   // sent as plain string in body field "reason"
}
```

#### Response `200`
Updated full `Order` object.

---

### 14. Upload Proof of Delivery
**`POST /orders/:id/proof-of-delivery`**  
Roles: `driver`  
Content-Type: `multipart/form-data`  
Max file size: **5MB**

#### Form Fields
| Field | Type | Description |
|---|---|---|
| `file` | File | Image file (jpg, png, etc.) |
| `type` | string | `"image"` (default) or `"signature"` |
| `note` | string | Optional delivery note |

#### Response `200`
```ts
{
  orderId: string
  proofOfDeliveryImageUrl: string | null      // path e.g. "/uploads/proof-of-delivery/pod-xxx.jpg"
  proofOfDeliverySignatureUrl: string | null
  proofOfDeliveryNote: string | null
}
```

---

### 15. Cancel / Delete Order
**`DELETE /orders/:id`**  
Roles: `admin`  
Soft deletes the order. If not yet delivered/cancelled, reserved inventory is released.

#### Response `204` — No Content

---

## Error Responses

All errors follow the shape:
```ts
{
  statusCode: number
  message: string | string[]
  error: string
}
```

| Code | Meaning |
|---|---|
| `400` | Validation error or invalid status transition |
| `401` | Missing or invalid token |
| `403` | Insufficient role |
| `404` | Order / resource not found |
| `409` | Duplicate order number (rare race condition) |
