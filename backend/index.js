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

// CORS configuration
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
        preflightContinue: false,
    })
);

app.use(express.json());
app.use(cookieParser());

// Helper to verify token and get user ID
const verifyToken = (req, res) => {
    const token = req.cookies.token;
    if (!token) return null;

    try {
        const decoded = jwt.verify(token, process.env.TOKEN_KEY);
        return decoded.id;
    } catch (err) {
        return null;
    }
};

// Signup
app.post("/signup", async (req, res) => {
    try {
        const { email, password, username, role, createdAt } = req.body;

        if (!email || !password || !username || !role)
            return res.status(400).json({ message: "All fields are required" });

        const existingUser = await UserModel.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "User already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await UserModel.create({ email, password: hashedPassword, username, role, createdAt });
        const token = createSecretToken(user._id);

        res.cookie("token", token, { httpOnly: true, withCredentials: true });
        res.status(201).json({ message: "User signed up successfully", success: true, user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", success: false });
    }
});

// Login
app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ message: "All fields required" });

        const user = await UserModel.findOne({ email });
        if (!user) return res.status(401).json({ message: "Incorrect email or password" });

        const auth = await bcrypt.compare(password, user.password);
        if (!auth) return res.status(401).json({ message: "Incorrect email or password" });

        const token = createSecretToken(user._id);
        res.cookie("token", token, { httpOnly: true, withCredentials: true });
        res.status(200).json({ message: "User logged in", success: true, role: user.role });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

// Auth check
app.post("/auth", async (req, res) => {
    const userId = verifyToken(req, res);
    if (!userId) return res.json({ status: false, message: "Invalid or missing token" });

    const user = await UserModel.findById(userId).select("-password");
    if (!user) return res.json({ status: false, message: "User not found" });

    res.json({ status: true, user: user.username, role: user.role });
});

// Logout
app.post("/logout", (req, res) => {
    res.clearCookie("token", { path: "/" });
    return res.json({ status: true, message: "Logged out successfully" });
});

// Create project
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
            budget: Number(budget),
            deadline: new Date(deadline),
            postedby: userId,
            category,
        });

        res.status(201).json({ message: "Project created", success: true, project: newProject });
    } catch (err) {
        console.error(err);
        res.status(400).json({ message: "Error occurred", error: err.message, success: false });
    }
});

// Browse all projects
app.get("/browseprojects", async (req, res) => {
    try {
        const projects = await ProjectModel.find({}).populate("postedby", "-password");
        res.json(projects);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Something went wrong!", success: false });
    }
});

// Get single project
app.get("/getproject/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const project = await ProjectModel.findById(id).populate("postedby", "-password");
        if (!project) return res.status(404).json({ message: "Project not found" });

        res.json(project);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

// Edit project
app.put("/editproject/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const updatedData = req.body;
        const updatedProject = await ProjectModel.findByIdAndUpdate(id, updatedData, { new: true });
        if (!updatedProject) return res.status(404).json({ message: "Project not found" });

        res.json({ message: "Project updated successfully", success: true, project: updatedProject });
    } catch (err) {
        console.error(err);
        res.status(400).json({ message: "Error occurred", error: err.message, success: false });
    }
});

// Delete project
app.delete("/deleteproject/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const deletedProject = await ProjectModel.findByIdAndDelete(id);
        if (!deletedProject) return res.status(404).json({ message: "Project not found" });

        res.json({ message: "Project deleted successfully", success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

// Get projects of logged-in user
app.get("/getprojects", async (req, res) => {
    try {
        const userId = verifyToken(req, res);
        if (!userId) return res.status(401).json({ message: "No token" });

        const projects = await ProjectModel.find({ postedby: userId }).populate("postedby", "-password");
        res.json({ message: "Done", projects, success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

// Create bid
app.post("/createbid/:id", async (req, res) => {
    try {
        const userId = verifyToken(req, res);
        if (!userId) return res.status(401).json({ message: "No token" });

        const { id } = req.params; // project ID
        const { amount, message } = req.body;

        if (!amount || !message) return res.status(400).json({ message: "Amount and message required" });

        const newBid = await BidModel.create({ amount: Number(amount), message, freelancer: userId, project: id });
        res.json({ message: "Your bid has been placed", success: true, bid: newBid });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to create bid", success: false, error: error.message });
    }
});

// Get user's bids
app.get("/getmybids", async (req, res) => {
    try {
        const userId = verifyToken(req, res);
        if (!userId) return res.status(401).json({ message: "No token" });

        const bids = await BidModel.find({ freelancer: userId }).populate([
            { path: "freelancer", select: "-password" },
            { path: "project" },
        ]);

        res.json({ message: "Done", bids, success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

// Get bids for a project
app.get("/getprojectbids/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const project = await ProjectModel.findById(id);
        if (!project) return res.status(404).json({ message: "Project not found" });

        const bids = await BidModel.find({ project: id }).populate("freelancer", "username");
        res.json({ bids, projectTitle: project.title });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

// Update bid status
app.put("/updatebidstatus/:bidId", async (req, res) => {
    try {
        const { status } = req.body;
        const { bidId } = req.params;

        const updatedBid = await BidModel.findByIdAndUpdate(bidId, { status }, { new: true });
        if (!updatedBid) return res.status(404).json({ message: "Bid not found" });

        if (status === "won") {
            await ProjectModel.findByIdAndUpdate(updatedBid.project, { $addToSet: { bids: updatedBid._id } });
        }

        res.json(updatedBid);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to update bid status" });
    }
});

// Connect to DB and start server
app.listen(PORT, async () => {
    console.log(`Server running on port ${PORT}`);
    try {
        await mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("MongoDB Atlas connected!");
    } catch (err) {
        console.error("Database connection failed:", err);
    }
});
