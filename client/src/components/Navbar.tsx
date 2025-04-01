import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/navbar.css';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="nav-left">
        <div className="logo">🚨 <strong>Crime Report</strong></div>
      </div>

      {user && (
        <div className="nav-center">
          <span className="greeting">Hello, {user.name.split(' ')[0]}!</span>
        </div>
      )}

      <div className="nav-right">
        <ul className="nav-links">
          <li><Link to="/dashboard">Home</Link></li>
          <li><Link to="/report">Report</Link></li>
          {!user ? (
            <>
              <li><Link to="/">Login</Link></li>
              <li><Link to="/signup">Sign Up</Link></li>

            </>
          ) : (
            <li>
              <button className="logout-btn" onClick={handleLogout}>Logout</button>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
