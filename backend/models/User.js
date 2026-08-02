const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
    {
        userName: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            // Basic RegEx to validate email format
            match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Please enter a valid email address"]
        },
        password: {
            type: String,
            required: true,
            select: false // Prevents password from being returned in standard queries
        },
        bio: {
            type: String,
            default: ""
        },
        location: {
            type: String,
            default: ""
        },
        company: {
            type: String,
            default: ""
        },
        website: {
            type: String,
            default: ""
        },
        repositories: [
            {
                default: [],
                type: mongoose.Schema.Types.ObjectId,
                ref: "Repository",
            }
        ],
        followers: [
            {
                default: [],
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            }
        ],
        bookMarkRepositories: [
            {
                default: [],
                type: mongoose.Schema.Types.ObjectId,
                ref: "Repository",
            }
        ]
        // accountType: {
        //     type: String,
        //     enum: ["Admin", "Student", "Instructor"],
        //     required: true
        // },
        // token: {
        //     type: String
        // },
        // resetPasswordExpires: {
        //     type: Date
        // },
    },
    // Enables automatic createdAt and updatedAt fields
    { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);