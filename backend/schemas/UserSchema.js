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

// UserSchema.pre("save", async function () {
//     this.password = await bcrypt.hash(this.password, 12);
// });

module.exports = { UserSchema };