import React from 'react';

const Signup: React.FC = () => {
  return (
    <div style={styles.container}>
      <h1>Signup Page</h1>
      <p>This is a placeholder for the signup form.</p>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    padding: '2rem',
    textAlign: 'center'
  }
};

export default Signup;
