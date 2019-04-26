/*
 * @Author: Lutz Reiter - http://lu-re.de 
 * @Date: 2019-04-26 17:37:11 
 * @Last Modified by: Lutz Reiter - http://lu-re.de
 * @Last Modified time: 2019-04-26 17:40:33
 */

const _ = require('lodash')
const textToSpeech = require('@google-cloud/text-to-speech');
const commandLineArgs = require('command-line-args')
const commandLineUsage = require('command-line-usage')

const config = require('./config')

const optionDefinitions = [
    { 
        name: 'text', 
        type: String, 
        defaultOption: true,
        typeLabel: 'string',
        description: 'Text to speak'
    },
    { 
        name: 'lang',
        type: String, 
        defaultValue: "de",
        typeLabel: 'string',
        description: 'Language of speaker'
    }
]


var options = {}

try {
    options = commandLineArgs(optionDefinitions)

    if (_.has(options,'help'))
        throw new Error('Show usage information')

    if (!_.has(options,'text'))
        throw new Error('No Text supplied')

} catch (err) {
    const usage = commandLineUsage([
        {
            header: 'Interpart Speak',
            content: 'Speaks out text'
        },
        {
            header: 'Options',
            optionList: optionDefinitions
        },
        {
            header: 'Example',
            content: [
              'interpart-speak "Hello World" --lang en',
            ]
        }
    ])
    console.log(usage)
    process.exit()
}

// if everything is ok run translator
run(options)

async function run(options) {
    const translate = new Translate({ projectId : config.googleApiProjectId });

    // modifiy text to exclude translation of text inside {}
    let text = options.text
    text = text.replace('{','<span class="notranslate">')
    text = text.replace('}','</span>')

    const requests = _.map(options.to, (language) => {
        return new Promise(function(resolve, reject) {
            translate.translate(text, { from : options.from, to: language })
                .then( (result) => {
                    let text = result[0]

                    // revert resulting string
                    text = text.replace('<span class="notranslate">','{')
                    text = text.replace('</span>','}')
                    resolve({ text: text, language: language })
                })
                .catch( (err) => reject(err))
        })
    })

    Promise.all(requests).then( (results) => {
        output({ original: { text: options.text ,language: options.from }, translations: results })
    }).catch( (err) => {
        output({ errors: err.errors })
    })
}

function output(json) {
    console.log(JSON.stringify(json))
} 



