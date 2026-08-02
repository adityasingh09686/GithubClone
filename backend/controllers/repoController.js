const mongoose = require("mongoose");
const User = require("../models/User");
const Repository = require("../models/repoModel");
const Issue = require("../models/issueModel");
require("dotenv").config();

const createRepos = async (req, res) => {
    try {
        const { owner, repoName, description, visibility, repoId, content, issues, files } = req.body;

        if (!owner || !repoName || !visibility || !repoId) {
            return res.status(400).json({
                success: false,
                message: "Owner, repoName, repoId and visibility are required"
            });
        }

        const normalizedName = repoName.trim();
        const normalizedOwner = owner.trim();

        // checking for the existing repo
        const existingRepo = await Repository.findOne({ repoName: normalizedName, owner: normalizedOwner });
        if (existingRepo) {
            return res.status(400).json({
                success: false,
                message: "Repository already exists"
            });
        }

        //checking if the owner of the repo exist
        const existingOwner = await User.findById(normalizedOwner);
        if (!existingOwner) {
            return res.status(404).json({
                success: false,
                message: "Owner not found"
            });
        }

        // creating a repo 
        const createdRepo = await Repository.create({
            owner: normalizedOwner,
            repoName: normalizedName,
            description,
            visibility,
            repoId,
            content: content || [],
            issues: issues || [],
            files: files || []
        });

        return res.status(201).json({
            success: true,
            message: "Repository created successfully",
            repository: createdRepo._id
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error creating repository",
            error
        })
    }
}

const getAllRepos = async (req, res) => {
    try {
        // 1. Check if the user is authenticated.
        // 2. Get all the repositories.
        // 3. Return the repositories.

        // get all repositories
        const allRepos = await Repository.find({}).populate("owner", "username email");
        if (allRepos.length == 0) {
            return res.status(404).json({
                success: false,
                message: "No repositories found",
            })
        }
        return res.status(200).json({
            success: true,
            message: "All repositories fetched successfully",
            repos: allRepos
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error
        })
    }
}

