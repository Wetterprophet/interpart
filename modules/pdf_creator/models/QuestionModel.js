/*
 * @Author: Lutz Reiter - http://lu-re.de 
 * @Date: 2019-03-29 19:20:20 
 * @Last Modified by: Lutz Reiter - http://lu-re.de
 * @Last Modified time: 2019-05-22 22:51:16
 */

const _ = require('lodash')
const uuidv1 = require('uuid/v1');

class QuestionModel {
    
    constructor(data) {

        this.data = _.extend({
            id : uuidv1(),
            text : "",
            language : "de",
            translations : []
        }, data)
    }

    getLanguage(lang) {
        if (this.data.language == lang)
            return _.pick(this.data, ['text', 'language', 'id'])
        else {
            let translation = _.find(this.data.translations, { 'language' : lang })
            return _.isNil(translation) ? null : _.extend(translation, { id : this.data.id }) 
        }
            
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