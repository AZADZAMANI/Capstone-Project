// /frontend/src/pages/BookAppointmentPage.js

import React, { useState, useEffect, useContext } from 'react';
import './BookAppointmentPage.css';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext'; // Import AuthContext

function BookAppointmentPage() {
  const { auth } = useContext(AuthContext); // Access auth state
  const [availableTimes, setAvailableTimes] = useState([]);
  const [uniqueDates, setUniqueDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [availableTimesForDate, setAvailableTimesForDate] = useState([]);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [doctorName, setDoctorName] = useState('');

  const navigate = useNavigate();

  // Fetch available time slots and doctors list on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch available time slots
        const timesResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/available_times`, {
          headers: {
            'Authorization': `Bearer ${auth.token}`,
          },
        });

        if (!timesResponse.ok) {
          throw new Error('Failed to fetch available time slots');
        }

        const timesData = await timesResponse.json();
        setAvailableTimes(timesData);

        // Extract unique dates and sort them
        const dates = [...new Set(timesData.map(slot => slot.ScheduleDate))].sort();
        setUniqueDates(dates);

        // Fetch doctors list to get doctor's name
        const doctorsResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/doctors`, {
          headers: {
            'Authorization': `Bearer ${auth.token}`,
          },
        });

        if (!doctorsResponse.ok) {
          throw new Error('Failed to fetch doctors');
        }

        const doctorsData = await doctorsResponse.json();

        // Assuming all available times belong to the same doctor
        if (timesData.length > 0) {
          const doctorID = timesData[0].DoctorID;
          const doctor = doctorsData.find(doc => doc.DoctorID === doctorID);
          setDoctorName(doctor ? doctor.FullName : 'Unknown Doctor');
        } else {
          setDoctorName('No Doctor Assigned');
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setMessage({ type: 'error', text: error.message });
        setLoading(false);
      }
    };

    if (auth.user && auth.token) {
      fetchData();
    } else {
      navigate('/signin'); // Redirect to sign-in if not authenticated
    }
  }, [auth.token, auth.user, navigate]);

  // Handle date selection
  const handleDateChange = (e) => {
    const date = e.target.value;
    setSelectedDate(date);
    const filteredTimes = availableTimes.filter(slot => slot.ScheduleDate === date);
    setAvailableTimesForDate(filteredTimes);
    // Reset selected time when date changes
    setSelectedTimeID('');
  };

  // State to track selected time slot
  const [selectedTimeID, setSelectedTimeID] = useState('');

  const handleTimeChange = (e) => {
    setSelectedTimeID(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedTimeID) {
      setMessage({ type: 'error', text: 'Please select a time slot to book.' });
      return;
    }

    setBooking(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/book_appointment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth.token}`,
        },
        body: JSON.stringify({ availableTimeID: parseInt(selectedTimeID, 10) }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to book appointment');
      }

      setMessage({ type: 'success', text: 'Appointment booked successfully!' });

      // Optionally, you can wait for a moment before redirecting
      setTimeout(() => {
        navigate('/myprofile');
      }, 2000);
    } catch (error) {
      console.error('Error booking appointment:', error);
      setMessage({ type: 'error', text: error.message || 'Failed to book appointment. Please try again.' });
    } finally {
      setBooking(false);
    }
  };

  // Helper function to get day of the week
  const getDayOfWeek = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'long' });
  };

  return (
    <div className="book-appointment-page">
      <div className="booking-container">
        <h1>Book an Appointment</h1>

        {doctorName && (
          <div className="doctor-info">
            <strong>Doctor:</strong> {doctorName}
          </div>
        )}

        {message.text && (
          <div className={`message ${message.type === 'success' ? 'success' : 'error'}`}>
            {message.text}
          </div>
        )}

        {loading ? (
          <p>Loading available time slots...</p>
        ) : uniqueDates.length > 0 ? (
          <form className="booking-form" onSubmit={handleSubmit}>
            {/* Step 1: Select Date */}
            <label htmlFor="dateSelect">Select a Date:</label>
            <select
              id="dateSelect"
              value={selectedDate}
              onChange={handleDateChange}
              required
            >
              <option value="">-- Select a Date --</option>
              {uniqueDates.map((date) => (
                <option key={date} value={date}>
                  {date} ({getDayOfWeek(date)})
                </option>
              ))}
            </select>

            {/* Step 2: Select Time Slot */}
            {selectedDate && (
              <>
                <label htmlFor="timeSelect">Select a Time Slot:</label>
                <select
                  id="timeSelect"
                  value={selectedTimeID}
                  onChange={handleTimeChange}
                  required
                >
                  <option value="">-- Select a Time Slot --</option>
                  {availableTimesForDate.map((slot) => (
                    <option key={slot.AvailableTimeID} value={slot.AvailableTimeID}>
                      {`${slot.StartTime} - ${slot.EndTime}`}
                    </option>
                  ))}
                </select>
              </>
            )}

            <button type="submit" disabled={booking}>
              {booking ? 'Booking...' : 'Book Appointment'}
            </button>
          </form>
        ) : (
          <p>No available time slots at the moment. Please check back later.</p>
        )}
      </div>
    </div>
  );
}

export default BookAppointmentPage;
