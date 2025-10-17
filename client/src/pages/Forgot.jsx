import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import Form from "../components/common/Form";
import { useState } from "react";

function Forgot() {
	const authenticated = useContext(AuthContext);
	const [resetToken, setResetToken] = useState(null);
	const [email, setEmail] = useState("");

	const formDetails = {
		Email: {
			Type: "email",
			Label: "Email",
		},
	};

	const onSubmit = (e) => {
		e.preventDefault();
		const email = e.target.Email.value;

		setEmail(email);

		fetch("/api/forgot", {
			method: "POST",
			credentials: "include",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				email,
			}),
		})
			.then((res) => {
				if (res.status === 200) {
					console.log("Password reset email sent");
				}
				return res.json();
			})
			.then((json) => {
				console.log(json);
				if (json.resetToken) {
					setResetToken(json.resetToken);
				}
			});
	};

	return (
		<>
			<Form FormDetails={formDetails} SubmitCallback={onSubmit}></Form>

			{resetToken && (
				<div>
					<p>Reset link (prototype mode):</p>
					<Link to={`/reset?email=${email}&token=${resetToken}`}>
						Reset Your Password
					</Link>
				</div>
			)}

			<Link to="/login">Back to Sign In</Link>
		</>
	);
}

export default Forgot;
