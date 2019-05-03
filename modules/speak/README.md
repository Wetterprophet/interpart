# Speech Module

Speaks Sentences using googles text to speech api

**This tool does not need to be installed for running the installation**

## Prerequisites

* enable text to speec feature in your google cloud api project
* download json file of project and set your $GOOGLE_APPLICATION_CREDENTIALS to its path: osx: `export GOOGLE_APPLICATION_CREDENTIALS="[PATH]"`

## Setup

* install virtualenv: `sudo pip install virtualenv`
* create virtual envronment: `virtualenv -p python3 .venv`
* load virtualenvironment: `source .venv/bin/activate`
* install dependencies: `pip install -r requirements.txt`
    * if there is a problem installing pyaudio install it with: `pip install --global-option='build_ext' --global-option='-I/usr/local/include' --global-option='-L/usr/local/lib' pyaudio`
* write alias in your ~/.bashrc file by adding line: `alias interpart-speak='~/<Path>/interpart/modules/speak/.venv/bin/python ~/<Path>/interpart/modules/speak/speak.py'`

## Run Script

* load virtualenvironment: `source .venv/bin/activate`
* run script with `python run.py`

## Usage

* run `interpart-speak --help` to see ussage information
* adjust output volume with: `amixer set 'Master' 30%` or `pactl -- set-sink-volume 0 30%`