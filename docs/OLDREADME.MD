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
```

You need do that for all your apps except the django default 

(If you have a custom user, i think you need to do as well)
```
python manager.py makemigrations YourApp
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
Run server
```
python manager.py runserver
```

# Update Database
if git pull changes some model

...and you already have a database and you don't want to remove it, before git pull, you can run 
```
python manager.py makemigrations AppToUpdate
python manage.py migrate  
```
Now you can change the model with git pull and run again makemigrations and migrate

# For devs
Open another terminal

```
change VITE_LIVE_SERVER = True in settings.py 
```

[Read this](https://github.com/Antonino0704/AntoManga/blob/main/src/frontend/README.md)