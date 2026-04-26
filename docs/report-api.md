# Report Module — API Reference

Base URL: `/reports`  
All endpoints require `Authorization: Bearer <token>`.  
Roles: `admin` only.  
Tenant is resolved from the auth token.

---

## Dashboard Endpoints

---

### 1. Dashboard Summary (Stat Cards)
**`GET /reports/dashboard/summary`**

Returns the four top-level stat cards for the admin dashboard.  
Compares current calendar month vs previous calendar month.

#### Response `200`
```ts
{
  totalOrders: {
    value: number               // order count this month
    changePercent: number | null  // % change vs last month (null if last month = 0)
    trend: "up" | "down" | "neutral"
  }
  activeDeliveries: {
    value: number               // orders currently in confirmed/assigned/accepted/out-for-delivery
  }
  monthlyRevenue: {
    value: number               // sum of delivered orders this month
    changePercent: number | null
    trend: "up" | "down" | "neutral"
  }
  tankers: {
    active: number              // vehicles with status = "active"
    total: number
    utilizationPercent: number  // (active / total) * 100
  }
}
```

---

### 2. Monthly Revenue (Line Chart)
**`GET /reports/dashboard/monthly-revenue`**

Returns 12 data points for the revenue line chart. Months with no delivered orders return `revenue: 0`.

#### Query Params
| Param | Type | Description |
|---|---|---|
| `year` | number | Year to query. Defaults to current year |

#### Response `200`
```ts
[
  { "month": "Jan", "revenue": 45000 },
  { "month": "Feb", "revenue": 52000 },
  { "month": "Mar", "revenue": 48000 },
  { "month": "Apr", "revenue": 61000 },
  { "month": "May", "revenue": 0 },
  // ... 12 entries total
]
```

---

### 3. Order Statistics
**`GET /reports/dashboard/order-stats`**

Returns a snapshot of all order counts for the admin dashboard.

#### Response `200`
```ts
{
  total: number             // all orders ever
  pending: number           // status = "pending"
  delivered: number         // status = "delivered"
  active: number            // Math.max(0, total - pending - delivered - cancelled)
  pendingPickups: number    // status = "assigned" or "accepted"
  todayCompleted: number    // delivered today (by updatedAt)
  activeTankers: number     // vehicles with status = "active"
}
```

---

## Report Endpoints

---

### 4. Delivery Report
**`GET /reports/delivery`**

#### Query Params
| Param | Type | Required | Description |
|---|---|---|---|
| `fromDate` | string | yes | ISO date e.g. `2026-01-01` |
| `toDate` | string | yes | ISO date e.g. `2026-12-31` |

#### Response `200`
```ts
{
  period: { from: string; to: string }
  summary: {
    totalOrders: number
    deliveredOrders: number
    cancelledOrders: number
    deliveryRate: string      // e.g. "91.5%"
  }
  dailyBreakdown: {
    _id: string               // date "YYYY-MM-DD"
    total: number
    delivered: number
    revenue: number
  }[]
  topDrivers: {
    _id: string               // driverId
    deliveries: number
    revenue: number
  }[]
}
```

---

### 5. Financial Report
**`GET /reports/financial`**

#### Query Params
| Param | Type | Required | Description |
|---|---|---|---|
| `fromDate` | string | yes | ISO date |
| `toDate` | string | yes | ISO date |

#### Response `200`
```ts
{
  period: { from: string; to: string }
  totalRevenue: number
  revenueByDay: {
    _id: string       // "YYYY-MM-DD"
    revenue: number
    orders: number
  }[]
  paymentsByMethod: {
    _id: string       // payment method
    total: number
    count: number
  }[]
  paymentsByStatus: {
    _id: string       // payment status
    total: number
    count: number
  }[]
}
```

---

### 6. Customer Analytics Report
**`GET /reports/customers`**

#### Query Params
| Param | Type | Required | Description |
|---|---|---|---|
| `fromDate` | string | yes | ISO date |
| `toDate` | string | yes | ISO date |

#### Response `200`
```ts
{
  period: { from: string; to: string }
  totalCustomers: number
  newCustomersInPeriod: number
  topCustomers: {
    _id: string           // customerId
    customerName: string
    orderCount: number
    totalSpent: number
  }[]
  customersByArea: {
    _id: string           // city
    count: number
  }[]
}
```

---

### 7. Export Orders (CSV-ready JSON)
**`GET /reports/export/orders`**

#### Query Params
| Param | Type | Required | Description |
|---|---|---|---|
| `fromDate` | string | yes | ISO date |
| `toDate` | string | yes | ISO date |

#### Response `200`
```ts
{
  count: number
  data: {
    orderNumber: string
    customerName: string
    customerPhone: string
    status: string
    totalAmount: number
    paymentMethod: string
    paymentStatus: string
    city: string
    scheduledDate: string | null
    deliveredAt: string | null
    createdAt: string
  }[]
}
```

---

## Error Responses

| Code | Meaning |
|---|---|
| `401` | Missing or invalid token |
| `403` | Insufficient role |
