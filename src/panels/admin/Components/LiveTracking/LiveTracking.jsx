import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  MapPin,
  Truck,
  Phone,
  Navigation,
  Clock,
  CheckCircle,
} from 'lucide-react';
import { GoogleMap, LoadScript, Marker, Polyline } from '@react-google-maps/api';
import { io } from 'socket.io-client';
import adminApi from '../../../../shared/api/adminApi';
import './LiveTracking.css';

const SOCKET_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1')
  .replace(/\/api\/v\d+\/?$/, '');

const LiveTracking = () => {
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [mapCenter, setMapCenter] = useState({
    lat: 33.9992,
    lng: 71.4656,
  });
  const [activeDeliveries, setActiveDeliveries] = useState([]);
  const [stats, setStats] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [routePath, setRoutePath] = useState([]);
  const socketRef = useRef(null);
  const subscribedOrdersRef = useRef([]);
  const routeRequestIdRef = useRef(0);

  // Google Maps API Key - Replace with your actual key
  const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'YOUR_GOOGLE_MAPS_API_KEY';

  // Map container style
  const mapContainerStyle = {
    width: '100%',
    height: '100%',
  };

  // Map options
  const mapOptions = {
    disableDefaultUI: false,
    zoomControl: true,
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: true,
  };

  // Initial data fetch + WebSocket setup on mount
  useEffect(() => {
    fetchInitialData();

    return () => {
      // Unsubscribe all orders and disconnect socket on unmount
      if (socketRef.current) {
        subscribedOrdersRef.current.forEach((orderId) => {
          socketRef.current.emit('unsubscribe-order', { orderId });
        });
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, []);

  // Update selected delivery when activeDeliveries data changes
  useEffect(() => {
    if (selectedDelivery && activeDeliveries.length > 0) {
      const updated = activeDeliveries.find(d => d.orderId === selectedDelivery.orderId);
      if (updated) {
        setSelectedDelivery(updated);
      }
    }
  }, [activeDeliveries]);

  // Set up WebSocket after initial data is loaded
  const setupWebSocket = useCallback((orderIds) => {
    if (socketRef.current) return; // already connected

    const socket = io(`${SOCKET_URL}/tracking`);
    socketRef.current = socket;

    socket.on('connect', () => {
      // Subscribe to each active order
      orderIds.forEach((orderId) => {
        socket.emit('subscribe-order', { orderId });
      });
      subscribedOrdersRef.current = orderIds;
    });

    // Real-time driver location updates
    socket.on('location-update', ({ orderId, driverId, lat, lng }) => {
      console.log(`Location update for order ${orderId}: (${lat}, ${lng})`);
      setActiveDeliveries((prev) =>
        prev.map((delivery) =>
          delivery.orderId === orderId
            ? { ...delivery, driverPosition: { lat, lng } }
            : delivery
        )
      );
    });

    // Real-time order status updates
    socket.on('status-update', ({ orderId, status }) => {
      setActiveDeliveries((prev) =>
        prev.map((delivery) =>
          delivery.orderId === orderId
            ? { ...delivery, status, arrived: status === 'out-for-delivery' }
            : delivery
        )
      );
    });

    socket.on('connect_error', (err) => {
      console.error('WebSocket connection error:', err.message);
    });
  }, []);

  // Map API response to component data model
  const mapApiResponse = (data) => {
    const { activeDeliveries: deliveries, summary } = data;

    const mappedDeliveries = deliveries.map((delivery) => ({
      id: delivery.orderNumber,
      orderId: delivery.orderId,
      customer: delivery.customerName,
      driverName: delivery.driver?.name || '—',
      driverPhone: delivery.driver?.phone || '—',
      driverId: delivery.driver?.id || null,
      driverPosition: delivery.driver?.currentLocation
        ? { lat: delivery.driver.currentLocation.lat, lng: delivery.driver.currentLocation.lng }
        : null,
      eta: delivery.eta || '—',
      status: delivery.status,
      arrived: delivery.status === 'out-for-delivery',
      destination: `${delivery.deliveryAddress.street}, ${delivery.deliveryAddress.city}`,
      destinationCoords: delivery.deliveryAddress.coordinates ?? null,
    }));

    return { mappedDeliveries, totalActive: String(summary.totalActive) };
  };

  // Build stats array from monitoring + order-stats data
  const buildStats = (totalActive, orderStats) => [
    {
      icon: Truck,
      value: totalActive,
      label: 'Active Drivers',
      color: '#2196F3',
      bgColor: '#E3F2FD',
    },
    {
      icon: CheckCircle,
      value: orderStats ? String(orderStats.todayCompleted) : '—',
      label: 'Completed Today',
      color: '#4CAF50',
      bgColor: '#E8F5E9',
    },
    {
      icon: Clock,
      value: '—',
      label: 'Avg. Delivery Time',
      color: '#FF9800',
      bgColor: '#FFF3E0',
    },
    {
      icon: MapPin,
      value: orderStats ? String(orderStats.pendingPickups) : '—',
      label: 'Pending Pickups',
      color: '#9C27B0',
      bgColor: '#F3E5F5',
    },
  ];

  // Fetch initial data
  const fetchInitialData = async () => {
    try {
      setIsLoading(true);

      const [monitoringRes, orderStatsRes] = await Promise.all([
        adminApi.getLiveMonitoring(),
        adminApi.getOrderStats().catch(() => null), // non-blocking if it fails
      ]);

      const monitoringData = monitoringRes.data;
      const orderStats = orderStatsRes?.data ?? null;

      const { mappedDeliveries, totalActive } = mapApiResponse(monitoringData);

      setActiveDeliveries(mappedDeliveries);
      setStats(buildStats(totalActive, orderStats));

      const firstWithDriver = mappedDeliveries.find(d => d.driverPosition);
      if (firstWithDriver) {
        setMapCenter(firstWithDriver.driverPosition);
      }

      // Start WebSocket for real-time updates
      const orderIds = mappedDeliveries.map((d) => d.orderId).filter(Boolean);
      setupWebSocket(orderIds);

      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching live monitoring data:', error);
      setIsLoading(false);
    }
  };

  const handleDeliverySelect = useCallback((delivery) => {
    setSelectedDelivery(delivery);
    if (delivery.driverPosition) {
      setMapCenter(delivery.driverPosition);
    }
    setRoutePath([]); // clear previous route when switching delivery
  }, []);

  const handleContactDriver = useCallback((delivery) => {
    alert(`Calling ${delivery.driverName}...`);
  }, []);

  // Fallback: fetch route from OSRM (free, no key required)
  const fetchOsrmRoute = useCallback(async (origin, destination, requestId) => {
    try {
      const url =
        `https://router.project-osrm.org/route/v1/driving/` +
        `${origin.lng},${origin.lat};${destination.lng},${destination.lat}` +
        `?overview=full&geometries=geojson`;
      const res = await fetch(url);
      const data = await res.json();
      if (routeRequestIdRef.current !== requestId) return; // stale — discard
      if (data.code === 'Ok' && data.routes?.[0]) {
        const path = data.routes[0].geometry.coordinates.map(([lng, lat]) => ({ lat, lng }));
        setRoutePath(path);
      } else {
        console.error('OSRM returned no route:', data.code);
      }
    } catch (err) {
      console.error('OSRM route fetch failed:', err);
    }
  }, []);

  const handleViewRoute = useCallback((delivery) => {
    if (!delivery?.destinationCoords?.lat) {
      alert('Delivery address coordinates are not available for this order.');
      return;
    }
    if (!delivery?.driverPosition) {
      alert('Driver location is not available for this order.');
      return;
    }

    routeRequestIdRef.current += 1;
    const requestId = routeRequestIdRef.current;
    setRoutePath([]); // clear previous route before fetching new one

    const origin = delivery.driverPosition;
    const destination = delivery.destinationCoords;

    // Try Google Directions first; fall back to OSRM if unavailable or failed
    if (window.google?.maps?.DirectionsService) {
      const directionsService = new window.google.maps.DirectionsService();
      directionsService.route(
        {
          origin,
          destination,
          travelMode: window.google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (routeRequestIdRef.current !== requestId) return; // stale — discard
          if (status === window.google.maps.DirectionsStatus.OK) {
            const path = result.routes[0].overview_path.map((p) => ({
              lat: p.lat(),
              lng: p.lng(),
            }));
            setRoutePath(path);
          } else {
            console.warn('Google Directions failed, falling back to OSRM:', status);
            fetchOsrmRoute(origin, destination, requestId);
          }
        }
      );
    } else {
      fetchOsrmRoute(origin, destination, requestId);
    }
  }, [fetchOsrmRoute]);

  const handleMapLoad = useCallback(() => {
    console.log('Google Maps loaded successfully');
    setMapLoaded(true);
  }, []);

  const handleMapError = useCallback((error) => {
    console.error('Google Maps loading error:', error);
    alert('Error loading Google Maps. Please check your API key and internet connection.');
  }, []);

  // Loading state
  if (isLoading) {
    return (
      <div className="live-tracking">
        <div className="tracking-header">
          <div>
            <h1 className="header-title">Live Tracking</h1>
            <p className="header-subtitle">Real-time delivery monitoring</p>
          </div>
        </div>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p className="loading-text">Loading tracking data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="live-tracking">
      {/* Header */}
      <div className="tracking-header">
        <div>
          <h1 className="header-title">Live Tracking</h1>
          <p className="header-subtitle">Real-time delivery monitoring</p>
        </div>
        <div className="live-indicator">
          <span className="live-dot"></span>
          <span className="live-text">Live</span>
        </div>
      </div>

      <div className="tracking-content">
        {/* Map Section */}
        <div className="map-section">
          {GOOGLE_MAPS_API_KEY === 'YOUR_GOOGLE_MAPS_API_KEY' || !GOOGLE_MAPS_API_KEY ? (
            <div style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#f0f4f8',
              borderRadius: '8px',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {/* Demo Map Background */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: '#e8f4f8',
                backgroundImage: `
                  linear-gradient(45deg, #f0f4f8 25%, transparent 25%),
                  linear-gradient(-45deg, #f0f4f8 25%, transparent 25%),
                  linear-gradient(45deg, transparent 75%, #f0f4f8 75%),
                  linear-gradient(-45deg, transparent 75%, #f0f4f8 75%)
                `,
                backgroundSize: '40px 40px',
                backgroundPosition: '0 0, 0 20px, 20px -20px, -20px 0px',
                opacity: 0.3,
              }}></div>

              {/* Demo Map Container */}
              <div style={{
                position: 'relative',
                zIndex: 1,
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column'
              }}>
                <div style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  padding: '40px',
                  borderRadius: '12px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                  textAlign: 'center',
                  maxWidth: '550px'
                }}>
                  <div style={{ fontSize: '48px', marginBottom: '15px' }}>🗺️</div>
                  <h3 style={{ color: '#d32f2f', marginBottom: '10px', fontSize: '20px', fontWeight: 'bold' }}>
                    Demo Map Mode Active
                  </h3>
                  <p style={{ color: '#666', marginBottom: '20px', lineHeight: '1.6', fontSize: '14px' }}>
                    The live tracking map is in demo mode with sample data. To use the real Google Maps:
                  </p>
                  <div style={{ 
                    backgroundColor: '#f5f5f5', 
                    padding: '15px', 
                    borderRadius: '6px',
                    marginBottom: '20px',
                    textAlign: 'left',
                    fontSize: '12px',
                    lineHeight: '1.8'
                  }}>
                    <strong style={{ color: '#333', display: 'block', marginBottom: '8px' }}>✓ Get API Key:</strong>
                    <ol style={{ color: '#666', paddingLeft: '20px', margin: 0 }}>
                      <li>Visit <a href="https://console.cloud.google.com/" target="_blank" rel="noopener noreferrer" style={{color: '#1976d2', textDecoration: 'none'}}>Google Cloud Console</a></li>
                      <li>Create project → Enable "Maps JavaScript API"</li>
                      <li>Credentials → Create API Key</li>
                      <li>Update .env: <code style={{color: '#d32f2f'}}>VITE_GOOGLE_MAPS_API_KEY=key</code></li>
                    </ol>
                  </div>
                  <p style={{ color: '#4caf50', fontSize: '13px', fontWeight: 'bold', marginTop: '15px' }}>
                    ℹ️ All features work with demo data below
                  </p>
                </div>

                {/* Demo Map Visual */}
                <svg width="300" height="250" style={{marginTop: '20px', opacity: 0.3}} viewBox="0 0 300 250">
                  <rect width="300" height="250" fill="#e3f2fd" stroke="#90caf9" strokeWidth="2"/>
                  <circle cx="80" cy="100" r="15" fill="#2196F3" opacity="0.7"/>
                  <circle cx="150" cy="120" r="15" fill="#2196F3" opacity="0.7"/>
                  <circle cx="220" cy="80" r="15" fill="#2196F3" opacity="0.7"/>
                  <circle cx="100" cy="200" r="10" fill="#4CAF50" opacity="0.7"/>
                  <circle cx="200" cy="190" r="10" fill="#4CAF50" opacity="0.7"/>
                  <polyline points="80,100 150,120 220,80" stroke="#2196F3" strokeWidth="2" fill="none" opacity="0.5"/>
                </svg>
              </div>
            </div>
          ) : (
            <>
          <LoadScript 
            googleMapsApiKey={GOOGLE_MAPS_API_KEY}
            libraries={["places"]}
            onLoad={handleMapLoad}
            onError={handleMapError}
          >
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              center={mapCenter}
              zoom={13}
              options={mapOptions}
            >
              {/* Driver Markers */}
              {activeDeliveries
                .filter((d) => d.status === 'out-for-delivery' && d.driverPosition)
                .map((d) => (
                <Marker
                  key={`driver-${d.orderId}`}
                  position={d.driverPosition}
                  title={`Driver: ${d.driverName}\nOrder: ${d.id}\nCustomer: ${d.customer}`}
                  icon={{
                    path: window.google?.maps?.SymbolPath?.CIRCLE,
                    scale: 12,
                    fillColor: selectedDelivery?.orderId === d.orderId ? '#FF5722' : '#2196F3',
                    fillOpacity: 1,
                    strokeColor: '#fff',
                    strokeWeight: 3,
                  }}
                  onClick={() => handleDeliverySelect(d)}
                  label={{
                    text: d.driverName.charAt(0),
                    color: '#fff',
                    fontSize: '11px',
                    fontWeight: '600',
                  }}
                />
              ))}

              {/* Destination Markers — real delivery addresses from API */}
              {activeDeliveries
                .filter((d) => d.status === 'out-for-delivery' && d.destinationCoords?.lat && d.destinationCoords?.lng)
                .map((d, index) => (
                  <Marker
                    key={`dest-${index}`}
                    position={d.destinationCoords}
                    title={`Order: ${d.id}\nCustomer: ${d.customer}\nDestination: ${d.destination}`}
                    icon={{
                      url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(
                        '<svg xmlns="http://www.w3.org/2000/svg" width="30" height="40" viewBox="0 0 24 24" fill="#4CAF50"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>'
                      ),
                    }}
                  />
                ))
              }

              {/* Route — Google Directions if available, OSRM as fallback */}
              {routePath.length > 0 && (
                <Polyline
                  path={routePath}
                  options={{
                    strokeColor: '#2196F3',
                    strokeOpacity: 0.85,
                    strokeWeight: 4,
                    geodesic: true,
                  }}
                />
              )}
            </GoogleMap>
          </LoadScript>
            </>
          )}

          {/* Map Legend */}
          <div className="map-legend">
            <h3 className="legend-title">Legend</h3>
            <div className="legend-item">
              <div className="legend-icon tanker-icon">
                <Truck size={16} />
              </div>
              <span className="legend-text">Driver</span>
            </div>
            <div className="legend-item">
              <div className="legend-icon destination-icon">
                <MapPin size={16} />
              </div>
              <span className="legend-text">Destination</span>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="tracking-sidebar">
          <div className="sidebar-scroll">
            {/* Active Deliveries */}
            <div className="sidebar-section">
              <h2 className="sidebar-title">Active Deliveries</h2>

              {activeDeliveries.filter((d) => d.status === 'out-for-delivery').map((delivery, index) => {
                const isSelected = selectedDelivery?.orderId === delivery.orderId;
                return (
                  <React.Fragment key={index}>
                    <div
                      className={`delivery-card${isSelected ? ' selected' : ''}`}
                      onClick={() => handleDeliverySelect(delivery)}
                    >
                      <div className="delivery-header">
                        <div>
                          <p className="delivery-customer">{delivery.customer}</p>
                          <p className="delivery-order-id">{delivery.id}</p>
                        </div>
                        {delivery.eta && delivery.eta !== '—' && (
                          <div className="eta-badge">
                            <Clock size={12} />
                            <span>{delivery.eta}</span>
                          </div>
                        )}
                      </div>

                      <div className="delivery-footer">
                        <div className={`status-badge ${delivery.arrived ? 'arrived' : ''}`}>
                          {delivery.status}
                        </div>
                      </div>
                    </div>

                    {/* Inline Order Details — shown below the selected card */}
                    {isSelected && (
                      <div className="tanker-details inline-tanker-details">
                        <h2 className="sidebar-title">Order Details</h2>

                        <div className="detail-row">
                          <span className="detail-label">Order ID</span>
                          <span className="detail-value order-id">{delivery.id}</span>
                        </div>

                        <div className="detail-row">
                          <span className="detail-label">Driver</span>
                          <span className="detail-value">{delivery.driverName}</span>
                        </div>

                        <div className="detail-row">
                          <span className="detail-label">Phone</span>
                          <span className="detail-value">{delivery.driverPhone}</span>
                        </div>

                        <div className="destination-detail">
                          <MapPin size={16} color="#4CAF50" />
                          <div className="destination-info">
                            <span className="destination-label">Destination</span>
                            <span className="destination-value">{delivery.destination}</span>
                          </div>
                        </div>

                        <div className="eta-detail">
                          <Clock size={16} color="#FF9800" />
                          <div className="eta-info">
                            <span className="eta-label">ETA</span>
                            <span className="eta-value">{delivery.eta}</span>
                          </div>
                        </div>

                        <button
                          className="contact-button"
                          onClick={() => handleContactDriver(delivery)}
                        >
                          <Phone size={18} />
                          <span>Contact Driver</span>
                        </button>

                        <button
                          className="route-button"
                          onClick={() => handleViewRoute(delivery)}
                        >
                          <Navigation size={18} />
                          <span>View Route</span>
                        </button>
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Statistics */}
      <div className="stats-bar">
        {stats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <div key={index} className="stat-item">
              <div
                className="stat-icon"
                style={{ backgroundColor: stat.bgColor }}
              >
                <IconComponent size={24} color={stat.color} />
              </div>
              <div className="stat-info">
                <p className="stat-value">{stat.value}</p>
                <p className="stat-label">{stat.label}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LiveTracking;