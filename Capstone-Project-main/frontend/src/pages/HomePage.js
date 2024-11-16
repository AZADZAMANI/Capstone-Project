// src/pages/HomePage.js

import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';
import '../common.css';
import { AuthContext } from '../AuthContext'; // Import AuthContext

function HomePage() {
  const navigate = useNavigate();
  const { auth } = useContext(AuthContext);

  // Determine if buttons should be disabled
  const isPatientLoggedIn = auth.user && auth.user.role === 'patient';
  const isDoctorLoggedIn = auth.user && auth.user.role === 'doctor';

  // Disable 'Register' button if patient or doctor is logged in
  // Disable 'Book Now' button if doctor is logged in
  const disableRegister = isPatientLoggedIn || isDoctorLoggedIn;
  const disableBook = isDoctorLoggedIn;

  return (
    <div className="homepage">
      {/* Slogan */}
      <section className="slogan">
        <h1>Healthcare made easy.</h1>
      </section>
      <section className="cards">
        <div className="card">
          <h2>New Patient</h2>
          <button
            onClick={() => {
              if (!disableRegister) {
                navigate('/register');
              }
            }}
            disabled={disableRegister}
          >
            Register
          </button>
          {disableRegister && (
            <p className="message">You are already registered.</p>
          )}
        </div>
        <div className="card">
          <h2>Family Doctor</h2>
          <button
            onClick={() => {
              if (!disableBook) {
                navigate('/book-appointment');
              }
            }}
            disabled={disableBook}
          >
            Book Now
          </button>
          {disableBook && (
            <p className="message">Doctors cannot book appointments.</p>
          )}
        </div>
      </section>
    </div>
  );
}

export default HomePage;
