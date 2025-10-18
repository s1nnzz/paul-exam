import {
	BrowserRouter as Router,
	Routes,
	Route,
	useLocation,
} from "react-router-dom";

import { AuthContext } from "./contexts/AuthContext";
import { FlashProvider } from "./contexts/FlashContext.jsx";

import NotFound from "./pages/NotFound.jsx";

import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import Contact from "./pages/Contact.jsx";

import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";

import Profile from "./pages/Profile.jsx";

import Reset from "./pages/Reset.jsx";
import Forgot from "./pages/Forgot.jsx";

import Logout from "./pages/Logout.jsx";
import Delete from "./pages/Delete.jsx";

import Nav from "./components/common/Nav.jsx";
import Flash from "./components/common/Flash.jsx";

import "./style.css";
import { useEffect, useState } from "react";

function AppContent() {
	const [auth, setAuth] = useState(false);
	const [authLoading, setAuthLoading] = useState(true);
	let location = useLocation();

	useEffect(() => {
		setAuthLoading(true);
		fetch("/api/isauth", {
			method: "POST",
			headers: {
				ContentType: "application/json",
			},
			credentials: "include",
		})
			.then((res) => res.json())
			.then((json) => {
				setAuth(json.authenticated);
				setAuthLoading(false);
				console.log(`Auth status: ${json.authenticated}`);
			});
	}, [location]);

	return (
		<AuthContext.Provider
			value={{ authenticated: auth, loading: authLoading }}
		>
			<Nav />
			<Flash />
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/login" element={<Login />} />
				<Route path="/register" element={<Register />} />
				<Route path="/profile" element={<Profile />} />
				<Route path="/reset" element={<Reset />} />
				<Route path="/forgot" element={<Forgot />} />
				<Route path="/about" element={<About />} />
				<Route path="/contact" element={<Contact />} />
				<Route path="/logout" element={<Logout />} />
				<Route path="/delete" element={<Delete />} />
				<Route path="*" element={<NotFound />} />
			</Routes>
		</AuthContext.Provider>
	);
}

function App() {
	return (
		<Router>
			<FlashProvider>
				<AppContent />
			</FlashProvider>
		</Router>
	);
}

export default App;