const updateRepository = async (req, res) => {
    try {

        // ==========================
        // Authentication
        // ==========================

        /* DISABLED FOR TESTING
        if (!req.user || !req.user.id) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }
        */

        // ==========================
        // Repository ID
        // ==========================

        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid repository credentials",
            });
        }

        // ==========================
        // Find Repository
        // ==========================

        const repository = await Repository.findById(id);

        if (!repository) {
            return res.status(404).json({
                success: false,
                message: "Repository doesn't exist",
            });
        }

        // ==========================
        // Authorization
        // ==========================

        /* DISABLED FOR TESTING
        if (repository.owner.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to update this repository",
            });
        }
        */

        const {
            repoName,
            visibility,
            content,
            issues,
            description
        } = req.body;

        const updateData = {};

        // ==========================
        // Name
        // ==========================

        if (repoName !== undefined) {

            const normalizedName = repoName.trim();

            if (normalizedName.length === 0) {
                return res.status(400).json({
                    success: false,
                    message: "Repository name cannot be empty",
                });
            }

            const existingRepo = await Repository.findOne({
                owner: repository.owner,
                repoName: normalizedName,
                _id: { $ne: id },
            });

            if (existingRepo) {
                return res.status(409).json({
                    success: false,
                    message: "Repository name already exists",
                });
            }

            updateData.repoName = normalizedName;
        }

        // ==========================
        // Visibility
        // ==========================

        if (visibility !== undefined) {

            // Normalize to match schema Enums exactly ("Public" or "Private")
            const normalizedVisibility = visibility.trim().charAt(0).toUpperCase() + visibility.trim().slice(1).toLowerCase();

            if (!["Public", "Private"].includes(normalizedVisibility)) {
                return res.status(400).json({
                    success: false,
                    message: "Visibility must be Public or Private",
                });
            }

            updateData.visibility = normalizedVisibility;
        }

        // ==========================
        // Content
        // ==========================

        if (content !== undefined) {
            updateData.content = content; // content is an array
        }

        // ==========================
        // Description
        // ==========================

        if (description !== undefined) {
            updateData.description = description;
        }

        // ==========================
        // Issues
        // ==========================

        if (issues !== undefined) {

            if (!Array.isArray(issues)) {
                return res.status(400).json({
                    success: false,
                    message: "Issues must be an array",
                });
            }

            updateData.issues = issues;
        }

        // ==========================
        // Update Repository
        // ==========================

        const updatedRepository = await Repository.findByIdAndUpdate(
            id,
            updateData,
            {
                new: true,
                runValidators: true,
            }
        );

        return res.status(200).json({
            success: true,
            message: "Repository updated successfully",
            repository: updatedRepository,
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

const fetchReposById = async (req, res) => {
    try {
        // 1. Check if the user is authenticated.

        // ==========================
        // Authentication
        // ==========================

        /* DISABLED FOR TESTING
        if (!req.user || !req.user.id) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }
        */

        // ==========================
        // Repository ID
        // ==========================

        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid repository credentials",
            });
        }

        // ==========================
        // Find Repository
        // ==========================

        const repository = await Repository.findById(id);

        if (!repository) {
            return res.status(404).json({
                success: false,
                message: "Repository doesn't exist",
            });
        }

        // ==========================
        // Authorization
        // ==========================

        /* DISABLED FOR TESTING
        if (repository.owner.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to fetch this repository",
            });
        }
        */
        // 2. Check if the repository exists.

        const existingRepo = await Repository.findById(id);

        if (!existingRepo) {
            return res.status(404).json({
                success: false,
                message: "Repository doesn't exist",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Repository is fetched",
        })

    } catch (error) {
        console.error("Error in fetching repository:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
}

const fetchReposByName = async (req, res) => {
    try {
        // Read from req.params since route is /repo/name/:name
        const { name } = req.params;

        if (!name) {
            return res.status(400).json({
                success: false,
                message: "Repository name is required in URL",
            });
        }

        const normalizedName = name.trim();
        const existingRepo = await Repository.findOne({ repoName: normalizedName }).populate("owner").populate("issues");

        if (!existingRepo) {
            return res.status(404).json({
                success: false,
                message: "Repository doesn't exist",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Repository is fetched",
            repository: existingRepo
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error
        })
    }
}

const fetchReposForCurrentUser = async (req, res) => {
    try {
        /* DISABLED FOR TESTING
        if (!req.user || !req.user.id) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }
        const userId = req.user.id;
        */
        const { id: userId } = req.params; // Using URL param /repo/user/:id for testing

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({ success: false, message: "Invalid user ID" });
        }

        const userRepos = await Repository.find({ owner: userId }).populate("owner");

        if (userRepos.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No repositories found for this user",
            });
        }

        return res.status(200).json({
            success: true,
            message: "User repositories fetched successfully",
            repos: userRepos
        });

    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal server error", error });
    }
}

const toggleVisiblitybyId = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: "Invalid repository ID" });
        }

        const repo = await Repository.findById(id);

        if (!repo) {
            return res.status(404).json({ success: false, message: "Repository not found" });
        }

        // Toggle visibility
        repo.visibility = repo.visibility === "Public" ? "Private" : "Public";
        await repo.save();

        return res.status(200).json({
            success: true,
            message: `Visibility toggled to ${repo.visibility}`,
            repository: repo
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal server error", error });
    }
}

const deleteReposbyId = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: "Invalid repository ID" });
        }

        const deletedRepo = await Repository.findByIdAndDelete(id);

        if (!deletedRepo) {
            return res.status(404).json({ success: false, message: "Repository not found" });
        }

        return res.status(200).json({
            success: true,
            message: "Repository deleted successfully"
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal server error", error });
    }
}

module.exports = {
    createRepos,
    getAllRepos,
    updateRepository,
    fetchReposById,
    fetchReposByName,
    fetchReposForCurrentUser,
    toggleVisiblitybyId,
    deleteReposbyId,
}



