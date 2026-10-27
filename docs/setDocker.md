# Set Docker
In this example we will set up an http server and we will use the debian-like linux os, for https read the nginx and gunicorn docs

## Prerequisites
- <img src="https://img.shields.io/badge/Docker-blue?logo=docker&logoColor=white" alt="docker" />

# Installation
Enter into docker folder

``` cd docker/ ```

## Run setup scripts
```./setupDockerEnv.sh ```
> [!TIP]
> If it doesn't work you use ```chmod +x setupDockerEnv.sh``` first

When prompted, answer the questions. This will create a .env file in the docker directory

```./setupDockerDatabase.sh ```
> [!TIP]
> If it doesn't work you use ```chmod +x setupDockerDatabase.sh``` first

When prompted, answer the questions. This will create my.cnf and mariadb.env files

## Create docker container
Install docker image and create container

``` 
docker compose build
docker compose up -d 
```

# Run
Now the website will be available to localhost:8080 (or similar, depending on your configuration)

# More Information

If you prefer to run the web app behind an external reverse proxy (e.x. for https)

Change in docker/nginx/default.conf

```diff
- proxy_set_header X-Forwarded-Proto $scheme;

+ proxy_set_header X-Forwarded-Proto $http_x_forwarded_proto;
```
And in django settings, add
```diff
+ SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")
```
> [!CAUTION]
> The nginx service inside the Docker container should not publish its ports directly to the host
