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

// ✅ Allowed origins for CORS
const allowedOrigins = [
    "https://freelancehub-ytg5.onrender.com",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
];

// ✅ Middleware
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

/* --------------------------- TOKEN VERIFICATION -------------------------- */
const verifyToken = (req) => {
    const token = req.cookies.token;
    if (!token) return null;
    try {
        const decoded = jwt.verify(token, process.env.TOKEN_KEY);
        return decoded.id;
    } catch {
        return null;
    }
};

/* ------------------------------- AUTH ROUTES ----------------------------- */

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
    const userId = verifyToken(req);
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

/* ------------------------------ PROJECT ROUTES --------------------------- */

// ✅ Create project (Client only)
app.post("/createproject", async (req, res) => {
    try {
        const userId = verifyToken(req);
        if (!userId) return res.status(401).json({ message: "Unauthorized" });

        const { title, description, budget, deadline, category } = req.body;
        if (!title || !description || !budget || !deadline || !category)
            return res.status(400).json({ message: "All fields required" });

        await ProjectModel.create({
            title,
            description,
            budget: Number(budget),
            deadline: new Date(deadline),
            category,
            postedby: userId,
        });

        res.status(201).json({ message: "Project created", success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error creating project" });
    }
});

// ✅ Get all projects (Freelancers browse)
app.get("/browseprojects", async (req, res) => {
    try {
        const projects = await ProjectModel.find({}).populate("postedby", "-password");
        res.json(projects);
    } catch (err) {
        res.status(500).json({ message: "Something went wrong" });
    }
});

// ✅ Get single project by ID
app.get("/getproject/:id", async (req, res) => {
    try {
        const project = await ProjectModel.findById(req.params.id).populate("postedby", "-password");
        if (!project) return res.status(404).json({ message: "Not found" });
        res.json(project);
    } catch {
        res.status(500).json({ message: "Error" });
    }
});

// ✅ Get projects posted by logged-in client
app.get("/getprojects", async (req, res) => {
    try {
        const userId = verifyToken(req);
        if (!userId) return res.status(401).json({ message: "Unauthorized" });

        const projects = await ProjectModel.find({ postedby: userId }).populate("postedby", "-password");
        res.status(200).json({ message: "Done", projects, success: true });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

// ✅ Edit project
app.put("/editproject/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const updatedData = req.body;
        await ProjectModel.findByIdAndUpdate(id, updatedData, { new: true });
        res.json({ message: "Project updated successfully", success: true });
    } catch (err) {
        res.status(400).json({ message: "Error occurred", error: err.message, success: false });
    }
});

// ✅ Delete project
app.delete("/deleteproject/:id", async (req, res) => {
    try {
        const { id } = req.params;
        await ProjectModel.findByIdAndDelete(id);
        res.json({ message: "Project deleted successfully", success: true });
    } catch (err) {
        res.status(500).json({ message: "Error deleting project" });
    }
});

/* ------------------------------- BID ROUTES ------------------------------ */

// ✅ Create bid
app.post("/createbid/:id", async (req, res) => {
    try {
        const userId = verifyToken(req);
        if (!userId) return res.status(401).json({ message: "Unauthorized" });

        const { id } = req.params;
        const { amount, message } = req.body;

        await BidModel.create({
            amount: Number(amount),
            message,
            freelancer: userId,
            project: id,
        });

        res.json({ message: "Your bid has been placed", success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error placing bid" });
    }
});

// ✅ Get bids by freelancer
app.get("/getmybids", async (req, res) => {
    try {
        const userId = verifyToken(req);
        if (!userId) return res.status(401).json({ message: "Unauthorized" });

        const bids = await BidModel.find({ freelancer: userId }).populate([
            { path: "freelancer", select: "-password" },
            { path: "project" },
        ]);

        res.status(200).json({ message: "Done", bids, success: true });
    } catch (err) {
        res.status(500).json({ message: "Error fetching bids" });
    }
});

// ✅ Get bids for a specific project (client view)
app.get("/getprojectbids/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const project = await ProjectModel.findById(id);
        const bids = await BidModel.find({ project: id }).populate("freelancer", "username");
        res.status(200).json({ bids, projectTitle: project.title });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

// ✅ Update bid status (client)
app.put("/updatebidstatus/:bidId", async (req, res) => {
    try {
        const { status } = req.body;
        const { bidId } = req.params;

        const updatedBid = await BidModel.findByIdAndUpdate(bidId, { status }, { new: true });
        if (!updatedBid) return res.status(404).json({ message: "Bid not found" });

        if (status === "won") {
            await ProjectModel.findByIdAndUpdate(updatedBid.project, {
                $addToSet: { bids: updatedBid._id },
            });
        }

        res.json(updatedBid);
    } catch (err) {
        res.status(500).json({ message: "Failed to update bid status" });
    }
});

/* ---------------------------- SERVER CONNECTION -------------------------- */

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
