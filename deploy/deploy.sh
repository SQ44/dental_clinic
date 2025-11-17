#!/bin/bash

# Dental Clinic Management System - Deployment Script
# This script deploys the application to a DigitalOcean droplet

set -e

# Configuration
REMOTE_HOST=${REMOTE_HOST:-"your-droplet-ip"}
REMOTE_USER=${REMOTE_USER:-"root"}
APP_DIR="/opt/dental-clinic"
BACKUP_DIR="/opt/dental-clinic-backups"

echo "🚀 Starting deployment to $REMOTE_HOST..."

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "❌ Error: .env file not found. Please copy .env.example to .env and configure your environment variables."
    exit 1
fi

# Create backup directory on remote server
echo "📦 Creating backup directory..."
ssh $REMOTE_USER@$REMOTE_HOST "sudo mkdir -p $BACKUP_DIR"

# Backup current deployment if it exists
echo "💾 Creating backup of current deployment..."
ssh $REMOTE_USER@$REMOTE_HOST "sudo mkdir -p $BACKUP_DIR/\$(date +%Y%m%d_%H%M%S) && sudo cp -r $APP_DIR/* $BACKUP_DIR/\$(date +%Y%m%d_%H%M%S)/ 2>/dev/null || true"

# Install Docker and Docker Compose on remote server if not present
echo "🐳 Ensuring Docker and Docker Compose are installed..."
ssh $REMOTE_USER@$REMOTE_HOST << 'EOF'
if ! command -v docker &> /dev/null; then
    echo "Installing Docker..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    sudo systemctl enable docker
    sudo systemctl start docker
fi

if ! command -v docker-compose &> /dev/null; then
    echo "Installing Docker Compose..."
    sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
fi
EOF

# Create application directory
echo "📁 Creating application directory..."
ssh $REMOTE_USER@$REMOTE_HOST "sudo mkdir -p $APP_DIR && sudo chown $REMOTE_USER:$REMOTE_USER $APP_DIR"

# Copy application files
echo "📤 Copying application files..."
rsync -avz --exclude='.git' --exclude='node_modules' --exclude='.next' --exclude='.env' ./ $REMOTE_USER@$REMOTE_HOST:$APP_DIR/

# Copy environment file
echo "🔐 Copying environment configuration..."
scp .env $REMOTE_USER@$REMOTE_HOST:$APP_DIR/

# Create SSL directory
echo "🔒 Creating SSL directory..."
ssh $REMOTE_USER@$REMOTE_HOST "sudo mkdir -p $APP_DIR/ssl && sudo chown $REMOTE_USER:$REMOTE_USER $APP_DIR/ssl"

# Navigate to app directory and deploy
echo "🏗️ Building and starting services..."
ssh $REMOTE_USER@$REMOTE_HOST << EOF
cd $APP_DIR

# Stop existing containers
sudo docker-compose down || true

# Build and start services
sudo docker-compose up --build -d

# Wait for services to be healthy
echo "⏳ Waiting for services to be healthy..."
sleep 30

# Check service status
sudo docker-compose ps

echo "✅ Deployment completed successfully!"
echo "🌐 Your application should be available at http://$REMOTE_HOST"
echo "🔒 Remember to set up SSL certificates for production use."
EOF

echo "🎉 Deployment completed!"
echo ""
echo "Next steps:"
echo "1. Update your DNS to point to $REMOTE_HOST"
echo "2. Run the database seeder: ssh $REMOTE_USER@$REMOTE_HOST 'cd $APP_DIR && sudo docker-compose exec backend npm run seed'"
echo "3. Run the SSL setup script: ./deploy/setup-ssl.sh"
echo "4. Monitor logs: ssh $REMOTE_USER@$REMOTE_HOST 'cd $APP_DIR && sudo docker-compose logs -f'"
echo "5. Access your application at http://$REMOTE_HOST"
echo "6. Log in with demo credentials (see Demo Credentials section in deploy/README.md)"