const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
    company: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    carbonTotal: {
        type: Number,
        required: true,
        default: 0
    },
    carbonOffset: {
        type: Number,
        required: true,
        default: 0
    }
}, { timestamps: true })

const User = mongoose.model('User', userSchema)

module.exports = User