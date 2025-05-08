import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

interface CrimeReport {
  _id: string;
  description: string;
  status: 'Pending' | 'Verified' | 'Resolved';
  createdAt: string;
  location: {
    coordinates: [number, number]; // [longitude, latitude]
  };
}

const ReportDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [report, setReport] = useState<CrimeReport | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isVerifying, setIsVerifying] = useState(false);

  const fetchReport = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Please log in to view report details');
      }

      const response = await fetch(`http://localhost:8080/api/crime/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to fetch report details');
      }

      const data = await response.json();
      setReport(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching report:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!report) return;

    try {
      setIsVerifying(true);
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Please log in to verify reports');
      }

      const response = await fetch(`http://localhost:8080/api/crime/${id}/verify`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to verify report');
      }

      // Refresh the report data
      await fetchReport();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error verifying report:', err);
    } finally {
      setIsVerifying(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchReport();
    }
  }, [user, id]);

  if (!user) {
    return <div>Please log in to view report details.</div>;
  }

  if (isLoading) {
    return <div>Loading report details...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>{error}</div>;
  }

  if (!report) {
    return <div>Report not found.</div>;
  }

  const mapContainerStyle = {
    width: '100%',
    height: '300px',
    marginBottom: '1rem',
    borderRadius: '8px'
  };

  const center = {
    lat: report.location.coordinates[1],
    lng: report.location.coordinates[0]
  };
  
  // only police or admin can verify
  const canVerify = (user.role === 'Police' || user.role === 'Admin') && report.status === 'Pending';

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Crime Report Details</h1>
        <button 
          onClick={() => navigate('/dashboard')}
          style={styles.backButton}
        >
          ← Back to Dashboard
        </button>
      </div>

      <div style={styles.content}>
        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Location</h2>
          <LoadScript googleMapsApiKey="AIzaSyAHV0iE6up6dCL99fxP2rCuX96At7_5CEA">
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              center={center}
              zoom={15}
            >
              <Marker position={center} />
            </GoogleMap>
          </LoadScript>
          <p style={styles.coordinates}>
            Coordinates: {report.location.coordinates[1].toFixed(6)}, {report.location.coordinates[0].toFixed(6)}
          </p>
        </div>

        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Report Information</h2>
          <div style={styles.infoGrid}>
            <div style={styles.infoItem}>
              <label style={styles.label}>Status</label>
              <span style={{
                ...styles.statusBadge,
                backgroundColor: report.status === 'Verified' ? '#ffbb33' : 
                              report.status === 'Resolved' ? '#00C851' : '#ff4444'
              }}>
                {report.status}
              </span>
            </div>
            <div style={styles.infoItem}>
              <label style={styles.label}>Reported On</label>
              <p style={styles.value}>{new Date(report.createdAt).toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Description</h2>
          <p style={styles.description}>{report.description}</p>
        </div>

        {/* {user.role === 'Police' && report.status === 'Pending' && ( */}
        {canVerify && (
          <div style={styles.verifySection}>
            <button
              onClick={handleVerify}
              disabled={isVerifying}
              style={styles.verifyButton}
            >
              {isVerifying ? 'Verifying...' : 'Verify Report'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '2rem',
    maxWidth: '1000px',
    margin: '0 auto'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem'
  },
  title: {
    margin: 0,
    color: '#333',
    fontSize: '1.8rem'
  },
  backButton: {
    padding: '0.5rem 1rem',
    backgroundColor: '#f8f9fa',
    border: '1px solid #dee2e6',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1rem',
    color: '#495057',
    '&:hover': {
      backgroundColor: '#e9ecef'
    }
  },
  content: {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '2rem',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  section: {
    marginBottom: '2rem'
  },
  sectionTitle: {
    color: '#333',
    fontSize: '1.4rem',
    marginBottom: '1rem',
    paddingBottom: '0.5rem',
    borderBottom: '2px solid #f0f0f0'
  },
  coordinates: {
    color: '#666',
    fontSize: '0.9rem',
    marginTop: '0.5rem'
  },
  infoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1rem'
  },
  infoItem: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.5rem'
  },
  label: {
    color: '#666',
    fontSize: '0.9rem'
  },
  value: {
    color: '#333',
    margin: 0
  },
  description: {
    color: '#333',
    lineHeight: '1.6',
    whiteSpace: 'pre-wrap' as const
  },
  statusBadge: {
    padding: '0.25rem 0.75rem',
    borderRadius: '4px',
    color: 'white',
    fontSize: '0.9rem',
    display: 'inline-block',
    textTransform: 'capitalize' as const
  },
  verifySection: {
    marginTop: '2rem',
    paddingTop: '2rem',
    borderTop: '2px solid #f0f0f0',
    textAlign: 'center' as const
  },
  verifyButton: {
    padding: '0.75rem 2rem',
    backgroundColor: '#ffbb33',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    '&:hover': {
      backgroundColor: '#ffa000'
    },
    '&:disabled': {
      backgroundColor: '#ccc',
      cursor: 'not-allowed'
    }
  }
};

export default ReportDetails; 