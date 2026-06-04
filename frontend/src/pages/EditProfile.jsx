import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Card } from "../components/Card";
import { Heading } from "../components/Heading";
import { InputBox } from "../components/InputBox";
import { Button } from "../components/Button";

export function EditProfile() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [password, setPassword] = useState("");
    const [status, setStatus] = useState(null); // null | "success" | "error"
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get(
                    "http://localhost:3000/api/v1/user/me",
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                        },
                    }
                );
                setFirstName(response.data.user.firstName);
                setLastName(response.data.user.lastName || "");
            } catch {
                // proceed with empty fields
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, []);

    const handleSubmit = async e => {
        e.preventDefault();
        setStatus(null);

        const payload = {};
        if (firstName.trim()) payload.firstName = firstName.trim();
        if (lastName.trim()) payload.lastName = lastName.trim();
        if (password) payload.password = password;

        if (Object.keys(payload).length === 0) {
            setStatus("error");
            setMessage("Nothing to update.");
            return;
        }

        try {
            await axios.put(
                "http://localhost:3000/api/v1/user/",
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );
            setStatus("success");
            setMessage("Profile updated successfully!");
            setPassword("");
        } catch (err) {
            setStatus("error");
            setMessage(
                err.response?.data?.msg || "Update failed. Please try again."
            );
        }
    };

    if (loading) return null;

    return (
        <Card>
            <button
                onClick={() => navigate("/dashboard")}
                className="self-start text-sm text-gray-500 hover:text-gray-800 flex items-center gap-1 mb-2 w-full text-left"
            >
                ← Back to Dashboard
            </button>
            <Heading label="Edit Profile" />
            <form onSubmit={handleSubmit}>
                <InputBox
                    field="First name"
                    placeholder="First name"
                    type="text"
                    onChange={e => setFirstName(e.target.value)}
                    value={firstName}
                />
                <InputBox
                    field="Last name"
                    placeholder="Last name"
                    type="text"
                    onChange={e => setLastName(e.target.value)}
                    value={lastName}
                />
                <InputBox
                    field="New password"
                    placeholder="Leave blank to keep current"
                    type="password"
                    onChange={e => setPassword(e.target.value)}
                    autocomplete="new-password"
                />
                {status === "success" && (
                    <p className="text-green-600 text-sm mt-3 font-medium">
                        {message}
                    </p>
                )}
                {status === "error" && (
                    <p className="text-red-500 text-sm mt-3 font-medium">
                        {message}
                    </p>
                )}
                <div className="mt-4">
                    <Button type="submit">Save Changes</Button>
                </div>
            </form>
        </Card>
    );
}
