import React, { useState, useEffect } from 'react';
import '../styles/reportform.css';
import { useAuth } from '../context/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';

interface ReportFormData {
  title: string;
  description: string;
  type: string;
  locationText: string;
  age: string;
  height: string;
  weight: string;
}

const ReportForm: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const coordinates = location.state?.coordinates;

  const [formData, setFormData] = useState<ReportFormData>({
    title: '',
    description: '',
    type: '',
    locationText: '',
    age: '',
    height: '',
    weight: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (coordinates) {
      setFormData(prev => ({
        ...prev,
        locationText: `${coordinates.lat.toFixed(6)}, ${coordinates.lng.toFixed(6)}`
      }));
    }
  }, [coordinates]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.description || !formData.type || !formData.locationText) {
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
      description: `${formData.title} - ${formData.description} | Age: ${formData.age}, Height: ${formData.height}, Weight: ${formData.weight}`,
      location: {
        coordinates: coordinates ? [coordinates.lng, coordinates.lat] : [-72.526, 42.375]
      },
      type: formData.type,
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

      const newReport = await response.json();

      // If we came from the map, send the new report back
      if (location.state?.returnToMap) {
        window.postMessage({
          type: 'NEW_REPORT',
          report: {
            id: newReport.id,
            lat: coordinates.lat,
            lng: coordinates.lng,
            type: formData.type,
            severity: "Medium", // You might want to add severity to the form
            description: `${formData.title} - ${formData.description}`
          }
        }, '*');
        navigate('/dashboard');
      }

      // Reset form
      setFormData({
        title: '',
        description: '',
        type: '',
        locationText: coordinates ? `${coordinates.lat.toFixed(6)}, ${coordinates.lng.toFixed(6)}` : '',
        age: '',
        height: '',
        weight: ''
      });
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
          <input 
            type="text" 
            name="title"
            value={formData.title} 
            onChange={handleInputChange} 
            required 
          />

          <label>Description</label>
          <textarea 
            name="description"
            value={formData.description} 
            onChange={handleInputChange} 
            required 
          />

          <label>Type of Crime</label>
          <select 
            name="type"
            value={formData.type} 
            onChange={handleInputChange} 
            required
          >
            <option value="">Select...</option>
            <option value="Theft">Theft</option>
            <option value="Assault">Assault</option>
            <option value="Hit and Run">Hit and Run</option>
            <option value="Other">Other</option>
          </select>

          <label>Age (approximate)</label>
          <input 
            type="number" 
            name="age"
            min="0" 
            value={formData.age} 
            onChange={handleInputChange} 
          />

          <label>Height (in cm)</label>
          <input 
            type="text" 
            name="height"
            value={formData.height} 
            onChange={handleInputChange} 
          />

          <label>Weight (in kg)</label>
          <input 
            type="text" 
            name="weight"
            value={formData.weight} 
            onChange={handleInputChange} 
          />

          <label>Location</label>
          <input 
            type="text" 
            name="locationText"
            value={formData.locationText} 
            onChange={handleInputChange} 
            required 
            readOnly={!!coordinates}
          />

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
