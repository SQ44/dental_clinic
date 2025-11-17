# Dental Clinic Management System - Ubuntu Server Deployment Guide

This guide provides instructions for deploying the Dental Clinic Management System to an Ubuntu server (including DigitalOcean droplets).

## Prerequisites

- Ubuntu 20.04+ server (DigitalOcean droplet, AWS EC2, or similar)
- SSH access to the server
- Domain name (optional, but recommended for SSL)
- At least 2GB RAM and 20GB storage recommended

## Quick Start

1. **Configure Environment Variables**
   ```bash
   cp .env.example .env
   # Edit .env with your actual values
   ```

2. **Deploy to DigitalOcean**
   ```bash
   # Set your droplet IP and user
   export REMOTE_HOST="your-droplet-ip"
   export REMOTE_USER="root"

   # Run deployment
   ./deploy/deploy.sh
   ```

3. **Set up SSL (Optional but Recommended)**
   ```bash
   # Set your domain
   export DOMAIN="yourdomain.com"
   export EMAIL="admin@yourdomain.com"

   # Run SSL setup
   ./deploy/setup-ssl.sh
   ```

## Demo Credentials

After deployment, the application will be seeded with demo user accounts:

### Admin User
- **Email:** admin@dentalclinic.com
- **Password:** Admin123!
- **Role:** Administrator (full access to all features)

### Demo Dentist
- **Email:** dentist@dentalclinic.com
- **Password:** Dentist123!
- **Role:** Dentist (can manage appointments and patients)

### Demo Staff
- **Email:** staff@dentalclinic.com
- **Password:** Staff123!
- **Role:** Staff (limited access for administrative tasks)

## Environment Variables

Copy `.env.example` to `.env` and configure the following variables:

**For Demo/Development:**
The `.env.example` file contains demo values that work out-of-the-box for testing.

**For Production:**
- `POSTGRES_PASSWORD`: Strong password for PostgreSQL (change from demo value)
- `JWT_SECRET`: Random string for JWT token signing (change from demo value)
- `STRIPE_SECRET_KEY`: Your Stripe secret key (replace demo value)
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`: Your Stripe publishable key (replace demo value)
- `FRONTEND_URL`: Your domain URL (e.g., https://yourdomain.com)
- `NEXT_PUBLIC_API_URL`: Your API URL (e.g., https://yourdomain.com/api)

**Important:** Always change the demo passwords and secrets before deploying to production!

## Architecture

The deployment uses Docker Compose with the following services:

- **PostgreSQL**: Database
- **Backend**: NestJS API server
- **Frontend**: Next.js application
- **Nginx**: Reverse proxy and load balancer

## File Structure

```
dental_clinic/
├── docker-compose.yml      # Production orchestration
├── .env.example           # Environment template
├── backend/
│   ├── Dockerfile         # Backend container config
│   └── ...               # Application code
├── frontend/
│   ├── Dockerfile         # Frontend container config
│   └── ...               # Application code
├── nginx/
│   ├── Dockerfile         # Nginx container config
│   └── nginx.conf         # Nginx configuration
├── deploy/
│   ├── deploy.sh          # Deployment script
│   ├── setup-ssl.sh       # SSL setup script
│   └── README.md          # This file
└── ssl/                   # SSL certificates (created during SSL setup)
```

## Security Features

- Non-root Docker containers
- Security headers in Nginx
- Rate limiting
- SSL/TLS encryption
- Automatic certificate renewal

## Monitoring

After deployment, monitor your application:

```bash
# Check service status
ssh root@your-droplet-ip 'cd /opt/dental-clinic && sudo docker-compose ps'

# View logs
ssh root@your-droplet-ip 'cd /opt/dental-clinic && sudo docker-compose logs -f'

# Check health endpoint
curl https://yourdomain.com/health
```

## Troubleshooting

### Services not starting
```bash
# Check logs for errors
ssh root@your-droplet-ip 'cd /opt/dental-clinic && sudo docker-compose logs'
```

### Database connection issues
- Ensure `POSTGRES_PASSWORD` is set correctly
- Check database health: `sudo docker-compose exec postgres pg_isready`

### SSL issues
- Verify domain DNS points to droplet IP
- Check certificate status: `sudo certbot certificates`

## Backup and Recovery

The deployment script automatically creates backups in `/opt/dental-clinic-backups/`.

To restore from backup:
```bash
ssh root@your-droplet-ip
cd /opt/dental-clinic
sudo cp -r /opt/dental-clinic-backups/YYYYMMDD_HHMMSS/* ./
sudo docker-compose up -d
```

## Updates

To update the application:
1. Make changes to your local codebase
2. Run the deployment script again: `./deploy/deploy.sh`

The script will create a backup and update the running containers.