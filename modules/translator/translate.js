#!/usr/bin/env node

const _ = require('lodash')
const { Translate, TranslateRequest } = require('@google-cloud/translate');
const commandLineArgs = require('command-line-args')
const commandLineUsage = require('command-line-usage')

const config = require('./config')

const optionDefinitions = [
    { 
        name: 'text', 
        type: String, 
        defaultOption: true,
        typeLabel: 'string',
        description: 'Text to translate'
    },
    { 
        name: 'from',
        type: String, 
        defaultValue: "de",
        typeLabel: 'string',
        description: 'Language to translate from'
    },
    {
        name: 'to',
        type: String, 
        defaultValue: "de,en,es,it,ar",
        typeLabel: 'string',
        description: 'Languages to translate to (comma seperated)'
    }
]


var options = {}

try {
    options = commandLineArgs(optionDefinitions)

    if (!_.has(options,'text'))
        throw new Error("No Text supplied")

    // split comma seperate language array
    options.to = options.to.split(',')

    //remove original language from array
    options.to = _.without(options.to, options.from)

} catch (err) {
    console.log(err);
    const usage = commandLineUsage([
        {
            header: 'Interop Translator',
            content: 'Translates text in multiple other languages and generates json object'
        },
        {
            header: 'Options',
            optionList: optionDefinitions
        }
    ])
    console.log(usage)
    process.exit()
}


run(options)

async function run(options) {

    const translate = new Translate({ projectId : config.googleApiProjectId });

    const requests = _.map(options.to, (language) => {
        return new Promise(function(resolve, reject) {
            translate.translate(options.text, { from : options.from, to: language })
                .then( (result) => resolve({ translation: result[0], language: language }))
                .catch( (err) => reject(err))
        })
    })

    Promise.all(requests).then( (results) => {
        console.log(results)
    }).catch( (err) => {
        console.log(err)
    })
}



