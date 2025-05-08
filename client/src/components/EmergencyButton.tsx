import React, { useState, useEffect } from 'react';
import { CSSProperties } from 'react';

const EmergencyButton: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isCountingDown, setIsCountingDown] = useState(false);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (countdown !== null && countdown > 0) {
      timer = setInterval(() => {
        setCountdown(prev => prev !== null ? prev - 1 : null);
      }, 1000);
    } else if (countdown === 0) {
      handleEmergencyCall();
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [countdown]);

  const handleEmergencyCall = async () => {
    setIsLoading(true);
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });

      const { latitude, longitude } = position.coords;
      const locationUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
      
      window.location.href = 'tel:4133137928';
      
      console.log('Emergency call initiated with location:', {
        latitude,
        longitude,
        locationUrl,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error getting location:', error);
      window.location.href = 'tel:4133137928';
    } finally {
      setIsLoading(false);
    }
  };

  const startCountdown = () => {
    setCountdown(10);
    setIsCountingDown(true);
  };

  const cancelCountdown = () => {
    setCountdown(null);
    setIsCountingDown(false);
  };

  const getButtonStyle = (): CSSProperties => ({
    backgroundColor: isCountingDown ? '#ff4444' : '#ff0000',
    color: 'white',
    padding: '1rem 2rem',
    fontSize: '1.2rem',
    border: 'none',
    borderRadius: '50%',
    cursor: isLoading ? 'not-allowed' : 'pointer',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.2s',
    margin: '1rem',
    width: '220px',
    height: '220px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    position: 'relative',
    overflow: 'hidden'
  });

  const getProgressStyle = (): CSSProperties => ({
    position: 'absolute',
    bottom: 0,
    left: 0,
    height: '4px',
    backgroundColor: 'white',
    width: `${((10 - (countdown || 0)) / 10) * 100}%`,
    transition: 'width 1s linear'
  });

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <button
        onClick={isCountingDown ? cancelCountdown : startCountdown}
        disabled={isLoading}
        style={getButtonStyle()}
        onMouseOver={(e) => {
          if (!isLoading && !isCountingDown) {
            e.currentTarget.style.transform = 'scale(1.05)';
          }
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
        }}
      >
        <span style={{ 
          fontSize: '2rem',
          fontWeight: 'bold',
          marginBottom: '0.5rem'
        }}>
          {isCountingDown ? 'CANCEL' : 'EMERGENCY'}
        </span>
        <span style={{ 
          fontSize: '2rem',
          marginTop: '0.5rem'
        }}>
          {isCountingDown ? countdown : '911'}
        </span>
        {isLoading && (
          <span style={{ 
            marginTop: '1rem',
            fontSize: '1.2rem'
          }}>
            Getting location...
          </span>
        )}
        {isCountingDown && <div style={getProgressStyle()} />}
      </button>
    </div>
  );
};

export default EmergencyButton; 