import express from "express";
import { authTokenChecker } from "../middlewares/authTokenCheck.js";
import { Account, Transaction } from "../db.js";
import mongoose from "mongoose";

const router = express.Router();

// Handles request for /api/v1/account/*

// Users can get their balance using this
router.get("/balance", authTokenChecker, async (req, res) => {
    const userId = req.userId;
    // console.log(userId);
    try {
        const account = await Account.findOne({ userId });
        res.json({ balance: account.balance });
    } catch (err) {
        res.status(403).json({ msg: "error fetching balance", error: err });
    }
});

/*

// Transaction router [Important]

router.post("/transaction", authTokenChecker, async (req, res) => {
    // Bad Solution:
    //  - Issues: No Atomicity
    //            No lock, i.e, no prevention of multiple request during the transaction
    const { sendToUserId, amount } = req.body;
    const userId = req.userId;
    console.log(userId);

    const account = await Account.findOne({ userId });
    if (account.balance < amount) {
        return res.status(400).json({
            msg: "insufficient balance",
        });
    }

    const toAccount = await Account.findOne({ userId: sendToUserId });
    console.log(sendToUserId);
    if (!toAccount) {
        return res.json({
            msg: "user doesn't exist whom you want to send the amount",
        });
    }

    // Updating balance:
    // - reducing amount from user account who is sending
    await Account.updateOne(
        { userId: userId },
        { $inc: { balance: -amount.toFixed(2) } }
    );
    // - increasing amount of user to whom amount is sent
    await Account.updateOne(
        { userId: sendToUserId },
        { $inc: { balance: amount.toFixed(2) } }
    );

    res.json({
        msg: "Transaction Successful",
    });
});

*/

// Good way to Handle this is using Transactions:

router.post("/transaction", authTokenChecker, async (req, res) => {
    const currSession = await mongoose.startSession();
    try {
        currSession.startTransaction();

        const { sendToUserId, amount } = req.body;
        const userId = req.userId;

        // console.log(userId);

        // Fetch the account userId within the transaction
        const account = await Account.findOne({ userId }).session(currSession);
        if (!account || account.balance < amount) {
            await currSession.abortTransaction();
            return res.status(400).json({
                msg: "insufficient balance or wrong account",
            });
        }

        // Fetch the account userId within the transaction
        const toAccount = await Account.findOne({
            userId: sendToUserId,
        }).session(currSession);

        // console.log(sendToUserId);

        if (!toAccount) {
            await currSession.abortTransaction();
            return res.json({
                msg: "user doesn't exist whom you want to send the amount",
            });
        }

        // Performing Transaction
        const roundedAmount = Math.round(parseFloat(amount) * 100) / 100;

        // Use aggregation pipeline updates with $round to avoid IEEE 754 float drift
        // - deducting amount from sender
        await Account.updateOne(
            { userId: userId },
            [{ $set: { balance: { $round: [{ $subtract: ["$balance", roundedAmount] }, 2] } } }]
        ).session(currSession);

        // - increasing amount in recipient's account
        await Account.updateOne(
            { userId: sendToUserId },
            [{ $set: { balance: { $round: [{ $add: ["$balance", roundedAmount] }, 2] } } }]
        ).session(currSession);

        // Record the transaction in history
        await Transaction.create(
            [{ fromUserId: userId, toUserId: sendToUserId, amount: roundedAmount }],
            { session: currSession }
        );

        // Commit the transaction
        await currSession.commitTransaction();

        res.json({
            msg: "Transaction Successful",
        });
    } catch (err) {
        await currSession.abortTransaction();
        res.json({
            msg: "Transaction failure, Amount will be rollback",
            Error: err,
        });
    } finally {
        currSession.endSession();
    }
});

router.get("/transactions", authTokenChecker, async (req, res) => {
    try {
        const userId = req.userId;
        const skip = Math.max(0, parseInt(req.query.skip) || 0);
        const LIMIT = 7;

        // fetch one extra to know if more pages exist
        const transactions = await Transaction.find({
            $or: [{ fromUserId: userId }, { toUserId: userId }],
        })
            .populate("fromUserId", "firstName lastName")
            .populate("toUserId", "firstName lastName")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(LIMIT + 1);

        const hasMore = transactions.length > LIMIT;
        if (hasMore) transactions.pop();

        res.json({ transactions, hasMore });
    } catch (err) {
        res.status(500).json({ msg: "Error fetching transactions", error: err });
    }
});

export default router;
