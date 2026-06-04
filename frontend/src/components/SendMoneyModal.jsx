import { useEffect, useState } from "react";
import axios from "axios";

export function SendMoneyModal({ user, onClose, onSuccess }) {
    const [amount, setAmount] = useState("");
    const [status, setStatus] = useState(null); // null | "success" | "error"
    const [message, setMessage] = useState("");
    const [balance, setBalance] = useState(null);

    useEffect(() => {
        const fetchBalance = async () => {
            try {
                const response = await axios.get(
                    "http://localhost:3000/api/v1/account/balance",
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                        },
                    }
                );
                setBalance(response.data.balance);
            } catch {
                // silently skip
            }
        };
        fetchBalance();
    }, []);

    // Close on Escape key
    useEffect(() => {
        const handleKey = e => { if (e.key === "Escape") onClose(); };
        document.addEventListener("keydown", handleKey);
        return () => document.removeEventListener("keydown", handleKey);
    }, [onClose]);

    const handleTransfer = async () => {
        setStatus(null);
        try {
            await axios.post(
                "http://localhost:3000/api/v1/account/transaction",
                { sendToUserId: user.id, amount },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );
            setStatus("success");
            setMessage(`Rs ${parseFloat(amount)} sent to ${user.name} successfully!`);
            onSuccess();
        } catch (err) {
            const serverMsg = err.response?.data?.msg || "";
            setStatus("error");
            setMessage(
                serverMsg.toLowerCase().includes("insufficient")
                    ? "Insufficient balance. Please enter a lower amount."
                    : serverMsg || "Transfer failed. Please try again."
            );
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
            onClick={e => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-5">
                    <h2 className="text-xl font-bold">Send Money</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-700 text-2xl leading-none"
                    >
                        ×
                    </button>
                </div>

                {/* Your balance */}
                {balance !== null && (
                    <div className="flex items-center justify-between bg-slate-50 rounded-lg px-4 py-2 mb-5">
                        <span className="text-sm text-gray-500">Your balance</span>
                        <span className="text-sm font-semibold text-gray-800">Rs {balance}</span>
                    </div>
                )}

                {/* Recipient */}
                <div className="mb-5">
                    <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">Sending to</p>
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center text-white text-lg font-semibold">
                            {user.name[0].toUpperCase()}
                        </div>
                        <p className="font-semibold text-gray-800">{user.name}</p>
                    </div>
                </div>

                {/* Amount input */}
                <div className="mb-4">
                    <label className="text-sm font-medium text-gray-700 block mb-1">
                        Amount (in Rs)
                    </label>
                    <input
                        type="number"
                        placeholder="Enter amount"
                        value={amount}
                        onChange={e => setAmount(e.target.value)}
                        className="w-full h-10 px-3 py-2 text-sm border border-stone-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300"
                        autoFocus
                    />
                </div>

                {/* Feedback */}
                {status === "success" && (
                    <p className="text-green-600 text-sm text-center font-medium mb-3">
                        {message}
                    </p>
                )}
                {status === "error" && (
                    <p className="text-red-500 text-sm text-center font-medium mb-3">
                        {message}
                    </p>
                )}

                {/* Actions */}
                <div className="flex gap-2 mt-1">
                    {status === "success" ? (
                        <button
                            onClick={onClose}
                            className="w-full h-10 rounded-lg bg-green-500 hover:bg-green-600 text-white text-sm font-medium"
                        >
                            Done
                        </button>
                    ) : (
                        <>
                            <button
                                onClick={onClose}
                                className="w-1/3 h-10 rounded-lg border border-gray-300 text-sm font-medium text-gray-600 hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleTransfer}
                                className="w-2/3 h-10 rounded-lg bg-green-500 hover:bg-green-600 text-white text-sm font-medium"
                            >
                                Initiate Transfer
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
