#!/usr/bin/env node

/*
 * @Author: Lutz Reiter - http://lu-re.de 
 * @Date: 2019-04-26 17:37:11 
 * @Last Modified by: Lutz Reiter - http://lu-re.de
 * @Last Modified time: 2019-04-26 18:53:02
 */

const _ = require('lodash')
const textToSpeech = require('@google-cloud/text-to-speech');
const Speaker = require('speaker');
const stream = require('stream');
const commandLineArgs = require('command-line-args')
const commandLineUsage = require('command-line-usage')

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

run(options)

async function run(options) {
    const client = new textToSpeech.TextToSpeechClient();

    let text = options.text
    let language = options.lang

    const request = {
        input: {text: text},
        // Select the language and SSML Voice Gender (optional)
        voice: {languageCode: language, ssmlGender: 'NEUTRAL'},
        // Select the type of audio encoding
        audioConfig: {
            audioEncoding: 'LINEAR16',
            sampleRateHertz : 44100
        },
    };

    const [response] = await client.synthesizeSpeech(request);
    playAudioFromBuffer(response.audioContent)
}

function playAudioFromBuffer(fileContents) {
    let speaker = new Speaker({
        channels: 1, 
        bitDepth: 16,     
        sampleRate: 44100,
        signed: true
    });

    let bufferStream = new stream.PassThrough();
    bufferStream.end(fileContents);
    bufferStream.pipe(speaker);
}



