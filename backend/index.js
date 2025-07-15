const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require('mongoose');
const { UserModel } = require('./models/UserModel');
const { createSecretToken } = require("./util/SecretToken");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken')


dotenv.config();
const app = express();


// Middlewares
app.use(
    cors({
        origin: ["http://localhost:5173"],
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true,
    })
);
app.use(express.json());

app.use(cookieParser());

app.get("/", (req, res) => {
    res.send("Hello");
})


app.post("/signup", async (req, res, next) => {
    try {
        const { email, password, username, role, createdAt } = req.body;
        console.log(req.body);
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return res.json({ message: "User already exists" });
        }
        const user = await UserModel.create({ email, password, username, role, createdAt });
        const token = createSecretToken(user._id);
        res.cookie("token", token, {
            withCredentials: true,
            httpOnly: false,
        });
        res.status(201).json({ message: "User signed in successfully", success: true, user });
        next();
    } catch (error) {
        console.error(error);
    }
});


app.post("/login", async (req, res, next) => {
    try {
        const { email, password } = req.body;
        console.log(email, password);
        if (!email || !password) {
            return res.json({ message: 'All fields are required' })
        }
        const user = await UserModel.findOne({ email });
        console.log(user);
        if (!user) {
            return res.json({ message: 'Incorrect password or email' })
        }
        const auth = await bcrypt.compare(password, user.password)
        console.log(auth);
        if (!auth) {
            return res.json({ message: 'Incorrect password or email' })
        }
        const token = createSecretToken(user._id);
        res.cookie("token", token, {
            withCredentials: true,
            httpOnly: false,
        });
        res.status(201).json({ message: "User logged in successfully", success: true, role: user.role });
        next()
    } catch (error) {
        console.error(error);
    }
});


app.post("/auth", async (req, res) => {
    const token = req.cookies.token;
    if (!token) {
        return res.json({ status: false, message: "No token found" });
    }
    jwt.verify(token, process.env.TOKEN_KEY, async (err, data) => {
        if (err) {
            return res.json({ status: false, message: "Invalid token" });
        } else {
            const user = await UserModel.findById(data.id)
            if (user) {
                return res.json({
                    status: true,
                    user: user.username,
                    role: user.role
                });
            }
            else {
                return res.json({ status: false, message: "User not found" });
            }
        }
    })
});

app.post("/logout", (req, res) => {
    // Clear cookies used for authentication (adjust cookie names if different)
    res.clearCookie("token", { path: "/" });
    res.clearCookie("role", { path: "/" });

    // Optionally clear session if using express-session

    return res.json({ status: true, message: "Logged out successfully" });
});


app.listen(5000, async () => {
    console.log("App is Listening!!");
    try {
        await mongoose.connect("mongodb://127.0.0.1:27017/freelancerhub");
        console.log("Db connected!!");

    } catch (err) {
        console.log("Db failed to connect!!");
    }
});