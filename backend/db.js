import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
mongoose.connect(`${process.env.DB_URL}/payment_app`);

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        minLength: 3,
        maxLength: 20,
    },
    firstName: {
        type: String,
        maxLength: 30,
        trim: true,
        required: true,
    },
    lastName: {
        type: String,
        maxLength: 30,
        trim: true,
        default: null,
    },
    password: {
        type: String,
        minLength: 6,
        required: true,
    },
});

const accountSchema = new mongoose.Schema({
    userId: {
        ref: "User",
        type: mongoose.Schema.Types.ObjectId,
    },
    balance: {
        type: Number,
        required: true,
    },
});

const transactionSchema = new mongoose.Schema(
    {
        fromUserId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        toUserId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        amount: {
            type: Number,
            required: true,
        },
    },
    { timestamps: true }
);

export const User = mongoose.model("User", UserSchema);
export const Account = mongoose.model("Account", accountSchema);
export const Transaction = mongoose.model("Transaction", transactionSchema);

export default { User, Account, Transaction };
