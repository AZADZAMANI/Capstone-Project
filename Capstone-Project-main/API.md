# Capstone Project API Documentation

## Overview
The Capstone Project API is built with Node.js and Express, providing endpoints for user registration, authentication, appointment booking, cancellation, and profile management. JWT tokens secure patient and doctor data access.

---

## Table of Contents
- [Authentication](#authentication)
- [Doctors](#doctors)
- [Patients](#patients)
- [Appointments](#appointments)

---

### Authentication

#### 1. Patient Sign In
- **Endpoint**: `/api/signin`
- **Method**: `POST`
- **Description**: Logs in a patient and issues a JWT token.
- **Request Body**:
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```
- **Response**:
  ```json
  {
    "message": "Sign-in successful",
    "token": "string",
    "user": {
      "id": "int",
      "FullName": "string",
      "Email": "string",
      "role": "patient"
    }
  }
  ```

#### 2. Doctor Sign In
- **Endpoint**: `/api/doctor_signin`
- **Method**: `POST`
- **Description**: Logs in a doctor and issues a JWT token.
- **Request Body**:
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```
- **Response**:
  ```json
  {
    "message": "Doctor sign-in successful",
    "token": "string",
    "user": {
      "id": "int",
      "FullName": "string",
      "Email": "string",
      "role": "doctor"
    }
  }
  ```

---

### Doctors

#### 1. Get All Doctors
- **Endpoint**: `/api/doctors`
- **Method**: `GET`
- **Description**: Retrieves a list of all registered doctors.
- **Response**:
  ```json
  [
    {
      "DoctorID": "int",
      "FullName": "string",
      "Email": "string",
      "MaxPatientNumber": "int",
      "CurrentPatientNumber": "int"
    }
  ]
  ```

---

### Patients

#### 1. Register Patient
- **Endpoint**: `/api/register`
- **Method**: `POST`
- **Description**: Registers a new patient and assigns them to a selected doctor.
- **Request Body**:
  ```json
  {
    "fullName": "string",
    "birthdate": "string (YYYY-MM-DD)",
    "gender": "Male | Female | Other",
    "phoneNumber": "string",
    "email": "string",
    "password": "string",
    "selectedDoctor": "int"
  }
  ```
- **Response**:
  ```json
  {
    "message": "Patient registered successfully",
    "patientId": "int"
  }
  ```

#### 2. Get Patient Profile
- **Endpoint**: `/api/patients/:id`
- **Method**: `GET`
- **Description**: Retrieves profile details of a specific patient.
- **Headers**: 
  - `Authorization`: `Bearer {token}`
- **Response**:
  ```json
  {
    "PatientID": "int",
    "FullName": "string",
    "BirthDate": "string (YYYY-MM-DD)",
    "PhoneNumber": "string",
    "Email": "string",
    "Gender": "Male | Female | Other",
    "DoctorID": "int"
  }
  ```

#### 3. Get Patient’s Upcoming Appointments
- **Endpoint**: `/api/patients/:id/upcomingAppointments`
- **Method**: `GET`
- **Description**: Retrieves a list of upcoming appointments with status `'Booked'` for a specific patient.
- **Headers**: 
  - `Authorization`: `Bearer {token}`
- **Response**:
  ```json
  [
    {
      "AppointmentID": "int",
      "doctor": "string",
      "date": "string (YYYY-MM-DD)",
      "startTime": "string (HH:MM)",
      "endTime": "string (HH:MM)"
    }
  ]
  ```

#### 4. Get Patient’s Appointment History
- **Endpoint**: `/api/patients/:id/appointmentHistory`
- **Method**: `GET`
- **Description**: Retrieves a list of all past appointments for a specific patient, including their status.
- **Headers**: 
  - `Authorization`: `Bearer {token}`
- **Response**:
  ```json
  [
    {
      "AppointmentID": "int",
      "doctor": "string",
      "date": "string (YYYY-MM-DD)",
      "time": "string (HH:MM)",
      "Status": "Booked | Canceled"
    }
  ]
  ```

---

### Appointments

#### 1. Get Available Time Slots
- **Endpoint**: `/api/available_times`
- **Method**: `GET`
- **Description**: Retrieves available time slots for a patient's assigned doctor.
- **Headers**: 
  - `Authorization`: `Bearer {token}`
- **Response**:
  ```json
  [
    {
      "AvailableTimeID": "int",
      "DoctorID": "int",
      "ScheduleDate": "string (YYYY-MM-DD)",
      "StartTime": "string (HH:MM)",
      "EndTime": "string (HH:MM)"
    }
  ]
  ```

#### 2. Book Appointment
- **Endpoint**: `/api/book_appointment`
- **Method**: `POST`
- **Description**: Books an appointment for the patient in an available time slot.
- **Headers**: 
  - `Authorization`: `Bearer {token}`
- **Request Body**:
  ```json
  {
    "availableTimeID": "int"
  }
  ```
- **Response**:
  ```json
  {
    "message": "Appointment booked successfully",
    "appointment": {
      "AppointmentID": "int",
      "DoctorID": "int",
      "ScheduleDate": "string (YYYY-MM-DD)",
      "StartTime": "string (HH:MM)",
      "EndTime": "string (HH:MM)"
    }
  }
  ```

#### 3. Cancel Appointment
- **Endpoint**: `/api/appointments/:appointmentID/cancel`
- **Method**: `POST`
- **Description**: Cancels an existing appointment. Once canceled, the appointment cannot be restored.
- **Headers**: 
  - `Authorization`: `Bearer {token}`
- **URL Parameters**:
  - `appointmentID`: The ID of the appointment to cancel.
- **Response**:
  ```json
  {
    "message": "Appointment canceled successfully"
  }
  ```
- **Notes**:
  - Only the patient who booked the appointment can cancel it.
  - The corresponding time slot will be made available for booking by others.

---

### Error Handling

- All endpoints may return the following error responses:

  - **400 Bad Request**: Missing or invalid parameters.
    ```json
    {
      "error": "Error message detailing what went wrong."
    }
    ```

  - **401 Unauthorized**: Missing or invalid authentication token.
    ```json
    {
      "message": "Access token missing or invalid."
    }
    ```

  - **403 Forbidden**: The user does not have permission to perform the action.
    ```json
    {
      "message": "Access denied."
    }
    ```

  - **404 Not Found**: The requested resource does not exist.
    ```json
    {
      "error": "Resource not found."
    }
    ```

  - **500 Internal Server Error**: An unexpected error occurred on the server.
    ```json
    {
      "error": "Internal server error."
    }
    ```

---

### Additional Notes

- **Authentication**: All protected routes require an `Authorization` header with a valid JWT token in the format `Bearer {token}`.

- **Data Consistency**: The API uses transactions to ensure data integrity, especially when booking or canceling appointments.

- **Appointment Status**:

  - Appointments have a `Status` field that can be either `'Booked'` or `'Canceled'`.
  - Once an appointment is canceled, it cannot be restored or rebooked.

- **Time Formats**:

  - Dates are in `YYYY-MM-DD` format.
  - Times are in `HH:MM` 24-hour format.

---
