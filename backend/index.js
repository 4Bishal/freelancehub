const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require('mongoose');
const cookieParser = require("cookie-parser");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const { UserModel } = require('./models/UserModel');
const { ProjectModel } = require("./models/ProjectModel");
const { BidModel } = require("./models/BidModel");
const { createSecretToken } = require("./util/SecretToken");

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
const isProd = process.env.NODE_ENV === "production";

// ----------------- MIDDLEWARE -----------------
app.use(express.json());
app.use(cookieParser());

// CORS setup
const allowedOrigins = [
    "http://localhost:5173",
    "https://freelancehub-xqif.onrender.com"
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
        return callback(new Error("CORS not allowed"));
    },
    credentials: true
}));

// ----------------- AUTH MIDDLEWARE -----------------
const verifyToken = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: "No token" });

    try {
        const decoded = jwt.verify(token, process.env.TOKEN_KEY);
        req.userId = decoded.id;
        next();
    } catch (err) {
        return res.status(403).json({ message: "Invalid token" });
    }
};

// Role-based access
const allowRoles = (roles) => (req, res, next) => {
    UserModel.findById(req.userId).then(user => {
        if (!user) return res.status(404).json({ message: "User not found" });
        if (!roles.includes(user.role)) return res.status(403).json({ message: "Forbidden" });
        req.userRole = user.role;
        next();
    }).catch(err => res.status(500).json({ message: "Server error", error: err.message }));
};

// ----------------- ROUTES -----------------

