import express from "express";
import jwt from "jsonwebtoken";
import { User, Account } from "../db.js";
import { JWT_SECRET } from "../config.js";
import {
    signupInputValidation,
    signinInputValidation,
    updateDataValidator,
} from "../middlewares/inputValidator.js";
import {
    userSignupValidation,
    userSigninValidation,
} from "../middlewares/userValidator.js";
import { authTokenChecker } from "../middlewares/authTokenCheck.js";

const router = express.Router();

router.post(
    "/signup",
    signupInputValidation,
    userSignupValidation,
    async (req, res) => {
        console.log("signup ep invoked");
        const { firstName, lastName, username, password } = req.body;
        try {
            const user = await User.create({
                username,
                firstName,
                lastName,
                password,
            });
            const userId = user._id;

            // Assigning user a random balance at signup, upto 10000 with 2 decimal places
            await Account.create({
                userId,
                balance: Math.round((Math.random() * 10000 + 1) * 100) / 100,
            });

            const token = jwt.sign({ userId }, JWT_SECRET);
            res.status(200).json({
                msg: "User Created successfully",
                token: token,
            });
        } catch (err) {
            console.log(err);
            res.status(400).send(err);
        }
    }
);

router.post(
    "/signin",
    signinInputValidation,
    userSigninValidation,
    async (req, res) => {
        const { username } = req.body;
        try {
            const user = await User.findOne({ username });
            const userId = user._id;
            const token = jwt.sign({ userId }, JWT_SECRET);
            res.status(200).json({
                token: token,
            });
        } catch (err) {
            console.log(err);
            res.status(400).send(err);
        }
    }
);

// Get current user info
router.get("/me", authTokenChecker, async (req, res) => {
    try {
        const user = await User.findById(req.userId).select(
            "firstName lastName"
        );
        if (!user) return res.status(404).json({ msg: "User not found" });
        res.json({ user });
    } catch (err) {
        res.status(500).json({ msg: "Server error", error: err });
    }
});

router.put("/", authTokenChecker, updateDataValidator, async (req, res) => {
    try {
        await User.updateOne({ _id: req.userId }, { $set: req.body });
        res.json({ msg: "Details updated successfully" });
    } catch (err) {
        res.status(403).json({
            msg: "Something is wrong while data update",
            error: err,
        });
    }
});

// to filter users with their first or last name
// /api/v1/user/bulk?filter=prince

router.get("/list-user", authTokenChecker, async (req, res) => {
    const filter = req.query.filter || "";
    const currentUserId = req.userId; // Get the authenticated user's ID
    try {
        const users = await User.find({
            $or: [
                { firstName: { $regex: filter, $options: "i" } },
                { lastName: { $regex: filter, $options: "i" } },
            ],
            _id: { $ne: currentUserId }, // Exclude the current user
        });
        res.json({
            usersArr: users.map(user => ({
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                _id: user._id,
            })),
        });
    } catch (err) {
        res.json({ msg: err });
    }
});

export default router;
