const express = require('express')
const router = express.Router()

const Test = require('../models/test.model')

// method   POST /tests/create
// desc     create new test record in database
router.get('/', (req, res) => {
    Test.find()
        .then(tests => {
            res.status(200).json(tests)
            console.log('this is logging the test task')
        })
        .catch(err => {
            res.status(400).json(err)
        })
})

// method   POST /tests/create
// desc     create new test record in database
router.post('/create', (req, res) => {
    const { name, email } = req.body

    const newTest = new Test({
        name: name,
        email: email
    })
    newTest.save()
        .then(test => {
            res.status(200).json(test)
        })
        .catch(err => {
            res.status(400).json(err)
        })
})


module.exports = router