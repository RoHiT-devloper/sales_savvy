
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Auth.css';

const SignIn = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  async function handleSubmit(event) {
    event.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    if (!formData.username || !formData.password) {
      setError("Please fill in all fields");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/signIn', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

          if (response.ok) {
          // In your SignIn component, update the success handler:
          if (result.message === "admin") {
            localStorage.setItem("username", formData.username);
            localStorage.setItem("role", "admin");
            navigate("/admin");
          } else if (result.message === "customer") {
            localStorage.setItem("username", formData.username);
            localStorage.setItem("role", "customer");
            navigate("/customer", { state: { products: result.products } });
          }
    }
 else {
        setError(result.message || "Something went wrong");
      }
    } catch (error) {
      console.error("Error during sign in:", error);
      setError("Failed to sign in. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Welcome to Sales Savvy!</h1>
          <p>Sign in to your account</p>
        </div>
        
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="input-group">
            <label htmlFor="username">Username</label>
            <div className="input-with-icon">
              <i className="fas fa-user"></i>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter your username"
              />
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="password">Password</label>
            <div className="input-with-icon">
              <i className="fas fa-lock"></i>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
              />
              <button 
                type="button" 
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
              </button>
            </div>
          </div>

          <div className="remember-forgot">
            <label className="remember-me">
              <input type="checkbox" />
              <span>Remember me</span>
            </label>

            <p>
              <Link to="/forgot-password" className="auth-link">Forgot Password?</Link>
            </p>
          </div>

          <button 
            type="submit" 
            className={`auth-button ${isLoading ? 'loading' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <i className="fas fa-spinner fa-spin"></i>
                Signing in...
              </>
            ) : (
              'SIGN IN'
            )}
          </button>
        </form>

        <div className="auth-footer">
          <p>Don't have an account? <Link to="/signup" className="auth-link">Sign Up</Link></p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
