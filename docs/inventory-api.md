# Inventory Module — API Reference

Base URL: `/inventory`  
All endpoints require `Authorization: Bearer <token>`.  
Roles: `admin` only.  
Tenant is resolved from the auth token.

---

## Shared Types

### `Inventory`
```ts
{
  _id: string
  tenantId: string
  productId: string         // ref to Product
  productName: string
  currentStock: number
  reservedStock: number
  availableStock: number    // currentStock - reservedStock
  reorderLevel: number      // threshold for low-stock alert
  unit: string              // e.g. "units", "liters"
  lastAdjustedAt: string
  isDeleted: boolean
  createdAt: string
  updatedAt: string
}
```

---

## Endpoints

---

### 1. List Inventory
**`GET /inventory`**  
Roles: `admin`

#### Query Params
| Param | Type | Description |
|---|---|---|
| `page` | number | Default: `1` |
| `limit` | number | Default: `20`, max `100` |
| `sort` | string | e.g. `-currentStock` |
| `search` | string | Search by product name |
| `all` | boolean | Return all without pagination |

#### Response `200`
```ts
{
  data: Inventory[]
  meta: { total, page, limit, totalPages }
}
```

---

### 2. Get Low Stock Items
**`GET /inventory/low-stock`**  
Roles: `admin`  
Returns all inventory items where `availableStock <= reorderLevel`.

#### Response `200`
```ts
Inventory[]
```

---

### 3. Get Inventory by Product
**`GET /inventory/product/:productId`**  
Roles: `admin`

#### Path Params
| Param | Type | Description |
|---|---|---|
| `productId` | string | MongoDB ObjectId of the product |

#### Response `200`
Single `Inventory` object for that product.

---

### 4. Adjust Stock
**`POST /inventory/adjust`**  
Roles: `admin`  
Used to manually add, subtract, or set stock quantities.

#### Request Body
```ts
{
  productId: string                               // required
  quantity: number                                // required — amount to adjust
  type: "addition" | "subtraction" | "adjustment" // required
  note?: string                                   // optional reason/note
}
```

- **`addition`** — increases `currentStock` by `quantity`
- **`subtraction`** — decreases `currentStock` by `quantity`
- **`adjustment`** — sets `currentStock` to exactly `quantity`

#### Response `200`
Updated `Inventory` object.

#### Errors
- `400` — subtraction would result in negative stock
- `404` — inventory record not found for the product

---

## Notes

- Stock is automatically reserved when an order is created and released when cancelled.
- Use `GET /inventory/low-stock` to trigger reorder alerts in the frontend.
- The `availableStock` field is computed: `currentStock - reservedStock`.

---

## Error Responses

| Code | Meaning |
|---|---|
| `400` | Validation error or insufficient stock |
| `401` | Missing or invalid token |
| `403` | Insufficient role |
| `404` | Product or inventory record not found |
