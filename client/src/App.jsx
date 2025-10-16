import {
    BrowserRouter as Router,
    Routes,
    Route
} from "react-router-dom"

import { AuthContext } from "./contexts/AuthContext"

import NotFound from "./pages/NotFound.jsx"

import Home from "./pages/Home.jsx"
import About from "./pages/About.jsx"
import Contact from "./pages/Contact.jsx"

import Login from "./pages/Login.jsx"
import Register from "./pages/Register.jsx"

import Profile from "./pages/Profile.jsx"

import Reset from "./pages/Reset.jsx"
import Forgot from "./pages/Forgot.jsx"

function AppContent() {

    return (
        <AuthContext.Provider value={false}>
            <Routes>
                <Route path="*" element={<NotFound/>} />

                <Route path="/" element={<Home />} />
                <Route path="/login" element = {<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/" element={<Profile />} />
                <Route path="/" element={<Reset />} />
                <Route path="/" element={<Forgot />} />
                <Route path="/" element={<About />} />
                <Route path="/" element={<Contact />} />
            </Routes>
        </AuthContext.Provider>
    )
}


function App() {
    return (
        <Router>
            <AppContent />
        </Router>
    )
}

export default App