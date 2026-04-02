import React, { useState, useEffect, useCallback } from 'react';
import {
  MapPin,
  Truck,
  Phone,
  Navigation,
  Clock,
  CheckCircle,
  TrendingUp,
} from 'lucide-react';
import { GoogleMap, LoadScript, Marker, Polyline } from '@react-google-maps/api';
import './LiveTracking.css';

const LiveTracking = () => {
  const [selectedTanker, setSelectedTanker] = useState(null);
  const [mapCenter, setMapCenter] = useState({
    lat: 33.9992,
    lng: 71.4656,
  });
  const [tankers, setTankers] = useState([]);
  const [activeDeliveries, setActiveDeliveries] = useState([]);
  const [stats, setStats] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [useRealMaps, setUseRealMaps] = useState(false);

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

  // Destinations - static for now
  const destinations = [
    { position: { lat: 34.0080, lng: 71.4720 }, label: 'Industrial Zone A' },
    { position: { lat: 33.9920, lng: 71.4600 }, label: 'Residential Area B' },
    { position: { lat: 34.0000, lng: 71.4640 }, label: 'Commercial District' },
    { position: { lat: 33.9960, lng: 71.4560 }, label: 'Tech Park' },
  ];

  // Initial data fetch
  useEffect(() => {
    console.log('Component mounted - fetching initial data');
    fetchInitialData();
    
    // Cleanup function
    return () => {
      console.log('Component unmounting - cleaning up');
    };
  }, []); // Empty dependency array - runs once on mount

  // Real-time updates - fetch tanker locations every 10 seconds
  useEffect(() => {
    if (!isLoading) {
      console.log('Starting real-time updates');
      const interval = setInterval(() => {
        fetchTankerLocations();
      }, 10000); // Update every 10 seconds

      // Cleanup interval on unmount
      return () => {
        console.log('Stopping real-time updates');
        clearInterval(interval);
      };
    }
  }, [isLoading]); // Depends on isLoading

  // Update selected tanker when tankers data changes
  useEffect(() => {
    if (selectedTanker && tankers.length > 0) {
      const updatedTanker = tankers.find(t => t.id === selectedTanker.id);
      if (updatedTanker) {
        setSelectedTanker(updatedTanker);
        console.log(`Updated selected tanker: ${updatedTanker.id}`);
      }
    }
  }, [tankers]); // Depends on tankers array

  // Fetch initial data
  const fetchInitialData = async () => {
    try {
      setIsLoading(true);
      console.log('Fetching initial data...');

      // Simulate API call - replace with actual API endpoint
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Initial tankers data
      const initialTankers = [
        {
          id: 'TK-102',
          position: { lat: 34.0050, lng: 71.4700 },
          driver: 'Mike Johnson',
          orderId: 'ORD-2461',
          customer: 'Robert Wilson',
          destination: 'Business Park, Sector 15',
          eta: '8 mins',
          status: 'In Transit',
        },
        {
          id: 'TK-103',
          position: { lat: 33.9980, lng: 71.4620 },
          driver: 'David Brown',
          orderId: 'ORD-2462',
          customer: 'Emily Chen',
          destination: 'Green Valley Complex',
          eta: '12 mins',
          status: 'In Transit',
        },
        {
          id: 'TK-104',
          position: { lat: 34.0020, lng: 71.4680 },
          driver: 'Sarah Williams',
          orderId: 'ORD-2457',
          customer: 'Green Valley Resort',
          destination: 'Valley Road, Sector 12',
          eta: 'Arrived',
          status: 'Delivering',
        },
        {
          id: 'TK-108',
          position: { lat: 33.9940, lng: 71.4580 },
          driver: 'James Miller',
          orderId: 'ORD-2463',
          customer: 'Tech Innovations',
          destination: 'Innovation Hub',
          eta: '5 mins',
          status: 'In Transit',
        },
      ];

      setTankers(initialTankers);

      // Active deliveries
      const initialDeliveries = [
        {
          id: 'ORD-2463',
          customer: 'Robert Wilson',
          tankerId: 'TK-102',
          eta: '8 mins',
          status: 'In Transit',
          arrived: false,
        },
        {
          id: 'ORD-2457',
          tankerId: 'TK-104',
          customer: 'Sarah Williams',
          status: 'Delivering',
          arrived: true,
        },
      ];

      setActiveDeliveries(initialDeliveries);

      // Statistics
      const initialStats = [
        {
          icon: Truck,
          value: '4',
          label: 'Active Tankers',
          color: '#2196F3',
          bgColor: '#E3F2FD',
        },
        {
          icon: CheckCircle,
          value: '12',
          label: 'Completed Today',
          color: '#4CAF50',
          bgColor: '#E8F5E9',
        },
        {
          icon: Clock,
          value: '18 min',
          label: 'Avg. Delivery Time',
          color: '#FF9800',
          bgColor: '#FFF3E0',
        },
        {
          icon: MapPin,
          value: '6',
          label: 'Pending Pickups',
          color: '#9C27B0',
          bgColor: '#F3E5F5',
        },
      ];

      setStats(initialStats);
      setIsLoading(false);
      console.log('Initial data loaded successfully');

    } catch (error) {
      console.error('Error fetching initial data:', error);
      setIsLoading(false);
    }
  };

  // Fetch tanker locations (for real-time updates)
  const fetchTankerLocations = useCallback(async () => {
    try {
      console.log('Updating tanker locations...');

      // Simulate API call - replace with actual API endpoint
      // const response = await fetch('YOUR_API_URL/tankers/locations');
      // const data = await response.json();

      // Simulate position updates (small random movements)
      setTankers(prevTankers => 
        prevTankers.map(tanker => ({
          ...tanker,
          position: {
            lat: tanker.position.lat + (Math.random() - 0.5) * 0.001,
            lng: tanker.position.lng + (Math.random() - 0.5) * 0.001,
          },
        }))
      );

      console.log('Tanker locations updated');

    } catch (error) {
      console.error('Error updating tanker locations:', error);
    }
  }, []); // No dependencies - function doesn't change

  // Sample route for selected tanker
  const getRouteCoordinates = useCallback((tanker) => {
    if (!tanker) return [];
    
    return [
      tanker.position,
      { lat: tanker.position.lat + 0.005, lng: tanker.position.lng + 0.005 },
      { lat: tanker.position.lat + 0.010, lng: tanker.position.lng + 0.008 },
    ];
  }, []); // No dependencies

  const handleTankerSelect = useCallback((tanker) => {
    console.log('Tanker selected:', tanker.id);
    setSelectedTanker(tanker);
    setMapCenter(tanker.position);
  }, []); // No dependencies

  const handleContactDriver = useCallback((tanker) => {
    console.log('Calling driver:', tanker.driver);
    alert(`Calling ${tanker.driver}...`);
    // In production, implement actual phone call functionality
  }, []); // No dependencies

  const handleViewRoute = useCallback((tanker) => {
    console.log('Viewing route for:', tanker.id);
    alert(`Opening route for ${tanker.id}...`);
    // In production, implement route viewing functionality
  }, []); // No dependencies

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
            onLoad={handleMapLoad}
            onError={handleMapError}
          >
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              center={mapCenter}
              zoom={13}
              options={mapOptions}
            >
              {/* Tanker Markers */}
              {tankers.map((tanker) => (
                <Marker
                  key={tanker.id}
                  position={tanker.position}
                  icon={{
                    path: window.google?.maps?.SymbolPath?.CIRCLE,
                    scale: 12,
                    fillColor: selectedTanker?.id === tanker.id ? '#FF5722' : '#2196F3',
                    fillOpacity: 1,
                    strokeColor: '#fff',
                    strokeWeight: 3,
                  }}
                  onClick={() => handleTankerSelect(tanker)}
                  label={{
                    text: tanker.id,
                    color: '#424242',
                    fontSize: '11px',
                    fontWeight: '600',
                  }}
                />
              ))}

              {/* Destination Markers */}
              {destinations.map((dest, index) => (
                <Marker
                  key={`dest-${index}`}
                  position={dest.position}
                  icon={{
                    url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(
                      '<svg xmlns="http://www.w3.org/2000/svg" width="30" height="40" viewBox="0 0 24 24" fill="#4CAF50"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>'
                    ),
                  }}
                />
              ))}

              {/* Route Polyline */}
              {selectedTanker && (
                <Polyline
                  path={getRouteCoordinates(selectedTanker)}
                  options={{
                    strokeColor: '#2196F3',
                    strokeOpacity: 0.8,
                    strokeWeight: 3,
                    geodesic: true,
                    icons: [{
                      icon: { path: 'M 0,-1 0,1', strokeOpacity: 1, scale: 2 },
                      offset: '0',
                      repeat: '10px',
                    }],
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
              <span className="legend-text">Active Tanker</span>
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

              {activeDeliveries.map((delivery, index) => {
                const tanker = tankers.find((t) => t.id === delivery.tankerId);
                return (
                  <div
                    key={index}
                    className="delivery-card"
                    onClick={() => tanker && handleTankerSelect(tanker)}
                  >
                    <div className="delivery-header">
                      <div>
                        <p className="delivery-customer">{delivery.customer}</p>
                        <p className="delivery-order-id">{delivery.id}</p>
                      </div>
                      {delivery.eta && (
                        <div className="eta-badge">
                          <Clock size={12} />
                          <span>{delivery.eta}</span>
                        </div>
                      )}
                    </div>

                    <div className="delivery-footer">
                      <div className="tanker-badge">
                        <Truck size={14} />
                        <span>{delivery.tankerId}</span>
                      </div>
                      <div
                        className={`status-badge ${
                          delivery.arrived ? 'arrived' : ''
                        }`}
                      >
                        {delivery.status}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Selected Tanker Details */}
            {selectedTanker && (
              <div className="tanker-details">
                <h2 className="sidebar-title">Tanker Details</h2>

                <div className="detail-row">
                  <span className="detail-label">Tanker ID</span>
                  <span className="detail-value tanker-id">
                    {selectedTanker.id}
                  </span>
                </div>

                <div className="detail-row">
                  <span className="detail-label">Driver</span>
                  <span className="detail-value">{selectedTanker.driver}</span>
                </div>

                <div className="detail-row">
                  <span className="detail-label">Order ID</span>
                  <span className="detail-value order-id">
                    {selectedTanker.orderId}
                  </span>
                </div>

                <div className="destination-detail">
                  <MapPin size={16} color="#4CAF50" />
                  <div className="destination-info">
                    <span className="destination-label">Destination</span>
                    <span className="destination-value">
                      {selectedTanker.destination}
                    </span>
                  </div>
                </div>

                <div className="eta-detail">
                  <Clock size={16} color="#FF9800" />
                  <div className="eta-info">
                    <span className="eta-label">ETA</span>
                    <span className="eta-value">{selectedTanker.eta}</span>
                  </div>
                </div>

                <button
                  className="contact-button"
                  onClick={() => handleContactDriver(selectedTanker)}
                >
                  <Phone size={18} />
                  <span>Contact Driver</span>
                </button>

                <button
                  className="route-button"
                  onClick={() => handleViewRoute(selectedTanker)}
                >
                  <Navigation size={18} />
                  <span>View Route</span>
                </button>
              </div>
            )}
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