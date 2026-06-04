import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Signup } from "./pages/Signup";
import { Signin } from "./pages/Signin";
import { Dashboard } from "./pages/Dashboard";
import { TransferMoney } from "./pages/TransferMoney";
import { EditProfile } from "./pages/EditProfile";
import { RequireAuth, RedirectIfAuthed } from "./components/AuthGuard";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<RedirectIfAuthed><Signup /></RedirectIfAuthed>} />
                <Route path="/signup" element={<RedirectIfAuthed><Signup /></RedirectIfAuthed>} />
                <Route path="/signin" element={<RedirectIfAuthed><Signin /></RedirectIfAuthed>} />
                <Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
                <Route path="/send" element={<RequireAuth><TransferMoney /></RequireAuth>} />
                <Route path="/profile" element={<RequireAuth><EditProfile /></RequireAuth>} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
