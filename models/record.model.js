const mongoose = require('mongoose')
const Schema = mongoose.Schema

const recordSchema = new Schema({
    userId: {
        type: String,
        required: true
    },
    recordName: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    method: {
        type: String,
        required: true
    },
    specific: {
        type: String,
        required: true
    },
    distance: {
        type: Number,
        required: true
    },
    carbon: {
        type: Number,
        required: true
    }
})

const Record = mongoose.model('Record', recordSchema)

module.exports = mongoose.model('Record', recordSchema)