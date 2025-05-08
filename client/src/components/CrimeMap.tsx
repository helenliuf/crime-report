import React from "react";
import { GoogleMap, LoadScript, Marker, InfoWindow } from "@react-google-maps/api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Define the type for crime reports
interface CrimeReport {
  _id: string;
  userId: string;
  description: string;
  location: {
    type: string;
    coordinates: [number, number]; // [longitude, latitude]
  };
  status: "Pending" | "Verified" | "Resolved";
  createdAt: string;
}

const mapContainerStyle = {
  width: "100%",
  height: "500px",
};

const defaultCenter = { lat: 42.3915, lng: -72.5266 };

const CrimeMap: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedCrime, setSelectedCrime] = React.useState<CrimeReport | null>(null);
  const [isAddingMarker, setIsAddingMarker] = React.useState(false);
  const [markers, setMarkers] = React.useState<CrimeReport[]>([]);
  const [center, setCenter] = React.useState(defaultCenter);
  const [currentLocation, setCurrentLocation] = React.useState<google.maps.LatLngLiteral | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Fetch crime reports from the backend
  const fetchCrimeReports = async () => {
    try {
      setError(null);
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Please log in to view crime reports');
      }

      const response = await fetch('http://localhost:8080/api/crime', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });

      if (response.status === 401) {
        throw new Error('Please log in to view crime reports');
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch crime reports');
      }

      const data = await response.json();
      setMarkers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while fetching crime reports');
      console.error('Error fetching crime reports:', err);
    }
  };

  // Fetch crime reports when component mounts
  React.useEffect(() => {
    if (user) {
      fetchCrimeReports();
    }
  }, [user]);

  const handleMapClick = (event: google.maps.MapMouseEvent) => {
    if (!isAddingMarker || !event.latLng) return;

    const newMarker = {
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    };

    setIsAddingMarker(false);

    // Navigate to report form with the coordinates
    navigate('/report', {
      state: {
        coordinates: newMarker
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

  if (!user) {
    return <div>Please log in to view the crime map.</div>;
  }

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

      {error && (
        <div style={{ color: 'red', marginBottom: '10px', padding: '10px', backgroundColor: '#ffebee', borderRadius: '4px' }}>
          {error}
        </div>
      )}
      
      <LoadScript googleMapsApiKey="AIzaSyAHV0iE6up6dCL99fxP2rCuX96At7_5CEA">
        <GoogleMap 
          mapContainerStyle={mapContainerStyle} 
          center={center} 
          zoom={15}
          onClick={handleMapClick}
        >
          {markers.map((crime) => (
            <Marker
              key={crime._id}
              position={{ 
                lat: crime.location.coordinates[1], 
                lng: crime.location.coordinates[0] 
              }}
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
              position={{ 
                lat: selectedCrime.location.coordinates[1], 
                lng: selectedCrime.location.coordinates[0] 
              }}
              onCloseClick={() => setSelectedCrime(null)}
            >
              <div>
                <h4>Crime Report</h4>
                <p><strong>Description:</strong> {selectedCrime.description}</p>
                <p><strong>Status:</strong> {selectedCrime.status}</p>
                <p><strong>Reported:</strong> {new Date(selectedCrime.createdAt).toLocaleDateString()}</p>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </LoadScript>
    </div>
  );
};

export default CrimeMap;