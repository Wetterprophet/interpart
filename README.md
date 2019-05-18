# interpart
installation for moabit

## Setup

Each module has to be setup by following its README.md:

* [modules/translate/README.md](modules/translate/README.md)
* [modules/database/README.md](modules/database/README.md)
* [modules/input/README.md](modules/input/README.md)
* [modules/pdf_creator/README.md](modules/pdf_creator/README.md)

## Run as Service

* install supervisor `sudo apt-install supervisor`
* run at startup with `sudo systemctl enable supervisor`
* create supervisor script in */etc/supervisor/conf.d/interpart.conf* (you might have to adjust the path names)
    ```
    [program:interpart_server]
    directory = /home/pi/interpart/modules/database
    command = node index.js
    user = pi
    environment = GOOGLE_APPLICATION_CREDENTIALS="/home/pi/interop-translations.json"
    ```
* read config with `sudo supervisorctl reread; sudo supervisorctl update`
* contro service with `sudo supervisorctl status | stop | start | tail`

## Autostart Script

* edit `nano ~/.bashrc` and add line `~/interpart/modules/input/.venv/bin/python ~/interpart/modules/input/run.py` (change path to module if necesarry)
* run `sudo raspi-config` and set up to boot pi in cli automaticaly