#!/bin/bash

# Dental Clinic Management System - SSL Setup Script
# This script sets up SSL certificates using Let's Encrypt (Certbot)

set -e

# Configuration
REMOTE_HOST=${REMOTE_HOST:-"your-droplet-ip"}
REMOTE_USER=${REMOTE_USER:-"root"}
DOMAIN=${DOMAIN:-"yourdomain.com"}
EMAIL=${EMAIL:-"admin@yourdomain.com"}
APP_DIR="/opt/dental-clinic"

echo "🔒 Setting up SSL certificates for $DOMAIN..."

# Install Certbot on remote server
echo "📦 Installing Certbot..."
ssh $REMOTE_USER@$REMOTE_HOST << EOF
# Install Certbot and Nginx plugin
sudo apt update
sudo apt install -y certbot python3-certbot-nginx

# Stop nginx temporarily for certificate generation
sudo docker-compose -f $APP_DIR/docker-compose.yml exec nginx nginx -s stop 2>/dev/null || true
EOF

# Generate SSL certificates
echo "📜 Generating SSL certificates..."
ssh $REMOTE_USER@$REMOTE_HOST << EOF
# Generate certificate
sudo certbot certonly --standalone -d $DOMAIN -d www.$DOMAIN --email $EMAIL --agree-tos --non-interactive

# Copy certificates to application directory
sudo cp /etc/letsencrypt/live/$DOMAIN/fullchain.pem $APP_DIR/ssl/
sudo cp /etc/letsencrypt/live/$DOMAIN/privkey.pem $APP_DIR/ssl/

# Set proper permissions
sudo chown $REMOTE_USER:$REMOTE_USER $APP_DIR/ssl/*.pem
sudo chmod 600 $APP_DIR/ssl/*.pem
EOF

# Update nginx configuration for SSL
echo "🔧 Updating nginx configuration for SSL..."
ssh $REMOTE_USER@$REMOTE_HOST << EOF
cd $APP_DIR

# Create SSL-enabled nginx configuration
cat > nginx/nginx-ssl.conf << 'NGINX_EOF'
events {
    worker_connections 1024;
}

http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    # Logging
    log_format main '\$remote_addr - \$remote_user [\$time_local] "\$request" '
                    '\$status \$body_bytes_sent "\$http_referer" '
                    '"\$http_user_agent" "\$http_x_forwarded_for"';

    access_log /var/log/nginx/access.log main;
    error_log /var/log/nginx/error.log;

    # Performance
    sendfile        on;
    tcp_nopush      on;
    tcp_nodelay     on;
    keepalive_timeout 65;
    types_hash_max_size 2048;
    client_max_body_size 100M;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/json
        application/javascript
        application/xml+rss
        application/atom+xml
        image/svg+xml;

    # Rate limiting
    limit_req_zone \$binary_remote_addr zone=api:10m rate=10r/s;
    limit_req_zone \$binary_remote_addr zone=general:10m rate=100r/s;

    upstream backend {
        server backend:3000;
    }

    upstream frontend {
        server frontend:3000;
    }

    server {
        listen 80;
        server_name $DOMAIN www.$DOMAIN;
        return 301 https://\$server_name\$request_uri;
    }

    server {
        listen 443 ssl http2;
        server_name $DOMAIN www.$DOMAIN;

        ssl_certificate /etc/ssl/certs/fullchain.pem;
        ssl_certificate_key /etc/ssl/certs/privkey.pem;

        # SSL Security
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-RSA-AES128-SHA256:ECDHE-RSA-AES256-SHA384;
        ssl_prefer_server_ciphers off;
        ssl_session_cache shared:SSL:10m;
        ssl_session_timeout 10m;

        # Security headers
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-XSS-Protection "1; mode=block" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header Referrer-Policy "no-referrer-when-downgrade" always;
        add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
        add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

        # API routes
        location /api/ {
            limit_req zone=api burst=20 nodelay;

            proxy_pass http://backend;
            proxy_http_version 1.1;
            proxy_set_header Upgrade \$http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host \$host;
            proxy_set_header X-Real-IP \$remote_addr;
            proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto \$scheme;
            proxy_cache_bypass \$http_upgrade;
            proxy_read_timeout 86400;
        }

        # Frontend routes
        location / {
            limit_req zone=general burst=200 nodelay;

            proxy_pass http://frontend;
            proxy_http_version 1.1;
            proxy_set_header Upgrade \$http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host \$host;
            proxy_set_header X-Real-IP \$remote_addr;
            proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto \$scheme;
            proxy_cache_bypass \$http_upgrade;
            proxy_read_timeout 86400;
        }

        # Health check
        location /health {
            access_log off;
            return 200 "healthy\n";
            add_header Content-Type text/plain;
        }
    }
}
NGINX_EOF
EOF

# Update docker-compose to use SSL configuration
echo "🐳 Updating docker-compose for SSL..."
ssh $REMOTE_USER@$REMOTE_HOST << EOF
cd $APP_DIR

# Update nginx service to use SSL config
sed -i 's|COPY nginx.conf /etc/nginx/nginx.conf|COPY nginx-ssl.conf /etc/nginx/nginx.conf|' nginx/Dockerfile

# Update docker-compose.yml to mount SSL certificates
sed -i 's|    volumes:|    volumes:\n      - ./ssl:/etc/ssl/certs:ro\n      - ./nginx/nginx-ssl.conf:/etc/nginx/nginx.conf:ro|' docker-compose.yml
EOF

# Rebuild and restart services
echo "🔄 Rebuilding and restarting services with SSL..."
ssh $REMOTE_USER@$REMOTE_HOST << EOF
cd $APP_DIR

# Rebuild nginx with SSL config
sudo docker-compose build nginx

# Restart all services
sudo docker-compose up -d

# Set up automatic certificate renewal
echo "0 12 * * * /usr/bin/certbot renew --quiet && sudo docker-compose exec nginx nginx -s reload" | sudo crontab -
EOF

echo "✅ SSL setup completed!"
echo ""
echo "Your application is now available at:"
echo "🌐 https://$DOMAIN"
echo "🔒 SSL certificates will auto-renew monthly"
echo ""
echo "To check certificate status:"
echo "ssh $REMOTE_USER@$REMOTE_HOST 'sudo certbot certificates'"