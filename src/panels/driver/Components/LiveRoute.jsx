import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, Marker, DirectionsRenderer, Polyline } from '@react-google-maps/api';
import { io } from 'socket.io-client';
import driverApi from '../../../shared/api/driverApi';
import { getDriverId } from '../../../shared/api/driverStore';

// ── Constants ─────────────────────────────────────────────────────────────────
const SOCKET_URL  = import.meta.env.VITE_SOCKET_URL  || 'http://localhost:3000';
const MAPS_KEY    = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';
const MAP_STYLE   = { width: '100%', height: '100%' };
const MAP_OPTIONS = { zoomControl: true, streetViewControl: false, mapTypeControl: false, fullscreenControl: true };

// ── Helpers ───────────────────────────────────────────────────────────────────
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

// ── Map sub-component ─────────────────────────────────────────────────────────
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
      <div className="lr-map-placeholder">
        <div className="lr-loader-spinner" />
        <p>Loading map…</p>
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
            polylineOptions: { strokeColor: '#0ea5e9', strokeWeight: 4, strokeOpacity: 0.85 },
          }}
        />
      ) : (
        driverPos && customerPos && (
          <Polyline
            path={[driverPos, customerPos]}
            options={{
              strokeOpacity: 0, strokeWeight: 0,
              icons: [{ icon: { path: 'M 0,-1 0,1', strokeOpacity: 0.85, strokeWeight: 3, strokeColor: '#0ea5e9', scale: 4 }, offset: '0', repeat: '20px' }],
            }}
          />
        )
      )}
      {driverPos   && <Marker position={driverPos}   icon={driverIcon} label={{ text: '🚚', fontSize: '18px' }} title="You" />}
      {customerPos && <Marker position={customerPos} icon={destIcon}   label={{ text: '📍', fontSize: '18px' }} title="Destination" />}
    </GoogleMap>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
