import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { verifyUserRole } from '../utils/roleVerifier';

const ProtectedRoute = ({ children, requiredRole }) => {
  const [isAuthorized, setIsAuthorized] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuthorization = async () => {
      const username = localStorage.getItem('username');
      
      if (!username) {
        setIsAuthorized(false);
        setIsLoading(false);
        return;
      }

      try {
        const authorized = await verifyUserRole(username, requiredRole);
        setIsAuthorized(authorized);
      } catch (error) {
        console.error('Error verifying role:', error);
        setIsAuthorized(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthorization();
  }, [requiredRole]);

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Verifying access permissions...</p>
      </div>
    );
  }

  if (!isAuthorized) {
    // Redirect to appropriate page based on user role
    const username = localStorage.getItem('username');
    if (username) {
      // User is logged in but doesn't have permission
      return <Navigate to="/access-denied" replace />;
    }
    // User is not logged in
    return <Navigate to="/signin" replace />;
  }

  return children;
};

export default ProtectedRoute;