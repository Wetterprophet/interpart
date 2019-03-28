const _ = require('lodash')
const uuidv1 = require('uuid/v1')

const { translate } = require('../utils')

class SubmissionModel {
    
    constructor(data) {

        this.data = _.extend({
            id : uuidv1(),
            question: null,
            text : "",
            language : "de",
            translations : []
        }, data)
    }

    async translate() {
        this.data.translations = await translate(this.data.text, this.data.language)
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