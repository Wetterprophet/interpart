const _ = require('lodash')
const uuidv1 = require('uuid/v1');

const { translate } = require('../utils')

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

    async translate() {
        this.data.translations = await translate(this.data.original.text, this.data.original.language)
    }
}


module.exports = { QuestionModel }