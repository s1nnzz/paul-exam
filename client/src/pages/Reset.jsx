import { useContext, useEffect } from "react";
import { useMutation } from "../apollo/hooks.js";
import { RESET_PASSWORD } from "../apollo/mutations.js";
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

	// GraphQL mutation
	const [resetPassword, { loading, error }] = useMutation(RESET_PASSWORD);

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

	const onSubmit = async (e) => {
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

		try {
			const { data } = await resetPassword({
				variables: { token, password },
			});

			if (data.resetPassword.success) {
				setFlash("Password reset successful!");
				navigate("/login");
			}
		} catch (err) {
			setFlash(err.message);
		}
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
