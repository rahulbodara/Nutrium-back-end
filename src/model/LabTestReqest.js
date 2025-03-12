const mongoose = require("mongoose");

const labTestRequestSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            required: true,
        },
        clientId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Clients",
            required: true,
        },
        requestDate: {
            type: Date,
            required: true,
        },
        description: {
            type: String,
        },
        labTests: [
            {
                id: Number,
                name: String,
            },
        ],
        otherLabTests: {
            type: String,
        },
        status: {
            type: String,
            enum: ["Pending", "Completed", "Cancelled"],
            default: "Pending",
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("LabTestRequest", labTestRequestSchema);
