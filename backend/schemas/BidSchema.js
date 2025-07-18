const mongoose = require("mongoose");

const BidSchema = mongoose.Schema({
    amount: {
        type: Number,
        required: [true, "Your bid amount  is required"],
    },
    message: {
        type: String,
        required: [true, "Your bid message  is required"],
    },
    freelancer: {
        type: mongoose.Types.ObjectId,
        ref: "user"
    },
    status: {
        type: String,
        enum: ["won", "lost", "pending"],
        default: "pending"
    },
    project: {
        type: mongoose.Types.ObjectId,
        ref: "project"
    }
})


module.exports = { BidSchema };