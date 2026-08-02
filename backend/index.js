const { dbConnect } = require("./database/dbConnect");
const cors = require("cors");
const express = require("express");
const cookieParser = require("cookie-parser");
const http = require("http");
const app = express();
const { Server } = require("socket.io");


const yargs = require("yargs");
require("dotenv").config();
const { hideBin } = require("yargs/helpers");
const { initRepo } = require("./controllers/init");
const { addRepo } = require("./controllers/add");
const { commitRepo } = require("./controllers/commit");
const { pushRepo } = require("./controllers/push");
const { pullRepo } = require("./controllers/pull");
const { revertRepo } = require("./controllers/revert");
const userRouter = require("./route/user.route");
const repoRouter = require("./route/repo.router");

yargs(hideBin(process.argv))
    .command("start", "Start a new Server", {}, startServer)
    .command("init", "Initialise a new repository", {}, initRepo)
    .command("add <file>", "Add a file to the repository", (yargs) => {
        yargs.positional("file", {
            type: "string",
            describe: "File to add"
        })
    }, (argv) => {
        addRepo(argv.file)  // adding the file to the Repo (name of the file is given by the user)
    })
    .command("commit <message>", "Commit the changes", (yargs) => {
        yargs.positional("message", {
            type: "string",
            describe: "Commit message"
        })
    }, (argv) => {
        commitRepo(argv.message)  // adding the message to the Repo
    })
    .command("push", "Push the changes", {}, pushRepo)
    .command("pull", "Pull the changes", {}, pullRepo)
    .command("revert", "Revert the changes", {}, revertRepo)
    .demandCommand(1, "You need atleast one command")
    .parse();


function startServer() {
    dbConnect();
    const app = express();
    app.use(cors());
    app.use(express.json());
    app.use(cookieParser());
    app.use(cors({ origin: "*" }));

    const PORT = process.env.PORT || 4000;

    app.get("/", (req, res) => {
        res.send("Welcome");
    });
    
    // Register the routes
    app.use("/", userRouter);
    app.use("/", repoRouter);

    //    let user = "TEST"   -> later after adding the auth / login system we will use the actual user ID

    const httpServer = http.createServer(app);
    const io = new Server(httpServer, {
        cors: {
            origin: "*",
            methods: ["GET", "POST", "PUT", "DELETE"],
            credentials: true
        }
    });

    io.on("connection", (socket) => {
        socket.on("joinroom", (userId) => {
            let user = userId;
            console.log("===========");
            console.log(user);
            console.log("===========");
            socket.join(userId);
        });
    });

    httpServer.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}
