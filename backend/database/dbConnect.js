const mongoose = require("mongoose");
require("dotenv").config();

const dbConnect = async () => {
    try {
        const dbUrl = process.env.MONGODB_URL || "mongodb://127.0.0.1:27017/gitNevo";
        await mongoose.connect(dbUrl);
        console.log("Database connected successfully");
    } catch (error) {
        console.error("Database connection failed:", error.message);
        process.exit(1);
    }
};

module.exports = { dbConnect };
