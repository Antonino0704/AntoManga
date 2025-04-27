# Set Production Server
In this example we will set up an http server and we will use the debian-like linux os, for https read the nginx and gunicorn docs

Follow the guide or run the [script (debian-like only)](https://github.com/Antonino0704/AntoManga/blob/main/docs/setProdScript.md)

Active virtual env
```
venv/Scripts/activate or source venv/bin/activate
```
Collects static files
```
cd src/
python manage.py collectstatic
```
You can delete the rest_framework folder

# Nginx installation
We will use the port 8080

Install nginx
```
sudo apt install nginx
```
Set the nginx server
```
sudo vi /etc/nginx/sites-available/antomanga
```
write in it:
```
server {
    listen 8080;
    server_name _;

    location /media/ {
        alias YourPath/AntoManga/src/static/images/;
        try_files $uri @DjangoServer;
    }

    location /static/ {
        alias YourPath/AntoManga/src/static/;
        try_files $uri @DjangoServer;
    }

    location / {
        try_files $uri @DjangoServer;
    }

    location @DjangoServer {
        proxy_pass http://127.0.0.1:8000; # the django server
        proxy_set_header Host $host:$server_port; # if you use the port 80 (http) or 443 (https), you can remove :$server_port
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```
Enable the nginx site
```
sudo ln -s /etc/nginx/sites-available/antomanga /etc/nginx/sites-enabled/
 ```
Check and reload
```
sudo nginx -t
sudo systemctl reload nginx
```

# Gunicorn installation
We will use the port 8000

Install gunicorn
```
pip install gunicorn
```
Start the gunicorn server
```
gunicorn config.wsgi:application --bind 0.0.0.0:8000
```
# Run
Now the website will be available to localhost:8080
