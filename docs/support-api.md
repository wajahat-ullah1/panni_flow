# Support Module — API Reference

Base URL: `/support`  
All endpoints require `Authorization: Bearer <token>`.  
Tenant is resolved from the auth token.

---

## Shared Types

### `TicketMessage`
```ts
{
  _id: string
  message: string
  senderId: string
  senderEmail: string
  senderRole: "admin" | "customer"
  createdAt: string
}
```

### `SupportTicket`
```ts
{
  _id: string
  tenantId: string
  subject: string
  description: string
  category: "order" | "delivery" | "payment" | "account" | "product" | "other"
  priority: "low" | "medium" | "high" | "urgent"
  status: "open" | "in-progress" | "waiting-customer" | "resolved" | "closed"
  createdBy: string           // userId
  createdByEmail: string
  assignedTo?: string         // userId of the admin handling it
  relatedOrderId?: string
  messages: TicketMessage[]
  isDeleted: boolean
  createdAt: string
  updatedAt: string
}
```

---

## Endpoints

---

### 1. Create Ticket
**`POST /support`**  
Roles: `customer`, `driver`, `admin`

#### Request Body
```ts
{
  subject: string                                                          // required
  description: string                                                      // required
  category?: "order" | "delivery" | "payment" | "account" | "product" | "other"
  priority?: "low" | "medium" | "high" | "urgent"
  relatedOrderId?: string     // optional — Order ObjectId
}
```

#### Response `201`
Full `SupportTicket` object.

---

### 2. List All Tickets
**`GET /support`**  
Roles: `admin`

#### Query Params
| Param | Type | Description |
|---|---|---|
| `page` | number | Default: `1` |
| `limit` | number | Default: `20`, max `100` |
| `sort` | string | e.g. `-createdAt` |
| `search` | string | Search by subject |
| `all` | boolean | Return all without pagination |

#### Response `200`
```ts
{
  data: SupportTicket[]
  meta: { total, page, limit, totalPages }
}
```

---

### 3. My Tickets
**`GET /support/my-tickets`**  
Roles: all authenticated  
Returns only the tickets created by the logged-in user.

#### Query Params
Same as [List All Tickets](#2-list-all-tickets).

#### Response `200`
```ts
{
  data: SupportTicket[]
  meta: { total, page, limit, totalPages }
}
```

---

### 4. Get Ticket by ID
**`GET /support/:id`**  
Roles: all authenticated

#### Response `200`
Full `SupportTicket` object including all `messages`.

---

### 5. Add Message to Ticket
**`POST /support/:id/messages`**  
Roles: all authenticated  
Appends a new message to the ticket thread.

#### Request Body
```ts
{
  message: string   // required
}
```

#### Response `200`
Updated `SupportTicket` object with the new message appended.

---

### 6. Update Ticket Status
**`PATCH /support/:id/status`**  
Roles: `admin`

#### Request Body
```ts
{
  status: "open" | "in-progress" | "waiting-customer" | "resolved" | "closed"
}
```

#### Response `200`
Updated `SupportTicket` object.

---

### 7. Assign Ticket
**`PATCH /support/:id/assign`**  
Roles: `admin`

#### Request Body
```ts
{
  assignedTo: string   // required — User ObjectId of the admin to assign
}
```

#### Response `200`
Updated `SupportTicket` object with `assignedTo` set.

---

## Error Responses

| Code | Meaning |
|---|---|
| `400` | Validation error |
| `401` | Missing or invalid token |
| `403` | Insufficient role |
| `404` | Ticket not found |
