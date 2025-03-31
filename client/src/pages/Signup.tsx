import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/signup.css';
import { useAuth } from '../context/AuthContext';

interface User {
  name: string;
  email: string;
  password: string;
}

const Signup: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  // 🔁 Auto-redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    const existingUsers = JSON.parse(localStorage.getItem('users') || '[]') as User[];

    const alreadyExists = existingUsers.some((user) => user.email === email);
    if (alreadyExists) {
      alert('User with this email already exists.');
      return;
    }

    const newUser: User = { name, email, password };
    existingUsers.push(newUser);
    localStorage.setItem('users', JSON.stringify(existingUsers));

    alert('Signup successful! You can now login.');
    navigate('/login');
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
        <input type="password" value={password} required onChange={(e) => setPassword(e.target.value)} />

        <label>Confirm Password</label>
        <input type="password" value={confirmPassword} required onChange={(e) => setConfirmPassword(e.target.value)} />

        <button type="submit">Create Account</button>
      </form>

      <button className="back-button" onClick={() => navigate('/login')}>
        Back to Login
      </button>
    </div>
  );
};

export default Signup;
