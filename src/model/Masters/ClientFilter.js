const mongoose = require('mongoose')

const ClientFilterSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    value: {
        type: String,
        required: true,
        unique: true,
    }
})

const ClientFilter = mongoose.model('ClientFilter ', ClientFilterSchema);
module.exports = ClientFilter;