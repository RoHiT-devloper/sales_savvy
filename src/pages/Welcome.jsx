import React from 'react';
import { Link } from 'react-router-dom';
import './Welcome.css';

const Welcome = () => {
  return (
    <div className="welcome-container">
      {/* Background Animation */}
      <div className="background-animation">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
      </div>

      {/* Main Content */}
      <div className="welcome-content">
        {/* Header */}
        <header className="welcome-header">
          <div className="logo">
            <span className="logo-icon">🛒</span>
            <h1>SalesSavvy</h1>
          </div>
        </header>

        {/* Hero Section */}
        <main className="hero-section">
          <div className="hero-text">
            <h2 className="hero-title">
              Welcome to <span className="brand-gradient">SalesSavvy</span>
            </h2>
            <p className="hero-subtitle">
              Your complete e-commerce solution for modern businesses
            </p>
            <p className="hero-description">
              Experience seamless shopping and powerful management tools 
              in one integrated platform.
            </p>
          </div>

          {/* Auth Cards */}
          <div className="auth-cards-row">
            {/* Sign Up Card */}
            <div className="auth-card signup-card">
              <div className="card-icon">🚀</div>
              <h3>Get Started</h3>
              <p>Create your account and start exploring our platform</p>
              <ul className="benefits-list">
                <li>✓ Access to all features</li>
                <li>✓ Personalized dashboard</li>
                <li>✓ 24/7 support</li>
              </ul>
              <Link to="/signup" className="auth-btn primary-btn">
                Sign Up Now
              </Link>
            </div>

            {/* Sign In Card */}
            <div className="auth-card signin-card">
              <div className="card-icon">🔐</div>
              <h3>Welcome Back</h3>
              <p>Sign in to your existing account</p>
              <ul className="benefits-list">
                <li>✓ Continue shopping</li>
                <li>✓ Manage your orders</li>
                <li>✓ Track your progress</li>
              </ul>
              <Link to="/signin" className="auth-btn secondary-btn">
                Sign In
              </Link>
            </div>
          </div>
        </main>

        {/* Quick Features */}
        <section className="quick-features">
          <h4>Why Choose SalesSavvy?</h4>
          <div className="features-grid">
            <div className="feature-item">
              <span className="feature-icon">⚡</span>
              <span>Fast & Reliable</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🔒</span>
              <span>Secure</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">💎</span>
              <span>Premium Features</span>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🌐</span>
              <span>24/7 Access</span>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="welcome-footer">
          <p>© 2024 SalesSavvy. Built with React.js & Spring Boot</p>
        </footer>
      </div>
    </div>
  );
};

export default Welcome;