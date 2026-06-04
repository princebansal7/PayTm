import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const AppBar = () => {
    const [user, setUser] = useState({ firstName: "", lastName: "" });
    const [showLogout, setShowLogout] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) return;
                const response = await axios.get(
                    "http://localhost:3000/api/v1/user/me",
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
                setUser(response.data.user);
            } catch (e) {
                console.error("Failed to fetch user info for AppBar:", e);
            }
        };
        fetchUser();
    }, []);

    useEffect(() => {
        const handleClickOutside = e => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setShowLogout(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/signin");
    };

    const initials =
        (user.firstName ? user.firstName[0].toUpperCase() : "") +
        (user.lastName ? user.lastName[0].toUpperCase() : "");

    return (
        <div className="shadow h-14 flex bg-slate-200 rounded mx-1 justify-between">
            <div className="flex flex-col font-extrabold justify-center h-full ml-4">
                MoneyMate App
            </div>
            <div className="flex items-center">
                <div className="flex flex-col justify-center h-full mr-4">
                    {user.firstName} {user.lastName}
                </div>
                <div className="relative mr-2" ref={dropdownRef}>
                    <div
                        className="rounded-full h-12 w-12 bg-black flex justify-center items-center cursor-pointer"
                        onClick={() => setShowLogout(prev => !prev)}
                    >
                        <span className="text-white text-xl">{initials || "U"}</span>
                    </div>
                    {showLogout && (
                        <div className="absolute right-0 mt-1 w-36 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                            <button
                                onClick={() => { setShowLogout(false); navigate("/profile"); }}
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-t-lg"
                            >
                                Edit Profile
                            </button>
                            <hr className="border-gray-100" />
                            <button
                                onClick={handleLogout}
                                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 rounded-b-lg"
                            >
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
