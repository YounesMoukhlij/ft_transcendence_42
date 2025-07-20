#!/bin/bash
set -e

USER=ubuntu
HOME_DIR=/home/$USER
SSH_DIR=$HOME_DIR/.ssh

echo "🚀 Starting full project setup script"

echo "🧹 Cleaning up old ondrej/php PPA if exists"
add-apt-repository --remove ppa:ondrej/php -y || true
rm -f /etc/apt/sources.list.d/ondrej-ubuntu-php-*.list
rm -f /etc/apt/sources.list.d/ondrej-ubuntu-php-*.sources

echo "🔧 Updating package lists"
apt update -y

echo "🔧 Installing required packages"
apt install -y software-properties-common

# Check Ubuntu version and install PHP accordingly
UBUNTU_VERSION=$(lsb_release -rs)
UBUNTU_CODENAME=$(lsb_release -cs)

echo "📋 Detected Ubuntu $UBUNTU_VERSION ($UBUNTU_CODENAME)"

if [[ "$UBUNTU_CODENAME" == "jammy" || "$UBUNTU_CODENAME" == "focal" || "$UBUNTU_CODENAME" == "noble" ]]; then
    echo "🔧 Adding ondrej/php PPA for supported Ubuntu version"
    add-apt-repository ppa:ondrej/php -y
    apt update -y
    apt install -y nginx git php8.4 php8.4-fpm php8.4-mysql php8.4-xml php8.4-gd composer
elif [[ "$UBUNTU_CODENAME" == "oracular" ]]; then
    echo "🔧 Using default PHP packages for Ubuntu 24.10"
    apt update -y
    apt install -y nginx git php php-fpm php-mysql php-xml php-gd composer
    
    # Create symlinks for compatibility
    PHP_VERSION=$(php -r "echo PHP_MAJOR_VERSION.'.'.PHP_MINOR_VERSION;")
    ln -sf /run/php/php$PHP_VERSION-fpm.sock /run/php/php8.4-fpm.sock || true
else
    echo "⚠️  Unknown Ubuntu version, trying default packages"
    apt update -y
    apt install -y nginx git php php-fpm php-mysql php-xml php-gd composer
    
    # Create symlinks for compatibility
    PHP_VERSION=$(php -r "echo PHP_MAJOR_VERSION.'.'.PHP_MINOR_VERSION;")
    ln -sf /run/php/php$PHP_VERSION-fpm.sock /run/php/php8.4-fpm.sock || true
fi

echo "🔑 Setting up SSH keys for user $USER"
sudo -u $USER mkdir -p $SSH_DIR
sudo -u $USER chmod 700 $SSH_DIR

# Write private key
sudo -u $USER tee $SSH_DIR/id_ed25519 > /dev/null <<'PRIVATE_KEY'
-----BEGIN OPENSSH PRIVATE KEY-----
b3BlbnNzaC1rZXktdjEAAAAABG5vbmUAAAAEbm9uZQAAAAAAAAABAAAAMwAAAAtzc2gtZW
QyNTUxOQAAACA+LFJR78I67iVjaK7AVuHF0ziKBTlGLVPsESmM7O0qswAAAJgGxc9VBsXP
VQAAAAtzc2gtZWQyNTUxOQAAACA+LFJR78I67iVjaK7AVuHF0ziKBTlGLVPsESmM7O0qsw
AAAEBwZ8m0EIs4W2+CiY9pqtRPHEwufIIsZZUTcSADMfsSJT4sUlHvwjruJWNorsBW4cXT
OIoFOUYtU+wRKYzs7SqzAAAAEG1hY0BpbnN0YW5jZXRlc3QBAgMEBQ==
-----END OPENSSH PRIVATE KEY-----
PRIVATE_KEY

sudo -u $USER chmod 600 $SSH_DIR/id_ed25519

echo "🔑 Adding github.com to known_hosts"
sudo -u $USER ssh-keyscan github.com >> $SSH_DIR/known_hosts

echo "📦 Cloning repository"
if [ ! -d "$HOME_DIR/app/.git" ]; then
    sudo -u $USER git clone git@github.com:mohamedatamm/coupon.git $HOME_DIR/app
else
    echo "✅ Repo already exists, pulling latest changes"
    cd $HOME_DIR/app
    sudo -u $USER git pull
fi

echo "📝 Creating .env file"
cd $HOME_DIR/app

# Ensure proper ownership of the app directory
chown -R $USER:$USER $HOME_DIR/app

# Create .env file with proper permissions
sudo -u $USER tee .env > /dev/null <<'ENVFILE'
APP_NAME="كوبونات الأفضل"
APP_ENV=production
APP_KEY=base64:FOf4hh1VSMdeL1dL25Xa293CZw3ScxLqaXPz2hw8HcE=
APP_DEBUG=true
APP_TIMEZONE=UTC
APP_URL="http://couponalyom.com"
FRONTEND_URL=https://coupon-next-opal.vercel.app
SANCTUM_STATEFUL_DOMAINS=coupon-next-opal.vercel.app

