import React from 'react';

function AppointmentCard({ appointments }) {
  return (
    <div className="card appointment-card">
      <h3>Upcoming Appointments</h3>
      <button className="book-now-btn">Book Now</button>
      <ul className="appointment-list">
        {appointments.map((appointment, index) => (
          <li key={index}>
            <p>Doctor: {appointment.doctor}</p>
            <p>Date: {appointment.date}</p>
            <p>Time: {appointment.startTime} - {appointment.endTime}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AppointmentCard;