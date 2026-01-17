# 🚀 Casino - Production Deployment Guide

This guide walks through deploying the Casino platform to Ubuntu 24.04 LTS with Nginx.

## Prerequisites

- Ubuntu 24.04 LTS server with sudo access
- Domain name (for SSL/HTTPS)
- 2GB+ RAM and 5GB+ disk space
- Basic Linux/SSH knowledge

## Phase 1: System Preparation (30 minutes)

### 1.1 Update System

```bash
sudo apt update
sudo apt upgrade -y
sudo apt autoremove -y
```

### 1.2 Install Node.js 20 LTS

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
node --version  # Should be v20.x.x
npm --version   # Should be 10.x.x
```

### 1.3 Install Nginx

```bash
sudo apt install -y nginx
sudo systemctl enable nginx
sudo systemctl start nginx
sudo nginx -v
```

### 1.4 Install SQLite3

```bash
sudo apt install -y sqlite3
sqlite3 --version
```

### 1.5 Install Git (Optional)

```bash
sudo apt install -y git
git --version
```

## Phase 2: Project Setup (15 minutes)

### 2.1 Create Application Directory

```bash
sudo mkdir -p /var/www/casino
sudo chown $(whoami):$(whoami) /var/www/casino
cd /var/www/casino
```

### 2.2 Clone or Copy Project Files

**Option A: Using Git**
```bash
git clone https://github.com/tristan5983/casino.git .
```

**Option B: Copy files manually**
```bash
# Copy your project files to /var/www/casino/
# Structure should be:
# /var/www/casino/backend/
# /var/www/casino/frontend/
# /var/www/casino/nginx/
# /var/www/casino/systemd/
# /var/www/casino/README.md
```

### 2.3 Verify Project Structure

```bash
ls -la /var/www/casino/
# Should show: backend/, frontend/, nginx/, systemd/, README.md
```

## Phase 3: Backend Setup (20 minutes)

### 3.1 Install Backend Dependencies

```bash
cd /var/www/casino/backend
npm install --production

# This installs: express, sqlite3, jsonwebtoken, bcryptjs, cors, dotenv
```

### 3.2 Configure Environment Variables

```bash
nano /var/www/casino/backend/.env
```

Update to production values:
```
PORT=5000
JWT_SECRET=your_production_secret_key_change_this_32_char_min_!@#$%
NODE_ENV=production
FRONTEND_URL=https://yourdomain.com
DATABASE_PATH=./casino.db
```

**Important**: Generate a strong JWT_SECRET:
```bash
# Generate random string
openssl rand -base64 32
```

### 3.3 Verify Backend Works

```bash
cd /var/www/casino/backend
node src/server.js

# Should output: 🎰 Casino Backend running on port 5000
# Press Ctrl+C to stop
```

## Phase 4: Frontend Setup (20 minutes)

### 4.1 Install Frontend Dependencies

```bash
cd /var/www/casino/frontend
npm install --production
```

### 4.2 Build Frontend

```bash
npm run build

# Should create dist/ folder (2-5MB)
ls -la dist/
du -sh dist/
```

### 4.3 Verify Build

```bash
# List built files
find dist/ -type f | head -20

# Check that it's not empty
if [ -d "dist" ] && [ "$(ls -A dist/)" ]; then
  echo "✓ Frontend build successful"
else
  echo "✗ Frontend build failed"
fi
```

## Phase 5: Systemd Service Setup (10 minutes)

### 5.1 Install Service File

```bash
sudo cp /var/www/casino/systemd/casino.service /etc/systemd/system/
sudo systemctl daemon-reload
```

### 5.2 Enable and Start Service

```bash
sudo systemctl enable casino.service
sudo systemctl start casino.service
sudo systemctl status casino.service

# Should show: Active (running)
```

### 5.3 Verify Service

```bash
# Check that port 5000 is listening
sudo netstat -tlnp | grep 5000
# Or
sudo lsof -i :5000

# Should show node process listening on 5000
```

### 5.4 Test Service Recovery

```bash
# Stop the service
sudo systemctl stop casino.service
sleep 2

# Verify it's stopped
sudo systemctl status casino.service | grep "inactive\|running"

# Start it again
sudo systemctl start casino.service
sudo systemctl status casino.service | grep "running"

