const express = require("express");
const { getAllUsers, signUp, Login, getUserProfile, updateUserProfile, deleteUserProfile } = require("../controllers/UserController");
const userRouter = express.Router();

userRouter.get("/allUsers", getAllUsers);
userRouter.post("/signUp", signUp);
userRouter.post("/login", Login);
userRouter.get("/userProfile/:id", getUserProfile);
userRouter.put("/updateUserProfile/:id", updateUserProfile);
userRouter.delete("/deleteUserProfile/:id", deleteUserProfile);

module.exports = userRouter;
