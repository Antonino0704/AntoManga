#!/bin/bash

if [ $# -eq 0 ]; then
	port=8080
else
	port=$1
fi

if [[ $port =~ ^[0-9]+$ ]]; then

	cd "$(cd "$(dirname "{BASH_SOURCE[0]}")" && pwd)"
	cd ../

	# active env
	source venv/bin/activate

	# Collects static files
	cd src/
	python manage.py collectstatic

	# Gunicorn installation
	pip install gunicorn

	# Nging installation
	sudo apt install nginx
	echo "server {
	    listen $port default;
	    server_name _;

	    location /media/ {
		alias $PWD/static/images/;
		try_files \$uri @DjangoServer;
	    }

	    location /static/ {
		alias $PWD/static/;
		try_files \$uri @DjangoServer;
	    }

	    location / {
		try_files \$uri @DjangoServer;
	    }

	    location @DjangoServer {
		proxy_pass http://127.0.0.1:8000; # the django server
		proxy_set_header Host \$host:\$server_port; # if you use the port 80 (http) or 443 (https), you can remove :i\$server_port
		proxy_set_header X-Real-IP \$remote_addr;
		proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
		proxy_set_header X-Forwarded-Proto \$scheme;
	    }
	}" | sudo tee /etc/nginx/sites-available/antomanga
	
	#enable the nginx site
	sudo ln -s /etc/nginx/sites-available/antomanga /etc/nginx/sites-enabled/
	sudo nginx -t
	sudo systemctl reload nginx

else
	echo Error port
fi
