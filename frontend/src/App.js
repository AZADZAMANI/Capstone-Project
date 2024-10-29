//frontend/src/App.js

import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';
import PatientProfile from './pages/PatientProfile';
import SignInPage from './pages/SignInPage';
import './common.css';
import Header from './components/Header';
import BookAppointmentPage from './pages/BookAppointmentPage';
import { AuthContext } from './AuthContext'; // Import AuthContext

function App() {
  const { auth } = useContext(AuthContext); // Access auth state

  return (
    <Router basename="/Capstone-Project">
      <div className="App">
        <Header />
        <div className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/signin" element={!auth.token ? <SignInPage /> : <Navigate to="/myprofile" />} />
            <Route path="/book-appointment" element={
              auth.token ? <BookAppointmentPage /> : <Navigate to="/signin" />
            } />
            <Route path="/myprofile" element={
              auth.token ? <PatientProfile /> : <Navigate to="/signin" />
            } />
            {/* Redirect unknown routes to home */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
