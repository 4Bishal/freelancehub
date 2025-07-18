const mongoose = require("mongoose");

const PostProjectSchema = mongoose.Schema({
    title: {
        type: String,
        required: [true, "Your post title is required"],
    },
    description: {
        type: String,
        required: [true, "Your post description is required"],
    },
    budget: {
        type: Number,
        required: [true, "Your post Budget is required"],
    },
    category: {
        type: String,
        required: [true, "Your post category is required"],
    },
    deadline: {
        type: Date,
        required: [true, "Your Post Deadline is required"],
    },
    postedby: {
        type: mongoose.Types.ObjectId,
        ref: "user"
    },
    bids: [{
        type: mongoose.Types.ObjectId,
        ref: "bid"
    }]
})



module.exports = { PostProjectSchema };