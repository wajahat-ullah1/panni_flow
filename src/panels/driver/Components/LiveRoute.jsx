import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, Marker, DirectionsRenderer, Polyline } from '@react-google-maps/api';
import { io } from 'socket.io-client';
import './LiveRoute.css';
import driverApi from '../../../shared/api/driverApi';
import { getDriverId } from '../../../shared/api/driverStore';

// â”€â”€ Constants â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const SOCKET_URL  = import.meta.env.VITE_SOCKET_URL  || 'http://localhost:3000';
const MAPS_KEY    = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';
const MAP_STYLE   = { width: '100%', height: '100%' };
const MAP_OPTIONS = { zoomControl: true, streetViewControl: false, mapTypeControl: false, fullscreenControl: true };

// â”€â”€ Helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const formatAddress = (addr) => {
  if (!addr) return '-';
  return [addr.street, addr.landmark, addr.city].filter(Boolean).join(', ') || '-';
};

const getTotalQuantity = (items) => {
  if (!items || !items.length) return '-';
  return `${items.reduce((s, i) => s + (i.quantity || 0), 0).toLocaleString()}L`;
};

const formatScheduledTime = (order) => {
  if (order.scheduledTimeSlot) return order.scheduledTimeSlot;
  if (order.scheduledDate) {
    return new Date(order.scheduledDate).toLocaleTimeString('en-US', {
      hour: 'numeric', minute: '2-digit', hour12: true,
    });
  }
  return '-';
};

