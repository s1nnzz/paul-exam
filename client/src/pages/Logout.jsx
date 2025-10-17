import Form from "../components/common/Form";
import { Link, Navigate } from "react-router-dom";

function Login() {
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
		});

	return (
		<>
			<Navigate to="/" />
		</>
	);
}

export default Login;
