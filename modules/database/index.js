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
        const submissions = db.get('submissions')
        res.send(submissions)
    })

    app.post('/submissions/add', async (req, res) => {
        const db = getDatabase()
        try {

            if (!SubmissionModel.validate(req.body))
                throw Error("Validation failed")
            
            var submission = new SubmissionModel(req.body.text, req.body.language)
            await submission.translate();

            db.get('submissions').push(submission.data).write()

            res.send({ message: "Added submission to database"})
        } catch (err) {
            console.log(err)
            res.send({error: err})
        } 
    })

    app.get('/questions/list', async (req, res) => {

        var question = new QuestionModel('Hallo Mein Name ist {name}',"de")

        try {
            await question.translate();
            res.send([question.data])
        } catch (err) {
            res.status(400).send({error: err})
        }
    })
}

const app = express()
setupRoutes(app)

//start server
app.listen(config.port, () => console.log(`Example app listening on port ${config.port}!`))
