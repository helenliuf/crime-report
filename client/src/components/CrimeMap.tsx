import React from "react";
import { GoogleMap, LoadScript, Marker, InfoWindow } from "@react-google-maps/api";
import { useNavigate } from "react-router-dom";

// Define the type for crime reports
interface CrimeReport {
  id: number;
  lat: number;
  lng: number;
  type: string;
  severity: string;
}

const crimeReports: CrimeReport[] = [
  { id: 1, lat: 42.3915, lng: -72.5266, type: "Theft", severity: "Medium" },
  { id: 2, lat: 42.389, lng: -72.528, type: "Assault", severity: "High" },
];

const mapContainerStyle = {
  width: "100%",
  height: "500px",
};

const defaultCenter = { lat: 42.3915, lng: -72.5266 };

const CrimeMap: React.FC = () => {
  const navigate = useNavigate();
  const [selectedCrime, setSelectedCrime] = React.useState<CrimeReport | null>(null);
  const [isAddingMarker, setIsAddingMarker] = React.useState(false);
  const [markers, setMarkers] = React.useState<CrimeReport[]>(crimeReports);
  const [center, setCenter] = React.useState(defaultCenter);
  const [currentLocation, setCurrentLocation] = React.useState<google.maps.LatLngLiteral | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = React.useState(false);

  const handleMapClick = (event: google.maps.MapMouseEvent) => {
    if (!isAddingMarker || !event.latLng) return;

    const newMarker: CrimeReport = {
      id: markers.length + 1,
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
      type: "New Crime",
      severity: "Low",
    };

    setMarkers([...markers, newMarker]);
    setIsAddingMarker(false);

    // Navigate to report form with the coordinates
    navigate('/report', {
      state: {
        coordinates: {
          lat: event.latLng.lat(),
          lng: event.latLng.lng()
        }
      }
    });
  };

  const getCurrentLocation = () => {
    setIsLoadingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setCurrentLocation(newLocation);
          setCenter(newLocation);
          setIsLoadingLocation(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          setIsLoadingLocation(false);
          alert("Unable to get your location. Please check your location settings.");
        }
      );
    } else {
      setIsLoadingLocation(false);
      alert("Geolocation is not supported by your browser");
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '10px', display: 'flex', gap: '10px' }}>
        <button 
          onClick={() => setIsAddingMarker(!isAddingMarker)}
          style={{
            padding: '8px 16px',
            backgroundColor: isAddingMarker ? '#ff4444' : '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          {isAddingMarker ? 'Cancel Adding Marker' : 'Add New Marker'}
        </button>
        <button 
          onClick={getCurrentLocation}
          disabled={isLoadingLocation}
          style={{
            padding: '8px 16px',
            backgroundColor: '#2196F3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: isLoadingLocation ? 'not-allowed' : 'pointer',
            opacity: isLoadingLocation ? 0.7 : 1
          }}
        >
          {isLoadingLocation ? 'Getting Location...' : 'Use My Location'}
        </button>
      </div>
      
      <LoadScript googleMapsApiKey="AIzaSyAHV0iE6up6dCL99fxP2rCuX96At7_5CEA">
        <GoogleMap 
          mapContainerStyle={mapContainerStyle} 
          center={center} 
          zoom={15}
          onClick={handleMapClick}
        >
          {markers.map((crime) => (
            <Marker
              key={crime.id}
              position={{ lat: crime.lat, lng: crime.lng }}
              onClick={() => setSelectedCrime(crime)}
            />
          ))}

          {currentLocation && (
            <Marker
              position={currentLocation}
              icon={{
                path: google.maps.SymbolPath.CIRCLE,
                scale: 12,
                fillColor: "#4285F4",
                fillOpacity: 0.8,
                strokeColor: "#ffffff",
                strokeWeight: 3,
              }}
            />
          )}

          {selectedCrime && (
            <InfoWindow
              position={{ lat: selectedCrime.lat, lng: selectedCrime.lng }}
              onCloseClick={() => setSelectedCrime(null)}
            >
              <div>
                <h4>{selectedCrime.type}</h4>
                <p>Severity: {selectedCrime.severity}</p>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </LoadScript>
    </div>
  );
};

export default CrimeMap;