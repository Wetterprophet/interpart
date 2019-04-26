# Interop Translator

Translates a string into multiple different languages using the google translate api

## Setup

* run `npm install`
* run `cp config.default.js config.js` to init config
* run `npm link` to link script as a command line tool

### Setup Google API

* go to [https://cloud.google.com/translate/docs/quickstart-client-libraries] and setup a translate project
* download json file of project and set your $GOOGLE_APPLICATION_CREDENTIALS to its path: osx: `export GOOGLE_APPLICATION_CREDENTIALS="[PATH]"`
* change googleApiProjectId in config.js to the projectId

## Usage

* run `interpart-translate --help` to see ussage information

## Todo

* fragen in auch in db.json speichern
