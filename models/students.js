const mongoose = require('mongoose');

const studentSchema = mongoose.Schema({
    name : {
        type: String,
        required: true,
    },
    insta : {
        type: String,
        required: true,
        unique: true,
    },
    age : {
        type: Number,
        required: true,
    },
    year : {
        type: Number,
        required: true,
    },
    gender : {
        type: String,
        required: true,
    },
    response : {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
});

module.exports = mongoose.model('Student', studentSchema);