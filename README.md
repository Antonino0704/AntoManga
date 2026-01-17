# AntoManga Project Description

An website to save all owned manga, the site allows you manage (add, edit or delete) your manga/light novels.

You can visit the site either anonymously or have an account so you can add your personal manga/novels (in which case you will only see your manga/novels)



# Setup Project
Fork and clone the repository 

Enter into AntoManga Folder

Follow the guide or run the script (debian-like only) 

```./shell_scripts/setup.sh``` (if it doesn't work you use ```chmod +x shell_scripts/setup.sh``` first)
# Create and set the virtual environment
```
python -m venv venv
venv/Scripts/activate or source venv/bin/activate
pip install -r requirements.txt
```
# Run setup script
```
cd src/
python core/setup.py
```

# Create Database  

## ! Don't change anything before this
```
python manage.py makemigrations series
python manage.py makemigrations publishers
python manage.py makemigrations users
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

## For Production
Change ALLOWED_HOSTS in .env file
```diff
- ALLOWED_HOSTS=*,

+ ALLOWED_HOSTS=YourDomain 
or 
+ ALLOWED_HOSTS=YourDomain1,YourDomain2
```
[Set prod server](https://github.com/Antonino0704/AntoManga/blob/main/docs/setProdServer.md)
## For Devs
in .env file change:
```diff
- DEBUG=False
+ DEBUG=True

- VITE_LIVE_SERVER=False
+ VITE_LIVE_SERVER=True
```
[Set dev server](https://github.com/Antonino0704/AntoManga/blob/main/docs/setDevServer.md)

# Contribute
If you find any bugs or want to contribute, open a pull request 

Run
```
black .
npm run lint
npm run format
```
...And follow the [Angular Conventional Commit](https://www.conventionalcommits.org/en/v1.0.0-beta.4/). Remember to bump the version.json version and package.json version following the [semantic versioning standards](https://semver.org/)

