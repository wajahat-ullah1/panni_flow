# WebSocket — Tracking Gateway

Namespace: `/tracking`  
Protocol: Socket.IO  
CORS: open (`*`)

---

## Connection

```ts
import { io } from "socket.io-client";

const socket = io("http://<server>/tracking");
```

No authentication is enforced at the transport level — pass identifiers in the event payloads.

---

## Events Reference

### Client → Server (emit)

---

#### `subscribe-order`
Customer or admin subscribes to real-time updates for a specific order.  
Joins the internal room `order-<orderId>`.

```ts
socket.emit("subscribe-order", { orderId: string });
```

**Server acknowledges with `subscribed`:**
```ts
socket.on("subscribed", (data) => {
  // data: { orderId: string; message: string }
});
```

---

#### `unsubscribe-order`
Leaves the order room — stops receiving updates for that order.

```ts
socket.emit("unsubscribe-order", { orderId: string });
```

No acknowledgement event.

---

#### `driver-connect`
Driver app calls this on startup to join their personal notification room `driver-<driverId>`.  
Required to receive `order-assigned` events.

```ts
socket.emit("driver-connect", { driverId: string });
```

**Server acknowledges with `connected`:**
```ts
socket.on("connected", (data) => {
  // data: { driverId: string; message: string }
});
```

---

#### `driver-location-update`
Driver app sends GPS coordinates. Broadcasts a `location-update` event to all clients subscribed to that order.

```ts
socket.emit("driver-location-update", {
  orderId: string;
  driverId: string;
  lat: number;
  lng: number;
});
```

---

### Server → Client (listen)

---

#### `location-update`
Received by everyone subscribed to an order room when the driver emits a new GPS position.

```ts
socket.on("location-update", (data) => {
  // data:
  // {
  //   orderId: string
  //   driverId: string
  //   lat: number
  //   lng: number
  //   updatedAt: string   // ISO timestamp
  // }
});
```

---

#### `status-update`
Emitted by the server whenever an order status changes (e.g. `confirmed → assigned`, `out-for-delivery → delivered`).  
Sent automatically by the order service — no client action required.

```ts
socket.on("status-update", (data) => {
  // data:
  // {
  //   orderId: string
  //   status: string      // new status value
  //   note?: string
  //   updatedAt: string
  // }
});
```

---

#### `order-assigned`
Received by a driver client in their personal room (`driver-<driverId>`) when an admin assigns them a new order.

```ts
socket.on("order-assigned", (data) => {
  // data: full order details object
});
```

---

## Typical Usage Flows

### Customer tracking screen
```ts
// 1. Connect
const socket = io("http://<server>/tracking");

// 2. Subscribe to the order
socket.emit("subscribe-order", { orderId: "<orderId>" });

// 3. Listen for driver location
socket.on("location-update", ({ lat, lng }) => {
  updateMapMarker(lat, lng);
});

// 4. Listen for status changes
socket.on("status-update", ({ status }) => {
  updateOrderStatusBadge(status);
});

// 5. Cleanup on unmount
socket.emit("unsubscribe-order", { orderId: "<orderId>" });
socket.disconnect();
```

---

### Driver app
```ts
// 1. Connect and join personal room
const socket = io("http://<server>/tracking");
socket.emit("driver-connect", { driverId: "<driverId>" });

// 2. Receive new order assignments
socket.on("order-assigned", (order) => {
  showNewOrderNotification(order);
});

// 3. Send location updates (call on GPS interval)
navigator.geolocation.watchPosition(({ coords }) => {
  socket.emit("driver-location-update", {
    orderId: currentOrderId,
    driverId: myDriverId,
    lat: coords.latitude,
    lng: coords.longitude,
  });
});
```
