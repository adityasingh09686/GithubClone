const express = require("express");
const {
    createRepos,
    getAllRepos,
    updateRepository,
    fetchReposById,
    fetchReposByName,
    fetchReposForCurrentUser,
    toggleVisiblitybyId,
    deleteReposbyId
} = require("../controllers/repoController");

const repoRouter = express.Router();

repoRouter.post("/repo/create", createRepos);
repoRouter.get("/repo/all", getAllRepos);
// repoRouter.put("/repo/all", updateAllRepos);
repoRouter.get("/repo/:id", fetchReposById);
repoRouter.get("/repo/name/:name", fetchReposByName);
repoRouter.get("/repo/user/:id", fetchReposForCurrentUser);
repoRouter.put("/repo/update/:id", updateRepository);
repoRouter.put("/repo/toggle/:id", toggleVisiblitybyId);
repoRouter.delete("/repo/delete/:id", deleteReposbyId);


module.exports = repoRouter;
