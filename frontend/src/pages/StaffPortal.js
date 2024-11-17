// src/pages/StaffPortal.js

import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../AuthContext';
import './StaffPortal.css';
import ConfirmModal from '../components/ConfirmModal'; // Import ConfirmModal

const StaffPortal = () => {
  const { auth } = useContext(AuthContext);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [error, setError] = useState(null);

  // States for Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [appointmentToCancel, setAppointmentToCancel] = useState(null);

  const getUpcomingApp = async () => {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/doctors/${auth.user.id}/upcomingAppointments`, {
        headers: {
          'Authorization': `Bearer ${auth.token}`,
        },
      });

      if (!res.ok) {
        throw new Error('Failed to fetch upcoming appointments');
      }

      const data = await res.json();
      setUpcomingAppointments(data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch appointments. Please try again later.');
    }
  };

  useEffect(() => {
    getUpcomingApp();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array to run only on mount

  const handleDelete = async () => {
    if (!appointmentToCancel) return;

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/appointments/${appointmentToCancel}/cancel`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${auth.token}`,
        },
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to cancel appointment');
      }

      // Optionally, show a success message here
      getUpcomingApp();
    } catch (err) {
      alert(err.message || 'An error occurred while cancelling the appointment.');
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

  return (
    <div>
      <section className="appointments-section" style={{ width: "90%", textAlign: "center" }}>
        <h3>Upcoming Appointments</h3>
        {error && <div className="error-message">{error}</div>}
        <table>
          <thead>
            <tr>
              <th>Patient</th>
              <th>Date</th>
              <th>Time</th>
              <th>Cancellation</th>
            </tr>
          </thead>
          <tbody>
            {
              upcomingAppointments.length > 0 ?
                upcomingAppointments.map((appointment) =>
                  (<tr key={appointment.AppointmentID}>
                    <td>{appointment.patients}</td>
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
                  </tr>)
                )
                :
                (
                  <tr>
                    <td colSpan="4">No upcoming appointments.</td>
                  </tr>
                )
            }
          </tbody>
        </table>
      </section>

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        onConfirm={handleDelete}
        title="Confirm Cancellation"
        message="Are you sure you want to cancel this appointment?"
        confirmText="Yes, Cancel"
        cancelText="No, Go Back"
      />
    </div>
  );
};

export default StaffPortal;
