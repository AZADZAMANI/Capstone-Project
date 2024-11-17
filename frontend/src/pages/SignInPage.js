// src/pages/SignInPage.js

import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './SignInPage.css';
import '../common.css';
import { AuthContext } from '../AuthContext'; 

function SignInPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [role, setRole] = useState('patient'); // New state for role
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const { login } = useContext(AuthContext); // Destructure login function

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleRoleChange = (newRole) => {
    setRole(newRole);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Clear any previous error message
    setErrorMessage('');

    const API_URL = process.env.REACT_APP_API_URL;

    // Determine the endpoint based on role
    const endpoint = role === 'patient' ? '/api/signin' : '/api/doctor_signin';

    // Send data to the backend for authentication
    fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: formData.email,
        password: formData.password,
      }),
    })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) {
          // Handle server errors
          throw new Error(data.message || 'Sign-in failed');
        }
        return data;
      })
      .then((data) => {
        // Update the AuthContext with the token and user info
        login(data.token, data.user);
        // Redirect based on role
        if (data.user.role === 'patient') {
          navigate('/myprofile');
        } else if (role === 'doctor') {
          navigate('/doctor-dashboard');
        }else {
          // Handle unexpected roles or errors
          navigate('/');
        }
      })
      .catch((error) => {
        console.error('Error during sign-in:', error);
        setErrorMessage(error.message || 'Something went wrong. Please try again.');
      });
  };

  return (
    <div className="sign-in-page">
      <div className="form-container">
        <h1>Sign In</h1>
        {/* Role Selection */}
        <div className="role-selection">
        <button
            className={`role-button ${role === 'patient' ? 'active' : ''}`}
            onClick={() => handleRoleChange('patient')}
          >
            Patient
          </button>
          <button
            className={`role-button ${role === 'doctor' ? 'active' : ''}`}
            onClick={() => handleRoleChange('doctor')}
          >
            Doctor
          </button>
        </div>
        <form className="sign-in-form" onSubmit={handleSubmit}>
          <label>
            Email:
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </label>
          <label>
            Password:
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
          </label>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          <button type="submit">Sign In</button>
        </form>
        <p className="register-link">
          {role === 'patient' ? (
            <>
              Don't have an account? <Link to="/register">Register here</Link>
            </>
          ) : (
            "Contact the administrator to register."
          )}
        </p>
      </div>
    </div>
  );
}

export default SignInPage;
