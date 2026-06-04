import { Navigate } from "react-router-dom";

export function RequireAuth({ children }) {
    const token = localStorage.getItem("token");
    if (!token) return <Navigate to="/signin" replace />;
    return children;
}

export function RedirectIfAuthed({ children }) {
    const token = localStorage.getItem("token");
    if (token) return <Navigate to="/dashboard" replace />;
    return children;
}
