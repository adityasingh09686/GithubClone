const express = require("express");
const userRouter = require("./user.route");
const repoRouter = require("./repo.router");

const mainRouter = express.Router();

mainRouter.get("/", (req, res) => {
    res.send("Welcome to GitUphaar!!!!");
});

mainRouter.use("/users", userRouter);
mainRouter.use("/repos", repoRouter);

module.exports = mainRouter;
