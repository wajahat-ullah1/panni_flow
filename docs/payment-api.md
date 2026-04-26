# Payment Module — API Reference

Base URL: `/payments`  
All endpoints require `Authorization: Bearer <token>`.  
Tenant is resolved from the auth token.

> **Note:** A payment record is automatically created when an order is placed. Manual creation via `POST /payments` is rarely needed.

---

## Shared Types

### `Payment`
```ts
{
  _id: string
  tenantId: string
  orderId: string
  customerId?: string
  amount: number
  method: "cod" | "online" | "upi" | "card" | "bank-transfer" | "wallet"
  status: "pending" | "processing" | "completed" | "failed" | "refunded"
  transactionId?: string
  gatewayResponse?: string
  failedReason?: string
  notes?: string
  isDeleted: boolean
  createdAt: string
  updatedAt: string
}
```

---

## Endpoints

---

### 1. Create Payment
**`POST /payments`**  
Roles: `admin`, `customer`

> Payments are auto-created when orders are placed. Use this only for manual/edge-case scenarios.

#### Request Body
```ts
{
  orderId: string                                                       // required
  customerId?: string
  amount: number                                                        // required, min 0
  method: "cod" | "online" | "upi" | "card" | "bank-transfer" | "wallet"  // required
  notes?: string
}
```

#### Response `201`
Full `Payment` object.

---

### 2. List Payments
**`GET /payments`**  
Roles: `admin`

#### Query Params
| Param | Type | Description |
|---|---|---|
| `page` | number | Default: `1` |
| `limit` | number | Default: `20`, max `100` |
| `sort` | string | e.g. `-createdAt` |
| `search` | string | Search term |
| `all` | boolean | Return all without pagination |

#### Response `200`
```ts
{
  data: Payment[]
  meta: { total, page, limit, totalPages }
}
```

---

### 3. Payment Summary Statistics
**`GET /payments/summary`**  
Roles: `admin`

#### Query Params
| Param | Type | Description |
|---|---|---|
| `fromDate` | string | ISO date filter start |
| `toDate` | string | ISO date filter end |

#### Response `200`
```ts
{
  totalRevenue: number
  byMethod: { method: string; total: number; count: number }[]
  byStatus: { status: string; total: number; count: number }[]
  pendingAmount: number
  completedAmount: number
}
```

---

### 4. Payments for an Order
**`GET /payments/order/:orderId`**  
Roles: `admin`, `customer`

#### Response `200`
```ts
Payment[]
```

---

### 5. My Payments
**`GET /payments/my`**  
Roles: `customer`  
Returns paginated list of payments for the logged-in customer.

#### Query Params
Same as [List Payments](#2-list-payments).

#### Response `200`
```ts
{
  data: Payment[]
  meta: { total, page, limit, totalPages }
}
```

---

### 6. My Payment Dashboard
**`GET /payments/my/dashboard`**  
Roles: `customer`

#### Response `200`
```ts
{
  totalPaid: number
  pendingAmount: number
  lastPayment: Payment | null
  paymentsByMethod: { method: string; total: number }[]
}
```

---

### 7. Get Payment by ID
**`GET /payments/:id`**  
Roles: `admin`, `customer`

#### Response `200`
Full `Payment` object.

---

### 8. Update Payment Status
**`PATCH /payments/:id/status`**  
Roles: `admin`

#### Request Body
```ts
{
  status: "pending" | "processing" | "completed" | "failed" | "refunded"  // required
  transactionId?: string
  gatewayResponse?: string
  failedReason?: string
}
```

#### Response `200`
Updated `Payment` object.

---

## Error Responses

| Code | Meaning |
|---|---|
| `400` | Validation error |
| `401` | Missing or invalid token |
| `403` | Insufficient role |
| `404` | Payment not found |
