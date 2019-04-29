#!/usr/bin/env node

/*
 * @Author: Lutz Reiter - http://lu-re.de 
 * @Date: 2019-04-26 17:37:11 
 * @Last Modified by: Lutz Reiter - http://lu-re.de
 * @Last Modified time: 2019-04-27 09:46:15
 */

const _ = require('lodash')
const textToSpeech = require('@google-cloud/text-to-speech');
const Speaker = require('speaker');
const stream = require('stream');
const commandLineArgs = require('command-line-args')
const commandLineUsage = require('command-line-usage')
const wav = require('wav');

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
        defaultValue: "en",
        typeLabel: 'string',
        description: 'Language of speaker'
    },
    {
        name: 'gender',
        type: String, 
        defaultValue: "NEUTRAL",
        typeLabel: 'string',
        description: 'ssml Gender of speaker: NEUTRAL, MALE, FEMALE'
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
            content: 'Requests voice sample from google text to speech api and plays it back.'
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

    const request = {
        input: {ssml: "<speak>" + options.text + "</speak>"},
        // Select the language and SSML Voice Gender (optional)
        voice: {languageCode: options.lang, ssmlGender: options.ssmlGender},
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
    // plays back pcm audio
    let speaker = new Speaker({
        channels: 1, 
        bitDepth: 16,     
        sampleRate: 44100,
        signed: true
    });
    // strips wav header from buffer
    var reader = new wav.Reader();

    let audioStream = new stream.PassThrough();
    audioStream.end(fileContents);

    audioStream.pipe(reader).pipe(speaker);
}



