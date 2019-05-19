# Input Module

Speech and Keyboard Input Module for installation

## Prerequisites

* enable speech-to-text feature in your google cloud api project: [https://console.developers.google.com/apis/api/speech.googleapis.com/]
* download json file of project and set your $GOOGLE_APPLICATION_CREDENTIALS to its path: osx: `export GOOGLE_APPLICATION_CREDENTIALS="[PATH]"` (add to *.bashrc*)

## Setup

* install virtualenv: `sudo pip install virtualenv`
* create virtual envronment: `virtualenv -p python3 .venv`
* load virtualenvironment: `source .venv/bin/activate`
* install portaudio: `brew install portaudio`
    * if linuxbrew is not installed: `sudo apt-get install linuxbrew-wrapper`
* install dependencies: `pip install -r requirements.txt`
    * if there is a problem installing pyaudio install it with: `pip install --global-option='build_ext' --global-option='-I/usr/local/include' --global-option='-L/usr/local/lib' pyaudio`

### Setup locale on raspberry pi

* add these 3 lines to ~/.bashrc:
    ```
    export LANGUAGE=en_US.UTF-8
    export LANG=en_US.UTF-8
    export LC_ALL=en_US.UTF-8
    ```
* run `source ~/.bashrc`
* run `dpkg-reconfigure locales` and generate lang files and set language to *en_US.UTF-8*
    

## Run Script

* load virtualenvironment: `source .venv/bin/activate`
* run script with `python run.py`
