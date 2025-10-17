import { useContext, useEffect } from "react";
import Form from "../components/common/Form";
import { Link } from "react-router-dom";
import { Navigate, useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

function Login() {
	const authenticated = useContext(AuthContext);
	const nav = useNavigate();

	const formDetails = {
		Email: {
			Type: "email",
			Label: "Email",
		},
		Password: {
			Type: "password",
			Label: "Password",
		},
	};

	const onSubmit = (e) => {
		e.preventDefault();
		const email = e.target.Email.value;
		const password = e.target.Password.value;

		console.log(email, password);

		const res = fetch("/api/login", {
			method: "POST",
			credentials: "include",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				email,
				password,
			}),
		})
			.then((res) => {
				if (res.status === 200) {
					nav("/", { replace: true });
				}
				return res.json();
			})
			.then((json) => {
				console.log(json);
			});
	};

	return (
		<>
			<Form FormDetails={formDetails} SubmitCallback={onSubmit}></Form>
			<Link to="/register">No account? Register here</Link>
			<Link to="/forgot">Want to reset your password? Click here</Link>
		</>
	);
}

export default Login;
