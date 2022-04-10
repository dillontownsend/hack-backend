const express = require('express')
const router = express.Router()
const fetch = require('node-fetch')

const verifyJWT = require('../middleware/verify')
const Record = require('../models/record.model')
const User = require('../models/user.model')

// method   POST /records/flight/create
// desc     create a new flight record
// access   private
router.post('/flight/create', verifyJWT, async (req, res) => {
    const { userId } = req
    const { recordName, date, flightType, distance } = req.body
    const method = 'Flight'
    var apiVar = ''

    if (flightType === 'Domestic') {
        apiVar = 'DomesticFlight'
    } else if (flightType === 'Economy') {
        apiVar = 'LongEconomyClassFlight'
    } else if (flightType === 'First Class') {
        apiVar = 'LongFirstClassFlight'
    }

    const response = await fetch('https://app.trycarbonapi.com/api/flight', {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${process.env.CARBON_KEY}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            distance: distance,
            type: apiVar,
        }),
    })
    const data = await response.json()
    carbon = parseFloat(data.carbon.split(' ')[0])

    const newRecord = new Record({
        userId,
        recordName,
        date,
        method,
        specific: flightType,
        distance,
        carbon,
    })
    newRecord
        .save()
        .then(() => {
            User.findById(userId)
                .then((user) => {
                    user.carbonTotal += carbon
                    user.save()
                        .then(() => res.status(200).json({ success: true }))
                        .catch(err => {
                            console.log(err)
                            res.status(400).json({ success: false })
                        })
                })
                .catch((err) => {
                    console.log(err)
                    res.status(400).json({ success: false })
                })
        })
        .catch((err) => {
            console.log(err)
            res.status(400).json({ success: false })
        })
})

// method   POST /records/vehicle/create
// desc     create a new vehicle record
// access   private
router.post('/vehicle/create', verifyJWT, async (req, res) => {
    const { userId } = req
    const { recordName, date, vehicleType, distance } = req.body
    const method = 'Vehicle'
    var apiVar = ''

    if (vehicleType === 'Diesel Truck') {
        apiVar = 'LargeDieselCar'
    } else if (vehicleType === 'Petrol Car') {
        apiVar = 'MediumPetrolCar'
    } else if (vehicleType === 'Hybrid Car') {
        apiVar = 'MediumHybridCar'
    }

    const response = await fetch('https://app.trycarbonapi.com/api/carTravel', {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${process.env.CARBON_KEY}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            distance: distance,
            vehicle: apiVar,
        }),
    })
    const data = await response.json()
    carbon = parseFloat(data.carbon.split(' ')[0])

    const newRecord = new Record({
        userId,
        recordName,
        date,
        method,
        specific: vehicleType,
        distance,
        carbon,
    })
    newRecord
        .save()
        .then(() => {
            User.findById(userId)
                .then((user) => {
                    user.carbonTotal += carbon
                    user.save()
                        .then(() => res.status(200).json({ success: true }))
                        .catch(err => {
                            console.log(err)
                            res.status(400).json({ success: false })
                        })
                })
                .catch((err) => {
                    console.log(err)
                    res.status(400).json({ success: false })
                })
        })
        .catch((err) => {
            console.log(err)
            res.status(400).json({ success: false })
        })
})

// method   GET /records
// desc     create all of your records
// access   private
router.get('/', verifyJWT, (req, res) => {
    const { userId } = req
    User.findById(userId)
        .then(user => {
            Record.find({ userId })
                .then(records => {
                    res.status(200).json({
                        company: user.company,
                        carbonTotal: user.carbonTotal,
                        carbonOffset: user.carbonOffset,
                        records: records
                    })
                })
                .catch(err => console.log(err))
        })
        .catch(err => console.log(err))
})

module.exports = router
