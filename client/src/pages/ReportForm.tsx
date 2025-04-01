import React, { useState } from 'react';
import '../styles/reportform.css';
import { useAuth } from '../context/AuthContext';

const ReportForm: React.FC = () => {
  const { user } = useAuth();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('');
  const [location, setLocation] = useState('');
  const [age, setAge] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !description || !type || !location) {
      setError('Please fill out all required fields.');
      return;
    }

    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (!token || !userData) {
      setError("You must be logged in to submit a report.");
      return;
    }

    const parsedUser = JSON.parse(userData);

    const payload = {
      userId: parsedUser.id,
      description: `${title} - ${description} | Age: ${age}, Height: ${height}, Weight: ${weight}`,
      location: {
        coordinates: [-72.526, 42.375] // 🔁 Replace with actual [longitude, latitude] later
      },
      status: "Pending"
    };

    try {
      const response = await fetch("http://localhost:8080/api/crime", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || "Failed to submit");
      }

      setTitle('');
      setDescription('');
      setType('');
      setLocation('');
      setAge('');
      setHeight('');
      setWeight('');
      setError('');
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Something went wrong");
    }
  };

  return (
    <div className="report-full-page">
      <div className="report-form-wrapper">
        <h2 className="form-title">Crime Reporting Form</h2>
        <form onSubmit={handleSubmit} className="report-form">
          {error && <p className="error">{error}</p>}

          <label>Title</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />

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

          <label>Age (approximate)</label>
          <input type="number" min="0" value={age} onChange={(e) => setAge(e.target.value)} />

          <label>Height (in cm)</label>
          <input type="text" value={height} onChange={(e) => setHeight(e.target.value)} />

          <label>Weight (in kg)</label>
          <input type="text" value={weight} onChange={(e) => setWeight(e.target.value)} />

          <label>Location</label>
          <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} required />

          <button type="submit">Submit Report</button>
        </form>

        {success && (
          <div className="report-success">
            ✅ Crime reported successfully!
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportForm;
