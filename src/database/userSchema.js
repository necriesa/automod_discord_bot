const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    id: {
        type: String,
        required: true
    },
    infractionCount: {
        type: Number,
        default: 0
    },
    lastInfraction: {
        type: Date
    }
});

module.exports = mongoose.model('User', userSchema);