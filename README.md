# Capstone Project

CSCI6806.V1 Computer Science Graduate Capstone Project

## Table of Contents
- [Capstone Project](#capstone-project)
  - [Table of Contents](#table-of-contents)
    - [Frontend Setup](#frontend-setup)
    - [Backend Setup](#backend-setup)
    - [Database Setup](#database-setup)
    - [Deployment](#deployment)
    - [Accessing EC2 Instance](#accessing-ec2-instance)
    - [Connecting to AWS RDS](#connecting-to-aws-rds)

---

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Create `.env.development` with:
   ```plaintext
   REACT_APP_API_URL=http://localhost:5001
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the frontend locally:
   ```bash
   npm start
   ```
5. To deploy to GitHub Pages:
   - Ensure code is bug-free.
   - Create `.env.production` with:
     ```plaintext
     REACT_APP_API_URL=https://fdu.xtader.top
     ```
   - Deploy:
     ```bash
     npm run deploy
     ```

### Backend Setup
1. Start MySQL locally.
2. Navigate to the backend directory:
   ```bash
   cd backend.node
   ```
3. Create `.env` with:
   ```plaintext
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=yourpassword
   DB_NAME=databasename
   PORT=5001
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRES_IN=7d
   ```
4. Start the backend server:
   ```bash
   node server.js
   ```
   - This initializes tables and inserts sample data into the `doctors` table.

5. Populate available time slots:
   ```bash
   node populateAvailableTime.js
   ```

### Database Setup
1. Install MySQL and start the service.
2. Create a database with the required attributes (database name, username, password, etc.).
3. Tables are created automatically by the backend server.

### Deployment
1. Connect to your AWS EC2 instance using SSH:
   ```bash
   ssh -i "C:\Coding\awsEC2key.pem" ubuntu@ec2-18-188-76-254.us-east-2.compute.amazonaws.com
   ```
2. To update the backend (`server.js`) on EC2:
   ```bash
   cd /var/www/Capstone-Project
   git pull
   pm2 restart all
   ```

### Accessing EC2 Instance
- Use `awsEC2key.pem` for secure access.
- Please request the key file from Simon if needed.

### Connecting to AWS RDS
1. After connecting to the EC2 instance:
   ```bash
   mysql -h capstone-database.czmic0m6sses.us-east-2.rds.amazonaws.com -P 3306 -u group7 -p
   ```
2. Enter the RDS password when prompted.
   
    password:phw5F5KVNDxZcb3XyBEl

--- 
