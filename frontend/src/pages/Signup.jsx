import { Button } from "../components/Button";
import { SubHeading } from "../components/SubHeading";
import { Heading } from "../components/Heading";
import { InputBox } from "../components/InputBox";
import { BottomNote } from "../components/BottomNote";
import { AuthLayout } from "../components/AuthLayout";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export function Signup() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    return (
        <AuthLayout>
                <Heading label="Sign Up" />
                <SubHeading label="Enter below details to create a new account" />
                <form
                    onSubmit={async e => {
                        e.preventDefault();
                        setError("");
                        try {
                            const response = await axios.post(
                                "http://localhost:3000/api/v1/user/signup",
                                {
                                    firstName,
                                    lastName,
                                    username,
                                    password,
                                }
                            );
                            localStorage.setItem("token", response.data.token);
                            navigate("/dashboard");
                        } catch (err) {
                            const msg =
                                err.response?.data?.message ||
                                "Signup failed. Please try again.";
                            setError(msg);
                        }
                    }}
                >
                    <InputBox
                        onChange={e => setFirstName(e.target.value)}
                        field="First name"
                        placeholder="Prince"
                        type="text"
                    />
                    <InputBox
                        onChange={e => setLastName(e.target.value)}
                        field="Last name"
                        placeholder="Bansal"
                        type="text"
                    />
                    <InputBox
                        onChange={e => setUsername(e.target.value)}
                        field="Username"
                        placeholder="username / email"
                        type="text"
                        autocomplete="username"
                    />
                    <InputBox
                        onChange={e => setPassword(e.target.value)}
                        field="Password"
                        placeholder="********"
                        type="password"
                        autocomplete="new-password"
                    />
                    {error && (
                        <p className="text-red-500 text-sm text-center mb-2">
                            {error}
                        </p>
                    )}
                    <div className="mb-2">
                        <Button type="submit">Sign Up</Button>
                    </div>
                </form>
                <div className="py-2">
                    <BottomNote
                        label="Already registered?"
                        buttonText="Signin"
                        to="/signin"
                    />
                </div>
        </AuthLayout>
    );
}
