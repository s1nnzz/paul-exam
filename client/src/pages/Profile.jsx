import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { Navigate, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

function Component() {
	const [userData, setUserData] = useState({});
	const authenticated = useContext(AuthContext);
	const navigate = useNavigate();

	useEffect(() => {
		if (!authenticated.loading) {
			if (!authenticated.authenticated) {
				navigate("/", { replace: true });
			}
		}

		fetch("/api/userdata", {
			method: "POST",
			headers: {
				ContentType: "application/json",
			},
			credentials: "include",
		})
			.then((res) => res.json())
			.then((json) => {
				console.log(json.message);
				console.log(json.userdata);
				setUserData(json.userdata);
			});
	}, [authenticated]);

	return (
		<>
			<h1>Welcome to your profile</h1>
			<h2>Email {userData.email}</h2>
			<h2>Your user Id is {userData.id}</h2>

			<Link to="/logout">Logout</Link>
			<Link to="/delete">Delete Account</Link>
		</>
	);
}

export default Component;