const LiveRoute = () => {
  const [currentDelivery, setCurrentDelivery] = useState(null);
  const [todaysRoute, setTodaysRoute]         = useState([]);
  const [navInfo, setNavInfo]                 = useState(null);
  const [driverPos, setDriverPos]             = useState(null);
  const [loading, setLoading]                 = useState(true);
  const [error, setError]                     = useState(null);
  const [actionLoading, setActionLoading]     = useState(false);

  const socketRef = useRef(null);
  const watchRef  = useRef(null);

  // ── Fetch orders ──────────────────────────────────────────────────────────
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

  // ── WebSocket ─────────────────────────────────────────────────────────────
  useEffect(() => {
    const driverId = getDriverId();
    if (!driverId) return;
    const socket = io(`${SOCKET_URL}/tracking`, { transports: ['websocket'] });
    socketRef.current = socket;
    socket.emit('driver-connect', { driverId });
    socket.on('order-assigned', () => fetchRouteData());
    socket.on('status-update', ({ status }) => {
      if (status === 'delivered' || status === 'cancelled') fetchRouteData();
    });
    return () => { socket.disconnect(); socketRef.current = null; };
  }, [fetchRouteData]);

  // ── GPS watch + subscribe active order ───────────────────────────────────
  useEffect(() => {
    const driverId = getDriverId();
    if (!currentDelivery || !driverId || !socketRef.current) return;
    const socket  = socketRef.current;
    const orderId = currentDelivery._id;
    socket.emit('subscribe-order', { orderId });
    if (navigator.geolocation) {
      watchRef.current = navigator.geolocation.watchPosition(
        ({ coords }) => {
          const { latitude: lat, longitude: lng } = coords;
          setDriverPos({ lat, lng });
          socket.emit('driver-location-update', { orderId, driverId, lat, lng });
        },
        () => {},
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

  // ── Actions ───────────────────────────────────────────────────────────────
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

  const customerPos = navInfo?.destination?.coordinates
    ? { lat: navInfo.destination.coordinates.lat, lng: navInfo.destination.coordinates.lng }
    : currentDelivery?.deliveryAddress?.coordinates
      ? { lat: currentDelivery.deliveryAddress.coordinates.lat, lng: currentDelivery.deliveryAddress.coordinates.lng }
      : null;

  // ── Loading ───────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <>
        <style>{lrStyles}</style>
        <div className="lr-root">
          <div className="lr-loader">
            <div className="lr-loader-spinner" />
            <span>Loading route data…</span>
          </div>
        </div>
      </>
    );
  }

  // ── Error ─────────────────────────────────────────────────────────────────
  if (error) {
    return (
      <>
        <style>{lrStyles}</style>
        <div className="lr-root">
          <div className="lr-error-box">
            <svg width="40" height="40" fill="none" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" stroke="#ef4444" strokeWidth="1.8"/>
              <path d="M12 8v4M12 16h.01" stroke="#ef4444" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <p>{error}</p>
            <button className="lr-retry-btn" onClick={fetchRouteData}>Try Again</button>
          </div>
        </div>
      </>
    );
  }

  // ── Main Render ───────────────────────────────────────────────────────────
  return (
    <>
      <style>{lrStyles}</style>
      <div className="lr-root">

        {/* ── Page Header ── */}
        <header className="lr-page-header">
          <div>
            <p className="lr-header-eyebrow">Navigation</p>
            <h1 className="lr-header-title">Live Route Tracking</h1>
            <p className="lr-header-sub">Navigate to your delivery destinations in real-time</p>
          </div>
          <button className="lr-refresh-btn" onClick={fetchRouteData} title="Refresh">
            <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
              <path d="M23 4v6h-6M1 20v-6h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M3.51 9a9 9 0 0114.13-3.36L23 10M1 14l5.36 4.36A9 9 0 0020.49 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </header>

        {/* ── Two-column layout ── */}
        <div className="lr-columns">

          {/* ── Left column ── */}
          <div className="lr-left-col">

            {/* Current Delivery Hero Card */}
            {currentDelivery ? (
              <div className="lr-delivery-hero">
                <div className="lr-hero-bg" />
                <div className="lr-hero-body">
                  <div className="lr-hero-top">
                    <span className="lr-active-badge">
                      <span className="lr-active-dot" />
                      Active Delivery
                    </span>
                    <div className="lr-delivery-icon-wrap">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                        <rect x="1" y="3" width="15" height="13" rx="2" stroke="white" strokeWidth="2"/>
                        <path d="M16 8H20L23 11V16H16V8Z" stroke="white" strokeWidth="2"/>
                        <circle cx="5.5" cy="18.5" r="2.5" stroke="white" strokeWidth="2"/>
                        <circle cx="18.5" cy="18.5" r="2.5" stroke="white" strokeWidth="2"/>
                      </svg>
                    </div>
                  </div>

                  <h2 className="lr-hero-name">{currentDelivery.customerName}</h2>
                  <p className="lr-hero-order">{currentDelivery.orderNumber || currentDelivery._id}</p>

                  <div className="lr-hero-meta">
                    <div className="lr-meta-item">
                      <svg width="14" height="14" fill="none" viewBox="0 0 24 24">
                        <path d="M12 21C12 21 5 13.5 5 8.5a7 7 0 1114 0C19 13.5 12 21 12 21z" stroke="rgba(255,255,255,0.8)" strokeWidth="2"/>
                        <circle cx="12" cy="8.5" r="2.5" stroke="rgba(255,255,255,0.8)" strokeWidth="2"/>
                      </svg>
                      <span>{formatAddress(currentDelivery.deliveryAddress)}</span>
                    </div>
                    <div className="lr-meta-item">
                      <svg width="14" height="14" fill="none" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="9" stroke="rgba(255,255,255,0.8)" strokeWidth="2"/>
                        <path d="M12 6V12L15 14" stroke="rgba(255,255,255,0.8)" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                      <span>{formatScheduledTime(currentDelivery)}</span>
                    </div>
                  </div>

                  <div className="lr-hero-qty">
                    <span className="lr-qty-label">Quantity</span>
                    <span className="lr-qty-value">{getTotalQuantity(currentDelivery.items)}</span>
                  </div>

                  <div className="lr-hero-actions">
                    <button className="lr-btn-navigate" onClick={handleNavigate}>
                      <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                        <polygon points="3 11 22 2 13 21 11 13 3 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Navigate
                    </button>
                    <button className="lr-btn-call" onClick={handleCall} title="Call Customer">
                      <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                        <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" stroke="white" strokeWidth="2" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="lr-no-delivery-card">
                <div className="lr-no-delivery-icon">
                  <svg width="36" height="36" fill="none" viewBox="0 0 24 24">
                    <rect x="1" y="3" width="15" height="13" rx="2" stroke="#cbd5e1" strokeWidth="1.8"/>
                    <path d="M16 8H20L23 11V16H16V8Z" stroke="#cbd5e1" strokeWidth="1.8"/>
                    <circle cx="5.5" cy="18.5" r="2.5" stroke="#cbd5e1" strokeWidth="1.8"/>
                    <circle cx="18.5" cy="18.5" r="2.5" stroke="#cbd5e1" strokeWidth="1.8"/>
                  </svg>
                </div>
                <p className="lr-no-delivery-title">No Active Delivery</p>
                <p className="lr-no-delivery-sub">Accept a delivery to start tracking your route here</p>
              </div>
            )}

            {/* Summary info row */}
            {currentDelivery && (
              <div className="lr-info-row">
                <div className="lr-info-chip">
                  <div className="lr-info-chip-icon" style={{ background: '#eff6ff' }}>
                    <svg width="14" height="14" fill="none" viewBox="0 0 24 24">
                      <path d="M20 7L12 3L4 7M20 7L12 11M20 7V17L12 21M12 11L4 7M12 11V21M4 7V17L12 21" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div>
                    <p className="lr-chip-label">Order</p>
                    <p className="lr-chip-value">{currentDelivery.orderNumber || currentDelivery._id}</p>
                  </div>
                </div>
                <div className="lr-info-chip">
                  <div className="lr-info-chip-icon" style={{ background: '#fff7ed' }}>
                    <svg width="14" height="14" fill="none" viewBox="0 0 24 24">
                      <path d="M3 6h18M3 12h18M3 18h18" stroke="#f97316" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <div>
                    <p className="lr-chip-label">Quantity</p>
                    <p className="lr-chip-value">{getTotalQuantity(currentDelivery.items)}</p>
                  </div>
                </div>
                <div className="lr-info-chip">
                  <div className="lr-info-chip-icon" style={{ background: '#f0fdf4' }}>
                    <svg width="14" height="14" fill="none" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="9" stroke="#22c55e" strokeWidth="2"/>
                      <path d="M12 6v6l4 2" stroke="#22c55e" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <div>
                    <p className="lr-chip-label">Scheduled</p>
                    <p className="lr-chip-value">{formatScheduledTime(currentDelivery)}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Today's Route */}
            <div className="lr-card">
              <div className="lr-section-head">
                <div className="lr-section-icon" style={{ background: 'linear-gradient(135deg,#3b82f6,#2563eb)' }}>
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                    <path d="M3 12h18M3 6h18M3 18h18" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </div>
                <div>
                  <h3 className="lr-section-title">Today's Route</h3>
                  <p className="lr-section-sub">{todaysRoute.length} stop{todaysRoute.length !== 1 ? 's' : ''} remaining</p>
                </div>
              </div>

              {todaysRoute.length === 0 ? (
                <div className="lr-route-empty">
                  <svg width="40" height="40" fill="none" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" stroke="#cbd5e1" strokeWidth="1.5"/>
                    <path d="M8 12l2 2 4-4" stroke="#cbd5e1" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <p>No active deliveries in your route</p>
                </div>
              ) : (
                <div className="lr-route-list">
                  {todaysRoute.map((order, idx) => {
                    const isActive = order.status === 'out-for-delivery';
                    return (
                      <div key={order._id} className={`lr-route-item ${isActive ? 'active' : ''}`}>
                        <div className={`lr-route-num ${isActive ? 'active' : ''}`}>
                          {isActive ? (
                            <svg width="14" height="14" fill="none" viewBox="0 0 24 24">
                              <circle cx="12" cy="12" r="5" fill="white"/>
                            </svg>
                          ) : (
                            <span>{idx + 1}</span>
                          )}
                        </div>
                        <div className="lr-route-info">
                          <div className="lr-route-top">
                            <span className="lr-route-name">{order.customerName}</span>
                            {isActive && <span className="lr-transit-pill">In Transit</span>}
                          </div>
                          <p className="lr-route-address">
                            {formatAddress(order.deliveryAddress)} · {formatScheduledTime(order)}
                          </p>
                        </div>
                        <span className="lr-route-qty">{getTotalQuantity(order.items)}</span>
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="lr-route-actions">
                <button
                  className="lr-btn-delivered"
                  onClick={handleMarkDelivered}
                  disabled={!currentDelivery || actionLoading}
                >
                  {actionLoading ? (
                    <><span className="lr-btn-spinner" />Updating…</>
                  ) : (
                    <>
                      <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2"/>
                        <path d="M8 12L11 15L16 9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Mark Delivered
                    </>
                  )}
                </button>
                <button
                  className="lr-btn-emergency"
                  onClick={() => alert('Emergency reported. Support has been notified.')}
                >
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                    <path d="M12 8v4M12 16h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  Report Emergency
                </button>
              </div>
            </div>
          </div>

          {/* ── Right column — Map ── */}
          <div className="lr-right-col">
            <div className="lr-map-card">
              <div className="lr-map-header">
                <div className="lr-section-icon" style={{ background: 'linear-gradient(135deg,#f97316,#ea580c)' }}>
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                    <polygon points="3 11 22 2 13 21 11 13 3 11" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div>
                  <h3 className="lr-section-title">Route Map</h3>
                  <p className="lr-section-sub">
                    {driverPos ? 'Live GPS active' : 'Awaiting GPS signal'}
                  </p>
                </div>
                {driverPos && (
                  <span className="lr-gps-badge">
                    <span className="lr-gps-dot" />
                    GPS Live
                  </span>
                )}
              </div>
              <div className="lr-map-viewport">
                <RouteMap driverPos={driverPos} customerPos={customerPos} />
              </div>
              {currentDelivery && (
                <div className="lr-map-footer">
                  <div className="lr-legend-item">
                    <span className="lr-legend-dot" style={{ background: '#0ea5e9' }} />
                    <span>Your location</span>
                  </div>
                  <div className="lr-legend-item">
                    <span className="lr-legend-dot" style={{ background: '#f97316' }} />
                    <span>Destination</span>
                  </div>
                  <div className="lr-legend-item">
                    <span className="lr-legend-line" />
                    <span>Route</span>
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

// ── Styles ─────────────────────────────────────────────────────────────────────
const lrStyles = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap');

.lr-root {
  font-family: 'DM Sans', 'Segoe UI', sans-serif;
  min-height: 100vh;
  background: #f1f5f9;
  padding: 32px 36px;
  box-sizing: border-box;
}

/* ── Loader ── */
.lr-loader {
  display: flex; align-items: center; justify-content: center;
  flex-direction: column; gap: 14px;
  height: 60vh; color: #64748b; font-size: 14px; font-weight: 500;
}
.lr-loader-spinner {
  width: 36px; height: 36px;
  border: 3px solid #e2e8f0;
  border-top-color: #0ea5e9;
  border-radius: 50%;
  animation: lrSpin 0.7s linear infinite;
}
@keyframes lrSpin { to { transform: rotate(360deg); } }

/* ── Error ── */
.lr-error-box {
  display: flex; flex-direction: column; align-items: center;
  justify-content: center; gap: 12px;
  height: 60vh; color: #64748b; font-size: 14px;
}
.lr-retry-btn {
  margin-top: 8px; padding: 9px 24px;
  background: linear-gradient(135deg,#0369a1,#0ea5e9);
  color: #fff; border: none; border-radius: 10px;
  font-size: 14px; font-weight: 600;
  font-family: 'DM Sans', sans-serif;
  cursor: pointer; transition: opacity 0.2s;
}
.lr-retry-btn:hover { opacity: 0.88; }

/* ── Page Header ── */
.lr-page-header {
  display: flex; align-items: flex-start; justify-content: space-between;
  margin-bottom: 32px;
}
.lr-header-eyebrow {
  font-size: 13px; font-weight: 600; color: #0ea5e9;
  margin: 0 0 4px; text-transform: uppercase; letter-spacing: 0.6px;
}
.lr-header-title {
  font-size: 28px; font-weight: 800; color: #0f172a;
  margin: 0 0 4px; letter-spacing: -0.5px;
}
.lr-header-sub {
  font-size: 13px; color: #94a3b8; margin: 0; font-weight: 500;
}
.lr-refresh-btn {
  width: 38px; height: 38px; flex-shrink: 0;
  background: #fff; border: 1px solid #e2e8f0;
  border-radius: 10px; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  color: #64748b; margin-top: 4px;
  transition: all 0.2s;
  box-shadow: 0 1px 3px rgba(0,0,0,0.06);
}
.lr-refresh-btn:hover { background: #f1f5f9; color: #0f172a; }

/* ── Two-column layout ── */
.lr-columns {
  display: grid;
  grid-template-columns: 420px 1fr;
  gap: 24px;
  align-items: flex-start;
}
.lr-left-col  { display: flex; flex-direction: column; gap: 18px; }
.lr-right-col { display: flex; flex-direction: column; gap: 18px; }

/* ── Delivery Hero Card ── */
.lr-delivery-hero {
  border-radius: 16px; overflow: hidden; position: relative;
  box-shadow: 0 4px 20px rgba(14,165,233,0.25);
}
.lr-hero-bg {
  position: absolute; inset: 0;
  background: linear-gradient(135deg, #0369a1 0%, #0ea5e9 60%, #38bdf8 100%);
  z-index: 0;
}
.lr-hero-body {
  position: relative; z-index: 1;
  padding: 24px 26px;
}
.lr-hero-top {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 18px;
}
.lr-active-badge {
  display: inline-flex; align-items: center; gap: 7px;
  background: rgba(255,255,255,0.18);
  border: 1px solid rgba(255,255,255,0.3);
  border-radius: 20px; padding: 5px 13px;
  font-size: 12px; font-weight: 700; color: #fff;
  backdrop-filter: blur(4px);
}
.lr-active-dot {
  width: 7px; height: 7px; border-radius: 50%;
  background: #4ade80;
  box-shadow: 0 0 0 3px rgba(74,222,128,0.3);
  animation: lrPulse 2s ease infinite;
  flex-shrink: 0;
}
@keyframes lrPulse {
  0%,100% { box-shadow: 0 0 0 2px rgba(74,222,128,0.3); }
  50%      { box-shadow: 0 0 0 5px rgba(74,222,128,0.1); }
}
.lr-delivery-icon-wrap {
  width: 44px; height: 44px; border-radius: 12px;
  background: rgba(255,255,255,0.18);
  border: 1px solid rgba(255,255,255,0.25);
  display: flex; align-items: center; justify-content: center;
  backdrop-filter: blur(4px);
}
.lr-hero-name {
  font-size: 24px; font-weight: 800; color: #fff;
  margin: 0 0 4px; letter-spacing: -0.4px;
  text-shadow: 0 1px 4px rgba(0,0,0,0.15);
}
.lr-hero-order {
  font-size: 12px; color: rgba(255,255,255,0.65);
  margin: 0 0 16px; font-weight: 500;
}
.lr-hero-meta { display: flex; flex-direction: column; gap: 7px; margin-bottom: 18px; }
.lr-meta-item {
  display: flex; align-items: flex-start; gap: 8px;
  font-size: 13px; color: rgba(255,255,255,0.88); font-weight: 500;
}
.lr-meta-item svg { flex-shrink: 0; margin-top: 1px; }
.lr-hero-qty {
  display: flex; align-items: center; justify-content: space-between;
  background: rgba(255,255,255,0.14);
  border: 1px solid rgba(255,255,255,0.22);
  border-radius: 10px; padding: 10px 16px;
  margin-bottom: 18px; backdrop-filter: blur(4px);
}
.lr-qty-label { font-size: 12px; font-weight: 600; color: rgba(255,255,255,0.7); }
.lr-qty-value { font-size: 16px; font-weight: 800; color: #fff; }
.lr-hero-actions { display: flex; gap: 10px; }
.lr-btn-navigate {
  flex: 1; padding: 11px 18px;
  background: #fff; color: #0369a1;
  border: none; border-radius: 10px;
  font-size: 13px; font-weight: 800;
  font-family: 'DM Sans', sans-serif;
  cursor: pointer;
  display: flex; align-items: center; justify-content: center; gap: 7px;
  box-shadow: 0 3px 10px rgba(0,0,0,0.12);
  transition: all 0.2s;
}
.lr-btn-navigate:hover { transform: translateY(-1px); box-shadow: 0 6px 16px rgba(0,0,0,0.15); }
.lr-btn-call {
  width: 44px; height: 44px; flex-shrink: 0;
  background: rgba(255,255,255,0.18);
  border: 1.5px solid rgba(255,255,255,0.35);
  border-radius: 10px; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  backdrop-filter: blur(4px); transition: all 0.2s;
}
.lr-btn-call:hover { background: rgba(255,255,255,0.28); }

/* ── No Delivery ── */
.lr-no-delivery-card {
  background: #fff; border-radius: 16px; padding: 40px 24px;
  display: flex; flex-direction: column; align-items: center; gap: 10px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.06); text-align: center;
}
.lr-no-delivery-icon {
  width: 72px; height: 72px; border-radius: 50%;
  background: #f8fafc; display: flex; align-items: center; justify-content: center;
  margin-bottom: 4px;
}
.lr-no-delivery-title { font-size: 16px; font-weight: 700; color: #475569; margin: 0; }
.lr-no-delivery-sub   { font-size: 13px; color: #94a3b8; margin: 0; font-weight: 500; }

/* ── Info Chips Row ── */
.lr-info-row {
  display: grid; grid-template-columns: repeat(3,1fr); gap: 12px;
}
.lr-info-chip {
  background: #fff; border-radius: 12px; padding: 14px 16px;
  display: flex; align-items: center; gap: 10px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.06);
  transition: transform 0.2s, box-shadow 0.2s;
}
.lr-info-chip:hover { transform: translateY(-1px); box-shadow: 0 4px 12px rgba(0,0,0,0.07); }
.lr-info-chip-icon {
  width: 32px; height: 32px; border-radius: 8px;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.lr-chip-label { font-size: 11px; font-weight: 600; color: #64748b; margin: 0; text-transform: uppercase; letter-spacing: 0.4px; }
.lr-chip-value { font-size: 13px; font-weight: 700; color: #0f172a; margin: 0; }

/* ── Card ── */
.lr-card {
  background: #fff; border-radius: 16px; padding: 22px 24px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04);
  transition: box-shadow 0.2s;
}
.lr-card:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.07); }

/* ── Section Head ── */
.lr-section-head {
  display: flex; align-items: center; gap: 14px; margin-bottom: 18px;
}
.lr-section-icon {
  width: 40px; height: 40px; border-radius: 11px; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 3px 10px rgba(0,0,0,0.14);
}
.lr-section-title { font-size: 16px; font-weight: 800; color: #0f172a; margin: 0 0 1px; }
.lr-section-sub   { font-size: 12px; color: #94a3b8; margin: 0; font-weight: 500; }

/* ── Route Empty ── */
.lr-route-empty {
  display: flex; flex-direction: column; align-items: center; gap: 8px;
  padding: 32px 16px; color: #94a3b8; font-size: 13px; font-weight: 500;
}

/* ── Route List ── */
.lr-route-list { display: flex; flex-direction: column; gap: 10px; margin-bottom: 18px; }
.lr-route-item {
  display: flex; align-items: center; gap: 14px;
  background: #f8fafc; border: 1.5px solid #f1f5f9;
  border-radius: 12px; padding: 14px 16px;
  transition: all 0.2s;
}
.lr-route-item:hover { background: #f1f5f9; transform: translateX(2px); }
.lr-route-item.active {
  background: #eff6ff; border-color: #bfdbfe;
  box-shadow: 0 2px 8px rgba(59,130,246,0.1);
}
.lr-route-num {
  width: 34px; height: 34px; border-radius: 50%; flex-shrink: 0;
  background: #fff; border: 1.5px solid #e2e8f0;
  display: flex; align-items: center; justify-content: center;
  font-size: 13px; font-weight: 700; color: #475569;
  box-shadow: 0 1px 3px rgba(0,0,0,0.06);
}
.lr-route-num.active {
  background: linear-gradient(135deg,#0369a1,#0ea5e9);
  border-color: transparent; color: #fff;
  box-shadow: 0 3px 8px rgba(14,165,233,0.3);
}
.lr-route-info { flex: 1; min-width: 0; }
.lr-route-top  { display: flex; align-items: center; gap: 8px; margin-bottom: 3px; }
.lr-route-name { font-size: 14px; font-weight: 700; color: #0f172a; }
.lr-transit-pill {
  display: inline-flex; align-items: center; gap: 4px;
  background: #eff6ff; color: #2563eb;
  font-size: 11px; font-weight: 700;
  padding: 2px 8px; border-radius: 20px;
}
.lr-route-address { font-size: 12px; color: #64748b; margin: 0; font-weight: 500;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.lr-route-qty { font-size: 13px; font-weight: 700; color: #0ea5e9; flex-shrink: 0;
  background: #e0f2fe; border-radius: 7px; padding: 3px 10px; }

/* ── Route Actions ── */
.lr-route-actions { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }

.lr-btn-delivered {
  padding: 11px 16px;
  background: linear-gradient(135deg,#16a34a,#22c55e);
  color: #fff; border: none; border-radius: 10px;
  font-size: 13px; font-weight: 700;
  font-family: 'DM Sans', sans-serif;
  cursor: pointer;
  display: flex; align-items: center; justify-content: center; gap: 7px;
  box-shadow: 0 3px 10px rgba(34,197,94,0.3);
  transition: all 0.2s;
}
.lr-btn-delivered:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 6px 16px rgba(34,197,94,0.4); }
.lr-btn-delivered:disabled { opacity: 0.65; cursor: not-allowed; transform: none; }

.lr-btn-emergency {
  padding: 11px 16px;
  background: #fff4f2; color: #dc2626;
  border: 1.5px solid #fecaca;
  border-radius: 10px;
  font-size: 13px; font-weight: 700;
  font-family: 'DM Sans', sans-serif;
  cursor: pointer;
  display: flex; align-items: center; justify-content: center; gap: 7px;
  transition: all 0.2s;
}
.lr-btn-emergency:hover { background: #dc2626; color: #fff; border-color: #dc2626; transform: translateY(-1px); box-shadow: 0 6px 16px rgba(220,38,38,0.25); }

.lr-btn-spinner {
  width: 14px; height: 14px;
  border: 2px solid rgba(255,255,255,0.4);
  border-top-color: #fff;
  border-radius: 50%;
  animation: lrSpin 0.6s linear infinite; flex-shrink: 0;
}

/* ── Map Card ── */
.lr-map-card {
  background: #fff; border-radius: 16px; overflow: hidden;
  box-shadow: 0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04);
  display: flex; flex-direction: column;
  position: sticky; top: 24px;
}
.lr-map-header {
  display: flex; align-items: center; gap: 14px;
  padding: 18px 22px; border-bottom: 1px solid #f1f5f9;
}
.lr-map-header .lr-section-title { flex: 1; }
.lr-gps-badge {
  display: inline-flex; align-items: center; gap: 6px;
  background: #f0fdf4; border: 1px solid #bbf7d0;
  border-radius: 20px; padding: 4px 12px;
  font-size: 12px; font-weight: 700; color: #16a34a;
}
.lr-gps-dot {
  width: 7px; height: 7px; border-radius: 50%; background: #22c55e;
  box-shadow: 0 0 0 2px rgba(34,197,94,0.3);
  animation: lrPulse 2s ease infinite;
}
.lr-map-viewport {
  height: 480px; position: relative; background: #f8fafc;
}
.lr-map-placeholder {
  height: 100%; display: flex; flex-direction: column;
  align-items: center; justify-content: center; gap: 12px;
  color: #64748b; font-size: 14px; font-weight: 500;
}
.lr-map-footer {
  display: flex; align-items: center; gap: 20px;
  padding: 14px 22px; border-top: 1px solid #f1f5f9;
  background: #fafcff;
}
.lr-legend-item {
  display: flex; align-items: center; gap: 7px;
  font-size: 12px; color: #64748b; font-weight: 500;
}
.lr-legend-dot {
  width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0;
}
.lr-legend-line {
  width: 20px; height: 3px; border-radius: 2px;
  background: #0ea5e9; flex-shrink: 0;
}

/* ── Responsive ── */
@media (max-width: 1100px) {
  .lr-columns { grid-template-columns: 1fr; }
  .lr-map-card { position: static; }
  .lr-map-viewport { height: 360px; }
}
@media (max-width: 768px) {
  .lr-root    { padding: 20px 16px; }
  .lr-columns { gap: 16px; }
  .lr-info-row { grid-template-columns: 1fr 1fr; }
  .lr-route-actions { grid-template-columns: 1fr; }
  .lr-header-title { font-size: 22px; }
}
@media (max-width: 480px) {
  .lr-info-row { grid-template-columns: 1fr; }
  .lr-hero-name { font-size: 20px; }
}
`;

export default LiveRoute;