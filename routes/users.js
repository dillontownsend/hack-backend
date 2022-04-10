const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const verifyJWT = require('../middleware/verify')
const User = require('../models/user.model')


// method   POST /users/register
// desc     create a new user
// access   public
router.post('/register', (req, res) => {
    const { company, email, password } = req.body

    User.findOne({ email })
        .then(user => {
            if (user === null) {
                bcrypt.hash(password, 10, (err, hash) => {
                    const password = hash
                    const newUser = new User({
                        company,
                        email,
                        password
                    })
                    newUser.save()
                        .then(user => {
                            const token = jwt.sign(
                                { id: user.id },
                                'secret key :)',
                                { expiresIn: 3600 * 24 }
                            )
                            res.json({
                                token: token,
                            })
                        })
                        .catch(err => res.status(400).json(err))
                })     
            } else {
                res.status(400).json({ userExists: true })
            }
        })
        .catch(err => res.status(400).json(err))
}) 


// method   POST /users/login
// desc     user login
// access   public
router.post('/login', (req, res) => {
    const { email, password } = req.body

    User.findOne({ email })
        .then(user => {
            if (user !== null) {
                bcrypt.compare(password, user.password, (err, response) => {
                    if (response === true) {
                        const token = jwt.sign(
                            { id: user.id },
                            'secret key :)',
                            { expiresIn: 3600 * 24 }
                        )
                        res.json({
                            token: token,
                        })
                    } else {
                        res.status(400).json({ invalidCredentials: true })
                    }
                })
                
            } else {
                res.status(400).json({ userNotExist: true })
            }
        })
        .catch(err => res.status(400).json(err))
})

// method   PUT /users/donated
// desc     update the balances after a user has donated
// access   private
router.put('/donated', verifyJWT, (req, res) => {
    const { userId } = req

    User.findById(userId)
        .then(user => {
            currUnpaid = user.carbonTotal

            user.carbonTotal = 0
            user.carbonOffset += currUnpaid
            user.save()
                .then(user => res.status(200).json({ success: true }))
                .catch(err => console.log(err))
        })
        .catch(err => console.log(err))
})


module.exports = router