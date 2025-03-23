const mongoose = require('mongoose');

const strikeSchema = new mongoose.Schema({
    type: {
        type: String, 
        required: true
    }, 
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    count: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model('Strike', strikeSchema);