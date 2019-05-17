#!/usr/bin/env node

const pug = require('pug');
const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');
const _ = require('lodash')
const commandLineArgs = require('command-line-args')
const commandLineUsage = require('command-line-usage')


const optionDefinitions = [
    { 
        name: 'submission', 
        type: String, 
        defaultOption: "{}",
        typeLabel: 'string',
        description: 'Submission to generate pdf from (JSON Object)'
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

    const submissionTemplate = {
        id : "1",
        createdAt : "xx.xx.xxxx",
        author : "unnamed",
        question : "no question",
        text: "no text",
        language: "de",
        translations: [
            { text: "no translation", language: "en" }
        ]
    }

    const submission = _.extend(submissionTemplate, options.submission);

    const outputPathHtml = path.resolve(__dirname, 'output', submission.id + '.html');
    const outputPathPdf = path.resolve(__dirname, 'output', submission.id + '.pdf');

    const compiledTemplate = pug.compileFile('templates/template.pug');

    const html = compiledTemplate({ submission : submission })

    fs.writeFileSync(outputPathHtml, html);

    exec(`weasyprint ${outputPathHtml} ${outputPathPdf}`) 

    // const pdfOptions = {
    //     htmlTemplatePath: path.resolve(__dirname, 'templates/template.pug'),
    //     styleOptions: {
    //         file: path.resolve(__dirname, 'templates/template.scss')
    //     },
    //     htmlTemplateOptions: {
    //         submission: submission
    //     },
    //     pdfOptions: {
    //         // Omit to get output as buffer solely
    //         path: outputPath,
    //         format: 'A5',
    //         printBackground: true
    //     }
    // }

    // const pdfBuffer = await generatePdf(pdfOptions);
    
    //output filename
    console.log(outputPathPdf)
};