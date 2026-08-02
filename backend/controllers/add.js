const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

async function addRepo(file) {
    try {
        // current working directory
        const repoPath = process.cwd();

        const gitPath = path.join(repoPath, ".gitNevo");
        const objectsPath = path.join(gitPath, "objects");
        const stagingPath = path.join(gitPath, "staging.json");

        // Check whether repository exists // checking the existance of the path 
        if (!fs.existsSync(gitPath)) {
            console.log("Not a Nevo repository. Run 'nevo init' first.");
            return;
        }

        // Absolute path of file
        const filePath = path.join(repoPath, file);

        // Check if file exists
        if (!fs.existsSync(filePath)) {
            console.log(`File '${file}' does not exist.`);
            return;
        }

        // Read file contents
        const data = await fs.promises.readFile(filePath);

        // Generate SHA-1 hash basically generate a unique signature of the file
        const hash = crypto
            .createHash("sha1")
            .update(data)
            .digest("hex");

        // Store object only if it doesn't already exist
        const objectPath = path.join(objectsPath, hash);

        if (!fs.existsSync(objectPath)) {
            await fs.promises.writeFile(objectPath, data);
        }

        // Load staging area
        let staging = {};

        if (fs.existsSync(stagingPath)) {
            const content = await fs.promises.readFile(stagingPath, "utf8");

            if (content.trim() !== "") {
                staging = JSON.parse(content);
            }
        }

        // Store relative filename -> hash
        staging[file] = hash;

        // Save staging area
        await fs.promises.writeFile(
            stagingPath,
            JSON.stringify(staging, null, 2)
        );

        console.log(`Added '${file}' to staging area.`);
    } catch (error) {
        console.error("Error adding file:", error);
    }
}

module.exports = { addRepo };