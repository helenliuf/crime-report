import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface CrimeReport {
  _id: string;
  description: string;
  status: 'Pending' | 'Verified' | 'Resolved';
  createdAt: string;
  location: {
    coordinates: [number, number]; // [longitude, latitude]
  };
}

// Default location (UMass Amherst coordinates)
const DEFAULT_LOCATION = {
  latitude: 42.3915,
  longitude: -72.5266
};

const TagsTable: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [crimes, setCrimes] = useState<CrimeReport[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [locationError, setLocationError] = useState<string | null>(null);

  const fetchNearbyCrimes = async (latitude: number, longitude: number) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Please log in to view crime reports');
      }

      const response = await fetch(
        `http://localhost:8080/api/crime/nearby?latitude=${latitude}&longitude=${longitude}&radius=5`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          credentials: 'include'
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch nearby crimes');
      }

      const data = await response.json();
      setCrimes(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching nearby crimes:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const getLocation = async () => {
    try {
      // First try to get location from IP
      const response = await fetch('https://ipapi.co/json/');
      if (!response.ok) {
        throw new Error('Failed to get location from IP');
      }
      
      const data = await response.json();
      if (data.latitude && data.longitude) {
        return {
          latitude: data.latitude,
          longitude: data.longitude
        };
      }
      
      throw new Error('Invalid location data received');
    } catch (err) {
      console.error('Error getting location from IP:', err);
      // Fallback to default location
      setLocationError('Using default location (UMass Amherst) as fallback');
      return DEFAULT_LOCATION;
    }
  };

  useEffect(() => {
    const initializeData = async () => {
      if (user) {
        try {
          const location = await getLocation();
          await fetchNearbyCrimes(location.latitude, location.longitude);
        } catch (err) {
          console.error('Error initializing data:', err);
          // Use default location if everything fails
          await fetchNearbyCrimes(DEFAULT_LOCATION.latitude, DEFAULT_LOCATION.longitude);
          setLocationError('Using default location (UMass Amherst) as fallback');
        }
      }
    };

    initializeData();
  }, [user]);

  const getStatusColor = (status: CrimeReport['status']) => {
    switch (status) {
      case 'Resolved':
        return '#00C851';
      case 'Verified':
        return '#ffbb33';
      case 'Pending':
        return '#ff4444';
      default:
        return '#2BBBAD';
    }
  };

  const handleRowClick = (crimeId: string) => {
    navigate(`/report/${crimeId}`);
  };

  if (!user) {
    return <div>Please log in to view crime reports.</div>;
  }

  if (isLoading) {
    return <div>Loading nearby crime reports...</div>;
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Nearby Crime Reports</h2>
      {locationError && (
        <div style={styles.locationWarning}>
          ⚠️ {locationError}
        </div>
      )}
      {error && (
        <div style={styles.error}>
          {error}
        </div>
      )}
      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead style={styles.tableHeader}>
            <tr style={styles.headerRow}>
              <th style={styles.headerCell}>Description</th>
              <th style={styles.headerCell}>Status</th>
              <th style={styles.headerCell}>Reported</th>
            </tr>
          </thead>
          <tbody>
            {crimes.map((crime) => (
              <tr 
                key={crime._id} 
                style={styles.row}
                onClick={() => handleRowClick(crime._id)}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = '#f8f9fa';
                  e.currentTarget.style.cursor = 'pointer';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = 'white';
                }}
              >
                <td style={styles.cell}>{crime.description}</td>
                <td style={styles.cell}>
                  <span style={{
                    ...styles.statusBadge,
                    backgroundColor: getStatusColor(crime.status)
                  }}>
                    {crime.status}
                  </span>
                </td>
                <td style={styles.cell}>
                  {new Date(crime.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
            {crimes.length === 0 && (
              <tr>
                <td colSpan={3} style={{ textAlign: 'center', padding: '1rem' }}>
                  No crime reports found in your area
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '1rem',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    minWidth: '400px',
    maxWidth: '800px',
    display: 'flex',
    flexDirection: 'column' as const,
    height: '100%'
  },
  title: {
    margin: '0 0 1rem 0',
    color: '#333',
    fontSize: '1.2rem',
    padding: '0 0.5rem'
  },
  locationWarning: {
    backgroundColor: '#fff3cd',
    color: '#856404',
    padding: '0.75rem',
    borderRadius: '4px',
    marginBottom: '1rem',
    fontSize: '0.9rem'
  },
  error: {
    backgroundColor: '#f8d7da',
    color: '#721c24',
    padding: '0.75rem',
    borderRadius: '4px',
    marginBottom: '1rem',
    fontSize: '0.9rem'
  },
  tableContainer: {
    flex: 1,
    overflowY: 'auto' as const,
    maxHeight: '400px',
    borderRadius: '4px',
    border: '1px solid #eee'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse' as const,
    backgroundColor: 'white'
  },
  tableHeader: {
    position: 'sticky' as const,
    top: 0,
    zIndex: 1
  },
  headerRow: {
    backgroundColor: '#f5f5f5'
  },
  headerCell: {
    padding: '0.75rem',
    textAlign: 'left' as const,
    fontWeight: 'bold',
    color: '#666',
    borderBottom: '2px solid #ddd',
    backgroundColor: '#f5f5f5'
  },
  row: {
    borderBottom: '1px solid #eee',
    '&:hover': {
      backgroundColor: '#f8f9fa'
    }
  },
  cell: {
    padding: '0.75rem',
    color: '#333'
  },
  statusBadge: {
    padding: '0.25rem 0.5rem',
    borderRadius: '4px',
    color: 'white',
    fontSize: '0.8rem',
    textTransform: 'capitalize' as const,
    display: 'inline-block',
    minWidth: '80px',
    textAlign: 'center' as const
  }
};

export default TagsTable; 