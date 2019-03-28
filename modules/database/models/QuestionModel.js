const _ = require('lodash')
const uuidv1 = require('uuid/v1');
const util = require('util');
const { exec } = require('child_process');

const { addslashes } = require('../utils')

class QuestionModel {
    
    constructor(question, language = 'de') {

        this.data = {
            id : uuidv1(),
            original: {
                text : question,
                language : language
            },
            translations : []
        }
    }

    validate() {
        return true
    }

    async translate() {
        let asyncExec = util.promisify(exec);
        let text = addslashes(this.data.original.text)
        let result = await asyncExec(`interop-translate --from ${this.data.original.language} "${text}"`)
        let output = JSON.parse(result.stdout)
        this.data.translations = output.translations
    }
}


module.exports = { QuestionModel }