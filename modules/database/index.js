const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const express = require('express')

const config = require('./config')

function getDatabase() {
    const adapter = new FileSync(config.databaseFile)
    return low(adapter)
}

function setupRoutes(app) {
    app.get('/submissions/', (req, res) => {
        const db = getDatabase()
        const submissions = db.get('submissions')
        res.send(submissions)
    })
}

const app = express()
setupRoutes(app)

//start server
app.listen(config.port, () => console.log(`Example app listening on port ${config.port}!`))