# Should restart successfully
```

## Phase 6: Nginx Configuration (15 minutes)

### 6.1 Copy Nginx Config

```bash
sudo cp /var/www/casino/nginx/casino.conf /etc/nginx/sites-available/
```

### 6.2 Edit Nginx Config (if needed)

```bash
sudo nano /etc/nginx/sites-available/casino

# Verify:
# - root /var/www/casino/frontend/dist; (correct path)
# - upstream casino_backend (points to 127.0.0.1:5000)
# - server_name matches your domain (if using SSL)
```

### 6.3 Enable Nginx Site

```bash
# Remove default site (optional, but recommended)
sudo rm -f /etc/nginx/sites-enabled/default

# Enable casino site
sudo ln -sf /etc/nginx/sites-available/casino /etc/nginx/sites-enabled/casino

# Verify symlink
ls -la /etc/nginx/sites-enabled/casino
```

### 6.4 Test Nginx Config

```bash
sudo nginx -t

# Should output:
# nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
# nginx: configuration will be successful
```

### 6.5 Reload Nginx

```bash
sudo systemctl reload nginx
sudo systemctl status nginx

# Should show: Active (running)
```

### 6.6 Verify Nginx is Serving

```bash
# Check port 80
sudo netstat -tlnp | grep :80

# Should show nginx process
curl http://localhost

# Should return HTML or error about backend
```

## Phase 7: File Permissions (10 minutes)

### 7.1 Set Ownership

```bash
# Casino application
sudo chown -R www-data:www-data /var/www/casino
sudo chown -R www-data:www-data /var/log/nginx

# Verify
ls -la /var/www/casino/ | grep www-data
```

### 7.2 Set Permissions

```bash
# Directories
sudo find /var/www/casino -type d -exec chmod 755 {} \;

# Files
sudo find /var/www/casino -type f -exec chmod 644 {} \;

# Backend should be executable
sudo chmod +x /var/www/casino/backend/src/server.js

# Systemd service
sudo chmod 644 /etc/systemd/system/casino.service

# Nginx config
sudo chmod 644 /etc/nginx/sites-available/casino

# Verify
stat /var/www/casino/backend/.env | grep Access
# Should show: (0644)
```

## Phase 8: SSL/HTTPS Setup (Optional but Recommended - 20 minutes)

### 8.1 Install Certbot

```bash
sudo apt install -y certbot python3-certbot-nginx
certbot --version
```

### 8.2 Obtain Certificate

```bash
# Replace yourdomain.com with your actual domain
sudo certbot certonly --nginx -d yourdomain.com

# Follow prompts:
# - Enter email address
# - Agree to terms
# - Certificate created in /etc/letsencrypt/live/yourdomain.com/
```

### 8.3 Update Nginx Config

```bash
sudo nano /etc/nginx/sites-available/casino
```

Uncomment and update the SSL section:
```nginx
server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # ... rest of configuration
}

# And HTTP to HTTPS redirect
server {
    listen 80;
    server_name yourdomain.com;
    return 301 https://$host$request_uri;
}
```

### 8.4 Test and Reload Nginx

```bash
sudo nginx -t
sudo systemctl reload nginx
```

### 8.5 Test SSL

```bash
curl -I https://yourdomain.com

# Should return 200 OK with SSL certificate info
```

### 8.6 Auto-Renewal

```bash
# Certbot auto-renewal is usually set up automatically
# Verify renewal timer
sudo systemctl list-timers | grep certbot

# Test renewal (dry run)
sudo certbot renew --dry-run
```

## Phase 9: Firewall Configuration (Optional)

### 9.1 UFW Setup

```bash
# Enable UFW (if not already enabled)
sudo ufw enable

# Allow SSH (CRITICAL - do this first!)
sudo ufw allow 22/tcp

# Allow HTTP
sudo ufw allow 80/tcp

# Allow HTTPS
sudo ufw allow 443/tcp

# Deny everything else
sudo ufw default deny incoming
sudo ufw default allow outgoing

# Verify rules
sudo ufw status

