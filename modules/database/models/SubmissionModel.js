const _ = require('lodash')
const uuidv1 = require('uuid/v1')

const { translate } = require('../utils')

class SubmissionModel {
    
    constructor(text, language, question = null) {

        this.data = {
            id : uuidv1(),
            question: question,
            original: {
                text : text,
                language : language
            },
            translations : []
        }
    }

    async translate() {
        this.data.translations = await translate(this.data.original.text, this.data.original.language)
    }

    static validate(data) {
        if (!_.has(data,'text'))
            return false
        if (!_.has(data,'language'))
            return false
        return true
    }
}


module.exports = { SubmissionModel }