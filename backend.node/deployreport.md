# **Capstone Project Backend Deployment Report**
2024/10/29

### **Overview**

The backend of our Capstone Project has been successfully deployed to an **AWS EC2 instance** with a scalable and secure architecture designed to handle our production environment's requirements. This deployment supports a **Node.js and Express** API, backed by a **MySQL** database, with traffic managed and secured through **Nginx** and **PM2**. SSL encryption has been implemented using **Let’s Encrypt** for secure HTTPS communication.

---

### **Deployed Architecture**

1. **Compute Environment**
   - **Platform**: AWS EC2 instance
   - **Operating System**: Ubuntu 20.04 LTS
   - **Application Manager**: PM2, for automatic process management and recovery

2. **Application Server (Node.js & Express)**
   - The backend server is built using **Node.js** and the **Express** framework.
   - **API Endpoints**: Includes routes for user registration, authentication, appointment scheduling, and profile management.
   - **Environment Configuration**: Managed via a `.env` file (not in version control) that stores sensitive configurations like database credentials and JWT secrets.

3. **Database Server (MySQL)**
   - **Database**: MySQL, hosted on the same EC2 instance for ease of access.
   - **Purpose**: Stores data related to patients, doctors, and appointment scheduling.
   - **Connection Pooling**: Configured to manage multiple connections efficiently and prevent resource overuse.

4. **Reverse Proxy (Nginx)**
   - **Role**: Acts as a reverse proxy, routing incoming requests from the domain to the Express application on port 5001.
   - **SSL Configuration**: HTTPS is enabled through Nginx with SSL certificates issued by Let’s Encrypt.
   - **Redirect**: HTTP traffic is automatically redirected to HTTPS to enforce secure communication.

5. **Process Management (PM2)**
   - **Functionality**: PM2 manages the Express application process, ensuring it remains active and automatically restarts in the event of a crash.
   - **Configuration**: PM2 is set to launch at system startup, ensuring persistent uptime.
   - **Logging**: PM2 provides centralized logging, making it easy to monitor and troubleshoot application performance.

6. **SSL Encryption**
   - **Provider**: Let’s Encrypt via Certbot
   - **Domain**: `fdu.xtrader.top`
   - **Renewal**: Certbot is configured to renew the SSL certificate automatically, ensuring uninterrupted HTTPS access.

7. **Custom Domain Configuration**
   - **Domain**: `fdu.xtrader.top`
   - **DNS Configuration**: A records point to the EC2 instance’s public IP.
   - **SSL-secured Access**: All traffic to the backend API is accessible through `https://fdu.xtrader.top`.

---

### **Security Configurations**

1. **Firewall and Security Groups**
   - **Inbound Rules**: Only ports 80 (HTTP), 443 (HTTPS), and 22 (SSH) are open to the public. SSH access is restricted to specific IPs.
   - **Outbound Rules**: Allow all outbound traffic to support necessary services and updates.

2. **CORS (Cross-Origin Resource Sharing)**
   - Configured to restrict API access to the frontend hosted on `https://azadzamani.github.io`.

3. **HTTPS Enforcement**
   - All traffic is redirected from HTTP to HTTPS through Nginx, protecting data in transit with SSL encryption.

### **Monitoring and Maintenance**

1. **Process Monitoring**
   - **PM2**: Manages the application lifecycle, automatically restarting processes as needed and monitoring system resource use.

2. **Logging and Debugging**
   - PM2 and Nginx logs are accessible for debugging and real-time monitoring:
     - **Application Logs**: PM2 logs in the application directory.
     - **Access Logs**: Nginx access and error logs are stored in `/var/log/nginx`.

3. **Database Backup**
   - Regular backups are planned using `mysqldump`, ensuring data safety and recoverability.

---

This deployment is stable and well-secured, with managed failover, SSL protection, and efficient resource allocation. This architecture supports future scalability and provides a reliable foundation for ongoing project maintenance.