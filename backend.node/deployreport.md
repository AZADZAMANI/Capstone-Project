# **Capstone Project Backend Deployment Report**
Oct 29, 2024
### **Overview**

The backend of our Capstone Project has been deployed on an **AWS EC2** instance with a robust, secure architecture designed for production. This deployment supports a **Node.js** and **Express.js** API, backed by **MySQL**, managed via **PM2** for application uptime, with **Nginx** as a reverse proxy, and **Cron** jobs for scheduled tasks. SSL encryption is implemented using **Let’s Encrypt** to secure HTTP communications.

---

### **Deployed Architecture**

1. **Compute Environment**
   - **Platform**: AWS EC2 instance
   - **Operating System**: Ubuntu 20.04 LTS
   - **Process Manager**: PM2 for maintaining high availability and automated recovery.

2. **Application Server (Node.js & Express)**
   - **Framework**: Express handles API requests.
   - **Environment Configuration**: Managed via a `.env` file with variables like database credentials and JWT secrets.
   - **Scheduled Script**: A new **populateAvailableTime.js** script has been added and configured to run daily using **Cron**.

3. **Database Server (MySQL)**
   - **Database**: MySQL, on the same EC2 instance for optimized access.
   - **Connection Pooling**: Efficiently manages multiple requests without overloading resources.

4. **Reverse Proxy (Nginx)**
   - **Role**: Acts as a reverse proxy, forwarding requests from `fdu.xtrader.top` to the Express application on port 5001.
   - **SSL Configuration**: Configured with Let’s Encrypt for HTTPS, enforcing encrypted connections.

5. **Process Management (PM2)**
   - **Purpose**: Manages the Node.js backend, restarts on failure, and ensures the application starts at boot.
   - **Logging**: Logs application output and error messages, available for debugging.

6. **Automated Cron Job**
   - **Script**: `populateAvailableTime.js`, scheduled to run daily at 2 AM to automate tasks related to available time slots.
   - **Cron Configuration**:
     - Executes with `node` and logs to `populateAvailableTime.log` for easy review of execution results.
     - **Path**: The cron job changes to the backend directory before running to ensure the `.env` file loads correctly.

7. **SSL Encryption**
   - **Provider**: Let’s Encrypt with Certbot
   - **Domain**: `fdu.xtrader.top`
   - **Renewal**: Automated with Certbot, ensuring uninterrupted HTTPS access.

8. **Custom Domain Configuration**
   - **Domain**: `fdu.xtrader.top`
   - **DNS Configuration**: Points A record to the EC2 instance’s public IP for consistent accessibility.

---

### **Security Configurations**

1. **Firewall and Security Groups**
   - **Inbound Rules**: Only ports 80 (HTTP), 443 (HTTPS), and 22 (SSH) are open. SSH access is restricted to specific IPs for security.
   - **Outbound Rules**: Permit all outbound traffic to support services and updates.

2. **CORS Policy**
   - **Origin Restriction**: Limits API access to the frontend hosted at `https://azadzamani.github.io`.

3. **HTTPS Enforcement**
   - Nginx redirects all HTTP traffic to HTTPS, ensuring secure data transmission.

### **Maintenance Configuration**

1. **Process Monitoring**
   - **PM2**: Ensures continuous runtime, with automatic process restarts if necessary.
   - **Logging**: Both PM2 and Nginx logs facilitate monitoring and troubleshooting:
     - **Application Logs**: Available through PM2 for application-specific events.
     - **Nginx Logs**: Access and error logs available at `/var/log/nginx`.

2. **Automated Daily Script Execution**
   - **Cron Job**: Automates the `populateAvailableTime.js` script to run daily at 2 AM.
   - **Log Output**: Results are saved to `populateAvailableTime.log` in the backend directory, confirming task completion and assisting with troubleshooting.

3. **Database Backup**
   - **Scheduled Backups**: Database backups are planned via `mysqldump` to ensure data recoverability.

4. **SSL Renewal**
   - Certbot’s cron job handles SSL renewal, with testing using:
     ```bash
     sudo certbot renew --dry-run
     ```

### **Conclusion**

This deployment provides a scalable, secure, and reliable backend for the Capstone Project, with automated daily scripts and managed failover. This architecture is prepared for future scaling and supports efficient maintenance routines for ongoing backend stability.