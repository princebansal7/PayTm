import { useEffect, useState } from "react";
import { Users } from "./Users";
import axios from "axios";

export const UserFilter = ({ onSendMoney }) => {
    // Replace with backend call
    const [users, setUsers] = useState([]);
    const [filter, setFilter] = useState("");
    const [debouncedFilter, setDebouncedFilter] = useState(filter);

    useEffect(() => {
        // Apply debouncing
        const handler = setTimeout(() => {
            setDebouncedFilter(filter);
        }, 500); // Adjust the delay (500ms) as needed

        // Cleanup function to clear the timeout if the effect is re-triggered
        return () => {
            clearTimeout(handler);
        };
    }, [filter]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const token = localStorage.getItem("token");
                const url = debouncedFilter
                    ? `http://localhost:3000/api/v1/user/list-user?filter=${debouncedFilter}`
                    : `http://localhost:3000/api/v1/user/list-user`;
                const response = await axios.get(url, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setUsers(response.data.usersArr);
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };
        fetchUsers();
    }, [debouncedFilter]);

    return (
        <>
            <div className="mt-6 mb-2 ">
                <input
                    onChange={e => setFilter(e.target.value)}
                    type="text"
                    placeholder="Search users..."
                    className="w-full px-2 py-1 border rounded border-slate-200"
                ></input>
            </div>
            <div className="font-bold my-4 text-lg">Users</div>
            <div>
                {users.map(user => (
                    <Users user={user} key={user._id} onSendMoney={onSendMoney} />
                ))}
            </div>
        </>
    );
};
