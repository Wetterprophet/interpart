# Interpart Translator & Speak CLI Tools

*interpart-translate* translates a string into multiple different languages using the google translate api.
*interpart-speak* uses googles text to speech api to speak a sentence

## Setup

* run `npm install`
* run `cp config.default.js config.js` to init config
* run `npm link` to link script as a command line tool

### Setup Google API

* go to [https://cloud.google.com/translate/docs/quickstart-client-libraries] and setup a translate project
* enable *Cloud Text-to-Speech API* and *Cloud Translation API* for your project
* download json file of project and set your $GOOGLE_APPLICATION_CREDENTIALS to its path: osx: `export GOOGLE_APPLICATION_CREDENTIALS="[PATH]"`
* change googleApiProjectId in config.js to the projectId

## Usage

* run `interpart-translate --help` to see ussage information
* run `interpart-speak --help` to see ussage information
