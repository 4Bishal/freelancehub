const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "Your email address is required"],
        unique: true,
    },
    username: {
        type: String,
        required: [true, "Your username is required"],
    },
    password: {
        type: String,
        required: [true, "Your password is required"],
    },
    role: {
        type: String,
        enum: ["client", "freelancer"],
        required: [true, "Role is required"],
    },
    createdAt: {
        type: Date,
        default: new Date(),
    },
});

UserSchema.pre("remove", async function (next) {
    if (this.role === "freelancer") {
        await mongoose.model("Bid").deleteMany({ freelancer: this._id });
    } else if (this.role === "client") {
        // Delete projects posted by the client
        const projects = await mongoose.model("PostProject").find({ postedby: this._id });
        for (const project of projects) {
            await project.remove(); // triggers the above PostProject pre remove hook
        }
    }
    next();
});


module.exports = { UserSchema };