import React from 'react';

const Dashboard: React.FC = () => {
  return (
    <div style={styles.container}>
      <h1>Dashboard</h1>
      <p>This is the placeholder for the dashboard or home page.</p>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    padding: '2rem',
    textAlign: 'center'
  }
};

export default Dashboard;
