const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

async function commitRepo(message) {
    try {
        // checking the existance of the staging file
        const stagingPath = path.join(process.cwd(), ".gitNevo", "staging.json");
        // checkin if the commit need to be added 
        const commitPath = path.join(process.cwd(), ".gitNevo", "commits");

        // if the staging file is not exist so nothing to commit 
        if (!fs.existsSync(stagingPath)) {
            console.log("Nothing to commit");
            return;
        }

        // reading the data of the staging json file 
        const stagingData = JSON.parse(await fs.promises.readFile(stagingPath));

        if (!stagingData) {
            console.log("There is nothing to commit");
            return;
        }

        // creating a commit file 
        const commitData = {
            message: message,
            timestamp: new Date().toISOString(),
            files: stagingData
        };

        // unique identification to the commit file
        const commitHash = crypto.createHash("sha1").update(JSON.stringify(commitData)).digest("hex");

        // creating a commit file 
        await fs.promises.writeFile(path.join(commitPath, commitHash), JSON.stringify(commitData, null, 2));

        // removing the staging file 
        await fs.promises.writeFile(stagingPath, "{}");

        console.log(`Committed with message "${message}"`);
    } catch (error) {
        console.error("Error adding file:", error);
    }
}

module.exports = { commitRepo };