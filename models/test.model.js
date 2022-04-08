const mongoose = require('mongoose')
const Schema = mongoose.Schema

const testSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    }
}, { timestamps: true })

const Test = mongoose.model('Test', testSchema)

module.exports = mongoose.model('Test', testSchema)