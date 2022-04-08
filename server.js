// imports and vars
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
require("dotenv").config()

const app = express()
const port = 4000


// middleware
app.use(cors())
app.use(express.json())


// database config
const uri = 'mongodb+srv://dillontownsend:hackathon22@cluster0.jnljr.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
mongoose.connect(uri)
    .then(() => {
        app.listen(port, () => {
            console.log(`server running on port ${port}`)
            console.log('database connection established')
        })
    })
    .catch(() => console.log('error occured when starting the server'))


// routes
const testsRouter = require('./routes/tests')
app.use('/tests', testsRouter)