# Output should show:
# To                         Action      From
# --                         ------      ----
# 22/tcp                     ALLOW       Anywhere
# 80/tcp                     ALLOW       Anywhere
# 443/tcp                    ALLOW       Anywhere
```

### 9.2 Test Access

```bash
# Verify you can still SSH
# (In new terminal, don't close current SSH session)
ssh -i yourkey.pem user@yourdomain.com
```

## Phase 10: Database Backup Strategy (10 minutes)

### 10.1 Create Backup Directory

```bash
sudo mkdir -p /var/backups/casino
sudo chown www-data:www-data /var/backups/casino
sudo chmod 755 /var/backups/casino
```

### 10.2 Create Backup Script

```bash
sudo nano /usr/local/bin/casino-backup.sh
```

Add content:
```bash
#!/bin/bash

BACKUP_DIR="/var/backups/casino"
DB_PATH="/var/www/casino/backend/casino.db"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/casino_$TIMESTAMP.db"

# Backup database
cp "$DB_PATH" "$BACKUP_FILE"
gzip "$BACKUP_FILE"

# Keep only last 30 days
find "$BACKUP_DIR" -name "casino_*.db.gz" -mtime +30 -delete

echo "Database backed up to $BACKUP_FILE.gz"
```

### 10.3 Make Script Executable

```bash
sudo chmod +x /usr/local/bin/casino-backup.sh

# Test it
sudo /usr/local/bin/casino-backup.sh

# Verify backup created
ls -lah /var/backups/casino/
```

### 10.4 Schedule Automated Backups

```bash
sudo crontab -e

# Add this line (daily at 2 AM):
0 2 * * * /usr/local/bin/casino-backup.sh >> /var/log/casino-backup.log 2>&1

# Add this line (weekly full backup - Sunday at 3 AM):
0 3 * * 0 cd /var/backups/casino && tar -czf casino_weekly_$(date +\%Y\%m\%d).tar.gz *.db.gz
```

## Phase 11: Monitoring and Logs (10 minutes)

### 11.1 Check Service Status

```bash
# Check if service is running
sudo systemctl status casino.service

# View recent logs
sudo journalctl -u casino.service -n 50 --no-pager

# Follow logs in real-time
sudo journalctl -u casino.service -f

# Filter for errors
sudo journalctl -u casino.service -p err
```

### 11.2 Check Nginx Logs

```bash
# Access log
sudo tail -20 /var/log/nginx/casino_access.log

# Error log
sudo tail -20 /var/log/nginx/casino_error.log

# Follow access log
sudo tail -f /var/log/nginx/casino_access.log
```

### 11.3 Monitor System Resources

```bash
# Check disk usage
df -h

# Check memory usage
free -h

# Check CPU
top

# Check database size
du -sh /var/www/casino/backend/casino.db
```

## Phase 12: Security Hardening (20 minutes)

### 12.1 Update Backend .env

```bash
sudo nano /var/www/casino/backend/.env

# Verify all production values:
# - JWT_SECRET is strong (32+ chars, random)
# - NODE_ENV=production
# - FRONTEND_URL=https://yourdomain.com (HTTPS!)
# - DATABASE_PATH is correct
```

### 12.2 Disable SSH Password Authentication

```bash
sudo nano /etc/ssh/sshd_config

# Find and set:
# PasswordAuthentication no
# PubkeyAuthentication yes
# PermitRootLogin no

# Restart SSH
sudo systemctl restart ssh
```

### 12.3 Install Fail2Ban

```bash
sudo apt install -y fail2ban

# Copy default config
sudo cp /etc/fail2ban/jail.conf /etc/fail2ban/jail.local

# Enable service
sudo systemctl enable fail2ban
sudo systemctl start fail2ban

# Verify
sudo systemctl status fail2ban
```

### 12.4 Hide Nginx Version

```bash
sudo nano /etc/nginx/nginx.conf

# In http {} block, add:
# server_tokens off;

# Test and reload
sudo nginx -t
sudo systemctl reload nginx
```

## Phase 13: Verification Checklist

Run through all these tests:

```bash
# ✓ Service is running
sudo systemctl status casino.service | grep "active (running)"

# ✓ Backend is accessible
curl http://localhost:5000/api/health | grep "OK"

# ✓ Frontend is served
curl http://localhost/ | grep -i "html"

# ✓ Database exists
ls -la /var/www/casino/backend/casino.db

# ✓ Database has tables
sqlite3 /var/www/casino/backend/casino.db ".tables" | grep "users"

# ✓ Nginx is working
curl -I http://yourdomain.com | grep "200\|301\|302"

# ✓ SSL is valid (if configured)
curl -I https://yourdomain.com | grep "200"

