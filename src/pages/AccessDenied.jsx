import React from 'react';
import { useNavigate } from 'react-router-dom';
import './AccessDenied.css';

const AccessDenied = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem('username');
  const role = localStorage.getItem('role');

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleGoHome = () => {
    if (role === 'admin') {
      navigate('/admin');
    } else {
      navigate('/customer');
    }
  };

  return (
    <div className="access-denied-container">
      <div className="access-denied-card">
        <div className="access-denied-icon">
          <svg viewBox="0 0 24 24" width="80" height="80">
            <path fill="#ff4757" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h2v2h-2v-2zm0-12h2v10h-2V5z"/>
          </svg>
        </div>
        
        <h1 className="access-denied-title">Access Denied</h1>
        
        <p className="access-denied-message">
          Sorry <span className="username">{username}</span>, you don't have permission 
          to access this page with your current role.
        </p>
        
        <div className="role-indicator">
          Your role: <span className="role-badge">{role}</span>
        </div>
        
        <div className="access-denied-actions">
          <button 
            onClick={handleGoBack} 
            className="action-btn secondary-btn"
          >
            <span className="btn-icon">←</span>
            Go Back
          </button>
          
          <button 
            onClick={handleGoHome} 
            className="action-btn primary-btn"
          >
            Go to Home
            <span className="btn-icon">→</span>
          </button>
        </div>
        
        <div className="access-denied-footer">
          <p>If you believe this is an error, please contact your administrator.</p>
        </div>
      </div>
    </div>
  );
};

export default AccessDenied;