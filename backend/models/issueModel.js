const mongoose = require("mongoose");
const { Repository } = require("./repoModel");
const { User } = require("./User");

const issueSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },
        issueNo: {
            type: Number,
            required: true
        },
        repository: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Repository"
        },
        description: {
            type: String,
            required: true
        },
        status: {
            type: String,
            enum: ["Open", "Closed"],
            default: "Open"
        },

        comments: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Comment"
            }
        ],
    },
    { timestamps: true }
)

module.exports = mongoose.model("Issue", issueSchema);
