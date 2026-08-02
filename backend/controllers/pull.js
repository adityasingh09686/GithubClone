const { cloudinaryConnect } = require("../config/cloudinary");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const fsPromises = fs.promises;
const path = require("path");
const https = require("https");

async function pullRepo(req, res) {
    const repoPath = path.resolve(process.cwd(), ".gitNevo");
    const commitPath = path.join(repoPath, "commits");

    try {
        // Ensure Cloudinary is connected
        cloudinaryConnect();

        // Ensure commits directory exists
        await fsPromises.mkdir(commitPath, { recursive: true });

        // Search for all resources in the gitNevo_commits folder
        const result = await cloudinary.search
            .expression('folder:gitNevo_commits')
            .max_results(500)
            .execute();

        const resources = result.resources;
        const downloadedFiles = [];

        for (const resource of resources) {
            // Using filename instead of public_id as git commit files don't have extensions
            // and Cloudinary's 'filename' field contains the base name we originally sent.
            // If they do have extensions, using the path from secure_url works best:
            const fileUrl = resource.secure_url;
            const urlObj = new URL(fileUrl);
            const fileName = path.basename(urlObj.pathname);
            
            const filePath = path.join(commitPath, fileName);

            await new Promise((resolve, reject) => {
                https.get(fileUrl, (response) => {
                    if (response.statusCode !== 200) {
                        return reject(new Error(`Failed to get '${fileUrl}' (${response.statusCode})`));
                    }
                    const writeStream = fs.createWriteStream(filePath);
                    response.pipe(writeStream);
                    writeStream.on("finish", () => {
                        writeStream.close();
                        resolve();
                    });
                    writeStream.on("error", reject);
                }).on("error", reject);
            });

            downloadedFiles.push(fileName);
            console.log(`Downloaded commit ${fileName} successfully.`);
        }

        if (res) {
            return res.status(200).json({
                success: true,
                message: "Repository pulled from Cloudinary successfully",
                data: downloadedFiles
            });
        }

    } catch (error) {
        console.error("Error at pullRepo: ", error);
        if (res) {
            return res.status(500).json({
                success: false,
                message: "Failed to pull repository from Cloudinary",
                error: error.message
            });
        }
    }
}

module.exports = { pullRepo };