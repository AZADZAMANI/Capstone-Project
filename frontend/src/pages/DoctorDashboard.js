// src/pages/DoctorDashboard.js

import React, { useContext } from 'react';
import { AuthContext } from '../AuthContext';
import { Navigate } from 'react-router-dom';
import './DoctorDashboard.css'; // Create this CSS file for styling if needed
import StaffPortal from './StaffPortal';

function DoctorDashboard() {
  const { auth } = useContext(AuthContext);

  // Check if the user is a doctor
  if (!auth.user || auth.user.role !== 'doctor') {
    return <Navigate to="/signin" />;
  }

  return (
    <div className="doctor-dashboard">
      <h1>Doctor Dashboard</h1>
      <p>Welcome, {auth.user.FullName}!</p>
      {/* Additional functionalities can be added here in the future */}
      <StaffPortal/>
    </div>
  );
}

export default DoctorDashboard;
