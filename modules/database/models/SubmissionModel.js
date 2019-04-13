/*
 * @Author: Lutz Reiter - http://lu-re.de 
 * @Date: 2019-03-29 19:20:29 
 * @Last Modified by: Lutz Reiter - http://lu-re.de
 * @Last Modified time: 2019-04-13 18:21:57
 */

const _ = require('lodash')
const uuidv1 = require('uuid/v1')

const { translate } = require('../utils')
const config = require('../config')

class SubmissionModel {
    
    constructor(data) {

        this.data = _.extend({
            id : uuidv1(),
            question: null,
            text : "",
            language : "de",
            author: null,
            translations : []
        }, data)
    }

    async translate() {
        this.data.translations = await translate(this.data.text, this.data.language, config.languages)
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


module.exports = { SubmissionModel }