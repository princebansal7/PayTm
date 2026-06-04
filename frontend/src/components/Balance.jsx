import { useEffect, useState } from "react";
import axios from "axios";

export const Balance = ({ refreshTrigger = 0 }) => {
    const [balance, setBalance] = useState(null);
    useEffect(() => {
        const fetchBalance = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get(
                    "http://localhost:3000/api/v1/account/balance",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                setBalance(response.data.balance);
            } catch (error) {
                console.error("Error fetching balance:", error);
            }
        };
        fetchBalance();
    }, [refreshTrigger]);

    if (balance === null) return null;

    return (
        <div className="flex">
            <div className="font-bold text-lg">Your balance</div>
            <div className="font-semibold ml-4 text-lg">Rs {balance}</div>
        </div>
    );
};
