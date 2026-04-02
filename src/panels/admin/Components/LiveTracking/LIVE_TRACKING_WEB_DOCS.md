# Live Tracking - Web Application Documentation

## Overview
The Live Tracking component is a React web application with Google Maps integration for real-time monitoring of water delivery tankers. It provides live location tracking, route visualization, and delivery management.

## Components

### 1. LiveTracking.jsx
Main component with Google Maps integration, tanker markers, and delivery monitoring.

## Features

### ✅ Main Features

1. **Interactive Google Map**
   - Full-screen map view
   - Pan and zoom controls
   - Custom tanker markers (blue circles)
   - Destination markers (green pins)
   - Route polylines (dashed blue lines)
   - Click on markers to select tankers

2. **Map Legend**
   - White card overlay in top-left
   - Active Tanker icon (blue)
   - Destination icon (green)
   - Clear labels

3. **Tanker Markers**
   - 4 active tankers on map
   - Blue circles for normal state
   - Orange/red circle for selected tanker
   - Tanker ID labels below markers
   - Clickable to view details

4. **Destination Markers**
   - Green map pin icons
   - Multiple delivery locations
   - Visual distinction from tankers

5. **Route Visualization**
   - Dashed blue polyline
   - Shows when tanker is selected
   - Connects current location to destination
   - Smooth geodesic curves

6. **Active Deliveries Sidebar**
   - Customer name and order ID
   - Tanker assignment badge (blue)
   - ETA display with clock icon
   - Status badges (In Transit / Delivering)
   - Color-coded: Blue for transit, Green for arrived
   - Click to focus on map

7. **Tanker Details Panel**
   - Appears when tanker is selected
   - Information displayed:
     - Tanker ID (blue, clickable style)
     - Driver name
     - Order ID (blue link)
     - Destination (green background with map icon)
     - ETA (orange background with clock icon)
   - Contact Driver button (blue gradient)
   - View Route button (gray)

8. **Bottom Statistics Bar**
   - 4 stat cards with icons:
     - Active Tankers: 4 (blue)
     - Completed Today: 12 (green)
     - Avg. Delivery Time: 18 min (orange)
     - Pending Pickups: 6 (purple)
   - Icon backgrounds matching colors
   - Responsive grid layout

## Installation

### 1. Install Dependencies

```bash
npm install @react-google-maps/api
# or
yarn add @react-google-maps/api
```

### 2. Get Google Maps API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project
3. Enable Maps JavaScript API
4. Create credentials (API Key)
5. Restrict your API key (recommended)

### 3. Add API Key

Replace in `LiveTracking.jsx`:

```javascript
const GOOGLE_MAPS_API_KEY = 'YOUR_ACTUAL_API_KEY_HERE';
```

**Better: Use Environment Variables**

Create `.env` file:
```env
REACT_APP_GOOGLE_MAPS_API_KEY=your_api_key_here
```

Use in component:
```javascript
const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
```

## Usage

### Basic Implementation

```javascript
import LiveTracking from './components/LiveTracking';

function App() {
  return <LiveTracking />;
}
```

### With Navigation

```javascript
import { useState } from 'react';
import LiveTracking from './components/LiveTracking';

function App() {
  const [activeScreen, setActiveScreen] = useState('tracking');

  return (
    <div>
      {activeScreen === 'tracking' && <LiveTracking />}
    </div>
  );
}
```

## Data Structure

### Tanker Object

```javascript
{
  id: string,               // e.g., "TK-102"
  position: {               // Google Maps LatLng
    lat: number,
    lng: number
  },
  driver: string,           // Driver name
  orderId: string,          // Associated order
  customer: string,         // Customer name
  destination: string,      // Delivery address
  eta: string,              // Estimated time
  status: string            // Current status
}
```

### Destination Object

```javascript
{
  position: {
    lat: number,
    lng: number
  },
  label: string             // Location name
}
```

## Customization

### Change Map Style

```javascript
const mapOptions = {
  styles: [
    {
      featureType: 'water',
      elementType: 'geometry',
      stylers: [{ color: '#e3f2fd' }]
    },
    // Add more style rules
  ],
  disableDefaultUI: false,
  zoomControl: true,
};
```

### Custom Marker Icons

