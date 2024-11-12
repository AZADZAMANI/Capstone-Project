import React,{useState,useContext, useEffect} from 'react';
import { AuthContext } from '../AuthContext';
import './PatientProfile.css';
import './StaffPortal.css';
const StaffPortal =  () => {
    const { auth } = useContext(AuthContext); 
    const [upcomingAppointments, setUpcomingAppointments] = useState([]);

const getUpcomingApp = async () => {
  try {
    const res = await fetch(`${process.env.REACT_APP_API_URL}/api/doctors/${auth.user.id}/upcomingAppointments`, {
      headers: {
        'Authorization': `Bearer ${auth.token}`,
      },
    });
    
    const data = await res.json();  // Await the JSON parsing
    setUpcomingAppointments(data);  // Set the parsed data to state
  } catch (err) {
    alert(err);
  }
};

useEffect(() => {
  getUpcomingApp();
}, []);  // Empty dependency array to run only on mount

const handleDelete = async (appointmentid) =>{
  try {
    const res = await fetch(`${process.env.REACT_APP_API_URL}/api/appointments/${appointmentid}/cancel`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${auth.token}`,
      },
    });
    
    const data = await res.json();
    if(data)
    {
      getUpcomingApp();
    }
  } catch (err) {
    alert(err);
  }
}

    return(
        <div>
            
            <section className="appointments-section" style={{width:"90%",textAlign:"center"}}>
        <h3>Upcoming Appointments</h3>
        <table >
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
            upcomingAppointments.length>0 ?
            upcomingAppointments.map((appointment) =>
                (<tr key={appointment.AppointmentID}>
                <td>{appointment.patients}</td>
                <td>{appointment.date}</td>
                <td>{`${appointment.startTime} - ${appointment.endTime}`}</td>
                <td><button onClick={()=>handleDelete(appointment.AppointmentID)}> Cancel</button></td>
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
        </div>
    )
}
export default StaffPortal;