// â”€â”€ Map sub-component â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const RouteMap = ({ driverPos, customerPos }) => {
  const { isLoaded } = useJsApiLoader({ id: 'google-map-script', googleMapsApiKey: MAPS_KEY, libraries: ['places'] });
  const [directions, setDirections] = useState(null);

  useEffect(() => {
    if (!isLoaded || !driverPos || !customerPos) return;
    const svc = new window.google.maps.DirectionsService();
    svc.route(
      { origin: driverPos, destination: customerPos, travelMode: window.google.maps.TravelMode.DRIVING },
      (result, status) => setDirections(status === 'OK' ? result : null),
    );
  }, [isLoaded, driverPos?.lat, driverPos?.lng, customerPos?.lat, customerPos?.lng]);

  if (!isLoaded) {
    return (
      <div className="map-placeholder">
        <p style={{ color: '#64748b' }}>Loading mapâ€¦</p>
      </div>
    );
  }

  const center = driverPos || customerPos || { lat: 33.6844, lng: 73.0479 };

  const driverIcon = {
    path: window.google.maps.SymbolPath.CIRCLE,
    scale: 12,
    fillColor: '#0ea5e9',
    fillOpacity: 1,
    strokeColor: 'white',
    strokeWeight: 3,
  };

  const destIcon = {
    path: window.google.maps.SymbolPath.CIRCLE,
    scale: 9,
    fillColor: '#f97316',
    fillOpacity: 1,
    strokeColor: 'white',
    strokeWeight: 2,
  };

  return (
    <GoogleMap mapContainerStyle={MAP_STYLE} center={center} zoom={14} options={MAP_OPTIONS}>
      {directions ? (
        <DirectionsRenderer
          directions={directions}
          options={{
            suppressMarkers: true,
            polylineOptions: { strokeColor: '#3b82f6', strokeWeight: 4, strokeOpacity: 0.85 },
          }}
        />
      ) : (
        driverPos && customerPos && (
          <Polyline
            path={[driverPos, customerPos]}
            options={{
              strokeOpacity: 0, strokeWeight: 0,
              icons: [{ icon: { path: 'M 0,-1 0,1', strokeOpacity: 0.85, strokeWeight: 3, strokeColor: '#3b82f6', scale: 4 }, offset: '0', repeat: '20px' }],
            }}
          />
        )
      )}
      {driverPos  && <Marker position={driverPos}  icon={driverIcon} label={{ text: 'ðŸšš', fontSize: '18px' }} title="You" />}
      {customerPos && <Marker position={customerPos} icon={destIcon}   label={{ text: 'ðŸ“', fontSize: '18px' }} title="Destination" />}
    </GoogleMap>
  );
};

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const LiveRoute = () => {
  const [currentDelivery, setCurrentDelivery] = useState(null);
  const [todaysRoute, setTodaysRoute]         = useState([]);
  const [navInfo, setNavInfo]                 = useState(null);
  const [driverPos, setDriverPos]             = useState(null);
  const [loading, setLoading]                 = useState(true);
  const [error, setError]                     = useState(null);
  const [actionLoading, setActionLoading]     = useState(false);

  const socketRef  = useRef(null);
  const watchRef   = useRef(null);     // geolocation watchId

  // â”€â”€ Fetch orders â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const fetchRouteData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res    = await driverApi.getDriverDeliveries(getDriverId(), { limit: 20 });
      const orders = res?.data?.data ?? [];

      const active = orders.find((o) => o.status === 'out-for-delivery');
      setCurrentDelivery(active || null);
      setTodaysRoute(orders.filter((o) => !['delivered', 'cancelled', 'rejected'].includes(o.status)));

      if (active) {
        try {
          const nav = await driverApi.getOrderNavigation(active._id);
          setNavInfo(nav?.data ?? nav);
        } catch { /* optional */ }
      } else {
        setNavInfo(null);
      }
    } catch (err) {
      setError(err.message || 'Failed to load route data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchRouteData(); }, [fetchRouteData]);

  // â”€â”€ WebSocket â€” driver-connect + order subscriptions â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  useEffect(() => {
    const driverId = getDriverId();
    if (!driverId) return;

    const socket = io(`${SOCKET_URL}/tracking`, { transports: ['websocket'] });
    socketRef.current = socket;

    // Join personal driver room to receive order-assigned notifications
    socket.emit('driver-connect', { driverId });

    socket.on('order-assigned', () => {
      // New order assigned â€” refresh the list
      fetchRouteData();
    });

    socket.on('status-update', ({ status }) => {
      if (status === 'delivered' || status === 'cancelled') {
        fetchRouteData();
      }
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [fetchRouteData]);

  // â”€â”€ Subscribe to the active order room + broadcast GPS via WebSocket â”€â”€â”€â”€â”€â”€â”€â”€
  useEffect(() => {
    const driverId = getDriverId();
    if (!currentDelivery || !driverId || !socketRef.current) return;

    const socket  = socketRef.current;
    const orderId = currentDelivery._id;

    socket.emit('subscribe-order', { orderId });

    // Start GPS watch â€” broadcast via WebSocket every position update
    if (navigator.geolocation) {
      watchRef.current = navigator.geolocation.watchPosition(
        ({ coords }) => {
          const { latitude: lat, longitude: lng } = coords;
          setDriverPos({ lat, lng });
          socket.emit('driver-location-update', { orderId, driverId, lat, lng });
        },
        () => { /* silent fail */ },
        { enableHighAccuracy: true, maximumAge: 5000 },
      );
    }

    return () => {
      socket.emit('unsubscribe-order', { orderId });
      if (watchRef.current != null) {
        navigator.geolocation.clearWatch(watchRef.current);
        watchRef.current = null;
      }
    };
  }, [currentDelivery]);

  // â”€â”€ Actions â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const handleNavigate = () => {
    if (navInfo?.navigationUrl) {
      window.open(navInfo.navigationUrl, '_blank', 'noopener,noreferrer');
      return;
    }
    if (currentDelivery) {
      const dest = encodeURIComponent(formatAddress(currentDelivery.deliveryAddress));
      window.open(`https://www.google.com/maps/dir/?api=1&destination=${dest}`, '_blank', 'noopener,noreferrer');
    }
  };

  const handleCall = () => {
    const phone = navInfo?.customer?.phone || currentDelivery?.customerPhone;
    if (phone) window.location.href = `tel:${phone}`;
  };

  const handleMarkDelivered = async () => {
    if (!currentDelivery) return;
    setActionLoading(true);
    try {
      await driverApi.updateOrderStatus(currentDelivery._id, 'delivered');
      await fetchRouteData();
    } catch (err) {
      alert(err.message || 'Failed to mark as delivered');
    } finally {
      setActionLoading(false);
    }
  };

  // â”€â”€ Customer destination coords from navInfo or order â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const customerPos = navInfo?.destination?.coordinates
    ? { lat: navInfo.destination.coordinates.lat, lng: navInfo.destination.coordinates.lng }
    : currentDelivery?.deliveryAddress?.coordinates
      ? { lat: currentDelivery.deliveryAddress.coordinates.lat, lng: currentDelivery.deliveryAddress.coordinates.lng }
      : null;

  // â”€â”€ Render â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  if (loading) {
    return (
      <div className="main-content">
        <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem', color: '#64748b' }}>
          Loading route dataâ€¦
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="main-content">
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <p style={{ color: '#ef4444', marginBottom: '1rem' }}>{error}</p>
          <button onClick={fetchRouteData} className="btn-mark-arrived" style={{ width: 'auto' }}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="main-content">
      <header className="page-header">
        <h2 className="page-title">Live Route Tracking</h2>
        <p className="page-subtitle">Navigate to your delivery destinations</p>
      </header>

      <div className="live-route-content">

        {currentDelivery ? (
          <>
            {/* Current Delivery Card */}
            <div className="current-delivery-card">
              <div className="delivery-badge"><span>Current Delivery</span></div>

              <div className="delivery-info-header">
                <div className="delivery-main-info">
                  <h3 className="customer-name-large">{currentDelivery.customerName}</h3>
                  <p className="order-id">{currentDelivery.orderNumber || currentDelivery._id}</p>
                  <div className="delivery-meta">
                    <div className="meta-item">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M12 21C12 21 5 13.5 5 8.5a7 7 0 1114 0C19 13.5 12 21 12 21z" stroke="white" strokeWidth="2"/>
                        <circle cx="12" cy="8.5" r="2.5" stroke="white" strokeWidth="2"/>
                      </svg>
                      <span>{formatAddress(currentDelivery.deliveryAddress)}</span>
                    </div>
                    <div className="meta-item">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="9" stroke="white" strokeWidth="2"/>
                        <path d="M12 6V12L15 14" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                      <span>Scheduled: {formatScheduledTime(currentDelivery)}</span>
                    </div>
                  </div>
                </div>
                <div className="delivery-icon">
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                    <rect x="2" y="6" width="20" height="17" rx="2" stroke="white" strokeWidth="2"/>
                    <path d="M22 11H27L31 15V23H22V11Z" stroke="white" strokeWidth="2"/>
                    <circle cx="8" cy="26" r="3" stroke="white" strokeWidth="2"/>
                    <circle cx="25" cy="26" r="3" stroke="white" strokeWidth="2"/>
                  </svg>
                </div>
              </div>

              <div className="distance-info">
                <span className="distance-label">Quantity:</span>
                <span className="distance-value">{getTotalQuantity(currentDelivery.items)}</span>
              </div>

              <div className="action-buttons">
                <button className="btn-navigate" onClick={handleNavigate}>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M10 3L17 8V17H13V12H7V17H3V8L10 3Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Navigate
                </button>
                <button className="btn-call" onClick={handleCall}>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M18 13.5V16.5C18 17.0523 17.5523 17.5 17 17.5H15.5C8.59644 17.5 3 11.9036 3 5V3.5C3 2.94772 3.44772 2.5 4 2.5H7L8.5 6.5L6.5 7.5C7.5 9.5 9.5 11.5 11.5 12.5L12.5 10.5L16.5 12L18 13.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            </div>

            {/* Arrival summary bar */}
            <div className="arrival-info-card">
              <div className="arrival-icon">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M10 3L17 8V17H13V12H7V17H3V8L10 3Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="arrival-text">
                <p className="arrival-label">Delivery</p>
                <p className="arrival-time">{currentDelivery.orderNumber || currentDelivery._id}</p>
              </div>
              <div className="arrival-distance">
                <p className="distance-label-small">Amount</p>
                <p className="distance-value-small">{getTotalQuantity(currentDelivery.items)}</p>
              </div>
            </div>
          </>
        ) : (
          <div className="arrival-info-card">
            <div className="arrival-text">
              <p className="arrival-label">No Active Delivery</p>
              <p className="arrival-time" style={{ fontSize: '14px', color: '#94a3b8' }}>
                Accept a delivery to start tracking your route here
              </p>
            </div>
          </div>
        )}

        {/* â”€â”€ Google Map â”€â”€ */}
        <div className="map-container" style={{ height: 360, borderRadius: 14, overflow: 'hidden', border: '1px solid #e2e8f0' }}>
          <RouteMap driverPos={driverPos} customerPos={customerPos} />
        </div>

        {/* â”€â”€ Today's Route â”€â”€ */}
        <div className="todays-route-section">
          <h3 className="section-title">Today's Route</h3>

          {todaysRoute.length === 0 ? (
            <p style={{ color: '#94a3b8', padding: '1rem 0' }}>No active deliveries in your route</p>
          ) : (
            <div className="route-list">
              {todaysRoute.map((order, idx) => (
                <div key={order._id} className={`route-item ${order.status === 'out-for-delivery' ? 'active' : ''}`}>
                  <div className="route-number"><span>{idx + 1}</span></div>
                  <div className="route-details">
                    <div className="route-header">
                      <h4 className="route-customer">{order.customerName}</h4>
                      {order.status === 'out-for-delivery' && (
                        <span className="transit-badge">In Transit</span>
                      )}
                    </div>
                    <p className="route-location">
                      {formatAddress(order.deliveryAddress)} â€¢ {formatScheduledTime(order)}
                    </p>
                  </div>
                  <div className="route-amount"><span>{getTotalQuantity(order.items)}</span></div>
                </div>
              ))}
            </div>
          )}

          <div className="route-actions">
            <button
              className="btn-mark-arrived"
              onClick={handleMarkDelivered}
              disabled={!currentDelivery || actionLoading}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <circle cx="10" cy="10" r="8" stroke="white" strokeWidth="2"/>
                <path d="M6 10L9 13L14 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              {actionLoading ? 'Updatingâ€¦' : 'Mark Delivered'}
            </button>
            <button className="btn-report-emergency" onClick={() => alert('Emergency reported. Support has been notified.')}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="2"/>
                <path d="M10 6V10M10 14H10.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              Report Emergency
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveRoute;
