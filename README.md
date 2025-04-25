# AntoManga Project Description
```
An website to save all owned manga, the site allows you manage (add, edit or delete) your manga/light novels.

You can visit the site either anonymously or have an account so you can add your personal manga/novels (in which case you will only see your manga/novels)
```


# Setup Project
Fork and clone the repository 

Enter into AntoManga Folder
# Create and set the virtual environment
```
python -m venv venv
venv/Scripts/activate or source venv/bin/activate
pip install -r requirements.txt
```

# Create Database  

## ! Don't change anything before this
```
cd src/
python manager.py makemigrations series
python manager.py makemigrations publishers
```
Just one time
```
python manage.py migrate   
```

Create the superuser
```
python manage.py createsuperuser
```
```diff
- After doing so, you'll be able to create new apps or edit models

```
# Run Project
## Run setup script
```
python core/setup.py
```
## For Production
Change ALLOWED_HOSTS
```diff
- ALLOWED_HOSTS = ["antomanga.pythonanywhere.com"] if not DEBUG else ["*"]

+ ALLOWED_HOSTS = ["YourDomain"] if not DEBUG else ["*"]
```
## For Devs
in .env file change:
```diff
- DEBUG=False
+ DEBUG=True

- VITE_LIVE_SERVER=False
+ VITE_LIVE_SERVER=True
```
## Run server
```
python manager.py runserver
```
### For devs
You need to run the vite server as well

Anyway you will always connect to the django server

Open another terminal

```
cd src/frontend
npm run dev
```
#### More Information
VITE_NETWORK allows the server to be used for lan

[Frontend README](https://github.com/Antonino0704/AntoManga/blob/main/src/frontend/README.md)
