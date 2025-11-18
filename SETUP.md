# BillaBear Setup Guide

Complete installation and configuration guide for local development and production deployment.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Installation](#installation)
  - [Ubuntu/Linux Setup](#ubuntulinux-setup)
  - [Windows Setup](#windows-setup)
- [Docker Commands](#docker-commands)
- [Development Workflow](#development-workflow)
- [Production Deployment](#production-deployment)
- [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Tools
- **Docker** & **Docker Compose** (v3.8+)
- **Git**
- **Node.js** (v16+) and npm (for frontend builds)
- **Composer** (for PHP dependency management)
- **PHP** (v8.3+) - if running outside Docker for local development

### Optional Tools
- **Git LFS** (for large files)
- **Make** (for command shortcuts)

---

## Installation

### Ubuntu/Linux Setup

#### 1. Install Prerequisites

```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Install Docker
sudo apt install -y docker.io docker-compose

# Start Docker daemon
sudo systemctl start docker
sudo systemctl enable docker

# Add current user to docker group (to run without sudo)
sudo usermod -aG docker $USER
newgrp docker

# Install Node.js & npm
sudo apt install -y nodejs npm

# Install Composer
curl -sS https://getcomposer.org/installer | php
sudo mv composer.phar /usr/local/bin/composer
chmod +x /usr/local/bin/composer
```

#### 2. Clone Repository

```bash
git clone https://github.com/billabear/billabear.git
cd billabear
```

#### 3. Environment Setup

```bash
# Copy environment template
cp .env.local.example .env.local

# Edit .env.local with your settings
nano .env.local

# Key variables to configure:
# - APP_ENV=dev (use 'prod' for production)
# - APP_SECRET=your_secret_key (generate with: openssl rand -base64 32)
# - DATABASE settings (provided by Docker)
# - Stripe/Payment API keys (optional)
```

#### 4. Install Dependencies

```bash
# Install PHP dependencies
composer install

# Install Node.js dependencies
npm install

# Build frontend assets
npm run build
```

#### 5. Start Docker Containers

```bash
# Build and start all services
docker compose up --build -d

# Verify containers are running
docker compose ps
```

#### 6. Initialize Database

```bash
# Run database migrations
docker compose exec php-fpm bin/console doctrine:migrations:migrate

# Load fixtures (optional)
docker compose exec php-fpm bin/console doctrine:fixtures:load
```

#### 7. Access Application

```
Frontend: http://localhost:7847
Admin: http://localhost:7847/site/home
```

---

### Windows Setup

#### 1. Install Prerequisites

##### Option A: Using Chocolatey (Recommended)

```powershell
# Install Chocolatey first: https://chocolatey.org/install

choco install docker-desktop git nodejs composer -y
```

##### Option B: Manual Installation

- **Docker Desktop**: https://www.docker.com/products/docker-desktop
- **Git**: https://git-scm.com/download/win
- **Node.js**: https://nodejs.org/ (includes npm)
- **Composer**: https://getcomposer.org/download/

#### 2. Clone Repository

```powershell
git clone https://github.com/billabear/billabear.git
cd billabear
```

#### 3. Environment Setup

```powershell
# Copy environment template
Copy-Item .env.local.example .env.local

# Edit with your text editor (Notepad, VS Code, etc.)
notepad .env.local
```

#### 4. Install Dependencies

```powershell
# Install PHP dependencies
composer install

# Install Node.js dependencies
npm install

# Build frontend assets
npm run build
```

#### 5. Start Docker Containers

```powershell
# Build and start services
docker-compose up --build -d

# View running containers
docker-compose ps
```

#### 6. Initialize Database

```powershell
# Run migrations
docker-compose exec php-fpm bin/console doctrine:migrations:migrate

# Load sample data (optional)
docker-compose exec php-fpm bin/console doctrine:fixtures:load
```

#### 7. Access Application

```
Frontend: http://localhost:7847
Admin: http://localhost:7847/site/home
```

---

## Docker Commands

### Basic Operations

```bash
# Start services
docker compose up -d

# Stop services
docker compose down

# View logs for all services
docker compose logs -f

# View logs for specific service (nginx, php-fpm, database, redis, elasticsearch)
docker compose logs -f nginx
docker compose logs -f php-fpm

# Rebuild containers (after code/config changes)
docker compose up --build -d

# Remove all containers and volumes (WARNING: deletes data!)
docker compose down -v
```

### Container Management

```bash
# Execute command in PHP container
docker compose exec php-fpm bash

# Execute Symfony console command
docker compose exec php-fpm bin/console cache:clear
docker compose exec php-fpm bin/console doctrine:migrations:migrate

# View container processes
docker compose exec php-fpm ps aux

# Check resource usage
docker stats
```

### Database Operations

```bash
# Access PostgreSQL database
docker compose exec database psql -U postgres -d billabear

# Create database backup
docker compose exec database pg_dump -U postgres billabear > backup.sql

# Restore database from backup
docker compose exec -T database psql -U postgres billabear < backup.sql

# View database logs
docker compose logs database
```

### Nginx Operations

```bash
# Restart nginx
docker compose restart nginx

# Validate nginx configuration
docker compose exec nginx nginx -t

# View nginx access logs
docker compose logs nginx

# Reload nginx config (without restart)
docker compose exec nginx nginx -s reload
```

### Redis Operations

```bash
# Access Redis CLI
docker compose exec redis redis-cli

# Check Redis memory usage
docker compose exec redis redis-cli INFO memory

# Flush all cache (WARNING: clears cache)
docker compose exec redis redis-cli FLUSHALL
```

### Elasticsearch Operations

```bash
# Check Elasticsearch health
curl http://localhost:9200/_cluster/health?pretty

# View Elasticsearch indices
curl http://localhost:9200/_cat/indices?v

# Clear Elasticsearch cache
curl -X POST http://localhost:9200/_cache/clear?pretty
```

---

## Development Workflow

### Frontend Development

```bash
# Watch mode - auto-rebuild on file changes
npm run watch

# Build for development
npm run dev

# Build for production
npm run build

# Run tests
npm test
```

### Backend Development

```bash
# Clear application cache
docker compose exec php-fpm bin/console cache:clear

# Generate new migration from entity changes
docker compose exec php-fpm bin/console make:migration

# Run tests
docker compose exec php-fpm bin/phpunit

# Run Behat feature tests
docker compose exec php-fpm bin/behat
```

### Database Migrations

```bash
# Create new migration
docker compose exec php-fpm bin/console make:migration

# Run pending migrations
docker compose exec php-fpm bin/console doctrine:migrations:migrate

# Rollback last migration
docker compose exec php-fpm bin/console doctrine:migrations:migrate prev

# View migration status
docker compose exec php-fpm bin/console doctrine:migrations:status
```

### Code Quality

```bash
# Run PHP CS Fixer
docker compose exec php-fpm php vendor/bin/php-cs-fixer fix src/

# Run PHPUnit tests
docker compose exec php-fpm bin/phpunit

# Run Behat scenarios
docker compose exec php-fpm bin/behat features/

# Check code style
docker compose exec php-fpm vendor/bin/phpstan analyse src/
```

---

## Production Deployment

### Pre-Deployment Checklist

- [ ] Set `APP_ENV=prod` in `.env`
- [ ] Generate strong `APP_SECRET`
- [ ] Configure HTTPS/SSL certificates
- [ ] Set up database backups
- [ ] Configure monitoring (logs, metrics)
- [ ] Set up health checks
- [ ] Configure firewall rules
- [ ] Review security settings

### Deployment Steps

#### 1. Server Setup

```bash
# On production server
ssh user@production-server

# Install dependencies
sudo apt update && sudo apt upgrade -y
sudo apt install -y docker.io docker-compose git

# Start Docker daemon
sudo systemctl start docker
sudo systemctl enable docker
```

#### 2. Clone Repository

```bash
# Create application directory
sudo mkdir -p /var/www/billabear
sudo chown $USER:$USER /var/www/billabear

cd /var/www/billabear
git clone --branch main https://github.com/billabear/billabear.git .
```

#### 3. Configure Environment

```bash
# Copy production environment file
cp .env.prod.example .env.local

# Edit with production settings
nano .env.local

# Required production settings:
APP_ENV=prod
APP_DEBUG=0
DATABASE_URL=postgresql://user:password@host/billabear
REDIS_URL=redis://redis:6379
STRIPE_API_KEY=sk_live_xxxxx
MAILER_DSN=smtp://user:pass@mail:587
```

#### 4. Build and Start Services

```bash
# Build frontend assets
npm install
npm run build

# Build and start Docker containers
docker compose -f docker-compose.prod.yml up --build -d

# Verify all services are running
docker compose ps
```

#### 5. Initialize Database

```bash
# Run migrations
docker compose exec php-fpm bin/console doctrine:migrations:migrate --no-interaction

# Load essential data (if needed)
docker compose exec php-fpm bin/console doctrine:fixtures:load --no-interaction
```

#### 6. Configure HTTPS

```bash
# Using Let's Encrypt with Certbot
sudo apt install -y certbot python3-certbot-nginx

sudo certbot certonly --standalone -d yourdomain.com

# Update docker-compose.prod.yml to use SSL certificates
# Update nginx configuration to redirect HTTP to HTTPS
```

#### 7. Set Up Monitoring

```bash
# Configure log rotation
sudo tee /etc/logrotate.d/billabear > /dev/null <<EOF
/var/www/billabear/var/log/*.log {
    daily
    rotate 14
    compress
    delaycompress
    notifempty
    missingok
}
EOF

# Set up automated backups
sudo crontab -e
# Add: 0 2 * * * docker compose -f /var/www/billabear/docker-compose.prod.yml exec -T database pg_dump -U postgres billabear | gzip > /backups/billabear-$(date +%Y%m%d).sql.gz
```

#### 8. Set Up Auto-Updates

```bash
# Create update script
cat > /var/www/billabear/update.sh <<'EOF'
#!/bin/bash
cd /var/www/billabear
git pull origin main
npm install
npm run build
docker compose -f docker-compose.prod.yml up --build -d
docker compose exec php-fpm bin/console doctrine:migrations:migrate --no-interaction
docker compose exec php-fpm bin/console cache:clear
EOF

chmod +x /var/www/billabear/update.sh

# Schedule daily updates (modify as needed)
sudo crontab -e
# Add: 0 3 * * 0 /var/www/billabear/update.sh >> /var/log/billabear-update.log 2>&1
```

### Production Docker Compose

Create `docker-compose.prod.yml`:

```yaml
version: '3.8'

services:
  database:
    image: timescale/timescaledb-ha:pg17
    restart: always
    environment:
      POSTGRES_DB: billabear
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - db_data:/home/postgres/pgdata/data
    networks:
      - billabear

  redis:
    image: redis:5-alpine
    restart: always
    networks:
      - billabear

  elasticsearch:
    image: elasticsearch:8.17.1
    restart: always
    environment:
      discovery.type: single-node
      xpack.security.enabled: false
    volumes:
      - es_data:/usr/share/elasticsearch/data
    networks:
      - billabear

  php-fpm:
    image: billabear/ubuntu-php-fpm:8.4
    restart: always
    environment:
      APP_ENV: prod
      APP_SECRET: ${APP_SECRET}
      DATABASE_URL: postgresql://${DB_USER}:${DB_PASSWORD}@database:5432/billabear
      REDIS_URL: redis://redis:6379
    volumes:
      - .:/var/www
    networks:
      - billabear

  nginx:
    image: getparthenon/ubuntu-nginx:21.04
    restart: always
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - .:/var/www
      - ./docker/nginx/nginx.conf:/etc/nginx/nginx.conf
      - ./docker/nginx/sites/:/etc/nginx/sites-available
      - /etc/letsencrypt:/etc/letsencrypt:ro
    depends_on:
      - php-fpm
    networks:
      - billabear

volumes:
  db_data:
  es_data:

networks:
  billabear:
    driver: bridge
```

### Monitoring and Maintenance

```bash
# Monitor resource usage
watch -n 5 'docker stats'

# Check disk space
df -h
du -sh /var/www/billabear

# View error logs
docker compose logs --tail 100 php-fpm | grep -i error

# Performance monitoring
docker compose exec php-fpm bin/console cache:pool:list
docker compose exec redis redis-cli INFO stats

# Database optimization
docker compose exec database vacuumdb -U postgres billabear
docker compose exec database reindexdb -U postgres billabear
```

### Backup and Recovery

```bash
# Create full backup
docker compose exec -T database pg_dump -U postgres billabear > /backups/billabear-full.sql

# Create backup with compression
docker compose exec -T database pg_dump -U postgres billabear | gzip > /backups/billabear-$(date +%Y%m%d-%H%M%S).sql.gz

# Restore from backup
gunzip < /backups/billabear-backup.sql.gz | docker compose exec -T database psql -U postgres billabear

# Backup uploads/files
tar -czf /backups/billabear-files-$(date +%Y%m%d).tar.gz /var/www/billabear/public/uploads/

# Verify backup integrity
gzip -t /backups/billabear-*.sql.gz
```

---

## Troubleshooting

### Common Issues

#### Docker containers won't start

```bash
# Check logs
docker compose logs

# Rebuild containers
docker compose down -v
docker compose up --build -d

# Check Docker daemon
sudo systemctl restart docker
```

#### Database connection error

```bash
# Verify database container is running
docker compose ps database

# Check database logs
docker compose logs database

# Verify DATABASE_URL in .env.local
cat .env.local | grep DATABASE_URL

# Test connection
docker compose exec php-fpm bin/console doctrine:database:create
```

#### Port already in use

```bash
# Find process using port 7847
sudo lsof -i :7847

# Kill process
sudo kill -9 <PID>

# Or change port in docker-compose.yaml
# Change: ports: - "7847:80" to - "8080:80"
```

#### Assets not loading (404 errors)

```bash
# Rebuild frontend assets
npm install
npm run build

# Clear cache
docker compose exec php-fpm bin/console cache:clear

# Restart nginx
docker compose restart nginx
```

#### Database migration errors

```bash
# View migration status
docker compose exec php-fpm bin/console doctrine:migrations:status

# Rollback last migration
docker compose exec php-fpm bin/console doctrine:migrations:migrate prev

# Reset database (WARNING: deletes data!)
docker compose exec php-fpm bin/console doctrine:database:drop --force
docker compose exec php-fpm bin/console doctrine:database:create
docker compose exec php-fpm bin/console doctrine:migrations:migrate
```

#### Nginx returning 502 Bad Gateway

```bash
# Check PHP-FPM is running
docker compose ps php-fpm

# Check PHP-FPM logs
docker compose logs php-fpm

# Restart PHP-FPM
docker compose restart php-fpm

# Check nginx config
docker compose exec nginx nginx -t
```

#### Out of disk space

```bash
# Check disk usage
df -h

# Clean up Docker
docker system prune -a --volumes

# Remove old logs
docker compose logs --tail 0 > /dev/null

# Check large directories
du -sh /var/www/billabear/*
```

### Getting Help

- **Documentation**: Check `/docs` directory
- **Issues**: https://github.com/billabear/billabear/issues
- **Community**: [Discussions/Forum]
- **Email**: support@billabear.com

---

## Security Considerations

1. **Environment Variables**: Never commit `.env.local` to version control
2. **SSH Keys**: Secure your deployment SSH keys
3. **Database**: Use strong passwords, limit network access
4. **HTTPS**: Always use SSL/TLS in production
5. **Firewall**: Configure firewall rules to only expose necessary ports
6. **Updates**: Keep Docker images and dependencies updated
7. **Backups**: Maintain regular automated backups
8. **Monitoring**: Set up alerts for errors and resource usage

---

## Performance Optimization

```bash
# Enable query cache (Redis)
docker compose exec php-fpm bin/console cache:pool:list

# Configure Elasticsearch
docker compose exec elasticsearch curl -X PUT "localhost:9200/_settings" -H 'Content-Type: application/json' -d'{"index": {"refresh_interval": "30s"}}'

# Optimize database
docker compose exec database vacuumdb -U postgres billabear

# Monitor memory usage
docker stats --no-stream
```

---

Last Updated: November 18, 2025
