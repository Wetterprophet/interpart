#!/usr/bin/env node

const commandLineArgs = require('command-line-args')
const commandLineUsage = require('command-line-usage')
const _ = require("lodash")
const fs = require('fs').promises;

const { QuestionModel } = require('./models/QuestionModel') 

const optionDefinitions = [
    { 
        name: 'question', 
        type: String, 
        defaultOption: true,
        typeLabel: 'string',
        description: 'Question to create'
    },
    { 
        name: 'lang',
        alias: "l",
        type: String, 
        defaultValue: "de",
        typeLabel: 'string',
        description: 'Language of the question'
    },

    {
        name: 'file',
        alias: 'f',
        description: 'File to write output question to'
    },
    {
        name: 'help',
        alias: 'h',
        description: 'Display these usage informations'
    }
]


var options = {}

try {
    options = commandLineArgs(optionDefinitions)

    if (_.has(options,'help'))
        throw new Error('Show usage information')

    if (!_.has(options,'question'))
        throw new Error('No Question supplied')

        if (!_.has(options,'file'))
        throw new Error('No Output file supplied')

} catch (err) {
    console.log(err)
    const usage = commandLineUsage([
        {
            header: 'Interpart Question Creator',
            content: 'Creates json object for a question'
        },
        {
            header: 'Options',
            optionList: optionDefinitions
        },
        {
            header: 'Example',
            content: [
              './create_question.js "Hello World" --lang en --file output.json',
            ]
        }
    ])
    console.log(usage)
    process.exit()
}

// if everything is ok run it
run(options)


async function run(options) {
    
    let data = {
        text : options.question,
        language : options.lang
    }

    try {
        if (!QuestionModel.validate(data))
            throw "Validation failed"

        var question = new QuestionModel(data)
        await question.translate()

        await output(question.data, options.file)
    } catch (err) {
        console.error(err);
    }
    
}

async function output(json, filename) {
    await fs.writeFile(filename, JSON.stringify([json], null, 2), 'utf8');
} 
