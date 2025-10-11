const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require('mongoose');
const { UserModel } = require('./models/UserModel');
const { createSecretToken } = require("./util/SecretToken");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const { ProjectModel } = require("./models/ProjectModel");
const { BidModel } = require("./models/BidModel");


dotenv.config();
const app = express();

const PORT = process.env.PORT || 8000


const allowedOrigins = [
    "https://freelancehub-ytg5.onrender.com",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
];

app.use(cors({
    origin: function (origin, callback) {
        // allow requests with no origin like mobile apps or curl
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) return callback(null, true);
        return callback(new Error("Not allowed by CORS"));
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
    preflightContinue: false, // important for OPTIONS
}));


app.use(express.json());

app.use(cookieParser());


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



app.post("/createproject", async (req, res) => {
    const token = req.cookies.token;
    let userId;
    if (!token) return res.status(401).json({ message: "No token" });

    jwt.verify(token, process.env.TOKEN_KEY, (err, decoded) => {
        if (err) return res.status(403).json({ message: "Invalid token" });
        userId = decoded.id;
    });

    try {
        const user = await UserModel.findById(userId);
        const { title, description, budget, deadline, category } = req.body;
        const newProject = await ProjectModel.create({ title, description, budget: Number(budget), deadline: new Date(deadline), postedby: userId, category });
        res.status(200).json({ message: "Post Created", success: true });
    } catch (err) {
        console.error(err);
        res.status(400).json({ message: "Error occurred", error: err.message, success: false });
    }

})

app.get("/browseprojects", async (req, res) => {
    try {
        const projects = await ProjectModel.find({}).populate({
            path: "postedby",
            select: "-password"
        });
        res.json(projects);
    } catch (err) {
        res.json({ message: "Something went wrong!", success: false });
    }
})

app.get("/getproject/:id", async (req, res) => {
    const { id } = req.params;
    console.log(id);
    const project = await ProjectModel.findById(id).populate({
        path: 'postedby',
        select: "-password"
    });
    console.log("Project : ");
    console.log(project);
    res.json(project);
})

app.put("/editproject/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const updatedData = req.body;
        console.log(updatedData);
        const updatedProject = await ProjectModel.findByIdAndUpdate(id, updatedData, { new: true });
        res.json({ message: "Updation Success", success: true });
    } catch (err) {
        res.status(400).json({ message: "Error occurred", error: err.message, success: false });
    }

})

app.delete("/deleteproject/:id", async (req, res) => {
    const { id } = req.params;
    const deletedProject = await ProjectModel.findByIdAndDelete(id);
    console.log(deletedProject)
    res.json({ message: "Project Deleted Successfully", success: true });
})

app.get("/getprojects", async (req, res) => {
    const token = req.cookies.token;
    jwt.verify(token, process.env.TOKEN_KEY, (err, decoded) => {
        if (err) return res.status(403).json({ message: "Invalid token" });
        userId = decoded.id;
    });
    const projects = await ProjectModel.find({ postedby: userId }).populate({
        path: 'postedby',
        select: "-password"
    });
    res.status(200).json({ message: "Done", projects: projects, success: true });
});


app.post("/createbid/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const token = req.cookies.token;
        jwt.verify(token, process.env.TOKEN_KEY, (err, decoded) => {
            if (err) return res.status(403).json({ message: "Invalid token" });
            userId = decoded.id;
        });
        console.log("USerid=", userId);
        console.log("projectId=", id);
        console.log(req.body);
        const { amount, message } = req.body;
        const newBid = await BidModel.create({ amount: Number(amount), message, freelancer: userId, project: id });
        res.json({ message: "Your Bid has been placed", success: true })
    } catch (error) {
        res.json({ message: "Failed", success: false, error: error.message })
    }
})

app.get("/getmybids", async (req, res) => {
    const token = req.cookies.token;
    jwt.verify(token, process.env.TOKEN_KEY, (err, decoded) => {
        if (err) return res.status(403).json({ message: "Invalid token" });
        userId = decoded.id;
    });
    const bids = await BidModel.find({ freelancer: userId }).populate([{
        path: 'freelancer',
        select: "-password"
    }, { path: "project" }]);
    console.log(bids);
    res.status(200).json({ message: "Done", bids: bids, success: true });
})

app.get("/getprojectbids/:id", async (req, res) => {
    try {
        const { id } = req.params; // this is project ID
        const project = await ProjectModel.findById(id);
        const bids = await BidModel.find({ project: id }).populate("freelancer", "username");
        res.status(200).json({ bids, projectTitle: project.title });
    } catch (err) {
        console.error("Error fetching bids:", err);
        res.status(500).json({ message: "Server error" });
    }
})

// PUT /updatebidstatus/:id
app.put('/updatebidstatus/:bidId', async (req, res) => {
    try {
        const { status } = req.body;
        const { bidId } = req.params;

        const updatedBid = await BidModel.findByIdAndUpdate(
            bidId,
            { status },
            { new: true }
        );

        if (!updatedBid) {
            return res.status(404).json({ message: "Bid not found" });
        }

        // If status is won, add bid to project.bids array (if not already)
        if (status === "won") {
            await ProjectModel.findByIdAndUpdate(
                updatedBid.project,
                { $addToSet: { bids: updatedBid._id } }
            );
        }

        res.json(updatedBid);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to update bid status" });
    }
});



app.listen(PORT, async () => {
    console.log("App is Listening!!");
    try {
        await mongoose.connect("mongodb://127.0.0.1:27017/freelancerhub");
        console.log("Db connected!!");

    } catch (err) {
        console.log("Db failed to connect!!");
    }
});