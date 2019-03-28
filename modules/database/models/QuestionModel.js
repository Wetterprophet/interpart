const _ = require('lodash')
const uuidv1 = require('uuid/v1');

const { translate } = require('../utils')

class QuestionModel {
    
    constructor(data) {

        this.data = _.extend({
            id : uuidv1(),
            text : "",
            language : "de",
            translations : []
        }, data)
    }

    async translate() {
        this.data.translations = await translate(this.data.text, this.data.language)
    }

    getLanguage(lang) {
        if (this.data.language == lang)
            return _.pick(this.data, ['text', 'language'])
        else
            return _.find(this.data.translations, { 'language' : lang })
    }

    static validate(data) {
        if (!_.has(data,'text'))
            return false
        if (!_.has(data,'language'))
            return false
        return true
    }
}


module.exports = { QuestionModel }