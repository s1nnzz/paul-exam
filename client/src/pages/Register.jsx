import { useMutation } from "../apollo/hooks.js";
import { REGISTER } from "../apollo/mutations.js";
import Form from "../components/common/Form";
import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { FlashContext } from "../contexts/FlashContext";

function Component() {
	const navigate = useNavigate();
	const { setFlash } = useContext(FlashContext);

	// GraphQL mutation
	const [register, { loading, error }] = useMutation(REGISTER);

	const formDetails = {
		Email: {
			Type: "email",
			Label: "Email",
		},
		ConfirmEmail: {
			Type: "email",
			Label: "Confirm Email",
		},
		Password: {
			Type: "password",
			Label: "Password",
		},
		ConfirmPassword: {
			Type: "password",
			Label: "Confirm Password",
		},
	};

	const onSubmit = async (e) => {
		e.preventDefault();
		const email = e.target.Email.value;
		const confirmemail = e.target.ConfirmEmail.value;
		const password = e.target.Password.value;
		const confirmpassword = e.target.ConfirmPassword.value;

		if (email != confirmemail) {
			setFlash("Email not the same as confirm email");
			return;
		}

		if (password != confirmpassword) {
			setFlash("Password not the same as confirm password");
			return;
		}

		try {
			const { data } = await register({
				variables: { email, password },
			});

			if (data.register.success) {
				setFlash("Registration successful! Please log in.");
				navigate("/login", { replace: true });
			}
		} catch (err) {
			setFlash(err.message);
		}
	};

	return (
		<>
			<Form FormDetails={formDetails} SubmitCallback={onSubmit}></Form>
			<Link to="/login">Already registered? Click here to log in.</Link>
		</>
	);
}

export default Component;
