import {
    GoogleMap, Marker, Polyline, useJsApiLoader
  } from "@react-google-maps/api";
  import { useEffect, useState } from "react";
  
  const containerStyle = { width: "100%", height: "320px", borderRadius: "10px" };
  const center = { lat: 28.6139, lng: 77.2090 };

  const mapStyles = [
    {
      featureType: "all",
      elementType: "geometry",
      stylers: [{ color: "#0f172a" }]
    },
    {
      featureType: "road",
      elementType: "geometry",
      stylers: [{ color: "#1e293b" }]
    },
    {
      featureType: "water",
      elementType: "geometry",
      stylers: [{ color: "#020617" }]
    },
    {
      elementType: "labels.text.fill",
      stylers: [{ color: "#94a3b8" }]
    }
  ];
  
  export default function MapView({ stops = [], beforeRoute = [] }) {
    const { isLoaded } = useJsApiLoader({
      googleMapsApiKey: import.meta.env.VITE_MAPS_KEY
    });
  
    const [vehicleIndex, setVehicleIndex] = useState(0);
  
    const validStops = stops.filter(s => s.lat && s.lng);
    const validBefore = beforeRoute.filter(s => s.lat && s.lng);
  
    // 🔥 KEY LOGIC
    const optimized = validBefore.length > 1;
    const activeRoute = optimized ? validStops : validStops;
  
    const path = activeRoute.map(s => ({ lat: s.lat, lng: s.lng }));
  
    useEffect(() => {
      if (path.length < 2) return;
      const id = setInterval(() => {
        setVehicleIndex(p => (p + 1) % path.length);
      }, 500);
      return () => clearInterval(id);
    }, [path]);
  
    if (!isLoaded) {
      return (
        <div className="card flex items-center justify-center h-[320px]">
          <p className="text-xs text-[var(--text-muted)]">Loading map...</p>
        </div>
      );
    }
  
    return (
      <div className="card overflow-hidden">
  
        {/* HEADER */}
        <div className="px-4 py-2 flex justify-between items-center">
          <span className="text-xs font-semibold">Route Map</span>
  
          <span className="text-[10px] text-[var(--text-muted)]">
            {optimized ? "Optimized Route" : "Original Route"}
          </span>
        </div>
  
        {/* MAP */}
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={11}
          options={{
            disableDefaultUI: true,
            zoomControl: true,
            styles: mapStyles // 👇 cleaner UI
          }}
        >
          {/* ONLY ONE ROUTE */}
          {path.length > 1 && (
            <Polyline
              path={path}
              options={{
                strokeColor: optimized ? "#22c55e" : "#3b82f6",
                strokeWeight: 4,
                strokeOpacity: 0.9
              }}
            />
          )}
  
          {/* MARKERS */}
          {activeRoute.map((s, i) => (
            <Marker key={i} position={s} label={`${s.id}`} />
          ))}
  
          {/* MOVING VEHICLE */}
          {path.length > 0 && window.google && (
            <Marker
              position={path[vehicleIndex]}
              icon={{
                url: "https://maps.google.com/mapfiles/kml/shapes/truck.png",
                scaledSize: new window.google.maps.Size(30, 30)
              }}
            />
          )}
        </GoogleMap>
      </div>
    );
  }