// Signup
app.post("/signup", async (req, res) => {
    try {
        const { email, password, username, role } = req.body;
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "User already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await UserModel.create({ email, password: hashedPassword, username, role });

        const token = createSecretToken(user._id);

        res.cookie("token", token, {
            httpOnly: true,
            secure: isProd,
            sameSite: isProd ? "None" : "Lax",
            maxAge: 1000 * 60 * 60 * 24 * 7
        });

        res.status(201).json({ message: "User signed up successfully", success: true, user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

// Login
app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ message: "All fields are required" });

        const user = await UserModel.findOne({ email });
        if (!user) return res.status(400).json({ message: "Incorrect email or password" });

        const auth = await bcrypt.compare(password, user.password);
        if (!auth) return res.status(400).json({ message: "Incorrect email or password" });

        const token = createSecretToken(user._id);

        res.cookie("token", token, {
            httpOnly: true,
            secure: isProd,
            sameSite: isProd ? "None" : "Lax",
            maxAge: 1000 * 60 * 60 * 24 * 7
        });

        res.status(200).json({ message: "Logged in successfully", success: true, role: user.role });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
});

// Logout
app.post("/logout", (req, res) => {
    res.clearCookie("token", { path: "/", secure: isProd, sameSite: isProd ? "None" : "Lax" });
    res.json({ status: true, message: "Logged out successfully" });
});

// Auth check
app.post("/auth", verifyToken, async (req, res) => {
    try {
        const user = await UserModel.findById(req.userId).select("-password");
        console.log(user);
        if (!user) return res.status(404).json({ status: false, message: "User not found" });
        res.json({ status: true, username: user.username, role: user.role });
    } catch (err) {
        res.status(500).json({ status: false, message: "Server error", error: err.message });
    }
});

// ----------------- PROJECT ROUTES -----------------

// Create project (Client only)
app.post("/createproject", verifyToken, allowRoles(["client"]), async (req, res) => {
    try {
        const { title, description, budget, deadline, category } = req.body;
        const newProject = await ProjectModel.create({
            title,
            description,
            budget: Number(budget),
            deadline: new Date(deadline),
            postedby: req.userId,
            category
        });
        res.status(201).json({ message: "Project created successfully", success: true, project: newProject });
    } catch (err) {
        res.status(500).json({ message: "Error occurred", error: err.message, success: false });
    }
});

// Get all projects (Freelancer)
app.get("/browseprojects", verifyToken, allowRoles(["freelancer"]), async (req, res) => {
    try {
        const projects = await ProjectModel.find({}).populate("postedby", "-password");
        res.json({ success: true, projects });
    } catch (err) {
        res.status(500).json({ message: "Something went wrong!", success: false });
    }
});

// Get project by id
app.get("/getproject/:id", verifyToken, async (req, res) => {
    try {
        const project = await ProjectModel.findById(req.params.id).populate("postedby", "-password");
        if (!project) return res.status(404).json({ message: "Project not found" });
        res.json({ success: true, project });
    } catch (err) {
        res.status(500).json({ message: "Server error", success: false, error: err.message });
    }
});

// Edit project (Client only)
app.put("/editproject/:id", verifyToken, allowRoles(["client"]), async (req, res) => {
    try {
        const updatedProject = await ProjectModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json({ message: "Project updated successfully", success: true, project: updatedProject });
    } catch (err) {
        res.status(500).json({ message: "Error updating project", success: false, error: err.message });
    }
});

// Delete project (Client only)
app.delete("/deleteproject/:id", verifyToken, allowRoles(["client"]), async (req, res) => {
    try {
        const deletedProject = await ProjectModel.findByIdAndDelete(req.params.id);
        res.json({ message: "Project deleted successfully", success: true, project: deletedProject });
    } catch (err) {
        res.status(500).json({ message: "Error deleting project", success: false, error: err.message });
    }
});

// Get projects posted by client
app.get("/getprojects", verifyToken, allowRoles(["client"]), async (req, res) => {
    try {
        const projects = await ProjectModel.find({ postedby: req.userId });
        res.json({ success: true, projects });
    } catch (err) {
        res.status(500).json({ message: "Server error", success: false, error: err.message });
    }
});

// ----------------- BID ROUTES -----------------

// Create bid (Freelancer only)
app.post("/createbid/:id", verifyToken, allowRoles(["freelancer"]), async (req, res) => {
    try {
        const { amount, message } = req.body;
        const projectId = req.params.id;
        const newBid = await BidModel.create({ amount: Number(amount), message, freelancer: req.userId, project: projectId });
        res.status(201).json({ message: "Bid placed successfully", success: true, bid: newBid });
    } catch (err) {
        res.status(500).json({ message: "Error placing bid", success: false, error: err.message });
    }
});

// Get bids by freelancer
app.get("/getmybids", verifyToken, allowRoles(["freelancer"]), async (req, res) => {
    try {
        const bids = await BidModel.find({ freelancer: req.userId })
            .populate([{ path: 'freelancer', select: "-password" }, { path: "project" }]);
        res.json({ success: true, bids });
    } catch (err) {
        res.status(500).json({ message: "Error fetching bids", success: false, error: err.message });
    }
});

// Get bids for a project (Client only)
app.get("/getprojectbids/:id", verifyToken, allowRoles(["client"]), async (req, res) => {
    try {
        const projectId = req.params.id;
        const project = await ProjectModel.findById(projectId);
        if (!project) return res.status(404).json({ message: "Project not found" });

        const bids = await BidModel.find({ project: projectId }).populate("freelancer", "username");
        res.json({ success: true, projectTitle: project.title, bids });
    } catch (err) {
        res.status(500).json({ message: "Error fetching bids", success: false, error: err.message });
    }
});

// Update bid status (Client only)
app.put('/updatebidstatus/:bidId', verifyToken, allowRoles(["client"]), async (req, res) => {
    try {
        const { status } = req.body;
        const { bidId } = req.params;

        const updatedBid = await BidModel.findByIdAndUpdate(bidId, { status }, { new: true });
        if (!updatedBid) return res.status(404).json({ message: "Bid not found" });

        if (status === "won") {
            await ProjectModel.findByIdAndUpdate(updatedBid.project, { $addToSet: { bids: updatedBid._id } });
        }

        res.json({ success: true, bid: updatedBid });
    } catch (err) {
        res.status(500).json({ message: "Error updating bid status", success: false, error: err.message });
    }
});

// ----------------- START SERVER -----------------
const start = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("MongoDB connected!");
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    } catch (err) {
        console.error("Failed to start server", err);
    }
};

start();
