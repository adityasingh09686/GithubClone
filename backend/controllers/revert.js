const fs = require("fs");
const path = require("path");

async function revertRepo(commitID) {
    try {
        const repoPath = process.cwd();
        const gitPath = path.join(repoPath, ".gitNevo");
        const commitPath = path.join(gitPath, "commits", commitID);
        const objectsPath = path.join(gitPath, "objects");

        if (!fs.existsSync(gitPath)) {
            console.log("Not a Nevo repository. Run 'nevo init' first.");
            return;
        }

        if (!commitID) {
            console.log("Please provide a commit ID to revert to.");
            return;
        }

        if (!fs.existsSync(commitPath)) {
            console.log(`Commit ${commitID} does not exist.`);
            return;
        }

        const commitContent = await fs.promises.readFile(commitPath, "utf8");
        const commitData = JSON.parse(commitContent);
        const files = commitData.files;

        if (!files) {
            console.log(`Commit ${commitID} contains no files.`);
            return;
        }

        for (const [file, hash] of Object.entries(files)) {
            const objectPath = path.join(objectsPath, hash);
            const targetPath = path.join(repoPath, file);

            if (!fs.existsSync(objectPath)) {
                console.log(`Warning: Object file for hash ${hash} not found.`);
                continue;
            }

            const objectData = await fs.promises.readFile(objectPath);
            
            // Ensure the directory for the target file exists
            await fs.promises.mkdir(path.dirname(targetPath), { recursive: true });
            
            // Restore the file in the working directory
            await fs.promises.writeFile(targetPath, objectData);
            console.log(`Restored: ${file}`);
        }

        console.log(`Successfully reverted to commit ${commitID}`);
    } catch (error) {
        console.error("Error reverting repo:", error);
    }
}

module.exports = { revertRepo };