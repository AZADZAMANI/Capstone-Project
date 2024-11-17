// src/pages/PatientProfile.js

import React, { useState, useEffect, useContext } from 'react';
import './PatientProfile.css';
import { AuthContext } from '../AuthContext';
import ConfirmModal from '../components/ConfirmModal'; // Import ConfirmModal

function PatientProfile() {
  const { auth } = useContext(AuthContext);
  const [patient, setPatient] = useState(null);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [appointmentHistory, setAppointmentHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  // States for Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [appointmentToCancel, setAppointmentToCancel] = useState(null);

  // Fetch patient data
  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        // Fetch patient details
        const patientResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/patients/${auth.user.id}`, {
          headers: {
            'Authorization': `Bearer ${auth.token}`,
          },
        });

        if (!patientResponse.ok) {
          throw new Error('Failed to fetch patient data');
        }

        const patientData = await patientResponse.json();
        setPatient(patientData);

        // Fetch upcoming appointments
        const upcomingResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/patients/${auth.user.id}/upcomingAppointments`, {
          headers: {
            'Authorization': `Bearer ${auth.token}`,
          },
        });

        if (!upcomingResponse.ok) {
          throw new Error('Failed to fetch upcoming appointments');
        }

        const upcomingData = await upcomingResponse.json();
        setUpcomingAppointments(upcomingData);

        // Fetch appointment history
        const historyResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/patients/${auth.user.id}/appointmentHistory`, {
          headers: {
            'Authorization': `Bearer ${auth.token}`,
          },
        });

        if (!historyResponse.ok) {
          throw new Error('Failed to fetch appointment history');
        }

        const historyData = await historyResponse.json();
        setAppointmentHistory(historyData);

        setLoading(false);
      } catch (err) {
        console.error('Error fetching patient data:', err);
        setError('Failed to fetch data. Please try again later.');
        setLoading(false);
      }
    };

    fetchPatientData();
  }, [auth.user.id, auth.token]);

  // Handle appointment cancellation
  const handleCancelAppointment = async () => {
    if (!appointmentToCancel) return;

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/appointments/${appointmentToCancel}/cancel`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${auth.token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to cancel appointment');
      }

      // Show success message and update the appointments list
      setMessage('Appointment canceled successfully.');
      setUpcomingAppointments(upcomingAppointments.filter(app => app.AppointmentID !== appointmentToCancel));
    } catch (error) {
      console.error('Error canceling appointment:', error);
      setError(error.message || 'Failed to cancel appointment. Please try again.');
    } finally {
      setIsModalOpen(false);
      setAppointmentToCancel(null);
    }
  };

  // Open the confirmation modal
  const openModal = (appointmentID) => {
    setAppointmentToCancel(appointmentID);
    setIsModalOpen(true);
  };

  // Close the confirmation modal
  const closeModal = () => {
    setIsModalOpen(false);
    setAppointmentToCancel(null);
  };

  if (loading) {
    return <div className="patient-profile">Loading patient data...</div>;
  }

  if (error) {
    return <div className="patient-profile">{error}</div>;
  }

  if (!patient) {
    return <div className="patient-profile">No patient data available.</div>;
  }

  return (
    <div className="patient-profile">
      <h1>Welcome back, {patient.FullName}</h1>
      <h2>Welcome to Destination Health. How can we help you today?</h2>

      {/* Display messages */}
      {message && <div className="message success">{message}</div>}
      {error && <div className="message error">{error}</div>}

      {/* Patient Details */}
      <section className="patient-details">
        <h3>Your Details</h3>
        <p><strong>Full Name:</strong> {patient.FullName}</p>
        <p><strong>Email:</strong> {patient.Email}</p>
        <p><strong>Phone Number:</strong> {patient.PhoneNumber}</p>
        <p><strong>Birth Date:</strong> {patient.BirthDate}</p>
        <p><strong>Gender:</strong> {patient.Gender}</p>
      </section>

      {/* Upcoming Appointments */}
      <section className="appointments-section">
        <h3>Upcoming Appointments</h3>
        <table className="appointments-table">
          <thead>
            <tr>
              <th>Doctor</th>
              <th>Date</th>
              <th>Time</th>
              <th>Cancellation</th>
            </tr>
          </thead>
          <tbody>
            {upcomingAppointments && upcomingAppointments.length > 0 ? (
              upcomingAppointments.map((appointment) => (
                <tr key={appointment.AppointmentID}>
                  <td>{appointment.doctor}</td>
                  <td>{appointment.date}</td>
                  <td>{`${appointment.startTime} - ${appointment.endTime}`}</td>
                  <td>
                    <button
                      onClick={() => openModal(appointment.AppointmentID)}
                      className="cancel-button"
                    >
                      Cancel
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4">No upcoming appointments.</td>
              </tr>
            )}
          </tbody>
        </table>
      </section>

      {/* Appointment History */}
      <section className="history-section">
        <h3>Appointment History</h3>
        <table className="history-table">
          <thead>
            <tr>
              <th>Doctor</th>
              <th>Date</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {appointmentHistory && appointmentHistory.length > 0 ? (
              appointmentHistory.map((appointment) => (
                <tr key={appointment.AppointmentID}>
                  <td>{appointment.doctor}</td>
                  <td>{appointment.date}</td>
                  <td>{appointment.time}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3">No appointment history.</td>
              </tr>
            )}
          </tbody>
        </table>
      </section>

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        onConfirm={handleCancelAppointment}
        title="Confirm Cancellation"
        message="Are you sure you want to cancel this appointment?"
        confirmText="Yes, Cancel"
        cancelText="No, Go Back"
      />
    </div>
  );
}

export default PatientProfile;
