import { Link } from "react-router-dom";
import { useContext } from "react";
import { useMutation } from "../apollo/hooks.js";
import { FORGOT_PASSWORD } from "../apollo/mutations.js";
import { AuthContext } from "../contexts/AuthContext";
import { FlashContext } from "../contexts/FlashContext";
import Form from "../components/common/Form";
import { useState } from "react";

function Forgot() {
	const authenticated = useContext(AuthContext);
	const { setFlash } = useContext(FlashContext);
	const [resetToken, setResetToken] = useState(null);
	const [email, setEmail] = useState("");

	// GraphQL mutation
	const [forgotPassword, { loading, error }] = useMutation(FORGOT_PASSWORD);

	const formDetails = {
		Email: {
			Type: "email",
			Label: "Email",
		},
	};

	const onSubmit = async (e) => {
		e.preventDefault();
		const email = e.target.Email.value;

		setEmail(email);

		try {
			const { data } = await forgotPassword({
				variables: { email },
			});

			if (data.forgotPassword.success) {
				setFlash("Password reset email sent");
				setResetToken(data.forgotPassword.resetToken);
			}
		} catch (err) {
			setFlash(err.message);
		}
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