APP_LOCALE=en
APP_FALLBACK_LOCALE=en
APP_FAKER_LOCALE=en_US

APP_MAINTENANCE_DRIVER=file

PHP_CLI_SERVER_WORKERS=4

BCRYPT_ROUNDS=12

LOG_CHANNEL=stack
LOG_STACK=single
LOG_LEVEL=debug

DB_CONNECTION=mysql

DB_HOST=34.18.21.250
DB_PORT=3306
DB_DATABASE=coupons
DB_USERNAME=coupons
DB_PASSWORD="QT2r2JzNQKCbCJE1G9bC"

SESSION_DRIVER=file
SESSION_LIFETIME=120

BROADCAST_CONNECTION=log
FILESYSTEM_DISK=gcs

CACHE_STORE=database
CACHE_PREFIX=

MEMCACHED_HOST=127.0.0.1

REDIS_CLIENT=phpredis
REDIS_HOST=127.0.0.1
REDIS_PORT=6379

MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=info.elafdl@gmail.com
MAIL_PASSWORD=rxjajlomhsscdxsj
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=info.elafdl@gmail.com
MAIL_FROM_NAME="كوبونات الأفضل"

GOOGLE_CLOUD_PROJECT_ID=augmented-slice-445413-h0
GOOGLE_CLOUD_KEY_FILE=augmented-slice-445413-h0-fc573a358932.json
GOOGLE_CLOUD_STORAGE_BUCKET=cdn-el-afdl-com-bucket

LOAD_BALANCER_DOMAIN=cdn.el-afdl.com

CRON_SECRET_TOKEN=xY1g7fUBcc1bUu6E7m9lRiXMQg4ZRlATdSacBsTNPgRiBmqa3CTZQXkJfgcqjQU1
ENVFILE

echo "📦 Installing composer dependencies"
sudo -u $USER composer install --no-interaction

echo "🔧 Setting up Laravel - Initial commands"
sudo -u $USER php artisan key:generate --force
sudo -u $USER php artisan config:clear
sudo -u $USER php artisan cache:clear
sudo -u $USER php artisan migrate --force


echo "🔧 Setting up permissions - First phase"
# Create necessary directories with proper permissions
sudo -u $USER mkdir -p $HOME_DIR/app/storage/logs
sudo -u $USER mkdir -p $HOME_DIR/app/storage/framework/{cache,sessions,views}
sudo -u $USER mkdir -p $HOME_DIR/app/bootstrap/cache

# Set proper permissions for Laravel directories
chmod -R 775 $HOME_DIR/app/storage $HOME_DIR/app/bootstrap/cache
chown -R $USER:www-data $HOME_DIR/app/storage $HOME_DIR/app/bootstrap/cache

echo "🌐 Configuring Nginx"
# Detect actual PHP version for FPM socket
PHP_VERSION=$(php -r "echo PHP_MAJOR_VERSION.'.'.PHP_MINOR_VERSION;")

cat > /etc/nginx/sites-available/default <<NGINX_CONF
server {
    listen 80;
    server_name _;
    root /home/ubuntu/app/public;

    index index.php index.html;

    access_log /var/log/nginx/access.log;
    error_log  /var/log/nginx/error.log;

    location / {
        try_files \$uri \$uri/ /index.php?\$query_string;
    }

    location ~ \.php$ {
        include snippets/fastcgi-php.conf;
        fastcgi_pass unix:/run/php/php${PHP_VERSION}-fpm.sock;
    }

    location ~ /\.ht {
        deny all;
    }
}
NGINX_CONF

echo "🔧 Setting up directory permissions for web server"
chmod 755 /home
chmod 755 /home/ubuntu
chmod 755 /home/ubuntu/app
chmod 755 /home/ubuntu/app/public

echo "🔄 Restarting services"
# Restart the actual PHP-FPM service based on installed version
PHP_VERSION=$(php -r "echo PHP_MAJOR_VERSION.'.'.PHP_MINOR_VERSION;")
systemctl restart php${PHP_VERSION}-fpm
systemctl restart nginx
systemctl enable nginx

echo "🔧 Final Laravel optimizations"
cd $HOME_DIR/app

# Run Laravel commands as ubuntu user before changing ownership
sudo -u $USER php artisan config:cache
sudo -u $USER php artisan route:cache
sudo -u $USER php artisan view:cache

