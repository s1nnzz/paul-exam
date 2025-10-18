import { useEffect, useContext } from "react";
import Form from "../components/common/Form";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { FlashContext } from "../contexts/FlashContext";

function Login() {
	const nav = useNavigate();
	const { setFlash } = useContext(FlashContext);

	useEffect(() => {
		fetch("/api/logout", {
			method: "POST",
			credentials: "include",
			headers: {
				"Content-Type": "application/json",
			},
		})
			.then((res) => res.json())
			.then((json) => {
				console.log(json);
				setFlash("You have been logged out successfully");
				nav("/", { replace: true });
			});
	});

	return (
		<>
			<h1>Logging you out...</h1>
		</>
	);
}

export default Login;
