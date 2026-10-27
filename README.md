# AntoManga Project Description

An website to save all owned manga, the site allows you manage (add, edit or delete) your manga/light novels.

You can visit the site either anonymously or have an account so you can add your personal manga/novels (in which case you will only see your manga/novels)

# Prerequisites
- <img src="https://img.shields.io/badge/Python-3.15-gray?logo=Python&logoColor=yellow&labelColor=darkblue" alt="python" />
- <img src="https://img.shields.io/badge/Node-24-gray?logo=node.js&logoColor=white&labelColor=darkgreen" alt="node" />
- <a href="https://git-scm.com/" target="_blank"><img style="margin: 10px" src="https://img.shields.io/badge/-Git-F05032?logo=Git&logoColor=white" alt="Git" /></a>

# Setup Project
Fork and clone the repository 

Enter into AntoManga Folder

You can set up and run the project in one of the following ways:
- **Manual installation:** [Follow the guide](#Create-and-set-the-virtual-environment)
- ----------------------------------------
- **Using the setup script:** run the script  ```./shell_scripts/setup.sh```
> [!IMPORTANT]
> The script works on debian-like os only

> [!TIP]
> If it doesn't work you use ```chmod +x shell_scripts/setup.sh``` first
- ----------------------------------------
- [**Docker**](https://github.com/Antonino0704/AntoManga/blob/main/docs/setDocker.md)
> [!NOTE]
> Production only
- ----------------------------------------

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

# Run Project

## For Production
### Create Database  
> [!WARNING]
> Don't change anything before this
```
python core/generateCnfFiles.py
python manage.py migrate   
```

Create the superuser
```
python manage.py createsuperuser
```

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
### Create Database  
> [!WARNING]
> Don't change anything before this
```
python manage.py migrate   
```

Create the superuser
```
python manage.py createsuperuser
```
> [!NOTE]
> After doing so, you'll be able to create new apps or edit models

[Set dev server](https://github.com/Antonino0704/AntoManga/blob/main/docs/setDevServer.md)

# Contribute
If you find any bugs or want to contribute, open a pull request 

Run
```
black .
npm run lint
npm run format
python manage.py test
```
...And follow the [Angular Conventional Commit](https://www.conventionalcommits.org/en/v1.0.0-beta.4/). Remember to bump the version.json version and package.json version following the [semantic versioning standards](https://semver.org/)

