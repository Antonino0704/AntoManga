# Run setProd.sh script
The script works on debian-like os only, and it folows this [guide](https://github.com/Antonino0704/AntoManga/blob/main/docs/setProdServer.md)

If it doesn't work you use ``` chmod +x shell_scripts/setProd.sh ``` first

``` ./shell_scripts/setProd.sh ``` the default port is 8080

You can use another port with ``` ./shell_scripts/setProd.sh portNumber ``` (for e.x. ``` ./shell_scripts/setProd.sh 5173```)

This script installs and configures nginx and installs gunicorn (with port 8000)

# Run runGunicorn.sh script
If it doesn't work you use ``` chmod +x shell_scripts/runGunicorn.sh ``` first

``` ./shell_scripts/runGunicorn.sh ```

# Run
Now the website will be available to localhost:8080
