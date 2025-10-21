# Deployment Guide

## 🚀 Complete Deployment Documentation

This document provides comprehensive instructions for deploying the E-Commerce backend system across different environments and platforms.

## 📋 Table of Contents

- [Deployment Overview](#deployment-overview)
- [Environment Setup](#environment-setup)
- [Local Development](#local-development)
- [Staging Deployment](#staging-deployment)
- [Production Deployment](#production-deployment)
- [Docker Deployment](#docker-deployment)
- [Cloud Deployment](#cloud-deployment)
- [Database Deployment](#database-deployment)
- [Monitoring & Logging](#monitoring--logging)
- [Backup & Recovery](#backup--recovery)
- [Troubleshooting](#troubleshooting)

## 🎯 Deployment Overview

### Deployment Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Load Balancer                           │
│  • SSL Termination  • Request Routing  • Health Checks    │
└─────────────────────┬───────────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────────┐
│                 Application Servers                        │
│  • Node.js Applications  • Auto-scaling  • Health Checks   │
└─────────────────────┬───────────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────────┐
│                   Database Cluster                         │
│  • MongoDB Replica Set  • Automated Backups  • Monitoring  │
└─────────────────────┬───────────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────────┐
│                 External Services                          │
│  • Cloudinary (Images)  • WhatsApp API  • Email Service    │
└─────────────────────────────────────────────────────────────┘
```

### Deployment Environments

| Environment | Purpose | URL | Database | Features |
|-------------|---------|-----|----------|----------|
| **Development** | Local development | `http://localhost:5000` | Local MongoDB | Debug mode, hot reload |
| **Staging** | Testing & QA | `https://staging-api.yourdomain.com` | Staging MongoDB | Production-like setup |
| **Production** | Live application | `https://api.yourdomain.com` | Production MongoDB | Optimized, monitored |

## ⚙️ Environment Setup

### Prerequisites

#### System Requirements
- **Node.js**: v16.0.0 or higher
- **npm**: v8.0.0 or higher
- **MongoDB**: v4.4 or higher
- **Git**: Latest version
- **SSL Certificate**: For production HTTPS

#### Required Accounts
- **MongoDB Atlas**: Cloud database (recommended)
- **Cloudinary**: Image storage and processing
- **Domain Provider**: For custom domain
- **SSL Provider**: For HTTPS certificates

### Environment Variables

#### Development Environment (.env.development)
```env
# Server Configuration
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:3000

# Database
MONGODB_URI=mongodb://localhost:27017/ecommerce_dev

# JWT Configuration
JWT_SECRET=your-development-jwt-secret-key
JWT_EXPIRE=30d

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret

# WhatsApp Integration (Optional)
WHATSAPP_API_URL=your-whatsapp-api-url
WHATSAPP_API_TOKEN=your-whatsapp-api-token
```

#### Staging Environment (.env.staging)
```env
# Server Configuration
NODE_ENV=staging
PORT=5000
FRONTEND_URL=https://staging.yourdomain.com

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ecommerce_staging

# JWT Configuration
JWT_SECRET=your-staging-jwt-secret-key
JWT_EXPIRE=7d

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret

# WhatsApp Integration
WHATSAPP_API_URL=your-whatsapp-api-url
WHATSAPP_API_TOKEN=your-whatsapp-api-token
```

#### Production Environment (.env.production)
```env
# Server Configuration
NODE_ENV=production
PORT=5000
FRONTEND_URL=https://yourdomain.com

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ecommerce_prod

# JWT Configuration
JWT_SECRET=your-super-secure-production-jwt-secret-key
JWT_EXPIRE=30d

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret

# WhatsApp Integration
WHATSAPP_API_URL=your-whatsapp-api-url
WHATSAPP_API_TOKEN=your-whatsapp-api-token

# Security
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=1000
```

## 💻 Local Development

### Setup Instructions

#### 1. Clone Repository
```bash
git clone <repository-url>
cd backend
```

#### 2. Install Dependencies
```bash
npm install
```

#### 3. Environment Configuration
```bash
# Copy environment template
cp .env.example .env.development

# Edit environment variables
nano .env.development
```

#### 4. Database Setup
```bash
# Start MongoDB (if running locally)
mongod

# Or use MongoDB Atlas (recommended)
# Update MONGODB_URI in .env.development
```

#### 5. Seed Database
```bash
# Run database seeding
npm run seed
```

#### 6. Start Development Server
```bash
# Start with nodemon (auto-restart)
npm run dev

# Or start normally
npm start
```

#### 7. Verify Installation
```bash
# Test health endpoint
curl http://localhost:5000/api/health

# Expected response:
# {"success":true,"message":"Server is running","timestamp":"2024-01-01T00:00:00.000Z"}
```

### Development Tools

#### Debugging
```bash
# Enable debug mode
DEBUG=app:* npm run dev

# Or with specific modules
DEBUG=app:database,app:auth npm run dev
```

#### Testing
```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run specific test suite
npm run test:unit
npm run test:integration
```

#### Code Quality
```bash
# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format
```

## 🧪 Staging Deployment

### Staging Environment Setup

#### 1. Server Preparation
```bash
# Create staging directory
mkdir -p /var/www/ecommerce-staging
cd /var/www/ecommerce-staging

# Clone repository
git clone <repository-url> .

# Install dependencies
npm ci --only=production
```

#### 2. Environment Configuration
```bash
# Copy staging environment
cp .env.example .env.staging

# Configure staging environment
nano .env.staging
```

#### 3. Database Setup
```bash
# Create staging database
# Use MongoDB Atlas or create separate database instance

# Seed staging data
NODE_ENV=staging npm run seed
```

#### 4. Process Management
```bash
# Install PM2
npm install -g pm2

# Create PM2 ecosystem file
cat > ecosystem.staging.config.js << EOF
module.exports = {
  apps: [{
    name: 'ecommerce-staging',
    script: 'server.js',
    instances: 1,
    exec_mode: 'fork',
    env: {
      NODE_ENV: 'staging',
      PORT: 5000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true
  }]
};
EOF

# Start application
pm2 start ecosystem.staging.config.js
pm2 save
pm2 startup
```

#### 5. Nginx Configuration
```nginx
# /etc/nginx/sites-available/ecommerce-staging
server {
    listen 80;
    server_name staging-api.yourdomain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

#### 6. SSL Certificate
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Obtain SSL certificate
sudo certbot --nginx -d staging-api.yourdomain.com
```

#### 7. Deployment Script
```bash
#!/bin/bash
# deploy-staging.sh

echo "Starting staging deployment..."

# Pull latest changes
git pull origin staging

# Install dependencies
npm ci --only=production

# Run database migrations
NODE_ENV=staging npm run migrate

# Restart application
pm2 restart ecommerce-staging

# Run health check
sleep 10
curl -f http://localhost:5000/api/health || exit 1

echo "Staging deployment completed successfully!"
```

## 🏭 Production Deployment

### Production Environment Setup

#### 1. Server Requirements
- **CPU**: 2+ cores
- **RAM**: 4GB+ (8GB recommended)
- **Storage**: 50GB+ SSD
- **OS**: Ubuntu 20.04 LTS or CentOS 8
- **Network**: Stable internet connection

#### 2. Server Preparation
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2
sudo npm install -g pm2

# Install Nginx
sudo apt install nginx -y

# Install MongoDB (if not using Atlas)
sudo apt install mongodb -y
```

#### 3. Application Setup
```bash
# Create application directory
sudo mkdir -p /var/www/ecommerce
sudo chown $USER:$USER /var/www/ecommerce
cd /var/www/ecommerce

# Clone repository
git clone <repository-url> .

# Install dependencies
npm ci --only=production
```

#### 4. Environment Configuration
```bash
# Create production environment
cp .env.example .env.production

# Secure environment file
chmod 600 .env.production

# Configure production environment
nano .env.production
```

#### 5. Database Setup
```bash
# Use MongoDB Atlas (recommended for production)
# Configure connection string in .env.production

# Or setup local MongoDB replica set
sudo systemctl start mongodb
sudo systemctl enable mongodb
```

#### 6. Process Management
```bash
# Create PM2 ecosystem file
cat > ecosystem.production.config.js << EOF
module.exports = {
  apps: [{
    name: 'ecommerce-production',
    script: 'server.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 5000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true,
    max_memory_restart: '1G',
    node_args: '--max-old-space-size=1024'
  }]
};
EOF

# Start application
pm2 start ecosystem.production.config.js
pm2 save
pm2 startup
```

#### 7. Nginx Configuration
```nginx
# /etc/nginx/sites-available/ecommerce-production
upstream ecommerce_backend {
    server localhost:5000;
    server localhost:5001;
    server localhost:5002;
    server localhost:5003;
}

server {
    listen 80;
    server_name api.yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name api.yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/api.yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/api.yourdomain.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;

    # Security headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
    limit_req zone=api burst=20 nodelay;

    location / {
        proxy_pass http://ecommerce_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 300s;
        proxy_connect_timeout 75s;
    }

    # Health check endpoint
    location /api/health {
        access_log off;
        proxy_pass http://ecommerce_backend;
    }
}
```

#### 8. SSL Certificate
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Obtain SSL certificate
sudo certbot --nginx -d api.yourdomain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

#### 9. Firewall Configuration
```bash
# Configure UFW
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw enable

# Check status
sudo ufw status
```

#### 10. Production Deployment Script
```bash
#!/bin/bash
# deploy-production.sh

set -e

echo "Starting production deployment..."

# Backup current version
cp -r /var/www/ecommerce /var/www/ecommerce.backup.$(date +%Y%m%d_%H%M%S)

# Pull latest changes
cd /var/www/ecommerce
git pull origin main

# Install dependencies
npm ci --only=production

# Run database migrations
NODE_ENV=production npm run migrate

# Restart application
pm2 restart ecommerce-production

# Wait for application to start
sleep 15

# Health check
curl -f https://api.yourdomain.com/api/health || {
    echo "Health check failed, rolling back..."
    pm2 restart ecommerce-production
    exit 1
}

# Reload Nginx
sudo nginx -t && sudo systemctl reload nginx

echo "Production deployment completed successfully!"
```

## 🐳 Docker Deployment

### Dockerfile
```dockerfile
# Use official Node.js runtime as base image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Copy application code
COPY --chown=nextjs:nodejs . .

# Create logs directory
RUN mkdir -p logs && chown nextjs:nodejs logs

# Switch to non-root user
USER nextjs

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node healthcheck.js

# Start application
CMD ["node", "server.js"]
```

### Docker Compose
```yaml
# docker-compose.yml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - MONGODB_URI=mongodb://mongo:27017/ecommerce
    depends_on:
      - mongo
    volumes:
      - ./logs:/app/logs
    restart: unless-stopped
    networks:
      - ecommerce-network

  mongo:
    image: mongo:5.0
    ports:
      - "27017:27017"
    environment:
      - MONGO_INITDB_ROOT_USERNAME=admin
      - MONGO_INITDB_ROOT_PASSWORD=password
    volumes:
      - mongo-data:/data/db
    restart: unless-stopped
    networks:
      - ecommerce-network

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - app
    restart: unless-stopped
    networks:
      - ecommerce-network

volumes:
  mongo-data:

networks:
  ecommerce-network:
    driver: bridge
```

### Docker Deployment Commands
```bash
# Build and start services
docker-compose up -d

# View logs
docker-compose logs -f app

# Scale application
docker-compose up -d --scale app=3

# Update application
docker-compose pull
docker-compose up -d

# Stop services
docker-compose down

# Remove volumes
docker-compose down -v
```

## ☁️ Cloud Deployment

### AWS Deployment

#### 1. EC2 Setup
```bash
# Launch EC2 instance
# Instance type: t3.medium or larger
# OS: Ubuntu Server 20.04 LTS
# Security group: Allow HTTP (80), HTTPS (443), SSH (22)

# Connect to instance
ssh -i your-key.pem ubuntu@your-instance-ip
```

#### 2. Application Deployment
```bash
# Install dependencies
sudo apt update
sudo apt install nodejs npm nginx -y

# Clone and setup application
git clone <repository-url> /var/www/ecommerce
cd /var/www/ecommerce
npm ci --only=production

# Setup PM2
sudo npm install -g pm2
pm2 start ecosystem.production.config.js
pm2 startup
pm2 save
```

#### 3. RDS MongoDB Setup
```bash
# Create RDS MongoDB instance
# Instance class: db.t3.medium
# Storage: 20GB GP2
# Security group: Allow port 27017 from EC2 security group

# Update MONGODB_URI in .env.production
MONGODB_URI=mongodb://username:password@your-rds-endpoint:27017/ecommerce
```

#### 4. Load Balancer Setup
```bash
# Create Application Load Balancer
# Target group: EC2 instances
# Health check: /api/health
# SSL certificate: Upload or request from ACM
```

### Google Cloud Platform

#### 1. Compute Engine Setup
```bash
# Create VM instance
# Machine type: e2-medium
# OS: Ubuntu 20.04 LTS
# Firewall: Allow HTTP, HTTPS, SSH

# Connect to instance
gcloud compute ssh your-instance-name --zone=your-zone
```

#### 2. Cloud SQL Setup
```bash
# Create Cloud SQL MongoDB instance
# Instance ID: ecommerce-db
# Region: us-central1
# Machine type: db-n1-standard-1

# Get connection string
gcloud sql instances describe ecommerce-db
```

#### 3. Deployment
```bash
# Setup application
git clone <repository-url> /var/www/ecommerce
cd /var/www/ecommerce
npm ci --only=production

# Configure environment
cp .env.example .env.production
# Update MONGODB_URI with Cloud SQL connection string

# Start application
pm2 start ecosystem.production.config.js
```

### Azure Deployment

#### 1. Virtual Machine Setup
```bash
# Create VM
# Size: Standard_B2s
# OS: Ubuntu Server 20.04 LTS
# Network: Allow HTTP, HTTPS, SSH

# Connect to VM
ssh azureuser@your-vm-ip
```

#### 2. Cosmos DB Setup
```bash
# Create Cosmos DB account
# API: MongoDB
# Consistency: Session
# Location: East US

# Get connection string from Azure portal
```

#### 3. Application Deployment
```bash
# Setup application
git clone <repository-url> /var/www/ecommerce
cd /var/www/ecommerce
npm ci --only=production

# Configure environment
cp .env.example .env.production
# Update MONGODB_URI with Cosmos DB connection string

# Start application
pm2 start ecosystem.production.config.js
```

## 🗄️ Database Deployment

### MongoDB Atlas Setup

#### 1. Create Cluster
```bash
# Sign up for MongoDB Atlas
# Create new cluster
# Choose region closest to your application
# Select M10 or higher for production
```

#### 2. Configure Security
```bash
# Create database user
# Username: ecommerce-user
# Password: strong-password
# Database: admin

# Configure IP whitelist
# Add your server IP addresses
# Or use 0.0.0.0/0 for development (not recommended for production)
```

#### 3. Connection String
```bash
# Get connection string from Atlas
# Format: mongodb+srv://username:password@cluster.mongodb.net/database

# Update .env.production
MONGODB_URI=mongodb+srv://ecommerce-user:password@cluster0.xxxxx.mongodb.net/ecommerce?retryWrites=true&w=majority
```

### Local MongoDB Setup

#### 1. Installation
```bash
# Ubuntu/Debian
sudo apt install mongodb

# CentOS/RHEL
sudo yum install mongodb-server

# macOS
brew install mongodb
```

#### 2. Configuration
```bash
# Edit configuration file
sudo nano /etc/mongod.conf

# Enable authentication
security:
  authorization: enabled

# Start MongoDB
sudo systemctl start mongod
sudo systemctl enable mongod
```

#### 3. Create Database User
```bash
# Connect to MongoDB
mongo

# Create admin user
use admin
db.createUser({
  user: "admin",
  pwd: "admin-password",
  roles: ["userAdminAnyDatabase", "dbAdminAnyDatabase", "readWriteAnyDatabase"]
})

# Create application user
use ecommerce
db.createUser({
  user: "ecommerce-user",
  pwd: "ecommerce-password",
  roles: ["readWrite"]
})
```

### Database Migration

#### 1. Backup Strategy
```bash
# Create backup script
#!/bin/bash
# backup-db.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/var/backups/mongodb"
DB_NAME="ecommerce"

# Create backup directory
mkdir -p $BACKUP_DIR

# Create backup
mongodump --db $DB_NAME --out $BACKUP_DIR/$DATE

# Compress backup
tar -czf $BACKUP_DIR/$DATE.tar.gz -C $BACKUP_DIR $DATE

# Remove uncompressed backup
rm -rf $BACKUP_DIR/$DATE

# Keep only last 7 days of backups
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete

echo "Backup completed: $DATE.tar.gz"
```

#### 2. Restore Strategy
```bash
# Create restore script
#!/bin/bash
# restore-db.sh

BACKUP_FILE=$1
DB_NAME="ecommerce"

if [ -z "$BACKUP_FILE" ]; then
    echo "Usage: $0 <backup-file.tar.gz>"
    exit 1
fi

# Extract backup
tar -xzf $BACKUP_FILE

# Restore database
mongorestore --db $DB_NAME --drop $BACKUP_FILE

echo "Database restored from $BACKUP_FILE"
```

## 📊 Monitoring & Logging

### Application Monitoring

#### 1. PM2 Monitoring
```bash
# Install PM2 monitoring
pm2 install pm2-server-monit

# View monitoring dashboard
pm2 monit

# View logs
pm2 logs ecommerce-production

# View process info
pm2 show ecommerce-production
```

#### 2. Health Checks
```bash
# Create health check script
cat > healthcheck.js << EOF
const http = require('http');

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/health',
  method: 'GET',
  timeout: 3000
};

const req = http.request(options, (res) => {
  if (res.statusCode === 200) {
    process.exit(0);
  } else {
    process.exit(1);
  }
});

req.on('error', () => {
  process.exit(1);
});

req.on('timeout', () => {
  req.destroy();
  process.exit(1);
});

req.end();
EOF
```

#### 3. Log Management
```bash
# Setup log rotation
sudo nano /etc/logrotate.d/ecommerce

# Add configuration
/var/www/ecommerce/logs/*.log {
    daily
    missingok
    rotate 30
    compress
    delaycompress
    notifempty
    create 644 nextjs nodejs
    postrotate
        pm2 reloadLogs
    endscript
}
```

### External Monitoring

#### 1. Uptime Monitoring
```bash
# Use services like:
# - UptimeRobot
# - Pingdom
# - StatusCake

# Monitor endpoints:
# - https://api.yourdomain.com/api/health
# - https://api.yourdomain.com/api/products
```

#### 2. Performance Monitoring
```bash
# Use services like:
# - New Relic
# - DataDog
# - AppDynamics

# Monitor metrics:
# - Response time
# - Throughput
# - Error rate
# - Resource usage
```

## 💾 Backup & Recovery

### Automated Backup Strategy

#### 1. Database Backup
```bash
#!/bin/bash
# daily-backup.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/var/backups/ecommerce"
DB_NAME="ecommerce"

# Create backup directory
mkdir -p $BACKUP_DIR

# Database backup
mongodump --uri="$MONGODB_URI" --out $BACKUP_DIR/db_$DATE

# Application backup
tar -czf $BACKUP_DIR/app_$DATE.tar.gz -C /var/www ecommerce

# Upload to cloud storage (optional)
# aws s3 cp $BACKUP_DIR/db_$DATE s3://your-backup-bucket/db_$DATE --recursive

# Cleanup old backups (keep 30 days)
find $BACKUP_DIR -name "db_*" -mtime +30 -exec rm -rf {} \;
find $BACKUP_DIR -name "app_*" -mtime +30 -delete

echo "Backup completed: $DATE"
```

#### 2. Cron Job Setup
```bash
# Add to crontab
crontab -e

# Daily backup at 2 AM
0 2 * * * /var/www/ecommerce/scripts/daily-backup.sh

# Weekly full backup on Sunday at 1 AM
0 1 * * 0 /var/www/ecommerce/scripts/weekly-backup.sh
```

### Disaster Recovery Plan

#### 1. Recovery Procedures
```bash
# 1. Assess damage
# 2. Restore from backup
# 3. Verify data integrity
# 4. Test application functionality
# 5. Monitor for issues

# Recovery script
#!/bin/bash
# disaster-recovery.sh

BACKUP_DATE=$1
if [ -z "$BACKUP_DATE" ]; then
    echo "Usage: $0 <backup-date>"
    exit 1
fi

# Stop application
pm2 stop ecommerce-production

# Restore database
mongorestore --db ecommerce --drop /var/backups/ecommerce/db_$BACKUP_DATE

# Restore application
tar -xzf /var/backups/ecommerce/app_$BACKUP_DATE.tar.gz -C /var/www/

# Start application
pm2 start ecommerce-production

# Verify recovery
sleep 30
curl -f https://api.yourdomain.com/api/health || exit 1

echo "Recovery completed successfully"
```

## 🔧 Troubleshooting

### Common Issues

#### 1. Application Won't Start
```bash
# Check logs
pm2 logs ecommerce-production

# Check environment variables
pm2 show ecommerce-production

# Check port availability
netstat -tlnp | grep :5000

# Check database connection
mongo $MONGODB_URI
```

#### 2. Database Connection Issues
```bash
# Test MongoDB connection
mongo $MONGODB_URI

# Check MongoDB status
sudo systemctl status mongod

# Check MongoDB logs
sudo tail -f /var/log/mongodb/mongod.log

# Check network connectivity
telnet your-mongodb-host 27017
```

#### 3. High Memory Usage
```bash
# Check memory usage
pm2 monit

# Restart application
pm2 restart ecommerce-production

# Check for memory leaks
node --inspect server.js

# Monitor with htop
htop
```

#### 4. SSL Certificate Issues
```bash
# Check certificate validity
openssl x509 -in /etc/letsencrypt/live/api.yourdomain.com/cert.pem -text -noout

# Renew certificate
sudo certbot renew

# Test SSL configuration
ssl-test.com
```

### Performance Optimization

#### 1. Database Optimization
```bash
# Check slow queries
db.setProfilingLevel(2, { slowms: 100 })

# Analyze query performance
db.system.profile.find().sort({ ts: -1 }).limit(5)

# Create missing indexes
db.products.createIndex({ category: 1, isActive: 1 })
```

#### 2. Application Optimization
```bash
# Enable clustering
pm2 start ecosystem.production.config.js --instances max

# Optimize Node.js
node --max-old-space-size=2048 server.js

# Use compression
npm install compression
```

#### 3. Nginx Optimization
```nginx
# Enable gzip compression
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

# Enable caching
location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

---

This deployment guide provides comprehensive instructions for deploying the E-Commerce backend system across different environments and platforms. Follow the appropriate section based on your deployment requirements and infrastructure setup.
