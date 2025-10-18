import { useContext, useEffect } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { FlashContext } from "../contexts/FlashContext";
import Form from "../components/common/Form";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Link } from "react-router-dom";

function Reset() {
	const authenticated = useContext(AuthContext);
	const { setFlash } = useContext(FlashContext);
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
			setFlash("Passwords do not match");
			return;
		}

		if (!token) {
			setFlash("Invalid reset token");
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
					setFlash("Password reset successful!");
					navigate("/login");
				} else if (res.status === 400) {
					setFlash("Invalid or expired reset token");
				}
				return res.json();
			})
			.then((json) => {
				console.log(json);
				if (json.message) {
					setFlash(json.message);
				}
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
