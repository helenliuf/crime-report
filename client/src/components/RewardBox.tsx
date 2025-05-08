import React from 'react';
import { useAuth } from '../context/AuthContext';
import { FaMedal } from 'react-icons/fa';

const RewardBox: React.FC = () => {
  const { user } = useAuth();
  const rewardPoints = user?.rewardPoints ?? 0;

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.iconCircle}>
          <FaMedal size={32} color="#fff" />
        </div>
        <h2 style={styles.title}>Reward Points</h2>
        <div style={styles.pointsCircle}>
          <span style={styles.points}>{rewardPoints}</span>
        </div>
        <p style={styles.caption}>Verified crime reports earn you points!</p>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    margin: '2rem 0',
  },
  card: {
    background: 'linear-gradient(145deg, #d4f1f9, #c2e9fb)',
    borderRadius: '20px',
    padding: '2 rem 1.5 rem',
    textAlign: 'center',
    maxWidth: '300px',
    width: '100%',
    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
    position: 'relative',
  },
  iconCircle: {
    position: 'absolute',
    top: '-20px',
    left: 'calc(50% - 20px)',
    background: '#4fc3f7',
    borderRadius: '50%',
    padding: '0.5rem',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
  },
  title: {
    fontSize: '1.5rem',
    fontWeight: 600,
    marginTop: '1.5rem',
    color: '#333',
    fontFamily: 'Segoe UI, sans-serif',
  },
  pointsCircle: {
    margin: '1.5rem auto',
    background: 'white',
    borderRadius: '50%',
    width: '120px',
    height: '120px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: 'inset 0 0 10px rgba(0,0,0,0.1)',
  },
  points: {
    fontSize: '3rem',
    fontWeight: 'bold',
    color: '#4fc3f7',
  },
  caption: {
    fontSize: '0.95rem',
    color: '#444',
    opacity: 0.85,
    marginTop: '0.5rem',
  },
};

export default RewardBox;
