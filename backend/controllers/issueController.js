const mongoose = require("mongoose");
const User = require("../models/User");
const Repository = require("../models/repoModel");
const Issue = require("../models/issueModel");
require("dotenv").config();

const createIssue = async (req, res) => {
    try {
        const {
            repoName,
            owner,
            title,
            description,
            labels,
            assignees,
            priority,
            issueId,
            comments
        } = req.body;

        // validating the incoming data
        if (!repoName || !owner || !title || !description || !issueId || !priority) {
            return res.status(400).json({
                success: false,
                message: "All the required fields are not present"
            })
        }

        // checking if the repository exist

        const existingRepo = await Repository.findOne({ repoName });
        if (!existingRepo) {
            return res.status(404).json({
                success: false,
                message: "Repository not found",
            })
        }
        // checking if the owner exist

        const existingOwner = await User.findById(owner);
        if (!existingOwner) {
            return res.status(404).json({
                success: false,
                message: "Owner not found",
            })
        }

        // checking if the issue already exist in the repo
        const existingIssue = await Issue.findOne({
            repoName,
            owner,
            issueId
        })

        if (existingIssue) {
            return res.status(409).json({
                success: false,
                message: "Issue already exists",
            })
        }

        const createIssue = Issue.create({
            repoName,
            owner,
            title,
            description,
            labels,
            assignees,
            priority,
            issueId,
            comments
        })

        return res.status(201).json(
            {
                success: true,
                message: "Issue created successfully",
                issue: createIssue._id
            }
        )

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error
        })
    }
}

const updateIssue = async (req, res) => {
    try {
        const { issueId } = req.params;
        const { title, description, labels, assignees, priority } = req.body;

        // validating the incoming data
        if (!issueId) {
            return res.status(400).json({
                success: false,
                message: "Issue ID is required"
            })
        }

        // checking if the issue exist
        const existingIssue = await Issue.findById(issueId);
        if (!existingIssue) {
            return res.status(404).json({
                success: false,
                message: "Issue not found",
            })
        }

        // updating the issue
        const updatedIssue = await Issue.findByIdAndUpdate(
            issueId,
            {
                title,
                description,
                labels,
                assignees,
                priority
            },
            { new: true }
        )

        return res.status(200).json(
            {
                success: true,
                message: "Issue updated successfully",
                issue: updatedIssue
            }
        )

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}

const deleteIssue = async (req, res) => {
    try {
        const { issueId } = req.params;

        // validating the incoming data
        if (!issueId) {
            return res.status(400).json({
                success: false,
                message: "Issue ID is required"
            })
        }

        // checking if the issue exist
        const existingIssue = await Issue.findById(issueId);
        if (!existingIssue) {
            return res.status(404).json({
                success: false,
                message: "Issue not found",
            })
        }

        // updating the issue
        const updatedIssue = await Issue.findByIdAndRemove(
            issueId,
            {
                title,
                description,
                labels,
                assignees,
                priority
            },
            { new: true }
        )

        return res.status(200).json(
            {
                success: true,
                message: "Issue deleted successfully",
                issue: updatedIssue
            }
        )

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}

const getAllIssues = async (req, res) => {
    try {

        const allIssues = await Issue.find();
        return res.status(200).json(
            {
                success: true,
                message: "All Issues fetched successfully",
                allIssues
            }
        )

    } catch (error) {
        console.log("ERROR IN FETCHING THE ISSUES : ", error);
        return res.status(500).json(
            {
                success: false,
                message: "Internal server error",
            }
        )
    }
}

const getIssueById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Issue ID",
            });
        }

        const issue = await Issue.findById(id);

        if (!issue) {
            return res.status(404).json({
                success: false,
                message: "Issue not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Issue fetched successfully",
            issue
        });

    } catch (error) {
        console.error("ERROR IN FETCHING ISSUE BY ID:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
}

module.exports = {
    createIssue,
    updateIssue,
    deleteIssue,
    getAllIssues,
    getIssueById
};
