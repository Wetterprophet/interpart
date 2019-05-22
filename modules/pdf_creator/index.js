#!/usr/bin/env node

const pug = require('pug');
const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');
const _ = require('lodash')
const commandLineArgs = require('command-line-args')
const commandLineUsage = require('command-line-usage')
const util = require('util')

const { SubmissionModel } = require('./models/SubmissionModel') 
const { QuestionModel } = require('./models/QuestionModel') 

const asyncExec = util.promisify(exec);

const optionDefinitions = [
    { 
        name: 'submission', 
        type: String, 
        defaultOption: "{}",
        typeLabel: 'string',
        description: 'Submission to generate pdf from (JSON Object)'
    },
    { 
        name: 'question',
        type: String, 
        defaultValue: "{}",
        typeLabel: 'string',
        description: 'Questions to to generate pdf from (JSON Object)'
    },
    { 
        name: 'languages',
        type: String, 
        defaultValue: "de,en",
        typeLabel: 'string',
        description: 'Languages to generate in pdf, comma seperated'
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

    if (!_.has(options,'submission'))
        throw new Error('No submission object')

    // split comma seperate language array
    options.languages = options.languages.split(',')

} catch (err) {
    const usage = commandLineUsage([
        {
            header: 'Interpart Pdf Generator',
            content: 'Generates Pdf from submission data'
        },
        {
            header: 'Options',
            optionList: optionDefinitions
        },
        {
            header: 'Example',
            content: [
              'interpart-pdf --submission "<json_data>" --languages "de,en"',
            ]
        }
    ])
    console.log(usage)
    process.exit()
}

// if everything is ok run translator

run(options).catch( (err) => {
    console.log(err);
})

async function run(options) {

    options.submission = JSON.parse(options.submission); 
    options.question = JSON.parse(options.question);

    const submission = new SubmissionModel(options.submission);
    const question = new QuestionModel(options.question);

    // create translations array
    const translations = _.map( _.without(options.languages, submission.data.language), (language) => {
        return { submission: submission.getLanguage(language) , question: question.getLanguage(language) }
    });

    //filter out not defined translations
    const filtered_translations = _.filter(translations, (entry) => {
        return _.has(entry.submission,"text") /*&& _.has(entry.question,"text")*/
    })

    //add questions

    const outputPathHtml = path.resolve(__dirname, 'output', submission.data.id + '.html');
    const outputPathPdf = path.resolve(__dirname, 'output', submission.data.id + '.pdf');
    const templatePath = path.resolve(__dirname, 'templates', 'template.pug');

    const compiledTemplate = pug.compileFile(templatePath);

    const html = compiledTemplate({ submission : submission.data, translations : filtered_translations })

    fs.writeFileSync(outputPathHtml, html);

    //convert pdf
    await asyncExec(`weasyprint ${outputPathHtml} ${outputPathPdf}`) 
    
    //output filename
    console.log(outputPathPdf)
};