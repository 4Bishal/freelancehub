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
// Pre-delete hook: remove bid reference from its project
BidSchema.pre('findOneAndDelete', async function (next) {
    const bid = await this.model.findOne(this.getFilter());
    if (bid) {
        await mongoose.model('project').findByIdAndUpdate(
            bid.project,
            { $pull: { bids: bid._id } }
        );
    }
    next();
});
module.exports = { BidSchema };