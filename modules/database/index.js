/*
 * @Author: Lutz Reiter - http://lu-re.de 
 * @Date: 2019-03-29 19:20:39 
 * @Last Modified by: Lutz Reiter - http://lu-re.de
 * @Last Modified time: 2019-05-22 23:17:35
 */

 const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const express = require('express')
const bodyParser = require('body-parser')

const { SubmissionModel } = require('./models/SubmissionModel') 
const { QuestionModel } = require('./models/QuestionModel') 
const _ = require('lodash')
const config = require('./config')

function getDatabase() {
    const adapter = new FileSync(config.databaseFile)
    const db = low(adapter)
    
    // set defaults
    db.defaults({ submissions: [] }).write()
    return db
}

function setupRoutes(app) {
    app.use(bodyParser.json())

    app.get('/submissions/list', (req, res) => {
        const db = getDatabase()

        let data = db.get('submissions').value()

        let submissions = _.map(data, (entry) => new SubmissionModel(entry))

        if (_.has(req.query,'lang')) {
            let translations = _.map(submissions, (entry) => {
                return entry.getLanguage(req.query.lang)
            })

            res.send({ data: _._.compact(translations) })
        } else
            res.send({ data: _.map(submissions, (s) => s.data) })
    })

    app.post('/submissions/add', async (req, res) => {
        const db = getDatabase()
        try {

            if (!SubmissionModel.validate(req.body))
                throw "Validation failed"
            
            var submission = new SubmissionModel(req.body)
            await submission.translate();

            db.get('submissions').push(submission.data).write()

            res.send({ data: submission.data})
        } catch (err) {
            console.log(err)
            res.status(400).send({error: err})
        } 
    })

    app.post('/questions/translate', async (req, res) => {
        try {

            if (!QuestionModel.validate(req.body))
                throw "Validation failed"

            var question = new QuestionModel(req.body)
            await question.translate()

            res.send({ data: question.data})
        } catch (err) {
            console.log(err)
            res.status(400).send({error: err})
        }
    })

    app.get('/questions/list', async (req, res) => {
        try {
            var questions = _.map(require('./data/questions.json'), (data) => {
                let question = new QuestionModel(data)
                return question
            })

            if (_.has(req.query,'lang')) {
                let translations = _.map(questions, (questions) => {
                    return questions.getLanguage(req.query.lang)
                })
                res.send({ data: _.compact(translations) })
            } else
                res.send({ data: _.map(questions, (q) => q.data) })
        } catch (err) {
            console.log(err)
            res.status(400).send({error: err})
        }
    })

    app.get('/questions/get/:id', async (req, res) => {
        try {
            var questions = _.map(require('./data/questions.json'), (data) => {
                let question = new QuestionModel(data)
                return question
            })

            questions = _.filter(questions, (question) => {
                return question.data.id == req.params.id;
            });
            
            res.send({ data: _.isEmpty(questions) ? {} : questions[0].data })
        } catch (err) {
            console.log(err)
            res.status(400).send({error: err})
        }
    })

    app.get('/questions/name', async (req, res) => {
        try {
            var questions = _.map(require('./data/questions-name.json'), (data) => {
                let question = new QuestionModel(data)
                return question
            })

            if (_.has(req.query,'lang')) {
                let translations = _.map(questions, (questions) => {
                    return questions.getLanguage(req.query.lang)
                })
                res.send({ data: _.compact(translations) })
            } else
                res.send({ data: _.map(questions, (q) => q.data) })
        } catch (err) {
            console.log(err)
            res.status(400).send({error: err})
        }
    })

    app.get('/questions/goodbye', async (req, res) => {
        try {
            var questions = _.map(require('./data/goodbye.json'), (data) => {
                let question = new QuestionModel(data)
                return question
            })

            if (_.has(req.query,'lang')) {
                let translations = _.map(questions, (questions) => {
                    return questions.getLanguage(req.query.lang)
                })
                res.send({ data: _.compact(translations) })
            } else
                res.send({ data: _.map(questions, (q) => q.data) })
        } catch (err) {
            console.log(err)
            res.status(400).send({error: err})
        }
    })

    app.use('/assets/',express.static('assets'))
}

const app = express()
setupRoutes(app)

//start server
app.listen(config.port, () => console.log(`Interpart Server listening on port ${config.port}!`))