```javascript
// For tanker markers
icon={{
  url: '/path/to/custom-truck-icon.png',
  scaledSize: new window.google.maps.Size(40, 40),
}}

// Or use SVG
icon={{
  path: 'M 0,0 L 10,10 L 20,0 Z',
  fillColor: '#2196F3',
  fillOpacity: 1,
  strokeColor: '#fff',
  strokeWeight: 2,
  scale: 2,
}}
```

### Change Route Style

```javascript
<Polyline
  path={routeCoordinates}
  options={{
    strokeColor: '#FF5722',      // Change color
    strokeOpacity: 1.0,
    strokeWeight: 4,             // Change thickness
    geodesic: true,
    icons: [{
      icon: {
        path: 'M 0,-1 0,1',
        strokeOpacity: 1,
        scale: 3,                 // Dash size
      },
      offset: '0',
      repeat: '15px',             // Dash spacing
    }],
  }}
/>
```

## API Integration

### Fetching Real-time Locations

```javascript
import { useState, useEffect } from 'react';
import axios from 'axios';

const LiveTracking = () => {
  const [tankers, setTankers] = useState([]);

  useEffect(() => {
    // Initial fetch
    fetchTankerLocations();

    // Update every 10 seconds
    const interval = setInterval(fetchTankerLocations, 10000);

    return () => clearInterval(interval);
  }, []);

  const fetchTankerLocations = async () => {
    try {
      const response = await axios.get('YOUR_API_URL/tankers/active');
      setTankers(response.data);
    } catch (error) {
      console.error('Error fetching locations:', error);
    }
  };

  // Rest of component
};
```

### WebSocket for Real-time Updates

```javascript
useEffect(() => {
  const ws = new WebSocket('ws://your-server.com/tracking');

  ws.onopen = () => {
    console.log('WebSocket connected');
  };

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    setTankers(data.tankers);
  };

  ws.onerror = (error) => {
    console.error('WebSocket error:', error);
  };

  ws.onclose = () => {
    console.log('WebSocket disconnected');
  };

  return () => ws.close();
}, []);
```

### Get Directions from Google

```javascript
const getDirections = async (origin, destination) => {
  const DirectionsService = new window.google.maps.DirectionsService();

  return new Promise((resolve, reject) => {
    DirectionsService.route(
      {
        origin: origin,
        destination: destination,
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === 'OK') {
          resolve(result);
        } else {
          reject(status);
        }
      }
    );
  });
};

// Usage
const showRoute = async () => {
  const directions = await getDirections(
    selectedTanker.position,
    destinationPosition
  );
  
  // Extract route coordinates
  const route = directions.routes[0].overview_path.map(point => ({
    lat: point.lat(),
    lng: point.lng()
  }));
  
  setRouteCoordinates(route);
};
```

### Calculate ETA

```javascript
const calculateETA = async (origin, destination) => {
  const DistanceMatrixService = new window.google.maps.DistanceMatrixService();

  return new Promise((resolve, reject) => {
    DistanceMatrixService.getDistanceMatrix(
      {
        origins: [origin],
        destinations: [destination],
        travelMode: 'DRIVING',
      },
      (response, status) => {
        if (status === 'OK') {
          const duration = response.rows[0].elements[0].duration.text;
          resolve(duration);
        } else {
          reject(status);
        }
      }
    );
  });
};

// Usage
const eta = await calculateETA(
  selectedTanker.position,
  destinationPosition
);
```

## Advanced Features

### 1. Geofencing (Arrival Detection)

```javascript
const checkArrival = (tankerPos, destPos, radiusMeters = 100) => {
  const R = 6371e3; // Earth radius in meters
  const φ1 = (tankerPos.lat * Math.PI) / 180;
  const φ2 = (destPos.lat * Math.PI) / 180;
  const Δφ = ((destPos.lat - tankerPos.lat) * Math.PI) / 180;
  const Δλ = ((destPos.lng - tankerPos.lng) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return distance <= radiusMeters;
};

// Usage
if (checkArrival(tankerPosition, destinationPosition)) {
  console.log('Tanker has arrived!');
  // Trigger notification
}
```

### 2. Marker Clustering (for many tankers)

```javascript
import { MarkerClusterer } from '@googlemaps/markerclusterer';

const [markerClusterer, setMarkerClusterer] = useState(null);

useEffect(() => {
  if (map && tankers.length > 10) {
    const clusterer = new MarkerClusterer({
      map,
      markers: markerRefs.current,
    });
    setMarkerClusterer(clusterer);
  }
}, [map, tankers]);
```

