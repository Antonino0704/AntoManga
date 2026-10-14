#!/bin/bash
set -euo pipefail

envFile=".env"

echo "AntoManga Docker SetUp"
echo "---------------------"

read -r -p "Enter the Django secret key [press Enter to generate one]: " secret_key

if [ -z "$secret_key" ]; then
    secret_key=$(python - <<'PY'
import secrets
print(secrets.token_urlsafe(50))
PY
)
 echo "A secure secret key has been generated."
fi

read -r -p "Enter allowed hosts, separated by commas [default: *,]: " ALLOWED_HOSTS
ALLOWED_HOSTS="${ALLOWED_HOSTS:-*,}"

read -r -p "Enter the superuser username [default: admin]: " DJANGO_SUPERUSER_USERNAME
DJANGO_SUPERUSER_USERNAME="${DJANGO_SUPERUSER_USERNAME:-admin}"


while true; do
  read -r -s -p "Enter the superuser password: " DJANGO_SUPERUSER_PASSWORD
  echo ""
  read -r -s -p "Confirm the superuser password: " DJANGO_SUPERUSER_PASSWORD_CONFIRM
  echo ""

  if [ "$DJANGO_SUPERUSER_PASSWORD" == "$DJANGO_SUPERUSER_PASSWORD_CONFIRM" ]; then
    break
  fi

  echo "The passwords do not match. Please try again."
done

read -r -p "Enter the HTTP port for Nginx [default: 80]: " NGINX_PORT
NGINX_PORT="${NGINX_PORT:-80}"

cat > "$envFile" <<EOF
secret_key=$secret_key
ALLOWED_HOSTS=$ALLOWED_HOSTS
DEBUG=False
VITE_LIVE_SERVER=False
VITE_NETWORK=False
BETA=False

DJANGO_SUPERUSER_USERNAME=$DJANGO_SUPERUSER_USERNAME
DJANGO_SUPERUSER_EMAIL=$DJANGO_SUPERUSER_USERNAME@localhost.com
DJANGO_SUPERUSER_PASSWORD=$DJANGO_SUPERUSER_PASSWORD

NGINX_PORT=$NGINX_PORT
EOF

chmod 600 "$envFile"
echo "The .env file has been created successfully."