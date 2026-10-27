#!/bin/bash
set -euo pipefail

cnfFile="my.cnf"
envFile="mariadb.env"

read -r -p "Enter the databse name [antomanga]: " db_name
db_name="${db_name:-antomanga,}"

read -r -p "Enter the databse user: " db_user

read -r -p "Enter the databse password: " db_passwd

cat > "$envFile" <<EOF
MARIADB_DATABASE=$db_name
MARIADB_USER=$db_user
MARIADB_PASSWORD=$db_passwd
MARIADB_ROOT_PASSWORD=root
EOF

chmod 600 "$envFile"
cd "$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/../src"

cat > "$cnfFile" <<EOF
[client]
database=$db_name
user=$db_user
password=$db_passwd
host=db
default-character-set=utf8mb4
EOF

chmod 600 "$cnfFile"
echo "The cnf and mariadb.env files have been created successfully."