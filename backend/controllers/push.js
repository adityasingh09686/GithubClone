const { cloudinaryConnect } = require("../config/cloudinary");
const cloudinary = require("cloudinary").v2;
const fs = require("fs").promises;
const path = require("path");

async function pushRepo(req, res) {
    const repoPath = path.resolve(process.cwd(), ".gitNevo");
    const commitPath = path.join(repoPath, "commits");

    try {
        // Ensure Cloudinary is connected
        cloudinaryConnect();

        const commitDirs = await fs.readdir(commitPath);
        const uploadedFiles = [];

        for (const commitDir of commitDirs) {
            const filePath = path.join(commitPath, commitDir);
            
            // Upload to Cloudinary
            const result = await cloudinary.uploader.upload(filePath, {
                folder: "gitNevo_commits",
                resource_type: "auto", // Handles non-image files like text/json if needed
                use_filename: true,
                unique_filename: false
            });

            uploadedFiles.push({
                commitId: commitDir,
                url: result.secure_url
            });
            console.log(`Uploaded commit ${commitDir} successfully.`);
        }

        if (res) {
            return res.status(200).json({
                success: true,
                message: "Repository commits pushed to Cloudinary successfully",
                data: uploadedFiles
            });
        }

    } catch (error) {
        console.error("Error at pushRepo: ", error);
        if (res) {
            return res.status(500).json({
                success: false,
                message: "Failed to push commits to Cloudinary",
                error: error.message
            });
        }
    }
}

module.exports = { pushRepo };