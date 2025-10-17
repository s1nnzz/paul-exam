import { useContext, useEffect } from "react";
import { AuthContext } from "../contexts/AuthContext";
import Form from "../components/common/Form";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Link } from "react-router-dom";

function Reset() {
	const authenticated = useContext(AuthContext);
	const navigate = useNavigate();

	const [searchParams] = useSearchParams();
	const email = searchParams.get("email");
	const token = searchParams.get("token");

	const formDetails = {
		Password: {
			Type: "password",
			Label: "New Password",
		},
		ConfirmPassword: {
			Type: "password",
			Label: "Confirm Password",
		},
	};

	const onSubmit = (e) => {
		e.preventDefault();
		const password = e.target.Password.value;
		const confirmPassword = e.target.ConfirmPassword.value;

		if (password !== confirmPassword) {
			alert("Passwords do not match");
			return;
		}

		if (!token) {
			alert("Invalid reset token");
			return;
		}

		fetch("/api/reset", {
			method: "POST",
			credentials: "include",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				token,
				password,
			}),
		})
			.then((res) => {
				if (res.status === 200) {
					alert("Password reset successful!");
					navigate("/login");
				} else if (res.status === 400) {
					alert("Invalid or expired reset token");
				}
				return res.json();
			})
			.then((json) => {
				console.log(json);
			});
	};

	return (
		<>
			<h2>Reset Password for: {email}</h2>
			<Form FormDetails={formDetails} SubmitCallback={onSubmit}></Form>
			<Link to="/forgot">Request new reset link</Link>
		</>
	);
}

export default Reset;
