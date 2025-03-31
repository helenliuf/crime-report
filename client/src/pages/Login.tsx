import React from 'react';

const Login: React.FC = () => {
  return (
    <div style={styles.container}>
      <h1>Login Page</h1>
      <p>This is a placeholder for the login form.</p>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    padding: '2rem',
    textAlign: 'center'
  }
};

export default Login;
