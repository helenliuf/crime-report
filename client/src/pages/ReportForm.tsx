import React from 'react';

const ReportForm: React.FC = () => {
  return (
    <div style={styles.container}>
      <h1>Report Crime</h1>
      <p>This is a placeholder for the crime reporting form.</p>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    padding: '2rem',
    textAlign: 'center'
  }
};

export default ReportForm;
