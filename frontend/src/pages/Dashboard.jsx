import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { AppBar } from "../components/AppBar";
import { Balance } from "../components/Balance";
import { UserFilter } from "../components/UserFilter";
import { TransactionHistory } from "../components/TransactionHistory";
import { SendMoneyModal } from "../components/SendMoneyModal";

export function Dashboard() {
    const [currentUserId, setCurrentUserId] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null); // { id, name }
    const [balanceKey, setBalanceKey] = useState(0);
    const [txnKey, setTxnKey] = useState(0);

    useEffect(() => {
        try {
            const token = localStorage.getItem("token");
            if (token) {
                const decoded = jwtDecode(token);
                setCurrentUserId(decoded.userId);
            }
        } catch {
            // invalid token, auth guard will handle redirect
        }
    }, []);

    const handleTransferSuccess = () => {
        setBalanceKey(k => k + 1);
        setTxnKey(k => k + 1);
    };

    return (
        <>
            <AppBar />
            <div className="m-8">
                <Balance refreshTrigger={balanceKey} />
                <UserFilter onSendMoney={(id, name) => setSelectedUser({ id, name })} />
                <TransactionHistory key={txnKey} currentUserId={currentUserId} />
            </div>

            {selectedUser && (
                <SendMoneyModal
                    user={selectedUser}
                    onClose={() => setSelectedUser(null)}
                    onSuccess={handleTransferSuccess}
                />
            )}
        </>
    );
}
