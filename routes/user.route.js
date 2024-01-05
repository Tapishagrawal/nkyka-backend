const express = require('express');
const bcrypt = require('bcrypt');
const UserModel = require('../models/user.model');
const jwt = require("jsonwebtoken");

const userRouter = express.Router();

userRouter.post('/register', async (req, res) => {
    const { name, avatar, email, password } = req.body;
    try {
        if (!name || !email || !password) {
            return res.status(400).json({
                status: "fail",
                message: "Please provide username, email, and password.",
            });
        }

        const user = await UserModel.findOne({ email });
        if (user) {
            return res.status(409).json({
                status: "fail",
                message: `This email has already been registered.`,
            });
        }

        const hash = await bcrypt.hash(password, 5);
        const newUser = new UserModel({
            name,
            avatar,
            email,
            password: hash,
        });
        await newUser.save();

        res.status(201).json({
            status: "success",
            message: "The new user has been registered",
            data: { registeredUser: { name, email, hash } },
        });
    } catch (error) {
        console.log(error)
        res.status(400).json({ status: "fail", error });
    }
})

userRouter.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            return res.status(400).json({
                status: "fail",
                message: "Please provide both email and password.",
            });
        }

        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(400).json({
                status: "fail",
                message: "User not registered",
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({
                status: "fail",
                message: "Password is wrong",
            });
        }

        const token = jwt.sign(
            { username: user.name, userID: user._id },
            "nyka",
            {
                expiresIn: "7d",
            }
        );

        res.status(200).json({
            status: "success",
            message: "Login successfully!",
            data: {
                userID: user._id,
                username: user.name,
                token
            },
        });

    } catch (error) {
        console.error(error);
        res.status(400).json({ status: "fail", error });
    }
})

module.exports = userRouter