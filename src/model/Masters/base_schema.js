const mongoose = require('mongoose');


const base_schema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    value: { type: String, required: true, unique: true }
});

module.exports = base_schema;
