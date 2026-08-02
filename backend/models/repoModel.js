const mongoose = require("mongoose");

const repoSchema = new mongoose.Schema(
    {
        repoName: {
            type: String,
            required: true,
            trim: true
        },
        description: {
            type: String,
            trim: true
        },
        content: [
            {
                type: String,
                trim: true
            }
        ],
        visibility: {
            type: String,
            enum: ["Public", "Private"],
            default: "Public"
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        issues: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Issue",
            }
        ],
        repoId: {
            type: String,
            required: true,
            trim: true
        },
        files: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "File",
            }
        ],
    },
    { timestamps: true }
)

module.exports = mongoose.model("Repository", repoSchema);
