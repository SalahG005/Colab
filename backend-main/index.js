const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");

const  connectDB  = require("./db/connectDB.js");
const authRoutes = require("./routes/auth.route.js");
const userRoutes=require("./routes/user.route.js");
const briefRoutes=require("./routes/brief.route.js");
const campaignRoutes=require("./routes/campaign.route.js");
const notificationRoutes= require("./routes/notification.route.js");
const categoryRoutes = require("./routes/category.route.js");
const creatorRoutes = require("./routes/creator.route.js");
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json()); // Allows us to parse incoming JSON requests
app.use(cookieParser()); // Allows us to parse incoming cookies

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/", briefRoutes);
app.use("/api/", campaignRoutes);
app.use("/api/user",userRoutes);
app.use("/api/notifications",notificationRoutes);
app.use("/api", categoryRoutes);
app.use("/api", creatorRoutes);
app.use("/uploads", express.static(path.join(__dirname, "images")));
// Serve frontend in production
if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "/frontend/dist")));

    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
    });
}

// Start server
const server = app.listen(PORT, async () => {
    try {
        await connectDB();
        const User = require("./models/user.model");
        const userCount = await User.countDocuments();
        if (userCount === 0) {
            const { seedData } = require("./seed");
            await seedData();
        }
        console.log("Server is running on port:", PORT);
    } catch (error) {
        console.error("Failed to start:", error);
        process.exit(1);
    }
});

// Export for testing or external use
module.exports = server;
