import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/signup.css';
import { useAuth } from '../context/AuthContext';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

interface User {
  name: string;
  email: string;
  password: string;
}

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
  const [strength, setStrength] = useState('');
  const [success, setSuccess] = useState(false);
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

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    const existingUsers = JSON.parse(localStorage.getItem('users') || '[]') as User[];

    if (existingUsers.some((user) => user.email === email)) {
      alert('User with this email already exists.');
      return;
    }

    const newUser: User = { name, email, password };
    existingUsers.push(newUser);
    localStorage.setItem('users', JSON.stringify(existingUsers));

    setSuccess(true);
    setTimeout(() => {
      alert('Signup successful!');
      navigate('/login');
    }, 1000);
  };

  return (
    <div className="signup-container">
      <h2>Signup</h2>
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

        <button type="submit" className={success ? 'signup-button success' : 'signup-button'}>
          {success ? '✓ Created!' : 'Create Account'}
        </button>
      </form>

      <button className="back-button" onClick={() => navigate('/login')}>
        Back to Login
      </button>
    </div>
  );
};

export default Signup;
