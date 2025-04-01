import React from 'react';
import CrimeMap from "../components/CrimeMap.tsx";
import EmergencyButton from "../components/EmergencyButton.tsx";
import TagsTable from "../components/TagsTable.tsx";

const Dashboard: React.FC = () => {
  return (
    <div style={styles.container}>
      <h1>Crime Report Dashboard</h1>
      <p>Help keep our campus safe.</p>
      <div style={styles.emergencySection}>
        <EmergencyButton />
        <TagsTable />
      </div>
      <CrimeMap />
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    padding: '2rem',
    textAlign: 'center'
  },
  emergencySection: {
    margin: '2rem 0',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    gap: '2rem'
  }
};

export default Dashboard;
