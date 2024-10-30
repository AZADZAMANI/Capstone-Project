// src/pages/SignInPage.js

import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './SignInPage.css';
import '../common.css';
import { AuthContext } from '../AuthContext'; // Import AuthContext

function SignInPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

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

  const handleSubmit = (e) => {
    e.preventDefault();

    // Clear any previous error message
    setErrorMessage('');

    const API_URL = process.env.REACT_APP_API_URL;

    // Send data to the backend for authentication
    fetch(`${API_URL}/api/signin`, {
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
        // Navigate to profile page
        navigate('/myprofile');
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
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
      </div>
    </div>
  );
}

export default SignInPage;
