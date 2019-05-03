# Interpart Database

Holds question ands submission, provides translation service.

## Requirements

* requires interpart-translate to be installed (see modules/translator)

## Setup

* run `npm install`

## Start Server

* run `npm start` or run `npm run watch` for auto reload development mode

## Routes

* GET /submissions/list?\[lang=x\]
* POST /submission/add
* GET /questions/list?\[lang=x\]
* POST /questions/translate

## Delete Submissions

to remove all previous submissions, just delete the database file with `rm data/db.json`