### 3. Heat Map

```javascript
import { HeatmapLayer } from '@react-google-maps/api';

<HeatmapLayer
  data={tankers.map(t => new window.google.maps.LatLng(t.position))}
  options={{
    radius: 20,
    opacity: 0.6,
  }}
/>
```

### 4. Traffic Layer

```javascript
import { TrafficLayer } from '@react-google-maps/api';

<TrafficLayer />
```

## Performance Optimization

### 1. Limit Update Frequency

```javascript
const [lastUpdate, setLastUpdate] = useState(Date.now());

const shouldUpdate = (newPosition, oldPosition) => {
  const threshold = 0.0001; // ~10 meters
  return (
    Math.abs(newPosition.lat - oldPosition.lat) > threshold ||
    Math.abs(newPosition.lng - oldPosition.lng) > threshold
  );
};

// Only update if position changed significantly
if (shouldUpdate(newPos, oldPos)) {
  updateTankerPosition(tankerId, newPos);
}
```

### 2. Memoize Map Options

```javascript
import { useMemo } from 'react';

const mapOptions = useMemo(() => ({
  disableDefaultUI: false,
  zoomControl: true,
  mapTypeControl: false,
}), []);
```

### 3. Debounce Map Events

```javascript
import { useCallback } from 'react';

const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

const handleMapIdle = useCallback(
  debounce(() => {
    console.log('Map idle');
    // Fetch visible tankers
  }, 500),
  []
);
```

## Styling

### Custom Map Controls

```css
.custom-map-control {
  position: absolute;
  top: 10px;
  right: 10px;
  background: white;
  padding: 10px;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.3);
  cursor: pointer;
}
```

### Responsive Map Height

```css
.map-section {
  height: calc(100vh - 200px); /* Adjust based on header/footer */
}

@media (max-width: 768px) {
  .map-section {
    height: 400px;
  }
}
```

## Testing

### Unit Tests

```javascript
import { render, screen, waitFor } from '@testing-library/react';
import LiveTracking from './LiveTracking';

test('renders map and tankers', async () => {
  render(<LiveTracking />);
  
  await waitFor(() => {
    expect(screen.getByText('Live Tracking')).toBeInTheDocument();
  });
});
```

### Mock Google Maps

```javascript
// setupTests.js
global.window.google = {
  maps: {
    Map: jest.fn(),
    Marker: jest.fn(),
    LatLng: jest.fn((lat, lng) => ({ lat, lng })),
    // Mock other Google Maps objects
  },
};
```

## Troubleshooting

### Issue: Map not loading
**Solution:** Check API key and console errors

```javascript
<LoadScript
  googleMapsApiKey={GOOGLE_MAPS_API_KEY}
  onLoad={() => console.log('Maps loaded')}
  onError={(error) => console.error('Maps error:', error)}
>
```

### Issue: Markers not showing
**Solution:** Ensure positions are valid

```javascript
// Validate coordinates
const isValidPosition = (pos) => {
  return (
    pos &&
    typeof pos.lat === 'number' &&
    typeof pos.lng === 'number' &&
    pos.lat >= -90 &&
    pos.lat <= 90 &&
    pos.lng >= -180 &&
    pos.lng <= 180
  );
};
```

### Issue: Performance slow with many markers
**Solution:** Use marker clustering

```bash
npm install @googlemaps/markerclusterer
```

## Security Best Practices

1. **Restrict API Key**
   - Go to Google Cloud Console
   - Restrict to your website domain
   - Set daily quota limits

2. **Environment Variables**
   - Never commit API keys
   - Use `.env` files
   - Add `.env` to `.gitignore`

3. **HTTPS Only**
   - Google Maps requires HTTPS in production

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Resources

- [Google Maps JavaScript API](https://developers.google.com/maps/documentation/javascript)
- [@react-google-maps/api Docs](https://react-google-maps-api-docs.netlify.app/)
- [Google Maps Platform Pricing](https://cloud.google.com/maps-platform/pricing)

## Future Enhancements

- [ ] Street View integration
- [ ] 3D buildings
- [ ] Custom map themes
- [ ] Replay historical routes
- [ ] Export route data
- [ ] Print map view
- [ ] Offline mode

---

**Part of Paani Flow Final Year Project**
CECOS University of IT and Emerging Sciences
