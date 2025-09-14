import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const navigate = useNavigate();
  
  // Get user info from localStorage
  const username = localStorage.getItem('username');
  const role = localStorage.getItem('role');
  
  const handleLogout = () => {
    // Clear user data from localStorage
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    
    // Redirect to welcome page
    navigate('/');
  };
  
  return (
    <header className="app-header">
      <div className="header-content">
        <div className="header-left">
          <h1 className="app-title">SalesSavvy</h1>
        </div>
        
        <div className="header-center">
          <span className="welcome-text">
            Welcome, {username || 'Guest'}
          </span>
          <span className="user-role">
            ({role || 'Unknown Role'})
          </span>
        </div>
        
        <div className="header-right">
          <button onClick={handleLogout} className="logout-btn">
            <span className="logout-icon">🚪</span>
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;