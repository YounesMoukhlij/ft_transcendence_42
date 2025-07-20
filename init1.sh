#!/bin/bash
set -e

echo "🚀 Starting auto-scaling friendly Laravel setup..."

# -------------------------
# 🕒 Wait for apt locks
# -------------------------
while sudo fuser /var/lib/apt/lists/lock >/dev/null 2>&1 || \
      sudo fuser /var/lib/dpkg/lock-frontend >/dev/null 2>&1; do
    echo "Waiting for apt lock to be released..."
    sleep 2
done

# -------------------------
# 👤 Determine primary user
# -------------------------
if id "ubuntu" >/dev/null 2>&1; then
    USER="ubuntu"
elif id "debian" >/dev/null 2>&1; then
    USER="debian"
else
    USER=$(whoami)
fi
HOME_DIR=$(eval echo "~$USER")
SSH_DIR=$HOME_DIR/.ssh

echo "👤 Using user: $USER"
echo "🏠 Home dir: $HOME_DIR"

# -------------------------
# 🛠️ Install essentials
# -------------------------
apt update -y
apt install -y software-properties-common lsb-release curl git

UBUNTU_CODENAME=$(lsb_release -cs || echo "")
echo "📋 Detected codename: $UBUNTU_CODENAME"

# -------------------------
# 🐘 Install PHP + Nginx
# -------------------------


if [[ "$UBUNTU_CODENAME" == "jammy" || "$UBUNTU_CODENAME" == "focal" || "$UBUNTU_CODENAME" == "noble" ]]; then
    add-apt-repository ppa:ondrej/php -y
    apt update -y
    apt install -y nginx php8.4 php8.4-fpm php8.4-mysql php8.4-xml php8.4-gd composer php-curl php-zip php8.4-curl php8.4-zip
else
    apt install -y nginx php php-fpm php-mysql php-xml php-gd composer php-curl php-zip php8.4-curl php8.4-zip
fi

# -------------------------
# 🔍 Detect PHP version
# -------------------------
PHP_VERSION=$(php -r "echo PHP_MAJOR_VERSION.'.'.PHP_MINOR_VERSION;")
echo "✅ Using PHP version: $PHP_VERSION"

# -------------------------
# 🔑 Setup SSH for GitHub
# -------------------------
sudo -u $USER mkdir -p $SSH_DIR
sudo -u $USER chmod 700 $SSH_DIR

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
sudo -u $USER ssh-keyscan github.com >> $SSH_DIR/known_hosts

# -------------------------
# 📦 Clone your repo
# -------------------------
if [ ! -d "$HOME_DIR/app/.git" ]; then
    sudo -u $USER git clone git@github.com:mohamedatamm/coupon.git $HOME_DIR/app
else
    cd $HOME_DIR/app
    sudo -u $USER git pull
fi

# -------------------------
# 📝 Write .env file
# -------------------------
sudo -u $USER tee $HOME_DIR/app/.env > /dev/null <<'ENVFILE'
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

# -------------------------
# 🎹 Install Composer deps
# -------------------------
cd $HOME_DIR/app
sudo -u $USER composer install --no-interaction




# -------------------------
# 🗄️ Laravel setup
# -------------------------
sudo -u $USER php artisan key:generate --force
sudo -u $USER php artisan migrate --force
sudo -u $USER php artisan config:cache
sudo -u $USER php artisan route:cache
sudo -u $USER php artisan view:cache

# -------------------------
# 🔧 Permissions
# -------------------------
chown -R $USER:www-data $HOME_DIR/app
chmod -R 775 $HOME_DIR/app/storage $HOME_DIR/app/bootstrap/cache

# -------------------------
# 🌐 Nginx config
# -------------------------
cat > /etc/nginx/sites-available/default <<NGINX_CONF
server {
    listen 80;
    server_name admin.el-afdl.com;
    root $HOME_DIR/app/public;

    index index.php index.html;

    access_log /var/log/nginx/access.log;
    error_log  /var/log/nginx/error.log;

    # ✅ هذا هو المطلوب لتفعيل الشهادة:
    location = / {
        return 200 '{"status":"API online"}';
        add_header Content-Type application/json;
    }

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

# -------------------------
# 🚀 Restart services
# -------------------------
systemctl restart php${PHP_VERSION}-fpm
systemctl restart nginx
systemctl enable nginx

sudo chmod o+x /home
sudo chmod o+x /home/ubuntu
sudo chmod o+x /home/ubuntu/app
sudo chmod -R o+rx /home/ubuntu/app/public


echo "✅ Deployment complete!"
echo "🌐 Visit: http://$(curl -s ifconfig.me)/"
echo "📋 Check logs: tail -f /var/log/nginx/error.log"
