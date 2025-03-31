import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/reportform.css';
import { useAuth } from '../context/AuthContext';

interface CrimeReport {
  title: string;
  description: string;
  type: string;
  location: string;
  date: string;
  reportedBy: string;
  age?: string;
  height?: string;
  weight?: string;
}

const ReportForm: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('');
  const [location, setLocation] = useState('');
  const [error, setError] = useState('');
  const [age, setAge] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !description || !type || !location) {
      setError('Please fill out all fields.');
      return;
    }

    const report: CrimeReport = {
      title,
      description,
      type,
      location,
      date: new Date().toISOString(),
      reportedBy: user?.email || user?.name || 'Anonymous',
      age,
      height,
      weight
    };

    const existingReports = JSON.parse(localStorage.getItem('crimeReports') || '[]');
    existingReports.push(report);
    localStorage.setItem('crimeReports', JSON.stringify(existingReports));

    alert('Crime reported successfully!');
    setTitle('');
    setDescription('');
    setType('');
    setLocation('');
    setError('');
    navigate('/report');
  };

  return (
    <div className="report-full-page">
      <div className="report-form-wrapper">
        <h2 className="form-title">Crime Reporting Form</h2>
        <form onSubmit={handleSubmit} className="report-form">
          {error && <p className="error">{error}</p>}

          <label>Title</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />

          <label>Age (approximate)</label>
          <input type="number" min="0" value={age} onChange={(e) => setAge(e.target.value)} placeholder="e.g. 25"/>

          <label>Height approximate (in cm)</label>
          <input type="text" value={height} onChange={(e) => setHeight(e.target.value)} placeholder="e.g. 170"/>

          <label>Weight approximate (in lbs)</label>
          <input type="text" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="e.g. 70"/>

          <label>Description</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />

          <label>Type of Crime</label>
          <select value={type} onChange={(e) => setType(e.target.value)} required>
            <option value="">Select...</option>
            <option value="Theft">Theft</option>
            <option value="Assault">Assault</option>
            <option value="Hit and Run">Hit and Run</option>
            <option value="Other">Other</option>
          </select>

          <label>Location</label>
          <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} required />

          <button type="submit">Submit Report</button>
        </form>
      </div>
    </div>
  );
};

export default ReportForm;
