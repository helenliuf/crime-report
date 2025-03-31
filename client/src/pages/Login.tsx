import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/login.css';
import { useAuth } from '../context/AuthContext';

interface User {
  name: string;
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const { login, user } = useAuth();
  const navigate = useNavigate();

  // 🔁 Auto-redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    const users = JSON.parse(localStorage.getItem('users') || '[]') as User[];
    const foundUser = users.find((user) => user.email === email);

    if (!foundUser) {
      alert('Email not found. Redirecting to signup...');
      navigate('/signup');
      return;
    }

    if (foundUser.password !== password) {
      setErrorMsg('Incorrect password. Please try again.');
      return;
    }

    login({ name: foundUser.name, email: foundUser.email });
    navigate('/dashboard');
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin} className="login-form">
        <label>Email</label>
        <input type="email" value={email} required onChange={(e) => setEmail(e.target.value)} />

        <label>Password</label>
        <input type="password" value={password} required onChange={(e) => setPassword(e.target.value)} />

        {errorMsg && <p style={{ color: 'red' }}>{errorMsg}</p>}

        <button type="submit">Login</button>
      </form>
      <p>Don’t have an account? <a href="/signup">Sign up here</a></p>
    </div>
  );
};

export default Login;
