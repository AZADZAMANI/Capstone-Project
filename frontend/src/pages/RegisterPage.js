// /frontend/src/pages/RegisterPage.js

import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import './RegisterPage.css';
import '../common.css';
import { AuthContext } from '../AuthContext'; // Import AuthContext

function RegisterPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    birthdate: '',
    gender: '',
    phoneNumber: '',
    email: '',
    password: '',
    selectedDoctor: '',
    termsAccepted: false, // Added to track checkbox
  });

  const [doctorList, setDoctorList] = useState([]);
  const [loadingDoctors, setLoadingDoctors] = useState(true);
  const [error, setError] = useState('');
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  const navigate = useNavigate();

  // Fetch the list of doctors from the backend when the component mounts
  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/api/doctors`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch doctors');
        }
        return response.json();
      })
      .then((data) => {
        setDoctorList(data);
        setLoadingDoctors(false);
      })
      .catch((err) => {
        console.error(err);
        setError('Unable to load doctors. Please try again later.');
        setLoadingDoctors(false);
      });
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleCheckboxChange = (e) => {
    setFormData({
      ...formData,
      termsAccepted: e.target.checked,
    });
  };

  const handleDoctorSelection = (e) => {
    setFormData({
      ...formData,
      selectedDoctor: e.target.value,
    });
  };

  // Validate form fields
  const isFormValid =
    formData.fullName &&
    formData.birthdate &&
    formData.gender &&
    formData.phoneNumber &&
    formData.email &&
    formData.password &&
    formData.selectedDoctor &&
    formData.termsAccepted;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!isFormValid) {
      setError('Please fill in all required fields and accept the terms.');
      return;
    }

    // Prepare the data to be sent to the backend
    const payload = {
      fullName: formData.fullName,
      birthdate: formData.birthdate,
      gender: formData.gender,
      phoneNumber: formData.phoneNumber,
      email: formData.email,
      password: formData.password,
      selectedDoctor: formData.selectedDoctor,
    };

    fetch(`${process.env.REACT_APP_API_URL}/api/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || 'Registration failed');
        }
        return data;
      })
      .then((data) => {
        setRegistrationSuccess(true);
        // Redirect to sign-in page after a delay
        setTimeout(() => {
          navigate('/signin'); // Changed from '/myprofile' to '/signin'
        }, 2000);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message || 'An unexpected error occurred');
      });
  };

  return (
    <div className="register-page">
      <div className="form-container">
        <h1>New Patient Registration Form</h1>
        <h2>Welcome to Destination Health</h2>
        {error && <div className="error-message">{error}</div>}
        {registrationSuccess && (
          <div className="success-message">
            Registration successful! Redirecting to sign-in...
          </div>
        )}
        <form className="registration-form" onSubmit={handleSubmit}>
          <label>
            Full Name:
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              required
            />
          </label>
          <label>
            Birthdate:
            <input
              type="date"
              name="birthdate"
              value={formData.birthdate}
              onChange={handleInputChange}
              required
            />
          </label>
          <label>
            Gender:
            <select
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
              required
            >
              <option value="">-- Please Select Gender --</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
              <option value="Prefer not to say">Prefer not to say</option>
            </select>
          </label>
          <label>
            Phone Number:
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              required
              pattern="[0-9]{10}"
              placeholder="e.g., 1234567890"
            />
          </label>
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
              minLength="6"
              placeholder="Minimum 6 characters"
            />
          </label>
          <label>
            Select Doctor:
            <div className="custom-select">
              {loadingDoctors ? (
                <p>Loading doctors...</p>
              ) : doctorList.length > 0 ? (
                <select
                  name="selectedDoctor"
                  value={formData.selectedDoctor}
                  onChange={handleDoctorSelection}
                  required
                >
                  <option value="">-- Please Select a Doctor --</option>
                  {doctorList.map((doctor) => (
                    <option
                      key={doctor.DoctorID}
                      value={doctor.DoctorID}
                      disabled={doctor.CurrentPatientNumber >= doctor.MaxPatientNumber}
                    >
                      {doctor.FullName} (
                      {doctor.CurrentPatientNumber}/{doctor.MaxPatientNumber} Patients)
                      {doctor.CurrentPatientNumber >= doctor.MaxPatientNumber
                        ? ' - Full'
                        : ''}
                    </option>
                  ))}
                </select>
              ) : (
                <p>No doctors available at the moment.</p>
              )}
            </div>
          </label>
          <label className="terms-checkbox">
            <input
              type="checkbox"
              name="termsAccepted"
              checked={formData.termsAccepted || false} // Ensure default is false
              onChange={handleCheckboxChange}
              required
            />
            I accept the terms and conditions
          </label>
          <button type="submit" disabled={!isFormValid || loadingDoctors}>
            Register
          </button>
        </form>
      </div>
    </div>
  );
}

export default RegisterPage;