# ✓ Logs are accessible
sudo journalctl -u casino.service -n 1

# ✓ Backups are running
ls -la /var/backups/casino/ | head -5
```

## Phase 14: Post-Deployment Maintenance

### Regular Tasks

**Daily**:
- Monitor error logs: `sudo journalctl -u casino.service -p err`
- Check disk space: `df -h`

**Weekly**:
- Review access logs: `sudo tail -100 /var/log/nginx/casino_access.log`
- Verify backups: `ls -la /var/backups/casino/`
- Check database size: `du -sh /var/www/casino/backend/casino.db`

**Monthly**:
- Update system: `sudo apt update && sudo apt upgrade`
- Review security logs: `sudo less /var/log/auth.log`
- Test database restore from backup

### Emergency Procedures

**If backend crashes**:
```bash
# Restart service
sudo systemctl restart casino.service

# View detailed logs
sudo journalctl -u casino.service -n 100

# Check if port 5000 is in use
sudo lsof -i :5000
```

**If Nginx fails**:
```bash
# Test configuration
sudo nginx -t

# Reload if config is OK
sudo systemctl reload nginx

# Check error log
sudo tail -50 /var/log/nginx/casino_error.log
```

**If database is corrupted**:
```bash
# Restore from latest backup
sudo cp /var/backups/casino/casino_*.db.gz /var/www/casino/backend/
cd /var/www/casino/backend/
sudo gunzip casino_*.db.gz
sudo chown www-data:www-data casino.db

# Restart backend
sudo systemctl restart casino.service
```

## Phase 15: Performance Optimization

### Nginx Tuning

```bash
sudo nano /etc/nginx/nginx.conf

# Update in main http block:
worker_processes auto;
worker_connections 2048;
keepalive_timeout 65;
types_hash_max_size 2048;
client_max_body_size 20M;

# Enable caching in casino.conf:
location ~* \.(js|css|png|jpg)$ {
    expires 30d;
    add_header Cache-Control "public, immutable";
}

# Reload
sudo nginx -t && sudo systemctl reload nginx
```

### Node.js Tuning

```bash
sudo nano /etc/systemd/system/casino.service

# Add in [Service] section:
Environment="NODE_OPTIONS=--max-old-space-size=512"
Environment="UV_THREADPOOL_SIZE=4"

# Reload systemd
sudo systemctl daemon-reload
sudo systemctl restart casino.service
```

## Troubleshooting

### Service won't start
```bash
# Check for port conflicts
sudo lsof -i :5000

# Check environment file
cat /var/www/casino/backend/.env

# View detailed error
sudo journalctl -u casino.service -n 50
```

### Frontend blank/404
```bash
# Verify build exists
ls -la /var/www/casino/frontend/dist/

# Rebuild if missing
cd /var/www/casino/frontend && npm run build

# Check Nginx config points to correct path
grep "root /var" /etc/nginx/sites-available/casino
```

### High CPU/Memory usage
```bash
# Check top processes
top

# Check Node.js memory
ps aux | grep node

# Check database size
du -sh /var/www/casino/backend/casino.db

# Potentially optimize database
sqlite3 /var/www/casino/backend/casino.db "VACUUM;"
```

## Success Indicators

Your deployment is successful when:
- ✅ Domain opens in browser with casino UI
- ✅ Can register new account
- ✅ Can login with credentials
- ✅ Can play games and balance updates
- ✅ Transaction history logs all activity
- ✅ SSL certificate is valid (if HTTPS)
- ✅ Backups are created automatically
- ✅ Logs show no errors
- ✅ System resources are healthy

## Additional Resources

- Nginx Documentation: https://nginx.org/en/docs/
- Node.js Best Practices: https://nodejs.org/en/docs/guides/
- SQLite Administration: https://www.sqlite.org/admin.html
- Let's Encrypt: https://letsencrypt.org/docs/
- Ubuntu Server Guide: https://help.ubuntu.com/

## Support

For issues:
1. Check logs: `sudo journalctl -u casino.service -n 100`
2. Review error log: `/var/log/nginx/casino_error.log`
3. Test connectivity: `curl http://localhost:5000/api/health`
4. Check database: `sqlite3 /var/www/casino/backend/casino.db ".tables"`

---

**Deployment Complete!** 🎉

Your casino platform is now running in production on Ubuntu with Nginx.
