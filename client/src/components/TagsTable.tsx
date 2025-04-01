import React from 'react';

interface Tag {
  id: string;
  type: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  timestamp: string;
}

const TagsTable: React.FC = () => {
  // This would typically come from your backend/state management
  const tags: Tag[] = [
    {
      id: '1',
      type: 'Theft',
      description: 'Reported theft in library',
      severity: 'medium',
      timestamp: '2024-03-20 14:30'
    },
    {
      id: '2',
      type: 'Suspicious Activity',
      description: 'Suspicious person near dormitory',
      severity: 'low',
      timestamp: '2024-03-20 13:15'
    },
    {
      id: '3',
      type: 'Assault',
      description: 'Physical altercation reported',
      severity: 'high',
      timestamp: '2024-03-20 12:45'
    }
  ];

  const getSeverityColor = (severity: Tag['severity']) => {
    switch (severity) {
      case 'high':
        return '#ff4444';
      case 'medium':
        return '#ffbb33';
      case 'low':
        return '#00C851';
      default:
        return '#2BBBAD';
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Recent Reports</h2>
      <table style={styles.table}>
        <thead>
          <tr style={styles.headerRow}>
            <th style={styles.headerCell}>Type</th>
            <th style={styles.headerCell}>Description</th>
            <th style={styles.headerCell}>Severity</th>
            <th style={styles.headerCell}>Time</th>
          </tr>
        </thead>
        <tbody>
          {tags.map((tag) => (
            <tr key={tag.id} style={styles.row}>
              <td style={styles.cell}>{tag.type}</td>
              <td style={styles.cell}>{tag.description}</td>
              <td style={styles.cell}>
                <span style={{
                  ...styles.severityBadge,
                  backgroundColor: getSeverityColor(tag.severity)
                }}>
                  {tag.severity}
                </span>
              </td>
              <td style={styles.cell}>{tag.timestamp}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '1rem',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    minWidth: '400px'
  },
  title: {
    margin: '0 0 1rem 0',
    color: '#333',
    fontSize: '1.2rem'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse' as const
  },
  headerRow: {
    backgroundColor: '#f5f5f5'
  },
  headerCell: {
    padding: '0.75rem',
    textAlign: 'left' as const,
    fontWeight: 'bold',
    color: '#666',
    borderBottom: '2px solid #ddd'
  },
  row: {
    borderBottom: '1px solid #eee'
  },
  cell: {
    padding: '0.75rem',
    color: '#333'
  },
  severityBadge: {
    padding: '0.25rem 0.5rem',
    borderRadius: '4px',
    color: 'white',
    fontSize: '0.8rem',
    textTransform: 'capitalize' as const
  }
};

export default TagsTable; 