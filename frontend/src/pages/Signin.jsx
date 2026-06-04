import { Button } from "../components/Button";
import { SubHeading } from "../components/SubHeading";
import { Heading } from "../components/Heading";
import { InputBox } from "../components/InputBox";
import { BottomNote } from "../components/BottomNote";
import { AuthLayout } from "../components/AuthLayout";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export function Signin() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    return (
        <AuthLayout>
                <Heading label="Sign In" />
                <SubHeading label="Enter below details to access your account" />
                <form
                    onSubmit={async e => {
                        e.preventDefault();
                        setError("");
                        try {
                            const response = await axios.post(
                                "http://localhost:3000/api/v1/user/signin",
                                { username, password }
                            );
                            localStorage.setItem("token", response.data.token);
                            navigate("/dashboard");
                        } catch (err) {
                            setError(
                                err.response?.data?.message ||
                                    "Sign in failed. Please try again."
                            );
                        }
                    }}
                >
                    <InputBox
                        onChange={e => setUsername(e.target.value)}
                        field="Username"
                        placeholder="princebansal_"
                        type="text"
                        autocomplete="username"
                    />
                    <InputBox
                        onChange={e => setPassword(e.target.value)}
                        field="Password"
                        placeholder="********"
                        type="password"
                        autocomplete="current-password"
                    />
                    {error && (
                        <p className="text-red-500 text-sm text-center mb-2">
                            {error}
                        </p>
                    )}
                    <div className="mb-2">
                        <Button type="submit">Sign In</Button>
                    </div>
                </form>
                <div className="mt-1">
                    <BottomNote
                        label="Forgot password?"
                        buttonText="Reset"
                        to="/reset"
                    />
                </div>
                <div className="mt-1 pb-2">
                    <BottomNote
                        label="New user?"
                        buttonText="Signup"
                        to="/signup"
                    />
                </div>
        </AuthLayout>
    );
}
