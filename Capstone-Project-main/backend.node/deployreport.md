# **Capstone Project Backend Deployment Report**
01/NOV 2024
### **Overview**

The backend of our Capstone Project has been deployed on an **AWS EC2** instance with a secure, maintainable architecture. This setup supports a **Node.js** and **Express** API, backed by **MySQL** and managed by **PM2** for high availability. **Nginx** serves as the reverse proxy, and **Cron** schedules automated tasks. SSL encryption is implemented with **Let’s Encrypt** for secure HTTPS communication.

---

### **Deployed Architecture**

1. **Compute Environment**
   - **Platform**: AWS EC2 instance
   - **Operating System**: Ubuntu 20.04 LTS
   - **Project Directory**: `/var/www/Capstone-Project`
   - **Backend Program Directory**: `/var/www/Capstone-Project/backend.node`

2. **Application Server (Node.js & Express)**
   - **Main Server Script**: `/var/www/Capstone-Project/backend.node/server.js`
   - **Environment Configuration**: Managed via a `.env` file located in the `backend.node` directory.
   - **Endpoints**: Provides API routes for user registration, authentication, appointment scheduling, and profile management.
   - **Cron-Scheduled Script**: A daily **populateAvailableTime.js** script is located in `/var/www/Capstone-Project/backend.node` and is configured to run automatically.

3. **Database Server (MySQL)**
   - **Database**: MySQL, installed on the same EC2 instance for optimized internal access.
   - **Configuration File**: Managed in the `.env` file to ensure secure access.
   - **Connection Pooling**: Configured to manage multiple queries efficiently.

4. **Process Management (PM2)**
   - **Primary Process**: Manages `server.js` at `/var/www/Capstone-Project/backend.node/server.js`, ensuring the application remains active.
   - **Configuration**: PM2 starts automatically on system reboot.
   - **Log Management**: Logs are accessible for ongoing maintenance and debugging.

5. **Reverse Proxy (Nginx)**
   - **Role**: Routes incoming HTTP/HTTPS requests to the Node.js backend on port 5001.
   - **SSL Configuration**: Manages SSL certificates via Let’s Encrypt for `fdu.xtrader.top`.
   - **Configuration File**: Located in `/etc/nginx/sites-available/fdu.xtrader.top`.

6. **SSL Encryption**
   - **Provider**: Let’s Encrypt via Certbot
   - **Domain**: `fdu.xtrader.top`
   - **Certificate Renewal**: Automatic with Certbot’s scheduled renewals.

---

### **Automated Task Scheduling**

- **Script**: `populateAvailableTime.js` (for daily scheduling tasks)
- **Location**: `/var/www/Capstone-Project/backend.node/populateAvailableTime.js`
- **Cron Job Configuration**:
  - Executes daily at 2 AM.
  - Logs execution output to `populateAvailableTime.log` in the `backend.node` directory.
  - **Cron Job Entry**:
    ```bash
    0 2 * * * cd /var/www/Capstone-Project/backend.node && /usr/bin/node populateAvailableTime.js >> /var/www/Capstone-Project/backend.node/populateAvailableTime.log 2>&1
    ```

### **Security Configurations**

1. **Firewall and Security Groups**
   - **Inbound Ports**: Open for HTTP (80), HTTPS (443), and SSH (22).
   - **SSH Restrictions**: Restricted to specific IP addresses.

2. **CORS Policy**
   - Configured to allow access only from `https://azadzamani.github.io` for secure API requests.

3. **HTTPS Enforcement**
   - Nginx automatically redirects HTTP traffic to HTTPS to secure all data transmissions.

### **Maintenance and Logging**

1. **PM2 Monitoring**
   - **Logs**: PM2 logs output and errors for `server.js`.
   - **Access Logs**: Available in PM2 and Nginx logs for efficient monitoring.

2. **Database Backup**
   - **MySQL Backups**: Scheduled using `mysqldump` to ensure data is backed up consistently.

3. **SSL Certificate Renewal**
   - Certbot renews SSL certificates automatically, verified through periodic tests.

### **Conclusion**

The backend is deployed with a secure, scalable configuration that supports automated tasks, SSL encryption, and efficient resource management. With detailed directory paths and automated scripts, this setup is ready for streamlined maintenance and further development.