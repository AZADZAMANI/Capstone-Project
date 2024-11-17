-- MySQL

-- ---------------------------
-- 1. Create the doctors table
-- ---------------------------
CREATE TABLE IF NOT EXISTS doctors (
    DoctorID INT AUTO_INCREMENT PRIMARY KEY,
    FullName VARCHAR(255) NOT NULL,
    MaxPatientNumber INT NOT NULL,
    CurrentPatientNumber INT NOT NULL DEFAULT 0
) ENGINE=InnoDB;

-- ---------------------------
-- 2. Create the patients table
-- ---------------------------
CREATE TABLE IF NOT EXISTS patients (
    PatientID INT AUTO_INCREMENT PRIMARY KEY,
    FullName VARCHAR(255) NOT NULL,
    BirthDate DATE NOT NULL,
    PhoneNumber VARCHAR(50) NOT NULL,
    Email VARCHAR(255) NOT NULL UNIQUE,
    Gender VARCHAR(20) NOT NULL,
    PasswordHash VARCHAR(255) NOT NULL,
    DoctorID INT,
    FOREIGN KEY (DoctorID) REFERENCES doctors(DoctorID)
        ON UPDATE CASCADE
        ON DELETE SET NULL
) ENGINE=InnoDB;

-- ---------------------------
-- 3. Create the available_time table
-- ---------------------------
CREATE TABLE IF NOT EXISTS available_time (
    AvailableTimeID INT AUTO_INCREMENT PRIMARY KEY,
    DoctorID INT NOT NULL,
    ScheduleDate DATE NOT NULL,
    StartTime TIME NOT NULL,
    EndTime TIME NOT NULL,
    IsAvailable TINYINT(1) NOT NULL DEFAULT 1,
    FOREIGN KEY (DoctorID) REFERENCES doctors(DoctorID)
        ON UPDATE CASCADE
        ON DELETE CASCADE
) ENGINE=InnoDB;

-- ---------------------------
-- 4. Create the appointments table
-- ---------------------------
CREATE TABLE IF NOT EXISTS appointments (
    AppointmentID INT AUTO_INCREMENT PRIMARY KEY,
    PatientID INT NOT NULL,
    DoctorID INT NOT NULL,
    AvailableTimeID INT NOT NULL,
    FOREIGN KEY (PatientID) REFERENCES patients(PatientID)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    FOREIGN KEY (DoctorID) REFERENCES doctors(DoctorID)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    FOREIGN KEY (AvailableTimeID) REFERENCES available_time(AvailableTimeID)
        ON UPDATE CASCADE
        ON DELETE CASCADE
) ENGINE=InnoDB;

-- ---------------------------
-- 5. Create Indexes for Performance
-- ---------------------------

-- Index on patients' Email for faster lookups during authentication
CREATE INDEX idx_patients_email ON patients(Email);

-- Index on appointments for patient-based queries
CREATE INDEX idx_appointments_patient_id ON appointments(PatientID);

-- Index on appointments for doctor-based queries
CREATE INDEX idx_appointments_doctor_id ON appointments(DoctorID);

-- Index on available_time for doctor-based availability checks
CREATE INDEX idx_available_time_doctor_id ON available_time(DoctorID);

-- ---------------------------
-- 6. Insert Initial Data into doctors Table
-- ---------------------------

-- Insert a default doctor if the table is empty
INSERT INTO doctors (FullName, MaxPatientNumber, CurrentPatientNumber)
SELECT 'Dr. John Smith', 100, 0 FROM dual
WHERE NOT EXISTS (SELECT 1 FROM doctors WHERE FullName = 'Dr. John Smith');

-- ---------------------------
-- 8. Create Triggers to Maintain CurrentPatientNumber
-- ---------------------------

DELIMITER //

-- Automatically update CurrentPatientNumber when a new patient is assigned to a doctor
CREATE TRIGGER trg_after_patient_insert
AFTER INSERT ON patients
FOR EACH ROW
BEGIN
    IF NEW.DoctorID IS NOT NULL THEN
        UPDATE doctors
        SET CurrentPatientNumber = CurrentPatientNumber + 1
        WHERE DoctorID = NEW.DoctorID;
    END IF;
END//

-- Automatically update CurrentPatientNumber when a patient is deleted
CREATE TRIGGER trg_after_patient_delete
AFTER DELETE ON patients
FOR EACH ROW
BEGIN
    IF OLD.DoctorID IS NOT NULL THEN
        UPDATE doctors
        SET CurrentPatientNumber = CurrentPatientNumber - 1
        WHERE DoctorID = OLD.DoctorID;
    END IF;
END//

-- Update CurrentPatientNumber when a patient's doctor changes
CREATE TRIGGER trg_after_patient_update
AFTER UPDATE ON patients
FOR EACH ROW
BEGIN
    IF OLD.DoctorID != NEW.DoctorID OR (OLD.DoctorID IS NULL AND NEW.DoctorID IS NOT NULL) OR (OLD.DoctorID IS NOT NULL AND NEW.DoctorID IS NULL) THEN
        -- Decrement the old doctor's count if there was one
        IF OLD.DoctorID IS NOT NULL THEN
            UPDATE doctors
            SET CurrentPatientNumber = CurrentPatientNumber - 1
            WHERE DoctorID = OLD.DoctorID;
        END IF;
        
        -- Increment the new doctor's count if there is one
        IF NEW.DoctorID IS NOT NULL THEN
            UPDATE doctors
            SET CurrentPatientNumber = CurrentPatientNumber + 1
            WHERE DoctorID = NEW.DoctorID;
        END IF;
    END IF;
END//

DELIMITER ;