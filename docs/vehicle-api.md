# Vehicle Module — API Reference

Base URL: `/vehicles`  
All endpoints require `Authorization: Bearer <token>`.  
Tenant is resolved from the auth token.

---

## Shared Types

### `Vehicle`
```ts
{
  _id: string
  tenantId: string
  registrationNumber: string
  type: "bike" | "auto" | "van" | "truck" | "tempo"
  make?: string
  model?: string
  year?: number
  capacity: number              // default 0
  capacityUnit: string          // default "liters"
  assignedDriverId?: string     // ref to Driver
  status: "active" | "maintenance" | "retired"
  insuranceNumber?: string
  insuranceExpiry?: string      // ISO date
  lastMaintenanceDate?: string
  nextMaintenanceDate?: string
  fuelType?: string
  notes?: string
  isDeleted: boolean
  createdAt: string
  updatedAt: string
}
```

---

## Endpoints

---

### 1. Register Vehicle
**`POST /vehicles`**  
Roles: `admin`

#### Request Body
```ts
{
  registrationNumber: string                        // required — unique per tenant
  type: "bike" | "auto" | "van" | "truck" | "tempo" // required
  make?: string
  model?: string
  year?: number
  capacity?: number
  insuranceNumber?: string
  insuranceExpiry?: string    // ISO date e.g. "2027-12-31"
  fuelType?: string
  notes?: string
}
```

#### Response `201`
Full `Vehicle` object.

---

### 2. List Vehicles
**`GET /vehicles`**  
Roles: `admin`

#### Query Params
| Param | Type | Description |
|---|---|---|
| `page` | number | Default: `1` |
| `limit` | number | Default: `20`, max `100` |
| `sort` | string | e.g. `-createdAt` |
| `search` | string | Search by registration number |
| `all` | boolean | Return all without pagination |

#### Response `200`
```ts
{
  data: Vehicle[]
  meta: { total, page, limit, totalPages }
}
```

---

### 3. Vehicles with Maintenance Due
**`GET /vehicles/maintenance-due`**  
Roles: `admin`  
Returns vehicles where `nextMaintenanceDate <= today` or `insuranceExpiry <= today`.

#### Response `200`
```ts
Vehicle[]
```

---

### 4. Get Vehicle by Driver
**`GET /vehicles/driver/:driverId`**  
Roles: `admin`, `driver`

#### Response `200`
Single `Vehicle` object assigned to that driver, or `404` if none assigned.

---

### 5. Get Vehicle by ID
**`GET /vehicles/:id`**  
Roles: `admin`, `driver`

#### Response `200`
Full `Vehicle` object.

---

### 6. Update Vehicle
**`PATCH /vehicles/:id`**  
Roles: `admin`

#### Request Body
```ts
{
  make?: string
  model?: string
  status?: "active" | "maintenance" | "retired"
  insuranceNumber?: string
  insuranceExpiry?: string
  lastMaintenanceDate?: string
  nextMaintenanceDate?: string
  fuelType?: string
  notes?: string
  capacity?: number
}
```

#### Response `200`
Updated `Vehicle` object.

---

### 7. Assign Vehicle to Driver
**`PATCH /vehicles/:id/assign`**  
Roles: `admin`

#### Request Body
```ts
{
  driverId: string   // required — Driver ObjectId
}
```

#### Response `200`
Updated `Vehicle` object with `assignedDriverId` set.

---

### 8. Unassign Vehicle from Driver
**`PATCH /vehicles/:id/unassign`**  
Roles: `admin`

#### Response `200`
Updated `Vehicle` object with `assignedDriverId` cleared.

---

### 9. Delete Vehicle
**`DELETE /vehicles/:id`**  
Roles: `admin`  
Soft deletes the vehicle.

#### Response `204` — No Content

---

## Error Responses

| Code | Meaning |
|---|---|
| `400` | Validation error |
| `401` | Missing or invalid token |
| `403` | Insufficient role |
| `404` | Vehicle not found |
| `409` | Registration number already exists |
