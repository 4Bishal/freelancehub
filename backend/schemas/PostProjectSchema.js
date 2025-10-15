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

// Pre-delete hook: delete all bids associated with this project
PostProjectSchema.pre('findOneAndDelete', async function (next) {
    const project = await this.model.findOne(this.getFilter());
    if (project) {
        // Delete all bids for this project
        await mongoose.model('bid').deleteMany({ project: project._id });
    }
    next();
});


module.exports = { PostProjectSchema };