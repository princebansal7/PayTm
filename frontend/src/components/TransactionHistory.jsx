import { useEffect, useRef, useState } from "react";
import axios from "axios";

const COOLDOWN_SECS = 30;

const formatIST = dateStr =>
    new Date(dateStr).toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
    });

const fetchPage = async (skip) => {
    const response = await axios.get(
        `http://localhost:3000/api/v1/account/transactions?skip=${skip}`,
        {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        }
    );
    return response.data; // { transactions, hasMore }
};

export const TransactionHistory = ({ currentUserId }) => {
    const [transactions, setTransactions] = useState([]);
    const [hasMore, setHasMore] = useState(false);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [cooldown, setCooldown] = useState(0);
    const timerRef = useRef(null);

    const loadInitial = async ({ showLoader = false } = {}) => {
        if (showLoader) setRefreshing(true);
        try {
            const { transactions: txns, hasMore: more } = await fetchPage(0);
            setTransactions(txns);
            setHasMore(more);
        } catch {
            // silently skip
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const loadMore = async () => {
        if (loadingMore) return;
        setLoadingMore(true);
        try {
            const { transactions: txns, hasMore: more } = await fetchPage(transactions.length);
            setTransactions(prev => [...prev, ...txns]);
            setHasMore(more);
        } catch {
            // silently skip
        } finally {
            setLoadingMore(false);
        }
    };

    const handleRefresh = () => {
        if (cooldown > 0) return;
        loadInitial({ showLoader: true });
        setCooldown(COOLDOWN_SECS);
        timerRef.current = setInterval(() => {
            setCooldown(prev => {
                if (prev <= 1) {
                    clearInterval(timerRef.current);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    useEffect(() => {
        loadInitial();
        return () => clearInterval(timerRef.current);
    }, []);

    if (loading) return null;

    return (
        <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
                <div className="font-bold text-lg">Transaction History</div>
                <button
                    onClick={handleRefresh}
                    disabled={cooldown > 0 || refreshing}
                    className={`text-xs px-3 py-1 rounded-lg border font-medium transition-colors ${
                        cooldown > 0 || refreshing
                            ? "border-gray-200 text-gray-400 cursor-not-allowed bg-gray-50"
                            : "border-slate-400 text-slate-600 hover:bg-slate-100"
                    }`}
                >
                    {refreshing ? "Refreshing…" : cooldown > 0 ? `Refresh (${cooldown}s)` : "↻ Refresh"}
                </button>
            </div>

            {transactions.length === 0 ? (
                <p className="text-sm text-gray-400">No transactions yet.</p>
            ) : (
                <>
                    <div className="flex flex-col gap-3">
                        {transactions.map(txn => {
                            const isSent = txn.fromUserId._id === currentUserId;
                            const other = isSent ? txn.toUserId : txn.fromUserId;
                            const otherName = `${other.firstName} ${other.lastName || ""}`.trim();

                            return (
                                <div
                                    key={txn._id}
                                    className="flex items-center justify-between bg-white rounded-xl px-4 py-3 shadow-sm border border-gray-100"
                                >
                                    <div className="flex items-center gap-3">
                                        <div
                                            className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-semibold ${
                                                isSent ? "bg-red-400" : "bg-green-500"
                                            }`}
                                        >
                                            {isSent ? "↑" : "↓"}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-800">
                                                {isSent ? `Sent to ${otherName}` : `Received from ${otherName}`}
                                            </p>
                                            <p className="text-xs text-gray-400">
                                                {formatIST(txn.createdAt)}
                                            </p>
                                        </div>
                                    </div>
                                    <div
                                        className={`text-sm font-semibold ${
                                            isSent ? "text-red-500" : "text-green-600"
                                        }`}
                                    >
                                        {isSent ? "-" : "+"}Rs {txn.amount}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {hasMore && (
                        <button
                            onClick={loadMore}
                            disabled={loadingMore}
                            className="w-full mt-4 py-2 text-sm font-medium text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {loadingMore ? "Loading…" : "Show more"}
                        </button>
                    )}
                </>
            )}
        </div>
    );
};
