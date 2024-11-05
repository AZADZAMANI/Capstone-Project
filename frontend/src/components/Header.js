// frontend/src/components/Header.js

import React, { useContext, useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';
import { AuthContext } from '../AuthContext'; // Import AuthContext
import { FaUserCircle, FaBars, FaTimes } from 'react-icons/fa'; // Importing icons

function Header() {
  const { auth, logout } = useContext(AuthContext); // Access auth state and logout function
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Toggle dropdown menu
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle logout
  const handleLogout = () => {
    logout();
    navigate('/'); // Redirect to home page after logout
    setDropdownOpen(false);
    setMobileMenuOpen(false);
  };

  // Determine profile link based on role
  const profileLink = auth.user && auth.user.role === 'doctor' ? '/doctor-dashboard' : '/myprofile';

  return (
    <header className="header">
      <div className="logo-container">
        <Link to="/" className="logo-link">
          <span className="logo-text">Destination Health</span>
        </Link>
      </div>

      <nav className={`nav ${mobileMenuOpen ? 'active' : ''}`}>
        <Link to="/" onClick={() => setMobileMenuOpen(false)}>Home</Link>
        <Link to="#how-to-book" onClick={() => setMobileMenuOpen(false)}>How to Book</Link>
        <Link to="#about-us" onClick={() => setMobileMenuOpen(false)}>About Us</Link>
        {auth.token ? (
          <div className="dropdown" ref={dropdownRef}>
            <button
              className="profile-btn"
              onClick={toggleDropdown}
              aria-haspopup="true"
              aria-expanded={dropdownOpen}
            >
              <FaUserCircle className="profile-icon" /> Profile <span className="arrow">&#9662;</span>
            </button>
            {dropdownOpen && (
              <div className="dropdown-content" role="menu">
                <Link to={profileLink} onClick={() => setDropdownOpen(false)}>View Profile</Link>
                <button onClick={handleLogout} className="logout-btn">Log Out</button>
              </div>
            )}
          </div>
        ) : (
          <Link to="/signin" className="sign-in-btn">Sign In</Link>
        )}
      </nav>

      <div
        className="mobile-menu-icon"
        onClick={toggleMobileMenu}
        aria-label="Toggle menu"
        role="button"
        tabIndex={0}
        onKeyPress={(e) => { if (e.key === 'Enter') toggleMobileMenu(); }}
      >
        {mobileMenuOpen ? <FaTimes /> : <FaBars />}
      </div>
    </header>
  );
}

export default Header;
