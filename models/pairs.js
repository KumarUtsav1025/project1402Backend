const mongoose = require('mongoose');

// Define schema for the pairs collection
const pairSchema = new mongoose.Schema({
    male: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Individual',
        required: true
    },
    female: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Individual',
        required: true
    }
});

// Create model for the pairs collection
const Pair = mongoose.model('Pair', pairSchema);

module.exports = Pair;
