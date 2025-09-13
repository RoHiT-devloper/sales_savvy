import React from 'react';
import { Link } from 'react-router-dom';
import './Admin_Home.css';

const Admin_Home = () => {
    return (
        <div className="admin-home-container">
            <div className="admin-home-header">
                <h1 className="admin-home-title">Admin Dashboard</h1>
                <p className="admin-home-subtitle">Manage your application efficiently</p>
            </div>
            
            <div className="admin-home-content">
                <div className="admin-cards-container">
                    <Link to="/userManagement" className="admin-card">
                        <div className="admin-card-icon">
                            <i className="fas fa-users"></i>
                        </div>
                        <h2 className="admin-card-title">User Management</h2>
                        <p className="admin-card-description">
                            Manage user accounts, permissions, and access levels
                        </p>
                        <div className="admin-card-cta">
                            <span>Go to Users</span>
                            <i className="fas fa-arrow-right"></i>
                        </div>
                    </Link>
                    
                    <Link to="/productmanager" className="admin-card">
                        <div className="admin-card-icon">
                            <i className="fas fa-box"></i>
                        </div>
                        <h2 className="admin-card-title">Product Management</h2>
                        <p className="admin-card-description">
                            Manage product catalog, inventory, and pricing
                        </p>
                        <div className="admin-card-cta">
                            <span>Go to Products</span>
                            <i className="fas fa-arrow-right"></i>
                        </div>
                    </Link>
                </div>
                
                <div className="admin-home-stats">
                    <div className="stat-card">
                        <h3>Quick Stats</h3>
                        <div className="stat-items">
                            <div className="stat-item">
                                <span className="stat-number">152</span>
                                <span className="stat-label">Total Users</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-number">47</span>
                                <span className="stat-label">Total Products</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-number">12</span>
                                <span className="stat-label">New Today</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Admin_Home;