// populateAvailableTime.js

const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

// Helper functions remain the same
function formatDate(date) {
  const year = date.getFullYear();
  const month = (`0${date.getMonth() + 1}`).slice(-2);
  const day = (`0${date.getDate()}`).slice(-2);
  return `${year}-${month}-${day}`;
}

function formatTime(hour) {
  return `${hour.toString().padStart(2, '0')}:00:00`;
}

async function populateAvailableTime() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'your_db_username',
      password: process.env.DB_PASSWORD || 'your_db_password',
      database: process.env.DB_NAME || 'clinic',
    });

    console.log('Connected to the database.');

    const deleteResult = await connection.execute(
      'DELETE FROM available_time WHERE ScheduleDate < CURDATE()'
    );
    console.log('Deleted expired available_time records.');

    // Retrieve all DoctorIDs
    const [doctors] = await connection.execute('SELECT DoctorID FROM doctors');
    if (doctors.length === 0) {
      console.log('No doctors found in the database. Please add doctors first.');
      await connection.end();
      return;
    }

    const doctorIDs = doctors.map(doc => doc.DoctorID);
    console.log(`Found ${doctorIDs.length} doctor(s).`);

    // Generate time slots for the next 10 days
    const today = new Date();
    const numberOfDays = 10;
    const dailyStartHour = 9;  // 9:00 AM
    const dailyEndHour = 16;   // 4:00 PM

    let totalInserts = 0;

    for (let dayOffset = 0; dayOffset < numberOfDays; dayOffset++) {
      const currentDate = new Date(today);
      currentDate.setDate(today.getDate() + dayOffset);
      const formattedDate = formatDate(currentDate);

      for (let hour = dailyStartHour; hour < dailyEndHour; hour++) {
        const startTime = formatTime(hour);
        const endTime = formatTime(hour + 1);

        for (const doctorID of doctorIDs) {
          const isAvailable = Math.random() < 0.7 ? 1 : 0; // 70% chance available
          await connection.execute(
            'INSERT INTO available_time (DoctorID, ScheduleDate, StartTime, EndTime, IsAvailable) VALUES (?, ?, ?, ?, ?)',
            [doctorID, formattedDate, startTime, endTime, isAvailable]
          );
          totalInserts++;
        }
      }
    }

    console.log(`Inserted ${totalInserts} available time slots into the database.`);
    await connection.end();
    console.log('Database connection closed.');
  } catch (error) {
    console.error('Error populating available time:', error.message);
    process.exit(1); 
  }
}

populateAvailableTime();
