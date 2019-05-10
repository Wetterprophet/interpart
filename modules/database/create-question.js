#!/usr/bin/env node

const commandLineArgs = require('command-line-args')
const commandLineUsage = require('command-line-usage')
const _ = require("lodash")

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
        type: String, 
        defaultValue: "de",
        typeLabel: 'string',
        description: 'Language of the question'
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
              './create_question.js "Hello World" --language en',
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

    if (!QuestionModel.validate(data))
        throw "Validation failed"

    var question = new QuestionModel(data)
    await question.translate()

    output(question.data)
}

function output(json) {
    console.log(JSON.stringify(json, null, 4))
} 