echo "🔧 Setting up final permissions"
# Final permission setup - ensure both ubuntu and www-data can work with the files
chown -R $USER:www-data $HOME_DIR/app
chmod -R 775 $HOME_DIR/app/storage $HOME_DIR/app/bootstrap/cache
chmod -R 644 $HOME_DIR/app/bootstrap/cache/*
chmod -R 644 $HOME_DIR/app/storage/logs/*

# Set proper permissions for cached files
find $HOME_DIR/app/bootstrap/cache -type f -exec chmod 664 {} \;
find $HOME_DIR/app/storage -type f -exec chmod 664 {} \;
find $HOME_DIR/app/storage -type d -exec chmod 775 {} \;

echo "✅ Full project setup complete!"
echo "🌐 Your application should now be accessible via your server IP"
echo "📋 Check the logs at /var/log/nginx/ if you encounter any issues"



echo "🔧 Laravel Permission Fix Script"
echo "================================"

USER=ubuntu
HOME_DIR=/home/$USER
APP_DIR=$HOME_DIR/app

echo ""
echo "1. Stopping services temporarily:"
systemctl stop nginx
systemctl stop php8.3-fpm

echo ""
echo "2. Checking current permissions:"
ls -la $APP_DIR/ | head -10

echo ""
echo "3. Resetting ownership to ubuntu user:"
chown -R $USER:$USER $APP_DIR

echo ""
echo "4. Creating necessary directories with proper permissions:"
sudo -u $USER mkdir -p $APP_DIR/storage/logs
sudo -u $USER mkdir -p $APP_DIR/storage/framework/cache/data
sudo -u $USER mkdir -p $APP_DIR/storage/framework/sessions
sudo -u $USER mkdir -p $APP_DIR/storage/framework/views
sudo -u $USER mkdir -p $APP_DIR/storage/app/public
sudo -u $USER mkdir -p $APP_DIR/bootstrap/cache

echo ""
echo "5. Setting proper permissions for storage and bootstrap directories:"
chmod -R 775 $APP_DIR/storage
chmod -R 775 $APP_DIR/bootstrap/cache

echo ""
echo "6. Clearing any existing cache files:"
sudo -u $USER rm -f $APP_DIR/bootstrap/cache/*.php
sudo -u $USER rm -rf $APP_DIR/storage/framework/cache/data/*
sudo -u $USER rm -rf $APP_DIR/storage/framework/sessions/*
sudo -u $USER rm -rf $APP_DIR/storage/framework/views/*

echo ""
echo "7. Creating empty log file with proper permissions:"
sudo -u $USER touch $APP_DIR/storage/logs/laravel.log
chmod 664 $APP_DIR/storage/logs/laravel.log

echo ""
echo "8. Running Laravel commands as ubuntu user:"
cd $APP_DIR

echo "  - Clearing config cache..."
sudo -u $USER php artisan config:clear

echo "  - Clearing application cache..."
sudo -u $USER php artisan cache:clear

echo "  - Clearing route cache..."
sudo -u $USER php artisan route:clear

echo "  - Clearing view cache..."
sudo -u $USER php artisan view:clear

echo "  - Running migrations..."
sudo -u $USER php artisan migrate --force

echo ""
echo "9. Now caching configuration (this should work now):"
sudo -u $USER php artisan config:cache

echo "  - Caching routes..."
sudo -u $USER php artisan route:cache

echo "  - Caching views..."
sudo -u $USER php artisan view:cache

echo ""
echo "10. Setting final permissions for web server access:"
# Set group to www-data while keeping user as ubuntu
chgrp -R www-data $APP_DIR/storage
chgrp -R www-data $APP_DIR/bootstrap/cache

# Ensure both user and group have write permissions
chmod -R 775 $APP_DIR/storage
chmod -R 775 $APP_DIR/bootstrap/cache

# Set proper file permissions
find $APP_DIR/storage -type f -exec chmod 664 {} \;
find $APP_DIR/bootstrap/cache -type f -exec chmod 664 {} \;

echo ""
echo "11. Verifying permissions:"
echo "Storage directory:"
ls -la $APP_DIR/storage/

echo "Bootstrap cache directory:"
ls -la $APP_DIR/bootstrap/cache/

echo "Log file:"
ls -la $APP_DIR/storage/logs/laravel.log

echo ""
echo "12. Starting services:"
systemctl start php8.3-fpm
systemctl start nginx

echo ""
echo "13. Testing Laravel application:"
cd $APP_DIR
sudo -u $USER php artisan --version

echo ""
echo "14. Creating a simple test to verify everything works:"
sudo -u $USER php artisan tinker --execute="echo 'Laravel is working: ' . app()->version();"

echo ""
echo "15. Final verification - checking what's in public directory:"
ls -la $APP_DIR/public/

echo ""
echo "✅ Laravel permissions fixed!"
echo ""
echo "🌐 Your application should now be accessible at:"
echo "   http://34.18.84.46/"
echo ""
echo "📋 If you still have issues, check:"
echo "   - Nginx error logs: tail -f /var/log/nginx/error.log"
echo "   - Laravel logs: tail -f $APP_DIR/storage/logs/laravel.log"
echo "   - PHP-FPM logs: journalctl -u php8.3-fpm -f"