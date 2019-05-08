# Interpart Database

Holds question ands submission, provides translation service.

## Requirements

* requires interpart-translate to be installed (see modules/translator)

## Setup

* run `npm install`

## Start Server

* run `npm start` or run `npm run watch` for auto reload development mode

## Add new questions

* run `./create-question.js "Wie geht es dir" --language de`
* copy output and add it to the file *data/questions.json*:
    ```
    [
        {
            "id": "bde4d640-5182-11e9-8950-d77e99bee325",
            "text": "Hallo was ist dein Name",
            "language": "de",
            "translations": [
                {
                    "text": "Hello, what is your name",
                    "language": "en"
                },
                ...
            ]
        },
        ...
    ]
    ```

## Routes

* GET /submissions/list?\[lang=x\]
* POST /submission/add
* GET /questions/list?\[lang=x\]
* POST /questions/translate

## Delete Submissions

to remove all previous submissions, just delete the database file with `rm data/db.json`