const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { UserModel } = require("./models/UserModel");
const { ProjectModel } = require("./models/ProjectModel");
const { BidModel } = require("./models/BidModel");
const { createSecretToken } = require("./util/SecretToken");

dotenv.config();
const app = express();
const PORT = process.env.PORT || 8000;

// ✅ CORS configuration
const allowedOrigins = [
    "https://freelancehub-ytg5.onrender.com",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
];

app.use(
    cors({
        origin: function (origin, callback) {
            if (!origin) return callback(null, true);
            if (allowedOrigins.includes(origin)) return callback(null, true);
            return callback(new Error("Not allowed by CORS"));
        },
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        credentials: true,
    })
);

app.use(express.json());
app.use(cookieParser());

// ✅ Token verification helper
const verifyToken = (req, res) => {
    const token = req.cookies.token;
    if (!token) return null;

    try {
        const decoded = jwt.verify(token, process.env.TOKEN_KEY);
        return decoded.id;
    } catch {
        return null;
    }
};

// ✅ Signup
app.post("/signup", async (req, res) => {
    try {
        const { email, password, username, role, createdAt } = req.body;

        if (!email || !password || !username || !role)
            return res.status(400).json({ message: "All fields required" });

        const existingUser = await UserModel.findOne({ email });
        if (existingUser)
            return res.status(400).json({ message: "User already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await UserModel.create({
            email,
            password: hashedPassword,
            username,
            role,
            createdAt,
        });

        const token = createSecretToken(user._id);
        res.cookie("token", token, { httpOnly: true, sameSite: "None", secure: true });
        res.status(201).json({ message: "Signup successful", success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

// ✅ Login
app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password)
            return res.status(400).json({ message: "All fields required" });

        const user = await UserModel.findOne({ email });
        if (!user)
            return res.status(401).json({ message: "Incorrect email or password" });

        const auth = await bcrypt.compare(password, user.password);
        if (!auth)
            return res.status(401).json({ message: "Incorrect email or password" });

        const token = createSecretToken(user._id);
        res.cookie("token", token, { httpOnly: true, sameSite: "None", secure: true });
        res.status(200).json({ message: "Login successful", success: true, role: user.role });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

// ✅ Auth check
app.post("/auth", async (req, res) => {
    const userId = verifyToken(req, res);
    if (!userId) return res.json({ status: false });

    const user = await UserModel.findById(userId).select("-password");
    if (!user) return res.json({ status: false });

    res.json({ status: true, user: user.username, role: user.role });
});

// ✅ Logout
app.post("/logout", (req, res) => {
    res.clearCookie("token", { path: "/", sameSite: "None", secure: true });
    res.json({ status: true, message: "Logged out" });
});

// ✅ Create project
app.post("/createproject", async (req, res) => {
    try {
        const userId = verifyToken(req, res);
        if (!userId) return res.status(401).json({ message: "No token" });

        const { title, description, budget, deadline, category } = req.body;
        if (!title || !description || !budget || !deadline || !category)
            return res.status(400).json({ message: "All fields required" });

        const newProject = await ProjectModel.create({
            title,
            description,
            budget,
            deadline,
            category,
            postedby: userId,
        });

        res.status(201).json({ message: "Project created", success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error creating project" });
    }
});

// ✅ Browse projects
app.get("/browseprojects", async (req, res) => {
    try {
        const projects = await ProjectModel.find({}).populate("postedby", "-password");
        res.json(projects);
    } catch {
        res.status(500).json({ message: "Something went wrong" });
    }
});

// ✅ Get one project
app.get("/getproject/:id", async (req, res) => {
    try {
        const project = await ProjectModel.findById(req.params.id).populate("postedby", "-password");
        if (!project) return res.status(404).json({ message: "Not found" });
        res.json(project);
    } catch {
        res.status(500).json({ message: "Error" });
    }
});

// ✅ MongoDB + server start
app.listen(PORT, async () => {
    console.log(`🚀 Server running on port ${PORT}`);
    try {
        await mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("✅ MongoDB connected");
    } catch (err) {
        console.error("❌ MongoDB connection failed:", err);
    }
});
