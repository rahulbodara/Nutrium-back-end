const mongoose = require("mongoose");

const lookupSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
});

lookupSchema.index({ timestamp: 1 }, { expireAfterSeconds: 1296000 }); // 15 days in seconds

const Lookup = mongoose.model("Lookup", lookupSchema);
module.exports = Lookup;