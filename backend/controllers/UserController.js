const mongoose = require("mongoose");
const jsonwebtoken = require("jsonwebtoken");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
require("dotenv").config();

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({});
        res.status(200).json({
            success: true,
            message: "All users fetched successfully",
            users
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Error fetching users",
            error
        });
    }
}

const signUp = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // check if any field is empty before trying to trim them
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Name, email and password are required"
            });
        }

        const normalizedEmail = email.trim().toLowerCase();
        const normalizedName = name.trim();
        const normalizedPassword = password.trim();

        // validating the the email
        if (!validator.isEmail(normalizedEmail)) {
            return res.status(400).json({
                success: false,
                message: "Invalid email"
            });
        }

        // check if user already exists 
        const user = await User.findOne({ email: normalizedEmail });
        if (user) {
            return res.status(400).json({
                success: false,
                message: "User already exists"
            });
        }

        // encrpypt the password
        const hashedPassword = await bcrypt.hash(normalizedPassword, 10);

        // create new user
        const createdUser = await User.create({
            userName: normalizedName,
            email: normalizedEmail,
            password: hashedPassword,
            repositories: [],
            followers: [],
            bookMarkRepositories: []
        });

        //making the token 
        const token = jsonwebtoken.sign(
            {
                id: createdUser._id
            },
            process.env.JWT_SECRET_KEY,
            {
                expiresIn: "24h"
            }
        );

        const userResponse = {
            id: createdUser._id,
            userName: createdUser.userName,
            email: createdUser.email,
        };

        res.status(201).json({
            success: true,
            message: "User created successfully",
            user: userResponse,
            token
        });
    } catch (error) {
        console.error("Sign UP ERROR : ", error);

        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}

const Login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const normalizedEmail = email.trim().toLowerCase();
        const normalizedPassword = password.trim();
        if (!normalizedEmail || !normalizedPassword) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }
        // Because the User model has `select: false` on the password field, 
        // we must explicitly use `.select("+password")` to retrieve it for comparison.
        const existingUser = await User.findOne({ email: normalizedEmail }).select("+password");
        if (!existingUser) {
            return res.status(404).json({
                success: false,
                message: "Invalid Credentials"
            });
        }
        const isMatched = await bcrypt.compare(password, existingUser.password);
        if (!isMatched) {
            return res.status(404).json(
                {
                    success: false,
                    message: "Invalid Credentials"
                }
            );
        }
        const token = jsonwebtoken.sign(
            {
                id: existingUser._id
            },
            process.env.JWT_SECRET_KEY,
            {
                expiresIn: "24h"
            }
        );
        const user = {
            id: existingUser._id,
            name: existingUser.userName,
            email: existingUser.email
        };
        return res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            user
        });
    } catch (error) {
        console.error("Login ERROR : ", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}

const getUserProfile = async (req, res) => {
    try {
        // Since there is no auth middleware yet, we get the ID from the URL params instead of req.user
        const userId = req.params.id;
        const user = await User.findById(userId);
        console.log("USER : ", user);
        res.status(200).json({
            success: true,
            message: "User found successfully",
            user
        });
    } catch (error) {
        console.error("DELETE USER ERROR : ", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}

const updateUserProfile = async (req, res) => {
    try {

        const userId = req.params.id;
        const { name, email, password, bio, location, company, website } = req.body;

        const updateData = {};
        if (name !== undefined) updateData.userName = name;
        if (email !== undefined) updateData.email = email;
        if (bio !== undefined) updateData.bio = bio;
        if (location !== undefined) updateData.location = location;
        if (company !== undefined) updateData.company = company;
        if (website !== undefined) updateData.website = website;
        
        if (password) {
            const bcrypt = require("bcryptjs");
            updateData.password = await bcrypt.hash(password, 10);
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $set: updateData },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        return res.status(200).json({
            success: true,
            message: "User updated successfully",
            user: updatedUser
        });

    } catch (error) {
        console.error("UPDATE USER ERROR : ", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}

const deleteUserProfile = async (req, res) => {
    try {
        // Since there is no auth middleware yet, we get the ID from the URL params instead of req.user
        const userId = req.params.id;
        const deletedUser = await User.findByIdAndDelete(userId);
        if (!deletedUser) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        return res.status(200).json({
            success: true,
            message: "Account deleted successfully"
        });
    } catch (error) {
        console.error("DELETE USER ERROR:", error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

module.exports = {
    getAllUsers,
    signUp,
    Login,
    getUserProfile,
    updateUserProfile,
    deleteUserProfile
}



