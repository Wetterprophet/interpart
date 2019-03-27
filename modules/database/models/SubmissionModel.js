const _ = require('lodash')
const uuidv1 = require('uuid/v1');

class SubmissionModel {
    
    constructor(data) {

        this.data = _.extend({
            id : uuidv1(),
            question: null,
            original: {
                text : "Hello World",
                language : "en"
            },
            translations : []
        },data)
    }

    validate() {
        return true
    }
}


module.exports = { SubmissionModel }