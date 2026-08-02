const fs = require("fs");
const path = require("path");
const os = require("os");
require("dotenv").config();

async function initRepo() {
    // const rootDir = process.cwd();
    // const gitDir = path.join(rootDir, ".gitNevo");
    // if(fs.existsSync(gitDir)){
    //     console.log("Git repository already exists");
    //     return;
    // }

    // returns the path where the file is saved
    const repoPath = path.resolve(process.cwd());
    // creating an internal .gitNevo directory
    const gitPath = path.join(repoPath, ".gitNevo");
    // creating an internal commits directory
    const commitPath = path.join(gitPath, "commits");
    // creating an internal objects directory
    const objectsPath = path.join(gitPath, "objects");


    try {
        // recursive true means that the parent directory is also created if it does not exist
        // This line is creating a directory at the specified gitPath with the recursive: true option.
        // If the parent directories in the path don't exist, they will be created automatically.
        // If the directory already exists, it will do nothing (unless the recursive option is false and the directory is not empty, which might cause an error, but here it's true, so it's safe).
        await fs.promises.mkdir(gitPath, { recursive: true });
        await fs.promises.mkdir(commitPath, { recursive: true });
        await fs.promises.mkdir(objectsPath, { recursive: true });

        // stores the default branch (main) that Git will use.
        const headPath = path.join(gitPath, "HEAD");
        await fs.promises.writeFile(headPath, "ref: refs/heads/main\n");

        // This lets your project know which S3 bucket to use later.
        await fs.promises.writeFile(
            path.join(repoPath, "config.json"),
            JSON.stringify({ bucket: process.env.S3_BUCKET })
        );

        // success message 
        console.log("Git repository initialized successfully")

    } catch (error) {
        console.error("Error initializing repository", error);
        process.exit(1);
    }

    // if (fs.existsSync(gitPath)) {
    //     console.log("Git repository already exists");
    //     return;
    // }
    // fs.mkdirSync(gitPath, { recursive: true });
    // fs.mkdirSync(commitPath, { recursive: true });
    // fs.mkdirSync(objectsPath, { recursive: true });

    // const headPath = path.join(gitPath, "HEAD");
    // fs.writeFileSync(headPath, "ref: refs/heads/main\n");

}

module.exports = { initRepo }