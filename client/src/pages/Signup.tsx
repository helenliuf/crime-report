import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/signup.css';
import { useAuth } from '../context/AuthContext';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const getPasswordStrength = (password: string): string => {
  if (password.length < 6) return 'Weak';
  if (password.match(/[A-Z]/) && password.match(/[0-9]/) && password.length >= 8) return 'Strong';
  return 'Medium';
};

const Signup: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('Citizen');
  const [strength, setStrength] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate('/dashboard');
  }, [user, navigate]);

  useEffect(() => {
    setStrength(getPasswordStrength(password));
  }, [password]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (password !== confirmPassword) {
      setError('Passwords do not match!');
      return;
    }

    try {
      const res = await fetch('http://localhost:8080/api/user/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, phone, role }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Registration failed');
        return;
      }

      setSuccess(true);
      setTimeout(() => navigate('/'), 1500);
    } catch (err) {
      setError('Server error. Please try again later.');
    }
  };

  return (
    <div className="signup-container">
      <h2>Sign Up</h2>
      <form onSubmit={handleSignup} className="signup-form">
        <label>Full Name</label>
        <input type="text" value={name} required onChange={(e) => setName(e.target.value)} />

        <label>Email</label>
        <input type="email" value={email} required onChange={(e) => setEmail(e.target.value)} />

        <label>Password</label>
        <div className="password-wrapper">
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Create a strong password"
          />
          <span className="eye-icon" onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>
        <p className={`password-strength ${strength.toLowerCase()}`}>Strength: {strength}</p>

        <label>Confirm Password</label>
        <div className="password-wrapper">
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            value={confirmPassword}
            required
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <span className="eye-icon" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        <label>Phone</label>
        <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Optional" />

        <label>Role</label>
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="Citizen">Citizen</option>
          <option value="Police">Police</option>
          <option value="Admin">Admin</option>
        </select>

        <button type="submit" className={success ? 'signup-button success' : 'signup-button'}>
          {success ? '✓ Created!' : 'Create Account'}
        </button>

        {error && <p className="error">{error}</p>}
        {success && <p className="success">Registered successfully! Redirecting...</p>}
      </form>

      <button className="back-button" onClick={() => navigate('/login')}>
        Back to Login
      </button>
    </div>
  );
};

export default Signup;
