const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const express = require('express')
const bodyParser = require('body-parser')

const { SubmissionModel } = require('./models/SubmissionModel') 
const { QuestionModel } = require('./models/QuestionModel') 
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

    app.post('/submissions/add', (req, res) => {
        const db = getDatabase()
        var submission = new SubmissionModel(req.body)
        console.log(submission.data)

        try {
            if (!submission.validate())
                throw Error("Could not validate submission")

            db.get('submissions').push(submission.data).write()

            res.send({ message: "Added submission to database"})
        } catch (err) {
            console.log(err)
            res.status(400).send({error: err})
        } 
    })

    app.get('/questions/list', (req, res) => {

        var question = new QuestionModel({
            text : "Test Frage",
        })

        res.send([question.data])
    })
}

const app = express()
setupRoutes(app)

//start server
app.listen(config.port, () => console.log(`Example app listening on port ${config.port}!`))
