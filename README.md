# interpart
installation for moabit

## Run as Service

* install supervisor `sudo apt-install supervisor`
* run at startup with `sudo systemctl enable supervisor`
* create supervisor script in */etc/supervisor/conf.d/interpart.conf*:
    ```
    [program:interpart_server]
    directory = /home/pi/interpart/modules/database
    command = node index.js
    user = pi
    ```
* read config with `sudo supervisorctl reread; sudo supervisorctl update`
* contro service with `sudo supervisorctl status | stop | start | tail`
