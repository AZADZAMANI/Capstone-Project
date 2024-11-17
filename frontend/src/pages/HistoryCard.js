import React from 'react';

function HistoryCard({ history }) {
  return (
    <div className="card history-card">
      <h3>History</h3>
      <ul className="history-list">
        {history.map((appointment, index) => (
          <li key={index}>
            <p>Doctor: {appointment.doctor}</p>
            <p>Date: {appointment.date}</p>
            <p>Time: {appointment.time}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default HistoryCard;