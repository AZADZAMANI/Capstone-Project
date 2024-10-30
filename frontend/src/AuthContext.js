// /frontend/src/AuthContext.js

import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode'; 
//import jwtDecode from 'jwt-decode';


// Create the context
export const AuthContext = createContext();

// Create a provider component
export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    token: null,
    user: null,
  });

  // On component mount, check for token in localStorage
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token); // Updated usage
        // Optional: Check if token is expired
        const currentTime = Date.now() / 1000;
        if (decoded.exp < currentTime) {
          // Token expired
          localStorage.removeItem('token');
        } else {
          setAuth({
            token,
            user: {
              id: decoded.id,
              email: decoded.email,
              // Add other user info if needed
            },
          });
        }
      } catch (err) {
        console.error('Error decoding token:', err);
        localStorage.removeItem('token');
      }
    }
  }, []);

  // Function to handle login
  const login = (token, user) => {
    localStorage.setItem('token', token);
    setAuth({
      token,
      user,
    });
  };

  // Function to handle logout
  const logout = () => {
    localStorage.removeItem('token');
    setAuth({
      token: null,
      user: null,
    });
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
